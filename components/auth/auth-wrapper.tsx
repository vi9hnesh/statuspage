"use client"

import { useAuth, SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface AuthWrapperProps {
  children: ReactNode
  requiresAuth: boolean
  statusPageName?: string
}

export function AuthWrapper({ children, requiresAuth, statusPageName }: AuthWrapperProps) {
  const { isSignedIn, isLoaded } = useAuth()

  // If no auth required, render children directly
  if (!requiresAuth) {
    return <>{children}</>
  }

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show sign-in if not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#F8F8F8]">
        <div className="w-full max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-muted-foreground font-sans">
              {statusPageName ? `"${statusPageName}"` : 'This status page'} is a private status page and requires authentication.
            </p>
          </div>
          <div className="flex justify-center">
            <ClerkLoaded>
              <SignIn 
                routing="hash"
                signUpUrl="https://app.warrn.io/sign-up"
                appearance={{
                  elements: {
                    cardBox: "border-0",
                    // footer: "hidden",
                    card: "border-0 bg-white dark:bg-black",
                    formButtonPrimary: "rounded-lg p-3 bg-black hover:bg-gray-800 text-white",
                    input: "rounded-lg p-3 border border-gray-300",
                    button: "rounded-lg p-3",
                  }
                }}
              />
            </ClerkLoaded>
            <ClerkLoading>
              <div className="text-center py-8 w-full max-w-sm">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading authentication...</p>
              </div>
            </ClerkLoading>
          </div>
        </div>
      </div>
    )
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}
