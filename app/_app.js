import { Inter } from "next/font/google"; // 원하는 폰트 가져와서 사용하기
const inter = Inter({ subsets: ["Inter"] });

export default function MyApp({ Component, pageProps }) {

  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  );
}
