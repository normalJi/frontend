'use client';
import { useEffect, useState, useRef, useMemo } from 'react'
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import { uf_makeParams, uf_mandatoryFields, uf_onlyNumber, uf_numberFormat, uf_formatChange, uf_isNull } from '../common/util/Util';
import Axios from "@/components/common/api/Axios";

import InputOne from '@/components/Inputs/InputOne';
import SelectCommCode from '@/components/Inputs/SelectCommCode';
import Button from '@/components/Button/Button';

const MenuRegModal = (props) => {
  
  const { data } = props;

  // 전달받은 state 함수
  const { clickModal } = props;
  const [ sysMenuSeq, setSysMenuSeq ] = useState(data.SYS_MENU_SEQ);
  const [ prtMenuSeq, setPrtMenuSeq ] = useState(data.PRT_MENU_SEQ);
  const [ useYn, setUseYn ] = useState('');
  const [ detail, setDetail ] = useState({});

  const title = useMemo(() => {
    let nm = '';
    if( data.MODAL_DIVISION === 'NEW_MENU' ) {      
      setDetail('');
      setUseYn('');
      nm = '1depth 추가';
    } else {      
      if( data.BTN_KEY === 'REG' ) {
        setDetail('');
        setUseYn('');
        nm = `[${data.MENU_NM}] 하위 메뉴 추가`;  
      } else {
        setDetail(data);
        setUseYn(data.USE_YN);
        nm = `[${data.MENU_NM}] 메뉴 수정`;
      }

    }
    return nm;
  }, [data]);  

  const handleSelect = (e) => {		
		if( e.target.name === 'USE_YN' ) {
			setUseYn(e.target.value);
		}
  };

  const func_save = async function() {
    let inputs = menuModalDiv.getElementsByTagName('*');
    let params = uf_makeParams(inputs);    
    
    // 필수 항목
		const fieldList = [ 'MENU_NM', 'GROUP_NM', 'MENU_URL' ];
	
		if( !uf_mandatoryFields(params, fieldList) ) {
			alert('필수 입력항목을 확인해 주세요.');
			return;
		}
    if( data.MODAL_DIVISION === 'NEW_MENU' ) {
      params['STATUS'] = 'I';
    } else {
      params['SYS_MENU_SEQ'] = sysMenuSeq;
      params['PRT_MENU_SEQ'] = prtMenuSeq;
      if( data.BTN_KEY === 'MOD' ) {
        params['STATUS'] = 'U';
      } else {
        params['STATUS'] = 'U_I';
      }
    }
    

    console.log(params);

    try {
      if( confirm("저장 하시겠습니까?") ) {
        await Axios.post("/api/v1/system/menu/setMenu", params);            
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
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 w-125">
          <div className="flex flex-col gap-9 w-100">
            {/* <!-- Input Fields --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default">
              
              
              <div className="flex flex-1 items-center justify-between border-b border-stroke py-1 px-6.5">
                <div> 
                  <div className="flex w-full mt-1">
                    <div className="flex items-center mb-1 mr-6">
                      <h3 className="font-bold text-black place-items-center">{title}</h3>
                    </div>                               
                  </div>                        
                </div>
                <div className="flex h-6 items-center justify-center rounded-full">              
                  <span className="font-bold cursor-pointer" onClick={clickModal}>X
                  </span>
                </div>
              </div>
              
              
              <div className="flex flex-col gap-2 p-6.5" id="menuModalDiv">
                <InputOne className="w-full px-1" label="메뉴명" propertyName="MENU_NM" inputGb="str" defaultValue={detail.MENU_NM} required />
                <InputOne className="w-full px-1" label="그룹명" propertyName="GROUP_NM" inputGb="str" defaultValue={detail.GROUP_NM} required />
                <InputOne className="w-full px-1" label="메뉴URL" propertyName="MENU_URL" inputGb="str" defaultValue={detail.MENU_URL} required />

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

export default MenuRegModal;
