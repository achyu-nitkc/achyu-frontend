import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Post } from "@/components/map";
import { CiMapPin } from "react-icons/ci";
import { IoText } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import path from "path";
import fs from "fs";

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

  useEffect(() => {
    const fetchData = async () => {
      if (posts === null) {
        return;
      }
      if (posts.length === 0) {
        return;
      }
      if (latitude === posts[posts.length - 1].latitude || longitude === posts[posts.length - 1].longitude) {
        return;
      }
      tokenCookie = getCookie("token");
      if (tokenCookie === undefined) {
        await router.push("/login");
      }
      console.log("@fetchData");
      setLatitude(posts[posts.length - 1].latitude);
      setLongitude(posts[posts.length - 1].longitude);
      await getData();
    };
    fetchData();
  }, [posts]);

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
        setPosts((prevPosts) => {
          if (!posts) {
            return tmpPosts;
          }
          if (!tmpPosts) {
            return prevPosts;
          }
          const uniqPosts = tmpPosts.filter((tmpPost) => !prevPosts.some((post) => post.postId == tmpPost.postId));
          return [...prevPosts, ...uniqPosts];
        });
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

  const inputRef = useRef<HTMLInputElement | null>(null);

  const divRef = useRef<HTMLDivElement | null>(null);

  const fileUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const [formData, setFormData] = useState({
    Address: "",
    Content: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userPost = posts.find((post) => post.postId === "user");
    const userLat = userPost?.latitude;
    const userLon = userPost?.longitude;
    tokenCookie = getCookie("token");

    if (imageFile) {
      const imageForm = new FormData();
      imageForm.append("file", imageFile);

      const response1 = await fetch("api/upload", {
        method: "POST",
        body: imageForm,
      });
      if (response1.status !== 200) {
        return;
      }
      const res = await response1.json();
      const imageURL = res.message;

      const jsonData = {
        Token: tokenCookie,
        Latitude: userLat,
        Longitude: userLon,
        Content: formData.Content,
        ImageURL: imageURL,
        Where: formData.Address,
      };
      const response2 = await fetch("http://localhost:8080/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
      if (response2.ok) {
        console.log("POST SUCCESS!");
        setIsVisible(false);
      } else {
        console.log("ERROR @ POST");
      }
    } else {
      const jsonData = {
        Token: tokenCookie,
        Latitude: userLat,
        Longitude: userLon,
        Content: formData.Content,
        ImageURL: "",
        Where: formData.Address,
      };
      const response = await fetch("http://localhost:8080/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
      if (response.ok) {
        console.log("POST SUCCESS!");
      } else {
        console.log("ERROR @ POST");
      }
    }
  };

  const [backgroundImg, setBackgroundImg] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("@ handleFileChange");
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const targetFile = e.currentTarget.files[0];
      setImageFile(targetFile);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        console.log(result);
        setBackgroundImg(result);
      };
      reader.readAsDataURL(targetFile);
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
              "border-2 bg-white border-sky-600 rounded-full text-sky-600 px-12 py-2 inline-block font-semibold hover:text-white hover:bg-sky-600"
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
              <form onSubmit={handleSubmit} className={"flex flex-col items-start"}>
                <div className={"p-2 rounded-3xl flex flex-row items-center mb-3 border-b-2 border-b-sky-400 w-full"}>
                  <CiMapPin className={"text-gray-400 mr-2"} />
                  <input
                    type={"text"}
                    name={"Address"}
                    onChange={handleChange}
                    placeholder={"Ex: Kioi1-3 Chioda,Tokyo"}
                    className={"text-lg outline-none flex-1 p-2 hover:bg-gray-100"}
                  />
                </div>
                <div className={"p-2 rounded-3xl flex flex-row items-center mb-3 border-b-2 border-b-sky-400 w-full"}>
                  <IoText className={"text-gray-400 mr-2"} />
                  <input
                    type={"text"}
                    name={"Content"}
                    onChange={handleChange}
                    placeholder={"Ex: It's dangerous!"}
                    className={"text-lg outline-none flex-1 p-2 hover:bg-gray-100"}
                  />
                </div>
                <div
                  className={
                    "p-2 aspect-video border-dashed border-2 items-center border-sky-600 rounded-2xl bg-gray-100 hover:bg-gray-200"
                  }
                  onClick={fileUpload}
                  style={{
                    backgroundImage: backgroundImg === "" ? "none" : `url(${backgroundImg})`,
                    backgroundSize: "cover",
                  }}
                >
                  <div ref={divRef} className={"flex-row m-12 flex items-center"}>
                    {backgroundImg === "" ? (
                      <>
                        <FiUpload className={"text-xl m-2"} />
                        <p className={"text-xl"}>Add Image!</p>
                      </>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <input onChange={handleFileChange} type={"file"} name={"file"} ref={inputRef} hidden={true} />
                </div>

                <div className={"border-2 w-10 border-white inline-block mb-2"} />
                <button
                  type={"submit"}
                  className={
                    "border-2 self-center border-sky-600 rounded-full text-sky-600 px-12 py-2 inline-block font-semibold hover:text-white hover:bg-sky-600"
                  }
                >
                  Post!
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
