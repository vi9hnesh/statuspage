import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Status Pages',
  description: 'View all available status pages and system monitoring dashboards.',
}

export default function Page() {
  // Redirect home page to status pages listing
  redirect('https://warrn.io/status-pages')
}
