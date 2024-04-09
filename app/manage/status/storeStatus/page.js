"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import Table from "@/components/Tables/Table";
import Axios from "@/components/common/api/Axios";

import React, { useState, useEffect, useMemo } from 'react';

const Status = () => {

  const [ list, setList ] = useState([]);

  const fetchDataAxios = async() => {
    const params = {};
    try {
      const response = await Axios.post("/api/v1/store/list"
      //, JSON.stringify(params)
      );      
      setList(response);
    } catch(error) {
      console.log("error : ", error);      
      return false;
    }
  }

  useEffect(() => {
    fetchDataAxios();

  }, [])

  // 컬럼
  const columnData = [    
    { text: "", value: 'chk', width: '60px', align: 'center', selectCheck: true},      
    { text: "오픈일", value: 'OPEN_DT', width: '180px', align: 'left' },
    { text: "사업장(상호)", value: 'STORE_NM', width: '260px', align: 'left' },
    { text: "점주", value: 'BOSS_NM', width: '80px', align: 'center' },
    { text: "폰번호", value: 'BOSS_HP', width: '80px', align: 'center' },
    { text: "계좌정보", value: 'AVER_SALES', width: '100px', align: 'right' },
    { text: "임차조건", value: 'FPOP', width: '80px', align:'center'  },
    { text: "매장위치", value: 'STORE_ADDR', width: '70px', align: 'center' },    
    { text: "사업장등록번호", value: 'NO_BIZ', width: '80px', align: 'center' },
    { text: "일련번호", value: 'AD_STORE_INFO_SEQ', width: '80px', align: 'center', hidden: true },
  ] 

  
  const columns = useMemo(() => columnData, []);
  const data = useMemo(() => list, [list]);  


  const [selection, setSelection] = useState([]);

  return (
    <>
      <div className="statusWrap">
        <div className="topTitleWrap d-flex justifySpaceBetween">
            <div className="StoreTopText">매장현황</div>
            <div className="d-flex ">
              <div className="d-flex storeSearchWrap">
                <div className="rela">
                  <input type="text" className="storeStatusSeacrch" placeholder="상호명을 입력해주세요" />
                  <img src={'/images/manage/search.svg'} alt="" className="absol searImg" />
                </div>
                <div className="storeSeacrchBtn">검색</div>
                <div className="storeRefImg"><img src={"/images/manage/clockwise.svg"} alt="" className="refrechImg" /></div>
              </div>
              <div className="clientRegi center36">+&nbsp;&nbsp;매장등록</div>
            </div>
        </div>

        <div className="d-flex storeStatusTypeWrap color333">
          <div className="d-flex storeUseType justifySpaceBetween">
            <div className="d-flex">
              <input type="radio" />
              <div className="useDetailText">가맹점</div>
            </div>
            <div className="d-flex">
              <input type="radio" />
              <div className="useDetailText">직영점</div>
            </div>
          </div>
         
          <div className="d-flex statusBtnWrap">
            <div>상태 : </div>
            <div className="uBtnAll">모두</div>
            <div className="uBtnNew">신규</div>
            <div className="uBtnWork">운영중인</div>
            <div className="uBtnMNeed">매출관리가필요한</div>
            <div className="uBtnClose">폐업</div>
          </div>
        </div>

        <div>
          <Table headers={columns} items={data} selectCheck={false} itemKey={'SOGUL_USER_INFO_SEQ'} updateSelection={setSelection} />
          {/* <table className="userTable">
              <colgroup>
                  <col width="3%"/>                
                  <col width="3%"/>
                  <col width="13%"/>                
                  <col width="15%"/>
                  <col width="12%"/>                
                  <col width="10%"/>
                  <col width="10%"/>
                  <col width="20%"/> 
                  <col width="9%"/>
                  <col width="5%"/>
              </colgroup>
              <tbody>
                <tr className="userTr">
                    <th className=""><input type="checkbox" /></th>
                    <th className="">#</th>
                    <th className="">오픈일</th>
                    <th className="">사업장(상호)</th>
                    <th className="">점주정보</th>
                    <th className="">계좌정보</th>
                    <th className="">임차조건</th>
                    <th className="">매장위치</th>
                    <th className="">사업장등록번호</th>
                    <th className="">처리</th>
                </tr>
                <tr className="tableLine uTRr">
                    <th className="uTr" ><input type="checkbox" /></th>
                    <th className="uTrL"></th>
                    <th className="uTrL">2023.12.12</th>
                    <th className="d-flex tableTr uTrL">
                      <div>
                        플러스82 성남
                      </div>
                      <div className="bizDetailWrap d-flex">
                        <button>상세</button>
                        <img src={"/images/manage/arrow_forward.svg"} alt="" className="bizArrowImg" />
                      </div>
                    </th>
                    <th className="uTrL">김대환 / 010-1234-1234</th>
                    <th className="textBlue uTrL">눌러서 확인하기</th>
                    <th className="textBlue uTrL">눌러서 확인하기</th>
                    <th className="uTrL">경기도 성남시 중원구 광명어쩌구</th>
                    <th className="uTrL">123-12-12345</th>
                    <th className="d-flex">
                      <div className="imgWrap">
                        <div><img src={'/images/manage/edit.svg'} alt="" /></div>
                        <div className="ml-5"><img src={'/images/manage/trash.svg'} alt="" /></div>
                      </div>
                    </th>
                </tr>
                <tr className="tableLine uTRr">
                    <th className="uTr" ><input type="checkbox" /></th>
                    <th className="uTrL"></th>
                    <th className="uTrL">2023.12.12</th>
                    <th className="d-flex tableTr uTrL">
                      <div>
                        플러스82 성남
                      </div>
                      <div className="bizDetailWrap d-flex">
                        <button>상세</button>
                        <img src={"/images/manage/arrow_forward.svg"} alt="" className="bizArrowImg" />
                      </div>
                    </th>
                    <th className="uTrL">김대환 / 010-1234-1234</th>
                    <th className="textBlue uTrL">눌러서 확인하기</th>
                    <th className="textBlue uTrL">눌러서 확인하기</th>
                    <th className="uTrL">경기도 성남시 중원구 광명어쩌구</th>
                    <th className="uTrL">123-12-12345</th>
                    <th className="d-flex">
                      <div className="imgWrap">
                        <div><img src={'/images/manage/edit.svg'} alt="" /></div>
                        <div className="ml-5"><img src={'/images/manage/trash.svg'} alt="" /></div>
                      </div>
                    </th>
                </tr>
               
              </tbody>
          </table> */}
        </div>
      </div>



      {/* <!-- 임차조건 SATRT --> */}
      <div className="regiPop">
            <div className="d-flex justifySpaceBetween ml-30">
                <div className="regiTitle">임차조건</div>
                <div className="regiClose ">X</div>
            </div>
            <div className="blackLine my-3"></div>
            <div className="regiDetailWrap">
                <div className="regiDetail">
                    <div className="blackLine mt-15"></div>
                    <div className="d-flex inputSpaceBetween">
                        <div>권리금</div>
                        <div className="rela">
                            <input type="text" className="popInput" />
                            <div className="absol leaseText">만원</div>
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>보증금</div>
                        <div className="rela">
                            <input type="text" className="popInput" />
                            <div className="absol leaseText">만원</div>
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>임차료</div>
                        <div className="rela">
                            <input type="text" className="popInput" />
                            <div className="absol leaseText">만원</div>
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>관리비</div>
                        <div className="rela">
                            <input type="text" className="popInput" />
                            <div className="absol leaseText">만원</div>
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>전용면적</div>
                        <div className="d-flex areaChage">
                          <div>평</div>
                          <img src={"/images/manage/refresh.svg"} alt="" />
                        </div>
                        <div className="rela">
                            <input type="text" className="popInput" />
                            <div className="absol leaseText">만원</div>
                        </div>
                    </div>
                    
                </div>
                
            </div>

            <div className="d-flex regiPopBtnWrap justifyCenter">
                <button className="regiPopBtn cloBtn mr-10">닫기</button>
                <button className="regiPopBtn regiBtn">등록</button>
            </div>
        </div>
        {/* <!-- 임차조건 END --> */}


        {/* <!-- 계좌등록 SATRT --> */}
      <div className="accPop">
            <div className="d-flex justifySpaceBetween">
                <div className="regiTitle">계좌등록</div>
                <div className="regiClose ">X</div>
            </div>

            <div className="fileUpload1">
              <div className="d-flex fileImgWrap1">
                <img src={"/images/manage/imgBox.svg"} alt="" />
                <img src={"/images/manage/arrow.svg"} alt="" />
                <div>통장 사본 파일을 이곳에 올려놓으세요.</div>
              </div>
            </div>

            <div className="fileUpload2">
              <div className="d-flex fileImgWrap2">
                <img src={"/images/manage/folder.svg"} alt="" />
                <img src={"/images/manage/arrow.svg"} alt="" />
                <div>내PC에서 파일 가져오기</div>
              </div>
            </div>

            <div className="blackLine my-3"></div>
            <div className="regiDetailWrap">
                <div className="regiDetail">
                    <div className="blackLine mt-15"></div>
                    <div className="d-flex inputSpaceBetween">
                        <div>예금주명</div>
                        <div className="rela">
                            <div>홍길동</div>
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>유형</div>
                        <div className="rela">
                          <select name="" id="" className="popInput">
                            <option value="매출계좌">매출계좌</option>
                          </select>
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>은행</div>
                        <div className="rela">
                          <select name="" id="" className="popInput">
                            <option value="우리은행">우리은행</option>
                          </select>
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>계좌번호</div>
                        <div className="rela">
                            <input type="text" className="popInput" />
                            <div className="absol leaseText">만원</div>
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>개설지점</div>
                        <div className="rela">
                            <input type="text" className="popInput" />
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>개설일자</div>
                        <div className="rela">
                            <input type="text" className="popInput" />
                        </div>
                    </div>
                    
                </div>
                
            </div>

            <div className="d-flex regiPopBtnWrap justifyCenter">
                <button className="regiPopBtn cloBtn mr-10">닫기</button>
                <button className="regiPopBtn regiBtn">등록</button>
            </div>
        </div>
        {/* <!-- 계좌등록 END --> */}


      {/* <!-- 계좌정보 SATRT --> */}
      <div className="accInfoPop">
            <div className="d-flex justifySpaceBetween ml-30">
                <div className="accTitle">계좌정보</div>
                <div className="regiClose ">X</div>
            </div>
            <div className="blackLine my-3"></div>

            <div className="d-flex bankRegiTextWrap">
              <div>등록계좌 <span className="bankCount">(4 건)</span></div>
              <div className="accRegisterBtn">계좌등록</div>
            </div>

            <div className="accInfoDetailWrap">
                <table className="accInfo">
                  <colgroup>
                    <col width="10%"/>                
                    <col width="10%"/>
                    <col width="20%"/>                
                    <col width="10%"/>
                    <col width="15%"/>                
                    <col width="10%"/>
                    <col width="15%"/>
                  </colgroup>
                  <tr className="accInfoTrTitle">
                    <th className="">유형</th>
                    <th className="">은행명</th>
                    <th className="">계좌번호</th>
                    <th className="">예금주명</th>
                    <th className="">개설일자</th>
                    <th className="">개설지점</th>
                    <th className="">통상사본</th>
                  </tr>
                  <tr className="accInfoThDetail">
                    <th className="">매출계좌</th>
                    <th className="">우리은행</th>
                    <th className="">151-11-12345</th>
                    <th className="">홍길동</th>
                    <th className="">YYYY.MM.DD</th>
                    <th className="">경기도지점</th>
                    <th className="d-flex accInfoFix">
                      <div className="accShowText">보기</div>
                      <div>삭제</div>
                    </th>
                  </tr>
                  <tr className="accInfoThDetail">
                    <th className="">매출계좌</th>
                    <th className="">우리은행</th>
                    <th className="">151-11-12345</th>
                    <th className="">홍길동</th>
                    <th className="">YYYY.MM.DD</th>
                    <th className="">경기도지점</th>
                    <th className="d-flex accInfoFix">
                      <div className="accShowText">보기</div>
                      <div>삭제</div>
                    </th>
                  </tr>
                  <tr className="accInfoThDetail">
                    <th className="">매출계좌</th>
                    <th className="">우리은행</th>
                    <th className="">151-11-12345</th>
                    <th className="">홍길동</th>
                    <th className="">YYYY.MM.DD</th>
                    <th className="">경기도지점</th>
                    <th className="d-flex accInfoFix">
                      <div className="accShowText">보기</div>
                      <div>삭제</div>
                    </th>
                  </tr>
                  <tr className="accInfoThDetail">
                    <th className="">매출계좌</th>
                    <th className="">우리은행</th>
                    <th className="">151-11-12345</th>
                    <th className="">홍길동</th>
                    <th className="">YYYY.MM.DD</th>
                    <th className="">경기도지점</th>
                    <th className="d-flex accInfoFix">
                      <div className="accShowText">보기</div>
                      <div>삭제</div>
                    </th>
                  </tr>
                  <tr className="accInfoThDetail">
                    <th className="">매출계좌</th>
                    <th className="">우리은행</th>
                    <th className="">151-11-12345</th>
                    <th className="">홍길동</th>
                    <th className="">YYYY.MM.DD</th>
                    <th className="">경기도지점</th>
                    <th className="d-flex accInfoFix">
                      <div className="accShowText">보기</div>
                      <div>삭제</div>
                    </th>
                  </tr>
                  <tr className="accInfoThDetail">
                    <th className="">매출계좌</th>
                    <th className="">우리은행</th>
                    <th className="">151-11-12345</th>
                    <th className="">홍길동</th>
                    <th className="">YYYY.MM.DD</th>
                    <th className="">경기도지점</th>
                    <th className="d-flex accInfoFix">
                      <div className="accShowText">보기</div>
                      <div>삭제</div>
                    </th>
                  </tr>
                </table>
                
            </div>

            <div className="d-flex regiPopBtnWrap justifyCenter">
                <button className="regiPopBtn cloBtn mr-10">닫기</button>
                <button className="regiPopBtn regiBtn">등록</button>
            </div>
        </div>
        {/* <!-- 계좌정보 END --> */}
    </>
  );
};

export default Status;
