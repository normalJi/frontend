'use client';
import { SearchModalBox, SearchModalContent } from '@/components/Modal/modalStyle';
import Button from '@/components/Button/Button';
import { useState } from 'react';

const OpenProcessMemoModal = (props) => {
  // 전달받은 state 함수
  const { clickModal } = props;
  const [ inputs, setInputs ] = useState(props.data);


  const uf_change = (e) => {
    const { value, name } = e.target;
    
    setInputs({
      ...inputs,
      [name]: value
    })
  }

  // 수정 반영
  const func_inputChange = (e) => {    
    if( confirm("등록 버튼을 눌러야 저장 됩니다.") ) {
      const values = inputs;
      //setDetails(values);    
      props.func_getDataList(values);  // 상위에 값 전달
      clickModal();
    }
  };   

  return (
    <SearchModalBox>
      <SearchModalContent onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 w-150">
          <div className="flex flex-col gap-9 w-150">              
            <div className="rounded-sm border border-stroke bg-white shadow-default">
              <div className="flex flex-1 items-center justify-between border-b border-stroke py-1 px-6.5">
                <div>
                  <div className="flex w-full mt-2">
                    <div className="flex items-center mb-2 mr-6">
                      <h3 className="font-bold text-black place-items-center">
                        메모
                      </h3>
                    </div>                               
                  </div>                        
                </div>
                <div className="flex h-6 items-center justify-center rounded-full">  
                  <span className="font-bold cursor-pointer" onClick={clickModal}>X
                  </span>
                </div>
              </div>
              <div className="flex flex-col p-6.5" id="accDetailDiv">
                <div className='flex'>
                  <div className='w-full flex items-center'>
                    <textarea													
                      name="ITEM_CONTENTS"
                      value={inputs.ITEM_CONTENTS}
                      onChange={uf_change}    
                      className={"w-full h-52 border-[1px] border-stroke bg-transparent py-3 px-5 font-size font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"}                    
                    ></textarea>
                  </div>                  
                </div>
              </div>
              <div className="border-t border-stroke py-4 px-6.5 grid place-items-center w-full">
                <div className="flex gap-2 place-items-center">                        
                  <div>
                    <Button label="닫기" onClick={clickModal} className="bg-primary" />
                  </div>
                  <div>
                    <Button label="적용" onClick={func_inputChange} className="bg-primary" />
                  </div>
                </div>        
              </div>
            </div>
          </div>
        </div>
      </SearchModalContent>
    </SearchModalBox>
  );
}

export default OpenProcessMemoModal;