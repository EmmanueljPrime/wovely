"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Upload, X, Plus } from "lucide-react"

interface Category {
  id: number
  name: string
}

interface Material {
  id: number
  name: string
}

interface Size {
  id: number
  name: string
}

interface Color {
  id: number
  name: string
}

interface ProductFormData {
  name: string
  description: string
  price: string
  categoryId: string
  materialId: string
  colorId: string
  images: File[]
  stockBySizes: { [sizeId: string]: number } // Nouvelle structure pour les stocks par taille
}

export default function CreateProductPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    materialId: "",
    colorId: "",
    images: [],
    stockBySizes: {} // Initialiser avec un objet vide
  })

  // Charger les données de référence
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [categoriesRes, materialsRes, sizesRes, colorsRes] = await Promise.all([
          fetch('/api/products/categories'),
          fetch('/api/products/materials'),
          fetch('/api/products/sizes'),
          fetch('/api/products/colors')
        ])

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }
        if (materialsRes.ok) {
          const materialsData = await materialsRes.json()
          setMaterials(materialsData)
        }
        if (sizesRes.ok) {
          const sizesData = await sizesRes.json()
          setSizes(sizesData)
        }
        if (colorsRes.ok) {
          const colorsData = await colorsRes.json()
          setColors(colorsData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }

    fetchReferenceData()
  }, [])

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    console.log(`Mise à jour du champ ${field}:`, value)
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      console.log('FormData mis à jour:', newData)
      return newData
    })
  }

  // Nouvelle fonction pour gérer les stocks par taille
  const handleStockChange = (sizeId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      stockBySizes: {
        ...prev.stockBySizes,
        [sizeId]: quantity
      }
    }))
  }

  // Fonction pour supprimer un stock par taille
  const removeStockForSize = (sizeId: string) => {
    setFormData(prev => {
      const newStockBySizes = { ...prev.stockBySizes }
      delete newStockBySizes[sizeId]
      return {
        ...prev,
        stockBySizes: newStockBySizes
      }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Valider chaque fichier
      const validFiles: File[] = []
      const errors: string[] = []

      for (const file of files) {
        // Vérifier le type de fichier
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          errors.push(`${file.name}: Format non supporté`)
          continue
        }

        // Vérifier la taille (limite à 10MB pour le fichier original)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
          errors.push(`${file.name}: Trop volumineux (max 10MB)`)
          continue
        }

        validFiles.push(file)
      }

      // Afficher les erreurs s'il y en a
      if (errors.length > 0) {
        toast({
          title: "Fichiers non valides",
          description: errors.join(', '),
          variant: "destructive"
        })
      }

      // Ajouter les fichiers valides
      if (validFiles.length > 0) {
        // Limiter à 5 images maximum
        const newImages = [...formData.images, ...validFiles].slice(0, 5)
        setFormData(prev => ({
          ...prev,
          images: newImages
        }))

        // Créer les URLs de prévisualisation
        const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file))
        setImagePreviewUrls(prev => [...prev, ...newPreviewUrls].slice(0, 5))

        // Informer l'utilisateur de l'optimisation automatique
        if (validFiles.length > 0) {
          toast({
            title: "Images ajoutées",
            description: `${validFiles.length} image(s) ajoutée(s). Elles seront automatiquement optimisées (max 500KB, format WebP) lors de l'enregistrement.`,
          })
        }
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index)

    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
    setImagePreviewUrls(newPreviewUrls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un produit",
        variant: "destructive"
      })
      return
    }

    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du produit est obligatoire",
        variant: "destructive"
      })
      return
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Erreur",
        description: "Le prix doit être supérieur à 0",
        variant: "destructive"
      })
      return
    }

    if (!formData.categoryId || !formData.materialId || !formData.colorId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner toutes les propriétés du produit",
        variant: "destructive"
      })
      return
    }

    if (Object.keys(formData.stockBySizes).length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez configurer au moins un stock pour une taille",
        variant: "destructive"
      })
      return
    }

    if (formData.images.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins une image",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Créer FormData pour l'upload des images
      const submitFormData = new FormData()
      submitFormData.append('name', formData.name)
      submitFormData.append('description', formData.description)
      submitFormData.append('price', formData.price)
      submitFormData.append('categoryId', formData.categoryId)
      submitFormData.append('materialId', formData.materialId)
      submitFormData.append('colorId', formData.colorId)

      // Ajouter les stocks par taille
      submitFormData.append('stockBySizes', JSON.stringify(formData.stockBySizes))

      // Ajouter les images
      formData.images.forEach((image, index) => {
        submitFormData.append(`images`, image)
      })

      const response = await fetch('/api/products/create', {
        method: 'POST',
        body: submitFormData
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Succès",
          description: "Produit créé avec succès !",
        })
        router.push('/seller/catalogs')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la création du produit')
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  if (!session || session.user.role !== "SELLER") {
    router.push("/unauthorized")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Créer un nouveau produit</CardTitle>
          <CardDescription>
            Ajoutez un nouveau produit à votre catalogue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Robe élégante en soie"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="99.99"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez votre produit en détail..."
                rows={4}
              />
            </div>

            {/* Propriétés du produit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Matériau *</Label>
                <Select value={formData.materialId} onValueChange={(value) => handleInputChange('materialId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un matériau" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={material.id.toString()}>
                        {material.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Couleur *</Label>
                <Select value={formData.colorId} onValueChange={(value) => handleInputChange('colorId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une couleur" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.id} value={color.id.toString()}>
                        {color.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Gestion des stocks par taille */}
            <div className="space-y-4">
              <Label>Stock par taille *</Label>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">

                {/* Stocks déjà configurés */}
                {Object.entries(formData.stockBySizes).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Stocks configurés :</h4>
                    {Object.entries(formData.stockBySizes).map(([sizeId, quantity]) => {
                      const size = sizes.find(s => s.id.toString() === sizeId)
                      return (
                        <div key={sizeId} className="flex items-center gap-4 bg-white p-3 rounded-md">
                          <span className="font-medium min-w-[60px]">
                            {size?.name || 'Taille inconnue'}
                          </span>
                          <Input
                            type="number"
                            min="0"
                            value={quantity}
                            onChange={(e) => handleStockChange(sizeId, parseInt(e.target.value) || 0)}
                            className="w-24"
                            placeholder="0"
                          />
                          <span className="text-sm text-gray-500">pièces</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStockForSize(sizeId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Ajouter une nouvelle taille */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-3">Ajouter du stock pour une taille :</h4>
                  <div className="flex items-center gap-4">
                    <Select
                      value=""
                      onValueChange={(sizeId) => {
                        if (sizeId && !formData.stockBySizes[sizeId]) {
                          handleStockChange(sizeId, 0)
                        }
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Taille" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes
                          .filter(size => !formData.stockBySizes[size.id.toString()])
                          .map((size) => (
                            <SelectItem key={size.id} value={size.id.toString()}>
                              {size.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-500">
                      {sizes.filter(size => !formData.stockBySizes[size.id.toString()]).length === 0
                        ? "Toutes les tailles sont configurées"
                        : "Sélectionnez une taille pour ajouter du stock"}
                    </span>
                  </div>
                </div>

                {Object.keys(formData.stockBySizes).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Aucun stock configuré</p>
                    <p className="text-xs">Sélectionnez une taille ci-dessus pour commencer</p>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <Label>Images du produit * (Maximum 5 images)</Label>

              {/* Zone d'upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-12 h-12 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Cliquez pour ajouter des images ou glissez-déposez
                  </span>
                  <span className="text-xs text-gray-400">
                    PNG, JPG, WEBP jusqu'à 10MB chacune
                  </span>
                </label>
              </div>

              {/* Prévisualisation des images */}
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "Créer le produit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
