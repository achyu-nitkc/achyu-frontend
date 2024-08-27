import { MapComponentProps, Post } from "./map";
import { Marker, Popup, useMapEvent } from "react-leaflet";

const LocationMarkers: React.FC<MapComponentProps> = ({ markers = [], setMarkers }) => {
  useMapEvent("click", (location) => {
    const post: Post = {
      postId: "",
      displayName: "",
      content: "",
      imageUrl: "",
      userWhere: "",
      latitude: location.latlng.lat,
      longitude: location.latlng.lng,
      address: "testAddress",
      constructionName: "",
      roadName: "",
    };
    setMarkers((prevMarkers) => [...prevMarkers, post]);
    console.log("Markers:", markers);
  });
  return (
    <>
      {markers !== null ? (
        markers.map((post) => (
          <Marker key={post.postId} position={[post.latitude, post.longitude]}>
            <Popup>{post.address}</Popup>
          </Marker>
        ))
      ) : (
        <div></div>
      )}
    </>
  );
};

export default LocationMarkers;
