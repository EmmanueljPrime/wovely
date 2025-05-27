import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function SellerProjects() {
  // Sample projects data
  const projects = [
    {
      id: 1,
      title: "Project 1",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      totalOffers: "XXX",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      title: "Project 2",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      totalOffers: "XXX",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      title: "Project 3",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      totalOffers: "XXX",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      title: "Project 4",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      totalOffers: "XXX",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Projects (789)</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search Project"
              className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-300"
            />
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
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="flex gap-6 border-b pb-6">
            <div className="flex-shrink-0">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{project.description}</p>
              <Button variant="outline" size="sm" className="mt-4">
                + Add an auction
              </Button>
            </div>
            <div className="flex-shrink-0 self-center text-right">
              <p className="text-sm text-gray-500">Total Offers :</p>
              <p className="font-medium">{project.totalOffers}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">Showing 1 to 10 of 789 results</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">...</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">8</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">9</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
