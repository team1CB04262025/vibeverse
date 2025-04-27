"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { places } from "@/db/scripts/seedPlaces";
import ReviewChatBox from "@/components/ReviewChatBox";

type Place = (typeof places)[number];

interface VisitPlaceClientProps {
  place: Place;
}

export default function VisitPlaceClient({ place }: VisitPlaceClientProps) {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative w-full max-w-[390px] min-h-[844px] mx-auto bg-white overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-medium mb-2 text-center mt-8">
          Looks like you visited
        </h2>
        <h1 className="text-2xl font-bold mb-6 text-center">
          &quot;{place.name}&quot;
        </h1>
        <div className="bg-white rounded-xl shadow p-6 mb-8 w-[340px] border">
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
            <div className="text-gray-500 text-sm">
              {place.address.formatted}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-[340px]">
          <button
            onClick={() => setIsChatOpen(true)}
            className="cursor-pointer bg-indigo-900 text-white py-3 rounded-full font-semibold text-lg"
          >
            Quick Review
          </button>
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer border-2 border-indigo-900 text-indigo-900 py-3 rounded-full font-semibold text-lg"
          >
            Skip for Now
          </button>
        </div>
      </div>

      {/* ChatBox pop up */}
      {isChatOpen && (
        <ReviewChatBox place={place} onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
}
