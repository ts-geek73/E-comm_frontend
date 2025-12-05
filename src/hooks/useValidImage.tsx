import { useEffect, useState } from "react";

export const checkUrl = async (urls: string[]): Promise<string | null> => {
  for (let i = 0; i < urls.length; i++) {
    const isValid = await new Promise<boolean>((resolve) => {
      const img = new Image();
      img.src = urls[i];
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
    if (isValid) {
      return urls[i];
    }
  }
  return null;
};

function useValidImage(title:string, placeholder: string =  "/no-product.png") {
  const formetTitle = title.replaceAll(/[ .]/g, "").toLowerCase();
  
  const urls: string[] = [
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${formetTitle}/${formetTitle}-original.svg`,
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${formetTitle}/${formetTitle}-plain.svg`,
  ];

  const [src, setSrc] = useState<string>(placeholder);

  useEffect(() => {
    let isMounted = true;

    if (!!title) {
      async function fetchImage() {
        const finalUrl = await checkUrl(urls);
        if (finalUrl && isMounted) {
          setSrc(finalUrl);
        }
      }

      fetchImage();
    }

    return () => {
      isMounted = false;
    };
  }, [urls, placeholder]);

  return src as string;
}

export default useValidImage;
