import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profile Page | Next.js E-commerce Dashboard Template",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};

const Administering = () => {
  return (
    <>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap" rel="stylesheet"></link>
        <div className="container-fluid" >
            <div>
                
                
                {/* <!-- 매장 정보 START --> */}
                <div>
                    <div className="d-flex justifySpaceBetween">
                        {/* <!-- 매장 신상정보 START --> */}
                        <div className="storeInfo">
                            <div className="d-flex justifySpaceBetween storeBox">
                                <div>매장업종<span className="red">*</span></div>
                                <div>
                                    <select name="" id="" className="storeTypeOpton">
                                        <option value="대형디저트카페">대형디저트카페</option>
                                    </select>
                                </div>
                            </div>
                            <div className="d-flex justifySpaceBetween storeBox">
                                <div>사업장등록번호<span className="red">*</span></div>
                                <div>
                                    <input type="text" placeholder="104-00-0000" className="manaInput" />
                                </div>
                            </div>
                            <div className="d-flex justifySpaceBetween storeBox">
                                <div>연락처<span className="red">*</span></div>
                                <div>
                                    <input type="text" placeholder="010-0000-0000" className="manaInput"/>
                                </div>
                            </div>
                            <div className="d-flex justifySpaceBetween storeBox">
                                <div>상권명</div>
                                <div>
                                    <input type="text" className="manaInput"/>
                                </div>
                            </div>
                            <div className="d-flex justifySpaceBetween storeBox">
                                <div>상권교통</div>
                                <div>
                                    <input type="text" className="manaInput"/>
                                </div>
                            </div>
                            <div className="d-flex justifySpaceBetween storeBox">
                                <div>실면적<span className="red">*</span></div>
                                <div className="d-flex rela">
                                    <input type="text" className="manaInput"/>
                                    <div className="absol ml-130">m²</div>
                                </div>
                            </div>
                            <div className="d-flex justifySpaceBetween storeBox">
                                <div>화재보험</div>
                                <div>
                                    <input type="text" className="manaInput"/>
                                </div>  
                            </div>
                            <div className="d-flex justifySpaceBetween storeBox">
                                <div>음식물 배상책임보험</div>
                                <div>
                                    <input type="text" className="manaInput"/>
                                </div>
                            </div>
                            <div className="d-flex justifySpaceBetween storeBoxMemo">
                                <div>메모</div>
                                <div>
                                    <textarea name="" id=""></textarea>
                                </div>
                            </div>

                        </div>
                        {/* <!-- 매장 신상정보 END --> */}

                        {/* <!-- 매장 투자정보 START --> */}
                        <div className="investInfo">
                            <div>
                                <div className="investTitle">매장 투자정보</div>
                            </div>

                            <div className="investDetailWrap">
                                <div className="d-flex">
                                    <div className="investDetail">
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>보증금</div>
                                            <div className="rela">
                                                <input type="text" className="inputType1 " />
                                                <div className="absol unitTextMan">만원</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>권리금</div>
                                            <div className="rela">
                                                <input type="text" className="inputType1 " />
                                                <div className="absol unitTextMan">만원</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>월임대료<span>*</span></div>
                                            <div className="rela">
                                                <input type="text" className="inputType1 " />
                                                <div className="absol unitTextMan">만원</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>관리비</div>
                                            <div className="rela">
                                                <input type="text" className="inputType1 " />
                                                <div className="absol unitTextMan">만원</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>합계</div>
                                            <div className="rela">
                                                <input type="text" disabled className="inputType1 " />
                                                <div className="absol unitTextMan">만원</div>
                                            </div>
                                        </div>
                                    </div>
                
                                    <div className="investDetail">
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>총 투자비용</div>
                                            <div className="rela">
                                                <input type="text" className="inputType1"/>
                                                <div className="absol unitTextMan">만원</div>
                                                <input type="text" className="inputType2"/>
                                                <div className="unitTextPer absol">%</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>대안투자자산</div>
                                            <div className="rela">
                                                <input type="text" className="inputType1"/>
                                                <div className="absol unitTextMan">만원</div>
                                                <input type="text" className="inputType2"/>
                                                <div className="unitTextPer absol">%</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>점주</div>
                                            <div className="rela">
                                                <input type="text" className="inputType1"/>
                                                <div className="absol unitTextMan">만원</div>
                                                <input type="text" className="inputType2"/>
                                                <div className="unitTextPer absol">%</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>렌털</div>
                                            <div className="rela">
                                                <input type="text" className="inputType1"/>
                                                <div className="absol unitTextMan">만원</div>
                                                <input type="text" className="inputType2"/>
                                                <div className="unitTextPer absol">%</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>합계</div>
                                            <div className="rela">
                                                <input type="text" disabled className="inputType1"/>
                                                <div className="absol unitTextMan">만원</div>
                                                <input type="text" disabled className="inputType2"/>
                                                <div className="unitTextPer absol">%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="franInveDetailWrap">
                                <div className="d-flex">
                                    <div className="franInveDetail">
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>프렌차이즈 본사보증금</div>
                                            <div className="rela">
                                                <input type="text" className="inputType1 " />
                                                <div className="absol unitTextMan">만원</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>가맹비</div>
                                            <div className="rela">
                                                <input type="text" className="inputType1 " />
                                                <div className="absol unitTextMan">만원</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>교육비</div>
                                            <div className="rela">
                                                <input type="text" className="inputType1 " />
                                                <div className="absol unitTextMan">만원</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justifySpaceBetween detailBox">
                                            <div>인테리어비용</div>
                                            <div className="rela">
                                                <input type="text" className="inputType1 " />
                                                <div className="absol unitTextMan">만원</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="franInveDetail">
                                        <textarea name="" id="" className="franTextArea"></textarea>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        {/* <!-- 매장 투자정보 END --> */}
                    </div>

                    {/* <!-- 매장사진 위치 START --> */}
                    <div className="storeLocation">
                        <div className="d-flex">
                            <div className="locationDetail mr-15">
                                <div>
                                    <div className="locationTitle">매장사진<span className="red">*</span></div>
                                    <div className="locationText">최대 30장까지 등록 가능합니다.<br/>9:16 비율의 이미지를 권장합니다.</div>
                                </div>
                                <div className="imgRegiBtnWrap">
                                    <button className="imgRegiBtn">사진 등록</button>
                                </div>
                                <div className="storeImgWrap">
                                    <div className="d-flex justifySpaceBetween">
                                        <div>
                                            <img src={"/images/manage/강쥐.jpg"} alt="" className="storeImg" />
                                        </div>
                                        <div>
                                            <img src={"/images/manage/강쥐.jpg"} alt="" className="storeImg" />
                                        </div>
                                        <div>
                                            <img src={"/images/manage/강쥐.jpg"} alt="" className="storeImg" />
                                        </div>
                                        <div>
                                            <img src={"/images/manage/강쥐.jpg"} alt="" className="storeImg" />
                                        </div>
                                        <div>
                                            <img src={"/images/manage/강쥐.jpg"} alt="" className="storeImg" />
                                        </div>
                                    </div>
                                    <div className="d-flex justifySpaceBetween mt-20">
                                        <div>
                                            <img src={"/images/manage/강쥐.jpg"} alt="" className="storeImg" />
                                        </div>
                                        <div>
                                            <img src={"/images/manage/강쥐.jpg"} alt="" className="storeImg" />
                                        </div>
                                        <div>
                                            <img src={"/images/manage/강쥐.jpg"} alt="" className="storeImg" />
                                        </div>
                                        <div>
                                            <img src={"/images/manage/강쥐.jpg"} alt="" className="storeImg" />
                                        </div>
                                        <div>
                                            <img src={"/images/manage/강쥐.jpg"} alt="" className="storeImg" />
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            
            
                            <div className="locationDetail">
                                <div>매장위치<span>*</span></div>
                                <div className="locationRegi ">
                                    <div className="locationRegiBtnWrap ">
                                        <div className="d-flex locRegiBtn">
                                            <img src={"/images/manage/Map_light.svg"} className="regiLocImg" />
                                            <div>매장장소 등록하기</div>
                                        </div>
                                    </div>
                                </div>
                                <div id="map">``
            
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    {/* <!-- 매장사진 위치 END --> */}

                    {/* <!-- 거래처 관리 START --> */}
                    <div className="clientManage">
                        <div className="d-flex justifySpaceBetween">
                            <div className="clentText">거래처 관리</div>
                            <div><button className="clientRegi">+ &nbsp;거래처등록</button></div>
                        </div>
                        <table className="clientTable">
                            <colgroup>
                                <col width="3%"/>                
                                <col width="8%"/>
                                <col width="13%"/>                
                                <col width="10%"/>
                                <col width="5%"/>                
                                <col width="10%"/>
                                <col width="9%"/>
                                <col width="9%"/> 
                                <col width="9%"/>
                                <col width="19%"/>
                                <col width="5%"/>
                            </colgroup>
                            <tbody>
                                <tr className="clientTr">
                                    <th className=""></th>
                                    <th className="">유형</th>
                                    <th className="">상호명</th>
                                    <th className="">대표번호</th>
                                    <th className="">담당자명</th>
                                    <th className="">담당자번호</th>
                                    <th className="">미수금</th>
                                    <th className="">미지급금</th>
                                    <th className="">잔액</th>
                                    <th className="">메모</th>
                                    <th className=""></th>
                                </tr>
                                <tr className="tableLine">
                                    <th className=" " ><input type="checkbox" /></th>
                                    <th className="">인테리어</th>
                                    <th className="">제이디자인 인테리어</th>
                                    <th className="">02-2287-8785</th>
                                    <th className="">김정균</th>
                                    <th className="">010-3206-4878</th>
                                    <th className=""><input type="text" className="tableInput"/></th>
                                    <th className=""><input type="text" className="tableInput"/></th>
                                    <th className=""><input type="text" className="tableInput"/></th>
                                    <th className=""><input type="text" className="memoInput"/></th>
                                    <th className="red">Delete</th>
                                </tr>
                                <tr className="tableLine">
                                    <th className=""><input type="checkbox" /></th>
                                    <th className="">인테리어</th>
                                    <th className="">제이디자인 인테리어</th>
                                    <th className="">02-2287-8785</th>
                                    <th className="">김정균</th>
                                    <th className="">010-3206-4878</th>
                                    <th className=""><input type="text" className="tableInput" /></th>
                                    <th className=""><input type="text" className="tableInput" /></th>
                                    <th className=""><input type="text" className="tableInput" /></th>
                                    <th className=""><input type="text" className="memoInput" /></th>
                                    <th className="red">Delete</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* <!-- 거래처 관리 END --> */}
                </div>
                {/* <!-- 매장 정보 END --> */}

                {/* <!-- 모든 매장관리 공통 END --> */}
            </div>
        </div>

        {/* <!-- 매장관리 팝업 START --> */}

        {/* <!-- 거래처 등록 SATRT --> */}
        <div className="regiPop">
            <div className="d-flex justifySpaceBetween">
                <div className="regiTitle">거래처 등록</div>
                <div className="regiClose ">X</div>
            </div>
            <div className="blackLine my-3"></div>
            <div className="regiDetailWrap">
                <div className="regiDetail">
                    <div className="blackLine mt-15"></div>
                    <div className="d-flex inputSpaceBetween">
                        <div>상호명</div>
                        <div>
                            <input type="text" className="popInput" />
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>유형</div>
                        <div>
                            <input type="text" placeholder="ex.인테리어" className="popInput" />
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>대표번호</div>
                        <div>
                            <input type="text" className="popInput" />
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>담당자명</div>
                        <div>
                            <input type="text" className="popInput" />
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>담당자번호</div>
                        <div>
                            <input type="text" className="popInput" />
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>미수금</div>
                        <div>
                            <input type="text" className="popInput" />
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>미지급금</div>
                        <div>
                            <input type="text" className="popInput" />
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>잔액</div>
                        <div>
                            <input type="text" className="popInput" />
                        </div>
                    </div>
                    <div className="d-flex inputSpaceBetween">
                        <div>메모</div>
                        <div>
                            <textarea name="" id="" ></textarea>
                        </div>
                    </div>
                </div>
                
            </div>

            <div className="d-flex regiPopBtnWrap justifyCenter">
                <button className="regiPopBtn cloBtn mr-10">닫기</button>
                <button className="regiPopBtn regiBtn">등록</button>
            </div>
        </div>
        {/* <!-- 거래처 등록 END --> */}


        {/* <!-- 매장관리 팝업 END --> */}
    </>
  );
};

export default Administering;
