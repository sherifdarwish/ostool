import { Button } from '@/components/ui/button'
import { FaLinkedin } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

export default function OAuthButton({
  label,
  provider,
}: {
  label: string
  provider: 'google' | 'linkedin'
}) {
  const icon =
    provider === 'google' ? (
      <FcGoogle aria-hidden="true" className="h-5 w-5 shrink-0" />
    ) : (
      <FaLinkedin aria-hidden="true" className="h-5 w-5 shrink-0 text-[#0a66c2]" />
    )

  return (
    <Button
      className="h-12 w-full gap-3 border-gray-300 bg-white py-0 text-base text-gray-950 hover:!border-gray-300 hover:!bg-gray-50 hover:!text-gray-950"
      variant="outline"
    >
      {icon}
      <span>{label}</span>
    </Button>
  )
}
