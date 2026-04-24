import { Resend } from 'resend'

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[]
  subject: string
  react: React.ReactElement
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email send')
    return { data: null, error: null }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from: 'InkApp <onboarding@resend.dev>',
    to,
    subject,
    react,
  })

  if (error) {
    console.error('Failed to send email:', error)
  }

  return { data, error }
}
