import React from 'react'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext
} from 'next/document'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const cache = createCache()
    const initialProps = await Document.getInitialProps(ctx)
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => (
          <StyleProvider cache={cache}>
            <App {...props} />
          </StyleProvider>
        )
      })

    const style = extractStyle(cache, true)
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style dangerouslySetInnerHTML={{ __html: style }} />
        </>
      )
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            property='fb:app_id'
            content={process.env.NEXT_PUBLIC_FB_APP_ID}
          />
          {/* viewport */}
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          {/* robot */}
          <meta name='robots' content='index, follow' />
          {/* favicon */}
          <link rel='icon' href='/assets/favicon.ico' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
