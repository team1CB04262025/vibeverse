"use client";

import Image from "next/image";
import { useState } from "react";
import ChatBox from "@/components/ChatBox";

export default function VisitPlacePage({
  params,
}: {
  params: { placeId: string };
}) {
  const place = {
    name: "Victrola Coffee Roasters",
    address: "300 Pine St Suite 100, Seattle, WA 98101",
    imageUrl: "/images/victrola.jpg",
  };

  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative w-full max-w-[390px] min-h-[844px] mx-auto bg-white overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-medium mb-2 text-center mt-8">
          Looks like you visited
        </h2>
        <h1 className="text-2xl font-bold mb-6 text-center">“{place.name}”</h1>

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
            <div className="text-gray-500 text-sm">{place.address}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-[340px]">
          <button
            onClick={() => setIsChatOpen(true)}
            className="cursor-pointer bg-indigo-900 text-white py-3 rounded-full font-semibold text-lg"
          >
            Quick Review
          </button>
          <button className="cursor-pointer border-2 border-indigo-900 text-indigo-900 py-3 rounded-full font-semibold text-lg">
            Skip for Now
          </button>
        </div>
      </div>

      {/* ChatBox pop up */}
      {isChatOpen && <ChatBox onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
