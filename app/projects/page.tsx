import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectsPage() {
  // Sample projects data
  const projects = [
    {
      id: 1,
      title: "Project 1",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      status: "Waiting Workers",
      image: "/placeholder.svg?height=100&width=100",
      info: "Total: Offers",
    },
    {
      id: 2,
      title: "Project 2",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      status: "In progress",
      image: "/placeholder.svg?height=100&width=100",
      info: "Final Price: XXX.XXS",
    },
    {
      id: 3,
      title: "Project 3",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      status: "Finished",
      image: "/placeholder.svg?height=100&width=100",
      info: "Pending shipment",
    },
    {
      id: 4,
      title: "Project 4",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      status: "Paid",
      image: "/placeholder.svg?height=100&width=100",
      info: "",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Projects (4)</h1>
        <div className="flex gap-2">
          <Button variant="outline">Manage Projects</Button>
          <Button>Create Project</Button>
        </div>
      </div>

      <Tabs defaultValue="waiting-workers">
        <TabsList className="mb-6">
          <TabsTrigger value="waiting-workers">Waiting Workers</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="finished">Finished</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>

        <TabsContent value="waiting-workers" className="space-y-4">
          {projects
            .filter((p) => p.status === "Waiting Workers")
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {projects
            .filter((p) => p.status === "In progress")
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </TabsContent>

        <TabsContent value="finished" className="space-y-4">
          {projects
            .filter((p) => p.status === "Finished")
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {projects
            .filter((p) => p.status === "Received")
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          {projects
            .filter((p) => p.status === "Paid")
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </TabsContent>
      </Tabs>

      {/* Show all projects regardless of tab for demo purposes */}
      <div className="space-y-4 mt-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: any }) {
  return (
    <div className="border rounded-lg p-4 flex gap-4">
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
        <h3 className="font-semibold text-lg">{project.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{project.description}</p>
        <p className="text-sm mt-2">
          Status: <span className="font-medium">{project.status}</span>
        </p>
      </div>
      <div className="flex-shrink-0 self-center text-right">
        <p className="font-medium">{project.info}</p>
      </div>
    </div>
  )
}
