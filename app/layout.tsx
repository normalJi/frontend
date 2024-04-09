"use client";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;  
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (    
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}   
      </body>
    </html>
  );
}
