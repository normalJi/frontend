'use client';
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Navigation = () => {
  const [ seq, setSeq ] = useState('');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  useEffect(() => {
    setSeq(searchParams.get('seq'));
  }, []);  

  return (
    <>
      <nav className="relative z-0 flex border border-stroke overflow-hidden" aria-label="Tabs" role="tablist">
        <Link className={`hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 relative min-w-0 flex-1 bg-white first:border-s-0 border-s py-4 px-4 text-gray-500 hover:text-gray-700 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none 
                        ${ ( pathname === "/admin/manage/store/administering" ) && "font-medium border-b-2" }`} href={{pathname: `/admin/manage/store/administering`, query: {"seq": seq}}}>매장정보</Link>  
        
        <Link className={`hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none
                        ${ ( pathname === "/admin/manage/store/investHistory" ) && "font-medium border-b-2" }`} href={{pathname: `/admin/manage/store/investHistory`, query: {"seq": seq}}}>투자내역</Link>
        
        <Link className={`hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none
                        ${ ( pathname === "/admin/manage/store/ownerDocument" ) && "font-medium border-b-2" }`} href={{pathname: `/admin/manage/store/ownerDocument`, query: {"seq": seq}}}>점주서류</Link>
        
        <Link className={`hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none
                        ${ ( pathname === "/admin/manage/store/contractDocument" ) && "font-medium border-b-2" }`} href={{pathname: `/admin/manage/store/contractDocument`, query: {"seq": seq}}}>계약서류</Link>
        
        <Link className={`hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none
                        ${ ( pathname === "/admin/manage/store/salesInfo" ) && "font-medium border-b-2" }`} href={{pathname: `/admin/manage/store/salesInfo`, query: {"seq": seq}}}>매출정보</Link>
        
        <Link className={`hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none
                        ${ ( pathname === "/admin/manage/store/staffInfo" ) && "font-medium border-b-2" }`} href={{pathname: `/admin/manage/store/staffInfo`, query: {"seq": seq}}}>직원정보</Link>
        
        <Link className={`hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none
                        ${ ( pathname === "/admin/manage/store/storeAnaly" ) && "font-medium border-b-2" }`} href={{pathname: `/admin/manage/store/storeAnaly`, query: {"seq": seq}}}>매장분석</Link>
        
        <Link className={`hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none
                        ${ ( pathname === "/admin/manage/store/qna" ) && "font-medium border-b-2" }`} href={{pathname: `/admin/manage/store/qna`, query: {"seq": seq}}}>문의내역</Link>
        
        <Link className={`hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none
                        ${ ( pathname === "/admin/manage/store/etc" ) && "font-medium border-b-2" }`} href={{pathname: `/admin/manage/store/etc`, query: {"seq": seq}}}>기타</Link>
        
        <Link className={`hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none
                        ${ ( pathname === "/admin/manage/store/openReady" ) && "font-medium border-b-2" }`} href={{pathname: `/admin/manage/store/openReady`, query: {"seq": seq}}}>오픈준비</Link>
      </nav>
    </>
  );
};

export default Navigation;
  