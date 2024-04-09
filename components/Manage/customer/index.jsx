'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Axios from "@/components/common/api/Axios";
import Table from "@/components/Tables/Table";
import CustomerModal from "@/components/Modal/CutomerModal";
import { uf_convertArrToObj } from '@/components/common/util/Util';

const CustomerMng = (props) => {

  const [ list, setList ] = useState([]);
  
  const [ seq, setSeq ] = useState(props.seq);

  // 데이터 조회
  const fetchDataAxios = async() => {
    const params = {};
    params['AD_STORE_INFO_SEQ'] = seq;
    
    try {
      const response = await Axios.post("/api/v1/customer/list", params);
      setList(response.data.data);
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
    { text: "유형", value: 'SECTOR', width: '120px', align: 'center' },
    { text: "상호명", value: 'STORE_NM', width: '300px', align: 'left', rowPopup: true },
    { text: "대표번호", value: 'BOSS_HP', width: '120px', align: 'center', format: 'tel' },
    { text: "담당자명", value: 'MANAGER_NM', width: '130px', align: 'center' },
    { text: "담당자번호", value: 'MANAGER_HP', width: '120px', align: 'center', format: 'tel' },
    { text: "미수금", value: 'RECEIVABLE_COST', width: '120px', align:'center'  },
    { text: "미지급금", value: 'PAYABLE_COST', width: '120px', align: 'left' },    
    { text: "잔액", value: 'BALANCE_COST', width: '120px', align: 'center' },
    { text: "메모", value: 'MENO', align: 'left' },
    { text: "", value: 'AD_STORE_CUSTOMER_MNG_SEQ', align: 'center', hidden: true },
  ]   
  
  const columns = useMemo(() => columnData, []);
  const data = useMemo(() => list, [list]);  

  const [selection, setSelection] = useState([]);
  const [ details, setDetails ] = useState([]);
  useEffect(() => {
    if( selection.length > 0 ) {      
      for (const select of selection) {
        if( select.DIVISION === 'P' ) {
          setDetails(select);
          funcBtnClick();
          setNewModal(false);
        }        
      }
    }    
  }, [selection])  

  // 모달 버튼 클릭 유무를 저장할 state
  const [showModal, setShowModal] = useState(false);
  const [newModal, setNewModal] = useState(false);
	// 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
  const funcBtnClick = () => {    
    setShowModal(!showModal);    
  }

  // 신규 등록 팝업 일때 데이터 초기화하여 input 초기화
  const funcNewModal = () => {    
    setNewModal(true);
    setDetails('');
  }
  
  // 팝업 저장 후 영역 리프레쉬
  const funcParent = function() {
    fetchDataAxios();
  }

  // 선택된 항목 삭제
  const funcDelete = async function() {
    const obj = uf_convertArrToObj(selection, 'AD_STORE_CUSTOMER_MNG_SEQ');
    const params = {};    

    params["list"] = obj;
    params['STATUS'] = 'D';    

    try {
      if( confirm("삭제 하시겠습니까?") ) {
        const response = await Axios.post("/api/v1/customer/save", params);
        alert('삭제가 완료되었습니다.');
        fetchDataAxios();
      }
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }



  }

  return (
    <>
      <div className="rounded-sm border-stroke bg-white pt-6 pb-2.5 xl:pb-1 z-0" >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-xl font-semibold text-black ">거래처 관리</h4>
          <div className="flex gap-2">            
            <div>              
              <span className="btn-size inline-flex rounded-xl items-center justify-center bg-primary px-5 font-size font-small text-white hover:bg-opacity-90 cursor-pointer"                  
                 onClick={() => {funcBtnClick(); funcNewModal();}}>등록
              </span>
            </div>
            <div>
              <span className="btn-size inline-flex rounded-xl items-center justify-center bg-danger px-5 font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                onClick={funcDelete}>삭제
              </span>
            </div>
          </div>        
        </div>
        <div>
          <div className="z-20 md:h-65 mb-5 flex flex-col h-screen">
            <Table headers={columns} items={data} selectCheck={true} itemKey={'AD_STORE_CUSTOMER_MNG_SEQ'} updateSelection={setSelection} />
          </div>

        </div>
      </div>
      {showModal && <CustomerModal seq={seq} data={details} clickModal={funcBtnClick} newModal={newModal} funcParent={funcParent} />}

    </>
  );
};

export default CustomerMng;
