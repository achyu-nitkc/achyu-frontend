import { useMapEvents } from "react-leaflet";

export default function MapEventHandler() {
  const map = useMapEvents({
    click(location) {
      map.setView(location.latlng, map.getZoom(), { animate: true });
    },
  });
  return <></>;
}
