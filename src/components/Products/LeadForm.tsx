'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createLead } from '@/app/(frontend)/actions/leads'
import { Loader2, CheckCircle2 } from 'lucide-react'

const leadSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  phoneNumber: z.string().min(5, 'Valid phone number is required'),
  organizationName: z.string().min(2, 'Organization name is required'),
  businessBrief: z.string().min(10, 'Please provide a short brief (min 10 chars)'),
})

type LeadFormData = z.infer<typeof leadSchema>

export const LeadForm: React.FC<{
  productId: string
  onSuccess?: () => void
}> = ({ productId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  })

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await createLead({
        ...data,
        referencedProduct: productId,
      })

      if (result.success) {
        setIsSuccess(true)
        if (onSuccess) {
          setTimeout(onSuccess, 3000)
        }
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (_err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <CheckCircle2 className="h-16 w-16 text-success animate-in zoom-in" />
        <h3 className="text-2xl font-bold">Request Submitted!</h3>
        <p className="text-muted-foreground">
          Thank you for your interest. Our team will contact you shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="customerName">Full Name</Label>
        <Input
          id="customerName"
          placeholder="John Doe"
          {...register('customerName')}
          className={errors.customerName ? 'border-destructive' : ''}
        />
        {errors.customerName && (
          <p className="text-xs text-destructive">{errors.customerName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          placeholder="+1 234 567 890"
          {...register('phoneNumber')}
          className={errors.phoneNumber ? 'border-destructive' : ''}
        />
        {errors.phoneNumber && (
          <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input
          id="organizationName"
          placeholder="Acme Corp"
          {...register('organizationName')}
          className={errors.organizationName ? 'border-destructive' : ''}
        />
        {errors.organizationName && (
          <p className="text-xs text-destructive">{errors.organizationName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessBrief">Business Brief</Label>
        <Textarea
          id="businessBrief"
          placeholder="Tell us about your requirements..."
          {...register('businessBrief')}
          className={errors.businessBrief ? 'border-destructive' : ''}
        />
        {errors.businessBrief && (
          <p className="text-xs text-destructive">{errors.businessBrief.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Send Request'
        )}
      </Button>
    </form>
  )
}
