'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/utilities/ui'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const strengthColors = ['bg-red-500', 'bg-amber-500', 'bg-sky-500', 'bg-emerald-500']

function getPasswordStrength(password: string) {
  if (!password) return 0

  const passedChecks = [
    password.length >= 8,
    password.length >= 12,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length

  if (passedChecks <= 1) return 1
  if (passedChecks === 2) return 2
  if (passedChecks <= 4) return 3
  return 4
}

export default function PasswordField({
  hideLabel,
  placeholder,
  rtl,
  showLabel,
  strengthLabels,
}: {
  hideLabel: string
  placeholder: string
  rtl: boolean
  showLabel: string
  strengthLabels: [string, string, string, string]
}) {
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const strength = getPasswordStrength(password)

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          autoComplete="new-password"
          className={rtl ? 'pl-11' : 'pr-11'}
          id="password"
          minLength={8}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder={placeholder}
          required
          type={visible ? 'text' : 'password'}
          value={password}
        />
        <button
          aria-label={visible ? hideLabel : showLabel}
          className={cn(
            'absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-gray-500 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            rtl ? 'left-1' : 'right-1',
          )}
          onClick={() => setVisible((current) => !current)}
          title={visible ? hideLabel : showLabel}
          type="button"
        >
          {visible ? (
            <EyeOff aria-hidden="true" size={18} />
          ) : (
            <Eye aria-hidden="true" size={18} />
          )}
        </button>
      </div>

      <div aria-live="polite" className="space-y-1.5">
        <div
          aria-valuemax={4}
          aria-valuemin={0}
          aria-valuenow={strength}
          className="grid grid-cols-4 gap-1"
          role="meter"
        >
          {[1, 2, 3, 4].map((level) => (
            <span
              className={cn(
                'h-1 rounded-full bg-gray-200 transition-colors',
                strength >= level && strengthColors[strength - 1],
              )}
              key={level}
            />
          ))}
        </div>
        {strength > 0 ? (
          <p className="text-xs text-gray-600">{strengthLabels[strength - 1]}</p>
        ) : null}
      </div>
    </div>
  )
}
