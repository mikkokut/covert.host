import crypto from 'crypto'
import add from 'date-fns/add/index.js'
import { useSupabase } from '../utils/supabase'

interface UploadRequest {
  content: string
}

export default defineEventHandler(async (event) => {
  const { content } = await readBody<UploadRequest>(event)
  if (!content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request',
      message: 'Content is required',
    })
  }

  if (content.length > 2500) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request',
      message: 'Content must be less than 2500 characters',
    })
  }

  const hash = crypto.randomBytes(16).toString('hex')
  const response = await useSupabase().from('secrets').insert({
    content,
    hash,
    expires_at: add(new Date(), { days: 14 }).toISOString(),
  })

  if (response.error) {
    console.error(response.error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }

  return {
    hash,
  }
})
