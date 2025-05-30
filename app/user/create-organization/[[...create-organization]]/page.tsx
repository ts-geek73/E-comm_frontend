'use client'
import { CreateOrganization, OrganizationList, OrganizationProfile, OrganizationSwitcher, useOrganization } from '@clerk/nextjs'

export default function CreateOrganizationPage() {
    const { organization, isLoaded } = useOrganization();

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    const CustomPage = () => {
        return (
            <div>
                <h1>Custom page</h1>
                <p>This is the content of the custom page.</p>
            </div>
        )
    }

    const DotIcon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
            </svg>
        )
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
                    <OrganizationProfile >
                        <OrganizationProfile.Page label="Custom Page" labelIcon={<DotIcon />} url="custom-page">
                            <CustomPage />
                        </OrganizationProfile.Page>

                        <OrganizationProfile.Page label="Terms" labelIcon={<DotIcon />} url="terms">
                            <div>
                                <h1>Custom Terms Page</h1>
                                <p>This is the content of the custom terms page.</p>
                            </div>
                        </OrganizationProfile.Page>
                    </OrganizationProfile>
                </div>

            </div>

        </div>)
}