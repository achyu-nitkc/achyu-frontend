import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {Post} from "@/components/map";


interface MapComponentProps {
    markers: Post[]
}

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
  //Information Initialization
  useEffect(() => {
    const fetchData = async () => {
      tokenCookie = getCookie("token");
      if (tokenCookie === undefined) {
        await router.push("/login")
      }
      getLocation()
      await getData()
    };
    fetchData()
  }, [])

  //gps data
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  //jwt token
  let tokenCookie:string | undefined

  //post data
  const [posts,setPosts] = useState<Post[]>([])

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

      if(response.ok){
        const tmpPosts:Post[] = await response.json()
        setPosts(tmpPosts)
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

  return (
    <div className={"flex flex-col items-center justify-center min-h-screen py-2"}>
      {latitude !== null && longitude !== null ? (
        <p>
          Latitude @ {latitude} , Longitude @ {longitude}
        </p>
      ) : (
        <p>Loading gps information...</p>
      )}
      <MapComponent markers = {posts}>
      </MapComponent>
    </div>
  );
}
