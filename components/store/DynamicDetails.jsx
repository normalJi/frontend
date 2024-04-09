'use client';
import cn from "@/components/common/util/ClassName";
import Input from '@/components/Inputs/Input';
import { useEffect, useRef, useState, useImperativeHandle } from "react";
import { uf_isNull } from "@/components/common/util/Util";
import Axios from "@/components/common/api/Axios";

const DynamicDetails = ( {formFields, getFormData, seq, division}, props ) => {  

  const list = formFields;
  
  //const [ formList, setFormList ] = useState([{ITEM_ID: 0, ITEM_NM: '', ITEM_CONTENTS: '', STATUS: 'I' }]);
  const [ adUseSeq, setAdUseSeq  ] = useState(seq);
  const [ formList, setFormList ] = useState(list);
  
  useEffect(() => {
    if( !uf_isNull(list) && list.length > 0 ) {
      setFormList(list);
    } else {
      setFormList();
    }       
  }, [list]);
  
  // 동적 폼 생성 시작
  const nextID = useRef(1);    
  
  // 필드 생성
  const fucn_addFields = () => {    
    const list = formList && formList.length > 0 ? formList : [];
    const values = [...list, { ITEM_ID: nextID.current, ITEM_NM: '', ITEM_CONTENTS: '', DYNAMIC_DIVISION: division, STATUS: 'I' }];
    setFormList(values);
    nextID.current += 1; 		   // id값은 1씩 늘려준다.
  };

  // 건별 삭제
  const func_execDel = async(index, intSeq) => {
    const params = {};
    params["AD_DYNAMIC_DETAIL_SEQ"] = intSeq;
    params["AD_USE_SEQ"] = seq;
    params["DYNAMIC_DIVISION"] = division
    params["STATUS"] = 'RD';  // 건별 삭제 (row delete)
    console.log("intSeq : ", intSeq);
    const delItem = formList.filter(item => item.ITEM_ID !== index);
    if( !uf_isNull(intSeq) ) {
      if( confirm("삭제 하시겠습니까?") ) {
        await Axios.post("/api/v1/store/comm/save", params)
          .then(async function(response) {
            //const delItem = formList.filter(item => item.ITEM_ID !== index);
            setFormList(delItem);
            //getFormData(delItem);
          }).catch(function (error) {
            alert(`오류가 발생하였습니다. ${error}}`);
          });
      }
    } else {      
      setFormList(delItem);
    }
  }

  // 수정 반영
  const func_inputChange = (index, e) => {
    const values = [...formList];

    if (e.target.name === 'ITEM_NM') {
      values[index].ITEM_NM = e.target.value;
    } else {
      values[index].ITEM_CONTENTS = e.target.value;
    }
    setFormList(values);    
    getFormData(values);  // 상위에 값 전달
  };    
  // 동적 폼 생성 종료

  return (
    <>
      <div className="relative mb-1">
        <div className='flex mt-1 items-center justify-center'>
          <svg className="w-8 h-8 fill-primary text-gray-800 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z"
              onClick={() => fucn_addFields()}
            />
          </svg>                
        </div>
      </div>
      <div className="relative mb-2">
        
      {formList && formList.map((field, index) => (
        <div key={index} className='flex w-full mb-1'>
          <Input type="hidden" propertyName="STATUS" defaultValue={uf_isNull(field.AD_DYNAMIC_DETAIL_SEQ) ? "I":"U"} />
          <Input type="hidden" propertyName="AD_OPEN_PROCESS_DETAIL_SEQ" defaultValue={field.AD_DYNAMIC_DETAIL_SEQ} />
          <div className='w-24 flex items-center mr-1'>
            <Input type="text" propertyName="ITEM_NM" value={field.ITEM_NM} onChange={(e) => func_inputChange(index, e)} className="w-24" />
          </div>
          <div className="w-100 flex flex-1 relative shadow-sm">
            <Input type="text" propertyName="ITEM_CONTENTS" value={field.ITEM_CONTENTS} onChange={(e) => func_inputChange(index, e)} className="w-100" />
          </div>
          <div className="ml-1">
            <svg className="w-3 h-6 text-gray-800 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
                onClick={() => func_execDel(field.ITEM_ID, field.AD_DYNAMIC_DETAIL_SEQ)}
              />
            </svg>
          </div>
        </div>                  
      ))}  
      </div>    
    </>
  )
}

export default DynamicDetails;