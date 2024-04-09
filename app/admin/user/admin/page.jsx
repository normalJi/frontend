'use client';

import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { uf_formatChange, uf_makeParams, uf_isNull, uf_mandatoryFields, uf_numberFormat } from "@/components/common/util/Util";
import Axios from "@/components/common/api/Axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Table from "@/components/Tables/Table";

import AdminDetailModal from "@/components/Modal/AdminDetailModal";

import Button from "@/components/Button/Button";

const AdminMember = () => {
	const searchParams = useSearchParams();
	const router = useRouter(); 

  const [ list, setList ] = useState([]);
	
	// 리스트 조회
  const fetchListDataAxios = async() => {        
    let inputs = search.getElementsByTagName('input');
    let params = uf_makeParams(inputs);   
    try {
      const response = await Axios.post("/api/v1/user/adm/list", params);      
			const { data } = response.data;
			
      setList(data);							

    } catch(error) {      
      return false;
    }
  }

  useEffect(() => {
    fetchListDataAxios();
  }, [])  

  const columnData = [            
    { text: "아이디", value: 'USER_ID', width: '20%', align: 'left', rowPopup: true },
    { text: "이름", value: 'USER_NAME', width: '20%', align: 'left' },
    { text: "승인", value: 'APPROVAL_YN_NM', width: '20%', align: 'center' },    
    { text: "사용", value: 'USE_YN_NM', width: '20%', align: 'center' },
    { text: "비번초기화", value: '', width: '20%', align:'center', btn:'초기화', btnKey: 'PASS_RESET'  },
    { text: "", value: 'AD_USER_INFO_SEQ', width: '100px', align:'center', hidden: true },    
    { text: "승인", value: 'APPROVAL_YN', width: '20%', align: 'center', hidden: true },    
    { text: "사용", value: 'USE_YN', width: '20%', align: 'center', hidden: true },
  ] 
  
  const columns = useMemo(() => columnData, []);
  const data = useMemo(() => list, [list]);  

  const [ selection, setSelection ] = useState([]);
  const [ details, setDetails ] = useState({});
  useEffect(() => {    
    if( selection.length > 0 ) {
      for (const select of selection) {
        if( select.DIVISION === 'BUTTON' ) {
          if( select.BTN_KEY === 'PASS_RESET' ) {
            func_passReset(select);
          }
        } else if( select.DIVISION === 'P' ) {
          setDetails(select);
          funcBtnClick();
          setNewModal(false);
        }
      }
    }
  }, [selection])

  /**
 * 비밀번호 초기화
 */
  const func_passReset = async(obj) => {    
    const params = {};     
    params["AD_USER_INFO_SEQ"] = obj.AD_USER_INFO_SEQ;
    try {
      if( confirm(`비밀번호를 초기화 하시겠습니까?\r\n초기화 비밀번호는 아이디와 동일합니다.`) ) {
        const response = await Axios.post("/api/v1/user/adm/setPassReset", params);      
        
        
        alert("비밀번호가 초기화 되었습니다.\r\n초기화 비밀번호는 아이디와 동일합니다.");
      }

    } catch(error) {      
      return false;
    }
  }


  // 모달 버튼 클릭 유무를 저장할 state
  const [ adminDetailModal, setAdminDetailModal ] = useState(false);
  const [ newModal, setNewModal ] = useState(false);
	// 버튼 클릭시 (모달 or 페이지 이동) 유무를 설정하는 state 함수
  const funcBtnClick = (strDiv) => {     
    if( strDiv === 'A' ) {
      setDetails({});
    }
    setAdminDetailModal(!adminDetailModal);    
    
  }  
  
  // 팝업 저장 후 영역 리프레쉬
  const funcParent = function() {
    fetchListDataAxios();
  }  

  return (
		<>					
      <Breadcrumb pageName="관리자 관리" />
      
      <div id="search">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black"></h2>
          <div className="flex gap-2">
            <div>         
              <input
                type="text"
                name="SEARCH_TEXT"
                placeholder="검색할 아이디 및 이름을 입력하세요."
                className="w-64 border-[1.5px] border-stroke bg-transparent py-2 px-5 font-size font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />            
            </div>
            <div>
              <Button label="검색" className="bg-primary" onClick={fetchListDataAxios} />
              {/* <span className="inline-flex items-center justify-center rounded-xl bg-primary btn-size px-5 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer"
                 >검색</span> */}
              <Button label="등록" className="ml-2 bg-primary" onClick={()=> {funcBtnClick('A')}}/>
            </div>
            {/* <div>
              <span className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer"
                onClick={funcAdd}
              >매장등록</span>
            </div> */}
          </div>        
        </div>
        
      </div>
      {/* z-20 md:h-65 mb-5 flex flex-col h-screen */}
      <div>
        <div className="relative z-20 md:h-[37rem] flex flex-col h-screen">   
          
          <Table headers={columns} items={data} selectCheck={true} itemKey={'AD_USER_INFO_SEQ'} updateSelection={setSelection} />          
        </div>
      </div>			
      {adminDetailModal && <AdminDetailModal data={details} clickModal={()=> funcBtnClick('U')} funcParent={funcParent} />}
    </>
  );
};

export default AdminMember;

