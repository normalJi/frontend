'use client';
import { useEffect, useState, useMemo } from 'react'
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import router from 'next/navigation'
import { uf_makeParams, uf_mandatoryFields, uf_isNull } from '../common/util/Util';
import Axios from "@/components/common/api/Axios";

import InputOne from '@/components/Inputs/InputOne';
import SelectCommCode from '@/components/Inputs/SelectCommCode';
import Button from '@/components/Button/Button';
import Input from '../Inputs/Input';

const AuthorityModal = (props) => {
  
  const { data } = props;

  // 전달받은 state 함수
  const { clickModal } = props;
  const [ sysAuthoritySeq, setSysAuthoritySeq ] = useState(!uf_isNull(data) ? data[0].SYS_AUTHORITY_SEQ : null);

  const initData = { "AUTHORITY_NAME": "", "USE_YN": "Y", "DIVISION": "S" };

  const [ inputs, setInputs ] = useState(!uf_isNull(data) ? data[0] : initData);

  const func_change = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    })
  }

  const handleSelect = (e) => {		
		if( e.target.name === 'USE_YN' ) {
			setUseYn(e.target.value);
		}
  };

  const func_save = async function() {
    let inputs = authorityDiv.getElementsByTagName('*');
    let params = uf_makeParams(inputs);    

        // 필수 항목
		const fieldList = [ 'AUTHORITY_NAME' ];
	
		if( !uf_mandatoryFields(params, fieldList) ) {
			alert('필수 입력항목을 확인해 주세요.');
			return;
		}
    
    if( !uf_isNull(sysAuthoritySeq) ) {
      params['SYS_AUTHORITY_SEQ'] = sysAuthoritySeq;
      params['STATUS'] = 'U';
    } else {
      params['STATUS'] = 'I';
    }       

    try {
      if( confirm("저장 하시겠습니까?") ) {
        await Axios.post("/api/v1/system/authority/setAuthority", params);            
        alert('저장 되었습니다.');
        props.funcParent();
        clickModal();
      }
    } catch(error) {
      console.log("error : ", error);
      alert("프로그램 오류가 발생하였습니다. \r\n관리자에게 문의해 주세요.");
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
                      <h3 className="font-bold text-black place-items-center">권한 정보</h3>
                    </div>                               
                  </div>                        
                </div>
                <div className="flex h-6 items-center justify-center rounded-full">              
                  <span className="font-bold cursor-pointer" onClick={clickModal}>X
                  </span>
                </div>
              </div>
              
              
              <div className="flex flex-col gap-2 p-6.5" id="authorityDiv">                
                <InputOne className="px-1" label="권한명" propertyName="AUTHORITY_NAME" inputGb="str" value={inputs.AUTHORITY_NAME} onChange={func_change} required />
                <SelectCommCode codeName="USE_YN" className="w-full" label="사용여부" propertyName="USE_YN" selectValue={inputs.USE_YN} onChange={func_change} />
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

export default AuthorityModal