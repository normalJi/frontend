'use client'
import {useState, useMemo, useRef, useEffect, useCallback, forwardRef, useImperativeHandle} from 'react';
import { FileSelector } from '@/components/File/FileSelector';
import Image from 'next/image';
import Axios from '@/components/common/api/Axios';
import { useAxiosWithFile } from '@/hooks/useAxiosWithFile';
import { uf_appendFileToFormData } from '@/components/common/util/Util';
import {BeatLoader, SyncLoader}  from "react-spinners";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import cn from '@/components/common/util/ClassName';

export const StorePictureManager = forwardRef(function StorePictureManager({ className, seq }, ref){

  const MAX_PICTURE_COUNT = 30;
  const [reload, setReload] = useState(Date.now());
  const [pictures, setPictures] = useState([]);
  const selectorRef = useRef(null);
  const scrollRef = useRef(null);
  const isExists = useMemo(()=>pictures?.length > 0, [pictures]);
  const { post: postUpload, isLoading: uploadLoading } = useAxiosWithFile('/api/v1/store/picture/upload');

  /** 유효 사진 수 (전체 사진 수 - 삭제 사진 수) */
  const validPictureCount = useMemo(()=>{
    return pictures.length - pictures.filter(p=>p.delete).length;
  },[pictures]);

  /** 변경사항 저장 버튼을 활성화 시킬지 여부 */
  const canSelfSave = useMemo(()=>seq && pictures?.filter(p=>p.isModified).length > 0, [seq, pictures]);

  /** 삭제버튼(현재는 따로 없음, 변경사항 저장버튼 같이씀) 활성화 시킬지 여부 */
  const canSelfDelete = useMemo(()=>seq && pictures?.filter(p=>p.delete).length > 0, [seq, pictures]);

  useEffect(()=>{
    if(!seq) return;

    Axios.post('/api/v1/store/picture/list', { AD_STORE_INFO_SEQ: seq })
    .then(res=>{
      setPictures(res.data?.files.map(f=>{
        return {
          src: f,
          file: {
            id: f.AD_STORE_FILE_SEQ,
            name: f.ORI_FILE_NM,
            url: f.FILE_NM,
            size: f.FILE_SIZE
          }
        }
      }) || []);
    });
  }, [seq, reload]);
  
  /** 사진 등록 버튼 클릭 */
  const onClickRegister = ()=>{
    selectorRef.current?.openFileDialog();
  }

  /** 사진 추가시 호출 */
  const onAddNewFiles = useCallback((files)=>{
    if(files.length <= 0) {
      return;
    }

    let newListItem = files.map(file=>{return {isModified: true, isNew: true, file}});
    if(!pictures || pictures.length <= 0 ){
      //리스트가 비어 있으면 바로 추가 후 종료
      setPictures(newListItem);
      return;
    }

    let newPictures = pictures.filter(p=>p.isNew);

    newListItem = newListItem.filter(f=>
      !newPictures.find(p=>
        p.file.name === f.file.name 
        && p.file.size === f.file.size 
        && p.file.type === f.file.type
        )
      );

    setPictures([...newListItem, ...pictures]);

  },[pictures, setPictures]);

  /**
   * 변경사항 저장 or 상위에서 save호출시 호출됨
   * seq가 없는 상태일때는 작동 안함
   * @param {number?} newSeq 현재 store seq
   */
  const _save = async (newSeq) =>{
    let AD_STORE_INFO_SEQ = seq || newSeq;
    if(!AD_STORE_INFO_SEQ){
      // 저장 불가능 상황
      throw new Error('seq null');
    }
    try{


      if(validPictureCount > MAX_PICTURE_COUNT){
        alert('등록 사진이 30장을 초과했습니다\n30장이하로 조절 후 다시 시도하세요');
        return;
      }
      const savePictures = pictures.filter(p=> p.isModified);
  
      const newPictures = savePictures.filter(p=>p.isNew);
      const removePictures = savePictures.filter(p=>p.delete && p.file?.id);
  
      if(removePictures.length > 0){
        //사진 삭제
        await Axios.post('/api/v1/store/picture/remove', { AD_STORE_FILE_SEQ: removePictures.map(p=>p.file.id)});
      }
      if(newPictures.length > 0){
        // 추가된 사진 저장
        const formData = new FormData();
        formData.append('AD_STORE_INFO_SEQ', AD_STORE_INFO_SEQ);
        uf_appendFileToFormData(formData, 'files', newPictures.map(p=>p.file));
        
        await postUpload(formData);
      }

      if(!newSeq){
        alert('변경사항 저장이 완료되었습니다');
      }      
      setReload(Date.now());
    }catch(e){
      alert('변경사항 저장 중 오류가 발생했습니다\n' + e.message);
    }
  }  

  /** ref 정의 */
  useImperativeHandle(ref, ()=>{
    return {
      save(seq){
        _save(seq);
      },
      getPictures(){
        return pictures;
      }
    }
  })

  return (    
    <div className={cn("flex flex-col", className)}>
      <div className="locationTitle">매장사진<span className="red">*</span></div>
      <div className="locationText">최대 30장까지 등록 가능합니다.<br/>9:16 비율의 이미지를 권장합니다.</div>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row gap-3 '>
          <_Button onClick={onClickRegister} disabled={uploadLoading} >사진 등록</_Button>          
          {(seq) && <_Button disabled={!canSelfSave && !canSelfDelete} isLoading={uploadLoading} onClick={()=>_save()} >변경사항 저장</_Button>}
        </div>        
        <div><span className={validPictureCount > MAX_PICTURE_COUNT ? 'text-meta-1' : null}>{validPictureCount}</span> / {MAX_PICTURE_COUNT}</div>
      </div>
      <div className='flex flex-col flex-1 mt-1 overflow-y-auto px-2 bg-[#F3F4F6]'>
        <FileSelector 
          ref={selectorRef}
          className={cn("flex-1 px-0 py-0 border-none w-full mt-15", !isExists && 'hover:cursor-pointer')}  
          disableClick={isExists}
          multiple
          accept="image/*"
          onAddFiles={onAddNewFiles}>
          {isExists ? <StorePictureList ref={scrollRef} pictures={pictures} onAction={({index, picture, action, value})=>{
            let newPictures = [...pictures];
            if(action === 'delete'){
              if(picture.isNew){
                //신규 이미지의 경우 바로 제거
                newPictures.splice(index, 1);
              }else{
                newPictures[index] = {...picture, isModified: value, delete: value}
              }
            }
            setPictures(newPictures)
          }} /> : <div className='text-center'>등록된 사진이 없습니다<br/>사진등록 버튼이나 사진을 끌어다 놓아 등록하세요</div>}
        </FileSelector>
      </div>
      {/* <div className="imgRegiBtnWrap"><button className="imgRegiBtn">사진 등록</button></div> */}
    </div>		
  )
})

