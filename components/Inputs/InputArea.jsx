'use client'

import { useState } from "react";
import cn from "@/components/common/util/ClassName";

const InputTwo = ({className, label, propertyName, value, onChange, propertyName2, value2, ...inputs}) => {

  // 실면적 토글
  const [toggle, setToggle] = useState(false);
  const clickedToggle = () => {
    setToggle((prev) => !prev);		
  }  

  return (
    <div className='flex mt-2'>
      <div className='w-24 flex items-center mb-2'>
        <label className="mr-3 text-black font-size">{label}
          <span className="border-[1px] border-meta-1 inline-flex rounded-md items-center justify-center px-1 py-1 font-size font-small text-meta-1 hover:bg-opacity-90 cursor-pointer" 
              onClick={clickedToggle}>
                {/* 평 */}
            <svg className="h-3 w-3 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <polyline points="23 4 23 10 17 10" />  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
          </span>
          <span className="font-bold text-meta-1">*</span>
        </label>
      </div>
      <div className={`relative shadow-sm ${toggle === false ? "": "hidden"}`}>
        <input
          type="text"
          name={propertyName}
          value={value}
          onChange={onChange}
          className={cn('border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size', className)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center text-xs mr-2">m²</div>
      </div>
      <div className={`relative shadow-sm ${toggle === true ? "": "hidden"}`}>
        <input
          type="text"
          name={propertyName2}
          value={value2}
          onChange={onChange}
          className={cn('border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size', className)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center text-xs mr-2">평</div>
      </div>
    </div>
  )
}

export default InputTwo;