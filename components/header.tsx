"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, LogOut, FolderKanban  } from "lucide-react"
import { usePathname } from "next/navigation"
import { DynamicFilters } from "@/components/dynamic-filters"

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("")
    const { data: session, status } = useSession()
    const pathname = usePathname()

    const isProductPage = () => {
        return (
            pathname === "/" ||
            pathname.startsWith("/products") ||
            pathname.startsWith("/clothing") ||
            pathname.startsWith("/material") ||
            pathname.startsWith("/price") ||
            pathname.startsWith("/size") ||
            pathname.startsWith("/color")
        )
    }

    const isTailorPage = () => {
        return (
            pathname === "/tailor" ||
            pathname.startsWith("/tailor/")
        )
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" })
    }

    const getUserInitials = () => {
        if (session?.user?.name) {
            return session.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
        }
        return session?.user?.email?.[0]?.toUpperCase() || "U"
    }

    const getDashboardUrl = () => {
        return session?.user?.role === "CLIENT" ? "/client/account" : "/seller/dashboard"
    }

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center text-teal-600">
                    <Image
                        src="/wovelyLogo.png"
                        alt="Wovely Logo"
                        width={100}
                        height={40}
                        priority={true}
                        style={{ width: "auto", height: "auto", maxWidth: "100px", maxHeight: "40px" }}
                    />
                </Link>

                <div className="flex-1 max-w-md mx-4">
                    <div className="relative">
                        {/*<Input*/}
                        {/*    type="search"*/}
                        {/*    placeholder="Search"*/}
                        {/*    className="pl-4 pr-10 py-2 rounded-full bg-gray-100"*/}
                        {/*    value={searchQuery}*/}
                        {/*    onChange={(e) => setSearchQuery(e.target.value)}*/}
                        {/*/>*/}
                        {/*<Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />*/}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {status === "loading" ? (
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                    ) : session ? (
                        <>
                            {/*<Link href={session.user.role === "CLIENT" ? "/client/messages" : "/seller/messages"}>*/}
                            {/*    <Button variant="ghost" size="icon" aria-label="Messages">*/}
                            {/*        <svg*/}
                            {/*            xmlns="http://www.w3.org/2000/svg"*/}
                            {/*            width="24"*/}
                            {/*            height="24"*/}
                            {/*            viewBox="0 0 24 24"*/}
                            {/*            fill="none"*/}
                            {/*            stroke="currentColor"*/}
                            {/*            strokeWidth="2"*/}
                            {/*            strokeLinecap="round"*/}
                            {/*            strokeLinejoin="round"*/}
                            {/*            className="h-6 w-6"*/}
                            {/*        >*/}
                            {/*            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>*/}
                            {/*        </svg>*/}
                            {/*    </Button>*/}
                            {/*</Link>*/}
                            {session.user.role === "CLIENT" ? (
                                <Link href="/client/cart">
                                    <Button variant="ghost" size="icon" aria-label="Cart">
                                        <ShoppingCart className="h-6 w-6" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/seller/dashboard">
                                    <Button variant="ghost" size="icon" aria-label="Dashboard">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-6 w-6"
                                        >
                                            <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                                            <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                                            <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                                            <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                                        </svg>
                                    </Button>
                                </Link>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            {session.user.name && <p className="font-medium">{session.user.name}</p>}
                                            <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {session.user.role === "CLIENT" ? "Client" : "Tailleur"}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={getDashboardUrl()} className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Mon compte</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={session?.user?.role === "CLIENT" ? "/client/projects" : "/seller/projects"}
                                            className="flex items-center"
                                        >
                                            <FolderKanban className="mr-2 h-4 w-4" />
                                            <span>Projets</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={session?.user?.role === "CLIENT" ? "/client/settings" : "/seller/settings"}
                                            className="flex items-center"
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Paramètres</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Se déconnecter</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login">
                                <Button variant="outline">Sign in</Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button>Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {isProductPage() && (
                <div className="container mx-auto px-4 py-2">
                    <DynamicFilters type="products" />
                </div>
            )}

            {isTailorPage() && (
                <div className="container mx-auto px-4 py-2">
                    <DynamicFilters type="tailors" />
                </div>
            )}
        </header>
    )
}
