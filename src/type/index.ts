import { ReactNode } from 'react'

export interface Step {
  step: number
  title: string
}

export interface FormData {
  business_type: string
  fleet: string
  manage_operation: string
  challenge: string
  full_name: string
  email: string
  company_name: string
  mobile: string
  // Legacy fields - will be removed after data migration
  objective?: string
  platforms?: string
  averageRate?: string
  tendersPerMonth?: string
}

export interface JobApplicationFormData {
  full_name: string
  email: string
  phone_number: string
  country: string
  position: string
  years_of_experience: number
  gulf_experience: string
  availability: string
  cv: string
  portfolio?: string
}
export type NavbarButton = {
  href: string
  label: ReactNode
  variant: 'primary' | 'outline' | string
}
