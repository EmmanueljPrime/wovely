"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export interface FilterState {
  [key: string]: string | string[]
}

export function useFilters(initialFilters: FilterState = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [isLoading, setIsLoading] = useState(false)

  // Initialiser les filtres depuis l'URL au chargement
  useEffect(() => {
    const urlFilters: FilterState = {}
    searchParams.forEach((value, key) => {
      urlFilters[key] = value
    })
    setFilters(prev => ({ ...prev, ...urlFilters }))
  }, [searchParams])

  // Mettre à jour un filtre
  const updateFilter = (key: string, value: string | null) => {
    setIsLoading(true)

    const newFilters = { ...filters }

    if (value === null || value === '') {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }

    setFilters(newFilters)

    // Construire la nouvelle URL avec les paramètres
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== '') {
        params.set(k, Array.isArray(v) ? v.join(',') : v)
      }
    })

    const queryString = params.toString()
    const newUrl = `${pathname}${queryString ? `?${queryString}` : ''}`

    // Navigation sans rechargement de page
    router.replace(newUrl, { scroll: false })

    // Simuler un petit délai pour l'UX
    setTimeout(() => setIsLoading(false), 200)
  }

  // Réinitialiser tous les filtres
  const clearFilters = () => {
    setFilters({})
    router.replace(pathname, { scroll: false })
  }

  // Vérifier si un filtre est actif
  const isFilterActive = (key: string, value: string) => {
    return filters[key] === value
  }

  return {
    filters,
    updateFilter,
    clearFilters,
    isFilterActive,
    isLoading
  }
}
