'use server'

import { getPayload } from '@/lib/payload'
import { revalidatePath } from 'next/cache'

export async function createLead(data: {
  customerName: string
  phoneNumber: string
  organizationName: string
  businessBrief: string
  referencedProduct: string
}) {
  try {
    const payload = await getPayload()

    const lead = await payload.create({
      collection: 'leads',
      data: {
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        organizationName: data.organizationName,
        businessBrief: data.businessBrief,
        referencedProduct: data.referencedProduct,
        status: 'new',
      },
    })

    revalidatePath('/en/admin/collections/leads')
    return { success: true, data: lead }
  } catch (error) {
    console.error('Error creating lead:', error)
    return { success: false, error: 'Failed to submit request. Please try again.' }
  }
}
