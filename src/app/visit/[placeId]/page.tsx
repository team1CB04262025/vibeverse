import { places } from "@/db/scripts/seedPlaces";
import VisitPlaceClient from "./VisitPlaceClient";

interface VisitPlacePageProps {
  params: {
    placeId: string;
  };
}

export default function VisitPlacePage({ params }: VisitPlacePageProps) {
  const place = places.find((p) => p.id === params.placeId);

  if (!place) {
    return <div>Place not found</div>;
  }

  return <VisitPlaceClient place={place} />;
}
