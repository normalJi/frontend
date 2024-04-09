'use client';
import { useEffect, useState, useMemo } from 'react'
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import { uf_makeParams, uf_numberFormat, uf_numRepl } from '../common/util/Util';
import Axios from "@/components/common/api/Axios";
import InputOne from '@/components/Inputs/InputOne';
import InputArea from '@/components/Inputs/InputArea';

const LeaseModal = (props) => {  
  const [ data, setData ] = useState(props.data[0]);
  const [ seq, setSeq ] = useState(data.AD_STORE_INFO_SEQ);      

  const [ deposit, setDeposit ] = useState(0);
  const [ premium, setPremium ] = useState(0);
  const [ monthRent, setMonthRent ] = useState(0);
  const [ maintCost, setMaintCost ] = useState(0);
  const [ actualAreaM, setActualAreaM ] = useState(0);
  const [ actualAreaP, setActualAreaP ] = useState(0);


  // 전달받은 state 함수
  const { clickModal } = props;  

  // 데이터 조회
  const fetchDataAxios = async function() {
    let params = {};    
    params['AD_STORE_INFO_SEQ'] = seq;
    
    try {      
      let response = await Axios.post("/api/v1/store/user/details", params);
      
      const { DEPOSIT, PREMIUM, MONTH_RENT, MAINT_COST, ACTUAL_AREA_M, ACTUAL_AREA_P } = response.data.data;

      setDeposit(uf_numberFormat(`${DEPOSIT}`, true, true, true));
      setPremium(uf_numberFormat(`${PREMIUM}`, true, true, true));
      setMonthRent(uf_numberFormat(`${MONTH_RENT}`, true, true, true));
      setMaintCost(uf_numberFormat(`${MAINT_COST}`, true, true, true));
      setActualAreaM(ACTUAL_AREA_M);
      setActualAreaP(ACTUAL_AREA_P);
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }
  
  useEffect(() => {
    fetchDataAxios();
  },[])

  // 투자정보 합계
  const totalSum = useMemo(()=>{
    let hap = Number(uf_numberFormat(`${deposit}`,true, false, false)) 
              + Number(uf_numberFormat(`${premium}`,true, false, false)) 
              + Number(uf_numberFormat(`${monthRent}`,true, false, false)) 
              + Number(uf_numberFormat(`${maintCost}`,true, false, false));			
    return uf_numberFormat(`${hap}`,true, true, true);
  },[deposit, premium, monthRent, maintCost]);

  // 저장
  const fetchSaveAxios = async() => {
    let inputs = leaseDetailDiv.getElementsByTagName('input');
    let params = uf_makeParams(inputs);
    let sumCost = uf_numRepl(deposit, 'NUM') + uf_numRepl(premium, 'NUM') + uf_numRepl(monthRent, 'NUM') + uf_numRepl(maintCost, 'NUM');
    params['AD_STORE_INFO_SEQ'] = seq;
    params['STORE_SUM_COST'] = totalSum;
    params['STATUS'] = 'U';  
    
    console.log("params : ",params);

    try {
      if( confirm("저장 하시겠습니까?") ) {
        await Axios.post("/api/v1/store/lease/save", params);
        alert('저장 되었습니다.');
        props.funcParent();
        clickModal();
      }
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  // // 숫자만 입력 가능
  const funcNumFormat = function(e){    
    const num = uf_numberFormat(e.target.value, true, true, true);
    switch (e.target.name) {      
      case 'DEPOSIT':
        setDeposit(num);
        break;
      case 'PREMIUM':        
        setPremium(num);
        break;
      case 'MONTH_RENT':        
        setMonthRent(num);
        break;
      case 'MAINT_COST':        
        setMaintCost(num);
        break;
      default:
        break;
    }
  }
  


  // 실면적 평 or 면적
	const func_calculator = function(e) {
		let name = e.target.name;
		// 제곱미터
		if( name === 'ACTUAL_AREA_M' ) {
			setActualAreaP((Number(e.target.value) * 0.3025).toFixed(2));
			setActualAreaM(e.target.value);
		} else if( name === 'ACTUAL_AREA_P' ) {
			setActualAreaM((Number(e.target.value) * 3.3057).toFixed(2));
			setActualAreaP(e.target.value);			
		}
	} 

  return (
    <>
      <SearchModalBox>
        <SearchModalContent onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 w-100">
            <div className="flex flex-col gap-9 w-100">              
              <div className="rounded-sm border border-stroke bg-white shadow-default">
                <div className="flex flex-1 items-center justify-between border-b border-stroke py-1 px-6.5">
                  <div>
                    <div className="flex w-full mt-2">
                      <div className="flex items-center mb-2 ml-4 mr-6">
                        <h3 className="font-bold text-black place-items-center">임차 조건</h3>
                      </div>                               
                    </div>                        
                  </div>
                  <div className="flex h-6 items-center justify-center rounded-full">              
                    <span className="font-bold cursor-pointer" onClick={clickModal}>X
                  </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-6.5" id="leaseDetailDiv">
                  <InputOne label='권리금' propertyName='PREMIUM' value={premium} onChange={funcNumFormat} className='w-45 border-[1px] border-stroke bg-transparent py-2 pr-9 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-right font-size' />
                  <InputOne label='보증금' propertyName='DEPOSIT' value={deposit} onChange={funcNumFormat} className='w-45 border-[1px] border-stroke bg-transparent py-2 pr-9 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-right font-size' />
                  <InputOne label='임차료' propertyName='MONTH_RENT' value={monthRent} onChange={funcNumFormat} className='w-45 border-[1px] border-stroke bg-transparent py-2 pr-9 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-right font-size' />
                  <InputOne label='관리비' propertyName='MAINT_COST' value={maintCost} onChange={funcNumFormat} className='w-45 border-[1px] border-stroke bg-transparent py-2 pr-9 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-right font-size' />
                  <InputArea label='실면적' propertyName='ACTUAL_AREA_M' value={actualAreaM} onChange={func_calculator} propertyName2='ACTUAL_AREA_P' value2={actualAreaP} className="border-[1px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size" />                                    
                </div>
                <div className="border-t border-stroke py-4 px-6.5 grid place-items-center w-full">
                  <div className="flex gap-2 place-items-center">                        
                    <div>
                      <span className="rounded-xl inline-flex items-center justify-center bg-primary px-5 py-3 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer"
                        onClick={clickModal}>닫기</span>
                    </div>
                    <div>
                      <span className="rounded-xl inline-flex items-center justify-center bg-primary px-5 py-3 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer"
                        onClick={fetchSaveAxios}>저장</span>
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

export default LeaseModal;

