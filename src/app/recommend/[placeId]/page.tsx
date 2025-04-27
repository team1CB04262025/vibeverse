"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RecommendPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-gray-50">
      {/* image */}
      <div className="relative w-full h-[250px]">
        <Image
          src="/images/Frame 29.svg"
          alt="Victrola Coffee Roasters"
          fill
          className="object-cover "
        />
      </div>

      {/* info */}
      <div className="flex flex-col flex-1 bg-white px-6 pt-6 pb-20 rounded-t-[24px]">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Victrola Coffee Roasters
        </h1>
        <p className="text-gray-600 mb-4 text-sm">
          300 Pine St Suite 100, Seattle, WA 98101
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            "Cozy",
            "Tasty",
            "Chill",
            "Hidden Gem",
            "Asian",
            "Dessert",
            "Artsy",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Reviews */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reviews</h2>

        <div className="space-y-6">
          <div>
            <p className="font-bold text-gray-900">John Doe · ★★★★☆</p>
            <p className="text-sm text-gray-500">23 reviews</p>
            <p className="text-gray-700 mt-1 text-sm">
              Such a Japanese sweet shop in Seattle that specializes in fruit
              sandwiches, Japanese soft serve, sundaes, and Japanese Matcha ice
              cream cookies...
            </p>
          </div>
          <div>
            <p className="font-bold text-gray-900">Tina A · ★★★★★</p>
            <p className="text-sm text-gray-500">7 reviews</p>
            <p className="text-gray-700 mt-1 text-sm">
              So amazing! The matcha soft serve was the perfect dessert after
              dinner. Soft, light, and perfectly sweet!
            </p>
          </div>
          <div>
            <p className="font-bold text-gray-900">Daniel Lee · ★★★★★</p>
            <p className="text-sm text-gray-500">18 reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}
