import { MapComponentProps, Post } from "./map";
import { Marker, Popup, useMapEvent } from "react-leaflet";

const LocationMarkers: React.FC<MapComponentProps> = ({ markers = [], setMarkers }) => {
  useMapEvent("click", (location) => {
    const post: Post = {
      postId: "user",
      displayName: "",
      content: "",
      imageUrl: "",
      userWhere: "",
      latitude: location.latlng.lat,
      longitude: location.latlng.lng,
      address: "",
      constructionName: "Pointed",
      roadName: "",
    };
    setMarkers((prevMarkers) => prevMarkers.filter((post) => post.postId !== "user"));
    setMarkers((prevMarkers) => [...(prevMarkers || []), post]);
    console.log("Markers:", markers);
  });
  return (
    <>
      {markers !== null && markers.length !== 0 ? (
        markers.map((post) => (
          <Marker key={post.postId} position={[post.latitude, post.longitude]}>
            <Popup>
              <div className={"max-w-2xl"}>
                <p className={"text-m"}>{post.constructionName === "" ? "Unknown" : post.constructionName}</p>
                <div className={"flex-col"}>
                  <p className={"text-xs"}>{post.address}</p>
                  <p>{post.roadName}</p>
                </div>
                <div className={"flex-col"}>
                  <p>{post.displayName}</p>
                  <p>
                    {post.postId !== "user" ? (
                      new Date(
                        Number(
                          ((BigInt(
                            new DataView(Buffer.from(post.postId.substring(0, 12), "base64").buffer).getUint32(0),
                          ) <<
                            32n) +
                            BigInt(
                              new DataView(Buffer.from(post.postId.substring(0, 12), "base64").buffer).getUint32(4),
                            )) /
                            1000n,
                        ),
                      ).toString()
                    ) : (
                      <div />
                    )}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))
      ) : (
        <div></div>
      )}
    </>
  );
};

export default LocationMarkers;
