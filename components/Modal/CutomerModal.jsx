'use client';
import { useEffect, useState } from 'react'
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import router from 'next/navigation'
import { uf_makeParams, uf_onlyNumber, uf_numberFormat } from '../common/util/Util';
import Axios from "@/components/common/api/Axios";
import { isNull } from '@/components/common/util/Util';


const CustomerModal = (props) => {
  
  const [ seq, setSeq ] = useState(props.seq);  

  const [ details, setDetails ] = useState({});

  const [ bossHp, setBossHp ] = useState('');
  const [ managerHp, setManagerHp ] = useState('');
  const [ receivableCost, setReceivableCost ] = useState('');
  const [ payableCost, setPayableCost ] = useState('');
  const [ balanceCost, setBalanceCost ] = useState('');

  // 전달받은 state 함수
  const { clickModal } = props;
  const {newModal} = props;



  useEffect(() => {
    // 신규 등록일 경우 input 초기화
    if( newModal ) {
      setDetails('');      
    } else {
      setDetails(props.data);
      setBossHp(props.data.BOSS_HP);
      setManagerHp(props.data.MANAGER_HP);
      setReceivableCost(props.data.RECEIVABLE_COST);
      setPayableCost(props.data.PAYABLE_COST);
      setBalanceCost(props.data.BALANCE_COST);
    }
    
  }, [seq]);    
  
  
  // 저장
  const fetchSaveAxios = async() => {
    let inputs = customerDiv.getElementsByTagName('input');
    let params = uf_makeParams(inputs);    
    params['AD_STORE_INFO_SEQ'] = seq;
    
    if( details.hasOwnProperty('AD_STORE_CUSTOMER_MNG_SEQ') ) {
      params['STATUS'] = 'U';  
    } else {
      params['STATUS'] = 'I';
    }    

    try {
      if( confirm("저장 하시겠습니까?") ) {
        await Axios.post("/api/v1/customer/save", params);            
        alert('저장 되었습니다.');
        props.funcParent();
        clickModal();
      }
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  
  // 
  const funcNumFormat = function(e){
    const tel = uf_onlyNumber(e.target.value);
    const num = uf_numberFormat(e.target.value, true, true, true);

    switch (e.target.name) {      
      case 'BOSS_HP':        
        setBossHp(tel);
        break;
      case 'MANAGER_HP':        
        setManagerHp(tel);
        break;
      case 'RECEIVABLE_COST':        
        setReceivableCost(num);
        break;
      case 'PAYABLE_COST':        
        setPayableCost(num);
        break;
      case 'BALANCE_COST':        
        setBalanceCost(num);
        break;
      default:
        break;
    }
  }
    
  
  
    // 글과 관련이 없음
    // const [search, setSearch] = useState('')
    // const [type, setType] = useState('')
    // const handleChange = (e) => setSearch(e.target.value)
    // const typeChange = (e) => setType(e.target.value)
    // const clickSearch = async () => {}
    return (
      	// 뒷배경을 클릭하면 모달을 나갈 수 있게 해야하므로 뒷 배경 onClick에 state함수를 넣는다.
        <>
        {/* <SearchModalBox onClick={clickModal}> */}
          <SearchModalBox>
            <SearchModalContent onClick={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 w-100">
                <div className="flex flex-col gap-9 w-100">
                  {/* <!-- Input Fields --> */}
                  <div className="rounded-sm border border-stroke bg-white shadow-default">
                    
                    
                    <div className="flex flex-1 items-center justify-between border-b border-stroke py-4 px-6.5">
                      <div>
                        <div className="flex w-full mt-2">
                          <div className="flex items-center mb-2 ml-4 mr-6">
                            <h3 className="font-bold text-black place-items-center">거래처 등록</h3>
                          </div>                               
                        </div>                        
                      </div>

                      <div className="flex h-6 items-center justify-center rounded-full">              
                        <span className="font-bold cursor-pointer" onClick={clickModal}>X
                        </span>
                      </div>
                    </div>
                    
                    
                    <div className="flex flex-col gap-2 p-6.5" id="customerDiv">
                      <div className='flex w-full mt-2'>
                        <div className='w-24 flex items-center'>
                          <label className="mr-3 mb-3 text-black font-size">상호명</label>
                        </div>
                        <div className='flex items-center'>
                          <input
                            type="text"
                            name='STORE_NM'
                            defaultValue={details.STORE_NM}
                            placeholder="상호명을 입력하세요."
                            className="border-[1px] font-size border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          />
                          <input type="hidden" name="AD_STORE_CUSTOMER_MNG_SEQ" defaultValue={details.AD_STORE_CUSTOMER_MNG_SEQ}/>
                        </div>
                      </div>

                      <div className='flex w-full mt-2'>
                        <div className='w-24 flex items-center'>
                          <label className="mr-3 mb-3 text-black font-size">유형</label>
                        </div>
                        <div className='flex items-center'>
                          <input
                            type="text"
                            name='SECTOR'
                            defaultValue={details.SECTOR}
                            placeholder="유형을 입력하세요."
                            className="border-[1px] font-size border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          />
                        </div>
                      </div>

                      <div className='flex w-full mt-2'>
                        <div className='w-24 flex items-center'>
                          <label className="mr-3 mb-3 text-black font-size">대표번호</label>
                        </div>
                        <div className='flex items-center'>
                          <input
                            type="text"
                            name='BOSS_HP'
                            value={bossHp}
                            placeholder="대표번호를 입력하세요."
                            className="border-[1px] font-size border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                            onChange={funcNumFormat}
                          />
                        </div>
                      </div>

                      <div className='flex w-full mt-2'>
                        <div className='w-24 flex items-center'>
                          <label className="mr-3 mb-3 text-black font-size">담당자명</label>
                        </div>
                        <div className='flex items-center'>
                          <input
                            type="text"
                            name='MANAGER_NM'
                            defaultValue={details.MANAGER_NM}
                            placeholder="담당자명을 입력하세요."
                            className="border-[1px] font-size border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          />
                        </div>
                      </div>

                      <div className='flex w-full mt-2'>
                        <div className='w-24 flex items-center'>
                          <label className="mr-3 mb-3 text-black font-size">담당자번호</label>
                        </div>
                        <div className='flex items-center'>
                          <input
                            type="text"
                            name='MANAGER_HP'
                            value={managerHp}                            
                            placeholder="담당자번호를 입력하세요."
                            className="border-[1px] font-size border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                            onChange={funcNumFormat}
                          />
                        </div>
                      </div>

                      <div className='flex w-full mt-2'>
                        <div className='w-24 flex items-center'>
                          <label className="mr-3 mb-3 text-black font-size">미수금</label>
                        </div>
                        <div className='flex items-center'>
                          <input
                            type="text"
                            name='RECEIVABLE_COST'
                            value={receivableCost}
                            placeholder="미수금을 입력하세요."
                            className="border-[1px] font-size border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                            onChange={funcNumFormat}
                          />
                        </div>
                      </div>

                      <div className='flex w-full mt-2'>
                        <div className='w-24 flex items-center'>
                          <label className="mr-3 mb-3 text-black font-size">미지급금</label>
                        </div>
                        <div className='flex items-center'>
                          <input
                            type="text"
                            name='PAYABLE_COST'
                            value={payableCost}
                            placeholder="미지급금을 입력하세요."
                            className="border-[1px] font-size border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                            onChange={funcNumFormat}
                          />
                        </div>
                      </div>

                      <div className='flex w-full mt-2'>
                        <div className='w-24 flex items-center'>
                          <label className="mr-3 mb-3 text-black font-size">잔액</label>
                        </div>
                        <div className='flex items-center'>
                          <input
                            type="text"
                            name='BALANCE_COST'
                            value={balanceCost}                            
                            placeholder="잔액을 입력하세요."
                            className="border-[1px] font-size border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                            onChange={funcNumFormat}
                          />
                        </div>
                      </div>

                      <div className='flex w-full mt-2'>
                        <div className='w-24 flex items-center'>
                          <label className="mr-3 mb-3 text-black font-size">메모</label>
                        </div>
                        <div className='flex items-center'>
                          <input
                            type="text"
                            name='MENO'
                            defaultValue={details.MENO}
                            placeholder=""
                            className="border-[1px] font-size border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-stroke py-4 px-6.5 grid place-items-center w-full">
                      <div className="flex gap-2 place-items-center">                        
                        <div>
                          <span className="btn-size rounded-xl inline-flex items-center justify-center bg-primary px-5 py-3 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer"
                            onClick={clickModal}>닫기</span>
                        </div>
                        <div>
                          <span className="btn-size rounded-xl inline-flex items-center justify-center bg-primary px-5 py-3 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer"
                            onClick={fetchSaveAxios}  >저장</span>
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

export default CustomerModal