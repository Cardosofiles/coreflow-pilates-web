'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState, type ChangeEvent, type JSX } from 'react'
import { Controller, type Control } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import type { SignUpFormData } from '@/modules/auth/types'

interface SignUpPasswordFieldProps {
  control: Control<SignUpFormData>
  disabled?: boolean
}

function scorePassword(password: string): number {
  if (password.length === 0) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const SCORE_LABELS = ['Muito fraca', 'Fraca', 'Regular', 'Forte', 'Muito forte'] as const
const SCORE_COLORS = [
  'bg-red-500',
  'bg-red-400',
  'bg-yellow-500',
  'bg-blue-500',
  'bg-green-500',
] as const

const SignUpPasswordField = ({ control, disabled }: SignUpPasswordFieldProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

  const Icon = showPassword ? EyeOff : Eye
  const score = scorePassword(password)

  return (
    <Controller
      name="password"
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id="password"
              type={showPassword ? 'text' : 'password'}
              disabled={disabled}
              placeholder="••••••••"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                field.onChange(e)
                setPassword(e.target.value)
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              onClick={() => setShowPassword(p => !p)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              tabIndex={-1}
            >
              <Icon className="h-4 w-4" />
            </Button>
          </div>
          <FieldError>{fieldState.error?.message}</FieldError>
          {password.length > 0 && (
            <div className="space-y-1">
              <div
                role="progressbar"
                aria-label="Força da senha"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={4}
                aria-valuetext={SCORE_LABELS[score]}
                className="flex gap-1"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors',
                      score > i ? SCORE_COLORS[score] : 'bg-secondary'
                    )}
                  />
                ))}
              </div>
              <div className="text-muted-foreground flex justify-end text-xs">
                {SCORE_LABELS[score]}
              </div>
            </div>
          )}
        </Field>
      )}
    />
  )
}

export { SignUpPasswordField }
