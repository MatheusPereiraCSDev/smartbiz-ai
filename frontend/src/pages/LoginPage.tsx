import { useState } from 'react'
import AnimatedGears from '../components/AnimatedGears'
import LoginForm from '../components/LoginForm'
import RegisterModal from '../components/RegisterModal'
import Logo from '../components/Logo'


export default function LoginPage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-base px-4 py-10">
      {/* Ambient accent glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px] animate-pulse-glow"
      />

      <AnimatedGears />

      <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-surface-line bg-surface/90 p-7 shadow-card backdrop-blur-sm sm:p-8">
          <div className="mb-6">
            <h1 className="font-display text-lg font-semibold text-ink">Acesse sua conta</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Gestão inteligente para o seu negócio.
            </p>
          </div>

          <LoginForm onRegisterClick={() => setIsRegisterOpen(true)} />
        </div>

        <p className="mt-6 text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} SmartBiz AI. Todos os direitos reservados.
        </p>
      </div>

      <RegisterModal open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </div>
  )
}
