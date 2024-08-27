import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Post } from "@/components/map";
import { CiMapPin } from "react-icons/ci";
import { IoText } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";

export default function Home() {
  //Get Cookie
  const getCookie = useCallback((name: string): string | undefined => {
    const value = `;${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts[1];
    }
    return undefined;
  }, []);
  //Get user's gps data
  const getLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
      });
    }
  }, []);

  const router = useRouter();

  //post data
  const [posts, setPosts] = useState<Post[]>([]);

  //Information Initialization
  useEffect(() => {
    const fetchData = async () => {
      tokenCookie = getCookie("token");
      if (tokenCookie === undefined) {
        await router.push("/login");
      }
      getLocation();
      await getData();
    };
    fetchData();
  }, []);

  //gps data
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  //UI SECTION START
  const [isVisible, setIsVisible] = useState<boolean>(false);
  //UI SECTION END

  //jwt token
  let tokenCookie: string | undefined;

  const getData = async () => {
    const jsonData = {
      Token: tokenCookie,
      Latitude: latitude,
      Longitude: longitude,
    };
    try {
      const response = await fetch("http://localhost:8080/get", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
      //map pin

      if (response.ok) {
        const tmpPosts: Post[] = await response.json();
        setPosts(tmpPosts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Loading map
  // hooks: https://react-leaflet.js.org/docs/api-map/#hooks
  const MapComponent = useMemo(
    () =>
      dynamic(() => import("../../components/map"), {
        loading: () => <p>loading...</p>,
        ssr: false,
      }),
    [getCookie, getLocation],
  );

  const handleClose = (e: any) => {
    if (e.target.id === "wrapper") {
      setIsVisible(false);
    }
  };

  return (
    <div className={"flex min-h-screen w-full relative"}>
      <div className={"z-0 flex bg-white flex-col w-full justify-center absolute"}>
        <MapComponent markers={posts} setMarkers={setPosts} />
      </div>
      <div className={"z-10 flex flex-col bg-white absolute top-32 left-16 w-1/6 h-3/4 shadow-2xl rounded-3xl"}>
        <div className={"flex items-center flex-row m-3 p-2 bg-gray-100 rounded-3xl"}>
          <input type={"text"} placeholder={"Search"} className={"w-full h-full m-2 bg-gray-100 flex-1 outline-none"} />
        </div>
        <div className={"flex flex-col bg-white"}>
          {posts !== null ? (
            posts.map((post) => (
              <div className={"border-b-2 hover:bg-gray-100 border-sky-600 p-3"}>
                <p className={"text-m"}>{post.constructionName === "" ? "Unknown" : post.constructionName}</p>
                <div className={"flex-col"}>
                  <p className={"text-xs"}>{post.address}</p>
                  <p>{post.roadName}</p>
                </div>
              </div>
            ))
          ) : (
            <div />
          )}
          <p className={"text-xs m-3"}>You've reached the end of the list.</p>
        </div>

        <div className={"self-center m-10"}>
          <button
            onClick={() => setIsVisible(true)}
            className={
              "border-2 border-sky-600 rounded-full text-sky-600 px-12 py-2 inline-block font-semibold hover:text-white hover:bg-sky-600"
            }
          >
            Post!
          </button>
        </div>
      </div>
      {isVisible ? (
        <div
          id={"wrapper"}
          onClick={handleClose}
          className={
            "absolute z-20 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex-col flex justify-center items-center"
          }
        >
          <div className={"w-1/3 min-w-min h-1/3 min-h-min flex flex-col"}>
            <button onClick={() => setIsVisible(false)} className={"text-white text-xl place-self-end"}>
              X
            </button>
            <div className={"bg-white flex-col rounded-3xl p-5"}>
              <form className={"flex flex-col items-start"}>
                <div className={"p-2 rounded-3xl flex flex-row items-center mb-3 border-b-2 border-b-sky-400 w-full"}>
                  <CiMapPin className={"text-gray-400 mr-2"} />
                  <input
                    type={"text"}
                    placeholder={"Ex: Kioi1-3 Chioda,Tokyo"}
                    className={"text-lg outline-none flex-1 p-2 hover:bg-gray-100"}
                  />
                </div>
                <div className={"p-2 rounded-3xl flex flex-row items-center mb-3 border-b-2 border-b-sky-400 w-full"}>
                  <IoText className={"text-gray-400 mr-2"} />
                  <textarea
                    placeholder={"Ex: It's dangerous!"}
                    className={"text-lg outline-none flex-1 p-2 hover:bg-gray-100"}
                  />
                </div>
                <div
                  className={
                    "p-2 aspect-video border-dashed border-2 items-center border-sky-600 rounded-2xl bg-gray-100 hover:bg-gray-200"
                  }
                >
                  <div className={"flex-row m-12 flex items-center"}>
                    <FiUpload className={"text-xl m-2"} />
                    <p className={"text-xl"}>Add Image!</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
