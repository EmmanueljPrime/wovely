"use client"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export default function DebugAuth() {
    const { data: session, status } = useSession()

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Debug NextAuth</h1>

            <div className="bg-gray-100 p-4 rounded mb-4">
                <h2 className="font-bold">Status:</h2>
                <p>{status}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded mb-4">
                <h2 className="font-bold">Session:</h2>
                <pre className="text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
            </div>

            <div className="space-x-4">
                <Link href="/seller/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Test Seller Dashboard
                </Link>
                <Link href="/client/account" className="bg-green-500 text-white px-4 py-2 rounded">
                    Test Client Account
                </Link>
                <button
                    onClick={() => signOut()}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Sign Out
                </button>
            </div>
        </div>
    )
}