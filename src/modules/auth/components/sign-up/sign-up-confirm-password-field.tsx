'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState, type JSX } from 'react'
import { Controller, type Control } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import type { SignUpFormData } from '@/modules/auth/types'

interface ConfirmPasswordFieldProps {
  control: Control<SignUpFormData>
  disabled?: boolean
}

const SignUpConfirmPasswordField = ({
  control,
  disabled,
}: ConfirmPasswordFieldProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)
  const Icon = showPassword ? EyeOff : Eye

  return (
    <Controller
      name="confirmPassword"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="confirmPassword">Confirmar Senha</FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={disabled}
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
        </Field>
      )}
    />
  )
}

export { SignUpConfirmPasswordField }
