"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export interface FilterState {
  [key: string]: string[]
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
      // Convertir les valeurs séparées par des virgules en tableaux
      urlFilters[key] = value.split(',').filter(v => v.trim() !== '')
    })
    setFilters(urlFilters)
  }, [searchParams])

  // Mettre à jour un filtre avec support multi-sélection
  const updateFilter = (key: string, value: string | null, action: 'add' | 'remove' | 'clear' = 'add') => {
    setIsLoading(true)

    const newFilters = { ...filters }

    if (action === 'clear' || value === null) {
      // Supprimer complètement le filtre
      delete newFilters[key]
    } else {
      // Initialiser le tableau si il n'existe pas
      if (!newFilters[key]) {
        newFilters[key] = []
      }

      if (action === 'add') {
        // Ajouter la valeur si elle n'existe pas déjà
        if (!newFilters[key].includes(value)) {
          newFilters[key] = [...newFilters[key], value]
        }
      } else if (action === 'remove') {
        // Supprimer la valeur
        newFilters[key] = newFilters[key].filter(v => v !== value)
        // Supprimer le filtre complètement si le tableau est vide
        if (newFilters[key].length === 0) {
          delete newFilters[key]
        }
      }
    }

    setFilters(newFilters)

    // Construire la nouvelle URL avec les paramètres
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v.length > 0) {
        params.set(k, v.join(','))
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
    return filters[key]?.includes(value) || false
  }

  // Obtenir le nombre de filtres actifs pour un filtre donné
  const getActiveFilterCount = (key: string) => {
    return filters[key]?.length || 0
  }

  return {
    filters,
    updateFilter,
    clearFilters,
    isFilterActive,
    getActiveFilterCount,
    isLoading
  }
}
