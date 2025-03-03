
import Link from "next/link";
import { useEffect, useState } from "react";
import CustomMenu from "../app/Components/CustomMenu";
import { useAuth, useClerk, useSession, useUser } from "@clerk/nextjs";
import axios from "axios";
import { Token } from "@clerk/nextjs/dist/types/server";

interface UserData {
  jwtToken: string;
  userId: string
  sessionId: string;
  clerkId: string;
  email: string;
  username: string;
  password?: string
  provider: 'google' | 'github' | 'normal';
  roles: string[]
}


const IndexPage = () => {
  // const [formData, setFormData] = useState<LoginData>({
  //   email: "",
  //   password: "",
  // });
  // const [error, setError] = useState<string>("");

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.email || !formData.password) {
  //     setError("Please fill all the fields");
  //     return;
  //   }
  // };

  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { session } = useSession();
  const clerk = useClerk()
  const [clerkId, setClerkId] = useState<string | null>(null)

  useEffect(() => {
    console.log("1111")
    if (clerk && clerk.client && clerk.client.id) {
      console.log("1111")
      setClerkId(clerk.client.id);
      console.log("Clerk ID:", clerk.client.id);
    }
  });

  const [token, setToken] = useState<string | null>(null);

  // console.log("user data" ,user);
  // console.log("Passwod", user.unsafeMetadata.password);
  // console.log('session' , session);


  const fetchToken = async () => {
    try {
      const fetchedToken = await getToken();
      setToken(fetchedToken);
      // console.log('Token:', fetchedToken);
      return fetchedToken;
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  useEffect(() => {
    const processUser = async () => {
        if (isSignedIn && user) {
            console.log("if pass 1");
            try {
                const token = await fetchToken();
                console.log("fetch pass 2");
                if (token) {
                    console.log("token call");
                    sendData(user, session, token);
                } else {
                    console.error('Token is null or undefined');
                }
            } catch (error) {
                console.error('Error processing user:', error);
            }
        }
    };

    processUser();
}, [isSignedIn, user, session]); 

  const sendData = async (userData: any, sessionData: any, token: string) => {
    console.log("Enter fun sendData");
    
    try {
      const provider: UserData['provider'] = userData.emailAddresses[0]?.verification?.strategy?.includes('google')
        ? 'google'
        : userData.emailAddresses[0]?.verification?.strategy?.includes('github')
          ? 'github'
          :  'normal'

          console.log("Before clierk id", clerkId);
          
      if (clerkId !== null) {

        const data: UserData = {
          jwtToken: token,
          sessionId: sessionData.id,
          userId: userData.id,
          clerkId: clerkId,
          email: userData.primaryEmailAddress.emailAddress,
          username: userData.username,
          provider: provider,
          roles:['User']
        };

        if(data.provider === 'normal'){
          data.password = userData.unsafeMetadata.password;
        } 


        console.log("Data Store , ", data);

        const response = axios.post('http://localhost:5000/create', data);
        console.log("Status := ",(await response).status);
        
      }

      console.log('User data sent to backend successfully:');
    } catch (error: any) {
      if (error.response) {

        if (error.response.status === 404) {

          console.error('Route not found on backend.');
        } else if (error.response.status === 409) {

          console.log('User already exists.');

          return;

        } else {

          console.error('Error sending user data:', error.response.data);
        }
      } else {
        console.error('Error sending user data:', error);
      }

    }
  };

  // console.log(userInfo);


  return (
    <>
      <div className="bg-blue-200 h-screen">

        <div className="flex container items-center m-auto justify-between p-10 ">
          <h1 className="text-2xl font-bold text-blue-700">E-Comm.com</h1>
          <CustomMenu />
        </div>
      </div>



      {/* <div className="container mx-auto   flex flex-col items-center justify-center p-4">

        <div className="flex items-center justify-evenly w-1/2 gap-5 ">

          <h1 className="text-3xl font-semibold text-center text-blue-600">
            Login Page
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="shadow-xl rounded-lg p-8 w-1/3 "
        >
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <Link href="/register" className="text-sm text-blue-600 hover:text-blue-800">
              Don&apos;t have an account? Register
            </Link>

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div> */}
    </>
  );
}

export default IndexPage;