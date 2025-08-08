import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start">
            <p className="font-semibold mb-4">Transparent</p>
            <Button variant="outline" className="mb-4">
              English <span className="ml-2">▼</span>
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-600 hover:text-gray-900">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal-notice" className="text-gray-600 hover:text-gray-900">
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service (CGU)
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-gray-600 hover:text-gray-900">
                  Terms and Conditions of Sale (CGV)
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-gray-900">
                  Cookie Management
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
