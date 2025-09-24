import { SignIn } from '@clerk/nextjs'

interface Props {
  searchParams: Promise<{ return_url?: string }>
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const returnUrl = params.return_url || '/'
  
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
      {/* Cross grid pattern background */}
      <div className="absolute inset-0 opacity-15">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(156, 163, 175, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(156, 163, 175, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}>
        </div>
      </div>
      
      <div className="w-full max-w-md p-6 relative z-10">
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            Access your private status page
          </p>
        </div>
        <SignIn 
            signUpUrl="https://app.warrn.io/sign-up"
            fallbackRedirectUrl={returnUrl}
            forceRedirectUrl={returnUrl}
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
