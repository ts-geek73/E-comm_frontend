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

function useValidImage(urls: string[], placeholder: string) {
  const [src, setSrc] = useState<string | null>(placeholder);

  useEffect(() => {
    let isMounted = true;

    if (urls.length === 0) {
      setSrc(placeholder);
    } else {
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
