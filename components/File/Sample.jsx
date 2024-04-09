"use client";
import React from "react";
import { useState, useEffect } from "react";
import { customAlert, uf_appendFileToFormData } from "@/components/common/util/Util";
import { useAxiosWithFile } from "@/hooks/useAxiosWithFile";
import { FileSelector } from "./FileSelector";
import cn from "../common/util/ClassName";


export const FileSample = () => {
  const { post: onSubmit, isLoading} = useAxiosWithFile('/api/v1/dev/file/upload');

  return (
    <>
      <CaseDragAndDrop className="mt-8" onSubmit={onSubmit}/>
      <CaseForm className="mt-8" onSubmit={onSubmit} />
      <CaseManualFormData className="mt-8" onSubmit={onSubmit}/>
    </>
  );
};

const CaseForm = ({onSubmit,...props})=>{
  const upload = async (e)=>{
    e.preventDefault();
    onSubmit(new FormData(e.target));
  }

  return (
    <Case title="Form으로 사용" {...props}>
      <form className="py-px px-px flex flex-col gap-px bg-black" onSubmit={upload}>
        <Input type="text" name="textData" defaultValue={'이것은 테스트 text input'}/>
        <Input type="file" name="file1"/>
        <Input type="file" name="file2"/>
        <Input type="file" name="fileList" multiple/>
        <button className="py-2 bg-primary text-white" type="submit" >보내자</button>
      </form>
    </Case>
  );
}

const CaseManualFormData = ({onSubmit, ...props})=>{
  const [numberValue, setNumberValue] = useState(123123);
  const [stringValue, setStringValue] = useState('문자열 값');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [fileList, setFileList] = useState(null);

  const upload = async ()=>{
    // onSubmit(new FormData(e.target));

    console.log('numberValue', numberValue);
    console.log('stringValue', stringValue);
    console.log('file1', file1);
    console.log('file2', file2);
    console.log('fileList', fileList);

    const formData = new FormData();
    formData.append('numberValue', numberValue);
    formData.append('stringValue', stringValue);

    uf_appendFileToFormData(formData, 'file1', file1);
    uf_appendFileToFormData(formData, 'file2', file2);
    uf_appendFileToFormData(formData, 'fileList', fileList);

    onSubmit && onSubmit(formData);
  }

  return (
    <Case title="FormData 직접 구성" {...props}>
      <div className="py-px px-px flex flex-col gap-px bg-black">
        <Input type="number" name="numberData" value={numberValue} onChangeValue={setNumberValue} />
        <Input type="text" name="stringData" value={stringValue} onChangeValue={setStringValue} />
        <Input type="file" name="file1" onChagneFiles={setFile1} />
        <Input type="file" name="file2" onChagneFiles={setFile2} />
        <Input type="file" name="fileList" multiple onChagneFiles={setFileList} />
        <button className="py-2 bg-primary text-white" onClick={upload} >보내자</button>
      </div>
    </Case>
  );
}

const CaseDragAndDrop = ({onSubmit, ...props})=>{
  return (
    <Case title="Custom UI" {...props}>
      <FileSelector />
    </Case>
  )
}

const Case = ({title, className, children, ...props}) =>{
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <h2 className="ml-2 font-bold">{title}</h2>
      <div className="mt-2">
      {children}
      </div>
    </div>
  )
}

const Input = ({title, className, name, onChange, onChangeValue, onChagneFiles, ...inputProps}) =>{
  const _onChagne = (e)=>{
    onChange && onChange(e);

    onChangeValue && console.log(name, 'value', e.target.value);
    onChangeValue && onChangeValue(e.target.value);

    onChagneFiles && console.log(name, 'files', e.target.files);
    onChagneFiles && onChagneFiles(e.target.files);
  }
  return(
    <label className="flex flex-row items-center bg-white"><span className="lg:w-80 sm:w-48 font-bold px-4">{title || name}</span>
      <input className="flex-1 bg-white px-4 py-2 border-l" name={name} onChange={_onChagne} {...inputProps}/>
    </label>
  );
}