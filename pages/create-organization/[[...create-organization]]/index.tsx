'use client'
import { CreateOrganization, OrganizationList, OrganizationProfile, OrganizationSwitcher, useOrganization } from '@clerk/nextjs'

export default function CreateOrganizationPage() {
    const { organization, isLoaded } = useOrganization();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }


  if (!organization) {
    return <div className='py-10 bg-blue-200 grid gap-4 h-screen justify-around items-center'>
        <h1 className='text-2xl font-bold'>No active organization found, Create one </h1>
         <CreateOrganization />
    </div>;
  }

console.log("Organization Data:", organization);



    return (
        <div className="py-10 bg-blue-200 grid gap-4 justify-around items-center">
            <CreateOrganization />
            <div className="flex gap-7">
                <div className="flex flex-col">
                    
                    <div className="flex flex-col p-4">

                        OrganizationSwitcher:
                        <OrganizationSwitcher />
                    </div>
                    <div className="flex flex-col">
                        OrganizationList :
                        <OrganizationList />
                    </div>
                </div>
                <div className="flex flex-col">
                    OrganizationProfile:
                    <OrganizationProfile />
                </div>

            </div>

        </div>)
}