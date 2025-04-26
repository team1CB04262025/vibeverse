import Image from "next/image";

export default function VisitPlacePage({
  params,
}: {
  params: { placeId: string };
}) {
  // TODO: 실제로는 placeId로 DB에서 장소 정보를 불러와야 함
  // 여기서는 예시/mock 데이터 사용
  const place = {
    name: "Victrola Coffee Roasters",
    address: "300 Pine St Suite 100, Seattle, WA 98101",
    imageUrl: "/images/victrola.jpg", // public/images 폴더에 이미지 필요
  };

  return (
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
        <button className="bg-indigo-900 text-white py-3 rounded-full font-semibold text-lg">
          Quick Review
        </button>
        <button className="border-2 border-indigo-900 text-indigo-900 py-3 rounded-full font-semibold text-lg">
          Skip for Now
        </button>
      </div>
    </div>
  );
}
