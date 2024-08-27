import { useMap } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { MdMyLocation } from "react-icons/md";

export default function GpsButton() {
  const mapComponent = useMap();
  const setLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        mapComponent.flyTo([coords.latitude, coords.longitude], mapComponent.getZoom());
      });
    }
  };
  return (
    <Control position="topleft">
      <button className="bg-white border-2 border-sky-600 text-sky-600 hover:text-white hover:bg-sky-600 rounded-full p-2.5">
        <MdMyLocation size="25px" onClick={() => setLocation()} />
      </button>
    </Control>
  );
}
