'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ImageIcon } from 'lucide-react'

interface PortfolioGalleryProps {
  images: string[]
  artistName: string
}

export function PortfolioGallery({ images, artistName }: PortfolioGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Si no hay imágenes, mostrar estado vacío
  if (!images || images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-6 text-center"
      >
        <div className="h-20 w-20 rounded-2xl bg-[#ff6b35]/10 flex items-center justify-center mb-6">
          <ImageIcon className="h-10 w-10 text-[#ff6b35]" />
        </div>
        <h3 className="font-display text-xl font-bold text-white mb-2">
          Portfolio en construcción
        </h3>
        <p className="text-[#a1a1a1] text-sm max-w-md">
          {artistName} aún no ha subido imágenes de su trabajo.
          Vuelve pronto para ver su increíble portfolio.
        </p>
      </motion.div>
    )
  }

  // Distribuir imágenes en columnas masonry
  // Patrón: alternar entre diferentes alturas para efecto visual
  const getImageHeight = (index: number) => {
    const patterns = ['aspect-square', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-[3/5]']
    return patterns[index % patterns.length]
  }

  // Determinar si la imagen debe expandirse (cada 5ta imagen)
  const isFeatured = (index: number) => index % 5 === 0

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className={`break-inside-avoid ${isFeatured(index) ? 'sm:col-span-2' : ''}`}
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group relative overflow-hidden rounded-xl cursor-pointer card-glow"
              onClick={() => setSelectedImage(index)}
            >
              {/* Image Container */}
              <div className={`relative ${getImageHeight(index)} overflow-hidden rounded-xl border border-white/10 bg-[#141414]`}>
                <Image
                  src={image}
                  alt={`${artistName} portfolio ${index + 1}`}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Glow Effect on Hover - Intense */}
                <div className="absolute inset-0 rounded-xl ring-2 ring-[#ff6b35]/0 group-hover:ring-[#ff6b35]/60 transition-all duration-500 pointer-events-none" />

                {/* Outer Glow */}
                <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 107, 53, 0.3) 0%, transparent 70%)'
                  }}
                />

                {/* Inner Glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none inner-glow-intense" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <motion.div
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                    className="transform transition-transform duration-500"
                  >
                    <p className="text-white font-medium text-lg">
                      Trabajo #{index + 1}
                    </p>
                    <p className="text-[#a1a1a1] text-sm mt-1">
                      Click para ver más
                    </p>
                  </motion.div>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <ZoomIn className="h-4 w-4 text-white" />
                </div>

                {/* Featured Badge */}
                {isFeatured(index) && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#ff6b35]/90 text-black text-xs font-bold uppercase tracking-wider">
                    Destacado
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6 text-white" />
            </motion.button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedImage]}
                alt={`${artistName} portfolio ${selectedImage + 1}`}
                fill
                className="object-contain rounded-xl"
                sizes="100vw"
                priority
              />

              {/* Image Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            </motion.div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage(prev => prev !== null && prev > 0 ? prev - 1 : images.length - 1)
                  }}
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage(prev => prev !== null && prev < images.length - 1 ? prev + 1 : 0)
                  }}
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
