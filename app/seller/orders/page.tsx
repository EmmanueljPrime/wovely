import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SellerOrders() {
  // Sample orders data
  const orders = [
    {
      id: "55217",
      orderNumber: "50217542",
      status: "Shipped",
      items: 1,
      customerName: "Cody Fisher",
      shippingService: "Standard",
      trackingCode: "IW3475453454354354",
    },
    {
      id: "55213",
      orderNumber: "50217543",
      status: "Shipped",
      items: 2,
      customerName: "Kristin Watson",
      shippingService: "Priority",
      trackingCode: "IW3475453454354312",
    },
    {
      id: "55210",
      orderNumber: "50217544",
      status: "Shipped",
      items: 12,
      customerName: "Esther Howard",
      shippingService: "Express",
      trackingCode: "IW3475453454300318",
    },
    {
      id: "55220",
      orderNumber: "50217545",
      status: "Shipped",
      items: 22,
      customerName: "Jenny Wilson",
      shippingService: "Express",
      trackingCode: "IW3475453454300313",
    },
    {
      id: "55223",
      orderNumber: "50217546",
      status: "Shipped",
      items: 32,
      customerName: "John Smith",
      shippingService: "Express",
      trackingCode: "IW3475453454300313",
    },
    {
      id: "55218a",
      orderNumber: "50217548",
      status: "Draft",
      items: 41,
      customerName: "Cameron Williamson",
      shippingService: "Express",
      trackingCode: "IW3475453454300313",
    },
    {
      id: "55218b",
      orderNumber: "50217548",
      status: "Draft",
      items: 41,
      customerName: "Cameron Williamson",
      shippingService: "Express",
      trackingCode: "IW3475453454300313",
    },
    {
      id: "55218c",
      orderNumber: "50217547",
      status: "Draft",
      items: 41,
      customerName: "Cameron Williamson",
      shippingService: "Priority",
      trackingCode: "IW3475453454300313",
    },
    {
      id: "55218d",
      orderNumber: "50217547",
      status: "Draft",
      items: 41,
      customerName: "Cameron Williamson",
      shippingService: "Express",
      trackingCode: "IW3475453454300313",
    },
    {
      id: "55218e",
      orderNumber: "50217547",
      status: "Draft",
      items: 44,
      customerName: "Cameron Williamson",
      shippingService: "Express",
      trackingCode: "IW3475453454300313",
    },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Order</h1>
        <Button>Create order</Button>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="flex">
          <Select defaultValue="id">
            <SelectTrigger className="w-[120px] rounded-r-none">
              <SelectValue placeholder="Order ID" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Order ID</SelectItem>
              <SelectItem value="number">Order Number</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Input type="search" placeholder="Search" className="pl-2 rounded-l-none" />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
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
                className="h-4 w-4 text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
          </div>
        </div>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ORDER ID</TableHead>
              <TableHead>ORDER NUMBER</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ITEM</TableHead>
              <TableHead>CUSTOMER NAME</TableHead>
              <TableHead>SHIPPING SERVICE</TableHead>
              <TableHead>TRACKING CODE</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${order.status === "Shipped" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                    {order.shippingService}
                  </div>
                </TableCell>
                <TableCell>{order.trackingCode}</TableCell>
                <TableCell>
                  <Link href={`/seller/orders/${order.id}`}>
                    <Button variant="ghost" size="icon">
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
                        className="h-4 w-4"
                      >
                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                      </svg>
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">Showing 1 to 10 of 97 results</p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
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
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-white">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <span>...</span>
          <Button variant="outline" size="sm">
            8
          </Button>
          <Button variant="outline" size="sm">
            9
          </Button>
          <Button variant="outline" size="sm">
            10
          </Button>
          <Button variant="outline" size="icon">
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
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
