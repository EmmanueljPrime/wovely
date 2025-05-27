import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(req) {
        console.log("🔍 Middleware Debug:")
        console.log("- Path:", req.nextUrl.pathname)
        console.log("- Token role:", req.nextauth.token?.role)
        console.log("- Token exists:", !!req.nextauth.token)
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                console.log("🚦 Authorization check:")
                console.log("- Path:", pathname)
                console.log("- Token role:", token?.role)

                // Routes publiques - toujours autorisées
                const publicRoutes = ["/", "/auth/login", "/auth/register", "/api/auth", "/debug-auth", "/unauthorized"]

                if (publicRoutes.some((route) => pathname.startsWith(route))) {
                    console.log("✅ Public route - ALLOWED")
                    return true
                }

                // Pas de token = redirection vers login
                if (!token) {
                    console.log("❌ No token - DENIED")
                    return false
                }

                // Routes SELLER - seulement pour les sellers
                if (pathname.startsWith("/seller/")) {
                    const allowed = token.role === "SELLER"
                    console.log(`${allowed ? "✅" : "❌"} Seller route - ${allowed ? "ALLOWED" : "DENIED"}`)
                    return allowed
                }

                // Routes CLIENT - seulement pour les clients
                if (pathname.startsWith("/client/")) {
                    const allowed = token.role === "CLIENT"
                    console.log(`${allowed ? "✅" : "❌"} Client route - ${allowed ? "ALLOWED" : "DENIED"}`)
                    return allowed
                }

                // Routes API protégées
                if (pathname.startsWith("/api/protected/")) {
                    console.log("✅ Protected API - token required - ALLOWED")
                    return true
                }

                console.log("✅ Default - ALLOWED")
                return true
            },
        },
    },
)

export const config = {
    matcher: ["/seller/:path*", "/client/:path*", "/api/protected/:path*", "/dashboard/:path*"],
}
