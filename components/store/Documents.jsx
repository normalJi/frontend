'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from 'react';
import Axios from "@/components/common/api/Axios";
import UserInfo from "@/components/Manage/userInfo";
import { uf_isNull } from "@/components/common/util/Util";
import Image from "next/image";

import DocumentsModal from "@/components/Modal/DocumentsModal";

const Documents = (props) => {  
  const searchParams = useSearchParams();
  const [seq, setSeq] = useState('');
  useEffect(() => {
    setSeq(searchParams.get('seq'));
  }, []);

  const router = useRouter();
  const [ doc, setDoc ] = useState([]);
  const [ itemDocList, setItemDocList ] = useState([]);
  const [ initData, setInitData ] = useState({});
  const [ user, setUser ] = useState({});
  const [ Selected, setSelected ] = useState('');

  // 모달 버튼 클릭 유무를 저장할 state
  const [ documentsModal, setDocumentsModal ] = useState(false);

  const [ docGb, setDocGb ] = useState(props.docGb);
  
  // 데이터 조회
  const fetchDataAxios = async () => {
    const params = {"AD_STORE_INFO_SEQ": seq, "DOC_GB": docGb};

    try {
      const response = await Axios.post("/api/v1/store/doc/list", params);     
      const { data } = response;      
      
      setDoc(data.main);
      const newArr = await funcNewArray( data.main, data.itemList );
      setItemDocList(newArr);

      setInitData(data.initData);

    } catch(error) {      
      return false;
    }
  } 

  const funcNewArray = async function(obj, obj2) {
    let arr = [];
    let arr2 = [];
  
    for( let i = 0; i < obj.length; i++ ) {
      arr = [];      
      for( let j = 0; j < obj2.length; j++ ) {        
        
        if( obj[i].AD_DOCUMENTS_SEQ === obj2[j].AD_DOCUMENTS_SEQ ) {
          arr[j] = obj2[j];
        }
      }
      arr2[obj[i].CATE_NM] = arr;
    }

    return arr2;
  }

  useEffect(() => {
    if(seq !== ''){
      fetchDataAxios();
    }
  }, [seq, docGb])

  // 유저정보 조회
  const fetchUserDataAxios = async () => {
    const params = {"AD_STORE_INFO_SEQ": searchParams.get('seq')};     

    try {
      const response = await Axios.post("/api/v1/store/user/details", params);      
      setUser(response.data.data);	
      setSelected(response.data.data.INDUSTRY_CD);
    } catch(error) {      
      return false;
    }
  }

  useEffect(() => {
    fetchUserDataAxios();
  }, [])  

  const [ row, setRow ] = useState({}); 
  // 모달 띄우는 함수
  const funcBtnClick = (obj) => {   
    setRow(obj);
    setDocumentsModal(!documentsModal);
  }  

  const funcBtnDel = async(obj) => {
    const params = obj;
    if( confirm("삭제 하시겠습니까?") ) {
      try {
        await Axios.post("/api/v1/store/doc/delete", params);
        
        alert("삭제 되었습니다.");
        fetchDataAxios();
      } catch(error) {      
        return false;
      }
    }
  }
  
  // 팝업 저장 후 영역 리프레쉬
  const funcParent = function() {
    fetchDataAxios();
  } 

  return (
    <>
      <UserInfo data={user} onSave={()=>{funcSave();}} />
      <div className="border border-stroke px-4 pb-4">        
        <div className="border-b border-gray-200 dark:border-gray-700 mb-2">
          <nav className="flex space-x-2" aria-label="Tabs" role="tablist">
            <span className={`hs-tab-active:font-semibold hs-tab-active:text-gray-600 bg-white py-4 px-1 text-gray-500 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer border-b-2`}>
              사업관련
            </span>
            <span className={`hs-tab-active:font-semibold hs-tab-active:text-gray-600 bg-white py-4 px-1 text-gray-500 text-sm text-center overflow-hidden hover:bg-gray-50 focus:z-10 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer`}>
              {/* 사업외 */}
            </span>          
          </nav>
        </div>
        <section className="text-gray-600 body-font">
          <div className="container py-1 mx-auto">
            <div className="flex flex-wrap -m-4">
            {
              doc && doc.map((item, index) => {
                const cateNm = item.CATE_NM;
                return(
                  <div key={index} className="p-4 md:w-1/2">
                    <div className="h-full border border-gray-200 border-opacity-60 rounded-lg overflow-hidden">                  
                      <div className="p-6">
                        <div className="flex items-center flex-wrap ">
                          <h2 className="tracking-widest title-font-size text-gray-400 mb-1">{item.CATE_NM}</h2>                  
                          <span className="text-gray-400 mr-3 inline-flex items-center md:ml-2 leading-none text-sm pr-3 py-1 border-l border-gray-200">
                            <span className={`ml-3 border border-opacity-60 p-1 rounded-lg ${item.JOB_GB !== 'C' ? "ing" : "done"}`}>
                              {item.JOB_GB === 'N' ? '할일' : item.JOB_GB === 'P' ? "진행" : "완료"}
                            </span>
                          </span>

                          <span className="text-gray-400 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none py-1">
                            <Image src={"/images/manage/edit.svg"} width="15" height="15" alt="" onClick={() =>{ funcBtnClick(item) }} className="pointer mr-4"/>
                            <Image src={"/images/manage/trash.svg"} width="15" height="15" alt=""onClick={() =>{funcBtnDel(item)}} className="pointer"/>                        
                          </span>
                        </div>
                        
                        <div className="flex items-center flex-wrap ">
                          <div className="mt-4">                            
                          {                            
                            itemDocList[cateNm].map((subItem, i) => {
                              return (
                                <div key={i}>
                                  <h3 className="text-gray-500 card-font-size mb-3">{subItem.ITEM_CONTENTS}</h3>
                                </div>
                              )
                            })
                          } 
                          {
                            itemDocList[cateNm].length <= 0 ? 
                            item.CATE_NM !== '직접입력' ? 
                            <div><h3 className="text-gray-500 card-font-size mb-3">등록된 내용이 없습니다.</h3></div> : 
                            uf_isNull(item.CONTENTS) ? 
                            <div><h3 className="text-gray-500 card-font-size mb-3">등록된 내용이 없습니다.</h3></div> : 
                            <div><h3 className="text-gray-500 card-font-size mb-3">{item.CONTENTS}</h3></div>
                            : "" 
                          }
                          </div>
                          <span className="text-gray-400 inline-flex items-cneter lg:ml-auto md:ml-0 ml-auto leading-none card-font-size">
                            {uf_isNull(item.DT_MOD) ? "" : `등록일 : ${item.DT_MOD}`}
                          </span>                    
                        </div>
                      </div>
                    </div>
                  </div> 
                )
              })}

              <div className="p-4 md:w-1/2 w-full">
                <div className="border border-gray-200 px-4 py-6 rounded-lg grid place-items-center ">
                  <span className="pointer" onClick={() => funcBtnClick(initData)}>
                    <svg className="h-20 w-20 text-meta-5"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </span>          
                </div>
              </div>       
            </div>
          </div>
        </section>
      </div>
	    {documentsModal && <DocumentsModal data={row} clickModal={()=> funcBtnClick()} funcParent={funcParent} />}
    </>
  );
};

export default Documents;
