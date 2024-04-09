'use client';

import { useMemo, useState } from "react";

import Input from "@/components/Inputs/Input";

const DocmentsDetail = (props) => {
  const subDetails = useMemo(() => props.subDetails, [props.subDetails]);  
  
  // 수정 반영
  const func_inputChange = (index, e) => {
    const values = [...subDetails];
    
    values[index].ITEM_CONTENTS = e.target.value;
    
    //setDetails(values);    
    props.getCateData(values);  // 상위에 값 전달
  };    


  return(    
    <>
      {
        subDetails && subDetails.map((row, index) => (
          <div key={index} className='flex'>
            <div className='w-24 flex items-center'>
              <label className="mr-3 text-black font-size">{row.CATE_ITEM}</label>
            </div>
            <div className='flex flex-1 items-center'>                                   
              <Input type="text" propertyName="ITEM_CONTENTS" onChange={(e) => func_inputChange(index, e)} value={row.ITEM_CONTENTS}  className="w-full" />
            </div>
          
          </div>
        ))

      }
    
    </>
      
    

  );
}

export default DocmentsDetail;