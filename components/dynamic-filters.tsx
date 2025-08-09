"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useFilters } from "@/hooks/use-filters"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface FilterOption {
  label: string
  value: string
}

interface FilterData {
  categories?: FilterOption[]
  materials?: FilterOption[]
  sizes?: FilterOption[]
  colors?: FilterOption[]
  services?: FilterOption[]
  experiences?: FilterOption[]
  types?: FilterOption[]
  cities?: FilterOption[]
}

interface FilterDropdownProps {
  title: string
  filterKey: string
  options: FilterOption[]
  className?: string
}

function FilterDropdown({ title, filterKey, options, className }: FilterDropdownProps) {
  const { filters, updateFilter, isFilterActive } = useFilters()

  if (options.length === 0) return null

  return (
    <div className={cn("relative group", className)}>
      <Button
        variant="ghost"
        className={cn(
          "flex items-center gap-1",
          filters[filterKey] && "bg-teal-50 text-teal-700 border border-teal-200"
        )}
      >
        {title} <span className="text-xs">▼</span>
      </Button>
      <div className="absolute hidden group-hover:block z-10 bg-white shadow-lg rounded-md p-2 min-w-40 border">
        {/* Option pour effacer le filtre */}
        <button
          onClick={() => updateFilter(filterKey, null)}
          className={cn(
            "block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md text-sm",
            !filters[filterKey] && "bg-teal-50 text-teal-700"
          )}
        >
          Tous
        </button>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => updateFilter(filterKey, option.value)}
            className={cn(
              "block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md text-sm",
              isFilterActive(filterKey, option.value) && "bg-teal-50 text-teal-700"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface DynamicFiltersProps {
  type: 'products' | 'tailors'
}

export function DynamicFilters({ type }: DynamicFiltersProps) {
  const { filters, clearFilters, isLoading } = useFilters()
  const [filterData, setFilterData] = useState<FilterData>({})
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const endpoint = type === 'products' ? '/api/filters/products' : '/api/filters/tailors'
        const response = await fetch(endpoint)
        const data = await response.json()
        setFilterData(data)
      } catch (error) {
        console.error('Erreur lors du chargement des filtres:', error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchFilterData()
  }, [type])

  const productFilters = [
    {
      title: "Catégorie",
      filterKey: "category",
      options: filterData.categories || []
    },
    {
      title: "Matériau",
      filterKey: "material",
      options: filterData.materials || []
    },
    {
      title: "Taille",
      filterKey: "size",
      options: filterData.sizes || []
    },
    {
      title: "Couleur",
      filterKey: "color",
      options: filterData.colors || []
    }
  ]

  const tailorFilters = [
    {
      title: "Type",
      filterKey: "type",
      options: filterData.types || []
    }
  ]

  const currentFilters = type === 'products' ? productFilters : tailorFilters
  const hasActiveFilters = Object.keys(filters).length > 0

  if (dataLoading) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex space-x-4 items-center">
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex space-x-4 items-center">
        {isLoading && (
          <div className="h-4 w-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        )}

        {currentFilters.map((filter) => (
          <FilterDropdown
            key={filter.filterKey}
            title={filter.title}
            filterKey={filter.filterKey}
            options={filter.options}
          />
        ))}

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Effacer les filtres
          </Button>
        )}
      </div>

      <div className="flex space-x-2">
        <Link href="/">
          <Button
            variant={type === 'products' ? 'default' : 'outline'}
            className="rounded-full"
          >
            Rechercher des produits
          </Button>
        </Link>
        <Link href="/tailor">
          <Button
            variant={type === 'tailors' ? 'default' : 'outline'}
            className="rounded-full"
          >
            Rechercher des tailleurs
          </Button>
        </Link>
      </div>
    </div>
  )
}
