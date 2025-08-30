import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/wovelyLogo.png"
                alt="Wovely Logo"
                width={120}
                height={48}
                className="brightness-0 invert"
                priority
              />
            </Link>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Wovely est la marketplace qui connecte les créateurs de mode avec leurs clients.
              Découvrez des pièces uniques et sur-mesure créées par des artisans passionnés.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-teal-600 p-3 rounded-lg hover:bg-teal-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-teal-600 p-3 rounded-lg hover:bg-teal-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-teal-600 p-3 rounded-lg hover:bg-teal-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-teal-600 p-3 rounded-lg hover:bg-teal-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-teal-400">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-teal-400 transition-colors flex items-center">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-300 hover:text-teal-400 transition-colors">
                  S'inscrire
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-teal-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-teal-400">Légal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/legal-notice" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-teal-400 transition-colors">
                  CGU
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-gray-300 hover:text-teal-400 transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-teal-400">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">support@wovely.com</p>
                  <p className="text-sm text-gray-400">Support client</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+33 1 23 45 67 89</p>
                  <p className="text-sm text-gray-400">Lun-Ven 9h-18h</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">123 Rue de la Mode</p>
                  <p className="text-gray-300">75001 Paris, France</p>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="mt-6">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                Français <span className="ml-2">▼</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Wovely. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Fait avec ❤️ pour la mode</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
