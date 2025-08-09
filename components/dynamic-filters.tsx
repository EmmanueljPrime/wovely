"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useFilters } from "@/hooks/use-filters"
import { cn } from "@/lib/utils"

interface FilterOption {
  label: string
  value: string
}

interface FilterDropdownProps {
  title: string
  filterKey: string
  options: FilterOption[]
  className?: string
}

function FilterDropdown({ title, filterKey, options, className }: FilterDropdownProps) {
  const { filters, updateFilter, isFilterActive } = useFilters()

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

  const productFilters = [
    {
      title: "Clothing",
      filterKey: "category",
      options: [
        { label: "Robes", value: "Robes" },
        { label: "Pants", value: "Pants" },
        { label: "Jackets", value: "Jackets" },
        { label: "Shirts", value: "Shirts" },
        { label: "Dresses", value: "Dresses" }
      ]
    },
    {
      title: "Material",
      filterKey: "material",
      options: [
        { label: "Cotton", value: "Cotton" },
        { label: "Wool", value: "Wool" },
        { label: "Silk", value: "Silk" },
        { label: "Linen", value: "Linen" },
        { label: "Polyester", value: "Polyester" }
      ]
    },
    {
      title: "Size",
      filterKey: "size",
      options: [
        { label: "XS", value: "XS" },
        { label: "S", value: "S" },
        { label: "M", value: "M" },
        { label: "L", value: "L" },
        { label: "XL", value: "XL" },
        { label: "XXL", value: "XXL" }
      ]
    },
    {
      title: "Color",
      filterKey: "color",
      options: [
        { label: "Black", value: "Black" },
        { label: "White", value: "White" },
        { label: "Blue", value: "Blue" },
        { label: "Red", value: "Red" },
        { label: "Green", value: "Green" },
        { label: "Gray", value: "Gray" }
      ]
    }
  ]

  const tailorFilters = [
    {
      title: "Services",
      filterKey: "services",
      options: [
        { label: "Alterations", value: "alterations" },
        { label: "Custom Clothing", value: "custom" },
        { label: "Repairs", value: "repairs" },
        { label: "All Services", value: "all" }
      ]
    },
    {
      title: "Experience",
      filterKey: "experience",
      options: [
        { label: "1-3 years", value: "1-3" },
        { label: "3-5 years", value: "3-5" },
        { label: "5-10 years", value: "5-10" },
        { label: "10+ years", value: "10+" }
      ]
    },
    {
      title: "Type",
      filterKey: "type",
      options: [
        { label: "Individual", value: "individual" },
        { label: "Professional", value: "professional" }
      ]
    },
    {
      title: "Location",
      filterKey: "city",
      options: [
        { label: "Paris", value: "Paris" },
        { label: "Lyon", value: "Lyon" },
        { label: "Marseille", value: "Marseille" },
        { label: "Toulouse", value: "Toulouse" },
        { label: "Nice", value: "Nice" },
        { label: "Nantes", value: "Nantes" }
      ]
    }
  ]

  const currentFilters = type === 'products' ? productFilters : tailorFilters
  const hasActiveFilters = Object.keys(filters).length > 0

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
            Clear Filters
          </Button>
        )}
      </div>

      <div className="flex space-x-2">
        <Link href="/">
          <Button
            variant={type === 'products' ? 'default' : 'outline'}
            className="rounded-full"
          >
            Search Product
          </Button>
        </Link>
        <Link href="/tailor">
          <Button
            variant={type === 'tailors' ? 'default' : 'outline'}
            className="rounded-full"
          >
            Search Tailor
          </Button>
        </Link>
      </div>
    </div>
  )
}
