import { MapContainer, TileLayer, ScaleControl, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import GpsButton from "./gpsButton";
import MapEventHandler from "./mapEventHandler";
import LocationMarkers from "./locationMarkers";
import React from "react";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

export interface Post {
  postId: string;
  displayName: string;
  content: string;
  imageUrl: string;
  userWhere: string;
  latitude: number;
  longitude: number;
  address: string;
  constructionName: string;
  roadName: string;
}

export interface MapComponentProps {
  markers: Post[];
  setMarkers: React.Dispatch<React.SetStateAction<Post[]>>;
}

function dmsToDegree(degree: number, minute: number, second: number): number {
  return degree + minute / 60 + second / 60 / 60;
}

const MapComponent: React.FC<MapComponentProps> = ({ markers = [], setMarkers }) => {
  return (
    <MapContainer
      center={{ lat: dmsToDegree(35, 39, 29.1572), lng: dmsToDegree(139, 44, 28.8869) }} // 日本経緯度原点
      zoom={11}
      zoomControl={false}
      maxBounds={[
        [-90, Number.NEGATIVE_INFINITY],
        [90, Number.POSITIVE_INFINITY],
      ]}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
        url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
        minZoom={5}
      />
      <ScaleControl position="bottomright" />
      <ZoomControl position="topright" />
      <GpsButton />
      <LocationMarkers markers={markers} setMarkers={setMarkers} />
      <MapEventHandler />
    </MapContainer>
  );
};

export default MapComponent;
