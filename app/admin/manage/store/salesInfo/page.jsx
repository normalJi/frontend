'use client';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Axios from "@/components/common/api/Axios";
import { uf_formatChange } from "@/components/common/util/Util";
import UserInfo from "@/components/Manage/userInfo";
import SaleCalender from '@/components/Manage/Store/SaleInfo/SaleCalender';
import LineChart from "@/components/Charts/LineChart";
import BarChart from "@/components/Charts/BarChart";

const SalesInfo = () => {
  const searchParams = useSearchParams();
  const [seq, setSeq] = useState(searchParams.get('seq'));
  
  const router = useRouter();
  const [saleInfo, setSaleInfo] = useState([]);
  const [invest, setInvest] = useState([]);
  const [user, setUser] = useState({});
  const [Selected, setSelected] = useState('');

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

  // 데이터 조회 (표준 손익계산)
  const fetchSalesDataAxios = async () => {
    const params = {"AD_STORE_INFO_SEQ": seq};

    try {
      const response = await Axios.post("/api/v1/sales/info/list", params);      
      setSaleInfo(response.data.data.income);
      setInvest(response.data.data.invest[0]);
    } catch(error) {      
      return false;
    }
  }

  useEffect(() => {
    fetchSalesDataAxios();
  }, [])

  // 수정 저장 (이전 기획내용 추후 사용예정)
  const funcSave = async function() {
    try {
      const updateList = saleInfo.map((item) => {
        // 표준손익계산 
        const listWrapElement = document.getElementById(`listWrap_${item.AD_STD_INCOME_SEQ}`);
        const inputs = listWrapElement.querySelectorAll('.manaInput');
  
        const inputInfo = Array.from(inputs).reduce((acc, inputElement) => {
          let name = inputElement.getAttribute('name');
          let value = inputElement.value;
          if (name !== 'MENO' && value === '') { value = 0; }
          acc[name] = value;
          return acc;
        }, {});
        
        return {
          AD_STD_INCOME_SEQ: item.AD_STD_INCOME_SEQ,
          ...inputInfo,
        };
      });

      const updateInvestList = invest ? [invest].map((item) => {
        // 투자내역
        const investWrapElemnet = document.getElementById(`investWrap_${item.AD_STORE_INFO_SEQ}`);
        const investInput = investWrapElemnet.querySelectorAll('.manaInput');
        const investInputInfo = Array.from(investInput).reduce((acc, inputElement) => {
          let name = inputElement.getAttribute('name');
          let value = inputElement.value;
          if (name !== 'MENO' && value === '') { value = 0; }
          acc[name] = value;
          return acc;
        }, {});
        
        return {
          AD_STORE_INFO_SEQ: item.AD_STORE_INFO_SEQ,
          ...investInputInfo,
        };
      }) : [];
      // 업데이트 코드 실행
      await Axios.post("/api/v1/sales/info/save", { list: updateList, invest : updateInvestList[0] ,STATUS: "U" });
  
    } catch(error) {
      console.error("업데이트 중 에러 발생:", error);
    }
  }
  
  // 메모 적으면 글자 + 입력내용 나오게 하기 
  // const [inputValue, setInputValue] = useState('');
  // const handleInputChange = (e) => {
  //   setInputValue(e.target.value);
  // };

  // const formattedValue = `영업일수 ${inputValue}일 (VAT포함)`;

  
  // 일자별 매출
  const [dayDeli, setDayDeli] = useState([]);
  const [dayItem, setDayItem] = useState([]);
  const [type, setType] = useState('d');
  const daySale = async () => {
    const params = { "AD_STORE_INFO_SEQ": "15", "DT_TRAN": "202402"};

    try {
      const response = await Axios.post("/api/v1/sales/date/list", params);      
      setDayDeli(response.data.data.delivery);
      setDayItem(response.data.data.item);
    } catch(error) {      
      return false;
    }
  }
  useEffect(() => {
    daySale();
  }, [])

  const toggle = () => {
    if(type === 'd'){
      setType('p')
    }else{
      setType('d')
    }
  }

  // 매출분석
  const [anaData, setAnaData] = useState([]);
  const [deli, setDeli] = useState([]);
  const [item, setItem] = useState([]);
  const [pay, setPay] = useState([]);
  const [time, setTime] = useState([]);
  const [week, setWeek] = useState([]);
  const saleAnal = async () => {
    const params = { "AD_STORE_INFO_SEQ": "15", "DT_TRAN": "202402"};
    try {
      const response = await Axios.post("/api/v1/sales/analy/list", params);      
      let data = response.data.data;
      setAnaData(data);
      setDeli(data.delivery);
      setItem(data.item);
      setPay(data.pay);
      setTime(data.time);
      setWeek(data.week);

    } catch(error) {      
      return false;
    }
  }
  useEffect(() => {
    saleAnal();
  }, [])

  useEffect(() => {
    Chart(week, 1);
    Chart(time, 2);
    Chart(pay, 3);
    Chart(item, 4);
    Chart(deli, 5);
  }, [anaData])
  console.log(anaData, 'ana')
  // 차트 그리기
  const [chartData, setChartData] = useState({});
  const [chartData2, setChartData2] = useState({});
  const [chartData3, setChartData3] = useState({});
  const [chartData4, setChartData4] = useState({});
  const [chartData5, setChartData5] = useState({});

  const [maxName, setMaxName] = useState('');
  const [maxName2, setMaxName2] = useState('');
  const [maxName3, setMaxName3] = useState('');
  const [maxName4, setMaxName4] = useState('');
  const [maxName5, setMaxName5] = useState('');

  const [maxPrice, setMaxPrice] = useState(0);
  const [maxPrice2, setMaxPrice2] = useState(0);
  const [maxPrice3, setMaxPrice3] = useState(0);
  const [maxPrice4, setMaxPrice4] = useState(0);
  const [maxPrice5, setMaxPrice5] = useState(0);

  const Chart = (datas, index) => {
    let lab = [];
    let data = [];
    let maxData = 0; 
    let maxIndex = -1; 
    let maxName = ''; 
    for (let i = 0; i < datas.length; i++) {
      switch(index){
        case 1 : lab.push(datas[i].DAYWEEK_NM); break;
        case 2 : lab.push(datas[i].H_HOUR); break;
        case 3 : lab.push(datas[i].TP_PAY_CUSTOM_NM); break;
        case 4 : lab.push(datas[i].NM_ITEM); break;
        case 5 : lab.push(datas[i].SITE_GB); break;
        default: break;
      }
      if(index === 4){
        data.push(datas[i].AM_TOTAL);
      }else{
        data.push(datas[i].AM_TOTAL);
      }

      // 최댓값을 찾아서 갱신.
      const currentData = Number(datas[i].AM_TOTAL);
      if (currentData > maxData) {
        maxData = currentData;
        maxIndex = i;
        switch(index){
          case 1 : 
            maxName = datas[i].DAYWEEK_NM; 
            setMaxName(maxName);
            setMaxPrice(maxData);
          break;
          case 2 : 
            maxName = datas[i].H_HOUR; 
            setMaxName2(maxName);
            setMaxPrice2(maxData);
          break;
          case 3 : 
            maxName = datas[i].TP_PAY_CUSTOM_NM; 
            setMaxName3(maxName);
            setMaxPrice3(maxData);
          break;
          case 4 : 
            maxName = datas[i].NM_ITEM; 
            setMaxName4(maxName);
            setMaxPrice4(maxData);
          break;
          case 5 : 
            maxName = datas[i].SITE_GB; 
            setMaxName5(maxName);
            setMaxPrice5(maxData);
          break;
          default: break;
        }
      }
    }
    
    const newData = {
      labels: lab,
      datasets: [
        {
          label : '',
          data: data,
          backgroundColor: ['#1c2434'],
          borderColor: ['#1c2434'],
          borderWidth: 1
        },
      ]
    };
    switch (index) {
      case 1: setChartData(newData); break;
      case 2: setChartData2(newData); break;
      case 3: setChartData3(newData); break;
      case 4: setChartData4(newData); break;
      case 5: setChartData5(newData); break;
      default: break;
    }
  };

  
  // 탭 화면 변경
  const clicked = (e) => {
    let refresh = document.querySelectorAll('.saleNav');
    let screen = document.querySelectorAll('.screen');
    refresh.forEach(element => {
        element.classList.remove('border-b-2');
    });
    screen.forEach(e => {
      e.classList.add('none');
    })
    e.target.classList.add('border-b-2');
    let text = e.target.textContent;
    if(text === '매출현황'){
      let contents = document.getElementById('saleStatus')
      contents.classList.remove('none');
    }
    if(text === '일자별 매출'){
      let contents = document.getElementById('daySale')
      contents.classList.remove('none');
    } 
    if(text === '매출분석'){
      let contents = document.getElementById('saleAnal')
      contents.classList.remove('none');
    }
  }

  // 현재 날짜를 가져오기
  let currentDate = new Date();
  // 이번달 1일
  var firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  // 원하는 형식으로 날짜를 문자열로 변환
  let today = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentDate.getDate()).slice(-2);
  var firstDay = firstDayOfMonth.getFullYear() + '-' + ('0' + (firstDayOfMonth.getMonth() + 1)).slice(-2) + '-' + ('0' + firstDayOfMonth.getDate()).slice(-2);
  // 결과 출력
  const [str, setStr] = useState(firstDay);
  const [end, setEnd] = useState(today);
  
  // 매출분석 기간 클릭시
  const searchPeriod = (e) => {
    let box = document.querySelectorAll('.saleTimeBox');
    for(let i = 0; i < box.length; i++){
      box[i].classList.remove('clickedBg');
    }
    e.target.classList.add('clickedBg');
  }
  return (
    <>
        <UserInfo data={user} onSave={() => { funcSave(); }} />
        <div className="flex saleNavContainer border-stroke">
          <div className="w-7 center pointer saleNav border-b-2" onClick={ (e) => {clicked(e)}}>매출현황</div>
          <div className="w-7 center pointer saleNav" onClick={ (e) => {clicked(e)}}>일자별 매출</div>
          <div className="w-7 center pointer saleNav" onClick={ (e) => {clicked(e)}}>매출분석</div>
        </div>
        <div id="saleStatus" className="screen">
          <SaleCalender seq={seq} />
        </div>
        
        <div className=" w-full mx-auto overflow-auto none screen" id="daySale">
          <div className="col-span-12 rounded-sm border border-stroke bg-white shadow-default  xl:col-span-4 mt-4 mb-4 flex itemCenter justifySpaceBetween" >
            <div className="flex items-center gap-5 py-2 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
              <div className="flex flex-1 items-center justify-between">
                <div id="storeDiv">
                  <div className="flex w-full mt-2">
                    <div className="flex items-center mb-2 ml-4 mr-6">
                      <p className="mr-2 font-size font-medium">조회조건</p>
                    </div>
                    <div className="flex items-center mb-2">
                      <select name="SEARCH_YEAR" className='w-24 relative z-20 border-[1px] border-stroke bg-transparent py-2 px-3 text-xs outline-none transition focus:border-primary active:border-primary'>
                        <option value="202402">2024.02</option>
                      </select> <span className='font-size ml-2 mr-4'></span> 
                      <div className="flex items-center ml-4 mr-6">
                        <p className="mr-2 font-size font-medium">매출구분</p>
                      </div>
                      <select name="SEARCH_MONTH" onChange={toggle} className='w-24 relative z-20 border-[1px] border-stroke bg-transparent py-2 px-3 text-xs outline-none transition focus:border-primary active:border-primary'>
                        {/* <option value="1">카드</option> */}
                        <option value="2">배달</option>
                        {/* <option value="3">홀</option> */}
                        <option value="4">품목별</option>
                        {/* <option value="5">국세청</option> */}
                      </select> <span className='font-size ml-2'></span>
                    </div>      
                  </div>              
                </div>
              </div>
            </div>

            <div className="saleSearchBtn flex justifyEven itemCenter">
              <img src={"/images/manage/searchWhite.svg"} alt="" />
              <div>검색</div>
            </div>
          </div>
          <div className="tableSet">
            <table className="table-auto w-full text-left whitespace-no-wrap ">
              {type === 'd' && (
                <thead>
                  <tr>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">번호</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">주문일자</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">주문시간</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">수령방법</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">결제타입</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">배달비</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">결제금액</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">사이트</th>
                  </tr>
                </thead>
              )}
              {type === 'p' && (
                <thead>
                  <tr>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">번호</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">주문일자</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">주문시간</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">상품명</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">결제금액</th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">사이트</th>
                  </tr>
                </thead>
              )}
              {type === 'd' && dayDeli.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.DT_TRAN}</td>
                  <td className="px-4 py-3">{item.TM_TRAN}</td>
                  <td className="px-4 py-3">{item.TP_RECEIVE}</td>
                  <td className="px-4 py-3">{item.NM_MAIN_PAY}</td>
                  <td className="px-4 py-3">{item.AM_DELIVERY}</td>
                  <td className="px-4 py-3">{item.AM_TOTAL}</td>
                  <td className="px-4 py-3">{item.SITE_GB}</td>
                </tr>
              ))}
              {type === 'p' && dayItem.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.DT_TRAN}</td>
                  <td className="px-4 py-3">{item.TM_TRAN}</td>
                  <td className="px-4 py-3">{item.NM_ITEM}</td>
                  <td className="px-4 py-3">{item.AM_TOT}</td>
                  <td className="px-4 py-3">{item.SITE_GB}</td>
                </tr>
              ))}
            </table>
          </div>
        
        </div>

        <div id="saleAnal" className="none screen">
          <div className=" w-full mx-auto overflow-auto" id="">
            <div className="col-span-12 rounded-sm border border-stroke bg-white shadow-default  xl:col-span-4 mt-4 mb-4 flex itemCenter justifySpaceBetween" >
              <div className="flex items-center gap-5 py-2 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
                <div className="flex flex-1 items-center justify-between">
                  <div id="storeDiv">
                    <div className="flex w-full mt-2">
                      <div className="flex items-center mb-2 ml-4 mr-6">
                        <p className="mr-2 font-size font-medium">조회조건</p>
                      </div>
                      <div className="flex items-center mb-2">
                        <select type="date" className="typeO w-875 border border-stroke bg-transparent py-2 px-3 font-size font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" >
                            <option value="202402">2024.02</option>
                        </select>
                        {/* <input type="date" className="salesInput" defaultValue={str}/>
                        <input type="date" className="salesInput ml-10" defaultValue={end}/>
                        <div className="flex ml-20">
                          <div className="saleTimeBox center pointer" onClick={ (e) => {searchPeriod(e)}}>지난주</div>
                          <div className="saleTimeBox center pointer" onClick={ (e) => {searchPeriod(e)}}>이번주</div>
                          <div className="saleTimeBox center pointer clickedBg" onClick={ (e) => {searchPeriod(e)}}>이번달</div>
                          <div className="saleTimeBox center pointer" onClick={ (e) => {searchPeriod(e)}}>올해</div>
                        </div> */}
                      </div>      
                    </div>              
                  </div>
                </div>
              </div>

              <div className="saleSearchBtn flex justifyEven itemCenter">
                <img src={"/images/manage/searchWhite.svg"} alt="" />
                <div>검색</div>
              </div>
            </div>
          </div>
          <div className="flex w-100 flexWrap">
            <div className="w-50 pd10">
              <div>요일별 매출</div>
              <div className="flex justifySpaceBetween">
                <div>{maxName}</div>
                <div>{maxPrice}원</div>
              </div>
              {chartData && Object.keys(chartData).length > 0 && <BarChart data={chartData} />}
            </div>
            <div className="w-50 pd10">
              <div>시간대별 매출</div>
              <div className="flex justifySpaceBetween">
                <div>{maxName2}시</div>
                <div>{maxPrice2}원</div>
              </div>
              {chartData2 && Object.keys(chartData2).length > 0 && <LineChart data={chartData2} />}
            </div>
            <div className="w-50 pd10">
              <div>결제 수단별 매출</div>
              <div className="flex justifySpaceBetween">
                <div>{maxName3}</div>
                <div>{maxPrice3}원</div>
              </div>
              {chartData3 && Object.keys(chartData3).length > 0 && <BarChart data={chartData3} />}
            </div>
            <div className="w-50 pd10">
              <div>품목별 매출</div>
              <div className="flex justifySpaceBetween">
                <div>{maxName4}</div>
                <div>{maxPrice4}원</div>
              </div>
              {chartData4 && Object.keys(chartData4).length > 0 && <BarChart data={chartData4} />}
            </div>
            <div className="w-50 pd10">
              <div>배달 매출</div>
              <div className="flex justifySpaceBetween">
                <div>{maxName5}</div>
                <div>{maxPrice5}원</div>
              </div>
              {chartData5 && Object.keys(chartData5).length > 0 && <BarChart data={chartData5} />}
            </div>
          </div>
        </div>
        {/* <div >
          <div>1. 투자내역(16평기준)</div>
          <div className="border">
            <div className="flex">
              <div>총액</div>
              <div>임차보증금</div>
              <div>영업(권리)금</div>
              <div>중개수수료</div>
              <div>회사납입금</div>
              <div>초도물품</div>
              <div>판매장비</div>
              <div>냉난방</div>
              <div>인테리어</div> 
            </div>
            <div key={invest.AD_STORE_INFO_SEQ} id={`investWrap_${invest.AD_STORE_INFO_SEQ}`} >
              <input type="text" className="manaInput" name="TOTAL_COST" defaultValue={invest.TOTAL_COST} /> 
              <input type="text" className="manaInput" name="RENT_DEPOSIT" defaultValue={invest.RENT_DEPOSIT}/>
              <input type="text" className="manaInput" name="PREMIUM" defaultValue={invest.PREMIUM}/>
              <input type="text" className="manaInput" name="BROKER_FEE" defaultValue={invest.BROKER_FEE}/>
              <input type="text" className="manaInput" name="COMP_PAYMENT" defaultValue={invest.COMP_PAYMENT}/>
              <input type="text" className="manaInput" name="INIT_ARTICLE" defaultValue={invest.INIT_ARTICLE}/>
              <input type="text" className="manaInput" name="SALES_EQUIP" defaultValue={invest.SALES_EQUIP}/> 
              <input type="text" className="manaInput" name="MANAGE_COST" defaultValue={invest.MANAGE_COST}/>
              <input type="text" className="manaInput" name="INTERIOR_COST" defaultValue={invest.INTERIOR_COST}/>
            </div>
          </div>

          <div>2. 표준 손익계산</div>
          <div className="border">
            <div className="flex">
              <div>항목</div>
              <div>B.E.P <br /> (EBITDA)</div>
              <div>B.E.P <br /> (경상이익)</div>
              <div>최저액</div>
              <div>평균</div> 
              <div>최고액</div>
              <div>산출근거</div>
            </div>

            {saleInfo.map((saleItem) => {
              return (
                <div key={saleItem.AD_STD_INCOME_SEQ} id={`listWrap_${saleItem.AD_STD_INCOME_SEQ}`} className="flex">
                  <div>{saleItem.CATE_SUB_NM}</div> 
                  <input type="text" className="manaInput" name="EBITDA" defaultValue={saleItem.EBITDA} />
                  <input type="text" className="manaInput" name="ORDINARY_PROFIT" defaultValue={saleItem.ORDINARY_PROFIT}/> 
                  <input type="text" className="manaInput" name="MIN_COST" defaultValue={saleItem.MIN_COST}/>
                  <input type="text" className="manaInput" name="MAX_COST" defaultValue={saleItem.MAX_COST}/>
                  <input type="text" className="manaInput" name="AVERAGE_COST" defaultValue={saleItem.AVERAGE_COST}/>
                  <input type="text" className="manaInput" name="MENO" defaultValue={saleItem.MENO} id = {saleItem.AD_STD_INCOME_SEQ}
                  /> 
                  <input type="text" className="manaInput" defaultValue={saleItem.AD_STD_INCOME_SEQ} name="AD_STD_INCOME_SEQ" />
                </div>
              );
            })}
          </div>
        </div> */}
    </>
  );
};

export default SalesInfo;
