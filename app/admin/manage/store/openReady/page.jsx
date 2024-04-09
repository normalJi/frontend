'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import UserInfo from "@/components/Manage/userInfo";

import OpenProcess from '@/components/Manage/Store/OpenReady/OpenProcess';
import Calendar from '@/components/Manage/Store/OpenReady/Calendar';

const OpenReady = () => {  
  const searchParams = useSearchParams();
  const [seq, setSeq] = useState(searchParams.get('seq'));  

  const [ show, setShow ] = useState(true);

  const funcShowHide = function(strGb) {
    if( strGb === 'O' ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }

  return (
    <>
      <UserInfo seq={seq} />

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-2" aria-label="Tabs" role="tablist">
          <span className={`hs-tab-active:font-semibold hs-tab-active:text-gray-600 bg-white py-4 px-1 text-gray-500 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer
            ${show ? "border-b-2" : ""}
          `}
            onClick={() => {funcShowHide('O')}}
          >
            개설프로세스
          </span>
          <span className={`hs-tab-active:font-semibold hs-tab-active:text-gray-600 bg-white py-4 px-1 text-gray-500 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer
            ${!show ? "border-b-2" : ""}
          `}
            onClick={() => {funcShowHide('C')}}
          >
            일정관리
          </span>          
        </nav>
      </div>

      <div className="mt-3">
        {
          show ? 
        <div>
          <OpenProcess seq={seq} />          
        </div> 
        : 
        <div>
        <Calendar seq={seq} />
      </div>


        }
        
        
      </div>

    </>
  );
};

export default OpenReady;
