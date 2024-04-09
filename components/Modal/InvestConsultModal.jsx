'use client';
import { useEffect, useState, useRef } from 'react'
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import { uf_makeParams, uf_mandatoryFields, uf_onlyNumber, uf_numberFormat, uf_formatChange, uf_isNull } from '../common/util/Util';
import Axios from "@/components/common/api/Axios";

import InputOne from '@/components/Inputs/InputOne';
import SelectCommCode from '@/components/Inputs/SelectCommCode';
import Button from '@/components/Button/Button';
import TextArea from '@/components/Inputs/TextArea';

const InvestConsultModal = (props) => {
  
  const { seq } = props;
  
  // 전달받은 state 함수
  const { clickModal } = props;
  const [ investConsultSeq, setInvestConsultSeq ] = useState(seq);
  const [ investType, setInvestType ] = useState('');  

  const [ startupCost, setStartupCost ] = useState('');
  const [ investExpectCost, setInvestExpectCost ] = useState('');

  const [ details, setDetails ] = useState({});

  // 조회
  const funcListAxios = async function(){    
    const params = {};
    params['INVEST_CONSULT_SEQ'] = investConsultSeq;    
    
    try {      
      const response = await Axios.post("/api/v1/invest/consult/details", params);            
      const { data } = response.data;
      
      setDetails(data);

      if( !uf_isNull(data.STARTUP_COST) ) {
        setStartupCost(uf_numberFormat(data.STARTUP_COST, true, true, true));
      }
  
      if( !uf_isNull(data.INVEST_EXPECT_COST) ) {
        setInvestExpectCost(uf_numberFormat(data.INVEST_EXPECT_COST, true, true, true));
      }
      setInvestType(data.INVEST_TYPE);

    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  useEffect(() => {
    funcListAxios();
  }, [investConsultSeq]);

  // 저장
  const func_save = async function() {
    let inputs = adminInfoDiv.getElementsByTagName('*');
    let params = uf_makeParams(inputs);    
    params['INVEST_CONSULT_SEQ'] = investConsultSeq;
    params['STATUS'] = 'U';
    
    try {
      if( confirm("저장 하시겠습니까?") ) {
        await Axios.post("/api/v1/invest/consult/save", params);            
        alert('저장 되었습니다.');
        props.funcParent();
        clickModal();
      }
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  const handleSelect = (e) => {		
		if( e.target.name === 'INVEST_TYPE' ) {
			setInvestType(e.target.value);
		}
  };  



  // useEffect(() => {
  //   if( !uf_isNull(data.STARTUP_COST) ) {
  //     setStartupCost(uf_numberFormat(data.STARTUP_COST, true, true, true));
  //   }

  //   if( !uf_isNull(data.INVEST_EXPECT_COST) ) {
  //     setInvestExpectCost(uf_numberFormat(data.INVEST_EXPECT_COST, true, true, true));
  //   }
  
  // }, [startupCost, investExpectCost]);

  // 숫자만 입력 가능
	const funcNumFormat = function(e){    
		const num = uf_numberFormat(e.target.value, true, true, true);
		switch (e.target.name) {      
			case 'STARTUP_COST':
				setStartupCost(num);
				break;
      case 'INVEST_EXPECT_COST':
        setInvestExpectCost(num);
        break;
		}
	}

  return (      
    <>      
      <SearchModalBox>
        <SearchModalContent onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 w-100">
          <div className="flex flex-col gap-9 w-100">
            {/* <!-- Input Fields --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default">
              
              
              <div className="flex flex-1 items-center justify-between border-b border-stroke py-1 px-6.5">
                <div> 
                  <div className="flex w-full mt-1">
                    <div className="flex items-center mb-1 ml-1 mr-6">
                      <h3 className="font-bold text-black place-items-center">창업투자 수정</h3>
                    </div>                               
                  </div>                        
                </div>
                <div className="flex h-6 items-center justify-center rounded-full">              
                  <span className="font-bold cursor-pointer" onClick={clickModal}>X
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 p-6.5" id="adminInfoDiv">
                <InputOne className="w-full px-1 text-right" label="창업비용" propertyName="STARTUP_COST" inputGb="str" onChange={funcNumFormat} value={startupCost} />
                <InputOne className="w-full px-1 text-right" label="투자예상수익" propertyName="INVEST_EXPECT_COST" inputGb="str" onChange={funcNumFormat} value={investExpectCost} />

                <SelectCommCode codeName="INVEST_TYPE" className="w-full" label="결정유형" propertyName="INVEST_TYPE" selectValue={investType} onChange={handleSelect} />
                <TextArea label="의견" propertyName="REASON" defaultValue={details.REASON} className="w-100 h-32" ></TextArea>                  
              </div>
              <div className="border-t border-stroke py-4 px-6.5 grid place-items-center w-full">
                <div className="flex gap-2 place-items-center">                        
                  <div>
                    <Button label="닫기" className="bg-primary" onClick={clickModal} />                    
                  </div>
                  <div>
                    <Button label="저장" className="bg-primary" onClick={func_save} />                    
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

export default InvestConsultModal;
