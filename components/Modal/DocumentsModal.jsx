'use client';
import { useEffect, useState, useRef, useMemo } from 'react'
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import { uf_formatChange, uf_isNull } from '../common/util/Util';
import Axios from "@/components/common/api/Axios";

import Input from '@/components/Inputs/Input';
import SelectCommonCode from '@/components/SelectBoxs/SelectCommonCode';

import SelectBox from '@/components/SelectBoxs/SelectBox';
import Button from '@/components/Button/Button';
import TextArea from '@/components/Inputs/TextArea';
import FileUpload from '@/components/Modal/FileUpload';

import DocmentsDetail from '@/components/Manage/Store/Docments/DocmentsDetail';
import DynamicDetails from '@/components/store/DynamicDetails';


const DocumentsModal = (props) => {
  
  const data = useMemo(() => props.data , [props.data]);  
  const flag = data.hasOwnProperty("STATUS") ? data.STATUS : "";
  const [ status, setStatus ] = useState(flag);
  const [ seq, setseq ] = useState(data.AD_STORE_INFO_SEQ); // 매장 일련번호
  const [ docGb, setDocGb ] = useState(data.DOC_GB);  // 서류 구분값
  const [ adDocumentsSeq , setAdDocumentsSeq ] = useState(data.AD_DOCUMENTS_SEQ );   // 점주 서류 일련번호  
  const [ adCategorySeq, setAdCategorySeq ] = useState(data.AD_CATEGORY_SEQ); // 카테고리 일련번호
  const [ formFields, setFormFields ] = useState([{ITEM_ID: 0, ITEM_NM: '', ITEM_CONTENTS: '', DYNAMIC_DIVISION: docGb, STATUS: 'I' }]);   // 동적 input

  const [ detail, setDetail ] = useState({});

  const [ subDetail, setSubDetail ] = useState([]);
  const [ fileDetail, setFileDetail ] = useState([]);   // 첨부파일 리스트
  const storeFileRef = useRef(null);  // 첨부파일 ref
  
  
  // 전달받은 state 함수
  const { clickModal } = props;
  
  // 사용자 데이터 조회 ( 이름 조회 )
  const fetchUserInfoAxios = async() => {    
    const params = {};
    params["AD_STORE_INFO_SEQ"] = seq;
    
    try {
      const response = await Axios.post("/api/v1/store/user/details", params);            
      //setAccountHolder(response.data.data.BOSS_NM);
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
    params["AD_STORE_INFO_SEQ"] = seq;
    params["AD_CATEGORY_SEQ"] = adCategorySeq;
    params["AD_DOCUMENTS_SEQ"] = adDocumentsSeq;        
    params['AD_USE_SEQ'] = adDocumentsSeq;
    params['DOC_GB'] = docGb;
    params['DYNAMIC_DIVISION'] = docGb;
    if( !uf_isNull(status) ) {
      params['STATUS'] = status;
    }

    try {      
      const response = await Axios.post("/api/v1/store/doc/detail", params);     
      const { data } = response;
      setInputs(data.detail);             // 입력값을 담음
      setDetail(data.detail);             // 상세의 메인
      setSubDetail(data.subDetail);       // 동적(1) 이긴 하나 테이블이 다름 (점주서류, 계약서류 2종류만 있음)
      console.log("subDetail , ", data.subDetail);
      setFormFields(data.dynamicDetail);  // 동적(2) 얘는 모든 입력 폼에 이딴게 들어가서 테이블을 하나로 쓰도록 해놨음 ( 기획을 왜 이렇게.... )
      setFileDetail(data.fileList);       // 첨부파일
      
      
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }  

  const dynamicList = useMemo(() => formFields , [formFields]);  
  useEffect(() => {
    fetchDataAxios();
  },[])    


  // 상세 데이터 적용 Start
  const [ inputs, setInputs ] = useState({
    AD_CATEGORY_SEQ: '',
    JOB_GB: '',
    START_DT: '',
    END_DT: '',
    PERIOD_ETC: '',
    CONTENTS: '',
  });  

  const uf_change = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    })
  }

  const uf_reset = () => {
    setInputs({
      START_DT: '',
      END_DT: '',
      PERIOD_ETC: '',
      CONTENTS: '',
    })
  }
  // 상세 데이터 적용 End


  // 저장
  const funcSave = async function(){

    //let inputs = accDetailDiv.getElementsByTagName('*');    
    const input = inputs;    
    //let obj = uf_makeParams(inputs);
    if( !uf_isNull(status) ) {
      input["STATUS"] = status;
    }
    
    let params = {"main": input, "subDetail": subDetail, "dynamicList": formFields};
    params["AD_DOCUMENTS_SEQ"] = adDocumentsSeq;    
    params["AD_STORE_INFO_SEQ"] = seq;
    
    try {
      if( confirm("저장 하시겠습니까?") ) {
        const response = await Axios.post("/api/v1/store/doc/save", params);
        
        const { data } = response;
        
        const docSeq = uf_isNull(adDocumentsSeq) ? data.AD_DOCUMENTS_SEQ : adDocumentsSeq;
        
        // 첨부파일 저장
        await storeFileRef.current?.save(seq, docSeq, docGb);
        alert('저장 되었습니다.');
        props.funcParent();
        clickModal();
      }
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }  

  // 동적(1) 상세 component에서 넘긴 데이터 받기
  const getCateData  = (x) => {      
    setSubDetail(x);  
  };


  // 동적(2) 상세 component에서 넘긴 데이터 받기
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
                      <div className="flex items-center mb-2 mr-6">
                        <h3 className="font-bold text-black place-items-center">
                          {detail.CATE_NM}
                        </h3>
                      </div>                               
                    </div>                        
                  </div>
                  <div className="flex h-6 items-center justify-center rounded-full">              
                    <span className="font-bold cursor-pointer" onClick={clickModal}>X
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-6.5" id="accDetailDiv">
                  <div className='flex'>
                    <div className='w-24 flex items-center'>
                      <label className="mr-3 text-black font-size">유형</label>
                    </div>
                    <div className='flex flex-1 items-center'>        
                      <SelectCommonCode codeName={docGb} propertyName="AD_CATEGORY_SEQ" selectValue={inputs.AD_CATEGORY_SEQ} onChange={uf_change} searchRut="Category" className="w-80" disabled />
                      <SelectCommonCode codeName="JOB_GB" propertyName="JOB_GB" selectValue={inputs.JOB_GB} onChange={uf_change} className="w-30 ml-1" />
                    </div>
                  </div>


                  <div className='flex'>
                    <div className='w-24 flex items-center'>
                      <label className="mr-3 text-black font-size">기간</label>
                    </div>
                    <div className='flex flex-1 items-center'>        
                      <Input type="date" propertyName="START_DT" onChange={uf_change} value={uf_formatChange('date', inputs.START_DT)} className="w-34" />
                      <Input type="date" propertyName="END_DT" onChange={uf_change} value={uf_formatChange('date', inputs.END_DT)} className="w-34 ml-3" />                    
                      <SelectBox propertyName="PERIOD_ETC" onChange={uf_change} value={inputs.PERIOD_ETC} array={[{NAME: '선택', VALUE: '' },{NAME: '협의후 결정', VALUE: '1' }]} className="w-39 ml-3" />                    
                    </div>
                  </div>
                  
                  <DocmentsDetail details={detail} subDetails={subDetail} getCateData={getCateData} />                  
                                  
                  <DynamicDetails formFields={dynamicList} getFormData={getFormData} seq={adDocumentsSeq} division={docGb}  />

                  <TextArea label="내용" propertyName="CONTENTS" onChange={uf_change} value={inputs.CONTENTS} className="w-100 h-32" ></TextArea>                  
                    
                  <div className='flex mt-2'>
                    <div className="w-29 flex items-center mb-2">
                      <label className="mr-3 text-black font-size">첨부파일</label>
                    </div>
                    <FileUpload  ref={storeFileRef} propertyName="file" className="" seq={seq} fileList={fileDetail} />
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

export default DocumentsModal;

