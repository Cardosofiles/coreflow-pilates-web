'use client'

import type { JSX } from 'react'
import { Controller, type Control } from 'react-hook-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import type { SignUpFormData } from '@/schemas/auth.schema'

interface SignUpEmailFieldProps {
  control: Control<SignUpFormData>
  disabled?: boolean
}

const SignUpEmailField = ({ control, disabled }: SignUpEmailFieldProps): JSX.Element => {
  return (
    <Controller
      name="email"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...field}
            disabled={disabled}
          />
          <FieldError>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  )
}

export { SignUpEmailField }
