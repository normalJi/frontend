'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReactViewer = dynamic(
  () => import('react-viewer'),
  { ssr: false }
)
const ImagePopup = ()=>{

  const validOptions = [    
    'zoomIn',
    'zoomOut',
    'oneToOne',
    'reset',
    // 'prev',
    // 'play',
    // 'next',
    'rotateLeft',
    'rotateRight',
    'flipHorizontal',
    'flipVertical',
    'download'
  ]
	const searchParams = useSearchParams();

  const [type, setType] = useState('');  
  const [images, setImages] = useState([]);  

  useEffect(()=>{
    let type = searchParams?.get('type');
    let src = decodeURIComponent(searchParams?.get('src')|| '');


    // 타입이 추가 되고 기타 처리가 필요해질 경우
    if(type === 'dataUrl'){
      let key = src;
      src = sessionStorage.getItem(key);
      sessionStorage.removeItem(key);
    }

    setType(type);
    setImages([{ src, alt: src, downloadUrl: src }]);
  }, [])

  if(['url', 'dataUrl'].includes(type)){
    return <ReactViewer 
      visible
      noClose
      // downloadable
      zoomSpeed={0.5}
      minScale={0.5}
      noNavbar
      attribute={false}
      customToolbar={(toolbars)=>{
        // console.log(toolbars);
        return toolbars.filter(t=>validOptions.includes(t.key));
      }}
      images={images}
    />
  }
  
  return <div>불러오는 중 입니다</div>;
}

export default ImagePopup;