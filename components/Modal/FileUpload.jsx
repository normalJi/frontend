'use client'

import cn from "@/components/common/util/ClassName";

import {useState, useMemo, useRef, useEffect, useCallback, forwardRef, useImperativeHandle} from 'react';
import Axios from '@/components/common/api/Axios';
import { useAxiosWithFile } from '@/hooks/useAxiosWithFile';
import Button from "@/components/Button/Button";
import { uf_appendFileToFormData, uf_isNull } from '@/components/common/util/Util';
import useFileUpload from "@/hooks/useFileUpload";

const FileUpload = forwardRef(function StorePictureManager({ className, seq, label, propertyName, value, onChange, multipled, required, fileList}, ref){
  const [isFileLoading, setIsFileLoading] = useState(false);
  
  const [ files, setFiles ] = useState([]);
  const [ fileDb, setFileDb ] = useState([]);
  const { upload, multiUpload } = useFileUpload();

  const { post: postUpload, isLoading: uploadLoading } = useAxiosWithFile('/api/v1/com/attach/upload');

  useEffect(() =>{
    setFileDb(fileList);
  }, [fileList])

  const multiUploadFile = async (data) => {
    
    setIsFileLoading(true)
    const fileData = await multiUpload(data);    
    handleMultiFiles(fileData)
    setIsFileLoading(false)
  }

  const handleMultiFiles = (fileArr) => {       
    const fileUrls = files;
    const newlySavedFiles = Array.from(fileArr);
    const newArrFiles = fileUrls.concat(newlySavedFiles);
    const newFiles = newArrFiles.filter((arr, index, callback) => index === callback.findIndex(t => t.name === arr.name ));   // 중복 제거
    
    setFiles(newFiles)
  }

  // 삭제
  // const funcUserDelete = (e, obj) => {
  //   let newItems = files.filter((file) => file.name !== obj.name);  
  //   console.log("newItems : ", newItems);
  //   setFiles(newItems);
  // }

  const funcFileDelete = async (e, obj, fileSeq) => {
    if( uf_isNull(fileSeq) ) {
      let newItems = files.filter((file) => file.name !== obj.name);      
      setFiles(newItems);
    } else {
      const params = obj;
      try {
        if( confirm("파일을 삭제하시겠습니까?") ) {        
          await Axios.post("/api/v1/com/attach/delete", params);

          let newItems = fileDb.filter((file) => file.name !== obj.name);
          setFileDb(newItems);
        }
      } catch(error) {
        console.log("error : ", error);      
        return false;
      }
    }
  }

  

  /** ref 정의 */
  useImperativeHandle(ref, ()=>{
    return {
      save(seq, accSeq, division){
        
        _save(seq, accSeq, division);
      },
    }
  })

  /**
   * 변경사항 저장 or 상위에서 save호출시 호출됨
   * seq가 없는 상태일때는 작동 안함
   * @param {number?} newSeq 현재 store seq
   */
  const _save = async (seq, accSeq, division) =>{
    let AD_STORE_INFO_SEQ = seq;
    let AD_INFO_SEQ = accSeq;
    if(!AD_STORE_INFO_SEQ){
      // 저장 불가능 상황
      throw new Error('seq null');
    }
    try{

      const formData = new FormData();
        formData.append('AD_STORE_INFO_SEQ', AD_STORE_INFO_SEQ);
        formData.append('AD_INFO_SEQ', AD_INFO_SEQ);
        formData.append('FILE_TYPE_CD', division);
        uf_appendFileToFormData(formData, 'files', files.map(p=>p));

        console.log("formData : ", formData);
        await postUpload(formData);
        //alert('변경사항 저장이 완료되었습니다');
    }catch(e){
      alert('첨부파일 저장 중 오류가 발생했습니다\n' + e.message);
    }
  } 

  return (
    <>
      <div className='flex flex-col w-full mt-2'>
        <div className="flex relative shadow-sm mb-1">
          <input
            type='file'
            name={propertyName}
            multiple={multipled}
            className="w-full cursor-pointer font-size border-[1px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-2 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            onChange={multiUploadFile}
          />          
        </div>        
        <div className="overflow-x-auto bg-[#F3F4F6]">
          {
            // DB에 저장된 파일 리스트
            fileDb && fileDb.map((file, index) => {
              return (                
                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 mt-1 px-2">
                  <div className="flex flex-col col-span-8 p-1 font-size"><a href={file.FILE_NM} download>{file.name}</a></div>                  
                  <div className="flex flex-col col-span-4 p-1 cursor-pointer" onClick={(e) => funcFileDelete(e, file, file.AD_ATTACHMENTS_SEQ)}>
                    <svg className="h-5 w-5 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" 
                      strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  
                      <path stroke="none" d="M0 0h24v24H0z"/>  
                      <line x1="4" y1="7" x2="20" y2="7" />  
                      <line x1="10" y1="11" x2="10" y2="17" />  
                      <line x1="14" y1="11" x2="14" y2="17" />  
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                  </div>
                </div>                
              )
            })
          }
          {     
            // 사용자가 선택한 파일 리스트       
            files && files.map((file, index) => {
              return (                
                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 mt-1 px-2">
                  <div className="flex flex-col col-span-8 p-1 font-size"><a href={file.FILE_NM} download>{file.name}</a></div>                  
                  <div className="flex flex-col col-span-4 p-1 cursor-pointer" onClick={(e) => funcFileDelete(e, file, '')}>
                    <svg className="h-5 w-5 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" 
                      strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  
                      <path stroke="none" d="M0 0h24v24H0z"/>  
                      <line x1="4" y1="7" x2="20" y2="7" />  
                      <line x1="10" y1="11" x2="10" y2="17" />  
                      <line x1="14" y1="11" x2="14" y2="17" />  
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                  </div>
                </div>                
              )
            })
          }
        </div>
      </div>
    </>
  )

})
export default FileUpload;


const Input = ({title, className, name, onChange, onChangeValue, onChagneFiles, ...inputProps}) =>{
  const _onChagne = (e)=>{
    const files = Array.from(e.target.files);
    for (let index = 0; index < files.length; index++) {
      const file = files[index];      
      
    }
  }
  return(
    <label className="flex flex-row items-center bg-white"><span className="lg:w-80 sm:w-48 font-bold px-4">{title || name}</span>
      <input className="flex-1 bg-white px-4 py-2 border-l" name={name} onChange={_onChagne} {...inputProps}/>
    </label>
  );
}