"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Euro,
  Calendar,
  Upload,
  X,
  Save,
  MoreVertical
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Product {
  id: number
  name: string
  description: string
  price: number
  created_at: string
  updated_at: string
  images: { id: number; url: string }[]
  category: { id: string; name: string } | null
  material: { id: string; name: string } | null
  size: { id: string; name: string } | null
  color: { id: string; name: string } | null
  stockBySize: { quantity: number }[]
}

interface FilterData {
  categories: { id: string; name: string }[]
  materials: { id: string; name: string }[]
  sizes: { id: string; name: string }[]
  colors: { id: string; name: string }[]
}

export default function SellerCatalogs() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Filter data
  const [filterData, setFilterData] = useState<FilterData>({
    categories: [],
    materials: [],
    sizes: [],
    colors: []
  })

  // Edit form data
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    materialId: "",
    sizeId: "",
    colorId: "",
    stock: ""
  })
  const [newImages, setNewImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  useEffect(() => {
    if (hasCorrectRole) {
      fetchProducts()
      fetchFilterData()
    }
  }, [hasCorrectRole])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, selectedCategory, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/seller/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des produits",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchFilterData = async () => {
    try {
      const [categoriesRes, materialsRes, sizesRes, colorsRes] = await Promise.all([
        fetch('/api/products/categories'),
        fetch('/api/products/materials'),
        fetch('/api/products/sizes'),
        fetch('/api/products/colors')
      ])

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setFilterData(prev => ({ ...prev, categories: categoriesData }))
      }
      if (materialsRes.ok) {
        const materialsData = await materialsRes.json()
        setFilterData(prev => ({ ...prev, materials: materialsData }))
      }
      if (sizesRes.ok) {
        const sizesData = await sizesRes.json()
        setFilterData(prev => ({ ...prev, sizes: sizesData }))
      }
      if (colorsRes.ok) {
        const colorsData = await colorsRes.json()
        setFilterData(prev => ({ ...prev, colors: colorsData }))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des filtres:', error)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" ||
                             product.category?.id === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "price-high":
          return b.price - a.price
        case "price-low":
          return a.price - b.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product)
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      categoryId: product.category?.id || "",
      materialId: product.material?.id || "",
      sizeId: product.size?.id || "",
      colorId: product.color?.id || "",
      stock: product.stockBySize?.[0]?.quantity?.toString() || "0"
    })
    setEditModalOpen(true)
  }

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setNewImages(files)
      const urls = files.map(file => URL.createObjectURL(file))
      setImagePreviewUrls(urls)
    }
  }

  const removeNewImage = (index: number) => {
    const updatedImages = newImages.filter((_, i) => i !== index)
    const updatedUrls = imagePreviewUrls.filter((_, i) => i !== index)
    setNewImages(updatedImages)
    setImagePreviewUrls(updatedUrls)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('name', editFormData.name)
      formData.append('description', editFormData.description)
      formData.append('price', editFormData.price)
      formData.append('categoryId', editFormData.categoryId)
      formData.append('materialId', editFormData.materialId)
      formData.append('sizeId', editFormData.sizeId)
      formData.append('colorId', editFormData.colorId)
      formData.append('stock', editFormData.stock)

      // Ajouter les nouvelles images s'il y en a
      newImages.forEach((image, index) => {
        formData.append(`newImages`, image)
      })

      const response = await fetch(`/api/products/${selectedProduct.id}/edit`, {
        method: 'PUT',
        body: formData
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Produit modifié avec succès !",
        })
        setEditModalOpen(false)
        fetchProducts()
        setNewImages([])
        setImagePreviewUrls([])
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la modification')
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProduct) return

    setSubmitting(true)

    try {
      const response = await fetch(`/api/products/${selectedProduct.id}/delete`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Produit supprimé avec succès !",
        })
        setDeleteDialogOpen(false)
        fetchProducts()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la suppression')
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getTotalStock = (product: Product) => {
    return product.stockBySize?.reduce((total, stock) => total + stock.quantity, 0) || 0
  }

  const getTotalValue = () => {
    return products.reduce((sum, p) => sum + Number(p.price), 0)
  }

  const formatPrice = (price: number | string) => {
    return Number(price).toFixed(2)
  }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Package className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Mes Produits</h1>
                <p className="text-teal-100 text-lg">
                  Gérez votre catalogue de produits
                </p>
              </div>
            </div>
            <Link href="/seller/catalogs/create">
              <Button className="bg-white text-teal-600 hover:bg-gray-50 font-semibold px-6 py-3">
                <Plus className="h-5 w-5 mr-2" />
                Nouveau produit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 -mt-6 relative z-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Package className="h-8 w-8 text-teal-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
            <p className="text-gray-600">Produits</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Euro className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              {getTotalValue().toFixed(2)}€
            </h3>
            <p className="text-gray-600">Valeur totale</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              {products.reduce((sum, p) => sum + getTotalStock(p), 0)}
            </h3>
            <p className="text-gray-600">Stock total</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              {products.filter(p => new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </h3>
            <p className="text-gray-600">Ce mois</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 h-10 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 h-10 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                  <Filter className="h-4 w-4 mr-2 text-teal-600" />
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {filterData.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-10 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récent</SelectItem>
                  <SelectItem value="oldest">Plus ancien</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="name">Nom A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-gray-600">
                {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos produits...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden">
                <CardHeader className="p-0 relative">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={product.images[0]?.url || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                    />

                    {/* Actions Dropdown */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white shadow-md">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(`/product/${product.id}`, "_blank")}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(product)}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(product)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute bottom-3 left-3">
                      <Badge
                        variant={getTotalStock(product) > 5 ? "default" : getTotalStock(product) > 0 ? "secondary" : "destructive"}
                        className="bg-white/90 text-gray-900"
                      >
                        Stock: {getTotalStock(product)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-teal-600">
                      {formatPrice(product.price)}€
                    </span>
                    {product.category && (
                      <Badge variant="outline" className="text-xs">
                        {product.category.name}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.material && (
                      <Badge variant="secondary" className="text-xs">
                        {product.material.name}
                      </Badge>
                    )}
                    {product.size && (
                      <Badge variant="secondary" className="text-xs">
                        {product.size.name}
                      </Badge>
                    )}
                    {product.color && (
                      <Badge variant="secondary" className="text-xs">
                        {product.color.name}
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Créé le {new Date(product.created_at).toLocaleDateString("fr-FR")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchTerm || selectedCategory !== "all"
                  ? "Aucun produit trouvé"
                  : "Aucun produit pour le moment"
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== "all"
                  ? "Essayez de modifier vos critères de recherche."
                  : "Créez votre premier produit pour commencer à vendre."
                }
              </p>
              {searchTerm || selectedCategory !== "all" ? (
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Effacer les filtres
                </Button>
              ) : (
                <Link href="/seller/catalogs/create">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer mon premier produit
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Edit3 className="h-6 w-6 text-teal-600" />
              Modifier le produit
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom du produit *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Prix (€) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Catégorie *</Label>
                <Select value={editFormData.categoryId} onValueChange={(value) => setEditFormData(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterData.categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-material">Matériau *</Label>
                <Select value={editFormData.materialId} onValueChange={(value) => setEditFormData(prev => ({ ...prev, materialId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un matériau" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterData.materials.map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-size">Taille *</Label>
                <Select value={editFormData.sizeId} onValueChange={(value) => setEditFormData(prev => ({ ...prev, sizeId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une taille" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterData.sizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-color">Couleur *</Label>
                <Select value={editFormData.colorId} onValueChange={(value) => setEditFormData(prev => ({ ...prev, colorId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une couleur" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterData.colors.map((color) => (
                      <SelectItem key={color.id} value={color.id}>
                        {color.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock</Label>
              <Input
                id="edit-stock"
                type="number"
                min="0"
                value={editFormData.stock}
                onChange={(e) => setEditFormData(prev => ({ ...prev, stock: e.target.value }))}
              />
            </div>

            {/* Current Images */}
            {selectedProduct && selectedProduct.images.length > 0 && (
              <div className="space-y-2">
                <Label>Images actuelles</Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedProduct.images.map((image, index) => (
                    <div key={image.id} className="relative">
                      <Image
                        src={image.url}
                        alt={`Image ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <div className="space-y-4">
              <Label>Ajouter de nouvelles images (optionnel)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="edit-images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="edit-images"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Cliquez pour ajouter des images
                  </span>
                </label>
              </div>

              {/* Preview new images */}
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={url}
                        alt={`Nouvelle image ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                className="flex-1"
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Modification...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le produit "{selectedProduct?.name}" sera définitivement supprimé de votre catalogue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Suppression...
                </div>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

