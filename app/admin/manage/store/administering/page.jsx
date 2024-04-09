'use client';
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { uf_formatChange, uf_makeParams, uf_isNull, uf_mandatoryFields, uf_numberFormat } from "@/components/common/util/Util";
import Axios from "@/components/common/api/Axios";
// const { kakao } = window;
//import UserInfo from "@/components/Manage/userInfo";


import CustomerMng from "@/components/Manage/customer";
import { StorePictureManager } from "./StorePictureManager";
import cn from "@/components/common/util/ClassName";
import InputOne from "@/components/Inputs/InputOne";
import InputArea from "@/components/Inputs/InputArea";
import DaumPostcode from "react-daum-postcode";
import Modal from "react-modal";
import Script from "next/script";
import Head from "next/head";

const Administering = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [ seq, setSeq ] = useState(searchParams.get('seq'));

	
	const [ industry, setIndustry ] = useState([]);
	const [ user, setUser] = useState({});
	const [ selIndustryCd, setSelIndustryCd ] = useState('');
	const [ selOperStatus, setSelOperStatus ] = useState('');
	const [ selFranchise, setSelFranchise ] = useState('');

	const [ deposit, setDeposit ] = useState(0);
	const [ premium, setPremium ] = useState(0);
	const [ monthRent, setMonthRent ] = useState(0);
	const [ maintCost, setMaintCost ] = useState(0);

	const [ totalInvestCost, setTotalInvestCost ] = useState(0);
	const [ investAssets, setInvestAssets ] = useState(0);
	const [ investBoss, setInvestBoss ] = useState(0);
	const [ rantal, setRantal ] = useState(0);

	const [frHqDeposit, setFrHqDeposit] = useState(0);
	const [memberCost, setMemberCost] = useState(0);
	const [eduCost, setEduCost] = useState(0);
	const [interiorCost, setInteriorCost] = useState(0);


  const storePictureRef = useRef(null);

	// 코드 조회
	const fetchCodeDataAxios = async() => {
    const params = {};     

    try {
      const response = await Axios.post("/api/v1/industry/code/list", params);
			console.log("==== : ", response);
      setIndustry(response.data.data);	
    } catch(error) {      
      return false;
    }
  }

  useEffect(() => {
    fetchCodeDataAxios();
  }, [seq])

	// 상세 조회
  const fetchUserDataAxios = async() => {		
    const params = {"AD_STORE_INFO_SEQ": seq};     

    try {
      const response = await Axios.post("/api/v1/store/user/details", params);      
			const { ACTUAL_AREA_M, ACTUAL_AREA_P, DEPOSIT, PREMIUM
						, MONTH_RENT, MAINT_COST, TOTAL_INVEST_COST
						, INVEST_ASSETS, INVEST_BOSS, RANTAL
					  , FR_HQ_DEPOSIT, MEMBER_COST, EDU_COST, INTERIOR_COST} = response.data.data;
			
      setUser(response.data.data);
	  console.log(response.data.data)				
			// 업종코드
			setSelIndustryCd(response.data.data.INDUSTRY_CD);
			// 유형
			setSelOperStatus(response.data.data.OPER_STATUS);
			// 가맹구분
			setSelFranchise(response.data.data.FRANCHISE_GB);

			setActualAreaM(ACTUAL_AREA_M);
			setActualAreaP(ACTUAL_AREA_P);


			setDeposit(uf_numberFormat(`${DEPOSIT}`, true, true, true));
      setPremium(uf_numberFormat(`${PREMIUM}`, true, true, true));
      setMonthRent(uf_numberFormat(`${MONTH_RENT}`, true, true, true));
      setMaintCost(uf_numberFormat(`${MAINT_COST}`, true, true, true));

			setTotalInvestCost(uf_numberFormat(`${TOTAL_INVEST_COST}`, true, true, true));
      setInvestAssets(uf_numberFormat(`${INVEST_ASSETS}`, true, true, true));
      setInvestBoss(uf_numberFormat(`${INVEST_BOSS}`, true, true, true));
      setRantal(uf_numberFormat(`${RANTAL}`, true, true, true));			
			
			setFrHqDeposit(uf_numberFormat(`${FR_HQ_DEPOSIT}`, true, true, true));
			setMemberCost(uf_numberFormat(`${MEMBER_COST}`, true, true, true));
			setEduCost(uf_numberFormat(`${EDU_COST}`, true, true, true));
			setInteriorCost(uf_numberFormat(`${INTERIOR_COST}`, true, true, true));

    } catch(error) {      
      return false;
    }
  }

  useEffect(() => {
    fetchUserDataAxios();
  }, [seq])  

		// 투자정보 합계
		const totalSum = useMemo(()=>{
			let hap = Number(uf_numberFormat(`${deposit}`,true, false, false)) 
								+ Number(uf_numberFormat(`${premium}`,true, false, false)) 
								+ Number(uf_numberFormat(`${monthRent}`,true, false, false)) 
								+ Number(uf_numberFormat(`${maintCost}`,true, false, false));			
			return uf_numberFormat(`${hap}`,true, true, true);
		},[deposit, premium, monthRent, maintCost]);
	
		const totalSum2 = useMemo(()=>{
			let hap = Number(uf_numberFormat(`${totalInvestCost}`,true, false, false)) 
								+ Number(uf_numberFormat(`${investAssets}`,true, false, false)) 
								+ Number(uf_numberFormat(`${investBoss}`,true, false, false)) 
								+ Number(uf_numberFormat(`${rantal}`,true, false, false));
			return uf_numberFormat(`${hap}`,true, true, true);
		},[totalInvestCost, investAssets, investBoss, rantal]);

	// 수정 저장
	const funcSave = async function() {
		
		let inputs = storeInfo.getElementsByTagName('*');
		let params = uf_makeParams(inputs);				

		params['OPER_STATUS'] = "";	// 빈걸로 보냄
		if( !uf_isNull(seq) ) {
			params['AD_STORE_INFO_SEQ'] = seq; 
			params['STATUS'] = 'U';		
		} else {
			params['STATUS'] = 'I';		
		}

		

		// 필수 항목
		const fieldList = [ 'NO_BIZ', 'BOSS_HP', 'ACTUAL_AREA_M', 'MONTH_RENT' ];
	
		if( !uf_mandatoryFields(params, fieldList) ) {
			alert('필수 입력항목을 확인해 주세요.');
			return;
		}    
		
		try {
			if( confirm("저장 하시겠습니까?") ) {			
				const response = await Axios.post("/api/v1/store/save", params);
				
				const { code, AD_STORE_INFO_SEQ } = response.data;
				
				//매장 사진 저장
				await storePictureRef.current?.save(AD_STORE_INFO_SEQ);

				if(!seq) setSeq(AD_STORE_INFO_SEQ);
				
				alert("저장 되었습니다.");
				setSeq(AD_STORE_INFO_SEQ);
				router.push( `/admin/manage/store/administering?seq=${AD_STORE_INFO_SEQ}`, {shallow: true} );
				fetchUserDataAxios();
			}
    } catch(error) {     			
			alert(error.response.data.message);
      return false;
    }
	}	

	// 셀렉트 박스 핸들러
  const handleSelect = (e) => {
		//setSelIndustryCd(e.target.value);
		if( e.target.name === 'INDUSTRY_CD' ) {
			setSelIndustryCd(e.target.value);
		} else if( e.target.name === 'OPER_STATUS' ) {
			setSelOperStatus(e.target.value);
		} else if( e.target.name === 'FRANCHISE_GB' ) {
			setSelFranchise(e.target.value);
		}
  };
	

	// 숫자만 입력 가능
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
			case 'TOTAL_INVEST_COST':        
				setTotalInvestCost(num);
				break;
			case 'INVEST_ASSETS':        
				setInvestAssets(num);
				break;
			case 'INVEST_BOSS':        
				setInvestBoss(num);
				break;
			case 'RANTAL':        
				setRantal(num);
				break;
			case 'FR_HQ_DEPOSIT':        
				setFrHqDeposit(num);
				break;
			case 'MEMBER_COST':        
				setMemberCost(num);
				break;
			case 'EDU_COST':        
				setEduCost(num);
				break;
			case 'INTERIOR_COST':        
				setInteriorCost(num);
				break;
			default:
				break;
		}
	}

	const [ actualAreaM, setActualAreaM ] = useState(0);
	const [ actualAreaP, setActualAreaP ] = useState(0);

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

	

	// 주소
	const [zipCode, setZipcode] = useState("");
    const [roadAddress, setRoadAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");    // 추가
    const [isOpen, setIsOpen] = useState(false); //추가

	// Modal 스타일
    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        content: {
            left: "0",
            margin: "auto",
            width: "500px",
            height: "430px",
            padding: "0",
            overflow: "hidden",
        },
    };

    // 매장등록 
    const toggle = () =>{
        setIsOpen(!isOpen);
    }

    const completeHandler = (data) =>{
        setZipcode(data.zonecode);
        setRoadAddress(data.roadAddress);
        setIsOpen(false); //추가
		addrUpdate(data.roadAddress);
    }

	// 주소 저장 
	const addrUpdate = async (roadAddress) => {
		let list = {"AD_STORE_INFO_SEQ": seq, "STORE_ADDR" : roadAddress}
		const response = await Axios.post("/api/v1/store/addr/save", list);
		if(response.data.code == 200){
			location.reload();
		}
	}
    

	// 카카오 지도 
	const onLoadKakaoAPI = async () => {
		const params = {"AD_STORE_INFO_SEQ": seq};     

      	const response = await Axios.post("/api/v1/store/user/details", params);
		let user = response.data.data;
	  	window.kakao.maps.load(() => {
		var container = document.getElementById('kakaoMap')
		var options = {
		  center: new window.kakao.maps.LatLng(33.450701, 126.570667),
		  level: 3,
		}
  
		var map = new window.kakao.maps.Map(container, options)
		var geocoder = new kakao.maps.services.Geocoder();
		geocoder.addressSearch(user.STORE_ADDR, function(result, status) {
			if (status === kakao.maps.services.Status.OK) {
				// 주소 등록 숨기기 
				document.querySelectorAll(".locationRegi").forEach(box => box.style.display = 'none');

				var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
		
				var marker = new kakao.maps.Marker({
					map: map,
					position: coords
			});
	
			var infowindow = new kakao.maps.InfoWindow({
				content: `<div style="width:150px;text-align:center;padding:6px 0;">${user.STORE_NM}</div>`
			});
			infowindow.open(map, marker);
	
			map.setCenter(coords);
			}else{
				document.querySelectorAll("#kakaoMap").forEach(box => box.style.display = 'none');
			}
		});
	  })
	}
	
  	return (
		<>	
			<Script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=05f52fd09df9a953e27c47de5acc5108&libraries=services&autoload=false" onError={(e)=>{console.error('error', e)}} onLoad={onLoadKakaoAPI}/>    		

			<link href="https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap" rel="stylesheet"></link>
			
			{/* <UserInfo data={user} parentFunc={parentFunc} onSave={(strStroeNm)=>{
        
				console.log("뭔 데이터? : ", strStroeNm);
				funcSave();
			}}/> */}
			{/* <UserInfo data={user} onSave={ (strStoreNm, strStoreAddr) => {
				funcSave(strStoreNm, strStoreAddr);
			}}/> */}
			
			<div>
				<div>
					<div id="storeInfo">
						<div className="col-span-12 rounded-sm border border-stroke bg-white shadow-default xl:col-span-4 mt-4 mb-4">
							<div className="flex items-center gap-5 py-2 px-7.5 hover:bg-gray-3">
								<div className="flex flex-1 items-center justify-between">
									<div id="storeDiv">
										<div className="flex w-full mt-2">
											<div className="flex items-center mb-2 ml-4 mr-6">
												<p className="mr-2 font-size font-medium">브랜드명</p>
											</div>
											<div className="flex items-center mb-2">
												<input
													type="text"
													id="STORE_NM"
													name="STORE_NM"
													defaultValue={user.STORE_NM}
													placeholder="브랜드명을 입력해주세요."
													className="w-100 border-[1px] border-stroke bg-transparent py-2 px-2 font-size  font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
													//onBlur={blurHandler}
												/>
											</div>      
										</div>
										<div className="flex w-full flex-wrap mb-2 ml-4 font-size baseLine">
											<div className="mr-4">매장주소</div>
											<div id="STORE_ADDR" className="ml-4">{user.STORE_ADDR}</div>
											{user.STORE_ADDR_DETAIL === null 
												? <input type="text" id="STORE_ADDR_DETAIL" name ="STORE_ADDR_DETAIL" placeholder="상세 주소를 입력해 주세요." className="ml-4 border-[1px] border-stroke bg-transparent py-2 px-2 font-size  font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"/> 
												: <div className="ml-4">{user.STORE_ADDR_DETAIL}</div>
											}
											<div className="ml-4 addrChange" onClick={toggle}>매장 위치 변경</div>
										</div>
									</div>

									<div className="flex h-6 items-center justify-center rounded-full">              
										<span className="inline-flex rounded-md items-center justify-center bg-primary px-5 py-3 text-sm font-small text-white hover:bg-opacity-90 cursor-pointer" 
											onClick={() => { funcSave(); }}>저장
										</span>
									</div>

								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
							<div className="flex flex-col gap-4 col-span-6">
								{/* <!-- Input Fields --> */}
								<div className="rounded-sm border border-stroke bg-white shadow-default">
									<div className="border-b border-stroke py-2 px-2">
										<h3 className="font-medium text-black">
											매장 기본정보
										</h3>
									</div>
									<div className="flex flex-col p-6.5">

										<div className='flex w-full mt-2'>
											<div className='w-24 flex items-center mb-2'>
												<label className="mr-3 text-black font-size">매장업종 <span className="font-bold text-meta-1">*</span></label>
											</div>
											<div className="relative shadow-sm">                      
												<select name="INDUSTRY_CD" onChange={handleSelect} value={selIndustryCd} className='w-32 relative z-20 border border-stroke bg-transparent py-2 px-3 font-size outline-none transition focus:border-primary active:border-primary'>
													{
														industry.map((code, index) => {											
														return (
															<option key={index} value={code.VALUE}>{code.NAME}</option>
														);
													})}										
												</select>

												{/* <select name="OPER_STATUS" onChange={handleSelect} value={selOperStatus} className='w-32 ml-1 relative z-20 border border-stroke bg-transparent py-2 px-3 font-size outline-none transition focus:border-primary active:border-primary'>
													<option value="A">신규</option>
													<option value="B">운영중</option>
													<option value="C">매출관리필요</option>
													<option value="D">폐업</option>
												</select> */}

												<select name="FRANCHISE_GB" onChange={handleSelect} value={selFranchise} className='w-32 ml-1 relative z-20 border border-stroke bg-transparent py-2 px-3 font-size outline-none transition focus:border-primary active:border-primary'>
													<option value="A">가맹점</option>
													<option value="B">직영점</option>			
												</select>						
											</div>
										</div>

										<div className='flex w-full mt-2'>
											<div className='w-24 flex items-center mb-2'>
												<label className="mr-3 text-black font-size">사업자번호 <span className="font-bold text-meta-1">*</span></label>
											</div>
											<div className="relative shadow-sm">
												<input
													type="text"
													name="NO_BIZ"
													defaultValue={uf_formatChange('nobiz', user.NO_BIZ)}
													className="border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"
													placeholder="000000000"
												/>
											</div>
											
											<div className='w-24 ml-4 flex items-center mb-2'>
												<label className="mr-3 align-middle text-black font-size">점주명</label>
											</div>
											<div className="relative shadow-sm">
												<input
													type="text"
													name="BOSS_NM"
													defaultValue={user.BOSS_NM}
													className="border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"													
												/>
											</div>
											
										</div>
										<div className='flex w-full mt-2'>
											<div className='w-24 flex items-center mb-2'>
												<label className="mr-3 text-black font-size">연락처 <span className="font-bold text-meta-1">*</span></label>
											</div>
											<div className="relative shadow-sm">
												<input
													type="text"
													name="BOSS_HP"
													defaultValue={uf_formatChange('tel', user.BOSS_HP)}
													className="border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"													
												/>
											</div>
										</div>
										
										<div className='flex w-full mt-2'>
											<div className='w-24 flex items-center mb-2'>
												<label className="mr-3 text-black font-size">개업일</label>
											</div>
											<div className="relative shadow-sm">
												<input
													type="text"
													name="OPEN_DT"
													defaultValue={uf_formatChange('date', user.OPEN_DT)}
													className="border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"													
												/>
											</div>

											<div className='w-24 ml-4 flex items-center mb-2'>
												<label className="mr-3 text-black font-size">폐업일</label>
											</div>
											<div className="relative shadow-sm">
												<input
													type="text"
													name="CLOSE_DT"
													defaultValue={uf_formatChange('date', user.CLOSE_DT)}
													className="border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"													
												/>
											</div>
										</div>

										<div className='flex w-full mt-2'>
											<div className='w-24 flex items-center mb-2'>
												<label className="mr-3 text-black font-size">매장주소</label>
											</div>
											<div className="relative shadow-sm">
												<input
													type="text"
													name="STORE_ADDR"
													defaultValue={user.STORE_ADDR}
													className="w-[28rem] border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"													

												/>
											</div>
										</div>										

										<div className='flex w-full mt-2'>
											<div className='w-24 flex items-center mb-2'>
												<label className="mr-3 text-black font-size">상권명</label>
											</div>
											<div className="relative shadow-sm">
												<input
													type="text"
													name="AREA_NM"
													defaultValue={user.AREA_NM}
													className="border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"													
												/>											
											</div>

											<div className='w-24 ml-4 flex items-center mb-2'>
												<label className="mr-3 text-black font-size">상권교통</label>
											</div>
											<div className="relative shadow-sm">
												<input
													type="text"
													name="AREA_TRANSPORT"
													defaultValue={user.AREA_TRANSPORT}
													className="border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"													
												/>
											</div>

										</div>

										<InputArea label='실면적' propertyName='ACTUAL_AREA_M' value={actualAreaM} onChange={func_calculator} propertyName2='ACTUAL_AREA_P' value2={actualAreaP} />

										<div className='flex w-full mt-2'>
											<div className='w-24 flex items-center mb-2'>
												<label className="mr-3 text-black font-size">화재보험</label>
											</div>
											<div className="relative shadow-sm">
												<input
													type="text"
													name="FIRE_INSURANCE"
													defaultValue={user.FIRE_INSURANCE}
													className="border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"													
												/>
											</div>

											<div className='w-24 ml-4 flex items-center mb-2'>
												<label className="mr-3 text-black font-size">음식물<br />배상책임보험</label>
											</div>
											<div className="relative shadow-sm">
												<input
													type="text"
													name="LIABILITY_INSURANCE"
													defaultValue={user.LIABILITY_INSURANCE}
													className="border-[1px] border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"													
												/>
											</div>
										</div>


										<div className='flex w-full mt-2'>
											<div className='w-24 flex items-center mb-2'>
												<label className="mr-3 text-black font-size">메모</label>
											</div>
											<div className="relative shadow-sm">
												<textarea													
													name="STORE_MENO"
													defaultValue={user.STORE_MEMO}
													className="w-[28rem] h-[7.56rem] border-[1px] border-stroke bg-transparent py-3 px-5 font-size font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
												></textarea>
											</div>
										</div>										
									</div>
								</div>								
							</div>

							<div className="flex flex-col gap-4 col-span-6">
								<div className="rounded-sm border border-stroke bg-white shadow-default">									
									<div className="border-b border-stroke py-2 px-2">
										<h3 className="font-medium text-black">
											매장 투자정보
										</h3>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-12">
										<div className="flex flex-col p-5 col-span-6">	
											<InputOne  label='보증금' propertyName='DEPOSIT' onChange={funcNumFormat} value={deposit} className="w-52 text-right mb-2"/>
											<InputOne  label='권리금' propertyName='PREMIUM' onChange={funcNumFormat} value={premium} className="w-52 text-right mb-2"/>
											<InputOne  label='월임대료' propertyName='MONTH_RENT' onChange={funcNumFormat} value={monthRent} required={true} className="w-52 text-right mb-2"/>
											<InputOne  label='관리비' propertyName='MAINT_COST' onChange={funcNumFormat} value={maintCost} className="w-52 text-right mb-2"/>
											<InputOne  label='합계' propertyName='STORE_SUM_COST' onChange={funcNumFormat} value={totalSum} disabled className="w-52 text-right mb-2"/>
										</div>
										<div className="flex flex-col p-5 col-span-6">
											<_InputOne2  label='총투자비용' propertyName='TOTAL_INVEST_COST' value={totalInvestCost} onChange={funcNumFormat} propertyName2="TOTAL_INVEST_COST_RATE" value2={user.TOTAL_INVEST_COST_RATE}/>
											<_InputOne2  label='대안투자자산' propertyName='INVEST_ASSETS' value={investAssets} onChange={funcNumFormat} propertyName2="INVEST_ASSETS_RATE" value2={user.INVEST_ASSETS_RATE}/>
											<_InputOne2  label='점주' propertyName='INVEST_BOSS' value={investBoss} onChange={funcNumFormat} propertyName2="INVEST_BOSS_RATE" value2={user.INVEST_BOSS_RATE}/>
											<_InputOne2  label='렌탈' propertyName='RANTAL' value={rantal} onChange={funcNumFormat} propertyName2="RANTAL_RATE" value2={user.RANTAL_RATE}/>
											<_InputOne2  label='합계' propertyName='INVEST_SUM_COST' value={totalSum2} onChange={funcNumFormat} propertyName2="INVEST_SUM_COST_RATE" value2={user.INVEST_SUM_COST_RATE} disabled/>
										</div>
									</div>
								</div>			

								<div className="rounded-sm border border-stroke bg-white shadow-default">
									<div className="border-b border-stroke py-2 px-2">
										<h3 className="font-medium text-black">
											프랜차이즈
										</h3>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-12 pb-[0.14rem]">
										<div className="flex flex-col col-span-5">
											<div className="bg-white">									
												<div className="flex flex-col p-6.5">
													<InputOne  label='본사보증금' propertyName='FR_HQ_DEPOSIT' value={frHqDeposit} onChange={funcNumFormat} className="w-32 text-right mb-2"/>
													<InputOne  label='가맹비' propertyName='MEMBER_COST' value={memberCost} onChange={funcNumFormat} className="w-32 text-right mb-2"/>
													<InputOne  label='교육비' propertyName='EDU_COST' value={eduCost} onChange={funcNumFormat} className="w-32 text-right mb-2"/>
													<InputOne  label='인테리어비용' propertyName='INTERIOR_COST' value={interiorCost} onChange={funcNumFormat} className="w-32 text-right mb-2"/>
												</div>
											</div>
										</div>										

										<div className="flex flex-col col-span-7 pt-6.5">
											<div className="bg-white">
												<textarea													
													name="INVEST_MENO"
													defaultValue={user.INVEST_MENO}
													className="w-90 h-[9.9rem] border-[1px] border-stroke bg-transparent py-3 px-5 font-size font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
												></textarea>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className="storeLocation">
							<div className="d-flex">
                				<StorePictureManager ref={storePictureRef} className="locationDetail mr-15 max-h-[348px]" seq={seq}/>	
								<div className="locationDetail">
									<div>매장위치<span>*</span></div>
									<div className="locationRegi ">
										<div className="locationRegiBtnWrap ">
											<div className="d-flex locRegiBtn">
												<img src={"/images/manage/Map_light.svg"} className="regiLocImg" />
												<div onClick={toggle}>매장 주소 검색</div>
												<Modal isOpen={isOpen} ariaHideApp={false} style={customStyles}>
													<div id="modalClose" className="close" onClick={toggle}>X</div>
													<DaumPostcode onComplete={completeHandler} height="100%" />
												</Modal>
												<input type="hidden" value={zipCode} readOnly placeholder="우편번호" />
												<input type="hidden" value={roadAddress} readOnly placeholder="도로명 주소" />
											</div>
										</div>
									</div>
									<div id="kakaoMap">``</div>
								</div>							
							</div>
						</div>

						<CustomerMng seq={seq} />	

					</div>

					{/* <div>
						<input value={zipCode} readOnly placeholder="우편번호" />
						<button onClick={toggle}>우편번호 검색</button>
						<br />
						<input value={roadAddress} readOnly placeholder="도로명 주소" />
						<br />
						
						<input type="text" onChange={changeHandler} value={detailAddress} placeholder="상세주소"/>
						<br />
						<button onClick={clickHandler}>클릭</button>
					</div> */}
				</div>
			</div>
    </>
  );
};

export default Administering;

const _InputOne2 = ({className, label, propertyName, value, onChange, propertyName2, value2, onChange2, disabled, disabled2 }) => {
	return (	
		<div className='flex w-full mb-2'>
			<div className='w-24 flex items-center mb-2'>
				<label className="mr-3 text-black font-size">{label}</label>
			</div>
			<div className="flex flex-1 relative shadow-sm">
				<input
					type="text"
					name={propertyName}
					value={value}
					disabled={disabled}
					onChange={onChange}			
					className="w-32 border-[1px] text-right pr-9 border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"
				/>
				<div className="absolute inset-y-0 right-2 flex items-center font-size">만원</div>
			</div>
			<div className="flex flex-1 relative shadow-sm ml-1">
				<input
					type="text"
					name={propertyName2}
					disabled={disabled2}
					defaultValue={value2}
					className="w-16 border-[1px] text-right pr-6 border-stroke bg-transparent py-2 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size"
				/>
				<div className="absolute inset-y-0 right-2 flex items-center font-size">%</div>
			</div>
		</div>
	)			
}