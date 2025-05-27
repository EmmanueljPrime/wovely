"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState } from "react"

export default function SellerAccountSettings() {
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
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security settings</p>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  {isEditing ? (
                      <input
                          type="text"
                          defaultValue={user?.name}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                  ) : (
                      <p className="text-gray-900">{user?.name}</p>
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

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications about orders and messages</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-teal-600" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive urgent notifications via SMS</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-teal-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Marketing Emails</p>
                    <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-teal-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow border-red-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Delete Account</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
