"use client";
import Navigation from "@/components/Manage/navigator";
import UserInfo from "@/components/Manage/userInfo";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;  
}) {
  
  return (   
    <>
      <Navigation />
      <UserInfo />
      {/* <!-- ===== Main Content Start ===== --> */}
      <main>
          <div className="mx-auto max-w-screen-2xl">
              {children}
          </div>
      </main>
    </> 
  );
}
