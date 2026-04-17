'use client'

import { useState } from 'react'
import { Save, Loader2, User, Link as LinkIcon, DollarSign, FileText, Image as ImageIcon } from 'lucide-react'
import { updateProfile } from '@/app/actions/profile'
import { generateSlug } from '@/lib/utils'

interface ProfileFormProps {
  initialData: {
    id: string
    name: string
    slug: string
    bio: string | null
    styles: string[]
    depositAmount: number
    instagramUrl: string | null
    portfolioImages: string[]
  }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: initialData.name,
    slug: initialData.slug,
    bio: initialData.bio || '',
    styles: initialData.styles.join(', '),
    depositAmount: (initialData.depositAmount / 100).toFixed(2),
    instagramUrl: initialData.instagramUrl || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSuccess(false)
    setError(null)
  }

  const generateSlugFromName = () => {
    const newSlug = generateSlug(formData.name)
    setFormData((prev) => ({ ...prev, slug: newSlug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)
    setError(null)

    try {
      const result = await updateProfile({
        name: formData.name,
        slug: formData.slug,
        bio: formData.bio,
        styles: formData.styles.split(',').map((s) => s.trim()).filter(Boolean),
        depositAmount: Math.round(parseFloat(formData.depositAmount) * 100),
        instagramUrl: formData.instagramUrl || undefined,
      })

      if (result) {
        setSuccess(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4">
          <p className="text-sm text-emerald-400">Profile updated successfully!</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/30 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-300">
          <User className="mr-1 inline-block h-4 w-4" />
          Display Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-zinc-300">
          <LinkIcon className="mr-1 inline-block h-4 w-4" />
          Profile URL
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="flex items-center rounded-lg border border-zinc-700 bg-zinc-950">
              <span className="border-r border-zinc-700 px-3 py-3 text-sm text-zinc-500">
                inkapp.com/t/
              </span>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="flex-1 bg-transparent px-3 py-3 text-sm text-white focus:outline-none"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={generateSlugFromName}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            Generate
          </button>
        </div>
        <p className="mt-1.5 text-xs text-zinc-500">
          This is your public profile URL. Share it with clients.
        </p>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-zinc-300">
          <FileText className="mr-1 inline-block h-4 w-4" />
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          placeholder="Tell clients about your experience, style, and studio..."
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Styles */}
      <div>
        <label htmlFor="styles" className="mb-1.5 block text-sm font-medium text-zinc-300">
          <ImageIcon className="mr-1 inline-block h-4 w-4" />
          Tattoo Styles (comma separated)
        </label>
        <input
          type="text"
          id="styles"
          name="styles"
          value={formData.styles}
          onChange={handleChange}
          placeholder="Traditional, Japanese, Realism, Blackwork..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Deposit Amount */}
      <div>
        <label htmlFor="depositAmount" className="mb-1.5 block text-sm font-medium text-zinc-300">
          <DollarSign className="mr-1 inline-block h-4 w-4" />
          Required Deposit ($)
        </label>
        <div className="flex items-center rounded-lg border border-zinc-700 bg-zinc-950">
          <span className="border-r border-zinc-700 px-3 py-3 text-sm text-zinc-500">$</span>
          <input
            type="number"
            id="depositAmount"
            name="depositAmount"
            value={formData.depositAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="flex-1 bg-transparent px-3 py-3 text-sm text-white focus:outline-none"
          />
        </div>
        <p className="mt-1.5 text-xs text-zinc-500">
          Clients must pay this deposit to confirm their booking.
        </p>
      </div>

      {/* Instagram URL */}
      <div>
        <label htmlFor="instagramUrl" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Instagram URL
        </label>
        <input
          type="url"
          id="instagramUrl"
          name="instagramUrl"
          value={formData.instagramUrl}
          onChange={handleChange}
          placeholder="https://instagram.com/yourhandle"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  )
}
