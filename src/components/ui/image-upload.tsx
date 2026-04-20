'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, AlertCircle, Check } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  maxFiles?: number
  maxSizeMB?: number
  onFilesSelected: (files: File[]) => void
  onFileRemoved?: (index: number) => void
  existingImages?: string[]
}

interface PreviewFile {
  file: File
  preview: string
  id: string
}

export function ImageUpload({
  maxFiles = 5,
  maxSizeMB = 2,
  onFilesSelected,
  onFileRemoved,
  existingImages = [],
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<PreviewFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return `${file.name} no es una imagen válida`
    }
    if (file.size > maxSizeBytes) {
      return `${file.name} excede el límite de ${maxSizeMB}MB`
    }
    return null
  }

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      img.onload = () => {
        // Calcular nuevas dimensiones (max 800px)
        let width = img.width
        let height = img.height
        const maxDim = 800

        if (width > height && width > maxDim) {
          height = (height * maxDim) / width
          width = maxDim
        } else if (height > maxDim) {
          width = (width * maxDim) / height
          height = maxDim
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/jpeg',
          0.8
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const processFiles = useCallback(async (files: FileList) => {
    const newErrors: string[] = []
    const validFiles: File[] = []
    const newPreviews: PreviewFile[] = []

    // Verificar límite total
    const totalFiles = previews.length + files.length
    if (totalFiles > maxFiles) {
      setErrors([`Máximo ${maxFiles} imágenes permitidas`])
      return
    }

    for (const file of Array.from(files)) {
      const error = validateFile(file)
      if (error) {
        newErrors.push(error)
        continue
      }

      // Comprimir imagen
      const compressedFile = await compressImage(file)
      validFiles.push(compressedFile)

      // Crear preview
      const preview = URL.createObjectURL(compressedFile)
      newPreviews.push({
        file: compressedFile,
        preview,
        id: Math.random().toString(36).substr(2, 9),
      })
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setTimeout(() => setErrors([]), 5000)
    }

    if (validFiles.length > 0) {
      setPreviews((prev) => [...prev, ...newPreviews])
      onFilesSelected(validFiles)
    }
  }, [maxFiles, maxSizeBytes, onFilesSelected, previews.length])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer.files.length > 0) {
        await processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        await processFiles(e.target.files)
      }
    },
    [processFiles]
  )

  const removeFile = useCallback(
    (index: number) => {
      const preview = previews[index]
      if (preview) {
        URL.revokeObjectURL(preview.preview)
        setPreviews((prev) => prev.filter((_, i) => i !== index))
        onFileRemoved?.(index)
      }
    },
    [previews, onFileRemoved]
  )

  const openFileDialog = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {errors.map((error, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20 text-sm text-[#ef4444]"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop Zone */}
      <motion.div
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`
          relative p-8 rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-300 overflow-hidden
          ${
            isDragging
              ? 'border-[#ff6b35] bg-[#ff6b35]/10'
              : 'border-white/20 bg-[#0a0a0a] hover:border-white/40'
          }
          ${previews.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {/* Background glow effect */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isDragging ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle at center, rgba(255, 107, 53, 0.1) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{
              y: isDragging ? -5 : 0,
              scale: isDragging ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`
              h-16 w-16 rounded-2xl flex items-center justify-center mb-4
              transition-colors duration-300
              ${isDragging ? 'bg-[#ff6b35]/20' : 'bg-white/5'}
            `}
          >
            <Upload
              className={`h-8 w-8 transition-colors duration-300 ${
                isDragging ? 'text-[#ff6b35]' : 'text-[#a1a1a1]'
              }`}
            />
          </motion.div>

          <p className="text-white font-medium mb-2">
            {isDragging ? 'Suelta las imágenes aquí' : 'Arrastra imágenes aquí'}
          </p>
          <p className="text-[#a1a1a1] text-sm mb-1">o haz click para seleccionar</p>
          <p className="text-[#525252] text-xs">
            Máximo {maxFiles} imágenes, hasta {maxSizeMB}MB cada una
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
          disabled={previews.length >= maxFiles}
        />
      </motion.div>

      {/* Preview Grid */}
      <AnimatePresence>
        {(previews.length > 0 || existingImages.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 sm:grid-cols-4 gap-3"
          >
            {/* Existing images */}
            {existingImages.map((image, index) => (
              <motion.div
                key={`existing-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group"
              >
                <Image
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-white">Guardada</span>
                </div>
              </motion.div>
            ))}

            {/* New previews */}
            {previews.map((preview, index) => (
              <motion.div
                key={preview.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group"
              >
                <Image
                  src={preview.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Remove button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-[#ef4444] text-white
                           opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </motion.button>

                {/* Success indicator */}
                <div className="absolute bottom-2 left-2 p-1 rounded-full bg-[#22c55e]/80 text-white">
                  <Check className="h-3 w-3" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File counter */}
      <div className="flex items-center justify-between text-xs text-[#525252]">
        <span>
          {previews.length + existingImages.length} de {maxFiles} imágenes
        </span>
        {previews.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              previews.forEach((p) => URL.revokeObjectURL(p.preview))
              setPreviews([])
            }}
            className="text-[#ef4444] hover:text-[#ef4444]/80"
          >
            Limpiar todas
          </motion.button>
        )}
      </div>
    </div>
  )
}
