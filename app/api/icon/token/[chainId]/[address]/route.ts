import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { chainId: string, address: `0x${string}` } }
) {

  const { chainId, address } = params

  // Check if the local image exists
  const localImagePath = path.join(process.cwd(), 'public', 'token', chainId, address, 'logo-128.png')

  try {
    await fs.access(localImagePath)
    // If the file exists, serve it
    const imageBuffer = await fs.readFile(localImagePath)
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    // If the file doesn't exist, relay the external image
    const smolAssets = process.env.SMOL_ASSETS_URL
    const externalImageUrl = `${smolAssets}/token/${chainId}/${address}/logo-128.png`

    const response = await fetch(externalImageUrl)

    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 })
    }

    const imageBuffer = await response.arrayBuffer()
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}
