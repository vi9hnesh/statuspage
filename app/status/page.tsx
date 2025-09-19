import { StatusBanner } from "@/components/status/status-banner"
import { ComponentsListEnhanced } from "@/components/status/components-list-enhanced"
import { IncidentFeed } from "@/components/status/incident-feed"

export const dynamic = "force-static"

export default function StatusPage() {
  return (
    <main className="min-h-dvh">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="mx-auto max-w-5xl px-4 py-4 md:py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block size-6 rounded-md bg-foreground/90" aria-hidden />
            <span className="font-semibold">Acme Status</span>
          </div>
          <nav aria-label="Status navigation">
            <ul className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors">
                <a href="#active-incidents">Incidents</a>
              </li>
              <li className="hover:text-foreground transition-colors">
                <a href="#components">Components</a>
              </li>
              <li className="hover:text-foreground transition-colors">
                <a href="#resolved">Resolved</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Overall status banner */}
      <section aria-labelledby="overall-status">
        <StatusBanner />
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-6 md:pt-10 space-y-8">
        {/* 1) Active incidents first */}
        <div id="active-incidents" className="scroll-mt-20">
          <IncidentFeed mode="active" />
        </div>

        {/* 2) Components next */}
        <div id="components" className="scroll-mt-20">
          <ComponentsListEnhanced />
        </div>

        {/* 3) Resolved incidents last */}
        <div id="resolved" className="scroll-mt-20">
          <IncidentFeed mode="resolved" />
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted-foreground">
          <p className="text-center">Powered by Next.js on Vercel · This page auto-refreshes periodically.</p>
        </div>
      </footer>
    </main>
  )
}
