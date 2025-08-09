import sharp from 'sharp'

interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
}

export async function optimizeImage(
  buffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<Buffer> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 80,
    maxSizeKB = 500
  } = options

  try {
    let optimizedBuffer: Buffer
    let currentQuality = quality

    // Première optimisation avec les paramètres de base
    optimizedBuffer = await sharp(buffer)
      .resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: currentQuality })
      .toBuffer()

    // Si l'image est encore trop grosse, on réduit la qualité progressivement
    while (optimizedBuffer.length > maxSizeKB * 1024 && currentQuality > 20) {
      currentQuality -= 10
      optimizedBuffer = await sharp(buffer)
        .resize({
          width: maxWidth,
          height: maxHeight,
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: currentQuality })
        .toBuffer()
    }

    // Si c'est encore trop gros, on réduit les dimensions
    if (optimizedBuffer.length > maxSizeKB * 1024) {
      let currentWidth = Math.floor(maxWidth * 0.8)
      let currentHeight = Math.floor(maxHeight * 0.8)

      while (optimizedBuffer.length > maxSizeKB * 1024 && currentWidth > 300) {
        optimizedBuffer = await sharp(buffer)
          .resize({
            width: currentWidth,
            height: currentHeight,
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: Math.max(currentQuality, 60) })
          .toBuffer()

        currentWidth = Math.floor(currentWidth * 0.9)
        currentHeight = Math.floor(currentHeight * 0.9)
      }
    }

    return optimizedBuffer
  } catch (error) {
    console.error('Erreur Sharp, utilisation du buffer original:', error)
    // En cas d'erreur avec Sharp, retourner le buffer original
    return buffer
  }
}

export function getOptimizedFileName(originalName: string, timestamp: number, index: number): string {
  // Enlever l'extension et nettoyer le nom
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "")
  const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, '_')

  // Retourner avec l'extension .webp
  return `${timestamp}-${index}-${cleanName}.webp`
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Vérifier le type de fichier
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format non supporté. Utilisez JPG, PNG ou WebP.'
    }
  }

  // Vérifier la taille (limite à 10MB pour le fichier original)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image trop grande. Maximum 10MB avant optimisation.'
    }
  }

  return { valid: true }
}
