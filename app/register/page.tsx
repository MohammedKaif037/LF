import { RegisterForm } from "@/components/register-form"
import { Terminal } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <Terminal className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">JavaMaster</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-md w-full px-4 py-8">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Create an account</h1>
              <p className="text-muted-foreground">Enter your information to create an account</p>
            </div>
            <RegisterForm />
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline text-primary">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
