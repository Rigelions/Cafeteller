import React, { ComponentType } from 'react'
import Head from 'next/head'

interface LinkTag {
  rel: string
  href: string
  type?: string
}

interface MetaData {
  title?: string
  description?: string
  keywords?: string[]
  metaTags?: Array<{ name?: string; property?: string; content: string }>
  linkTags?: Array<LinkTag>
  [key: string]: any // For any additional meta properties
}

type MetaDataFunction<P> = (props: P) => MetaData

const withMeta = <P extends object>(
  WrappedComponent: ComponentType<P>,
  metaData: MetaData | MetaDataFunction<P>
) => {
  const HOC: React.FC<P> = (props) => {
    const meta = typeof metaData === 'function' ? metaData(props) : metaData

    return (
      <>
        <Head>
          {meta.title && <title>{meta.title}</title>}
          {meta.description && (
            <meta name='description' content={meta.description} />
          )}
          {meta.keywords && (
            <meta name='keywords' content={meta.keywords.join(', ')} />
          )}
          {meta.metaTags?.map((tag, index) =>
            tag.name ? (
              <meta key={index} name={tag.name} content={tag.content} />
            ) : (
              tag.property && (
                <meta
                  key={index}
                  property={tag.property}
                  content={tag.content}
                />
              )
            )
          )}
          {meta.linkTags?.map((link, index) => (
            <link
              key={index}
              type={link.type}
              rel={link.rel}
              href={link.href}
            />
          ))}
        </Head>
        <WrappedComponent {...props} />
      </>
    )
  }

  return HOC
}

export default withMeta
