"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton
} from "@clerk/nextjs";
import { useEffect, useState } from "react";

const Login = () => {
  // const { isSignedIn, user, isLoaded } = useUser();
  const [token, setToken] = useState<string | null>(null);

  // if (!isLoaded) {
  //   return <div>Loading...</div>;
  // }

  // if (!isSignedIn) {
  //   return <div>Sign in to view this page</div>;
  // }
  // console.log("User : ", user);

  const { getToken } = useAuth();
  // console.log("User1 : ", user1);

  useEffect(() => {
   
    const fetchToken = async () => {

        try {
          const token = await getToken();
          setToken(token); 
          console.log('Token:', token);
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      
    };


      fetchToken(); 

  }, [getToken]);
  // const token = await user1.getToken();

  // const clerkObj = useClerk();
  // console.log("Clerk Obj: = ", clerkObj);

  return (
    <>
      <div className="flex p-3 justify-end ">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      {/* {user ? <p>Welcome, {user.username}</p> : <p>Please sign in</p>} */}

      {/* <div>
        <p>Welcome, {user1?.orgId}!</p>
        <p>Your sessionId: {user1.sessionId}</p>
        <p>Your userId: {user1.userId}</p>
      </div> */}
       <h1 className="max-w-prose">Token : {token}</h1>

      {/* <button onClick={() => clerkObj.openSignIn({})}>Sign in</button> */}
    </>
  );
};

export default Login;
