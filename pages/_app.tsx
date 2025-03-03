import { AppProps } from "next/app";
import "./../app/globals.css";
import { ClerkProvider, RedirectToSignIn } from "@clerk/nextjs";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <ClerkProvider>
        {/* <RedirectToSignIn /> */}
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
};

export default MyApp;
