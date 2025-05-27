"use client"

import type React from "react"

import { useRequireRole } from "@/hooks/use-auth"
import { useState } from "react"
import Link from "next/link"

export default function NewCatalog() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")
  const [catalogData, setCatalogData] = useState({
    name: "",
    description: "",
    category: "",
    status: "draft",
  })

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle catalog creation
    console.log("Creating catalog:", catalogData)
  }

  return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Link href="/seller/catalogs" className="hover:text-teal-600">
              Catalogs
            </Link>
            <span>/</span>
            <span>New Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Catalog</h1>
          <p className="text-gray-600">Add a new catalog to showcase your products</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catalog Name</label>
                <input
                    type="text"
                    required
                    value={catalogData.name}
                    onChange={(e) => setCatalogData({ ...catalogData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter catalog name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                    rows={4}
                    value={catalogData.description}
                    onChange={(e) => setCatalogData({ ...catalogData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Describe your catalog"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                    value={catalogData.category}
                    onChange={(e) => setCatalogData({ ...catalogData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select a category</option>
                  <option value="suits">Suits</option>
                  <option value="dresses">Dresses</option>
                  <option value="shirts">Shirts</option>
                  <option value="pants">Pants</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                    value={catalogData.status}
                    onChange={(e) => setCatalogData({ ...catalogData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <Link href="/seller/catalogs">
                <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors"
              >
                Create Catalog
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}
