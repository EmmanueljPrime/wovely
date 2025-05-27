import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(req) {
        // Middleware personnalisé si nécessaire
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                // Pages publiques - toujours autoriser
                if (
                    pathname.startsWith('/auth/') ||
                    pathname === '/' ||
                    pathname.startsWith('/api/auth/') ||
                    pathname.startsWith('/_next/') ||
                    pathname.startsWith('/favicon')
                ) {
                    return true
                }

                // Pages protégées - vérifier l'authentification
                if (pathname.startsWith('/client/')) {
                    return !!token && token.role === 'CLIENT'
                }

                if (pathname.startsWith('/seller/')) {
                    return !!token && token.role === 'SELLER'
                }

                // Pour toutes les autres pages protégées
                return !!token
            },
        },
    }
)

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (NextAuth routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ]
}