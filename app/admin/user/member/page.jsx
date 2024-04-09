"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect, useMemo } from "react";
import Axios from "@/components/common/api/Axios";
import Table from "@/components/Tables/Table";
import { uf_formatChange, uf_makeParams } from "@/components/common/util/Util";


import cn from "@/components/common/util/ClassName";
import Button from "@/components/Button/Button";

const MemberUser = () => {

  const [ list, setList ] = useState([]);


  const fetchDataAxios = async() => {    
    let params = {};

    // 검색조건
    let inputs = search.getElementsByTagName('input');    
    params = uf_makeParams(inputs);    
    params['PAGE_NO'] = 1;
    
    try {
      const response = await Axios.post("/api/v1/user/mem/list", params);            
      let { data } = response.data;
      setList(data);
      
      let searchParams = JSON.parse(response.config.data);

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
    { text: "No.", value: 'NO_RNUM', width: '50px', align: 'center', format: 'date' },
    { text: "사업자번호", value: 'NO_BIZ', width: '90px', align: 'center', format: 'nobiz', rowSelect: true },
    { text: "상호", value: 'NM_COMP', width: '200px', align: 'left' },
    { text: "이름", value: 'NM_USER', width: '100px', align: 'center' },
    { text: "일련번호", value: 'SOGUL_USER_INFO_SEQ', align: 'center', hidden: true },
    { text: 'SNS 일련번호', value: 'SOGUL_USER_SNS_SEQ', hidden: true },
    { text: 'SNS 가입 구분', value: 'CD_GUBUN', hidden: true },
    { text: 'SNS_ID', value: 'CD_TOKEN', hidden: true },
    { text: '', value: 'STATUS', hidden: true }
  ] 

  const columns = useMemo(() => columnData, []);
  const data = useMemo(() => list, [list]);  
  
  const [ selection, setSelection ] = useState([]);
  const [ selectRow, setSelectRow ] = useState({});
  const [ detail, setDetail ] = useState({});
  useEffect(() => {    
    if( selection.length > 0 ) {
      for (const select of selection) {
        if( select.DIVISION === 'S' ) {          
          setSelectRow(select);
          funcDetail(select);
        }        
      }
    }
  }, [selection])

  // 
  // useEffect(() => {
  //   funcDetail();
  // }, [selectRow]);

  const funcDetail = async function(obj) {
    let params = {};
    
    params["SOGUL_USER_COMP_INFO_SEQ"] = obj.SOGUL_USER_COMP_INFO_SEQ;
    // 검색조건
    
    
    try {
      const response = await Axios.post("/api/v1/user/mem/detail", params);            
      const { data } = response.data;      
      setDetail(data);
      
      //let searchParams = JSON.parse(response.config.data);

    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }


  
  return (    
    <>
      <Breadcrumb pageName="회원관리" />
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black"></h2>
        <div className="flex gap-2">                    
          <Button label="검색" onClick={fetchDataAxios} className="bg-primary"  />        
        </div>
      </div>
      
      <div id="search" className="flex flex-col sm:grid-cols-12">
        <div className="mb-2">
          <div className="rounded-sm">            
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="w-full flex flex-col sm:col-span-3">
                <_InputSearch label="사업자번호" propertyName="SEARCH_NO_BIZ" className="w-30 bg-gray border border-stroke" className2="w-full" />
              </div>                    
              <div className="flex flex-col sm:col-span-3">	
                <_InputSearch label="상호명" propertyName="SEARCH_NM_COMP" className="w-30 bg-gray border border-stroke" className2="w-full" />
              </div>    
              <div className="flex flex-col sm:col-span-3">	
                <_InputSearch label="이름" propertyName="SEARCH_NM_USER" className="w-30 bg-gray border border-stroke" className2="w-full" />
              </div>
              <div className="flex flex-col sm:col-span-3">	
                <_InputSearch label="사업장주소" propertyName="SEARCH_ADDR_ROAD" className="w-30 bg-gray border border-stroke" className2="w-full" />
              </div>    
            </div>         
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">        
        <div className="relative z-20 md:h-[37rem] flex flex-col gap-4 col-span-5 h-screen">
          <Table headers={columns} items={data} selectCheck={false} itemKey={'SOGUL_USER_INFO_SEQ'} updateSelection={setSelection} />          
        </div>
        <div className="flex flex-col gap-4 col-span-7">          
          <div className="rounded-sm ">
            <div className="w-24 py-1 border border-stroke bg-white">
              <h3 className="text-black text-center text-sm font-bold">기본정보</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="flex flex-col col-span-6">
                <_DetailView label="사업자번호" value={uf_formatChange('nobiz',detail.NO_BIZ)} />
              </div>
              
              <div className="flex flex-col col-span-6">	
                <_DetailView label="상호명" value={detail.NM_COMP} />
              </div>    
            </div>         
          </div>          

          <div className="rounded-sm">
            <div className="w-24 py-1 border border-stroke bg-white">
              <h3 className="text-black text-center text-sm font-bold">매장정보</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="flex flex-col col-span-12">
                <_DetailView label="사업장 주소" value={detail.ADDR_ROAD} />
              </div>
              
              <div className="flex flex-row col-span-12">
                <_DetailView label="개업일" value={uf_formatChange('date',detail.DT_OPEN)} />
                <_DetailView label="업태/업종" value={detail.NM_INDUSTRY_CONCAT} />
              </div>    
              <div className="flex flex-row col-span-12">
                <_DetailView label="건물층수" value={detail.BD_SIZE} />
                <_DetailView label="직원수" value={detail.QTY_EMP} />
              </div>    
            </div>         
          </div>

          <div className="rounded-sm ">
            <div className="w-24 py-1 border border-stroke bg-white">
              <h3 className="text-black text-center text-sm font-bold">매장비용</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12">              
              <div className="flex flex-row col-span-12">
                <_DetailView label="보증금" value={uf_formatChange('num',detail.AM_DEPO)} />
                <_DetailView label="월세" value={uf_formatChange('num',detail.AM_MON)} />
                <_DetailView label="관리비" value={uf_formatChange('num',detail.AM_MANAGE)} />
              </div>
            </div>         
          </div>          

          <div className="rounded-sm ">
            <div className="w-24 py-1 border border-stroke bg-white">
              <h3 className="text-black text-center text-sm font-bold">권리금</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12">              
              <div className="flex flex-row col-span-12">
                <_DetailView label="기지급권리금" value={uf_formatChange('num',detail.AM_ALERADY_ENTI)} />
                <_DetailView label="시설권리금" value={uf_formatChange('num',detail.AM_FACIL_ENTI)} />
                <_DetailView label="바닥권리금" value={uf_formatChange('num',detail.AM_FLOOR_ENTI)} />
              </div>
            </div>         
          </div>
        </div>
      </div>      
    </>
  );
};

export default MemberUser;



const _DetailView = ({ label, value, className }) => {
  return (    	
    <div className='flex flex-1 w-full '>
      <div className="w-24 flex items-center bg-gray border border-stroke pt-2 pb-2">
        <label className="mr-3 ml-2 text-black font-size">
          {label}
        </label>
      </div>
      <div className="flex flex-1 relative font-size border-stroke border pt-2 pb-2 items-center">
        <div className="text-right">
          <span className="ml-2 text-right">{value}</span>

        </div>
      </div>
    </div>
  )
}

const _InputSearch = ({ label, propertyName, value, onChange, className, className2, ...inputProps }) => {
  return (
    <div className='flex w-full mt-2'>
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