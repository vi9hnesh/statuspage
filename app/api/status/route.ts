import { NextResponse } from "next/server"

// Enhanced status data with battery-style components. Replace with your backend later.
export async function GET() {
  const components = [
    {
      id: "api",
      name: "API",
      status: "operational",
      description: "REST + Webhooks",
      group: "Core",
      uptime90d: 100,
    },
    {
      id: "alerts",
      name: "Alerts",
      status: "operational",
      description: "Alert management system",
      group: "Core",
      uptime90d: 100,
    },
    {
      id: "oncall",
      name: "On-call notifications",
      status: "operational",
      description: "Notification routing",
      group: "Core",
      uptime90d: 99.96,
      subComponents: [
        { id: "oncall-email", name: "Email notifications", status: "operational", uptime90d: 100 },
        { id: "oncall-sms", name: "SMS notifications", status: "operational", uptime90d: 99.95 },
        { id: "oncall-push", name: "Push notifications", status: "degraded", uptime90d: 99.87 },
        { id: "oncall-webhook", name: "Webhook notifications", status: "operational", uptime90d: 100 },
        { id: "oncall-slack", name: "Slack notifications", status: "operational", uptime90d: 99.99 },
      ]
    },
    {
      id: "dashboard",
      name: "Dashboard",
      status: "operational",
      description: "Admin web app",
      group: "Apps",
      uptime90d: 99.98,
    },
    {
      id: "insights",
      name: "Insights",
      status: "operational",
      description: "Analytics and reporting",
      group: "Apps",
      uptime90d: 99.95,
    },
    {
      id: "mobile",
      name: "Mobile app",
      status: "operational",
      description: "iOS and Android apps",
      group: "Apps",
      uptime90d: 99.97,
    },
    {
      id: "slack",
      name: "Slack app",
      status: "operational",
      description: "Slack integration",
      group: "Integrations",
      uptime90d: 99.94,
    },
    {
      id: "teams",
      name: "Microsoft Teams app",
      status: "operational",
      description: "Teams integration",
      group: "Integrations",
      uptime90d: 100,
    },
    {
      id: "integrations",
      name: "Integrations",
      status: "operational",
      description: "Third-party integrations",
      group: "Integrations",
      uptime90d: 99.92,
      subComponents: Array.from({ length: 22 }, (_, i) => ({
        id: `integration-${i + 1}`,
        name: `Integration ${i + 1}`,
        status: (i === 5 || i === 15) ? "degraded" : "operational",
        uptime90d: (i === 5) ? 99.85 : (i === 15) ? 99.92 : 100
      }))
    },
    {
      id: "statuspages",
      name: "Status pages",
      status: "operational",
      description: "Public status pages",
      group: "Public",
      uptime90d: 100,
    },
    {
      id: "website",
      name: "Website",
      status: "operational",
      description: "Marketing website",
      group: "Public",
      uptime90d: 100,
    },
  ] as const

  const hasOutage = components.some((c) => c.status === "outage")
  const hasIssues = components.some((c) => c.status === "degraded" || c.status === "maintenance")
  const severity = hasOutage ? "major" : hasIssues ? "minor" : "none"

  const overall = hasOutage ? "outage" : hasIssues ? "degraded" : "operational"

  const summary =
    overall === "operational"
      ? "All systems operational."
      : overall === "degraded"
        ? "Some components are experiencing issues."
        : "A subset of services are unavailable."

  const affectedComponentIds = components.filter((c) => c.status !== "operational").map((c) => c.id)
  const lastUpdated = new Date().toISOString()

  return NextResponse.json({
    // existing fields for compatibility
    overallStatus: overall,
    summary,
    components,
    lastUpdatedISO: lastUpdated,
    // new enriched fields used by scoped components
    allOperational: overall === "operational",
    severity,
    affectedComponentIds,
    lastUpdated,
  })
}
