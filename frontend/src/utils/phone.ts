export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 13)

  if (digits.length === 0) return ''

  // Garante DDI 55 como padrão se o usuário não digitar
  let ddi = digits.slice(0, 2)
  let rest = digits.slice(2)

  if (digits.length <= 2) {
    return `+${digits}`
  }

  const ddd = rest.slice(0, 2)
  const number = rest.slice(2)

  let formatted = `+${ddi}`
  if (ddd) formatted += ` (${ddd}`
  if (ddd.length === 2) formatted += ')'
  if (number) {
    const firstPart = number.slice(0, 5)
    const secondPart = number.slice(5, 9)
    formatted += ` ${firstPart}`
    if (secondPart) formatted += `-${secondPart}`
  }

  return formatted
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  // DDI (2) + DDD (2) + número (8 ou 9) = 12 ou 13 dígitos
  return digits.length === 12 || digits.length === 13
}

export function phoneToWhatsAppFormat(value: string): string {
  return value.replace(/\D/g, '')
}