"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useFilters } from "@/hooks/use-filters"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Check } from "lucide-react"

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
  const { filters, updateFilter, isFilterActive, getActiveFilterCount } = useFilters()
  const [isOpen, setIsOpen] = useState(false)

  if (options.length === 0) return null

  const activeCount = getActiveFilterCount(filterKey)

  const handleOptionToggle = (value: string) => {
    const action = isFilterActive(filterKey, value) ? 'remove' : 'add'
    updateFilter(filterKey, value, action)
  }

  const handleClearFilter = () => {
    updateFilter(filterKey, null, 'clear')
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        className={cn(
          "flex items-center gap-2 h-10",
          activeCount > 0 && "bg-teal-50 text-teal-700 border-teal-200"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {activeCount > 0 && (
          <span className="bg-teal-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <span className={cn("text-xs transition-transform", isOpen && "rotate-180")}>▼</span>
      </Button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown content */}
          <div className="absolute top-full left-0 z-20 bg-white shadow-lg rounded-md p-3 min-w-[200px] border mt-1 max-h-60 overflow-y-auto">
            {/* Option pour effacer le filtre */}
            {activeCount > 0 && (
              <>
                <button
                  onClick={handleClearFilter}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-red-600 font-medium"
                >
                  Effacer les sélections
                </button>
                <hr className="my-2" />
              </>
            )}

            {/* Options avec checkboxes */}
            <div className="space-y-1">
              {options.map((option) => {
                const isSelected = isFilterActive(filterKey, option.value)
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
                  >
                    <div className={cn(
                      "w-4 h-4 border-2 rounded flex items-center justify-center",
                      isSelected
                        ? "bg-teal-600 border-teal-600"
                        : "border-gray-300 bg-white"
                    )}>
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span
                      className={cn(
                        isSelected && "text-teal-700 font-medium"
                      )}
                    >
                      {option.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleOptionToggle(option.value)}
                      className="sr-only"
                    />
                  </label>
                )
              })}
            </div>
          </div>
        </>
      )}
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
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
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
            Effacer tous les filtres
          </Button>
        )}
      </div>

      <div className="flex space-x-2">
        {/*<Link href="/">*/}
        {/*  <Button*/}
        {/*    variant={type === 'products' ? 'default' : 'outline'}*/}
        {/*    className="rounded-full"*/}
        {/*  >*/}
        {/*    Rechercher des produits*/}
        {/*  </Button>*/}
        {/*</Link>*/}
        {/*<Link href="/tailor">*/}
        {/*  <Button*/}
        {/*    variant={type === 'tailors' ? 'default' : 'outline'}*/}
        {/*    className="rounded-full"*/}
        {/*  >*/}
        {/*    Rechercher des tailleurs*/}
        {/*  </Button>*/}
        {/*</Link>*/}
      </div>
    </div>
  )
}
