"use client"

import { useState } from "react"

type Props = {
    productStocks: {
        size: { id: string; name: string }
        quantity: number
    }[]
}

export default function SizeSelector({ productStocks }: Props) {
    const [selectedSizeId, setSelectedSizeId] = useState(productStocks[0]?.size.id || "")
    const selectedStock = productStocks.find(ps => ps.size.id === selectedSizeId)

    return (
        <div className="pt-2">
            <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-1">
                Taille
            </label>
            <select
                id="size-select"
                value={selectedSizeId}
                onChange={(e) => setSelectedSizeId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
            >
                {productStocks.map(ps => (
                    <option key={ps.size.id} value={ps.size.id}>
                        {ps.size.name}
                    </option>
                ))}
            </select>
            <p className="text-sm text-gray-600 mt-1">
                Stock disponible : <span className="font-medium">{selectedStock?.quantity ?? "-"}</span>
            </p>
        </div>
    )
}