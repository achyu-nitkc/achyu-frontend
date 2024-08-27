import { useMap } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { MdMyLocation } from "react-icons/md";
import { useState } from "react";

export default function GpsButton() {
  const [_latitude, setLatitude] = useState<number>();
  const [_longitude, setLongitude] = useState<number>();

  const mapComponent = useMap();
  const setLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        mapComponent.flyTo([coords.latitude, coords.longitude], 11);
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
