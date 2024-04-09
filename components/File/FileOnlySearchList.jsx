'use client';



const FileOnlySearchList = ({fileList, label}) => {  
  return (
    <div className="relative mb-2">
      <div className='flex w-full mt-2 items-center'>
        <div className='w-26 flex'>
          <label className="ml-3 mr-3 text-black font-size">{label}</label>
        </div>        
        <div className='flex flex-col w-full mt-2'>      
          <div className="overflow-x-auto">
            {
              // DB에 저장된 파일 리스트
              fileList && fileList.map((file, index) => {
                return (                
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-12 mt-1 px-2">
                    <div className="flex flex-col col-span-8 p-1 font-size"><a href={file.FILE_NM} download>{file.ORI_FILE_NM}</a></div>
                  </div>
                )
              })
            }        
          </div>
        </div>        
      </div> 
    </div>
  );
}

export default FileOnlySearchList;