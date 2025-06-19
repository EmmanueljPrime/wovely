"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState } from "react"

export default function SellerProfile() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")
  const [isEditing, setIsEditing] = useState(false)

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
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your seller profile and business information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
              <p className="text-gray-600">{user?.seller?.business_name}</p>
              <button className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors">
                Change Photo
              </button>

              {user?.seller?.id && (
                  <button
                      onClick={() => window.open(`/tailor/${user.seller.id}`, "_blank")}
                      className="m-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors"
                  >
                    Visualiser mon profil
                  </button>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  {isEditing ? (
                      <input
                          type="text"
                          defaultValue={user?.seller?.business_name}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                  ) : (
                      <p className="text-gray-900">{user?.seller?.business_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                      <input
                          type="email"
                          defaultValue={user?.email}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                  ) : (
                      <p className="text-gray-900">{user?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                      <input
                          type="tel"
                          placeholder="Enter phone number"
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                  ) : (
                      <p className="text-gray-900">Not provided</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                      <input
                          type="text"
                          placeholder="Enter location"
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                  ) : (
                      <p className="text-gray-900">Not provided</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                  {isEditing ? (
                      <textarea
                          rows={4}
                          placeholder="Describe your business..."
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                  ) : (
                      <p className="text-gray-900">No description provided</p>
                  )}
                </div>
              </div>

              {isEditing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Business Settings</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>9:00 AM - 6:00 PM</option>
                  <option>8:00 AM - 8:00 PM</option>
                  <option>24/7</option>
                  <option>Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Within 1 hour</option>
                  <option>Within 24 hours</option>
                  <option>Within 48 hours</option>
                  <option>Within 1 week</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors">
                Update Settings
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}
