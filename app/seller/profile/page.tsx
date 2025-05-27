"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Edit, Save, Plus } from "lucide-react"

export default function SellerProfile() {
  // Sample profile data
  const [profile, setProfile] = useState({
    name: "Melissa Peters",
    specialty: "Custom Tailoring",
    location: "Paris, France",
    followers: "67K",
    sales: "67",
    rating: "9.5/10",
    bio: "Professional tailor with over 10 years of experience specializing in custom suits and formal wear. Dedicated to providing high-quality tailoring services with attention to detail and customer satisfaction.",
    services: [
      { id: 1, name: "Custom Suits", icon: "mobile" },
      { id: 2, name: "Alterations", icon: "mobile" },
      { id: 3, name: "Formal Wear", icon: "mobile" },
      { id: 4, name: "Wedding Attire", icon: "desktop" },
      { id: 5, name: "Repairs", icon: "desktop" },
      { id: 6, name: "Consultations", icon: "desktop" },
    ],
    products: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: "Product Name",
      price: "XXX.00",
      image: "/placeholder.svg?height=200&width=200",
    })),
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  return (
    <div className="p-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6">
              {/* Profile Header */}
              <div className="mb-8">
                <div className="bg-gray-100 h-40 rounded-t-lg"></div>
                <div className="flex flex-col items-center -mt-20">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=150&width=150"
                      alt={profile.name}
                      width={150}
                      height={150}
                      className="rounded-full border-4 border-white bg-white"
                    />
                    {!isEditing && (
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 bg-white text-gray-700 border shadow-sm hover:bg-gray-100"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="w-full max-w-md mt-4 space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={editedProfile.name} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input
                          id="specialty"
                          name="specialty"
                          value={editedProfile.specialty}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" value={editedProfile.location} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" value={editedProfile.bio} onChange={handleChange} rows={4} />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold mt-4">{profile.name}</h1>
                      <p className="text-gray-600">{profile.specialty}</p>
                      <div className="flex items-center mt-2">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-gray-600 text-sm">{profile.location}</span>
                      </div>

                      <div className="flex justify-center gap-8 mt-6">
                        <div className="text-center">
                          <p className="text-xl font-bold">{profile.followers}</p>
                          <p className="text-sm text-gray-600">Followers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">{profile.sales}</p>
                          <p className="text-sm text-gray-600">Sales</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">{profile.rating}</p>
                          <p className="text-sm text-gray-600">Rating</p>
                        </div>
                      </div>

                      <div className="mt-6 text-center max-w-md">
                        <h3 className="font-semibold mb-2">About</h3>
                        <p className="text-gray-600">{profile.bio}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Products</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {profile.products.map((product) => (
                  <div key={product.id} className="group relative">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="mr-2">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium">{product.name}</h3>
                      <p className="text-sm font-bold">$ {product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Services</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {profile.services.map((service) => (
                  <div
                    key={service.id}
                    className="border rounded-lg p-4 flex flex-col items-center justify-center text-center group relative"
                  >
                    {service.icon === "mobile" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
                        <path d="M12 18h.01"></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <rect width="20" height="14" x="2" y="3" rx="2" ry="2"></rect>
                        <line x1="8" x2="16" y1="21" y2="21"></line>
                        <line x1="12" x2="12" y1="17" y2="21"></line>
                      </svg>
                    )}
                    <p className="mt-2 text-sm">{service.name}</p>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
