import { BarChart3, Users, MousePointerClick, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function SellerDashboard() {
  // Sample dashboard data
  const stats = [
    {
      title: "Revenue",
      value: "$53,000",
      change: "+55%",
      icon: (
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
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
    },
    {
      title: "Orders",
      value: "2,300",
      change: "+5%",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      title: "Customers",
      value: "+3,052",
      change: "-14%",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Avg. Order Value",
      value: "$173,000",
      change: "+8%",
      icon: (
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
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
    },
  ]

  const userStats = [
    { title: "Views", value: "32,984" },
    { title: "Clicks", value: "2.42m" },
    { title: "Sales", value: "2,400$" },
    { title: "Items", value: "320" },
  ]

  const projects = [
    { name: "Chatbox Soft UI Version", budget: "$14,000", progress: 60 },
    { name: "Add Progress Track", budget: "$3,000", progress: 10 },
    { name: "Fix Platform Errors", budget: "$2,000", progress: 100 },
    { name: "Launch our Mobile App", budget: "$32,000", progress: 100 },
    { name: "Add the New Pricing Page", budget: "$400", progress: 25 },
    { name: "Redesign New Online Shop", budget: "$7,800", progress: 40 },
  ]

  const orders = [
    { id: "#2400", title: "Design changes", time: "22 DEC 7:20 PM" },
    { id: "#2400", title: "New order #4219423", time: "21 DEC 11:21 PM" },
    { id: "#2400", title: "Server Payments for April", time: "21 DEC 9:28 PM" },
    { id: "#2400", title: "New card added for order #3210145", time: "20 DEC 3:52 PM" },
    { id: "#2400", title: "Unlock packages for Development", time: "19 DEC 11:35 PM" },
    { id: "#2400", title: "New order #9851258", time: "18 DEC 4:41 PM" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`p-2 rounded-full ${stat.change.startsWith("+") ? "bg-green-100" : "bg-red-100"}`}>
                  {stat.icon}
                </div>
              </div>
              <p className={`text-sm mt-2 ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                {stat.change} since last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Sales overview</CardTitle>
            <div className="text-sm text-muted-foreground">
              (+42) more <span className="text-gray-400">in 2023</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Users</CardTitle>
            <p className="text-sm text-muted-foreground">(+23) than last week</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-[100px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {userStats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-1">
                      {index === 0 && <Users className="h-4 w-4" />}
                      {index === 1 && <MousePointerClick className="h-4 w-4" />}
                      {index === 2 && <ShoppingBag className="h-4 w-4" />}
                      {index === 3 && (
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
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                          <path d="M3 6h18"></path>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      )}
                    </div>
                    <p className="font-bold">{stat.value}</p>
                    <div className="h-1 w-full bg-gray-200 rounded-full">
                      <div className="h-1 bg-primary rounded-full" style={{ width: `${(index + 1) * 25}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500">{stat.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Projects</CardTitle>
            <div className="text-sm text-muted-foreground">30 done this month</div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {projects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{project.name}</p>
                    <p className="text-gray-500">{project.budget}</p>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <p className="text-xs text-right text-gray-500">{project.progress}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Orders overview</CardTitle>
            <div className="text-sm text-muted-foreground">+30% this month</div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${index % 2 === 0 ? "bg-green-100" : "bg-blue-100"}`}>
                    {index % 2 === 0 ? (
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
                        className="h-4 w-4 text-green-600"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    ) : (
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
                        className="h-4 w-4 text-blue-600"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{order.title}</p>
                    <p className="text-sm text-gray-500">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
