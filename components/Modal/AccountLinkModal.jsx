'use client';
import { useEffect, useState, useRef } from 'react'
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import { uf_makeParams, uf_onlyNumber, uf_numberFormat, uf_formatChange, uf_isNull } from '../common/util/Util';
import Axios from "@/components/common/api/Axios";

import Button from '@/components/Button/Button';

const AccountLinkModal = (props) => {  
  const { data } = props;
  const [ seq, setseq ] = useState(data.AD_STORE_INFO_SEQ);
    
  // 전달받은 state 함수
  const { clickModal } = props;   

  const [ accountData, setAccountData ] = useState([]);

  // 사이트 계정 조회
  const func_fetchDataAxios = async() => {
    let params = {};
    params["AD_STORE_INFO_SEQ"] = seq;    
    
    try {
      const response = await Axios.post("/api/v1/store/site/account/list", params);            
      let result = response.data.data;
      setAccountData(result);

      //func_searchData();

    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }
  
  useEffect(() => {
    func_fetchDataAxios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq]);  

  // 저장
  const func_Save = async function(){

    const params = accountData? [accountData].map((item) => {      
      const inputs = accountLinkDiv.getElementsByTagName('input');

      const inputInfo = Array.from(inputs).reduce((prev, {name, value}) => {
        prev['AD_STORE_INFO_SEQ'] = seq;
        if( name.indexOf('_LOGIN_') != -1 || name.indexOf('SCRP_USER_ACCOUNT_SEQ') != -1 ){
          let _nameSplit = name.split('_');
          let TP_SITE = _nameSplit[_nameSplit.length - 1];
          let _name = name.replace(`_${TP_SITE}`, '');
          if( uf_isNull(prev.list[TP_SITE.toLocaleLowerCase()]) ){
            prev.list[TP_SITE.toLocaleLowerCase()] = { [_name] : value };
          }else{
            prev.list[TP_SITE.toLocaleLowerCase()][_name] = value;
          }
        }else{
          prev[name] = value.trim(); 
        }
        return prev;
      }, { list : {} });
      
      return inputInfo;

    }): [];
    
    console.log(params);

    try {
      if( confirm("저장 하시겠습니까?") ) {
        const response = await Axios.post("/api/v1/store/site/account/save", params);
        const {AD_ACCOUNT_INFO_SEQ} = response.data;
        
        alert('저장 되었습니다.');
        props.funcParent();
        clickModal();
      }
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  return (      
    <>      
      <SearchModalBox>
        <SearchModalContent onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 w-150">
            <div className="flex flex-col gap-9 w-150">              
              <div className="rounded-sm border border-stroke bg-white shadow-default">
                <div className="flex flex-1 items-center justify-between border-b border-stroke py-1 px-6.5">
                  <div>
                    <div className="flex w-full mt-2">
                      <div className="flex items-center mb-2 mr-6">
                        <h3 className="font-bold text-black place-items-center">계정 연동</h3>
                      </div>                               
                    </div>                        
                  </div>
                  <div className="flex h-6 items-center justify-center rounded-full">              
                    <span className="font-bold cursor-pointer" onClick={clickModal}>X
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-6.5" id="accountLinkDiv">
                {                  
                  accountData.map((row, index) => {
                    return (
                      <div key={index}>                          
                        { 
                          row.TP_SITE === 'yessin' ? 
                          <_Input label="여신금융협회" propertyName="ID_LOGIN_YESSIN" value={row.ID_LOGIN}  propertyName2="PW_LOGIN_YESSIN" propertyHidden="SCRP_USER_ACCOUNT_SEQ_YESSIN" value2={row.PW_LOGIN} hiddenValue={row.SCRP_USER_ACCOUNT_SEQ} />
                          : ""
                        }
                        { 
                          row.TP_SITE === 'baemin' ? 
                          <_Input label="배달의민족" propertyName="ID_LOGIN_BAEMIN" value={row.ID_LOGIN} propertyName2="PW_LOGIN_BAEMIN" value2={row.PW_LOGIN} propertyHidden="SCRP_USER_ACCOUNT_SEQ_BAEMIN" hiddenValue={row.SCRP_USER_ACCOUNT_SEQ} />  
                          : ""
                        }
                        { 
                          row.TP_SITE === 'yogiyo' ? 
                          <_Input label="요기요" propertyName="ID_LOGIN_YOGIYO" value={row.ID_LOGIN} propertyName2="PW_LOGIN_YOGIYO" value2={row.PW_LOGIN} propertyHidden="SCRP_USER_ACCOUNT_SEQ_YOGIYO" hiddenValue={row.SCRP_USER_ACCOUNT_SEQ} />  
                          : ""
                        }
                        { 
                          row.TP_SITE === 'coupang' ? 
                          <_Input label="쿠팡이츠" propertyName="ID_LOGIN_COUPANG" value={row.ID_LOGIN} propertyName2="PW_LOGIN_COUPANG" value2={row.PW_LOGIN} propertyHidden="SCRP_USER_ACCOUNT_SEQ_COUPANG" hiddenValue={row.SCRP_USER_ACCOUNT_SEQ} />  
                          : ""
                        }
                      </div>
                    )
                  })
                }                  
                </div>
                <div className="border-t border-stroke py-4 px-6.5 grid place-items-center w-full">
                  <div className="flex gap-2 place-items-center">                        
                    <div>
                      <Button label="닫기" onClick={clickModal} className="bg-primary" />
                    </div>
                    <div>
                      <Button label="저장" onClick={func_Save} className="bg-primary" />
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

export default AccountLinkModal

const _Input = ({label, propertyName, value, onChange, propertyName2, value2, className, propertyHidden, hiddenValue, ...inputProps}) => {
  return (
    <div className='flex w-full mt-2'>
      <div className="w-24 flex items-center mb-2">
        <label className="mr-3 text-black font-size">
          {label}
        </label>
      </div>
      <div className="flex flex-1 relative shadow-sm">
        <span className='font-size'>ID </span>
        <input
          type="text"
          name={propertyName}          
          defaultValue={value}
          className='border-[1px] pr-9 border-stroke bg-transparent py-2 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size'          
          {...inputProps}
        />
        <span className='font-size'>PW </span>      
        <input
          type="password"
          name={propertyName2}
          defaultValue={value2}                 
          className='border-[1px] pr-9 border-stroke bg-transparent py-2 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size'          
        />
        <input type="hidden" name={propertyHidden} defaultValue={hiddenValue} />
      </div>
    </div>
  );
}
