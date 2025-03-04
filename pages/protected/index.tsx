import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import accessDenied from '../../public/access-denied.png';
import accessApproved from '../../public/approve-access.png';
import api from '../../utils/axoins';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { getToken } = useAuth();  // Use the client-side `useAuth` hook
  const [authenticate, setAuthenticate] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const basrURL = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter()

  // console.log(basrURL);


  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }
      localStorage.setItem("AuthToken", token);

      try {
        console.log("before API ");

        // const response = await axios.get(`${basrURL}/protected` ,{
        //     headers:{
        //         authorization : `Bearer ${token}`
        //     }
        // });  

        console.log("Before API call");
        const response = await api.get('/protected');
        console.log("After API call", response);

        if (response.status === 200) {
          setAuthenticate(true);
          toast.success("Authorized, redirect to Admin Page")
          setTimeout(()=>{
            router.push("admin/product-crud")
          }, 3000)
        } else {
          setAuthenticate(false);
        }
      } catch (error: any) {
        // toast.error('server unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-200 py-8">
      <div className="max-w-2xl w-1/2 bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
        <h1 className="text-3xl font-semibold text-blue-700 mb-6">Protected Page</h1>
        {loading ? (
          <div className="text-gray-500 text-lg">Loading...</div>
        ) : authenticate === true ? (
          <div className="flex flex-col items-center">
            <Image src={accessApproved} alt="Access Approved" height={200} width={200} className="mb-4" />
            <div className="text-green-600 font-semibold text-xl">Access Granted!</div>
          </div>
        ) : authenticate === false ? (
          <div className="flex flex-col items-center">
            <Image src={accessDenied} alt="Access Denied" height={200} width={200} className="mb-4" />
            <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600">You do not have permission to access this page.</p>
          </div>
        ) : (
          <div className="text-gray-500 text-lg">No data available or error occurred.</div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
