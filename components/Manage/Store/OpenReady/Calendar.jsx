'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Axios from "@/components/common/api/Axios";
import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';
import interactionPlugin, {DateClickArg} from "@fullcalendar/interaction";

import SelectCommonCode from '@/components/SelectBoxs/SelectCommonCode';
import TextArea from '@/components/Inputs/TextArea';
import cn from '@/components/common/util/ClassName';
import { uf_isNull, uf_formatChange } from '@/components/common/util/Util';
import '@/components//Manage/Store/OpenReady/Calendar.css';

const Calendar = (props) => {

  const today = new Date();
  const calendarRef = useRef(null);  
  const [ seq, setSeq ] = useState(props.seq);    // 매장 일련번호
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

      month.push(<option key={i} value={j}>{i}</option>);
    }
    return month;
  }

  // 상세 조회
  const fetchDataAxios = async() => {		
    const params = {"AD_STORE_INFO_SEQ": seq};
    params['SEARCH_YEAR'] = selYear;
    params['SEARCH_MONTH'] = selMonth;    
    try {
      const response = await Axios.post("/api/v1/open/schedule/list", params);      
			const { data } = response.data;      
			setList(data);
    } catch(error) {      
      return false;
    }
  }

  const funcSearch = () => {
    fetchDataAxios();
  }

  useEffect(() => {
    goToDate();
    fetchDataAxios();
  }, [selYear, selMonth]);
  

  const goToDate = () => {
    const inputDate = `${selYear}-${selMonth}-01`;
    if (!calendarRef.current) return;
    const api = calendarRef.current.getApi();
    api.gotoDate(inputDate);
  };

  // 셀렉트 박스 핸들러
  const handleSelect = (e) => {
		//setSelIndustryCd(e.target.value);
		if( e.target.name === 'SEARCH_YEAR' ) {
			setSelYear(e.target.value);
		} else if( e.target.name === 'SEARCH_MONTH' ) {
			setSelMonth(e.target.value);
		}
  };

  // 상세 데이터 적용 Start
  const [ inputs, setInputs ] = useState({
    AD_SCHEDULE_MNG_SEQ: '',
    AD_STORE_INFO_SEQ: seq,
    SCHEDULE_DT: '',
    WEEK_NM: '',
    MARK_GB: 'N',
    SCHEDULE_NM: 'A',
    SCHEDULE_CONTENTS: '',
  });  

  const func_change = (e) => {
    const { value, name } = e.target;
    let getWeek = '';
    if( name === 'SCHEDULE_DT' ) {
      getWeek = func_dayOfWeek(value);
      setInputs({
        ...inputs,
        [name]: value,
        ['WEEK_NM']: getWeek
      })
    } else {
      setInputs({
        ...inputs,
        [name]: value
      })
    }
  }

  const func_reset = () => {
    setInputs({
      SCHEDULE_DT: '',
      WEEK_NM: '',
      MARK_GB: 'N',
      SCHEDULE_NM: 'A',
      SCHEDULE_CONTENTS: '',
    })
  }    

  // 날짜 선택 시 등록 폼에 날짜와 요일 입력 시킴
  const func_dateSelect = (selectInfo) => {
    const selectRow = selectInfo;
    const getWeek = func_dayOfWeek(selectRow.dateStr);
    setInputs({...inputs, SCHEDULE_DT: selectRow.dateStr, WEEK_NM: getWeek});    
  }

  // func_dayOfWeek('2023-04-04') 의 형태로 사용
  function func_dayOfWeek(yyyyMMdd){	
    const dayOfWeek = new Date(yyyyMMdd).getDay(); 
    let changeWeek = '';
    switch (dayOfWeek) {
      case 0:
        changeWeek = '일'
        break;
      case 1:
        changeWeek = '월'
        break;
      case 2:
        changeWeek = '화'
        break;
      case 3:
        changeWeek = '수'
        break;
      case 4:
        changeWeek = '목'
        break;
      case 5:
        changeWeek = '금'
        break;
      case 6:
        changeWeek = '토'
        break;
    
      default:
        break;
    }
    //0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토
    return changeWeek + '요일';
  }

  // 저장
  const func_save = async() => {    
    const params = inputs;
    
    try {
      if( confirm('저장 하시겠습니까?') ) {
        await Axios.post("/api/v1/open/schedule/save", params);      
        alert("저장 되었습니다.");
        func_reset();
        fetchDataAxios();
      }
			
    } catch(error) {      
      return false;
    }

  }

  // const onDateClick = ({ date }) => {

  // };

  const func_eventClick = async(clickInfo) => {
    /**
     * 값 중 SEQ는 GUBUN에 따라 사용용도가 달라짐.
     * GUBUN = 'SCHEDULE' 일때 SEQ는 AD_SCHEDULE_MNG_SEQ
     * GUBUN = 'PROCESS' 일때 SEQ는 AD_OPEN_PROCESS_SEQ
     */
    const params = clickInfo.event._def.extendedProps;
    
    try {      
      if( params.GUBUN === 'SCHEDULE' ) {
        const response = await Axios.post("/api/v1/open/schedule/Details", params);
        const { data } = response.data;
        
        setInputs(data);
      } else {
        func_reset();
      }
			
    } catch(error) {      
      return false;
    }




    // /api/v1/open/schedule/Details
    //console.log("1111 : ", clickInfo.view);
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove()
    // }
  }

  // function handleEvents(events) {
  //   console.log("333333");
  //   //setCurrentEvents(events)
  // }

  return (
    <>
      <div className="col-span-12 rounded-sm border border-stroke bg-white shadow-default  xl:col-span-4 mt-4 mb-4">      
        <div className="flex flex-col gap-4 col-span-6 items-center py-2 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
          <div className="flex flex-1 items-center justify-between">
            <div id="storeDiv">
              <div className="flex w-full mt-2">
                <div className="flex items-center mb-2 ml-4 mr-6">
                  {/* <p className="mr-2 font-size font-medium">작업 연월</p> */}
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


      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
        {/* <div className="flex flex-col gap-4 col-span-12">
          <h4 className="text-xl font-semibold text-black ">일정관리</h4>          
        </div> */}
        <div className="flex flex-col gap-4 col-span-9">
          <div className="z-20 mb-1 flex flex-col">      
                <FullCalendar ref={calendarRef}
                  customButtons={{
                    myCustomButton: {
                        text: '등록',
                        click: function() {
                            alert('clicked the custom button!');
                        },
                    },
                  }}                  
                  contentHeight={'30rem'}
                  titleFormat={{
                    month: 'long',
                    year: 'numeric',
                    //day: 'numeric',
                    //weekday: 'long'
                  }}
                  // aspectRatio={1}
                  locale="ko"
                  initialView="dayGridMonth"
                  plugins={[dayGridPlugin, interactionPlugin]}
                  events={list}                  
                  //datesSet={onChangeDate}
                  //dateClick={onDateClick}
                  //eventContent={eventContent}                  
                  headerToolbar={{
                    left: '',
                    center: '',
                    right: '',
                    //center: 'title',
                    //right: 'myCustomButton',                      
                  }}
                  buttonText={{
                    // prev: "이전", 
                    // next: "다음",
                    // prevYear: "이전 년도",
                    // nextYear: "다음 년도",
                    today: "오늘",
                  }}
                  
                  dateClick={func_dateSelect} // 날짜 선택 시 이벤트 selectable이 true 여야함.
                  eventTextColor='black'  // 글자 색상
                  eventClick={func_eventClick}
                  dayMaxEventRows={true} // 하루에 표시 될 최대 이벤트 수 true = 셀의 높이
                  views={{
                    dayGrid: {
                      dayMaxEventRows: 3 // adjust to 6 only for timeGridWeek/timeGridDay                      
                    }
                  }}
                  //eventClick={eventClick} // 이벤트 클릭시
                  //eventChange={eventChange} // 이벤트 drop 혹은 resize 될 때
                  //editable={true} // 사용자의 수정 가능 여부 (이벤트 추가/수정, 드래그 앤 드롭 활성화)
                  //selectable={false} // 선택 가능 여부                  
                  
                  //selectMirror={true}
                  //select={func_dateSelect}
                  // select={function(info) {
                  //   alert('selected ' + info.startStr + ' to ' + info.endStr);
                  // }}
                  
                  //eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                  //weekends={true} // 주말 표시 여부
                  // weekNumbers={true}
                  // weekText="주차"
                  //gotoDate={new Date('2023-01-01')}
                  //navLinks={true} // 달력의 날짜 클릭시 일간 스케쥴로 이동
                  //navLinkHint={"클릭시 해당 날짜로 이동합니다."} // 날짜에 호버시 힌트 문구
                  // eventContent={fn(): node {} || true} // 일정 커스텀
                  // eventsSet={function () {
                  //   console.log("eventsSet");
                  // }} // 
                  // eventAdd={function () {
                  //   console.log("eventAdd");
                  // }} // 추가시 로직
                  // eventDrop={function () {
                  //   console.log("eventDrop");
                  // }} // 드롭시 로직
                  // eventRemove={function () {
                  //   console.log("eventRemove");
                  // }} // 제거시 로직
                  
                />
            {/* </div> */}
          </div>

        </div>
        <div className="flex flex-col gap-4 col-span-3">
          <div>
            <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center justify-end">
              <h4 className="font-size font-semibold text-black"></h4>
              <div className="flex gap-2">                  
                <div>
                  <span className="inline-flex items-center justify-center rounded-md bg-primary btn-size px-5 font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                    onClick={func_save}>등록</span>
                </div>
              </div>        
            </div>
          </div>
          <div id="scheduleDiv">              
            <div className='border border-t-graydark'></div>         

            <_Input label="작업일자" type="date" propertyName="SCHEDULE_DT" value={uf_formatChange('date',inputs.SCHEDULE_DT)} onChange={func_change} className="w-full" />            
            <_Input label="요일" type="text" propertyName="WEEK_NM" value={inputs.WEEK_NM} onChange={func_change} disabled={true}  className="w-full" />           

            <div className="relative mb-2">
              <div className='flex w-full mt-2 items-center'>
                <div className='w-24 flex'>
                  <label className="ml-3 mr-3 text-black font-size">일정표시</label>
                </div>
                <div className="relative shadow-sm">
                  {/* <input id="FRANCHISE_GB_1" type="radio" value="A" name="FRANCHISE_GB" onChange={funcChangeRadio1}                
                      checked={franchiseGb === '' ? true : franchiseGb === 'A' ? true : false}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /> */}
                  <input id="SCHDULE_MARK_Y" type="radio" value="Y" onChange={func_change} checked={uf_isNull(inputs.MARK_GB) === '' ? true : inputs.MARK_GB === 'Y' ? true : false} name="MARK_GB"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label htmlFor="SCHDULE_MARK_Y" className="mr-2 ms-2 font-size font-medium text-black-2 dark:text-gray-300">예</label>

                  <input id="SCHDULE_MARK_N" type="radio" value="N" onChange={func_change} checked={inputs.MARK_GB === 'N' ? true : false} name="MARK_GB"                
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label htmlFor="SCHDULE_MARK_N" className="mr-2 ms-2 font-size font-medium text-black-2 dark:text-gray-300">아니요</label>
                </div>
              </div> 
            </div>   
            <div className='border-t-[1px] border-t-stroke'></div> 

            <div className="relative mb-2">
              <div className='flex w-full mt-2 items-center'>
                <div className='w-24 flex'>
                  <label className="ml-3 mr-3 text-black font-size">일정명</label>
                </div>
                <div className="flex flex-1 relative shadow-sm">                  
                  <SelectCommonCode codeName="SCHEDULE_NM" propertyName="SCHEDULE_NM" selectValue={inputs.SCHEDULE_NM} onChange={func_change} className="w-full" />
                </div>
              </div> 
            </div>   
            <div className='border-t-[1px] border-t-stroke'></div> 

            <TextArea label="일정설명" propertyName="SCHEDULE_CONTENTS" value={inputs.SCHEDULE_CONTENTS} onChange={func_change} className="w-full h-36"  />
            

            <div className='border-t-[1px] border-t-stroke mt-2'></div>
            
            <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Calendar;


const _Input = ({label, type, propertyName, value, onChange, className, ...inputs}) => {
  return (
    <>
      <div className="relative mb-2">
        <div className='flex w-full mt-2 items-center'>
          <div className='w-24 flex'>
            <label className="ml-3 mr-3 text-black font-size">{label}</label>
          </div>
          <div className="flex flex-1 relative shadow-sm">
            <input 
              type={type}
              name={propertyName}
              className={cn("rounded border border-stroke bg-transparent px-3 py-2 font-size outline-none transition focus:border-primary active:border-primary", className)}
              value={value}
              onChange={onChange}
              {...inputs}
            />
          </div>
        </div> 
      </div>   
      <div className='border-t-[1px] border-t-stroke'></div> 
    </>
  )
}

