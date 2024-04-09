'use client'
import React, { useRef, useEffect, useState, useMemo } from "react";
import { uf_convertArrToObj, uf_formatChange, uf_makeParams, uf_isNull, uf_mandatoryFields, uf_numberFormat } from "@/components/common/util/Util";
import Axios from "@/components/common/api/Axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Table from "@/components/Tables/Table";
import Button from "@/components/Button/Button";

const AuthMenuMapping = () => {

  const [ list, setList ] = useState([]);


  const fetchDataAxios = async() => {    
    let params = {};

    // 검색조건
    // let inputs = search.getElementsByTagName('input');    
    // params = uf_makeParams(inputs);
    
    // params['PAGE_NO'] = 1;
    
    try {
      const response = await Axios.post("/api/v1/system/authority/getAuthorityList", params);            
      let { data } = response;
      setList(data);
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
    { text: "권한명", value: 'AUTHORITY_NAME', width: '50px', align: 'center', rowSelect: true },
    { text: "사용여부", value: 'USE_YN', width: '90px', align: 'center', rowSelect: true },
    { text: "", value: 'SYS_AUTHORITY_SEQ', hidden: true}
  ] 

  const columns = useMemo(() => columnData, []);
  const data = useMemo(() => list, [list]);  
  
  const [ selectionAuth, setSelectionAuth ] = useState([]);
  const [ selectionMenu, setSelectionMenu ] = useState([]);
  
  const [ selectRow, setSelectRow ] = useState({});
  const [ detail, setDetail ] = useState({});
  useEffect(() => {    
    if( selectionAuth.length > 0 ) {
      for (const selectAuth of selectionAuth) {
        
          
          setSelectRow(selectAuth);
          fetchTreeDataAxios(selectAuth);
          funcDetails(selectAuth)
        
      }
    }
  }, [selectionAuth])

  const funcDetails = async function(obj) {
    let params = {};
    params['SYS_AUTHORITY_SEQ'] = obj.SYS_AUTHORITY_SEQ;
    const response = await Axios.post("/api/v1/system/authority/getAuthorityList", params);            
    let { data } = response;
    console.log("data : ", data);
    setDetail(data);
  }

  // 메뉴
  const [ treeList, setTreeList ] = useState([]);

  // 컬럼
  const columnData2 = [        
    { text: "메뉴명", value: 'MENU_NM', width: '300px', treeMain: true },
    { text: "메뉴코드", value: 'SYS_MENU_SEQ', width: '400px', align: 'left', hidden: true },    
    { text: "상위코드", value: 'PRT_MENU_SEQ', width: '100px', align: 'center', hidden: true },
    { text: "일련번호", value: 'SYS_AUTHORITY_SEQ', hidden: true },   // tree type에서는 depth 필수
    { text: "메뉴레벨", value: 'MENU_LEVEL', hidden: true },   // tree type에서는 depth 필수
  ] 
  
  const columns2 = useMemo(() => columnData2, []);
  const data2 = useMemo(() => treeList, [treeList]); 

  const fetchTreeDataAxios = async(obj) => {
    let params = {};
    if( !uf_isNull(obj) ) {
      if( obj.hasOwnProperty("SYS_AUTHORITY_SEQ") ) {
        params['SYS_AUTHORITY_SEQ'] = obj.SYS_AUTHORITY_SEQ;
      }
    }

    // 검색조건
    // let inputs = search.getElementsByTagName('input');
    // params = uf_makeParams(inputs);
    
    try {
      const response = await Axios.post("/api/v1/system/menu/getUseYMenuList", params);
      console.log("response : ", response.data);
      const { data } = response;      
      setTreeList(data);
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  useEffect(() => {
    fetchTreeDataAxios();
  }, []);


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

  return (
    <>
      <Breadcrumb pageName="권한메뉴매핑관리" />
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-1">
        <h2 className="text-title-md2 font-semibold text-black"></h2>
        <div className="flex gap-2">                    
          <Button label="저장" onClick={funcSave} className="bg-primary"  />       
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">        
        <div className="relative z-20 md:h-[37rem] flex flex-col gap-4 col-span-5 h-screen">
          <Table headers={columns} items={data} selectCheck={false} itemKey={'SYS_AUTHORITY_SEQ'} updateSelection={setSelectionAuth} />          
        </div>

        <div className="flex flex-col gap-4 col-span-7">               
          <div className="rounded-sm ">
            <Table type={'tree'} headers={columns2} items={data2} selectCheck={true} itemKey={'SYS_MENU_SEQ'} updateSelection={setSelectionMenu} />
          </div>
        </div>
      </div> 
    </>
  )
}

export default AuthMenuMapping;