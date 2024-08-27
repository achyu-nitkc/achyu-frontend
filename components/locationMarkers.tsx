import { Post } from "./map";
import { useState } from "react";
import { Marker, Popup, useMapEvent } from "react-leaflet";

export default function LocationMarkers() {
  const [posts, setPosts] = useState<Post[]>([]);
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
    setPosts((prevValue) => [...prevValue, post]);
  });

  return (
    <>
      {posts.map((post) => (
        <Marker key={post.postId} position={[post.latitude, post.longitude]}>
          <Popup>{post.address}</Popup>
        </Marker>
      ))}
    </>
  );
}
