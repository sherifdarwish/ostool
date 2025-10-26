import config from '@payload-config'
import { Buffer } from 'node:buffer'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export const runtime = 'nodejs'

const toStringValue = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim() : ''

const toNumberValue = (value: FormDataEntryValue | null) => {
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return 0
}

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })
    const formData = await request.formData()

    const fullName = toStringValue(formData.get('full_name'))
    const email = toStringValue(formData.get('email'))
    const phoneNumber = toStringValue(formData.get('phone_number'))
    const country = toStringValue(formData.get('country'))
    const position = toStringValue(formData.get('position'))
    const gulfExperience = toStringValue(formData.get('gulf_experience'))
    const availability = toStringValue(formData.get('availability'))
    const yearsOfExperience = toNumberValue(formData.get('years_of_experience'))

    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !country ||
      !position ||
      !gulfExperience ||
      !availability
    ) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const uploadDocument = async (
      entry: FormDataEntryValue | null,
      label: string,
    ): Promise<number | null> => {
      if (!(entry instanceof File) || entry.size === 0) {
        return null
      }

      const buffer = Buffer.from(await entry.arrayBuffer())

      const uploaded = await payload.create({
        collection: 'media',
        data: {
          alt: `${fullName} - ${label}`,
        },
        file: {
          data: buffer,
          mimetype: entry.type || 'application/octet-stream',
          name: entry.name || `${label.toLowerCase().replace(/\s+/g, '-')}.dat`,
          size: entry.size,
        },
        overrideAccess: true,
      })

      return uploaded.id
    }

    const cvId = await uploadDocument(formData.get('cv'), 'CV')

    if (cvId == null) {
      return NextResponse.json({ error: 'CV upload is required.' }, { status: 400 })
    }

    const portfolioId = await uploadDocument(formData.get('portfolio'), 'Portfolio')

    const jobApplication = await payload.create({
      collection: 'job-applications',
      data: {
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        country,
        position,
        years_of_experience: yearsOfExperience,
        gulf_experience: gulfExperience,
        availability,
        cv: cvId,
        ...(portfolioId != null ? { portfolio: portfolioId } : {}),
      },
      overrideAccess: true,
    })

    return NextResponse.json({ doc: jobApplication }, { status: 201 })
  } catch (error) {
    console.error('Job application submission error:', error)
    const message =
      error instanceof Error ? error.message : 'Unexpected error while submitting application.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
