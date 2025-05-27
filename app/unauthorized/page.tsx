import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
    return (
        <div className="container mx-auto py-16 text-center">
            <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Accès non autorisé</h2>
                <p className="text-gray-600 mb-8">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
                <div className="space-y-4">
                    <Link href="/public">
                        <Button className="w-full">Retour à l'accueil</Button>
                    </Link>
                    <Link href="/auth/login">
                        <Button variant="outline" className="w-full">
                            Se connecter
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
