"use client";

import { useState } from "react";
import { CitySearch } from "./(components)/Search/Search";

import Image from "next/image";

import backgroundImg from "@/public/background.jpg";
import { AlgorithmContextProvider } from "@/lib/context/algorithm.context";
import { ThreeContextProvider } from "@/lib/context/three.context";
import { ColorContextProvider } from "@/lib/context/color.context";
import { Routify } from "./(components)/Main/Routify";

export default function Home() {
  const [mapIsReady, setMapIsReady] = useState(false);
  const [city, setCity] = useState("");

  return (
    <ThreeContextProvider>
      <AlgorithmContextProvider>
        <ColorContextProvider>
          {!mapIsReady && (
            <>
              <Image
                src={backgroundImg}
                alt="Background"
                quality={95}
                className="absolute h-screen w-screen -z-10 opacity-50"
              />
              <div className="h-screen w-screen items-center flex flex-col justify-center">
                <CitySearch setMapIsReady={setMapIsReady} setCity={setCity} />
              </div>
            </>
          )}
          {mapIsReady && <Routify city={city} />}
        </ColorContextProvider>
      </AlgorithmContextProvider>
    </ThreeContextProvider>
  );
}
