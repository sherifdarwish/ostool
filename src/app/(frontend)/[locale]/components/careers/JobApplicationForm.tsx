'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Page } from '@/payload-types'
import { CheckCircle2, Loader2, TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'

type SelectOption = {
  label: string
  value?: string
}

const DEFAULT_COUNTRIES: SelectOption[] = [
  { label: 'United Arab Emirates' },
  { label: 'Saudi Arabia' },
  { label: 'Qatar' },
  { label: 'Kuwait' },
  { label: 'Bahrain' },
  { label: 'Oman' },
  { label: 'Jordan' },
  { label: 'Egypt' },
  { label: 'Other' },
]

const fieldWrapper = 'space-y-2'
const selectStyles =
  'flex h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

type JobApplicationFormBlock = Extract<
  NonNullable<Page['layout']>[number],
  { blockType: 'jobApplicationForm' }
>

type JobApplicationFormProps = JobApplicationFormBlock & {
  locale?: string
}

const JobApplicationForm = ({
  heading,
  description,
  fullNameLabel = 'Full Name',
  emailLabel = 'Email Address',
  phoneLabel = 'Phone Number',
  countryLabel = 'Country',
  positionLabel = 'Position Applied For',
  experienceLabel = 'Years of Experience',
  gulfExperienceLabel = 'Tell us about your experience in the Gulf market or with cloud-based systems similar to Ostool.',
  availabilityLabel = 'When are you available to start?',
  cvLabel = 'Upload Your CV',
  portfolioLabel = 'Upload Your Portfolio',
  submitLabel = 'Submit Application',
  successTitle = 'Your application has been received!',
  successMessage = 'Thank you for your interest in joining Ostool. We will be in touch soon.',
  positionOptions,
  countryOptions,
}: JobApplicationFormProps) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const normalizedCountries = useMemo(() => {
    const baseList = Array.isArray(countryOptions) && countryOptions.length > 0 ? countryOptions : DEFAULT_COUNTRIES
    return baseList.map((option: SelectOption) => ({
      label: option.label,
      value: option.value ?? option.label,
    }))
  }, [countryOptions])

  const normalizedPositions = useMemo(() => {
    if (!Array.isArray(positionOptions) || positionOptions.length === 0) return []
    return positionOptions.map((option: SelectOption) => ({
      label: option.label,
      value: option.value ?? option.label,
    }))
  }, [positionOptions])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage(null)
    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    try {
      const endpoint =
        typeof window === 'undefined'
          ? '/api/job-applications/submit'
          : `${window.location.origin}/api/job-applications/submit`

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const fallbackMessage = await response.text()
        throw new Error(fallbackMessage || 'Unable to submit your application at the moment.')
      }

      setStatus('success')
      formElement.reset()
    } catch (error) {
      console.error('Job application submission failed:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          {heading && (
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{heading}</h2>
          )}
          {description && <p className="mt-4 text-base text-muted-foreground">{description}</p>}
        </div>

        <div className="mx-auto mt-12 w-full max-w-3xl">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden />
              <h3 className="text-2xl font-semibold">{successTitle}</h3>
              {successMessage && <p className="max-w-xl text-muted-foreground">{successMessage}</p>}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card/40 p-8 shadow-sm backdrop-blur">
              <div className="grid gap-6 md:grid-cols-2">
                <div className={fieldWrapper}>
                  <Label htmlFor="full_name">{fullNameLabel}</Label>
                  <Input id="full_name" name="full_name" type="text" required />
                </div>

                <div className={fieldWrapper}>
                  <Label htmlFor="email">{emailLabel}</Label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div className={fieldWrapper}>
                  <Label htmlFor="phone_number">{phoneLabel}</Label>
                  <Input id="phone_number" name="phone_number" type="tel" required />
                </div>

                <div className={fieldWrapper}>
                  <Label htmlFor="country">{countryLabel}</Label>
                  <select id="country" name="country" className={selectStyles} defaultValue="" required>
                    <option value="" disabled>
                      --
                    </option>
                    {normalizedCountries.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={fieldWrapper}>
                  <Label htmlFor="position">{positionLabel}</Label>
                  {normalizedPositions.length > 0 ? (
                    <select id="position" name="position" className={selectStyles} defaultValue="" required>
                      <option value="" disabled>
                        --
                      </option>
                      {normalizedPositions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input id="position" name="position" type="text" required />
                  )}
                </div>

                <div className={fieldWrapper}>
                  <Label htmlFor="years_of_experience">{experienceLabel}</Label>
                  <Input id="years_of_experience" name="years_of_experience" type="number" min="0" step="0.5" required />
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className={fieldWrapper}>
                  <Label htmlFor="gulf_experience">{gulfExperienceLabel}</Label>
                  <Textarea id="gulf_experience" name="gulf_experience" rows={4} required />
                </div>

                <div className={fieldWrapper}>
                  <Label htmlFor="availability">{availabilityLabel}</Label>
                  <Input id="availability" name="availability" type="text" required />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className={fieldWrapper}>
                    <Label htmlFor="cv">{cvLabel}</Label>
                    <Input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx" required />
                    <p className="text-sm text-muted-foreground">Maximum file size: 15MB.</p>
                  </div>

                  <div className={fieldWrapper}>
                    <Label htmlFor="portfolio">{portfolioLabel}</Label>
                    <Input id="portfolio" name="portfolio" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar" />
                    <p className="text-sm text-muted-foreground">Maximum file size: 15MB.</p>
                  </div>
                </div>
              </div>

              {status === 'error' && (
                <div className="mt-6 flex items-start gap-3 rounded-md border border-error/60 bg-error/20 p-4 text-sm text-destructive">
                  <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <Button type="submit" disabled={status === 'submitting'}>
                  {status === 'submitting' && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
                  {submitLabel}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default JobApplicationForm
