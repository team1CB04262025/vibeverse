"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { places } from "@/db/scripts/seedPlaces";

type Place = (typeof places)[number];

interface VisitPlaceClientProps {
  place: Place;
}

export default function VisitPlaceClient({ place }: VisitPlaceClientProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-medium mb-2 text-center mt-8">
        Looks like you visited
      </h2>
      <h1 className="text-2xl font-bold mb-6 text-center">
        &quot;{place.name}&quot;
      </h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8 w-[340px] border border-[#CFCFE1]">
        <div className="mb-4">
          <Image
            src={place.imageUrl}
            alt={place.name}
            width={320}
            height={200}
            className="rounded-lg object-cover"
            unoptimized
          />
        </div>
        <div>
          <div className="font-bold text-lg">{place.name}</div>
          <div className="text-gray-500 text-sm">{place.address.formatted}</div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[340px]">
        <button className="bg-[#232166] text-white py-3 rounded-full font-semibold text-lg hover:bg-[#232166]/90 cursor-pointer transition-colors">
          Quick Review
        </button>
        <button
          className="border-2 border-[#232166] text-[#232166] py-3 rounded-full font-semibold text-lg hover:bg-[#232166]/5 cursor-pointer transition-colors"
          onClick={() => router.push("/")}
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}
