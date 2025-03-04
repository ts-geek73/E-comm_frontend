'use client'
import { useState, useEffect } from 'react';
import { useAuth, useUser, useSession, useClerk } from '@clerk/nextjs';

import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import api from '../utils/axoins'; 
import logo from '../public/e-co logo.png'
import Image from 'next/image'
import HeaderComp from '../app/Components/Header/page';
import ProductList from '@/app/Components/Product/ProductList';

interface UserData {
  jwtToken: string;
  userId: string;
  sessionId: string;
  clerkId: string;
  email: string;
  username: string;
  provider: 'google' | 'github' | 'normal';
  roles?: string[];
}

const IndexPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { session } = useSession();
  const clerk = useClerk();
  // console.log("Clerk Obj: ",clerk.client);
  
  const [clerkId, setClerkId] = useState<string | null>(null);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  // console.log("Base Url",baseURL);
  

  useEffect(() => {
    if (clerk && clerk.client && clerk.client.id != null ) {
      setClerkId(clerk.client.id);
      // console.log("Clerk ID:", clerk.client.id);
    }
  }, [clerk]);

  const fetchToken = async () => {
    try {
      const fetchedToken = await getToken();
      return fetchedToken;
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  useEffect(() => {
    // console.log("enter useEffect");
    
    const processUser = async () => {
      // console.log("enter useEffect processUser");
      if (isSignedIn ) {
        // console.log("enter useEffect processUser if");
        try {
          const token = await fetchToken();
          if (token != null && clerkId !== null ) {
            // console.log("Before Api Fun call", token , clerkId);
            
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
  }, [clerk]);

  const sendData = async (userData: any, sessionData: any, token: string) => {
    try {
      // console.log("Call Api fun");
      
      const provider: UserData['provider'] = userData.emailAddresses[0]?.verification?.strategy?.includes('google')
        ? 'google'
        : userData.emailAddresses[0]?.verification?.strategy?.includes('github')
        ? 'github'
        : 'normal';

        // console.log("Clerk Id:",clerkId);
        if (clerkId !== null && (sessionData && sessionData.id)) {
        // console.log("Clerk Id:",clerkId);
        
        const data: UserData = {
          jwtToken: token,
          sessionId: sessionData.id,
          userId: userData.id,
          clerkId: clerkId,
          email: userData.primaryEmailAddress.emailAddress,
          username: userData.username,
          provider: provider,
        };

        // console.log("Before API Call , ", data);
        
        const response = await api.put('/create', data);

        // const response = await axios.post(`${baseURL}/create`, data,{
        //   headers:{
        //     "Content-Type":"application/json"
        //   }
        // })

        // console.log("Status:", response.status);
        // console.log('User data sent to backend successfully');
      }
    } catch (error: any) {
      if (error.response) {
        console.log('Error sending user data:', error.response.data.message);
      } else {
        console.error('Error sending user data:', error);
      }
    }
  };

  if (!isLoaded) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className="bg-blue-200">
        <HeaderComp />
        
        <ProductList />
        <ToastContainer />
      </div>
    </>
  );
};

export default IndexPage;
