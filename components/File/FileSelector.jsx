'use client';
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import cn from '../common/util/ClassName';

const _readAllFile = async (handler, files = []) => {
  if(handler.kind === 'file'){
    files.push(await handler.getFile());
    return files;
  }
  for await (const [name, childHandler] of handler.entries()){
    await _readAllFile(childHandler, files);
  }
  return files;
}

export const FileSelector = forwardRef(function FileSelector({
  title, className, 
  disableClick, dragOverClassName, children,
  onAddFiles, onDragOver, onDragEnter, onDragLeave, onDrop, onClick,
  webkitdirectory, accept, multiple, //input 용
  ...props}, ref){

  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      openFileDialog() {
        inputRef.current.click();
      }
    };
  }, []);

  const _onDrop = async (e)=>{
    if(onDrop && onDrop(e)){
      return;
    }
    e.preventDefault();

    if(!onAddFiles) return;    

    let files = [];
    if (e.dataTransfer.items) {      
      const supportsFileSystemAccessAPI = 'getAsFileSystemHandle' in DataTransferItem.prototype; //표준지원
      const supportsWebkitGetAsEntry = 'webkitGetAsEntry' in DataTransferItem.prototype; //TODO: 비표준 지원, 테스트필요.

      const handlerPromises = [...e.dataTransfer.items]
        .filter(item=>item.kind === 'file')
        .map((item, i) => {
          if(supportsFileSystemAccessAPI){
            return item.getAsFileSystemHandle();
          }
          if(supportsWebkitGetAsEntry){
            return item.webkitGetAsEntry();
          }
          return null;
        })
        .filter(entry=>entry);
      
      for await (const handler of handlerPromises){
        const foundFiles = await _readAllFile(handler);
        files.push(...foundFiles);
      }
    } else if(e.dataTransfer.files){
      files.push(...e.dataTransfer.files);
    }else{
      //알 수 없는 상태...
      onAddFiles(e);
      return;
    }    

    onAddFiles(files.filter(f=>f && (!accept || f.type.match(accept))));
  }

  const _onDragOver = (e)=>{
    if(onDragOver && onDragOver(e)) {
      return;
    }
    e.preventDefault();
  }

  const _onDragEnter = (e)=>{
    if(onDragEnter && onDragEnter(e)){
      return;
    }

    setIsDragging(true);
  }

  const _onDragLeave = (e)=>{
    if(onDragLeave && onDragLeave(e)){
      return;
    }
    setIsDragging(false);
  }

  const _onClick = (e)=>{
    onClick && onClick();

    inputRef.current?.click();
  }

  const onChangeFile = (e)=>{
    if(!onAddFiles) return;

    onAddFiles([...e.target.files]);
  }

  return (
    <div className={cn(
      "flex items-center justify-center"
      , !disableClick && "hover:cursor-pointer"
      , !isDragging && "border-2 border-dashed"
      , isDragging && "border-4 border-solid border-primary"
      , className
      , isDragging && dragOverClassName
      )} onDrop={_onDrop} onDragEnter={_onDragEnter} onDragOver={_onDragOver} onDragLeave={_onDragLeave} onClick={disableClick ? null :_onClick} {...props}>
      {
        children ? children : 
        <div>
          <div className="font-bold">{title || '파일 추가'}</div>
        </div>
      }      
      <input ref={inputRef} hidden type="file" multiple={multiple} onChange={onChangeFile} accept={accept} webkitdirectory={webkitdirectory ? 'true' : null}/>
    </div>
  )
});