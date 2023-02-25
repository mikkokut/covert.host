// https://voracious.dev/blog/a-practical-guide-to-the-web-cryptography-api
// https://blog.excalidraw.com/end-to-end-encryption/

const generateKey = async () => {
  return window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
}

const generateIv = () => {
  return window.crypto.getRandomValues(new Uint8Array(12))
}

const encode = (data: string) => {
  const encoder = new TextEncoder()
  return encoder.encode(data)
}

const decode = (buffer: BufferSource): string => {
  const decoder = new TextDecoder()
  return decoder.decode(buffer)
}

const encrypt = async (data: string, key: CryptoKey) => {
  const encoded = encode(data)
  const iv = generateIv()
  const cipher = await window.crypto.subtle.encrypt({
    name: 'AES-GCM',
    iv,
  }, key, encoded)
  return {
    cipher,
    iv,
  }
}

const decrypt = async (cipher: ArrayBuffer, key: CryptoKey, iv: ArrayBuffer): Promise<string> => {
  const encoded = await window.crypto.subtle.decrypt({
    name: 'AES-GCM',
    iv,
  }, key, cipher)
  return decode(encoded)
}

const pack = (buffer: ArrayBuffer): string => {
  return window.btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))),
  )
}

const unpack = (packed: string): ArrayBuffer => {
  const string = window.atob(packed)
  const buffer = new ArrayBuffer(string.length)
  const bufferView = new Uint8Array(buffer)
  for (let i = 0; i < string.length; i++)
    bufferView[i] = string.charCodeAt(i)

  return buffer
}

const exportKey = async (key: CryptoKey): Promise<string | undefined> => {
  return (await window.crypto.subtle.exportKey('jwk', key)).k
}

const importKey = async (key: string): Promise<CryptoKey> => {
  return await window.crypto.subtle.importKey(
    'jwk',
    { k: key, alg: 'A256GCM', ext: true, key_ops: ['encrypt', 'decrypt'], kty: 'oct' },
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )
}

export const encryptContent = async (content: string) => {
  const key = await generateKey()
  const { cipher, iv } = await encrypt(content, key)
  const exportedKey = await exportKey(key) as string

  return {
    key: exportedKey,
    content: [pack(cipher), pack(iv)].join(';'),
  }
}

export const decryptContent = async (key: string, content: string) => {
  const [cipher, iv] = content.split(';')

  const importedKey = await importKey(key)
  const unpackedCipher = unpack(cipher)
  const unpackedIv = unpack(iv)

  return await decrypt(unpackedCipher, importedKey, unpackedIv)
}
