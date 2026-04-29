'use client'

import type { JSX } from 'react'

import { Controller, type Control } from 'react-hook-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import type { SignUpFormData } from '@/modules/auth/types'

interface SignUpNameFieldProps {
  control: Control<SignUpFormData>
  disabled?: boolean
}

const SignUpNameField = ({ control, disabled }: SignUpNameFieldProps): JSX.Element => {
  return (
    <Controller
      name="name"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input id="name" placeholder="Digite seu nome completo" {...field} disabled={disabled} />
          <FieldError>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  )
}

export { SignUpNameField }
