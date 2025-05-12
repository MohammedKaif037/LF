import { RegisterForm } from "@/components/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-bold">
          JMaster
        </Link>
        <p className="text-muted-foreground">Learn Java Programming</p>
      </div>
      <RegisterForm />
    </div>
  )
}
