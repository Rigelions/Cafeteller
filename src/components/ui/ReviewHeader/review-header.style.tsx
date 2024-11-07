import { ReactNode } from 'react'

export const TitlePattern = ({ img }: { img: string }) => (
  <div
    className='h-[100px] w-[30%] bg-100% border-b-0 md:hidden'
    style={{ backgroundImage: `url(${img})` }}
  />
)

export const TitleBox = ({ children }: { children: ReactNode }) => (
  <div className='flex h-[40px] items-center justify-between mb-[30px]'>
    {children}
  </div>
)
