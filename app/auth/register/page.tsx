"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState("customer")
  const [tailorType, setTailorType] = useState("individual")
  const [isLoading, setIsLoading] = useState(false)

  const [customerFormData, setCustomerFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    postalCode: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    receiveAlerts: false,
  })

  const [individualTailorFormData, setIndividualTailorFormData] = useState({
    profileName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    servicesOffered: "",
    yearsOfExperience: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    receiveAlerts: false,
  })

  const [professionalTailorFormData, setProfessionalTailorFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyType: "",
    siretNumber: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    companyPhoneNumber: "",
    agreeTerms: false,
    receiveAlerts: false,
  })

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleIndividualTailorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setIndividualTailorFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfessionalTailorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfessionalTailorFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCustomerCheckboxChange = (name: string, checked: boolean) => {
    setCustomerFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleIndividualTailorCheckboxChange = (name: string, checked: boolean) => {
    setIndividualTailorFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleProfessionalTailorCheckboxChange = (name: string, checked: boolean) => {
    setProfessionalTailorFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (customerFormData.password !== customerFormData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customerFormData.email,
          username: customerFormData.email.split("@")[0],
          password: customerFormData.password,
          role: "CLIENT",
          firstname: customerFormData.fullName.split(" ")[0],
          lastname: customerFormData.fullName.split(" ").slice(1).join(" "),
          phoneNumber: customerFormData.phoneNumber,
          address: customerFormData.address,
          postalCode: customerFormData.postalCode,
          agreeTerms: customerFormData.agreeTerms,
          receiveAlerts: customerFormData.receiveAlerts,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue lors de l'inscription")
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      })

      // Connecter automatiquement l'utilisateur
      const result = await signIn("credentials", {
        email: customerFormData.email,
        password: customerFormData.password,
        redirect: false,
      })

      if (result?.ok) {
        router.push("/client/account")
      }
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleIndividualTailorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (individualTailorFormData.password !== individualTailorFormData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: individualTailorFormData.email,
          username: individualTailorFormData.email.split("@")[0],
          password: individualTailorFormData.password,
          role: "SELLER",
          business_name: individualTailorFormData.profileName,
          fullName: individualTailorFormData.fullName,
          phoneNumber: individualTailorFormData.phoneNumber,
          servicesOffered: individualTailorFormData.servicesOffered,
          yearsOfExperience: individualTailorFormData.yearsOfExperience,
          agreeTerms: individualTailorFormData.agreeTerms,
          receiveAlerts: individualTailorFormData.receiveAlerts,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue lors de l'inscription")
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      })

      // Connecter automatiquement l'utilisateur
      const result = await signIn("credentials", {
        email: individualTailorFormData.email,
        password: individualTailorFormData.password,
        redirect: false,
      })

      if (result?.ok) {
        router.push("/seller/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfessionalTailorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (professionalTailorFormData.password !== professionalTailorFormData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: professionalTailorFormData.email,
          username: professionalTailorFormData.email.split("@")[0],
          password: professionalTailorFormData.password,
          role: "SELLER",
          business_name: professionalTailorFormData.companyName,
          firstName: professionalTailorFormData.firstName,
          lastName: professionalTailorFormData.lastName,
          companyType: professionalTailorFormData.companyType,
          siretNumber: professionalTailorFormData.siretNumber,
          companyAddress: professionalTailorFormData.address,
          companyCity: professionalTailorFormData.city,
          companyPostalCode: professionalTailorFormData.postalCode,
          companyCountry: professionalTailorFormData.country,
          companyPhoneNumber: professionalTailorFormData.companyPhoneNumber,
          agreeTerms: professionalTailorFormData.agreeTerms,
          receiveAlerts: professionalTailorFormData.receiveAlerts,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue lors de l'inscription")
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      })

      // Connecter automatiquement l'utilisateur
      const result = await signIn("credentials", {
        email: professionalTailorFormData.email,
        password: professionalTailorFormData.password,
        redirect: false,
      })

      if (result?.ok) {
        router.push("/seller/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <Tabs defaultValue="customer" onValueChange={setUserType} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="customer">Join as Customer</TabsTrigger>
                <TabsTrigger value="tailor">Join as Tailor</TabsTrigger>
              </TabsList>

              {/* Customer Registration Form */}
              <TabsContent value="customer">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Join as Customer</h2>
                <form className="space-y-4" onSubmit={handleCustomerSubmit}>
                  <div>
                    <label htmlFor="customer-fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                        id="customer-fullName"
                        name="fullName"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={customerFormData.fullName}
                        onChange={handleCustomerChange}
                        disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="customer-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                        id="customer-email"
                        name="email"
                        type="email"
                        required
                        placeholder="mail@email.com"
                        value={customerFormData.email}
                        onChange={handleCustomerChange}
                        disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="customer-phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone number
                    </label>
                    <Input
                        id="customer-phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        placeholder="00 00 00 00 00"
                        value={customerFormData.phoneNumber}
                        onChange={handleCustomerChange}
                        disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="customer-address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <Input
                        id="customer-address"
                        name="address"
                        type="text"
                        required
                        placeholder="123 Lamplight Parade"
                        value={customerFormData.address}
                        onChange={handleCustomerChange}
                        disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="customer-postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <Input
                        id="customer-postalCode"
                        name="postalCode"
                        type="text"
                        required
                        placeholder="75001"
                        value={customerFormData.postalCode}
                        onChange={handleCustomerChange}
                        disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="customer-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                          id="customer-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••••••"
                          value={customerFormData.password}
                          onChange={handleCustomerChange}
                          disabled={isLoading}
                      />
                      <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="customer-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                          id="customer-confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="••••••••••••"
                          value={customerFormData.confirmPassword}
                          onChange={handleCustomerChange}
                          disabled={isLoading}
                      />
                      <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                          id="customer-agreeTerms"
                          checked={customerFormData.agreeTerms}
                          onCheckedChange={(checked) => handleCustomerCheckboxChange("agreeTerms", checked as boolean)}
                          disabled={isLoading}
                      />
                      <label htmlFor="customer-agreeTerms" className="ml-2 block text-sm text-gray-900">
                        I agree to the terms and conditions
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                          id="customer-receiveAlerts"
                          checked={customerFormData.receiveAlerts}
                          onCheckedChange={(checked) => handleCustomerCheckboxChange("receiveAlerts", checked as boolean)}
                          disabled={isLoading}
                      />
                      <label htmlFor="customer-receiveAlerts" className="ml-2 block text-sm text-gray-900">
                        Send me the latest deal alerts
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={isLoading}>
                    {isLoading ? "Inscription en cours..." : "Create account"}
                  </Button>
                </form>
              </TabsContent>

              {/* Tailor Registration Form */}
              <TabsContent value="tailor">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Join as Tailor</h2>

                <Tabs defaultValue="individual" onValueChange={setTailorType} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="individual">Individual</TabsTrigger>
                    <TabsTrigger value="professional">Professional</TabsTrigger>
                  </TabsList>

                  {/* Individual Tailor Form */}
                  <TabsContent value="individual">
                    <form className="space-y-4" onSubmit={handleIndividualTailorSubmit}>
                      <div>
                        <label htmlFor="tailor-profileName" className="block text-sm font-medium text-gray-700 mb-1">
                          Profile Name Or Brand Name
                        </label>
                        <Input
                            id="tailor-profileName"
                            name="profileName"
                            type="text"
                            required
                            placeholder="Nike"
                            value={individualTailorFormData.profileName}
                            onChange={handleIndividualTailorChange}
                            disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="tailor-fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Full name
                        </label>
                        <Input
                            id="tailor-fullName"
                            name="fullName"
                            type="text"
                            required
                            placeholder="John Doe"
                            value={individualTailorFormData.fullName}
                            onChange={handleIndividualTailorChange}
                            disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="tailor-email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input
                            id="tailor-email"
                            name="email"
                            type="email"
                            required
                            placeholder="mail@email.com"
                            value={individualTailorFormData.email}
                            onChange={handleIndividualTailorChange}
                            disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="tailor-phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone number
                        </label>
                        <Input
                            id="tailor-phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            required
                            placeholder="00 00 00 00 00"
                            value={individualTailorFormData.phoneNumber}
                            onChange={handleIndividualTailorChange}
                            disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="tailor-servicesOffered" className="block text-sm font-medium text-gray-700 mb-1">
                          Services Offered
                        </label>
                        <Select
                            value={individualTailorFormData.servicesOffered}
                            onValueChange={(value) =>
                                setIndividualTailorFormData((prev) => ({ ...prev, servicesOffered: value }))
                            }
                            disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tailoring services you offer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alterations">Alterations</SelectItem>
                            <SelectItem value="custom">Custom Clothing</SelectItem>
                            <SelectItem value="repairs">Repairs</SelectItem>
                            <SelectItem value="all">All Services</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label
                            htmlFor="tailor-yearsOfExperience"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Years of Experience
                        </label>
                        <Input
                            id="tailor-yearsOfExperience"
                            name="yearsOfExperience"
                            type="text"
                            required
                            placeholder="1, 2, 3, 4..."
                            value={individualTailorFormData.yearsOfExperience}
                            onChange={handleIndividualTailorChange}
                            disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="tailor-password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <Input
                              id="tailor-password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="••••••••••••"
                              value={individualTailorFormData.password}
                              onChange={handleIndividualTailorChange}
                              disabled={isLoading}
                          />
                          <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="tailor-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Input
                              id="tailor-confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              required
                              placeholder="••••••••••••"
                              value={individualTailorFormData.confirmPassword}
                              onChange={handleIndividualTailorChange}
                              disabled={isLoading}
                          />
                          <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                              id="tailor-agreeTerms"
                              checked={individualTailorFormData.agreeTerms}
                              onCheckedChange={(checked) =>
                                  handleIndividualTailorCheckboxChange("agreeTerms", checked as boolean)
                              }
                              disabled={isLoading}
                          />
                          <label htmlFor="tailor-agreeTerms" className="ml-2 block text-sm text-gray-900">
                            I agree to the terms and conditions
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                              id="tailor-receiveAlerts"
                              checked={individualTailorFormData.receiveAlerts}
                              onCheckedChange={(checked) =>
                                  handleIndividualTailorCheckboxChange("receiveAlerts", checked as boolean)
                              }
                              disabled={isLoading}
                          />
                          <label htmlFor="tailor-receiveAlerts" className="ml-2 block text-sm text-gray-900">
                            Send me the latest deal alerts
                          </label>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={isLoading}>
                        {isLoading ? "Inscription en cours..." : "Create account"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Professional Tailor Form */}
                  <TabsContent value="professional">
                    <form className="space-y-4" onSubmit={handleProfessionalTailorSubmit}>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Responsible Party Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                                htmlFor="professional-firstName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              First Name
                            </label>
                            <Input
                                id="professional-firstName"
                                name="firstName"
                                type="text"
                                required
                                placeholder="John"
                                value={professionalTailorFormData.firstName}
                                onChange={handleProfessionalTailorChange}
                                disabled={isLoading}
                            />
                          </div>
                          <div>
                            <label
                                htmlFor="professional-lastName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Last Name
                            </label>
                            <Input
                                id="professional-lastName"
                                name="lastName"
                                type="text"
                                required
                                placeholder="Doe"
                                value={professionalTailorFormData.lastName}
                                onChange={handleProfessionalTailorChange}
                                disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="professional-email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input
                            id="professional-email"
                            name="email"
                            type="email"
                            required
                            placeholder="mail@email.com"
                            value={professionalTailorFormData.email}
                            onChange={handleProfessionalTailorChange}
                            disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="professional-password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <Input
                              id="professional-password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="••••••••••••"
                              value={professionalTailorFormData.password}
                              onChange={handleProfessionalTailorChange}
                              disabled={isLoading}
                          />
                          <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                            htmlFor="professional-confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Input
                              id="professional-confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              required
                              placeholder="••••••••••••"
                              value={professionalTailorFormData.confirmPassword}
                              onChange={handleProfessionalTailorChange}
                              disabled={isLoading}
                          />
                          <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Company Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label
                                htmlFor="professional-companyName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Company Name
                            </label>
                            <Input
                                id="professional-companyName"
                                name="companyName"
                                type="text"
                                required
                                placeholder="Company Name"
                                value={professionalTailorFormData.companyName}
                                onChange={handleProfessionalTailorChange}
                                disabled={isLoading}
                            />
                          </div>

                          <div>
                            <label
                                htmlFor="professional-companyType"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Company Type
                            </label>
                            <Select
                                value={professionalTailorFormData.companyType}
                                onValueChange={(value) =>
                                    setProfessionalTailorFormData((prev) => ({ ...prev, companyType: value }))
                                }
                                disabled={isLoading}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select company type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sarl">SARL</SelectItem>
                                <SelectItem value="sas">SAS</SelectItem>
                                <SelectItem value="eurl">EURL</SelectItem>
                                <SelectItem value="ei">Entreprise Individuelle</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={isLoading}>
                            {isLoading ? "Inscription en cours..." : "Create account"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-teal-600 hover:text-teal-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
  )
}
