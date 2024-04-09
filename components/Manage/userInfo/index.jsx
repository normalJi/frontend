'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Axios from "@/components/common/api/Axios";

const UserInfo = (props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  let pathArr = [
    '/admin/manage/store/investHistory',    
    '/admin/manage/store/salesInfo',
  ];

  // '/admin/manage/store/staffInfo',
  // '/admin/manage/store/storeAnaly',
  // '/admin/manage/store/qna',
  // '/admin/manage/store/etc',

  // Y 이면 저장 버튼 show, N 이면 hidden
  let showBtn = 'N';
  const show = pathArr.map((x) => {
    if( x === pathname ) showBtn = 'Y';
  });
  
  const [ user, setUser] = useState({});

  const fetchUserDataAxios = async() => {
    const params = {"AD_STORE_INFO_SEQ": searchParams.get('seq')};

    try {
      const response = await Axios.post("/api/v1/store/user/details", params);      
      setUser(response.data.data);  
      
    } catch(error) {      
      return false;
    }
  }

  useEffect(() => {
    fetchUserDataAxios();
  }, []) 
  // const [storeNm, setStoreNm] = useState('');
  // const [storeAddr, setStoreAddr] = useState(props.data.STORE_ADDR);

  // const blurHandler = (e) => {
  //   setStoreNm(e.target.value);
  //   //console.log(`blur Handler ${e.target.value}`);
  // };
  
  // 추후 살릴예정
  // const funcGetInput = function() {
  //   let params = {};    
  //   let inputs = storeDiv.getElementsByTagName('input');
  //   for (const input of inputs) {
  //     if( input.type === 'text' ) {        
  //       params[input.name] = input.value;
  //     }
  //   } 

  //   setStoreNm(params);
  //   //setStoreAddr(props.data.STORE_ADDR);
  // }

  // props.parentFunc(storeNm);
  
  return (
    <>
      <div className="col-span-12 rounded-sm border border-stroke bg-white shadow-default  xl:col-span-4 mt-4 mb-4">
        <div className="flex items-center gap-5 py-2 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
          <div className="flex flex-1 items-center justify-between">
            <div id="storeDiv">
              <div className="flex w-full mt-2">
                <div className="flex items-center mb-2 ml-4 mr-6">
                  <p className="mr-2 font-size">브랜드명</p>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    name="STORE_NM"
                    disabled
                    defaultValue={user.STORE_NM}
                    placeholder="브랜드명을 입력해주세요."
                    className="w-100 border-[1.5px] border-stroke bg-transparent py-1 font-size  font-medium outline-none transition disabled:bg-whiter"
                    //onblur={blurHandler}
                  />
                </div>      
              </div>
              <div className="flex w-full flex-wrap mb-2 ml-4 font-size">
                <div className="mr-4">매장주소</div><span className="ml-4">{user.STORE_ADDR} {user.STORE_ADDR_DETAIL}</span>
              </div>
            </div>

            <div className="flex h-6 items-center justify-center rounded-full">              
              {/* <span className="inline-flex rounded-md items-center justify-center bg-primary px-5 py-3 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer" 
                onClick={() => { funcGetInput(); props.onSave && props.onSave();}}>저장
              </span> */}
              <span className={`inline-flex rounded-md items-center justify-center bg-primary px-5 btn-size text-sm font-small text-white hover:bg-opacity-90 cursor-pointer
                ${showBtn === 'N' ? 'hidden' : ''}`} 
                onClick={() => { props.onSave && props.onSave();}}>저장
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfo;