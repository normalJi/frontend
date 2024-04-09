'use client';
import { useEffect, useState, useRef } from 'react'
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import { uf_makeParams, uf_mandatoryFields, uf_onlyNumber, uf_numberFormat, uf_formatChange, uf_isNull } from '../common/util/Util';
import Axios from "@/components/common/api/Axios";

import InputOne from '@/components/Inputs/InputOne';
import InputDate from '@/components/Inputs/InputDate';
import SelectCommCode from '@/components/Inputs/SelectCommCode';
import Button from '@/components/Button/Button';

const AdminDetailModal = (props) => {
  console.log("props : ", props.data);
  const { data } = props;
  // 전달받은 state 함수
  const { clickModal } = props;
  const [ adUserInfoSeq, setAdUserInfoSeq ] = useState(data.AD_USER_INFO_SEQ);
  const [ approvalYn, setApprovalYn ] = useState(data.APPROVAL_YN);
  const [ useYn, setUseYn ] = useState(data.USE_YN);

  const handleSelect = (e) => {		
		if( e.target.name === 'APPROVAL_YN' ) {
			setApprovalYn(e.target.value);
		} else if( e.target.name === 'USE_YN' ) {
			setUseYn(e.target.value);
		}
  };

  const func_save = async function() {
    let inputs = adminInfoDiv.getElementsByTagName('*');
    let params = uf_makeParams(inputs);    

        // 필수 항목
		const fieldList = [ 'USER_ID', 'USER_NAME' ];
	
		if( !uf_mandatoryFields(params, fieldList) ) {
			alert('필수 입력항목을 확인해 주세요.');
			return;
		}
    
    if( !uf_isNull(adUserInfoSeq) ) {
      params['AD_USER_INFO_SEQ'] = adUserInfoSeq;
      params['STATUS'] = 'U';
    } else {
      params['STATUS'] = 'I';
    }
    

    console.log(params);

    try {
      if( confirm("저장 하시겠습니까?") ) {
        await Axios.post("/api/v1/user/adm/save", params);            
        alert('저장 되었습니다.');
        props.funcParent();
        clickModal();
      }
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }


  return (      
    <>      
      <SearchModalBox>
        <SearchModalContent onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 w-100">
          <div className="flex flex-col gap-9 w-100">
            {/* <!-- Input Fields --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default">
              
              
              <div className="flex flex-1 items-center justify-between border-b border-stroke py-1 px-6.5">
                <div> 
                  <div className="flex w-full mt-1">
                    <div className="flex items-center mb-1 ml-1 mr-6">
                      <h3 className="font-bold text-black place-items-center">관리자 정보</h3>
                    </div>                               
                  </div>                        
                </div>
                <div className="flex h-6 items-center justify-center rounded-full">              
                  <span className="font-bold cursor-pointer" onClick={clickModal}>X
                  </span>
                </div>
              </div>
              
              
              <div className="flex flex-col gap-2 p-6.5" id="adminInfoDiv">
                <InputOne className="px-1" label="아이디" propertyName="USER_ID" inputGb="str" defaultValue={data.USER_ID} required />
                <InputOne className="px-1" label="이름" propertyName="USER_NAME" inputGb="str" defaultValue={data.USER_NAME} required />

                <SelectCommCode codeName="USE_YN" className="w-full" label="승인여부" propertyName="APPROVAL_YN" selectValue={approvalYn} onChange={handleSelect} />
                <SelectCommCode codeName="USE_YN" className="w-full" label="사용여부" propertyName="USE_YN" selectValue={useYn} onChange={handleSelect} />
              </div>
              <div className="border-t border-stroke py-4 px-6.5 grid place-items-center w-full">
                <div className="flex gap-2 place-items-center">                        
                  <div>
                    <Button label="닫기" className="bg-primary" onClick={clickModal} />                    
                  </div>
                  <div>
                    <Button label="저장" className="bg-primary" onClick={func_save} />
                  </div>
                </div>        
              </div>
            </div>
          </div>
        </div>
        </SearchModalContent>
      </SearchModalBox>      
      
    </>
  )
}

export default AdminDetailModal;
