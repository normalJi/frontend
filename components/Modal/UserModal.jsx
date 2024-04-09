'use client';
import { useEffect, useState, useMemo } from 'react'
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import router from 'next/navigation'
import { uf_isNull } from '../common/util/Util';
import Axios from "@/components/common/api/Axios";
import Table from '@/components/Tables/Table';
import AccountModal from '@/components/Modal/AccountModal';
import Button from '@/components/Button/Button';

const UserModal = (props) => {
  let obj = props.data;
  
  const [ seq, setSeq ] = useState(!uf_isNull(obj) ? obj.SYS_AUTHORITY_SEQ : null);      
  const [ list, setList] = useState([]);

  // 전달받은 state 함수
  const { clickModal } = props;

  // 데이터 조회
  const fetchDataAxios = async() => {
    const params = {};    
    // 검색조건
    try {
      const response = await Axios.post("/api/v1/system/authority/getNonAuthUserList", params);
      const { data } = response;
      setList(data);
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
    { text: "사용자 ID", value: 'USER_ID', width: '120px', align: 'center' },
    { text: "사용자명", value: 'USER_NAME', width: '130px', align: 'left' },
    { text: "", value: 'SYS_AUTHORITY_USER_MAP_SEQ', width: '130px', align: 'left', hidden: true },
    { text: "", value: 'SYS_AUTHORITY_SEQ', width: '130px', align: 'left', hidden: true },
    { text: "", value: 'AD_USER_INFO_SEQ', width: '130px', align: 'left', hidden: true },    
  ] 
  
  const columns = useMemo(() => columnData, []);
  const data = useMemo(() => list, [list]);  

  const [ selection, setSelection ] = useState([]);
  const [ details, setDetails ] = useState([]);

  // 모달 버튼 클릭 유무를 저장할 state
  const [ showModal, setShowModal ] = useState(false);
	const [ newModal, setNewModal ] = useState(false);

  // 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
  const funcModal = () => {    
    setShowModal(!showModal);    
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
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-132.5">
            <div className="flex flex-col gap-2 w-132.5">
              <div className="rounded-sm border border-stroke bg-white shadow-default">
                <div className="flex flex-1 items-center justify-between border-b border-stroke py-1 px-6.5">
                  <div>
                    <div className="flex w-full mt-2">
                      <div className="flex items-center mb-2 mr-6">
                        <h3 className="font-bold text-black place-items-center">사용자 등록</h3>
                      </div>
                    </div>                        
                  </div>

                  <div className="flex h-6 items-center justify-center rounded-full">              
                    <span className="font-bold cursor-pointer" onClick={clickModal}>X
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-2 pr-1.5">
                  <h2 className="text-title-md2 font-semibold text-black dark:text-white"></h2>                  
                </div>

                <div className="flex flex-col gap-2 p-1.5">
                  <div className="relative z-20 md:h-65 flex flex-col  h-screen">
                    <Table headers={columns} items={data} itemKey={'SYS_AUTHORITY_USER_MAP_SEQ'} updateSelection={setSelection} selectCheck={true} />          
                  </div>
                </div>
                <div className="border-t border-stroke py-4 px-6.5 grid place-items-center w-full">
                  <div className="flex gap-2 place-items-center">
                    <div>
                      <Button label="선택" className="mr-1 bg-primary" onClick={funcModal} />
                      <Button label="닫기" className="bg-primary" onClick={clickModal} />
                      {/* <span className="rounded-xl inline-flex items-center justify-center bg-primary px-5 py-3 btn-size font-size font-small text-white hover:bg-opacity-90 cursor-pointer "
                        onClick={clickModal}>닫기</span> */}
                      
                      {/* <span className="inline-flex rounded-xl items-center justify-center bg-primary px-5 py-3 btn-size font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                        onClick={() => {funcModal(); funcNewModal();}}>선택</span> */}
                    
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

export default UserModal