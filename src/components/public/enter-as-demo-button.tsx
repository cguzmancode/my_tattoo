'use client'

import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { enterAsDemo } from '@/app/actions/demo'

interface EnterAsDemoButtonProps {
  className?: string
}

export function EnterAsDemoButton({ className }: EnterAsDemoButtonProps) {
  const { signIn, fetchStatus } = useSignIn()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loading = submitting || fetchStatus === 'fetching'

  const handleClick = async () => {
    setSubmitting(true)
    setError(null)

    try {
      const result = await enterAsDemo()
      if ('error' in result) {
        setError(result.error)
        setSubmitting(false)
        return
      }

      const ticketResult = await signIn.ticket({ ticket: result.token })
      if (ticketResult.error || signIn.status !== 'complete') {
        setError('Demo sign-in could not be completed')
        setSubmitting(false)
        return
      }

      const finalizeResult = await signIn.finalize()
      if (finalizeResult.error) {
        setError('Demo sign-in could not be finalized')
        setSubmitting(false)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      console.error('enterAsDemo failed:', err)
      setError('Demo sign-in failed')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={loading}
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
