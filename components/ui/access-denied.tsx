import { Shield } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface AccessDeniedProps {
  statusPageName?: string
  message?: string
}

export function AccessDenied({ statusPageName, message }: AccessDeniedProps) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50/50">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-10">
            {message || `You don't have permission to view ${statusPageName ? `"${statusPageName}"` : 'this status page'}.`}
          </p>
          <p className="text-sm text-gray-500">
            This status page is private and only accessible to members of the organization that owns it.
          </p>
        </div>

        <footer className="mt-12">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Powered by</span>
            <Link
              href="https://warrn.io/status-pages"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <Image 
                src="/logo/light.svg" 
                alt="Warrn" 
                width={60}
                height={20}
                className="h-5 opacity-60"
              />
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
