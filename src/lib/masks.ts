/**
 * Formata um número de telefone brasileiro.
 * Suporta celular (11 dígitos): (XX) XXXXX-XXXX
 * e fixo (10 dígitos):          (XX) XXXX-XXXX
 */
export function formatPhoneBR(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length === 0) return ''

  if (digits.length <= 2) {
    return `(${digits}`
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  if (digits.length <= 10) {
    // fixo: (XX) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  // celular: (XX) XXXXX-XXXX
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/**
 * Remove todos os caracteres não numéricos de uma string.
 */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}
