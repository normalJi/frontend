"use client";
import React from "react";
import Image from "next/image";
import Logo from "@/public/images/sogul_logo.png";
import SING_IMG from "@/public/images/sign_img.png";
import { useState, useEffect } from "react";
//import { customAlert } from "@/components/common/util/Util";
import LocalStorage from "@/components/common/LocalStorage";
import Axios from "@/components/common/api/Axios";

import { setCookie } from "@/components/common/Cookie";
const SignIn = () => {

  const [ checkValue, setCheckValue ] = useState('disabled');
  const [ inputs, setInputs ] = useState({
    USER_ID: "",
    USER_PASS: "",
  });
  const { USER_ID, USER_PASS } = inputs;

  /* 아이디 체크 */
  const func_onChange = (e) => {
    const { value, name } = e.target;
    
    if( value === "" ) {
      setInputs({
        ...inputs,
        [name]: '',
      })      
    } else {
      setInputs({
        ...inputs,
        [name]: value,
      })      
    }
    
    func_check();
  }
 

  /* 로그인 버튼 활성/비활성  */
  const func_check = () => {    
    if( USER_ID === "" || USER_PASS === "" ) {
      setCheckValue('disabled');
    } else {
      setCheckValue('');
    }
  }

  /* 로그인 */
  const func_handleSubmit = async() => {

    const params = {};
    try {
      const response = await Axios.post("/api/v1/login", inputs
      //, JSON.stringify(params)
      );      
      LocalStorage.setItem("accessToken", response.data.token.accessToken);
      setCookie('refreshToken', response.data.token.refreshToken, {
        //httpOnly: true,
        maxAge: 60 * 60 * 24 * 14,
        path: "/"
      });    

      window.location.href = "/admin/user/member";
    } catch(error) {
      console.log("error : ", error);
      //customAlert(error);
      alert(error);
      return false;
    }
  }

  useEffect(() => {
    func_check();
  },[])



  return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <div className="w-full">
                <div className="align-top inline-block">
                  <Image src={Logo} alt="sogul_logo" width="25" className="h-8 me-3" />
                </div>
                <div className="inline-block">
                  <p className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">SOGUL</p>
                </div>
              </div>

              <p className="2xl:px-20">
                Administrator System
              </p>

              <span className="mt-15 inline-block">
                <Image src={SING_IMG} alt="이미지" width="250" />                
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              {/* <span className="mb-1.5 block font-medium">Start for free</span> */}
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sogul 관리자 로그인
              </h2>

              <form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Admin ID
                  </label>
                  <div className="relative">
                    <input
                      type="text" name="USER_ID" value={USER_ID} required onChange={func_onChange} onBlur={func_onChange} 
                      placeholder="관리자 ID를 입력하세요."
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <span className="absolute right-4 top-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <g opacity="0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                          </g>
                        </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password" name="USER_PASS" value={USER_PASS} required onChange={func_onChange} onBlur={func_onChange} 
                      placeholder="비밀번호를 입력해 주세요"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="button"                    
                    value="로그인"
                    onClick={func_handleSubmit}
                    disabled={checkValue}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
