'use client';

import { useMemo, useState } from "react";
import SelectCommonCode from "@/components/SelectBoxs/SelectCommonCode";
import OpenProcessMemoModal from "@/components/Modal/OpenProcessMemoModal";

const OpenProcessDetail = (props) => {

  const { data } = props;
  let detailList = data;  

  // 모달 버튼 클릭 유무를 저장할 state
  const [ openProcessMemoModal, setOpenProcessMemoModal ] = useState(false);

  const [ row, setRow ] = useState({}); 
  // 모달 띄우는 함수
  const funcMemoPopup = (obj) => {   
    setRow(obj);
    setOpenProcessMemoModal(!openProcessMemoModal);
  }  

  // 상위 화면에 보내기
  const funcParent = function(obj) {
    
    props.getFormData(obj);
  } 

  // select box 변경 시
  const uf_change = (index, e) => {
    const { value, name } = e.target;
    detailList.map((item) => {
      if(item.ITEM_ID === index) {
        item.PROGRESS_COMP = value;
      }
    });
    detailList = [...detailList];
    funcParent(detailList);  // 상위에 값 전달
  }

  // textarea 변경 시
  const func_getDataList = (x) => {    
    detailList.map((item) => {
      if(item.ITEM_ID === x.ITEM_ID) {
        item.ITEM_CONTENTS = x.ITEM_CONTENTS
      }
    });
    //setDetailList(detailList);    
    funcParent(detailList);  // 상위에 값 전달
  }  

  return (
    <>      
      <div className="relative mb-2">
      {/* // <div className='flex w-full mt-1 mb-1'> */}
      {detailList && detailList.map((item, index) => (        
        <div key={index} className="relative mb-2">
          <div className='flex w-full mt-2 items-center'>
            <div className='w-26 flex'>
              <label className="ml-3 mr-3 text-black font-size">{item.ITEM_TITLE}</label>
            </div>
            <div className='w-[23.7em] flex relative shadow-sm'>
              <span className="w-full border-[1px] border-stroke bg-transparent py-2 pl-1 pr-7 font-size mr-1 h-[2.8em] truncate hover:text-clip">{item.ITEM_CONTENTS}</span>
              <div className="absolute inset-y-0 right-0 flex items-center text-xs mr-2">
                <span onClick={() =>{ funcMemoPopup(item) }}>
                  <svg className="h-5 w-5 text-bodydark2"  viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  
                    <path stroke="none" d="M0 0h24v24H0z"/>  
                    <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  
                    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  
                    <line x1="16" y1="5" x2="19" y2="8" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="w-30 flex">
              <SelectCommonCode codeName="PROGRESS_ADMIN" propertyName="PROGRESS_COMP" selectValue={item.PROGRESS_COMP} onChange={(e) => uf_change(item.ITEM_ID, e)} className="w-30" />
            </div>
          </div> 
        </div>            
      ))}  
      {/* // </div> */}
      </div>      
      {openProcessMemoModal && <OpenProcessMemoModal data={row} clickModal={()=> funcMemoPopup()} funcParent={funcParent} func_getDataList={func_getDataList} />}
    </>
  )
}

export default OpenProcessDetail;