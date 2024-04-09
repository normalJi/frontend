'use client'
const useFileUpload = () => { 
  // 다중건 처리
  const multiUpload = async ({ target }) => {
    
    const { files } = target;
    
    const fileList = Array.from(files);
    
    const finishedList = [];
    fileList.forEach((file) => {
      const uploadedFile = file;    
      finishedList.push(uploadedFile)
    })
    
    return Promise.all(finishedList)
  }
  return { multiUpload }
}

export default useFileUpload;