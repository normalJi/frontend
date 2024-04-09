// useCurrentUrl.js (커스텀 훅)
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useCurrentUrl = (callback) => {
  const router = useRouter();

  useEffect(() => {
    const handleUrlChange = () => {
      const currentUrl = router.asPath;
      callback(currentUrl);
    };

    // 페이지 로딩 시 초기 URL 체크
    handleUrlChange();

    // URL 변경 시 호출되는 이벤트 리스너 등록
    const routeChangeCompleteListener = () => handleUrlChange();
    router.events.on('routeChangeComplete', routeChangeCompleteListener);

    // 컴포넌트가 언마운트될 때 정리(clean-up) 함수를 반환
    return () => {
      router.events.off('routeChangeComplete', routeChangeCompleteListener);
    };
  }, [router, callback]);
};

export default useCurrentUrl;