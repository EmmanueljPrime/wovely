import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CartPage() {
  // Sample cart items
  const cartItems = [
    { id: 1, name: "Product", price: "$550", quantity: 1, subtotal: "$550" },
    { id: 2, name: "Product", price: "$550", quantity: 1, subtotal: "$550" },
    { id: 3, name: "Product", price: "$550", quantity: 1, subtotal: "$550" },
    { id: 4, name: "Product", price: "$550", quantity: 1, subtotal: "$550" },
  ]

  // Cart summary
  const cartSummary = {
    subtotal: "$1750",
    shipping: "Free",
    total: "$1750",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-4 text-left">Product</th>
                <th className="py-4 text-left">Price</th>
                <th className="py-4 text-left">Quantity</th>
                <th className="py-4 text-left">Subtotal</th>
                <th className="py-4"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-4" />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4">{item.price}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-4">{item.subtotal}</td>
                  <td className="py-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-6">
            <Button variant="outline">Return To Shop</Button>
            <Button variant="outline">Update Cart</Button>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Cart Total</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between py-2 border-b">
                <span>Subtotal</span>
                <span>{cartSummary.subtotal}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Shipping</span>
                <span>{cartSummary.shipping}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{cartSummary.total}</span>
              </div>
            </div>

            <Button className="w-full bg-black text-white hover:bg-gray-800">Proceed to checkout</Button>
          </div>

          <div className="mt-6">
            <div className="flex">
              <Input type="text" placeholder="Coupon Code" className="rounded-r-none" />
              <Button className="rounded-l-none bg-black text-white hover:bg-gray-800">Apply Coupon</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
