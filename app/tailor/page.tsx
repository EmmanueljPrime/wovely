import {prisma} from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function TailorListPage() {
  const sellers = await prisma.seller.findMany({
    include: {
      user: true,
    },
    orderBy: { business_name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">All Tailors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {sellers.map((seller) => (
          <Link
            key={seller.id}
            href={`/tailor/${seller.id}`}
            className="group relative block rounded-lg transition-transform hover:scale-105"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
              <Image
                src={seller.user.image || "/placeholder-user.jpg"}
                alt={seller.business_name}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="mt-2 text-center">
              <h3 className="text-sm font-medium">{seller.business_name}</h3>
              <p className="text-xs text-gray-500">{seller.companyCity || "-"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

