import { NextResponse } from "next/server"

// Mocked incidents feed. Replace with your backend later.
export async function GET() {
  const now = new Date()
  const minus = (mins: number) => new Date(now.getTime() - mins * 60_000).toISOString()

  const active = [
    {
      id: "inc_123",
      title: "Elevated errors on Dashboard",
      status: "investigating",
      severity: "minor",
      affectedComponents: ["dashboard"],
      startedAt: minus(42),
      updates: [
        { at: minus(40), text: "We are investigating reports of increased error rates." },
        { at: minus(15), text: "Narrowed to a dependency rollout; rollback in progress." },
      ],
    },
  ]

  const resolved = [
    {
      id: "inc_122",
      title: "API latency spikes in us-east-1",
      status: "resolved",
      severity: "minor",
      affectedComponents: ["api"],
      startedAt: minus(60 * 26),
      resolvedAt: minus(60 * 20),
      updates: [
        { at: minus(60 * 26), text: "Investigating elevated API latencies." },
        { at: minus(60 * 24), text: "Identified increased load; scaled up capacity." },
        { at: minus(60 * 20), text: "Latency returned to normal; marking resolved." },
      ],
    },
    {
      id: "inc_121",
      title: "Auth maintenance window",
      status: "resolved",
      severity: "minor",
      affectedComponents: ["auth"],
      startedAt: minus(60 * 72),
      resolvedAt: minus(60 * 71),
      updates: [
        { at: minus(60 * 72), text: "Planned maintenance started." },
        { at: minus(60 * 71), text: "Maintenance completed successfully." },
      ],
    },
  ]

  return NextResponse.json({ active, resolved })
}
