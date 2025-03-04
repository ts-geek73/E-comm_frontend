import { ClerkProvider } from "@clerk/nextjs";
import { AppProps } from "next/app";
import "./../app/globals.css";

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
