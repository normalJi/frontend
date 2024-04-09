'use client';
import { axiosPrivate } from "@/util/api/axiosPrivate";
import { useEffect } from "react";
import nookies from 'nookies';

const useAxiosPrivate = () => {
  const refresh = nookies.get(null, 'refreshToken')

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if(!config.headers['Authorization']){
          config.headers['Authorization'] = `Bearer ${window.localStorage.getItem('accessToken')}`;          
        }

        return config;
      }, (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      
      reponse => reponse,      
      async (error) => {
        // 위에서 설명했듯이 accessToken의 timespan이 짧기 때문에
        // accessToken이 만료되면 async error handler를 통해서 다시 accessToken을 받아올 수 있도록 하자
        const prevRequest = error?.config;
        if (error?.response.status === 403 && !prevRequest?.send) {
          try{
              prevRequest.sent = true;
              const newAcessToken = await refresh();
    
              prevRequest.headers = { ...prevRequest.headers };
    
              prevRequest.headers["Authorization"] = `Bearer ${newAcessToken}`;
              //prevRequest.headers["refresh"] = nookies.get(null, 'refreshToken')
              return axiosPrivate(prevRequest);

          } catch(err) {
            window.location.href='/auth/signin';

            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    }

  }, [auth, refresh]);

  return axiosPrivate;
}

export default useAxiosPrivate;