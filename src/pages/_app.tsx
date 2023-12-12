import type { AppProps } from "next/app";
import Head from "next/head";
import "~/styles/globals.css";
import "highlight.js/styles/github.min.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>reader markdown</title>
        <meta name="description" content="read markdown file by web" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
