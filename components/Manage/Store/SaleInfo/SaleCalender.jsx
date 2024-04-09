'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Axios from "@/components/common/api/Axios";
import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';
import Modal from "react-modal";
import '@/components//Manage/Store/OpenReady/Calendar.css';
const Calendar = (props) => {

  const today = new Date();
  const calendarRef = useRef(null);  

  const [ seq, setSeq ] = useState(props.seq);
  const [ list, setList] = useState({}); 
  
  const [ selYear, setSelYear ] = useState(today.getFullYear());
  const [ selMonth, setSelMonth ] = useState((today.getMonth() + 1) < 10 ? `0${(today.getMonth() + 1)}`: today.getMonth() + 1);

  // 년도
  const yearList = () => {
    const year = [];
    for( let i = today.getFullYear(); i >= 2022; i-- ){
      year.push(<option key={i} value={i}>{i}</option>);
    }
    return year;
  }

  // 월
  const monthList = () => {
    const month = [];
    let j = 0;
    for( let i = 1; i <= 12; i++ ){
      j = i;
      if( j < 10 ) j = `0${i}`;
      
      if( (today.getMonth() + 1) === i ) {
        month.push(<option key={i} value={j} selected>{i}</option>);
      } else {
        month.push(<option key={i} value={j}>{i}</option>);
      }
    }
    return month;
  }

  useEffect(() => {
    goToDate();
  }, [selYear, selMonth]);
  

  const goToDate = () => {
    const inputDate = `${selYear}-${selMonth}-01`;
    if (!calendarRef.current) return;
    const api = calendarRef.current.getApi();
    api.gotoDate(inputDate);
  };


// Month, Day도 동일한 방식으로 구현

  // const onDateClick = (date) => {
  //   onOpenScheduleDialog(date);
  // };

  // const onChangeDate = ( startStr, endStr) => {
  //   setPeriod({ startDate: new Date(startStr), endDate: new Date(endStr) });
  // };
  ///api/v1/open/schedule/list
  // const onOpenScheduleDialog = (selected) => {
  //   setSelectedDate(selected);
  //   setIsOpenScheduleDialog(true);
  // };

  // 셀렉트 박스 핸들러
  const handleSelect = (e) => {
		//setSelIndustryCd(e.target.value);
		if( e.target.name === 'SEARCH_YEAR' ) {
			setSelYear(e.target.value);
		} else if( e.target.name === 'SEARCH_MONTH' ) {
			setSelMonth(e.target.value);
		}

  };

  // 매출현황 
  const [sale, setSale] = useState([]);
  const [tot, setTot] = useState(0);
  const [doneTot, setDoneTot] = useState(0);
  const [userTot, setUserTot] = useState(0);

  const [deliverSale, setDeliverSale] = useState(0);
  const [cardSale, setCardSale] = useState(0);
  const [saleCnt, setSaleCnt] = useState(0);

  const [cardCalculated, setCardCalculated] = useState(0);
  const [deliverCalculated, setDeliverCalculated] = useState(0);
  const [calculatedCnt, setCalculatedCnt] = useState(0);

  const [cardUser, setCardUser] = useState(0);
  const [deliverUser, setDeliverUser] = useState(0);
  const [userCnt, setUserCnt] = useState(0);

  const formatDate = (dateString) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
  };

  const saleStatus = async () => {
    const params = {"AD_STORE_INFO_SEQ": 15, "DT_TRAN": "202402"};
    try {
      const response = await Axios.post("/api/v1/sales/status/list", params);
      let data = response.data.data;
      setSale(data);
      // 전체
      setTot(data.salesSum[0].AM_TOTAL)
      setDeliverSale(data.salesSum[0].AM_DELIVERY)
      let num = 0;
      for(let i = 0; i < data.salesList.length; i++){
        num += Number(data.salesList[i].TOTAL_CNT);
      }
      setSaleCnt(num);

      // 정산
      setDoneTot(data.calcSum[0].AM_TOTAL);
      setDeliverCalculated(data.calcSum[0].AM_DELIVERY);
      let numC = 0;
      for(let i = 0; i < data.calcList.length; i++){
        numC += Number(data.calcList[i].TOTAL_CNT);
      }
      setCalculatedCnt(numC);

      // 사용자 입력
      setUserTot(data.expenSum[0].AM_TOTAL);
      setDeliverUser(data.expenSum[0].AM_DELIVERY);
      let numU = 0;
      for(let i = 0; i < data.expenList.length; i++){
        numC += Number(data.expenList[i].TOTAL_CNT);
      }
      setUserCnt(numU);

      let list = [];
      for(let i = 0; i < data.salesList.length; i++){
        const formattedDate = formatDate(data.salesList[i].DT_TRAN);
        list.push({ title: `${data.salesList[i].AM_TOTAL} / ${data.salesList[i].TOTAL_CNT}`, start: `${formattedDate}`, color: '#0029FF' })
      }
      for(let i = 0; i < data.calcList.length; i++){
        const formattedDate = formatDate(data.calcList[i].DT_DEPOSIT);
        list.push({ title: `${data.calcList[i].AM_TOTAL} / ${data.calcList[i].TOTAL_CNT}`, start: `${formattedDate}`, color: 'orange' })
      }
      for(let i = 0; i < data.expenList.length; i++){
        const formattedDate = formatDate(data.expenList[i].DT_TRAN);
        list.push({ title: `${data.expenList[i].AM_TOTAL} / ${data.expenList[i].TOTAL_CNT}`, start: `${formattedDate}`, color: 'gray' })
      }
      // 그래드에 데이터 넣기
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const events = list;
        calendarApi.addEventSource(events);
      }
    } catch(error) {      
      return false;
    }
  }
  
  useEffect(() => {
    saleStatus();
  }, [seq])

  // useEffect(() => {
  //   calData();
  // }, [sale]); 
  
  // 매장관리 데이터들 넣기 
  // const calData = () => {

  //   // 전체 총 매출액
  //   let total = 0;
  //   for(let i = 0; i < saleCnt; i++){
  //     total += Number(sale.item[i].AM_TOT);
  //   }
  //   setTot(total);
  //   // 신용카드 매출액
  //   let card = 0;
  //   for(let i = 0; i < saleCnt; i++){
  //     if(sale.item[i].SITE_GB === '여신'){
  //       card += Number(sale.item[i].AM_TOT);
  //     }
  //   }
  //   setCardSale(card);
  //   // 배달 매출액
  //   let deliver = 0;
  //   for(let i = 0; i < saleCnt; i++){
  //     if(sale.item[i].SITE_GB !== '여신'){
  //       deliver += Number(sale.item[i].AM_TOT);
  //     }
  //   }
  //   setDeliverSale(deliver);
  //   // 정산 완료 내용
  //   let items = sale.item || [];
  //   let groupedBySiteGB = items.reduce((acc, item) => {
  //     const key = item.SITE_GB === '여신' ? 'y' : 'c';
  //     acc[key] = acc[key] || [];
  //     acc[key].push(item);
  //     return acc;
  //   }, {});
    
  //   // DT_TRAN이 동일한 것들 묶고 data를 모두 더하기
  //   let groupedByDT_TRAN = {};
  //   items.forEach(item => {
  //     const key = item.DT_TRAN;
  //     if (!groupedByDT_TRAN[key]) {
  //       groupedByDT_TRAN[key] = {
  //         AM_TOT: 0,
  //         dataCount: 0,
  //         data: []
  //       };
  //     }
  //     groupedByDT_TRAN[key].dataCount++;
  //     groupedByDT_TRAN[key].AM_TOT += Number(item.AM_TOT);
  //   });

  //   // 각 날짜별로 배열 만들기
  //   let dataArray = [];
  //   for (let key in groupedByDT_TRAN) {
  //     dataArray.push({
  //       DT_TRAN: key,
  //       AM_TOT: groupedByDT_TRAN[key].AM_TOT,
  //       dataCount: groupedByDT_TRAN[key].dataCount,
  //       data: groupedByDT_TRAN[key].data
  //     });
  //   }
  
  //   let list = [];
  //   for(let i = 0; i < dataArray.length; i++){
  //     list.push({ title: `${dataArray[i].AM_TOT} / ${dataArray[i].dataCount}`, start: `${dataArray[i].DT_TRAN}`, color: 'orange' })
  //   }
  //   // 그래드에 데이터 넣기
  //   if (calendarRef.current) {
  //     const calendarApi = calendarRef.current.getApi();
  //     const events = list;
  //     calendarApi.addEventSource(events);
  //   }
  // }

  // 달력 클릭해서 팝업 열기
  const [selectedDate, setSelectedDate] = useState('');
  const handleDateClick =  (e) => {
    setSelectedDate(e.dateStr); // 클릭된 날짜를 상태에 저장
    printSpendContent(e.dateStr);
    toggle(); // 팝업을 열기
  };

  // 날짜를 클릭할 때 호출되는 함수
  const [spend, setSpend] = useState([]);
  const printSpendContent = async (e) => {
    const params = {"AD_STORE_INFO_SEQ": 15, "EXPEN_DT" : e.replace(/-/g, '')};
    // 현재 등록된 데이터가 있는지 조회후 데이터 넣기 
    const res = await Axios.post("/api/v1/sales/spend/list", params);
    let list = res.data.data.spendList;
    setSpend(list);
    console.log(list, 'rfrr');
    let fix = document.getElementById('fixContain'); 
    let change = document.getElementById('changeContain'); 
    for(let i = 0; i < list.length; i++){
      if(list[i].EXPEN_GB === 'F'){
        let htmlContent = `
        <div class='flex'>
          <div class='spendDiv mt-10 mb-10'>${list[i].EXPEN_NM}</div>
          <div class='spendDiv mt-10 mb-10 ml-10'>${list[i].EXPEN_AMT}</div>
        </div>
        `
        fix.insertAdjacentHTML('afterbegin', htmlContent);
      }
      if(list[i].EXPEN_GB === 'V'){
        let htmlContent = `
        <div class='flex'>
          <div class='spendDiv mt-10 mb-10'>${list[i].EXPEN_NM}</div>
          <div class='spendDiv mt-10 mb-10 ml-10'>${list[i].EXPEN_AMT}</div>
        </div>
        `
        change.insertAdjacentHTML('afterbegin', htmlContent);
      }
    }

  }
  const [isOpen, setIsOpen] = useState(false); // 온 오프

  const toggle = () =>{
    setIsOpen(!isOpen);
  }
  // Modal 스타일
  const customStyles = {
    overlay: {
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    content: {
        left: "0",
        margin: "auto",
        width: "700px",
        height: "500px",
        padding: "0",
        overflow: "hidden",
        zIndex: 1000,
    },
  };

  const plus = (e) => {
    // 클릭된 요소의 클래스 확인
    let id = e.target.id;
    // 클릭된 요소가 클래스 "fix"를 가지고 있는지 확인
    if (id === 'fix') {
      let target = document.getElementById('fixContain'); 
      let htmlContent = `
        <div class='flex itemCenter spend fix'>
          <input type="text" name="EXPEN_NM" class='spendInput mt-10 mb-10' placeholder='지출명'/>
          <input type="text" name="EXPEN_AMT" class='spendInput mt-10 mb-10 ml-10' placeholder='숫자만 입력 가능합니다.' />
          <div class='minusBtn fontWhite center ml-10'>-</div>
        </div>
      `;
      target.insertAdjacentHTML('beforeend', htmlContent);
    }
    if (id === 'change') {
      let target = document.getElementById('changeContain'); 
      let htmlContent = `
        <div class='flex itemCenter spend change'>
          <input type="text" name="EXPEN_NM" class='spendInput mt-10 mb-10' placeholder='지출명'/>
          <input type="text" name="EXPEN_AMT" class='spendInput mt-10 mb-10 ml-10' placeholder='숫자만 입력 가능합니다.' />
          <div class='minusBtn fontWhite center ml-10'>-</div>
        </div>
      `;
      target.insertAdjacentHTML('beforeend', htmlContent);
    }
  }

  // // minusBtn 클래스를 가진 요소를 클릭했을 때 실행되는 함수
  const deleteParent = (event) => {
    // 클릭된 요소가 minusBtn 클래스를 가진 요소인지 확인합니다.
    if (event.target.classList.contains('minusBtn')) {
      // 클릭된 요소의 부모 요소를 찾아서 삭제합니다.
      const parentElement = event.target.parentElement;
      if (parentElement) {
        parentElement.remove(); // 부모 요소를 삭제합니다.
      }
    }
  };

  // 클릭 이벤트 핸들러에 deleteParent 함수를 연결합니다.
  document.addEventListener('click', deleteParent);

  // 등록
  const funcSave = async function() {
    try {
        let dataList = [];
        const inputContainers = document.querySelectorAll('.spend');
        inputContainers.forEach(container => {
          const expenName = container.querySelector('[name="EXPEN_NM"]').value;
          const expenAmt = container.querySelector('[name="EXPEN_AMT"]').value;
          const class1 = container;
          // 입력된 값이 존재하는지 확인
          if (expenName && expenAmt) {

            if(class1.classList.contains('fix')){
              const newItem = {
                EXPEN_NM: expenName,
                EXPEN_AMT: expenAmt,
                AD_STORE_INFO_SEQ: 15,
                EXPEN_GB : "F",
                EXPEN_DT : selectedDate.replace(/-/g, '')
              };
              dataList.push(newItem);
            }else{
              const newItem = {
                EXPEN_NM: expenName,
                EXPEN_AMT: expenAmt,
                AD_STORE_INFO_SEQ: 15,
                EXPEN_GB : "V",
                EXPEN_DT : selectedDate.replace(/-/g, '')
              };
              dataList.push(newItem);
            }
          }
        });
      // 업데이트 코드 실행
      await Axios.post("/api/v1/sales/spend/save", { list: dataList });
      toggle();
      location.reload();
    } catch(error) {
      console.error("업데이트 중 에러 발생:", error);
    }
  }
  return (
    <>
      <div className="col-span-12 rounded-sm border border-stroke bg-white shadow-default  xl:col-span-4 mt-4 mb-4">
        <div className="flex items-center gap-5 py-2 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
          <div className="flex flex-1 items-center justify-between">
            <div id="storeDiv">
              <div className="flex w-full mt-2">
                <div className="flex items-center mb-2 ml-4 mr-6">
                  <p className="mr-2 font-size font-medium">작업 연월</p>
                </div>
                <div className="flex items-center mb-2">
                  <select name="SEARCH_YEAR" onChange={handleSelect} value={selYear} className='w-24 relative z-20 border-[1px] border-stroke bg-transparent py-2 px-3 text-xs outline-none transition focus:border-primary active:border-primary'>
                    {yearList()}                  
                  </select> <span className='font-size ml-2 mr-4'>년</span> 
                  <select name="SEARCH_MONTH" onChange={handleSelect} value={selMonth} className='w-24 relative z-20 border-[1px] border-stroke bg-transparent py-2 px-3 text-xs outline-none transition focus:border-primary active:border-primary'>
                    {monthList()}
                  </select> <span className='font-size ml-2'>월</span>
                </div>      
              </div>              
            </div>

            <div className="flex h-6 items-center justify-center rounded-full">                            
              {/* <span className={`btn-size font-size inline-flex rounded-md items-center justify-center bg-primary px-5 btn-size font-small text-white hover:bg-opacity-90 cursor-pointer`}
                onClick={funcSearch}>검색
              </span> */}
            </div>

          </div>
        </div>
      </div>

      <div className={`rounded-sm border-stroke bg-white pt-6 pb-2.5 xl:pb-1 z-0`} >
        {/* <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-xl font-semibold text-black ">일정관리</h4>          
        </div> */}
        <div className="flex flex-wrap w-100">

            <div className=" lg:w-1/3 md:w-full shadow-default">
                <div className=" border border-stroke rounded-lg border-gray-200 border-opacity-50 p-4 sm:flex-row flex-col">
                    <div className="flex-grow flex justifySpaceBetween itemEnd">
                        <div><img src={"/images/manage/shopBlue.svg"} alt="" /></div>
                        <p className="leading-relaxed text-base colorBlackBold">{tot}원</p>
                        <h2 className="text-gray-900 title-font font-medium mb-3 colorBlackBold">총 매출액</h2>
                    </div>
                    <div className='flex justifySpaceBetween mt-20'>
                        <div>
                            <div>건수</div>
                            <div>{saleCnt}</div>
                        </div>
                        <div>
                            <div>신용카드</div>
                            <div>{cardSale}</div>
                        </div>
                        <div>
                            <div>배달 매출</div>
                            <div>{deliverSale}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:w-1/3 md:w-full pdl-10 shadow-default">
            <div className=" border border-stroke rounded-lg border-gray-200 border-opacity-50 p-4 sm:flex-row flex-col">
                    <div className="flex-grow flex justifySpaceBetween itemEnd">
                        <div><img src={"/images/manage/shopOrange.svg"} alt="" /></div>
                        <p className="leading-relaxed text-base colorBlackBold">{doneTot}원</p>
                        <h2 className="text-gray-900 title-font font-medium mb-3 colorBlackBold">총 정산금액</h2>
                    </div>
                    <div className='flex justifySpaceBetween mt-20'>
                        <div>
                            <div>건수</div>
                            <div>{calculatedCnt}</div>
                        </div>
                        <div>
                            <div>신용카드</div>
                            <div>{cardCalculated}</div>
                        </div>
                        <div>
                            <div>배달 매출</div>
                            <div>{deliverCalculated}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:w-1/3 md:w-full pdl-10 shadow-default">
            <div className=" border border-stroke rounded-lg border-gray-200 border-opacity-50 p-4 sm:flex-row flex-col">
                    <div className="flex-grow flex justifySpaceBetween itemEnd">
                        <div><img src={"/images/manage/shopGray.svg"} alt="" /></div>
                        <p className="leading-relaxed text-base colorBlackBold">{userTot}원</p>
                        <h2 className="text-gray-900 title-font font-medium mb-3 colorBlackBold">총 지출액</h2>
                    </div>
                    <div className='flex justifySpaceBetween mt-20'>
                        <div>
                            <div>건수</div>
                            <div>{userCnt}</div>
                        </div>
                        <div>
                            <div>신용카드</div>
                            <div>{cardUser}</div>
                        </div>
                        <div>
                            <div>배달 매출</div>
                            <div>{deliverUser}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div>
          <div className="z-20 mb-1 flex flex-col mt-20" id='calender' >
          {/* <div style={{ margin:15, display:'grid',gridTemplateColumns:"2fr 1fr"}}> */}
            <FullCalendar
              ref={calendarRef}
              contentHeight={'30rem'}
              locale="kr"
              initialView="dayGridMonth"
              plugins={[dayGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: '',
                center: '',
                right: '',
              }}
              buttonText={{
                today: "오늘",
              }}
              dayMaxEventRows={true}
              views={{
                dayGrid: {
                  dayMaxEventRows: 3
                }
              }}
              // eventClick={handleDateClick} // 캘린더에 그려진 이벤트 클릭시 작동
              dateClick={(e) => {handleDateClick(e)}}
              editable={true}
            />
            {/* </div> */}
          </div>

        </div>
      </div>
      

        <Modal isOpen={isOpen} ariaHideApp={false} style={customStyles}>
          <div className="border-strokedark bg-white flex flex-col rounded-sm md:ml-auto w-full mt-8 md:mt-0 p-2">
            <div className='pd10'>
              <div className='flex center mt-20'>
                <h4 className='colorBlackBold'>지출내역 ({selectedDate})</h4>
                <h4 onClick={toggle} className='closeBtn colorBlackBold'>X</h4>
              </div>
              <div className='blackLine mt-10'></div>

              <div className='spendConWrap mt-20 pd10'>
                <div className='blackLine'></div>
                <div className='colorBlack mt-10'>고정 지출</div>
                <div className='grayLine mt-10'></div>
                <div>
                  <div className='' id='fixContain'>
                    
                    <div className='flex spend fix'>
                      <input type="text" name='EXPEN_NM' className='spendInput mt-10 mb-10' placeholder='지출명'/>
                      <input type="text" name="EXPEN_AMT" className='spendInput mt-10 mb-10 ml-10' placeholder='숫자만 입력 가능합니다.' />
                    </div>
                    {/* <div className='minusBtn'>-</div> */}
                  </div>
                  <div className='center'>
                    <div className='plusBtn fontWhite center pointer' onClick={plus} id='fix'>+</div>
                  </div>
                </div>
                

                <div className='grayLine mt-10'></div>

                <div className='colorBlack mt-10'>변동 지출</div>
                <div className='grayLine mt-10'></div>
                <div>
                  <div  id='changeContain'>
                    <div className='flex spend change'>
                      <input type="text" name='EXPEN_NM' className='spendInput mt-10 mb-10' placeholder='지출명'/>
                      <input type="text" name="EXPEN_AMT" className='spendInput mt-10 mb-10 ml-10' placeholder='숫자만 입력 가능합니다.' />
                    </div>
                    {/* <div className='minusBtn'>-</div> */}
                  </div>
                  <div className='center'>
                    <div className='plusBtn fontWhite center pointer' onClick={(e) => {plus(e)}} id='change'>+</div>
                  </div>
                </div>
                

                <div className='grayLine mt-10'></div>
              </div>

              <div className='center mt-20'>
                <div className='closeButton center pointer' onClick={toggle}>닫기</div>
                <div className='registerButton center ml-10 pointer' onClick={funcSave}>등록</div>
              </div>
            </div>
            
          </div>
        </Modal>

      
    </>

  )

  

}

export default Calendar;
