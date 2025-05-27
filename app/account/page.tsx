import Link from "next/link"

export default function AccountPage() {
  // Sample user data
  const user = {
    username: "Username",
    firstName: "John",
    lastName: "Doe",
    birthdate: "XX / XX / XXXX",
    dateCreated: "XX / XX / XXXX",
    password: "********",
    phoneNumber: "XX.XX.XX.31.44",
    cardInfo: {
      status: "Active",
      type: "Credit",
      cardType: "Visa",
      number: "**************5344",
      expiryDate: "XX / XXXX",
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            <Link href="/account" className="block px-4 py-2 bg-gray-100 rounded font-medium">
              Profiles
            </Link>
            <Link href="/account/address" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              Address
            </Link>
            <Link href="/account/security" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              Security
            </Link>
            <Link href="/account/notifications" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              Notifications
            </Link>
          </nav>
        </div>

        {/* Account Content */}
        <div className="md:col-span-3">
          <div className="space-y-8">
            {/* Username Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Username</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Firstname:</p>
                    <p>{user.firstName}</p>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lastname:</p>
                  <p>{user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Birthdate:</p>
                  <p>{user.birthdate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date create:</p>
                  <p>{user.dateCreated}</p>
                </div>
              </div>
            </div>

            <hr />

            {/* Credentials Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Credentials</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Password:</p>
                  <p>{user.password}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number:</p>
                  <p>{user.phoneNumber}</p>
                </div>
              </div>
            </div>

            <hr />

            {/* Card Information Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Card Information</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Status:</p>
                  <p>{user.cardInfo.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Card:</p>
                  <p>{user.cardInfo.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Card type:</p>
                  <p>{user.cardInfo.cardType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Card Number:</p>
                  <p>{user.cardInfo.number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expired date:</p>
                  <p>{user.cardInfo.expiryDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
