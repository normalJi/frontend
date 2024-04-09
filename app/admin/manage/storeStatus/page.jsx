"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import Table from "@/components/Tables/Table";
import Axios from "@/components/common/api/Axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from 'react';
import { uf_makeParams, uf_nullToStr, uf_convertArrToObj } from "@/components/common/util/Util";

import AccountInfoModal from "@/components/Modal/AccountInfoModal";
import LeaseModal from "@/components/Modal/LeaseModal";
import AccountLinkModal from "@/components/Modal/AccountLinkModal";
const Status = () => {
  const router = useRouter();  

  const [ list, setList ] = useState([]);

  const [ franchiseGb, setFranchiseGb ] = useState('A');
  const [ operStatus, setOperStatus ] = useState('');

  const fetchDataAxios = async() => {
    let params = {};

    // 검색조건
    let inputs = search.getElementsByTagName('input');
    params = uf_makeParams(inputs);
    
    try {
      const response = await Axios.post("/api/v1/store/list", params);            
      let result = response.data.data;
      setList(result);
      
      let searchParams = JSON.parse(response.config.data);

      setFranchiseGb(uf_nullToStr(searchParams.FRANCHISE_GB));
      setOperStatus(uf_nullToStr(searchParams.OPER_STATUS));


    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  useEffect(() => {
    fetchDataAxios();

  }, [franchiseGb, operStatus])  

  // 컬럼
  const columnData = [        
    { text: "매장시작일", value: 'OPEN_DT', width: '120px', align: 'center', format: 'date' },
    { text: "매장명", value: 'STORE_NM', width: '200px', align: 'left' },
    { text: "", value: '', width: '60px', align: 'left', btn: '상세→', btnKey: 'PAGE' },
    { text: "매장관리자 정보", value: 'BOSS_INFO', width: '150px', align: 'center' },
    // { text: "폰번호", value: 'BOSS_HP', width: '130px', align: 'center', format: 'tel' },
    { text: "계좌정보", value: 'ACCOUNT', width: '100px', align: 'center', btn:'확인', btnKey: 'ACCOUNT' },
    { text: "임차조건", value: 'LEASE', width: '100px', align:'center', btn:'확인', btnKey: 'LEASE'  },
    { text: "매장위치", value: 'STORE_ADDR', width: '400px', align: 'left' },    
    { text: "계정연동", value: 'ACC_LINK', width: '100px', align: 'center', btn:'확인', btnKey: 'ACC_LINK' },
    { text: "사업장번호", value: 'NO_BIZ', width: '150px', align: 'center', format: 'nobiz' },
    { text: "일련번호", value: 'AD_STORE_INFO_SEQ', align: 'center', hidden: true },
  ] 
  
  const columns = useMemo(() => columnData, []);
  const data = useMemo(() => list, [list]);  

  const [ selection, setSelection ] = useState([]);

  const [ select, setSelect ] = useState({});
  useEffect(() => {    
    if( selection.length > 0 ) {
      for (const select of selection) {
        if( select.DIVISION === 'DT' ) {
          funcDetails(select);
        } else if( select.DIVISION === 'BUTTON' ) {          
          setSelect(select);
          funcBtnClick( select.BTN_KEY , select);
        }
      }
    }
  }, [selection])
  
  const funcAdd = function() {
    router.push( `/admin/manage/store/administering`, {shallow: true} );
  }


  // 등록 화면 및 상세화면
  const funcDetails = function(data) {
    router.push( `/admin/manage/store/administering?seq=${data.AD_STORE_INFO_SEQ}`, {shallow: true} );
  }


  // 모달 버튼 클릭 유무를 저장할 state
  const [ accountShowModal, setAccountShowModal ] = useState(false);  // 계좌정보
  const [ leaseShowModal, setLeaseShowModal ] = useState(false);      // 임차조건 
  const [ accountLinkModal, setAccountLinkModal ] = useState(false);  // 계정연동

	// 버튼 클릭시 (모달 or 페이지 이동) 유무를 설정하는 state 함수
  const funcBtnClick = (strGb, obj) => { 
    let gubun = strGb;
    if( gubun === 'PAGE' ) {
      router.push( `/admin/manage/store/administering?seq=${obj.AD_STORE_INFO_SEQ}`, {shallow: true} );
    } else if( gubun === 'ACCOUNT' ){
      setAccountShowModal(!accountShowModal);    
    } else if( gubun === 'LEASE' ){
      setLeaseShowModal(!leaseShowModal);    
    } else if( gubun === 'ACC_LINK' ) {
      setAccountLinkModal(!accountLinkModal);
    }
  }  
  
  // 팝업 저장 후 영역 리프레쉬
  const funcParent = function() {
    fetchDataAxios();
  }


  // 검색 radio 버튼 관련
  const funcChangeRadio1 = (e) => {
    setFranchiseGb(e.target.value);
  };
  
  const funcChangeRadio2 = (e) => {
    setOperStatus(e.target.value);
  };

  // 삭제
  const funcDel = async function() {
    const obj = uf_convertArrToObj(selection, 'AD_STORE_INFO_SEQ');
    const params = {};    

    params["list"] = obj;
    params['STATUS'] = 'D';

    if( obj.length <= 0 ) {
      alert("삭제할 항목을 선택해 주세요.");
      return;
    }
    
    console.log("params: ", params.list);

    try {      
      if( confirm("삭제 하시겠습니까?") ) {
        await Axios.post("/api/v1/store/save", params);
        alert("삭제 되었습니다.");
        fetchDataAxios();
      }
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  return (
    <>
      <Breadcrumb pageName="매장현황" />
      
      <div id="search">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black"></h2>
          <div className="flex gap-2">
            <div>            
              <input
                type="text"
                name="STORE_NM"
                placeholder="검색할 상호명 입력"
                className="w-64 border-[1.5px] border-stroke bg-transparent py-2 px-5 font-size font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />            
            </div>
            <div>
              <span className="inline-flex items-center justify-center rounded-xl bg-primary btn-size px-5 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer"
                 onClick={() => fetchDataAxios()}>검색</span>
            </div>
            {/* <div>
              <span className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer"
                onClick={funcAdd}
              >매장등록</span>
            </div> */}
          </div>        
        </div>

        



        <div className="flex flex-col flex-wrap gap-3 sm:gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex  min-w-22.5">
            <div className="flex items-center mb-4">
              <input id="FRANCHISE_GB_1" type="radio" value="A" name="FRANCHISE_GB" onChange={funcChangeRadio1}                
                checked={franchiseGb === '' ? true : franchiseGb === 'A' ? true : false}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="FRANCHISE_GB_1" className="mr-2 ms-2 text-sm font-medium text-black-2 dark:text-gray-300">가맹점</label>
            </div>
            <div className="flex items-center mb-4 mr-7">
              <input id="FRANCHISE_GB_2" type="radio" value="B" name="FRANCHISE_GB"               
                checked={franchiseGb === 'B' ? true : false}
                onChange={funcChangeRadio1} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="FRANCHISE_GB_2" className="mr-2 ms-2 text-sm font-medium text-black-2 dark:text-gray-300">직영점</label>
            </div>
          
            <div className="flex w-115">
              <div className="flex items-center mb-4">
                <p className="mr-2 text-black-2 dark:text-gray-300">상태:</p>
              </div>
              <div className="flex items-center mb-4">
                <input id="OPER_STATUS_1" type="radio" value="" name="OPER_STATUS" onChange={funcChangeRadio2}                   
                  checked={operStatus === '' ? true : false}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="OPER_STATUS_1" className="mr-2 ms-2 text-sm font-medium text-black-2 dark:text-gray-300">전체</label>
              </div>
              
              <div className="flex items-center mb-4">
                <input id="OPER_STATUS_2" type="radio" value="A" name="OPER_STATUS" onChange={funcChangeRadio2} 
                  checked={operStatus === 'A' ? true : false}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="OPER_STATUS_2" className="mr-2 ms-2 text-sm font-medium text-black-2 dark:text-gray-300">신규</label>
              </div>

              <div className="flex items-center mb-4">
                <input id="OPER_STATUS_3" type="radio" value="B" name="OPER_STATUS" onChange={funcChangeRadio2} 
                  checked={operStatus === 'B' ? true : false}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="OPER_STATUS_3" className="mr-2 ms-2 text-sm font-medium text-black-2 dark:text-gray-300">운영중</label>
              </div>

              {/* <div className="flex items-center mb-4">
                <input id="OPER_STATUS_4" type="radio" value="C" name="OPER_STATUS" onChange={funcChangeRadio2} 
                  checked={operStatus === 'C' ? true : false}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="OPER_STATUS_4" className="mr-2 ms-2 text-sm font-medium text-black-2 dark:text-gray-300">매출관리필요</label>
              </div> */}
              <div className="flex items-center mb-4">
                <input id="OPER_STATUS_5" type="radio" value="D" name="OPER_STATUS" onChange={funcChangeRadio2} 
                  checked={operStatus === 'D' ? true : false}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="OPER_STATUS_5" className="mr-2 ms-2 text-sm font-medium text-black-2 dark:text-gray-300">폐업</label>
              </div>
            </div>            
          </div>          
          <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">          
            <div className="flex gap-2">
              <div>
                <span className="inline-flex items-center justify-center rounded-xl bg-primary btn-size px-5 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer"
                  onClick={funcAdd}
                >매장등록</span>
              </div>
              <div>
                <span className="inline-flex items-center justify-center rounded-xl bg-danger btn-size px-5 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer"
                  onClick={funcDel}
                >삭제</span>
              </div>
            </div>        
          </div>
        </div>
        
      </div>
      {/* z-20 md:h-65 mb-5 flex flex-col h-screen */}
      <div>
        <div className="relative z-20 md:h-[37rem] flex flex-col h-screen">          
          <Table headers={columns} items={data} selectCheck={true} itemKey={'AD_STORE_INFO_SEQ'} updateSelection={setSelection} />          
        </div>
      </div>
      {accountShowModal && <AccountInfoModal data={selection} clickModal={()=> funcBtnClick('ACCOUNT')} funcParent={funcParent} />}
      {leaseShowModal && <LeaseModal data={selection} clickModal={()=> funcBtnClick('LEASE')} funcParent={funcParent} />}
      {accountLinkModal && <AccountLinkModal data={select} clickModal={()=> funcBtnClick('ACC_LINK')} funcParent={funcParent} />}
    </>
    
  );
};

export default Status;
