export function randomText(length: number) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    result += charset[randomIndex]
  }
  return result
}

export function encrypt(text: string) {
  return btoa(randomText(50) + ':' + text + ':' + randomText(50))
}

export function decrypt(encryptedText: string) {
  return atob(encryptedText)
}
