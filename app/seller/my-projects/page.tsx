import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function SellerMyProjects() {
  // Sample projects data
  const projects = [
    {
      id: 1,
      title: "Project 1",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      status: "XXX",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      title: "Project 2",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      status: "XXX",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      title: "Project 3",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      status: "XXX",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      title: "Project 4",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      status: "XXX",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">My Projects (4)</h1>
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
                + Modify State
              </Button>
            </div>
            <div className="flex-shrink-0 self-center text-right">
              <p className="text-sm text-gray-500">State :</p>
              <p className="font-medium">{project.status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">Showing 1 to 4 of 4 results</p>
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
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
