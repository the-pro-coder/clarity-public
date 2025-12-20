"use client";
import "./custom.css";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";

export default function SearchImage({
  keyword,
  className,
}: {
  keyword: string;
  className: string;
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const maximumImagesPerPage = 20; // change this whenever you change it in /api/images/route.ts
  const [chosenImageIndex, setChosenImageIndex] = useState(
    Math.floor(Math.random() * maximumImagesPerPage)
  );

  const searchImages = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/images?q=${query}`);
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keyword) {
      searchImages(keyword);
    }
  }, [keyword]);

  return (
    <Fragment>
      {loading
        ? ""
        : images.length > 0
        ? images.map(
            (image: { largeImageURL: string; tags: string }, index: number) => {
              if (index === chosenImageIndex) {
                console.log("WTF");
                return (
                  <Image
                    className={`${className} z-50 w-[150px] h-[150px] object-cover`}
                    key={index}
                    src={image.largeImageURL}
                    alt={`Image ${index} ${keyword}`}
                    width={150}
                    height={150}
                  />
                );
              }
            }
          )
        : ""}
    </Fragment>
  );
}
