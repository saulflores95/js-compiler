import Compiler from '../src/compiler/container'
import Head from 'next/head'

export default () => (
  <div>
    <Head>
      <meta name='viewport' content='initial-scale=1.0, width=device-width maximum-scale=1.0, user-scalable=no' />
      <meta name='theme-color' content='white' />
      <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' />
      <style>
        {`
        body{
          background-color: white;
          width: 100%;
          height: 100%;
          margin: 0;
          top: 0;
          background-color: rgb(234, 234, 234);
          font-family: 'Montserrat', sans-serif;
        }
        html {
          height: 100%;
          width: 100%;
          margin: 0;
          top: 0;
          box-sizing: border-box;
        }
        #__next {
          height: 100%;
        }
        `}
      </style>
    </Head>
    <Compiler />
  </div>
)