/**
 * 사진 리스트 Wrapper
 */
const StorePictureList = forwardRef(function StorePictureList({pictures, onAction }, ref){
  return (<div className="w-full grid grid-flow-row grid-cols-5 gap-2">
    {
      pictures.map((p, index)=>{
        const cursor = index === 0;
        return <StorePictureListItem ref={cursor ? ref : null} key={`store-image-${p.file.id || p.file.name}`}  picture={p} onAction={(payload)=>{
          onAction && onAction({ ...payload, index})
        }}/>;
      })
    }
  </div>)
})

/**
 * 리스트 내 사진
 */
const StorePictureListItem = forwardRef(function StorePictureNewListItem({picture, onAction, ...props}, ref){
  const { file } = picture;
  const [url, setUrl] = useState(file.url);

  const type = file.url ? 'url' : 'dataUrl';

  const onClick = ()=>{
    if(type === 'url'){
      window.open(`/popup/image?type=url&src=${encodeURIComponent(url)}`, '_blank', "width=1000px,height=600px,scrollbars=yes");
      return;
    }

    const key = `popupDataUrl-${Math.random()}`;
    sessionStorage.setItem(key, url);
    window.open(`/popup/image?type=dataUrl&src=${encodeURIComponent(key)}`, '_blank', "width=1000px,height=600px,scrollbars=yes");
  }

  useEffect(()=>{
    if(!file || file.url) return;
    const reader = new FileReader();
    reader.onload = (e)=>{
      setUrl(e.target.result);
    }
    reader.readAsDataURL(file);
  },[file]);

  return (
    <div ref={ref} className={cn(
        'col-span-1 border border-bodydark2',  
        picture.isNew && "border-2 border-primary", //추가된 경우 테두리
        picture.delete && "border-2 border-meta-1" //삭제시 테두리
      )}>
      <div className='aspect-square relative w-full h-full' onClick={onClick}>
        {!url ? null: <Image className="object-contain w-full h-full" src={url} alt={file?.name} width={256} height={256} {...props}/>}
      </div>
      <div className='relative w-full h-0 overflow-visible flex flex-row justify-end bottom-10 right-2 hover:cursor-pointer' title='삭제'>
        <_Button className={cn(
          "w-8 h-8 px-px py-px bg-white rounded border flex items-center justify-center",
          picture.delete ? "bg-meta-1" : 'border-meta-1', //삭제시 버튼 색지정
          picture.isNew && "bg-primary border-0" //추가된 경우 버튼 색지정
        )}
          onClick={()=>{ onAction && onAction({ action: 'delete', value: !picture.delete , picture})}}
        >
          {picture.delete || picture.isNew ? <FaCheck className="w-4 h-4" color="white"/>: <FaTrashAlt className="w-4 h-4" color="red"/>}          
        </_Button>
      </div>
    </div>
  )
})

const _Button = ({title, className, disabled, children, isLoading, ...props}) =>{
  return (
    <button 
      className={
        cn(
          "px-4 py-2 rounded text-white text-xs bg-primary"
        , isLoading && "flex flex-row items-center"
        , disabled && "bg-bodydark"
        , className
        )
      }
      disabled={disabled || isLoading}
      {...props}
    >
      <>
      {isLoading ? <BeatLoader className='mr-2' loading={isLoading} color={'white'} size={3}/> : null }
      {children || title}
      </>
    </button>
  )
}