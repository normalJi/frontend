"use client";
import "@/app/globals.css";
import "@/app/data-tables-css.css";
import "@/app/satoshi.css";
import { useState, useEffect } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Layout({
  children,
}: {
  children: React.ReactNode;  
}) { 

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">      
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">{children}</div>
        </main>        
      </div>
    </div>
    
  );
}
