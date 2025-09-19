"use client"

import { useStatusPageData } from "./status-page-provider"
import type { StatusSummary } from "./types"
import Image from "next/image"

interface StatusPageHeaderProps {
  slug: string
}

export function StatusPageHeader({ slug }: StatusPageHeaderProps) {
  const { statusData } = useStatusPageData()

  return (
    <header className="bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-12 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          {statusData.logo_url ? (
            <Image 
              src={statusData.logo_url} 
              alt="Logo" 
              width={32}
              height={32}
              className="size-6 md:size-8 rounded-md object-contain flex-shrink-0"
            />
          ) : (
            <div className="size-6 md:size-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs md:text-sm">
                {statusData.name ? statusData.name.charAt(0).toUpperCase() : "S"}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg md:text-2xl font-semibold truncate">
              {statusData.name || "Status Page"}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
              System status and performance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={() => {
              // TODO: Implement subscription modal/functionality
              alert('Subscription feature coming soon!')
            }}
            className="px-3 py-2 text-xs md:text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            <span className="hidden sm:inline">Subscribe to updates</span>
            <span className="sm:hidden">Subscribe</span>
          </button>
        </div>
      </div>
    </header>
  )
}
