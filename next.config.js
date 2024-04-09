/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    const proxies = [];
    if (process.env.SYSTEM === 'local') {
      proxies.push({
        source: '/storage/:path*',
        destination: 'http://localhost:9101/storage/:path*',
      });
    } else if(process.env.SYSTEM === 'dev') {
      //TODO: NAS를 public/storage 에 붙였을 경우 추가 셋팅 필요 없음. NAS위치에 따라 처리 필요.
      proxies.push({
        source: '/storage/:path*',
        destination: 'http://localhost:9101/storage/:path*',
      });
    }else if(process.env.SYSTEM === 'prod'){      
      proxies.push({
        source: '/storage/:path*',
        destination: 'http://localhost:9101/storage/:path*',
      });      
    }
    
    proxies.push({
      source: '/api/v1/:path*',
      destination: 'http://localhost:9101/api/v1/:path*',
    });
    return proxies;
  },
};

module.exports = nextConfig;
