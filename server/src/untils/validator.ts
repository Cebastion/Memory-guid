function isValidatorPassword(password: number): Promise<boolean> {
  const status = typeof password === 'number' ? true : false
  return Promise.resolve(status)
}

function isValidatorEmail(email: string): Promise<boolean> {
  const status = typeof email === 'string' ? true : false
  return Promise.resolve(status)
}

export { isValidatorPassword, isValidatorEmail }