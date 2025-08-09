import {prisma} from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

interface TailorPageProps {
  searchParams: {
    services?: string
    experience?: string
    type?: string
    city?: string
    search?: string
  }
}

export default async function TailorListPage({ searchParams }: TailorPageProps) {
  // Construire les filtres dynamiquement
  const where: any = {}

  if (searchParams.services) {
    where.servicesOffered = {
      contains: searchParams.services,
      mode: 'insensitive'
    }
  }

  if (searchParams.experience) {
    // Logique pour filtrer par années d'expérience
    const expRange = searchParams.experience
    if (expRange === '1-3') {
      where.yearsOfExperience = { gte: '1', lte: '3' }
    } else if (expRange === '3-5') {
      where.yearsOfExperience = { gte: '3', lte: '5' }
    } else if (expRange === '5-10') {
      where.yearsOfExperience = { gte: '5', lte: '10' }
    } else if (expRange === '10+') {
      where.yearsOfExperience = { gte: '10' }
    }
  }

  if (searchParams.type) {
    // Filtrer par type (individual vs professional)
    if (searchParams.type === 'individual') {
      where.companyType = null
    } else if (searchParams.type === 'professional') {
      where.companyType = { not: null }
    }
  }

  if (searchParams.city) {
    where.OR = [
      {
        companyCity: {
          contains: searchParams.city,
          mode: 'insensitive'
        }
      },
      {
        user: {
          address: {
            contains: searchParams.city,
            mode: 'insensitive'
          }
        }
      }
    ]
  }

  if (searchParams.search) {
    const searchOr = [
      {
        business_name: {
          contains: searchParams.search,
          mode: 'insensitive'
        }
      },
      {
        user: {
          firstname: {
            contains: searchParams.search,
            mode: 'insensitive'
          }
        }
      },
      {
        user: {
          lastname: {
            contains: searchParams.search,
            mode: 'insensitive'
          }
        }
      }
    ]

    if (where.OR) {
      where.AND = [
        { OR: where.OR },
        { OR: searchOr }
      ]
      delete where.OR
    } else {
      where.OR = searchOr
    }
  }

  const sellers = await prisma.seller.findMany({
    where,
    include: {
      user: true,
    },
    orderBy: { business_name: "asc" },
  });

  // Afficher les filtres actifs
  const activeFilters = Object.entries(searchParams).filter(([key, value]) =>
    value && ['services', 'experience', 'type', 'city'].includes(key)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Tous les Tailleurs</h1>

      {/* Affichage des filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Filtres actifs:</span>
            {activeFilters.map(([key, value]) => (
              <div key={key} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                {key === 'services' && value === 'alterations' && 'Services: Retouches'}
                {key === 'services' && value === 'custom' && 'Services: Confection sur mesure'}
                {key === 'services' && value === 'repairs' && 'Services: Réparations'}
                {key === 'services' && value === 'all' && 'Services: Tous services'}
                {key === 'experience' && `Expérience: ${value} ans`}
                {key === 'type' && value === 'individual' && 'Type: Particulier'}
                {key === 'type' && value === 'professional' && 'Type: Professionnel'}
                {key === 'city' && `Ville: ${value}`}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compteur de résultats */}
      <div className="mb-4">
        <p className="text-gray-600">
          {sellers.length} tailleur{sellers.length !== 1 ? 's' : ''} trouvé{sellers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grille des tailleurs */}
      {sellers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {sellers.map((seller) => (
            <Link
              key={seller.id}
              href={`/tailor/${seller.id}`}
              className="group relative block rounded-lg transition-transform hover:scale-105"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                {seller.user.image ? (
                  <Image
                    src={seller.user.image}
                    alt={seller.business_name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium">{seller.business_name}</h3>
                <p className="text-xs text-gray-600">{seller.user.firstname} {seller.user.lastname}</p>
                {/* Afficher les informations pertinentes */}
                <div className="text-xs text-gray-500 mt-1">
                  {seller.servicesOffered && (
                    <span className="block">Services: {
                      seller.servicesOffered === 'alterations' ? 'Retouches' :
                      seller.servicesOffered === 'custom' ? 'Sur mesure' :
                      seller.servicesOffered === 'repairs' ? 'Réparations' :
                      seller.servicesOffered === 'all' ? 'Tous services' :
                      seller.servicesOffered
                    }</span>
                  )}
                  {seller.yearsOfExperience && (
                    <span className="block">{seller.yearsOfExperience} ans d'expérience</span>
                  )}
                  {(seller.companyCity || seller.user.address) && (
                    <span className="block">📍 {seller.companyCity || seller.user.address}</span>
                  )}
                  {seller.companyType ? (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs mt-1">
                      Professionnel
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs mt-1">
                      Particulier
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun tailleur trouvé avec ces filtres.</p>
          <p className="text-gray-400 text-sm mt-2">Essayez de modifier ou supprimer certains filtres.</p>
        </div>
      )}
    </div>
  );
}
