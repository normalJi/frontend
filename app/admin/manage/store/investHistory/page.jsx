'use client';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Axios from "@/components/common/api/Axios";
import { uf_formatChange } from "@/components/common/util/Util";
import UserInfo from "@/components/Manage/userInfo";

const InvestHistory = () => {
  const searchParams = useSearchParams();
  useEffect(() => {
    setSeq(searchParams.get('seq'));
  }, [searchParams]);

  const [seq, setSeq] = useState('');
  const [history, setData] = useState([]);
  const [user, setUser] = useState({});
  const [error, setError] = useState('');

  // 데이터 조회
  const fetchDataAxios = async () => {
    const params = {"AD_STORE_INFO_SEQ": seq};
    try {
      const response = await Axios.post("/api/v1/invest/history/list", params);      
      setData(response.data.data);
    } catch (error) {
      setError('데이터를 불러오는 도중 오류가 발생했습니다.');
    }
  };

  // 유저정보 조회
  const fetchUserDataAxios = async () => {
    const params = {"AD_STORE_INFO_SEQ": seq};
    try {
      const response = await Axios.post("/api/v1/store/user/details", params);      
      setUser(response.data.data);
    } catch (error) {
      setError('유저 데이터를 불러오는 도중 오류가 발생했습니다.');
    }
  };

  // seq가 변경될 때만 작동할 수 있도록 의존도를 부여해주기
  useEffect(() => {
    // seq가 비어있으면 작동X
    if(!seq) return;
    fetchDataAxios();
    fetchUserDataAxios();
  }, [seq]);

  // 수정 저장
  const funcSave = async function() {
    try {
      const updateList = history.map((item) => {
        const listWrapElement = document.getElementById(`listWrap_${item.AD_INVEST_HISTORY_SEQ}`);
        const inputs = listWrapElement.querySelectorAll('.invInput');
  
        const inputInfo = Array.from(inputs).reduce((acc, inputElement) => {
          let name = inputElement.getAttribute('name');
          let value = inputElement.value;
          if (name !== 'MENO_1' && name !== 'MENO_2' && value === '') { value = 0; }
          acc[name] = value;
          return acc;
        }, {});
  
        return {
          AD_INVEST_HISTORY_SEQ: item.AD_INVEST_HISTORY_SEQ,
          ...inputInfo,
        };
      });
  
      await Axios.post("/api/v1/invest/history/save", { list: updateList, STATUS: "U" });
  
    } catch(error) {
      console.error("업데이트 중 에러 발생:", error);
    }
  }
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newData = [...data];
    newData[index] = { ...newData[index], [name]: value };
    setData(newData);
  };
  let sum = false;

  // 계산 해주기
  const valueChange = (e) => {
    let className = e.target.className;
    let select = e.target.value;
    let another = 0;
    let tot = 0;
    let plan = 0;
    let sum = 0;
    // 공급가액 변경시
    if(className.split(' ')[1] === 'supply'){
      another = e.target.nextElementSibling.value;
      tot = Number(select) + Number(another);
      e.target.nextElementSibling.nextElementSibling.value = tot;
      plan = Number(e.target.previousElementSibling.value);
      e.target.nextElementSibling.nextElementSibling.nextElementSibling.value = tot - plan;

      // 합계 
      // 1. 본인 카테고리 확인 
      let parentNode = e.target.parentNode.parentNode;
      let myCate = parentNode.querySelector('input').value;
      let name = e.target.name;
       
      let cnt = parentNode.parentNode.children;

      // 2. 같은 카테고리 같은 name 전부 더하기 3. 합계에 넣기 4. 총 투입금액 에 전체 합계들 다 더해서 넣기
      for(let i = 0; i < cnt.length; i++){
        let fCate = cnt[i].querySelector('input').value;
        if(fCate === myCate){
          // 합계인지 체크 
          let sumValueName = cnt[i].lastElementChild.querySelector(`input[name = "name"]`).value;
          if(sumValueName != `${myCate} 계`){
            sum += Number(cnt[i].lastElementChild.querySelector(`input[name = "${name}"]`).value);
          }

          // sum을 카테고리 + 계 한 곳에 값으로 넣기
          if(sumValueName === `${myCate} 계`){
            cnt[i].lastElementChild.querySelector(`input[name = "${name}"]`).value = sum;
          }
        }
      }
      // 합계(B) 계 구하기 
      sum = 0;
      for(let i = 0; i < cnt.length; i++){
        let fCate = cnt[i].querySelector('input').value;
        if(fCate === myCate){
          let sumValueName = cnt[i].lastElementChild.querySelector(`input[name = "name"]`).value;
          if(sumValueName != `${myCate} 계`){
            sum += Number(cnt[i].lastElementChild.querySelector(`input[name = "TOTAL_COST"]`).value);
          }
          // sum을 카테고리 + 계 한 곳에 값으로 넣기
          if(sumValueName === `${myCate} 계`){
            cnt[i].lastElementChild.querySelector(`input[name = "TOTAL_COST"]`).value = sum;
          }
        }
      }
      // 차액 구하기 
      sum = 0;
      for(let i = 0; i < cnt.length; i++){
        let fCate = cnt[i].querySelector('input').value;
        if(fCate === myCate){
          let sumValueName = cnt[i].lastElementChild.querySelector(`input[name = "name"]`).value;
          if(sumValueName != `${myCate} 계`){
            sum += Number(cnt[i].lastElementChild.querySelector(`input[name = "DIFF_COST"]`).value);
          }
          // sum을 카테고리 + 계 한 곳에 값으로 넣기
          if(sumValueName === `${myCate} 계`){
            cnt[i].lastElementChild.querySelector(`input[name = "DIFF_COST"]`).value = sum;
          }
        }
      }
    }
    // 세액 변경시
    if(className.split(' ')[1] === 'tax'){
      another = e.target.previousElementSibling.value;
      tot = Number(select) + Number(another);
      e.target.nextElementSibling.value = tot;
      plan = e.target.previousElementSibling.previousElementSibling.value;
      e.target.nextElementSibling.nextElementSibling.value = tot - plan;

      // 합계 
      // 1. 본인 카테고리 확인 
      let parentNode = e.target.parentNode.parentNode;
      let myCate = parentNode.querySelector('input').value;
      let name = e.target.name;
       
      let cnt = parentNode.parentNode.children;

      // 2. 같은 카테고리 같은 name 전부 더하기 3. 합계에 넣기 4. 총 투입금액 에 전체 합계들 다 더해서 넣기
      for(let i = 0; i < cnt.length; i++){
        let fCate = cnt[i].querySelector('input').value;
        if(fCate === myCate){
          // 합계인지 체크 
          let sumValueName = cnt[i].lastElementChild.querySelector(`input[name = "name"]`).value;
          if(sumValueName != `${myCate} 계`){
            sum += Number(cnt[i].lastElementChild.querySelector(`input[name = "${name}"]`).value);
          }

          // sum을 카테고리 + 계 한 곳에 값으로 넣기
          if(sumValueName === `${myCate} 계`){
            cnt[i].lastElementChild.querySelector(`input[name = "${name}"]`).value = sum;
          }
        }
      }
      // 합계(B) 계 구하기 
      sum = 0;
      for(let i = 0; i < cnt.length; i++){
        let fCate = cnt[i].querySelector('input').value;
        if(fCate === myCate){
          let sumValueName = cnt[i].lastElementChild.querySelector(`input[name = "name"]`).value;
          if(sumValueName != `${myCate} 계`){
            sum += Number(cnt[i].lastElementChild.querySelector(`input[name = "TOTAL_COST"]`).value);
          }
          // sum을 카테고리 + 계 한 곳에 값으로 넣기
          if(sumValueName === `${myCate} 계`){
            cnt[i].lastElementChild.querySelector(`input[name = "TOTAL_COST"]`).value = sum;
          }
        }
      }
      // 차액 구하기 
      sum = 0;
      for(let i = 0; i < cnt.length; i++){
        let fCate = cnt[i].querySelector('input').value;
        if(fCate === myCate){
          let sumValueName = cnt[i].lastElementChild.querySelector(`input[name = "name"]`).value;
          if(sumValueName != `${myCate} 계`){
            sum += Number(cnt[i].lastElementChild.querySelector(`input[name = "DIFF_COST"]`).value);
          }
          // sum을 카테고리 + 계 한 곳에 값으로 넣기
          if(sumValueName === `${myCate} 계`){
            cnt[i].lastElementChild.querySelector(`input[name = "DIFF_COST"]`).value = sum;
          }
        }
      }
    }
    // 계획 (A) 변경시
    if(className.split(' ')[1] === 'plan'){
      another = e.target.nextElementSibling.nextElementSibling.nextElementSibling.value;
      e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value = Number(another) - Number(select)

      // 합계 
      // 1. 본인 카테고리 확인 
      let parentNode = e.target.parentNode.parentNode;
      let myCate = parentNode.querySelector('input').value;
      let name = e.target.name;
       
      let cnt = parentNode.parentNode.children;
      // 2. 같은 카테고리 같은 name 전부 더하기 3. 합계에 넣기 4. 총 투입금액 에 전체 합계들 다 더해서 넣기
      for(let i = 0; i < cnt.length; i++){
        let fCate = cnt[i].querySelector('input').value;
        if(fCate === myCate){
          // 계인지 체크 
          let sumValueName = cnt[i].lastElementChild.querySelector(`input[name = "name"]`).value;
          if(sumValueName != `${myCate} 계`){
            sum += Number(cnt[i].lastElementChild.querySelector(`input[name = "${name}"]`).value);
          }

          // sum을 카테고리 + 계 한 곳에 값으로 넣기
          if(sumValueName === `${myCate} 계`){
            cnt[i].lastElementChild.querySelector(`input[name = "${name}"]`).value = sum;
          }
        }
      }

      // 차액 구하기 
      sum = 0;
      for(let i = 0; i < cnt.length; i++){
        let fCate = cnt[i].querySelector('input').value;
        if(fCate === myCate){
          let sumValueName = cnt[i].lastElementChild.querySelector(`input[name = "name"]`).value;
          if(sumValueName != `${myCate} 계`){
            sum += Number(cnt[i].lastElementChild.querySelector(`input[name = "DIFF_COST"]`).value);
          }
          // sum을 카테고리 + 계 한 곳에 값으로 넣기
          if(sumValueName === `${myCate} 계`){
            cnt[i].lastElementChild.querySelector(`input[name = "DIFF_COST"]`).value = sum;
          }
        }
      }
    }
    // 총 투입금액 계산하기
    allMoney();
  }

  // 총 투입금액 계산하기
  const allMoney = () => {
    // 클래스를 가진 모든 input 요소를 선택
    const planSumInputs = document.querySelectorAll('.planSum');
    const supplySumInputs = document.querySelectorAll('.supplySum');
    const taxSumInputs = document.querySelectorAll('.taxSum');
    const totSumInputs = document.querySelectorAll('.totSum');
    const diffSumInputs = document.querySelectorAll('.diffSum');
    let sumPlan = 0;
    let sumSupply = 0;
    let sumTax = 0;
    let sumTot = 0;
    let sumDiff = 0;

    // NodeList를 배열로 변환하여 각 input 요소에 접근
    planSumInputs.forEach(inputElement => {
      // input 요소의 value 값을 얻음
      const inputValue = inputElement.value;
      sumPlan += Number(inputValue);
    });
    supplySumInputs.forEach(inputElement => {
      // input 요소의 value 값을 얻음
      const inputValue = inputElement.value;
      sumSupply += Number(inputValue);
    });
    taxSumInputs.forEach(inputElement => {
      // input 요소의 value 값을 얻음
      const inputValue = inputElement.value;
      sumTax += Number(inputValue);
    });
    totSumInputs.forEach(inputElement => {
      // input 요소의 value 값을 얻음
      const inputValue = inputElement.value;
      sumTot += Number(inputValue);
    });
    diffSumInputs.forEach(inputElement => {
      // input 요소의 value 값을 얻음
      const inputValue = inputElement.value;
      sumDiff += Number(inputValue);
    });

    const findAllMoney = document.querySelectorAll('input[name = "name"]');
    for(let i = 0; i < findAllMoney.length; i++){
      if(findAllMoney[i].value === '총 투입금액'){
        findAllMoney[i].parentElement.querySelector('input[name = "PLAN_A"]').value = sumPlan;
        findAllMoney[i].parentElement.querySelector('input[name = "SUPPLY_COST"]').value = sumSupply;
        findAllMoney[i].parentElement.querySelector('input[name = "TAX_COST"]').value = sumTax;
        findAllMoney[i].parentElement.querySelector('input[name = "TOTAL_COST"]').value = sumTot;
        findAllMoney[i].parentElement.querySelector('input[name = "DIFF_COST"]').value = sumDiff;
      }
    }
  }
  return (
    <>
      <UserInfo data={user} onSave={() => { funcSave(); }} />
      <div id="invest_history" className="border">
        <div className="flex text-sm text-center justifyAround py-4 border-b-w">
          <div className="w-10">(단위:원)</div>
          <div>계획(A)</div>
          <div>공급가액</div>
          <div>세액</div>
          <div>합계(B)</div>
          <div>차액(B-A)</div>
          <div>비고1</div>
          <div>비고2</div>
        </div>
        <div className="py-2">
          {history.map((historyItem) => {
            let flag = false;
            if(historyItem.AD_CATEGORY_SEQ === 30 || historyItem.AD_CATEGORY_SEQ === 34 || historyItem.AD_CATEGORY_SEQ === 39 || historyItem.AD_CATEGORY_SEQ === 45){
              flag = true;
            }
            let line = ''
            if(historyItem.CATE_SUB_NM == `${historyItem.CATE_NM} 계`){
              line = 'border-b-w';
              sum = true;

              return (
                <div key={historyItem.AD_INVEST_HISTORY_SEQ} id={`listWrap_${historyItem.AD_INVEST_HISTORY_SEQ}`} className={`flex justifySpaceBetween py-2 px-2 ${line}`}>
                  <input type="hidden" defaultValue={historyItem.CATE_NM}/>
                  { flag ? <div className="w-10 ">{historyItem.CATE_NM}</div> : <div className="w-10"></div>}
                  <div className="listWrap flex w-100 justifySpaceBetween">
                    <div className="w-10">{historyItem.CATE_SUB_NM}</div>
                    <input type="hidden" defaultValue={historyItem.CATE_SUB_NM} name="name"/>
                    <input
                      type="text"
                      name="PLAN_A"
                      className="invInput plan planSum"
                      defaultValue={historyItem.PLAN_A}
                      disabled
                    />
                    <input
                      type="text"
                      name="SUPPLY_COST"
                      className="invInput supply supplySum"
                      defaultValue={historyItem.SUPPLY_COST}
                      disabled
                    />
                    <input
                      type="text"
                      name="TAX_COST"
                      className="invInput tax taxSum"
                      defaultValue={historyItem.TAX_COST}
                      disabled
                    />
                    <input
                      type="text"
                      name="TOTAL_COST"
                      className="invInput tot totSum"
                      defaultValue={historyItem.TOTAL_COST}
                      disabled
                    />
                    <input
                      type="text"
                      name="DIFF_COST"
                      className="invInput diffSum"
                      defaultValue={historyItem.DIFF_COST}
                      disabled
                    />
  
                    <select
                      name="MENO_1"
                      id=""
                      className="invInput"
                      defaultValue={historyItem.MENO_1}
                    >
                      <option value="N">-</option>
                      <option value="U">창업자 부담</option>
                      <option value="L">렌탈비용</option>
                    </select>
                    <input
                      type="text"
                      name="MENO_2"
                      className="invInput"
                      defaultValue={historyItem.MENO_2}
                      
                    />
                    <input
                      type="hidden"
                      name="AD_INVEST_HISTORY_SEQ"
                      defaultValue={historyItem.AD_INVEST_HISTORY_SEQ}
                      className="invInput"
                    />
                  </div>
                </div>
              );
            }
            else{
              return (
                <div key={historyItem.AD_INVEST_HISTORY_SEQ} id={`listWrap_${historyItem.AD_INVEST_HISTORY_SEQ}`} className={`flex justifySpaceBetween py-2 px-2 ${line}`}>
                  <input type="hidden" defaultValue={historyItem.CATE_NM}/>
                  { flag ? <div className="w-10 ">{historyItem.CATE_NM}</div> : <div className="w-10"></div>}
                  <div className="listWrap flex w-100 justifySpaceBetween">
                    <div className="w-10">{historyItem.CATE_SUB_NM}</div>
                    <input type="hidden" defaultValue={historyItem.CATE_SUB_NM} name="name"/>
                    <input
                      type="text"
                      name="PLAN_A"
                      className="invInput plan"
                      defaultValue={historyItem.PLAN_A}
                      onChange={valueChange}
                    />
                    <input
                      type="text"
                      name="SUPPLY_COST"
                      className="invInput supply"
                      defaultValue={historyItem.SUPPLY_COST}
                      onChange={valueChange}
                    />
                    <input
                      type="text"
                      name="TAX_COST"
                      className="invInput tax"
                      defaultValue={historyItem.TAX_COST}
                      onChange={valueChange}
                    />
                    <input
                      type="text"
                      name="TOTAL_COST"
                      className="invInput tot"
                      defaultValue={historyItem.TOTAL_COST}
                      disabled
                    />
                    <input
                      type="text"
                      name="DIFF_COST"
                      className="invInput"
                      defaultValue={historyItem.DIFF_COST}
                      disabled
                    />
  
                    <select
                      name="MENO_1"
                      id=""
                      className="invInput"
                      defaultValue={historyItem.MENO_1}
                    >
                      <option value="N">-</option>
                      <option value="U">창업자 부담</option>
                      <option value="L">렌탈비용</option>
                    </select>
                    <input
                      type="text"
                      name="MENO_2"
                      className="invInput"
                      defaultValue={historyItem.MENO_2}
                      
                    />
                    <input
                      type="hidden"
                      name="AD_INVEST_HISTORY_SEQ"
                      defaultValue={historyItem.AD_INVEST_HISTORY_SEQ}
                      className="invInput"
                    />
                  </div>
                </div>
              );
            }
            
          })}
        </div>
        
      </div>
    </>
  );
};

export default InvestHistory;
