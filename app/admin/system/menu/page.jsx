'use client';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Axios from "@/components/common/api/Axios";
import { useState, useEffect, useMemo } from "react";
import Table from "@/components/Tables/Table";

//import { uf_makeHierarchy } from "@/components/common/util/Util";
import MenuRegModal from "@/components/Modal/MenuRegModal";
import Button from "@/components/Button/Button";
const Menu = () => {

  const [ list, setList ] = useState([]);

  const fetchDataAxios = async() => {
    let params = {};

    // 검색조건
    // let inputs = search.getElementsByTagName('input');
    // params = uf_makeParams(inputs);
    
    try {
      const response = await Axios.post("/api/v1/system/menu/getMenuList", params);
      console.log("response : ", response.data);
      const { data } = response;
      
      //setList(uf_makeHierarchy(data));
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
    { text: "메뉴명", value: 'MENU_NM', width: '330px', treeMain: true },
    { text: "그룹명", value: 'GROUP_NM', width: '100px', align: 'left' },
    { text: "메뉴URL", value: 'MENU_URL', width: '300px', align: 'left' },    
    { text: "사용여부", value: 'USE_YN', width: '100px', align: 'center' },
    { text: "시스템구분", value: 'SYSTEM_GB', width: '100px', align:'center' },
    { text: "등록", value: 'REG', width: '100px', align:'center', btn: '추가', possibleDepth: '1' , btnKey: 'REG'},
    { text: "수정", value: 'MOD', width: '100px', align:'center', btn: '수정', possibleDepth: '2', btnKey: 'MOD' },
    { text: "정렬순서", value: 'MENU_SORT', width: '150px', align: 'center', hidden: true },
    { text: "메뉴코드", value: 'SYS_MENU_SEQ', width: '400px', align: 'left', hidden: true },    
    { text: "상위코드", value: 'PRT_MENU_SEQ', width: '100px', align: 'center', hidden: true },
    { text: "메뉴레벨", value: 'MENU_LEVEL', hidden: true },   // tree type에서는 depth 필수
  ] 
  
  const columns = useMemo(() => columnData, []);
  const data = useMemo(() => list, [list]);  

  const [ selection, setSelection ] = useState([]);

  const [ select, setSelect ] = useState({});
  useEffect(() => {    
    if( selection.length > 0 ) {
      for (const select of selection) {
        if( select.DIVISION === 'BUTTON' ) {          

          setSelect(select);
          select['MODAL_DIVISION'] = 'MENU_U';
          funcBtnClick( select.BTN_KEY , select);
        }
      }
    }
  }, [selection])

  const [ menuRegModal, setMenuRegModal ] = useState(false);
  // 버튼 클릭시 (모달 or 페이지 이동) 유무를 설정하는 state 함수
  const funcBtnClick = (strGb, obj) => { 
    let gubun = strGb;
    select['MODAL_DIVISION'] = gubun;
    setMenuRegModal(!menuRegModal);
    
  }  

  // 팝업 저장 후 영역 리프레쉬
  const funcParent = function() {
    fetchDataAxios();
  }

  return (
    
    <>
      <Breadcrumb pageName="메뉴관리" />
      <div id="search">
        <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black"></h2>
          <div className="flex gap-2">            
            <div>              
              <Button label="등록" className="ml-2 bg-primary" onClick={()=> {funcBtnClick('NEW_MENU')}}/>
            </div>
            {/* <div>
              <span className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer"
                onClick={funcAdd}
              >매장등록</span>
            </div> */}
          </div>        
        </div>
        
      </div>
      <div>
        <div className="relative z-20 flex flex-col">
          <Table type={'tree'} headers={columns} items={data} selectCheck={false} itemKey={'SYS_MENU_SEQ'} updateSelection={setSelection} />          
        </div>
      </div>
      {menuRegModal && <MenuRegModal data={select} clickModal={()=> funcBtnClick('MENU_U')} funcParent={funcParent} />}
    </>
  )
}

export default Menu;