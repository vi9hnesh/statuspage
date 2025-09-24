import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { lookupStatusPageByDomain } from '@/lib/fetcher'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const url = req.nextUrl.clone()
  const fullHostname = req.headers.get('host') || ''
  
  // Strip port from hostname for domain lookup
  const hostname = fullHostname.split(':')[0]
  
  // Skip middleware for localhost and default domains
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1')
  const isDefaultDomain = hostname.includes('vercel.app') || hostname.includes('netlify.app')
  
  // If this is a custom domain (not localhost, not default domain)
  if (!isLocalhost && !isDefaultDomain && hostname && !hostname.includes('warrn.io')) {
    // Don't rewrite auth routes - let them work normally
    if (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/api/')) {
      return NextResponse.next()
    }
    
    try {
      // Look up the status page by custom domain (without port)
      const domainLookup = await lookupStatusPageByDomain(hostname)
      
      if (domainLookup.exists && domainLookup.slug) {
        // Rewrite root path to the status page slug
        if (url.pathname === '/') {
          url.pathname = `/${domainLookup.slug}`
          return NextResponse.rewrite(url)
        } else if (url.pathname === `/${domainLookup.slug}`) {
          // If someone directly accesses the slug path on a custom domain, allow it
          return NextResponse.next()
        } else {
          // For other paths on custom domains, redirect to root
          url.pathname = '/'
          return NextResponse.redirect(url)
        }
      } else {
        // Custom domain doesn't match any status page
        // Redirect to main Warrn site
        return NextResponse.redirect('https://warrn.io/status-pages')
      }
    } catch (error) {
      console.error('Error looking up custom domain:', error)
      // On error, redirect to main site
      return NextResponse.redirect('https://warrn.io/status-pages')
    }
  }
  
  // Continue with normal Clerk middleware for regular domains
  // Don't protect public routes or API routes
  // Clerk auth will be handled conditionally in the page components
  // based on whether the status page is public or private
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
