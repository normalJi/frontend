"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Manage/navigator";

import Axios from "@/components/common/api/Axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;  
}) {

  return (        
    <>
      <Breadcrumb pageName="매장관리" />
      <Navigation />

      {/* <!-- ===== Main Content Start ===== --> */}
      
      <div className="mx-auto max-w-screen-2xl">
        {children}
      {/* {children} */}          
      </div>
          
      
    </> 
  );
}
