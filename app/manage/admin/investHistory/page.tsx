import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profile Page | Next.js E-commerce Dashboard Template",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};

const InvestHistory = () => {
  return (
    <>
      <div>
        <div>
          <div>(단위:원)</div>
          <div>계획(A)</div>
          <div>공급가액</div>
          <div>세액</div>
          <div>합계(B)</div>
          <div>차액(B-A)</div>
          <div>비고1</div>
          <div>비고2</div>
        </div>
        
        <div>
          <div>임대차계약</div>
          <div>
            <div>
              <div>보증금</div>
              <div><input type="text" /></div>
              <div><input type="text" /></div>
              <div><input type="text" /></div>
              <div><input type="text" /></div>
              <div><input type="text" /></div>
              <div><input type="text" /></div>
              <div><input type="text" /></div>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestHistory;
