'use client'

import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs/legacy'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { enterAsDemo } from '@/app/actions/demo'

interface EnterAsDemoButtonProps {
  className?: string
}

export function EnterAsDemoButton({ className }: EnterAsDemoButtonProps) {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    if (!isLoaded) return
    setLoading(true)
    setError(null)

    try {
      const result = await enterAsDemo()
      if ('error' in result) {
        setError(result.error)
        setLoading(false)
        return
      }

      const attempt = await signIn.create({ strategy: 'ticket', ticket: result.token })
      if (attempt.status !== 'complete' || !attempt.createdSessionId) {
        console.error('signIn.create returned', attempt)
        setError('Demo sign-in could not be completed')
        setLoading(false)
        return
      }

      await setActive({ session: attempt.createdSessionId })
      router.push('/dashboard')
    } catch (err) {
      console.error('enterAsDemo failed:', err)
      setError('Demo sign-in failed')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={loading || !isLoaded}
        whileHover={loading ? undefined : { scale: 1.05 }}
        whileTap={loading ? undefined : { scale: 0.95 }}
        className={className ?? 'btn-outline rounded-full px-8 py-4 text-lg disabled:opacity-50'}
      >
        {loading ? 'CARGANDO...' : 'ENTRAR COMO DEMO'}
      </motion.button>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
