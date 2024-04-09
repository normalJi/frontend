'use client'
import React, { useRef, useEffect, useState, useMemo } from "react";
import { uf_convertArrToObj, uf_formatChange, uf_makeParams, uf_isNull, uf_mandatoryFields, uf_numberFormat } from "@/components/common/util/Util";
import Axios from "@/components/common/api/Axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Table from "@/components/Tables/Table";
import Button from "@/components/Button/Button";

import AuthorityModal from "@/components/Modal/AuthorityModal";
import UserModal from "@/components/Modal/UserModal";

const AuthMenuMapping = () => {

  const [ list, setList ] = useState([]);


  const fetchDataAxios = async() => {    
    let params = {};
    
    try {
      const response = await Axios.post("/api/v1/system/authority/getAuthorityList", params);            
      let { data } = response;
      setList(data);
      fetchUserDataAxios(data[0]);
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  useEffect(() => {
    fetchDataAxios();
  }, []);

  // 컬럼
  const columnData = [        
    { text: "권한명", value: 'AUTHORITY_NAME', width: '90px', align: 'center', rowSelect: true },
    { text: "사용여부", value: 'USE_YN', width: '50px', align: 'center' },
    { text: "", value: 'AUTH', width: '20px', align: 'center', btn:'수정', btnKey: 'AUTH' },
    { text: "", value: 'SYS_AUTHORITY_SEQ', hidden: true}
  ] 

  const columns = useMemo(() => columnData, []);
  const data = useMemo(() => list, [list]);  
  
  const [ selectionAuth, setSelectionAuth ] = useState([]);  
  const [ selectionUser, setSelectionUser ] = useState([]);
  
  const [ selectRow, setSelectRow ] = useState({});
  const [ detail, setDetail ] = useState({});

  useEffect(() => {    
    if( selectionAuth.length > 0 ) {
      for (const selectAuth of selectionAuth) {
        if( selectAuth.DIVISION === 'BUTTON' ) {
          if( selectAuth.BTN_KEY === 'AUTH' ) {
            setAuthorityModal(!authorityModal);
          }          
        } else {          
          setSelectRow(selectAuth);          
          fetchUserDataAxios(selectAuth);
          funcDetails(selectAuth)
        }
      }
    }
  }, [selectionAuth])

  const funcDetails = async function(obj) {
    let params = obj;
    params['SYS_AUTHORITY_SEQ'] = obj.SYS_AUTHORITY_SEQ;
    const response = await Axios.post("/api/v1/system/authority/getAuthorityList", params);            
    let { data } = response;
    setDetail(data);
  }

  // 삭제
  const func_authUserDel = async function() {
    
    const params = {};
    params["SYS_AUTHORITY_USER_MAP_SEQ"] = selectionUser;
    // 검색조건
    try {
      if( confirm("권한에서 삭제 하시겠습니까?") ) {
        await Axios.post("/api/v1/system/authority/delAuthUserMap", params);
        fetchDataAxios();
      }      
    } catch(error) {
      console.log("error : ", error); 
      return false;
    }

  }


  // 메뉴
  const [ treeList, setTreeList ] = useState([]);

  // 컬럼
  const columnData2 = [        
    { text: "사용자 ID", value: 'USER_ID', width: '300px', align: 'left' },
    { text: "사용자명", value: 'USER_NAME', width: '400px', align: 'center' },    
    { text: "", value: 'SYS_AUTHORITY_USER_MAP_SEQ', width: '100px', align: 'center', hidden: true },    
    { text: "", value: 'AD_USER_INFO_SEQ', width: '100px', align: 'center', hidden: true },
  ] 
  
  const columns2 = useMemo(() => columnData2, []);
  const data2 = useMemo(() => treeList, [treeList]); 

  // 권한 매핑된 사용자 조회
  const fetchUserDataAxios = async(obj) => {
    let params = {};
    if( !uf_isNull(obj) ) {
      if( obj.hasOwnProperty("SYS_AUTHORITY_SEQ") ) {
        params['SYS_AUTHORITY_SEQ'] = obj.SYS_AUTHORITY_SEQ;
      }
    }

    try {
      const response = await Axios.post("/api/v1/system/authority/getAuthUserList", params);      
      const { data } = response;      
      setTreeList(data);
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  const funcSave = async function() {

    let params = {};
    params["SYS_AUTHORITY_SEQ"] = selectRow.SYS_AUTHORITY_SEQ;
    params["CHK_MENU_LIST"] = uf_convertArrToObj(selectionMenu, "SYS_MENU_SEQ");
    console.log(params);

    try {
      if( confirm("저장 하시겠습니까?") ) {
        await Axios.post("/api/v1/system/authority/setAuthMenuMap", params);
        alert("저장 되었습니다.");
      }
      
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }


  // 모달 버튼 클릭 유무를 저장할 state
  const [ authorityModal, setAuthorityModal ] = useState(false);
  const [ userModal, setUserModal ] = useState(false);

	// 버튼 클릭시 (모달 or 페이지 이동) 유무를 설정하는 state 함수
  const funcBtnClick = (strGb, obj) => { 
    let gubun = strGb;
    if( gubun === 'AUTH' ){

      setSelectionAuth([]);      
      setAuthorityModal(!authorityModal);    
    } else if( gubun === 'USER' ){
      setUserModal(!userModal);        
    }
  }  
  
  // 팝업 저장 후 영역 리프레쉬
  const funcParent = function() {
    fetchDataAxios();
  }

  return (
    <>
      <Breadcrumb pageName="권한메뉴매핑관리" />
      
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
        <div className="flex flex-col gap-4 col-span-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-1">
            <h2 className="text-title-md2 font-semibold text-black"></h2>
            <div className="flex gap-2">                    
              <Button label="권한 등록" onClick={() => funcBtnClick("AUTH")} className="bg-primary"  />       
            </div>
          </div>
          <div className="relative z-20 md:h-[37rem] flex flex-col gap-4 col-span-5 h-screen">
            <Table headers={columns} items={data} selectCheck={false} itemKey={'SYS_AUTHORITY_SEQ'} updateSelection={setSelectionAuth} tdColor={true} />
          </div>
        </div>

        <div className="flex flex-col gap-4 col-span-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-1">
            <h2 className="text-title-md2 font-semibold text-black"></h2>
            <div className="flex gap-2">                    
              <Button label="사용자 등록" onClick={() => funcBtnClick("USER")} className="bg-primary"  />       
              <Button label="사용자 삭제" onClick={func_authUserDel} className="bg-danger"  />
            </div>
          </div>
          <div className="rounded-sm ">
            <Table headers={columns2} items={data2} selectCheck={true} itemKey={'SYS_AUTHORITY_USER_MAP_SEQ'} updateSelection={setSelectionUser}  />
          </div>
        </div>
      </div> 
      {authorityModal && <AuthorityModal data={selectionAuth} clickModal={()=> funcBtnClick('AUTH')} funcParent={funcParent} />}
      {userModal && <UserModal data={selectionAuth} clickModal={()=> funcBtnClick('USER')} funcParent={funcParent} />}
    </>
  )
}

export default AuthMenuMapping;