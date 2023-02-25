import { useSupabase } from '../utils/supabase'

interface DownloadRequest {
  hash: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<DownloadRequest>(event)
  if (!body?.hash) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request',
      message: 'Hash is required field',
    })
  }

  const secretResponse = await useSupabase()
    .from('secrets')
    .select('content')
    .eq('hash', body.hash)
    .gte('expires_at', new Date().toISOString())
    .limit(1)

  if (secretResponse.error) {
    console.error(secretResponse.error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }

  if (!secretResponse.data[0]?.content) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not found',
    })
  }

  return {
    hash: body.hash,
    content: secretResponse?.data[0]?.content,
  }
})
