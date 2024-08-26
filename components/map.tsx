import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent() {
  const dmsToDegree = (degree: number, minute: number, second: number): number => {
    return degree + minute / 60 + second / 60 / 60;
  };
  return (
    <MapContainer
      center={{ lat: dmsToDegree(35, 39, 29.1572), lng: dmsToDegree(139, 44, 28.8869) }} // 日本経緯度原点
      zoom={8.5}
      maxBounds={[
        [-90, Number.NEGATIVE_INFINITY],
        [90, Number.POSITIVE_INFINITY],
      ]}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
        url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
        minZoom={5}
      />
    </MapContainer>
  );
}
