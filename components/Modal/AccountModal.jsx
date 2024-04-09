'use client';
import { useEffect, useState, useRef, useMemo } from 'react'
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import { uf_makeParams, uf_onlyNumber, uf_numberFormat, uf_formatChange, uf_isNull } from '../common/util/Util';
import Axios from "@/components/common/api/Axios";

import Input from '@/components/Inputs/Input';
import InputOne from '@/components/Inputs/InputOne';
import InputDate from '@/components/Inputs/InputDate';
import SelectCommCode from '@/components/Inputs/SelectCommCode';
import Button from '@/components/Button/Button';
import TextArea from '@/components/Inputs/TextArea';
import FileUpload from '@/components/Modal/FileUpload';

import DynamicDetails from '@/components/store/DynamicDetails';

const AccountModal = (props) => {  
  const [ seq, setseq ] = useState(props.data.AD_STORE_INFO_SEQ);
  const [ accSeq, setAccSeq ] = useState(props.data.AD_ACCOUNT_INFO_SEQ);
  const [ accountHolder, setAccountHolder ] = useState('');  
  const [ detail, setDetail ] = useState({});

  const [ accountCd, setAccountCd ] = useState('');
	const [ bankCd, setBankCd ] = useState('');

//  const [fileList, setFileList] = useState(null);

  const [ formFields, setFormFields ] = useState([{ITEM_ID: 0, ITEM_NM: '', ITEM_CONTENTS: '', STATUS: 'I' }]);

  const storeFileRef = useRef(null);  // 첨부파일 ref
  
  
  // 전달받은 state 함수
  const { clickModal } = props;
  
  // 사용자 데이터 조회 ( 이름 조회 )
  const fetchUserInfoAxios = async() => {    
    const params = {};
    params["AD_STORE_INFO_SEQ"] = seq;    
    try {
      const response = await Axios.post("/api/v1/store/user/details", params);            
      setAccountHolder(response.data.data.BOSS_NM);
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  } 

  useEffect(() => {
    
    fetchUserInfoAxios();
  },[seq]) 
  
  

  // 데이터 리스트 조회
  const fetchDataAxios = async() => {

    const params = {};
    params["AD_ACCOUNT_INFO_SEQ"] = accSeq;
    params['AD_USE_SEQ'] = accSeq;
    //await storePictureRef.current?.save(AD_STORE_INFO_SEQ);
    try {
      if( !uf_isNull(accSeq) ) {
        const response = await Axios.post("/api/v1/account/details", params);     
        const { data } = response;    
        setDetail(data.details);
        setFormFields(data.list);

        setAccountCd(data.details.ACCOUNT_CD);
        setBankCd(data.details.BANK_CD);
      }
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  } 
  
  const dynamicList = useMemo(() => formFields , [formFields]);
  //console.log("dynamicList : ",dynamicList);
  useEffect(() => {
    fetchDataAxios();
  },[accSeq])    

  // 저장
  const funcSave = async function(){

    let inputs = accDetailDiv.getElementsByTagName('*');    
    let obj = uf_makeParams(inputs);
    delete obj.ITEM_NM;
    delete obj.ITEM_CONTENTS;

    let params = {"main": obj, "dynamicList": formFields};

    params["AD_STORE_INFO_SEQ"] = seq;
    
    if( !uf_isNull(accSeq) ) {
      params["AD_ACCOUNT_INFO_SEQ"] = accSeq;
      params['STATUS'] = 'U';
    } else {
      params['STATUS'] = 'I';
    }
    console.log(params);
    try {
      if( confirm("저장 하시겠습니까?") ) {
        const response = await Axios.post("/api/v1/account/save", params);            
        const {AD_ACCOUNT_INFO_SEQ} = response.data;
        
        // 첨부파일 저장
        await storeFileRef.current?.save(seq, AD_ACCOUNT_INFO_SEQ, 'ACCOUNT');
        alert('저장 되었습니다.');
        props.funcParent();
        clickModal();
      }
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  const handleSelect = (e) => {		
		if( e.target.name === 'ACCOUNT_CD' ) {
			setAccountCd(e.target.value);
		} else if( e.target.name === 'BANK_CD' ) {
			setBankCd(e.target.value);
		}
  };

  // 동적 상세 component에서 넘긴 데이터 받기
  const getFormData  = (x) => {
    // setFormFields(e);
    setFormFields(x);
    //console.log("x : ", x);
  };

  return (      
    <>      
      <SearchModalBox>
        <SearchModalContent onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 w-150">
            <div className="flex flex-col gap-9 w-150">              
              <div className="rounded-sm border border-stroke bg-white shadow-default">
                <div className="flex flex-1 items-center justify-between border-b border-stroke py-1 px-6.5">
                  <div>
                    <div className="flex w-full mt-2">
                      <div className="flex items-center mb-2 ml-4 mr-6">
                        <h3 className="font-bold text-black place-items-center">계좌 등록</h3>
                      </div>                               
                    </div>                        
                  </div>
                  <div className="flex h-6 items-center justify-center rounded-full">              
                    <span className="font-bold cursor-pointer" onClick={clickModal}>X
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-6.5" id="accDetailDiv">
                  <SelectCommCode codeName="ACCOUNT_CD" label="유형" propertyName="ACCOUNT_CD" selectValue={accountCd} onChange={handleSelect} className="w-100" />
                  <InputDate label="개설일자" propertyName="OPEN_DT" defaultValue={uf_formatChange('date', detail.OPEN_DT)} className="w-100 py-2 px-5" />
                  <SelectCommCode codeName="BANK_CD" label="은행" propertyName="BANK_CD" selectValue={bankCd} onChange={handleSelect} className="w-100" />                  
                  <InputOne label="예금주명" propertyName="ACCOUNT_HOLDER" disabled defaultValue={accountHolder} inputGb="str" className="w-100 py-2 px-5" />
                  <InputOne label="계좌번호" propertyName="ACCOUNT_NUM" defaultValue={detail.ACCOUNT_NUM} inputGb="str" className="w-100 py-2 px-5" placeholder="계좌번호를 입력하세요." />
                  <InputOne label="개설지점" propertyName="BRANCH_NM" defaultValue={detail.BRANCH_NM} inputGb="str" className="w-100 py-2 px-5" placeholder="개설지점을 입력하세요." />
                  
                                
                  <DynamicDetails formFields={dynamicList} getFormData={getFormData} seq={accSeq} division='ACCOUNT'  />
                  
                  <TextArea label="내용" propertyName="ACCOUNT_CONTENT" defaultValue={detail.ACCOUNT_CONTENT} className="w-100 h-32" ></TextArea>                  
                  
                  <div className='flex mt-2'>
                    <div className="w-29 flex items-center mb-2">
                      <label className="mr-3 text-black font-size">첨부파일</label>
                    </div>
                    <FileUpload  ref={storeFileRef} propertyName="file" className="" seq={seq} />                    
                  </div>

                </div>
                <div className="border-t border-stroke py-4 px-6.5 grid place-items-center w-full">
                  <div className="flex gap-2 place-items-center">                        
                    <div>
                      <Button label="닫기" onClick={clickModal} className="bg-primary" />
                    </div>
                    <div>
                      <Button label="저장" onClick={funcSave} className="bg-primary" />
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

export default AccountModal;