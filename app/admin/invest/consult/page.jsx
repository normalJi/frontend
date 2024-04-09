'use client';

import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { uf_formatChange, uf_makeParams, uf_isNull, uf_mandatoryFields, uf_numberFormat } from "@/components/common/util/Util";
import Axios from "@/components/common/api/Axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Table from "@/components/Tables/Table";
import cn from "@/components/common/util/ClassName";
import InvestConsultModal from "@/components/Modal/InvestConsultModal";

import SelectCommCode from "@/components/Inputs/SelectCommCode";

import Button from "@/components/Button/Button";


const InvestHistory = () => {
	const searchParams = useSearchParams();
	const router = useRouter(); 

  const [ list, setList ] = useState([]);
	
	// 리스트 조회
  const fetchListDataAxios = async() => {        
    const inputs = search.getElementsByTagName('*');
    const params = uf_makeParams(inputs);  
    console.log()

    params['PAGE_NO'] = 0;

    try {
      const response = await Axios.post("/api/v1/invest/consult/list", params);      
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
    { text: "No.", value: 'NO_RNUM', width: '5%', align: 'center' },
    { text: "희망 브랜드명", value: 'BRAND_NM', width: '20%', align: 'left', rowPopup: true },
    { text: "희망 지역", value: 'REGION', width: '25%', align: 'left', rowPopup: true },    
    { text: "이름", value: 'USER_NM', width: '10%', align: 'center' },
    { text: "연락처", value: 'NO_HP', width: '10%', align:'center', format: 'tel' },
    { text: "창업유무", value: 'STARTUP_TYPE', width: '10%', align:'center'  },
    { text: "창업비용", value: 'STARTUP_COST', width: '12%', align:'right', format: 'num' },
    { text: "투자예상수익", value: 'INVEST_EXPECT_COST', width: '12%', align:'right', format: 'num'  },
    { text: "결정유형", value: 'INVEST_TYPE_NM', width: '10%', align:'center'  },
    { text: "의견", value: 'REASON_YN', width: '10%', align:'center'  },
    { text: "", value: 'INVEST_CONSULT_SEQ', align:'center', hidden: true },    
    { text: "", value: 'SOGUL_USER_INFO_SEQ', align: 'center', hidden: true },  
    { text: "결정유형", value: 'INVEST_TYPE', align:'center', hidden: true  },
    { text: "의견", value: 'REASON', align:'center', hidden: true  },
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
        }
      }
    }
  }, [selection])

  


  // 모달 버튼 클릭 유무를 저장할 state
  const [ investConsultModal, setInvestConsultModal ] = useState(false);
	// 버튼 클릭시 (모달 or 페이지 이동) 유무를 설정하는 state 함수
  const funcBtnClick = (strDiv) => {    
    setInvestConsultModal(!investConsultModal);    
    
  }  
  
  // 팝업 저장 후 영역 리프레쉬
  const funcParent = function() {
    fetchListDataAxios();
  }  

  return (
		<>					
      <Breadcrumb pageName="창업투자" />
      
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black"></h2>
        <div className="flex gap-2">                    
          <Button label="검색" onClick={fetchListDataAxios} className="bg-primary"  />        
        </div>
      </div>
      
      <div id="search" className="flex flex-col sm:grid-cols-12">
        <div className="mt-2 mb-2">
          <div className="rounded-sm">            
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="w-full flex flex-col sm:col-span-3">
                <_InputSearch label="희망브랜드명" propertyName="SEARCH_BRAND_NM" className="w-30 bg-gray border border-stroke" className2="w-full" />
              </div>                    
              <div className="flex flex-col sm:col-span-3">	
                <_InputSearch label="희망지역" propertyName="SEARCH_REGION" className="w-30 bg-gray border border-stroke" className2="w-full" />
              </div>    
              <div className="flex flex-col sm:col-span-3">	
                <_InputSearch label="이름" propertyName="SEARCH_USER_NM" className="w-30 bg-gray border border-stroke" className2="w-full" />
              </div>
              <div className="flex flex-col sm:col-span-3">	
                <_InputSearch label="연락처" propertyName="SEARCH_NO_HP" className="w-30 bg-gray border border-stroke" className2="w-full" />
              </div>              
              
              <div className="w-full flex flex-col sm:col-span-3">
                <div className='flex'>
                  <div className='flex items-center pt-2 pb-2 w-30 bg-gray border border-stroke'>
                    <label className="mr-3 text-black font-size pl-2">창업유무</label>
                  </div>
                  <div className='flex flex-1 relative shadow-sm border border-stroke'>
                    <select name="SEARCH_STARTUP_TYPE" className='relative z-20 border-[1px] w-full border-stroke bg-transparent py-2 px-1 font-size outline-none transition focus:border-primary active:border-primary'>
                      <option value="">전체</option>
                      <option value="Y">Y</option>
                      <option value="N">N</option>
                    </select>
                  </div>
                </div>    
              </div>                    
              <div className="flex flex-col sm:col-span-3">	
                <SelectCommCode codeName="INVEST_TYPE" className="w-full" className2="w-30 bg-gray border border-stroke" label="결정유형" propertyName="SEARCH_INVEST_TYPE" searchGb="A" />
              </div>                  
              <div className="flex flex-col sm:col-span-6">	
                <div className='flex'>
                  <div className='flex items-center pt-2 pb-2 w-30 bg-gray border border-stroke'>
                    <label className="mr-3 text-black font-size pl-2">의견</label>
                  </div>
                  <div className='flex flex-1 relative shadow-sm border border-stroke'>
                    <select name="SEARCH_REASON" className='w-52 relative z-20 border-[1px]  border-stroke bg-transparent py-2 px-1 font-size outline-none transition focus:border-primary active:border-primary'>
                      <option value="">전체</option>
                      <option value="Y">등록</option>
                      <option value="N">미등록</option>
                    </select>
                  </div>
                </div>

              </div>    
            </div>         
            
          </div>
        </div>
      </div>
      {/* z-20 md:h-65 mb-5 flex flex-col h-screen */}
      <div>
        <div className="relative z-20 md:h-[37rem] flex flex-col h-screen">   
          
          <Table headers={columns} items={data} selectCheck={false} itemKey={'INVEST_CONSULT_SEQ'} updateSelection={setSelection} />          
        </div>
      </div>			
      {investConsultModal && <InvestConsultModal seq={details.INVEST_CONSULT_SEQ} clickModal={()=> funcBtnClick('U')} funcParent={funcParent} />}
    </>
  );
};

export default InvestHistory;

const _InputSearch = ({ label, propertyName, value, onChange, className, className2, ...inputProps }) => {
  return (
    <div className='flex w-full'>
			<div className={cn('flex items-center pt-2 pb-2', className)}>
				<label className="mr-3 text-black font-size pl-2">
					{label}					
				</label>
			</div>
			<div className="flex flex-1 relative shadow-sm">
				<input
					type="text"
					name={propertyName}					
					value={value}
					onChange={onChange}
          className={cn('border-[1px] pr-9 border-stroke bg-transparent py-2 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size pl-2', className2)}
					{...inputProps}
				/>				
			</div>
		</div>
  )
}