'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormData } from '@/type'
import { cn } from '@/utilities/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import StepContainer from './StepContainer'
import { saveWaitingListOnboarding } from './actions'

const MultiStepForm = ({
  allStepsData,
  submitButtonText,
  locale,
}: {
  allStepsData: any
  submitButtonText?: string
  submissionThanks?: string
  submissionMessage?: string
  backToHomeText?: string
  locale?: string
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const { schema, defaultValues } = useMemo(() => {
    const schemaShape: Record<string, any> = {}
    const defaultVals: Record<string, string> = {}
    const seen = new Set<string>()

    allStepsData?.forEach((step: any) => {
      step.fields?.forEach((field: any) => {
        field.inputs?.forEach((input: any) => {
          if (!seen.has(input.name)) {
            // All fields should be optional by default, we'll validate individually per step
            schemaShape[input.name] = z.string().optional()
            defaultVals[input.name] = ''
            seen.add(input.name)
          }
        })
      })
    })

    return {
      schema: z.object(schemaShape),
      defaultValues: defaultVals,
    }
  }, [allStepsData])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  })

  const currentStepData = allStepsData?.find((item: any) => item.step === currentStep)
  const watchedValues = watch()

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    console.log('=== FORM SUBMISSION DEBUG ===')
    console.log('Form data received (already mapped during selection):', data)
    console.log('Form data keys:', Object.keys(data))
    console.log('Form data entries:', Object.entries(data))

    // Data is already mapped during selection, so we can use it directly
    const submissionData = { ...data }

    console.log('Final data being sent to API:', submissionData)

    try {
      console.log('Sending data to API:', JSON.stringify(submissionData, null, 2))

      await saveWaitingListOnboarding(submissionData)
      router.replace(`/${locale || 'en'}/apps?onboarding=complete`)
    } catch (err) {
      console.error('Form submission error:', err)
      // You might want to show an error message to the user here
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelect = (name: keyof FormData, value: string) => {
    console.log(`=== FIELD SELECTION DEBUG ===`)
    console.log(`Setting field "${name}" to value:`, value)
    console.log('Current step:', currentStep)
    console.log('Current locale:', locale)
    console.log('All current form values before update:', getValues())

    // Map field names based on current step and field name to handle different form configurations
    let mappedFieldName = name

    if (name === 'company_name' && currentStep === 1) {
      // English form: Step 1 uses company_name field for business type
      mappedFieldName = 'business_type'
      console.log('English form: Mapping company_name to business_type')
    } else if (name === 'objective') {
      // Both English and Arabic forms use objective field, but for different steps
      if (currentStep === 1) {
        // Arabic form: Step 1 uses objective field for business type
        mappedFieldName = 'business_type'
        console.log('Arabic form: Step 1 - Mapping objective to business_type')
      } else if (currentStep === 2) {
        // Both forms: Step 2 uses objective field for fleet size
        mappedFieldName = 'fleet'
        console.log('Step 2 - Mapping objective to fleet')
      } else if (currentStep === 3) {
        // Arabic form: Step 3 uses objective field for challenges
        mappedFieldName = 'challenge'
        console.log('Arabic form: Step 3 - Mapping objective to challenge')
      } else if (currentStep === 4) {
        // Arabic form: Step 4 uses objective field for management operation
        mappedFieldName = 'manage_operation'
        console.log('Arabic form: Step 4 - Mapping objective to manage_operation')
      }
    }

    console.log(
      `Mapping "${name}" → "${mappedFieldName}" (Step ${currentStep}, Locale: ${locale}) with value: "${value}"`,
    )
    setValue(mappedFieldName as keyof FormData, value, { shouldValidate: true })

    // Log values after update
    setTimeout(() => {
      console.log('All current form values after update:', getValues())
      console.log(
        `Confirmed field "${mappedFieldName}" is now:`,
        getValues()[mappedFieldName as keyof FormData],
      )
    }, 100)
  }

  return (
    <div className="bg-white rounded-xl p-8 max-w-[560px] mx-auto shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gray-200 flex flex-col gap-8 relative">
      <StepContainer
        allSteps={allStepsData?.map((stepObj: any) => ({
          step: stepObj.step,
          title:
            stepObj?.fields?.length > 0 && stepObj.fields[0].title
              ? stepObj.fields[0].title
              : `Step ${stepObj.step}`,
        }))}
        currentStep={currentStep}
      />

      {currentStepData?.formType !== 'final' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {currentStepData?.fields?.map((items: any, i: number) => (
            <div key={i} className="w-full">
              {items.title && <p className="font-bold text-2xl leading-10">{items.title}</p>}

              {currentStepData.formType === 'select' ? (
                <div
                  className={cn(
                    'flex flex-col gap-5 mb-5 mt-[20px]',
                    currentStepData.fields.length > 1 && 'flex-row',
                  )}
                >
                  {items.inputs.map((input: any, j: number) => {
                    // Determine the correct field name to check for selection state (same logic as handleSelect)
                    let fieldToCheck = input.name

                    if (input.name === 'company_name' && currentStep === 1) {
                      // English form: Step 1 uses company_name field for business type
                      fieldToCheck = 'business_type'
                    } else if (input.name === 'objective') {
                      // Both English and Arabic forms use objective field, but for different steps
                      if (currentStep === 1) {
                        // Arabic form: Step 1 uses objective field for business type
                        fieldToCheck = 'business_type'
                      } else if (currentStep === 2) {
                        // Both forms: Step 2 uses objective field for fleet size
                        fieldToCheck = 'fleet'
                      } else if (currentStep === 3) {
                        // Arabic form: Step 3 uses objective field for challenges
                        fieldToCheck = 'challenge'
                      } else if (currentStep === 4) {
                        // Arabic form: Step 4 uses objective field for management operation
                        fieldToCheck = 'manage_operation'
                      }
                    }

                    const isSelected = watchedValues[fieldToCheck as keyof FormData] === input.label

                    return (
                      <div
                        key={j}
                        onClick={() => handleSelect(input.name, input.label)}
                        className={cn(
                          'w-full text-lg h-[75px] flex items-center px-6 justify-start cursor-pointer border rounded-[10px] transition-all duration-200',
                          isSelected && 'bg-primary text-white border-primary',
                          !isSelected && 'border-gray-300 hover:border-primary hover:bg-primary/5',
                          currentStepData.fields.length > 1 && 'justify-center',
                        )}
                      >
                        <p>{input.label}</p>
                      </div>
                    )
                  })}
                </div>
              ) : currentStepData.formType === 'form' ? (
                <div className="space-y-4 mt-4">
                  {items.inputs.map((input: any, j: number) => (
                    <div key={j}>
                      <Label htmlFor={input.name}>{input.label || input.name}</Label>
                      <Input id={input.name} {...register(input.name)} />
                      {errors[input.name as keyof FormData] && (
                        <p className="text-red-500">
                          {errors[input.name as keyof FormData]?.message as string}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          <div className="w-full flex justify-between mt-5">
            {currentStep > 1 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)} variant="ghost">
                {locale === 'en' ? <ArrowLeft /> : <ArrowRight />}
              </Button>
            )}
            <Button
              disabled={isSubmitting}
              type="button"
              onClick={() => {
                console.log('Button clicked - Current step formType:', currentStepData?.formType)
                console.log('Button clicked - Current values:', getValues())

                if (currentStepData?.formType === 'form') {
                  // For form steps, validate only the current step fields
                  const currentStepFieldNames =
                    currentStepData?.fields?.flatMap(
                      (field: any) => field.inputs?.map((input: any) => input.name) || [],
                    ) || []

                  console.log('Validating fields for current step:', currentStepFieldNames)

                  // Check if current step fields are filled
                  const currentValues = getValues()
                  const currentStepValid = currentStepFieldNames.every((fieldName: string) => {
                    const value = currentValues[fieldName as keyof FormData]
                    const isValid = value && value.trim() !== ''
                    console.log(`Field ${fieldName}: "${value}" - valid: ${isValid}`)
                    return isValid
                  })

                  console.log('Current step validation result:', currentStepValid)

                  if (currentStepValid) {
                    const data = getValues()
                    onSubmit(data)
                  } else {
                    console.log('Current step validation failed - some fields are empty')
                    alert('Please fill in all required fields')
                  }
                } else {
                  console.log('Non-form step, incrementing...')
                  setCurrentStep(currentStep + 1)
                }
              }}
              variant="outline"
            >
              {submitButtonText} {locale === 'en' ? <ArrowRight /> : <ArrowLeft />}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  )
}

export default MultiStepForm
