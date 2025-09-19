import { redirect } from 'next/navigation'

export default function Page() {
  // Redirect home page to status pages listing
  redirect('https://warrn.io/status-pages')
}
