// import { UserButton, UserProfile } from '@clerk/nextjs'
// import WaitlistPage from '../../app/Components/waitlist/[[...waitlist]]/page'

// const UserProfilePage = () => <>
//     <div className="grid justify-center items-center h-screen">
//         <UserButton />
//         <UserProfile />
//     </div>
// </>

// export default UserProfilePage

'use client'


import { UserProfile } from '@clerk/nextjs'

const DotIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
        </svg>
    )
}

const CustomPage = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-8 space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">Custom Page</h1>
            <p className="text-gray-600">
                This is the content of the custom page.
            </p>
        </div>
    );
};

const CustomORGPage = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-8 space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">Organization Page</h1>
            <p className="text-gray-600">
                This is the content of the custom organization page.
            </p>
        </div>
    );
};



const UserProfilePage = () => (
    <div className="grid justify-center bg-red-100 items-center h-screen">

        <UserProfile>
            {/* You can pass the content as a component */}
            <UserProfile.Page label="Organization Page" labelIcon={<DotIcon />} url="custom-page">
                <CustomORGPage />
            </UserProfile.Page>

            <UserProfile.Page label="Custom Page" labelIcon={<DotIcon />} url="org-page">
                <CustomPage />
            </UserProfile.Page>
            <UserProfile.Page label="Terms" labelIcon={<DotIcon />} url="terms">
                <div className="bg-white shadow-md rounded-lg p-8 space-y-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Custom Terms Page</h1>
                    <p className="text-gray-600">
                        This is the content of the custom terms page.
                    </p>
                </div>
            </UserProfile.Page>

        </UserProfile>
    </div>
)

export default UserProfilePage