'use client';
import { useState } from 'react';
import Axios from '@/components/common/api/Axios';
import { AxiosRequestConfig } from 'axios';

/**
 * FormData를 multipart/form-data로 전송
 * @param {string} url 전송 주소
 * @param {AxiosRequestConfig?} config 추가 axios 옵션
 * @returns
 */
export const useAxiosWithFile = (url, config) => {
  const [isLoading, setIsLoading] = useState(false);
  /**
   * @param {FormData} formData
   * @returns
   */
  const post = async (formData) => {
    setIsLoading(true);
    const response = await Axios.post(url, formData, {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data', ...config?.headers },
    });
    setIsLoading(false);
    return response;
  };
  return { post, isLoading };
};
