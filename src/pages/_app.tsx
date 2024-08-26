// src/pages/_app.tsx (for Pages Router)
import '../app/globals.css' // Adjust the path as necessary
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp