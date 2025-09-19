import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-background">
      <div className="mx-auto max-w-md px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="size-6 text-red-600" />
            </div>
            <CardTitle>Status Page Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              The status page you're looking for doesn't exist or may have been moved.
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Common reasons:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• The status page slug is incorrect</li>
                <li>• The status page is not public</li>
                <li>• The status page has been deleted</li>
              </ul>
            </div>
            <a 
              href="https://warrn.io/status-pages" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all status pages →
            </a>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
