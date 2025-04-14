import { Logo } from "@/components/atomsComponents"
import { LoginForm } from "@/components/ui"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-start md:justify-center bg-background p-6 md:p-10 relative">
      <div className="md:absolute relative top-0 w-full left-0 z-10 p-2 md:p-6">
        <Logo />
      </div>
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />

      </div>
    </div>
  )
}
