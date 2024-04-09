'use client';
import { useEffect, useState, useMemo } from 'react'
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import router from 'next/navigation'
import { uf_makeParams, uf_onlyNumber, uf_numberFormat } from '../common/util/Util';
import Axios from "@/components/common/api/Axios";
import Table from '@/components/Tables/Table';
import AccountModal from '@/components/Modal/AccountModal';

const AccountInfoModal = (props) => {
  let obj = props.data[0];  
  const [ seq, setSeq ] = useState(obj.AD_STORE_INFO_SEQ);      
  const [ list, setList] = useState();

  // 전달받은 state 함수
  const { clickModal } = props;

  useEffect(() => {
    
  }, []);    

  

  // 데이터 조회
  const fetchDataAxios = async() => {
    const params = {};
    params["AD_STORE_INFO_SEQ"] = seq;
    // 검색조건
    try {
      const response = await Axios.post("/api/v1/account/list", params);            
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
    { text: "유형", value: 'ACCOUNT_CD_NM', width: '120px', align: 'center' },
    { text: "은행명", value: 'BANK_CD_NM', width: '130px', align: 'left', rowPopup: true },
    { text: "계좌번호", value: 'ACCOUNT_NUM', width: '120px', align: 'center' },
    { text: "예금주명", value: 'ACCOUNT_HOLDER', width: '100px', align: 'center' },
    { text: "개설일자", value: 'OPEN_DT', width: '100px', align: 'center', format: 'date' },
    { text: "개설지점", value: 'BRANCH_NM', width: '100px', align:'left' },
    { text: "", value: '', width: '60px', align: 'center', btn: '삭제', btnKey: 'DEL' },
    { text: "", value: 'AD_STORE_INFO_SEQ', align: 'center', hidden: true },
    { text: "", value: 'AD_ACCOUNT_INFO_SEQ', align: 'center', hidden: true },
    { text: "", value: 'ACCOUNT_CD', align: 'center', hidden: true },
    { text: "", value: 'BANK_CD', align: 'center', hidden: true },
  ] 
  
  const columns = useMemo(() => columnData, []);
  const data = useMemo(() => list, [list]);  

  const [ selection, setSelection ] = useState([]);
  const [ details, setDetails ] = useState([]);

  useEffect(() => {    
    if( selection.length > 0 ) {
      for (const select of selection) {
        if( select.DIVISION === 'P' ) { 
          
          setDetails(select);          
          funcModal();
          setNewModal(false);
        } else if( select.DIVISION === 'BUTTON') {
          funcDel(select);
        }
      }
    }
  }, [selection])  

  // 모달 버튼 클릭 유무를 저장할 state
  const [ showModal, setShowModal ] = useState(false);
	const [ newModal, setNewModal ] = useState(false);
	// 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
  const funcModal = () => {    
    setShowModal(!showModal);    
  }

  // 삭제
  const funcDel = async function(obj) {
    const params = {};
    params["AD_ACCOUNT_INFO_SEQ"] = obj.AD_ACCOUNT_INFO_SEQ;
    params["AD_STORE_INFO_SEQ"] = seq;
    params["STATUS"] = 'D';
    // 검색조건
    try {
      if( confirm("삭제 하시겠습니까?") ) {
        await Axios.post("/api/v1/account/save", params);
        fetchDataAxios();
      }      
    } catch(error) {
      console.log("error : ", error); 
      return false;
    }

  }


  // 신규 등록 팝업 일때 데이터 초기화하여 input 초기화
  const funcNewModal = () => {    
    setNewModal(true);
    let storeSeq = {"AD_STORE_INFO_SEQ": seq};
    setDetails(storeSeq);
  } 

  // 팝업 저장 후 영역 리프레쉬
  const funcParent = function() {
    fetchDataAxios();
  }

  return (      
    <>      
      <SearchModalBox>
        <SearchModalContent onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 w-230">
            <div className="flex flex-col gap-9 w-230">
              <div className="rounded-sm border border-stroke bg-white shadow-default">
                <div className="flex flex-1 items-center justify-between border-b border-stroke py-1 px-6.5">
                  <div>
                    <div className="flex w-full mt-2">
                      <div className="flex items-center mb-2 ml-4 mr-6">
                        <h3 className="font-bold text-black place-items-center">계좌정보</h3>
                      </div>                               
                    </div>                        
                  </div>

                  <div className="flex h-6 items-center justify-center rounded-full">              
                    <span className="font-bold cursor-pointer" onClick={clickModal}>X
                    </span>
                  </div>
                </div>                
                
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-2 pr-1.5">
                  <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    
                  </h2>
                  <div className="flex gap-2">                    
                    <div>
                      <span className="inline-flex rounded-xl items-center justify-center bg-primary px-5 py-3 btn-size font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                        onClick={() => {funcModal(); funcNewModal();}}>계좌등록</span>
                    </div>
                  </div>        
                </div>


                <div className="flex flex-col gap-2 p-1.5">
                  <div className="relative z-20 md:h-65 flex flex-col  h-screen">          
                    <Table headers={columns} items={data} itemKey={'AD_STORE_INFO_SEQ'} updateSelection={setSelection} />          
                  </div>
                </div>
                <div className="border-t border-stroke py-4 px-6.5 grid place-items-center w-full">
                  <div className="flex gap-2 place-items-center">                        
                    <div>
                      <span className="rounded-xl inline-flex items-center justify-center bg-primary px-5 py-3 btn-size font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                        onClick={clickModal}>닫기</span>
                    </div>                    
                  </div>        
                </div>
              </div>
            </div>
          </div>
        </SearchModalContent>
      </SearchModalBox>
      {showModal && <AccountModal data={details} clickModal={funcModal} newModal={newModal} funcParent={funcParent} />}
      
    </>
  )
}

export default AccountInfoModal