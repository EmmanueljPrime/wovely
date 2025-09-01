// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
//
// export async function GET() {
//   try {
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//     const services = [...new Set(sellers
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       services: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//         companyType: true,
//         companyCity: true,
//           select: {
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//     )]
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//         companyCity: true,
//           select: {
//             address: true
//           }
//         }
//       }
//     })
//
//     // Extraire les valeurs uniques
//     const services = [...new Set(sellers
//       .map(s => s.servicesOffered)
//       .filter(Boolean)
//     )]
//
//     const cities = [...new Set([
//       ...sellers.map(s => s.companyCity).filter(Boolean),
//       ...sellers.map(s => s.user.address).filter(Boolean)
//     ])]
//
//     // Toujours retourner les filtres de base, même sans données
//     return NextResponse.json({
//       services: [
//         { label: 'Retouches', value: 'alterations' },
//         { label: 'Confection sur mesure', value: 'custom' },
//         { label: 'Réparations', value: 'repairs' },
//         { label: 'Tous services', value: 'all' }
//       ],
//       experiences: [
//         { label: '1-3 ans', value: '1-3' },
//         { label: '3-5 ans', value: '3-5' },
//         { label: '5-10 ans', value: '5-10' },
//         { label: '10+ ans', value: '10+' }
//       ],
//       types: [
//         { label: 'Particulier', value: 'individual' },
//         { label: 'Professionnel', value: 'professional' }
//       ],
//       cities: cities.length > 0 ? cities.map(c => ({ label: c, value: c })) : [
//         { label: 'Paris', value: 'Paris' },
//         { label: 'Lyon', value: 'Lyon' },
//         { label: 'Marseille', value: 'Marseille' },
//         { label: 'Toulouse', value: 'Toulouse' }
//       ]
//     })
//   } catch (error) {
//     console.error('Erreur lors de la récupération des filtres tailleurs:', error)
//     return NextResponse.json(
//       { error: 'Erreur serveur' },
//       { status: 500 }
//     )
//   }
// }
