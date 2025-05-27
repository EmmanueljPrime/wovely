"use client"

import { useRequireRole } from "@/hooks/use-auth"
import Link from "next/link"

export default function SellerCatalogs() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
    )
  }

  if (!hasCorrectRole) {
    return null
  }

  return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Catalogs</h1>
          <p className="text-gray-600">Manage your product catalogs and collections</p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>All Catalogs</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
            <input
                type="search"
                placeholder="Search catalogs..."
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <Link href="/seller/catalogs/new">
            <button className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors">
              New Catalog
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">No catalogs yet</p>
              <p className="text-gray-500 mb-4">Create your first catalog to showcase your products.</p>
              <Link href="/seller/catalogs/new">
                <button className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors">
                  Create Catalog
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
  )
}
