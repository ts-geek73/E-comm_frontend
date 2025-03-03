import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import accessDenied from '../../public/access-denied.png'
import accessApproved from '../../public/approve-access.png'

export default function ProtectedPage() {
    const { getToken } = useAuth();
    const [authenticate, setAuthenticate] = useState<boolean | null>(null); // Use null for initial state
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = await getToken();
            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/protected', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, 
                    },
                });

                if (response.status === 200) {
                    setAuthenticate(true);
                } else {
                    setAuthenticate(false);
                }
            } catch (error: any) {
                if (error.response) {
                    const status = error.response.status;
                    const message = error.response.data.message || 'An error occurred';

                    if (status === 401) {
                        toast.error(`Unauthorized: ${message}`);
                        setAuthenticate(false);
                    } else if (status === 403) {
                        toast.error(`Forbidden: ${message}`);
                        setAuthenticate(false);
                    } else if (status === 404) {
                        toast.error(`Not Found: ${message}`);
                        setAuthenticate(false);
                    } else {
                        toast.error(`Server Error: ${message}`);
                        setAuthenticate(false);
                    }
                } else {
                    toast.error('Network error or server unavailable.');
                    setAuthenticate(false);
                }
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