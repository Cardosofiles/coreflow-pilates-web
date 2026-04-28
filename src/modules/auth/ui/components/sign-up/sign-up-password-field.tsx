'use client'

import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import { Eye, EyeOff } from 'lucide-react'
import {
  createContext,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type JSX,
} from 'react'
import { Controller, type Control } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import type { SignUpFormData } from '@/schemas/auth.schema'

interface SignUpPasswordFieldProps {
  control: Control<SignUpFormData>
  disabled?: boolean
}

const PasswordContext = createContext<{ password: string } | null>(null)

const usePasswordContext = () => {
  const context = useContext(PasswordContext)
  if (!context) {
    throw new Error('usePasswordContext deve ser usado dentro de PasswordContext')
  }
  return context
}

const SignUpPasswordField = ({ control, disabled }: SignUpPasswordFieldProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const Icon = showPassword ? EyeOff : Eye

  return (
    <PasswordContext value={{ password }}>
      <Controller
        name="password"
        control={control}
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
                onChange={e => {
                  field.onChange(e)
                  handleChangePassword(e)
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
            <PasswordStrengthChecker />
          </Field>
        )}
      />
    </PasswordContext>
  )
}

// -------------------------------------------------------
// Verificador de força de senha
// -------------------------------------------------------
const PasswordStrengthChecker = (): JSX.Element | null => {
  const [optionsLoaded, setOptionsLoaded] = useState(false)
  const [errorLoadingOptions, setErrorLoadingOptions] = useState(false)

  const { password } = usePasswordContext()
  const deferredPassword = useDeferredValue(password)

  const strengthResult = useMemo(() => {
    if (!optionsLoaded || deferredPassword.length === 0) {
      return { score: 0, feedback: { warning: undefined } } as const
    }
    return zxcvbn(deferredPassword)
  }, [optionsLoaded, deferredPassword])

  useEffect(() => {
    Promise.all([import('@zxcvbn-ts/language-common'), import('@zxcvbn-ts/language-en')])
      .then(([common, english]) => {
        zxcvbnOptions.setOptions({
          translations: english.translations,
          graphs: common.adjacencyGraphs,
          maxLength: 50,
          dictionary: {
            ...common.dictionary,
            ...english.dictionary,
          },
        })
        setOptionsLoaded(true)
      })
      .catch(() => setErrorLoadingOptions(true))
  }, [])

  if (errorLoadingOptions) return null

  function getLabel() {
    if (deferredPassword.length === 0) return 'Força da senha'
    if (!optionsLoaded) return 'Carregando verificador...'

    const score = strengthResult.score
    switch (score) {
      case 0:
      case 1:
        return 'Muito fraca'
      case 2:
        return 'Fraca'
      case 3:
        return 'Forte'
      case 4:
        return 'Muito forte'
      default:
        return 'Indefinida'
    }
  }

  const label = getLabel()

  return (
    <div className="space-y-1">
      <div
        role="progressbar"
        aria-label="Força da senha"
        aria-valuenow={strengthResult.score}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuetext={label}
        className="flex gap-1"
      >
        {Array.from({ length: 4 }).map((_, i) => {
          const color =
            strengthResult.score >= 4
              ? 'bg-green-500'
              : strengthResult.score === 3
                ? 'bg-blue-500'
                : strengthResult.score === 2
                  ? 'bg-yellow-500'
                  : 'bg-red-500'

          return (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                strengthResult.score > i ? color : 'bg-secondary'
              )}
            />
          )
        })}
      </div>

      <div className="text-muted-foreground flex justify-end text-xs">
        {strengthResult.feedback.warning == null ? (
          label
        ) : (
          <Tooltip>
            <TooltipTrigger className="underline underline-offset-1">{label}</TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4} className="text-sm">
              {strengthResult.feedback.warning}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

export { SignUpPasswordField }
