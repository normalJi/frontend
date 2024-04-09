'use client';
import axios from "axios";
import LocalStorage from "../LocalStorage";
import { getCookie, setCookie } from "../Cookie";

// const BASE_URL = "http://localhost:9101";

//토큰이 필요한 api요청을 보내는 axios인스턴스
/**
 * @param baseURL string api url
 * @param headers string token
 * 
 */
const axiosPrivate = axios.create({
  // baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: `Bearer ${LocalStorage.getItem('accessToken')}`,
    //'refreshToken': nookies.get(null,'refreshToken'),
  },
});

// refresh token 확인
export async function postRefreshToken() {  
  const response = await axiosPrivate.post('/api/v1/auth/refreshVerify', {}, {
    headers: {
      //refreshToken: `${nookies.get(null,'refreshToken')}`,
      refreshToken: `${getCookie('refreshToken')}`,
    },
  });
  //console.log("poast 2222222", response);
  return response;
}

// refresh token 발급
// export async function refreshTokenIssued() {
//   const data = await axiosPrivate.post('/api/v1/auth/refresh', {}, {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json;charset=UTF-8',
//     }
    
//   });
//   return data;
// }

//토큰을 함께보내는 privateApi에 interceptor를 적용합니다
axiosPrivate.interceptors.response.use(
  // 200번대 응답이 올때 처리  
  (response) => {
    return response;
  },
  // 200번대 응답이 아닐 경우 처리
  async (error) => {
    
    const {
      config,
      response: {status},
    } = error;
    
	  //토큰이 만료되을 때    
    if (status === 401) {
      
      if (error.response.data.message === 'Unauthorized' || error.response.data.message === 'jwt expired') {        
        const originRequest = config;
        
        //리프레시 토큰 api
        const response = await postRefreshToken();
        
        //리프레시 토큰 요청이 성공할 때
        if (response.status === 200) {
          const newAccessToken = response.data.accessToken;          
          LocalStorage.setItem('accessToken', newAccessToken);
          
          axiosPrivate.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          //진행중이던 요청 이어서하기
          originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originRequest);        
        } else if (response.status === 500) {                    
          //리프레시 토큰 요청이 실패할때(리프레시 토큰도 만료되었을때 = 재로그인 안내)
          alert("계정이 만료되었습니다. 재로그인 하세요.")
          window.location.replace('/');
        } else {          
          alert("계정이 만료되었습니다. 재로그인 하세요.")
        }
      } else if( error.response.data.message === 'No Token' ) {      
        alert("계정이 만료되었습니다. 재로그인 하세요.")
        window.location.replace('/');
      }
    }    
    return Promise.reject(error);
  },
);


export default axiosPrivate;
















// export default axios.create({
//   baseURL: BASE_URL,
// })

// const axiosPrivate = axios.create({
//   baseURL: BASE_URL,  
//   headers: {    
//     'Accept': 'application/json',
//     'Content-Type': 'application/json;charset=UTF-8',
//     'authorization': `Bearer ${LocalStorage.getItem(accessToken)}`,
//     'refresh': nookies.get(null, 'refreshToken'),    
//   },
//   withCredentials: true,  
// })

// axiosPrivate.interceptors.request.use(
//   config => {    
//     if(!config.headers['Authorization']){      
//       config.headers['Authorization'] = `Bearer ${LocalStorage.getItem('accessToken')}`;          
//     }

//     return config;
//   }, (error) => Promise.reject(error)
// );

// axiosPrivate.interceptors.response.use(
//   (response) => {
//     console.log("response : ",response);
//     if( response.status === 404 ) {
//       console.log("에러!!에러!!에러!!");
//     }
//     const res = response.data;

//     return res;
//   },
//   async( error ) => {
//     return Promise.reject(err);
//   } 
// );

// export default axiosPrivate;