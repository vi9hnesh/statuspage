import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50/50">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Sign In</h1>
          <p className="text-muted-foreground">
            Access your private status page
          </p>
        </div>
        <SignIn 
            signUpUrl="https://app.warrn.io/sign-up"
            appearance={{
                elements: {
                  card: "bg-white dark:bg-black",
                  formButtonPrimary: "rounded-lg p-3 bg-black hover:bg-gray-800 text-white",
                  input: "rounded-lg p-3 border border-gray-300",
                  button: "rounded-lg p-3",
                }
              }}
        />
      </div>
    </div>
  )
}
