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
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {statusData.logo_url ? (
            <Image 
              src={statusData.logo_url} 
              alt="Logo" 
              width={32}
              height={32}
              className="size-8 rounded-md object-contain"
            />
          ) : (
            <div className="size-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {statusData.name ? statusData.name.charAt(0).toUpperCase() : "S"}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              {statusData.name || "Status Page"}
            </h1>
            <p className="text-sm text-muted-foreground">
              System status and performance
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={() => {
              // TODO: Implement subscription modal/functionality
              alert('Subscription feature coming soon!')
            }}
            className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            Subscribe to updates
          </button>
        </div>
      </div>
    </header>
  )
}
