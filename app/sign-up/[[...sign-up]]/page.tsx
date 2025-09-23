import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50/50">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
          <p className="text-muted-foreground">
            Create an account to access private status pages
          </p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
