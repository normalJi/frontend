'use client'
import Axios from "@/components/common/api/Axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from 'react';
import { uf_makeParams, uf_nullToStr, uf_convertArrToObj, uf_isNull } from "@/components/common/util/Util";
import cn from "@/components/common/util/ClassName";

/**
 * 
 * @param {*} codeName : 공통코드 조회 키값
 * @param {*} propertyName : 컬럼 명
 * @param {*} selectValue : 컬럼 데이터 값
 * @param {*} onChange : 함수
 * @param {*} searchRut : 조회 대상 ( CATEGORY - 서류 (점주/계약), 값이 없으면 공통코드 조회 )
 * @returns 
 */
const SelectCommonCode = ({codeName, className, propertyName, selectValue, onChange, disabled, required, searchGb, searchRut, ...inputProps}) => {  

  const [ commCodeList, setCommCodeList ] = useState({});
  const [ detailKey, setDetailKey ] = useState(codeName);

  // /**
  //  * 조회 대상
  //  * searchRut : CATEGORY - 서류
  //  */
  // const sechTbl = useMemo( () => { searchTbl }, [searchTbl] );
  const sechGb = useMemo(() => { searchGb }, [searchGb]);

  // 코드 조회
	const fetchCodeDataAxios = async() => {
    const params = {};     
    params['DETAIL_KEY'] = detailKey;
    //console.log(params);
    try {
      let response = '';      
      if( !uf_isNull(searchRut) ) {        
        response = await Axios.post(`/api/v1/com/get${searchRut}List`, params);
      } else {        
        response = await Axios.post("/api/v1/com/getCommonCodeList", params);
      }
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
    
    <select name={propertyName} value={selectValue} onChange={onChange} disabled={disabled} className={cn('relative z-20 border-[1px] border-stroke bg-transparent py-2 px-1 font-size outline-none transition focus:border-primary active:border-primary', className)}>
    {searchGb === 'A' ? <option value=''>전체</option>: ''}
    {          
      codeList.length > 0 ? codeList.map((list, index) => {              
          return (            
            <option key={index} value={list.CODE_VALUE}>{list.CODE_TEXT}</option>
          )
      }) : "<option value=''></option>"
    
    }
    </select>
  );
}


export default SelectCommonCode;