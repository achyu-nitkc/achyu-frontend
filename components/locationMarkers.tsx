import { MapComponentProps, Post } from "./map";
import { Marker, Popup, useMapEvent } from "react-leaflet";
import Image from "next/image";

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
              <div>
                <p className={"text-m"}>{post.constructionName === "" ? "Unknown" : post.constructionName}</p>
                <div className={"flex-col"}>
                  <p className={"text-xs"}>{post.address}</p>
                  <p>{post.roadName}</p>
                </div>
                <div className={"flex-col border-b-2 border-b-sky-600"}>
                  <p>{post.postId !== "user" ? "投稿者: " + post.displayName : ""}</p>
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
                {post.postId !== "user" ? (
                  <div className={"flex-col"}>
                    <p>{post.content}</p>
                    {post.imageUrl.includes("edited-") ? (
                      <p className={"text-red-500"}>この画像は加工された可能性があります.</p>
                    ) : (
                      <p></p>
                    )}
                    {post.imageUrl !== "" ? (
                      <Image
                        width={320}
                        height={180}
                        src={"http://localhost:3000/images/" + post.imageUrl}
                        alt={"image"}
                      />
                    ) : (
                      <div />
                    )}
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </Popup>
          </Marker>
        ))
      ) : (
        <div />
      )}
    </>
  );
};

export default LocationMarkers;
