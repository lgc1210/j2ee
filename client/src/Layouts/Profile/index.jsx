import React from "react";

const ProfileSidebar = React.lazy(() =>
  import("../../Components/ProfileSidebar")
);
const Loading = React.lazy(() => import("../../Components/ProfileSidebar"));

const ProfileLayout = ({ children }) => {
  return (
    <React.Suspense
      fallback={
        <Loading
          size='h-16 w-16'
          customStyle='w-full h-screen flex flex-col items-center justify-center'
          hasLoadingText
        />
      }>
      <div className='flex items-start gap-4 p-4 bg-black/5 h-screen'>
        <ProfileSidebar />
        {children}
      </div>
    </React.Suspense>
  );
};

export default ProfileLayout;
