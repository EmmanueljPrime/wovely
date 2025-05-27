import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(req) {
        // Middleware logic here if needed
        console.log("Middleware - Token:", req.nextauth.token)
        console.log("Middleware - Pathname:", req.nextUrl.pathname)
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                // Public routes - toujours autorisées
                if (pathname === "/" || pathname.startsWith("/auth/") || pathname.startsWith("/api/auth/")) {
                    return true
                }

                // Si pas de token, pas d'accès aux routes protégées
                if (!token) {
                    return false
                }

                // Routes CLIENT - seulement pour les clients
                if (pathname.startsWith("/client/")) {
                    return token.role === "CLIENT"
                }

                // Routes SELLER - seulement pour les sellers
                if (pathname.startsWith("/seller/")) {
                    return token.role === "SELLER"
                }

                // Par défaut, autoriser si token existe
                return true
            },
        },
    },
)

export const config = {
    matcher: ["/client/:path*", "/seller/:path*", "/api/protected/:path*"],
}
