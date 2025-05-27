import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  // Sample order data
  const order = {
    id: params.id || "3354654654526",
    date: "Feb 18, 2022",
    estimatedDelivery: "May 18, 2022",
    status: "Order Confirmed",
    timeline: [
      { id: 1, status: "Order Confirmed", date: "Wed, Feb 16th" },
      { id: 2, status: "Shipped", date: "Thu, Feb 17th" },
      { id: 3, status: "Out for Delivery", date: "Fri, Feb 18th" },
      { id: 4, status: "Delivered", date: "Sat, Feb 19th" },
    ],
    items: [
      { id: 1, name: "Product 1", color: "Space Gray", storage: "256GB", size: "1 TB", price: "$2599.00", quantity: 1 },
      { id: 2, name: "Product 2", color: "Space Gray", storage: "256GB", size: "1 TB", price: "$2599.00", quantity: 1 },
      { id: 3, name: "Product 3", color: "Space Gray", storage: "256GB", size: "1 TB", price: "$2599.00", quantity: 1 },
    ],
    payment: {
      method: "Visa",
      last4: "****",
    },
    delivery: {
      address: "123 Sample Street Apt. 4B, London, UK",
      phone: "123-456-7890",
    },
    summary: {
      discount: "$555.4",
      discountPercentage: "20%",
      subtotal: "$3109.40",
      delivery: "$0.00",
      tax: "+$221.68",
      total: "$0.00",
    },
  }

  // Calculate current step for progress bar
  const currentStepIndex = order.timeline.findIndex((step) => step.status === order.status)
  const currentStep = currentStepIndex !== -1 ? currentStepIndex : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Order ID: {order.id}</h1>
        <div className="flex gap-2">
          <Button variant="outline">Invoice</Button>
          <Button>Track order</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Order date:</span> {order.date}
          </div>
          <div>
            <span className="text-gray-600">Estimated delivery:</span> {order.estimatedDelivery}
          </div>
        </div>

        {/* Order Timeline */}
        <div className="my-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-between">
              {order.timeline.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep ? "bg-teal-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="mt-2 text-xs text-center">
                    <div className="font-medium">{step.status}</div>
                    <div className="text-gray-500">{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b pb-6">
              <div className="flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  <p>Color: {item.color}</p>
                  <p>Storage: {item.storage}</p>
                  <p>Size: {item.size}</p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-semibold">{item.price}</p>
                <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment and Delivery */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div>
            <h3 className="font-semibold mb-4">Payment</h3>
            <p className="text-sm">Card: {order.payment.method}</p>
            <p className="text-sm">Card Number: {order.payment.last4}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Delivery</h3>
            <p className="text-sm">Address: {order.delivery.address}</p>
            <p className="text-sm">Phone: {order.delivery.phone}</p>
          </div>
        </div>

        {/* Need Help */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Need Help</h3>
          <div className="space-y-2">
            <details className="text-sm">
              <summary className="cursor-pointer">Order Issues</summary>
              <div className="pl-4 mt-2">
                <p>If you have any issues with your order, please contact our customer support.</p>
              </div>
            </details>
            <details className="text-sm">
              <summary className="cursor-pointer">Delivery Info</summary>
              <div className="pl-4 mt-2">
                <p>For delivery related questions, please check our delivery policy.</p>
              </div>
            </details>
            <details className="text-sm">
              <summary className="cursor-pointer">Returns</summary>
              <div className="pl-4 mt-2">
                <p>Learn about our return policy and how to initiate a return.</p>
              </div>
            </details>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span>
                {order.summary.discount} ({order.summary.discountPercentage})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{order.summary.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span>{order.summary.delivery}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{order.summary.tax}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total</span>
              <span>{order.summary.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
