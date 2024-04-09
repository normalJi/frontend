'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Axios from "@/components/common/api/Axios";
import Table from "@/components/Tables/Table";
import { uf_makeParams, uf_formatChange, uf_isNull } from '@/components/common/util/Util';
import Input from '@/components/Inputs/Input';
import SelectBox from '@/components/SelectBoxs/SelectBox';
import SelectCommonCode from '@/components/SelectBoxs/SelectCommonCode';

import FileOnlySearchList from '@/components/File/FileOnlySearchList';
import OpenProcessDetail from '@/components/Manage/Store/OpenReady//OpenProcessDetail';

const OpenProcess = (props) => {
  const [ seq, setSeq ] = useState(props.seq);    // AD_STORE_INFO_SEQ 일련번호
  const [ list, setList ] = useState([]);  
  const [ selection, setSelection ] = useState([]); 
  const [ adOpenProcessSeq, setAdOpenProcessSeq ] = useState(0);

  // 데이터 조회
  const fetchDataAxios = async() => {
    let params = {};
    // 검색조건
    let inputs = search.getElementsByTagName('*');
    params = uf_makeParams(inputs);
    params['AD_STORE_INFO_SEQ'] = seq;
    
    try {
      const response = await Axios.post("/api/v1/open/process/list", params);
      let result = response.data.data;
      setList(result.list);
      funcDetails(result.list[0]);
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  useEffect(() => {
    fetchDataAxios();
  }, [])    

  // 컬럼
  const columnData = [        
    { text: "순서", value: 'NO_RNUM', width: '80px', align: 'center'},
    { text: "개설명칭", value: 'CATE_NM', width: '300px', align: 'left', rowDetail: true},
    { text: "상태", value: 'JOB_GB_NM', width: '80px', align: 'center'},
    { text: "진행상태", value: 'PROGRESS_ADMIN_NM', width: '120px', align: 'center'},
    { text: "", value: 'AD_STORE_INFO_SEQ', align: 'center', hidden: true },    
    { text: "", value: 'AD_OPEN_PROCESS_SEQ', align: 'center', hidden: true },    
    { text: "", value: 'AD_OPEN_PROCESS_CATEGORY_SEQ', align: 'center', hidden: true },    
  ]   

  const columns = useMemo(() => columnData, []);
  const data = useMemo(() => list, [list]);    

  // 상세 데이터 적용 Start
  const [ inputs, setInputs ] = useState({
    AD_OPEN_PROCESS_SEQ: adOpenProcessSeq,    
    JOB_GB: 'N',
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

  const initDetail = [
      {AD_OPEN_PROCESS_DETAIL: '', ITEM_ID: "0", ITEM_TITLE: '추진사항1', ITEM_CONTENTS: '', PROGRESS_COMP: 'A'}
    , {AD_OPEN_PROCESS_DETAIL: '', ITEM_ID: "1", ITEM_TITLE: '추진사항2', ITEM_CONTENTS: '', PROGRESS_COMP: 'A'}
    , {AD_OPEN_PROCESS_DETAIL: '', ITEM_ID: "2", ITEM_TITLE: '추진사항3', ITEM_CONTENTS: '', PROGRESS_COMP: 'A'}
    , {AD_OPEN_PROCESS_DETAIL: '', ITEM_ID: "3", ITEM_TITLE: '추진사항4', ITEM_CONTENTS: '', PROGRESS_COMP: 'A'}
  ];

  // 추친사항 내용 초기값
  const [ detailList, setDetailList ] = useState([]);

  // 동적 상세 component에서 넘긴 데이터 받기
  const getFormData  = (x) => {  
    setDetailList(x);    
  };

  // 저장
  const funcSave = async function() {    
    const input = inputs;

    if( input.START_DT > input.END_DT ) {
      alert("시작일이 종료일 보다 미래 일 수 없습니다.");
      return;
    }

    let params = {"main": input, "detailList": detailList};
    //console.log("params : ", params);
    try {
      if( confirm('저장 하시겠습니까?') ) {
        await Axios.post("/api/v1/open/process/save", params);
        
        alert("저장 되었습니다.");
        fetchDataAxios();
      }
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  const [ selectRow, setSelectRow ] = useState({});
  // 테이블에서 선택한 행의 object
  useEffect(() => {    
    if( selection.length > 0 ) {
      for (const select of selection) {
        if( select.DIVISION === 'DT' ) {
          setAdOpenProcessSeq(select.AD_OPEN_PROCESS_SEQ);
          funcDetails(select);
          setSelectRow(select);
          uf_reset();
          
        }
      }
    }
  }, [selection]) 

  const [ fileList, setFileList ] = useState([]);

  // 상세 조회
  const funcDetails = async function(obj) {
    const params = obj;
    
    try {
      const response = await Axios.post("/api/v1/open/process/Details", params);
      const { data } = response.data;      
      
      setInputs(data.data);
      if( (data.detail).length > 0 ) {
        setDetailList(data.detail);
      } else {        
        setDetailList(initDetail);
      }
      setFileList(data.fileList);
      
      
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  const detailRow = useMemo(() => [...detailList], [detailList]);
  


  return (
    <>
      <section className="text-gray-600 body-font relative">
        <div className="container py-1 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="lg:w-1/2 md:w-1/2 border border-strokedark bg-gray-300 rounded-sm overflow-hidden sm:mr-4 flex justify-start relative">

            <div className='p-2'>
              <div id="search">
                <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center justify-end">
                  <h4 className="font-size font-semibold text-black"></h4>
                  <div className="flex gap-2">
                    <div>
                      <input
                        type="text"
                        name="CATE_NM"
                        placeholder="검색할 개설항목을 입력하세요."
                        className="w-64 border border-stroke bg-transparent py-2 px-3 font-size font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                      />
                    </div>
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-primary btn-size px-5 font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                        onClick={fetchDataAxios}  >검색</span>
                    </div>                    
                  </div>        
                </div>
              </div>
              <Table headers={columns} items={data} itemKey={['AD_OPEN_PROCESS_SEQ', 'AD_OPEN_PROCESS_CATEGORY_SEQ']} updateSelection={setSelection} />
            </div>
          </div>
          
          <div className="lg:w-1/2 md:w-1/2 border border-strokedark bg-white flex flex-col rounded-sm md:ml-auto w-full mt-8 md:mt-0 p-2">
            <div>
              <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center justify-end">
                <h4 className="font-size font-semibold text-black"></h4>
                <div className="flex gap-2">                  
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-primary btn-size px-5 font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                      onClick={funcSave}>등록</span>
                  </div>
                </div>        
              </div>
            </div>
            <div id="openReadySaveDiv">              
              <div className='border border-t-graydark'></div>            
              <div className="relative mb-2">
                <div className='flex w-full mt-2 items-center'>
                  <div className='w-26 flex'>
                    <label className="ml-3 mr-3 text-black font-size">유형</label>
                  </div>
                  <div className="relative shadow-sm">
                    <SelectCommonCode codeName="" propertyName="AD_OPEN_PROCESS_CATEGORY_SEQ" selectValue={inputs.AD_OPEN_PROCESS_CATEGORY_SEQ} onChange={uf_change} searchRut="OpenCate" className="w-80" disabled />
                    <SelectCommonCode codeName="JOB_GB" propertyName="JOB_GB" selectValue={inputs.JOB_GB} onChange={uf_change} className="w-30 ml-1" />
                  </div>
                </div> 
              </div>
              <div className='border-t-[1px] border-t-stroke'></div>
              <div className="relative mb-2">
                <div className='flex w-full mt-2 items-center'>
                  <div className='w-26 flex'>
                    <label className="ml-3 mr-3 text-black font-size">기간</label>
                  </div>
                  <div className="relative shadow-sm">
                    <Input type="date" propertyName="START_DT" onChange={uf_change} value={uf_formatChange('date', inputs.START_DT)} className="w-34" />
                    <Input type="date" propertyName="END_DT" onChange={uf_change} value={uf_formatChange('date', inputs.END_DT)} className="w-34 ml-3" />                    
                    <SelectBox propertyName="PERIOD_ETC" onChange={uf_change} value={inputs.PERIOD_ETC} array={[{NAME: '선택', VALUE: '' },{NAME: '협의후 결정', VALUE: '1' }]} className="w-39 ml-3" />                    
                  </div>
                </div> 
              </div>            
              <div className='border-t-[1px] border-t-stroke'></div>

              {/* <DynamicDetails formFields={dynamicList} getFormData={getFormData} seq={adOpenProcessSeq} division='OPEN_PROCESS'  /> */}
              <OpenProcessDetail data={detailList} getFormData={getFormData} />

              <div className="relative mb-2">
                <div className='flex w-full mt-2 items-center'>
                  <div className='w-26 flex'>
                    <label className="ml-3 mr-3 text-black font-size">내용</label>
                  </div>
                  <div className="relative shadow-sm">
                    <textarea name="CONTENTS" onChange={uf_change} value={inputs.CONTENTS} className="w-125 bg-white border border-stroke focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 font-size outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                  </div>
                </div> 
              </div>
              <div className='border-t-[1px] border-t-stroke'></div>
              <FileOnlySearchList fileList={fileList} label="계약서" />
              <div className='border-t-[1px] border-t-stroke'></div>            
              
              <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
            </div>
          </div>
        </div>
      </section>  
    </>

  )

  

}

export default OpenProcess;
