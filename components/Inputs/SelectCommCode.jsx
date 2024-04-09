'use client'
import Axios from "@/components/common/api/Axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from 'react';
import { uf_makeParams, uf_nullToStr, uf_convertArrToObj } from "@/components/common/util/Util";
import cn from "@/components/common/util/ClassName";

const SelectCommCode = ({codeName, className, className2, label, propertyName, selectValue, onChange, disabled, required, searchGb, ...inputProps}) => {  

  const [ commCodeList, setCommCodeList ] = useState({});
  const [ detailKey, setDetailKey ] = useState(codeName);
  
  const sechGb = useMemo(() => { searchGb }, [searchGb]);

  // 코드 조회
	const fetchCodeDataAxios = async() => {
    const params = {};     
    params['DETAIL_KEY'] = detailKey;
    //console.log(params);
    try {
      const response = await Axios.post("/api/v1/com/getCommonCodeList", params);
      setCommCodeList(response.data.data);
      
    } catch(error) {      
      return false;
    }
  }

  const codeList = useMemo(() => commCodeList, [commCodeList]);

  useEffect(() => {
    fetchCodeDataAxios();
  }, [detailKey]);

  return(
    <div className='flex'>
      <div className={cn('w-24 flex items-center', className2)}>
        <label className="mr-3 text-black font-size">{label}</label>
      </div>
      <div className='flex flex-1 items-center'>
        <select name={propertyName} value={selectValue} onChange={onChange} className={cn('relative z-20 border-[1px] border-stroke bg-transparent py-2 px-1 font-size outline-none transition focus:border-primary active:border-primary', className)}>
        {searchGb === 'A' ? <option value=''>전체</option>: ''}
        {
          
          codeList.length > 0 ? codeList.map((list, index) => {
            return (
              <option key={index} value={list.CODE_VALUE}>{list.CODE_TEXT}</option>              
            )
          }) : "<option value=''></option>"
        
        }
        </select>
      </div>
    </div>
  );
}


export default SelectCommCode;