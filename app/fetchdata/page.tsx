'use client';
import { useEffect, useState } from 'react';

export default function FetchData() {

  interface Data {
    user: any;
    msg: string
    firstName: string
    userId: number
    fullName: string;
    primaryEmail: string;
    token?: string
  }

  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await fetch('/api/auth');

        const result = await response.json();
        console.log('Data:= ', result);

        setData(result);
      } catch (err: any) {
        setError("2"+ err?.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const dataFetch = async () => {
      try {
        console.log("1");
        
        const res = await fetch("api/webhooks/test");
        console.log("2");
        
        const data = await res.json();
        console.log("WebHooks: ", data);
      } catch (err: any) {
        setError("1"+ err?.message);
      }
    };
    dataFetch();
  }, []);

  useEffect(() => {
    const fetchDatas = async () => {
      try {

        const response = await fetch('/api/back-req');
        console.log("pass1");

        const result = await response.json();
        console.log('Data:= ', result);

        setData((prevData) => {
          if (prevData) {
            return {
              ...prevData,
              ...result,
            };
          }
        });
        console.log("set Data :", data);
        
      } catch (err: any) {
        setError(err?.message);
      }
    }

    fetchDatas()
  }, [])

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Fetched Data</h1>

      <h1>{data.msg ? `Status : =  ${data.msg}` : " "}</h1>
      <h1>Hello, Mr {data.user.firstName}</h1>
      <h2>Hello, user {data?.userId} !!!</h2>
      <p>Token Data : {data?.token ? data.token.slice(0, 50) : 'No token available'}</p>

      <h1>Hello, {data.fullName} !!!</h1>
      <h2>Your Email Id : {data.primaryEmail}</h2>

    </div>
  );
}
