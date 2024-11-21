import styled from 'styled-components'

export const Container = styled.div`
  // max-width: 1440px;
  @media (min-width: 768px) {
    margin-top: 0;
    margin-bottom: 0;
  }
  @media (min-width: 1025px) {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  @media (min-width: 1200px) {
    margin-top: 30px;
    margin-bottom: 40px;
  }
`

export const SocialBar = styled.div`
  background-color: #1e315c;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 80px;

  @media (min-width: 768px) {
    height: 63px;
  }
  @media (min-width: 992px) {
    height: 68px;
  }
`

export const SocialButton = styled.div`
  background-color: #1e315c;
  justify-content: space-evenly;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0;
`

export const SocialBarBot = styled.div<{ img: string }>`
  background-color: grey;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 20px;
  /* height: 29px; */

  background-image: url(${(props) => props.img});
  background-size: 250%;

  @media (min-width: 768px) {
    height: 51px;
    background-size: 100%;
  }
  @media (min-width: 992px) {
    height: 61px;
    background-size: 100%;
  }
`

export const ReviewBar = styled.div<{ bgColor?: string }>`
  transition-timing-function: cubic-bezier(0.11, 0.59, 0.46, 0.9);
  transition-duration: 0.3s;
  background-color: ${(props) => props.bgColor};
  /* background-color: #dfceaf; */
  cursor: pointer;
  height: 43px;
  font-family: Georgia;
  font-size: 1.4em;
  align-items: center;
  justify-content: center;
  display: flex;
  @media (min-width: 768px) {
    height: 52px;
  }
  @media (min-width: 992px) {
    height: 65px;
  }
`

export const ReviewBarText = styled.div`
  padding-left: 15px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Georgia;
  @media (min-width: 768px) {
    // height: auto;
    font-size: 1.1em;
  }
  @media (min-width: 1200px) {
    font-size: 1.4em;
  }
`

export const HoverableScroll = styled.div<{ bgColor?: string }>`
  /* background-color: #dfceaf; */
  transition-timing-function: cubic-bezier(0.18, 0.89, 0.29, 0.96);
  transition-duration: 0.3s;
  background-color: ${(props) => props.bgColor};
  height: 43px;
  font-family: Georgia;
  font-size: 1.4em;
  align-items: center;
  justify-content: center;
  display: flex;
  @media (min-width: 768px) {
    height: 52px;
  }
  @media (min-width: 992px) {
    height: 65px;
  }
`

export const HoverableInnerScroll = styled.div`
  align-items: center;
  justify-content: center;
  display: inline-flex;
  gap: 0px;
  padding: 0%;
  font-size: 1.3rem;
  .ant-image {
    margin: 0px 5px;
  }
  @media (min-width: 600px) {
  }
  @media (min-width: 768px) {
    padding: 1%;
    gap: 10px;
    font-size: 1.7rem;
  }
`

export const SearchBar = styled.div<{ bgColor?: string }>`
  transition-timing-function: cubic-bezier(0.11, 0.59, 0.46, 0.9);
  transition-duration: 0.3s;
  background-color: ${(props) => props.bgColor};
  height: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (min-width: 768px) {
    // height: auto;
    font-family: Georgia;
    font-size: 1.4em;
  }

  :hover {
    color: black;
  }
`

export const SearchText = styled.div`
  padding-left: 15px;
  height: 100%;
  display: none;
  @media (min-width: 768px) {
    // height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Georgia;
    font-size: 1.1em;
  }
  @media (min-width: 1200px) {
    font-size: 1.4em;
  }
`

export const Logo = styled.div<{ img: string }>`
  height: 100%;
  width: 100%;
  background-image: url(${(props) => props.img});
  background-size: 109px;
  background-position-x: center;
  background-position-y: center;
  background-repeat: no-repeat;

  @media (min-width: 991px) {
    background-image: none;
    height: auto;
    width: auto;
  }
`

export const N2 = styled.div<{ img: string }>`
  background-image: url(${(props) => props.img});
  background-size: 26%;
  background-position-y: center;
  background-repeat: no-repeat;
  font-family: Georgia;
  padding: 25px;
  padding-left: 15%;
  h1 {
    margin: 0;
    font-size: 1.6rem;
  }
  h3 {
    margin: 0;
    font-size: 0.6rem;
    white-space: nowrap;
  }
  @media (max-width: 300px) {
    h1 {
      font-size: 1.4rem;
    }
    h3 {
      font-size: 0.6rem;
    }
  }
  @media (min-width: 768px) {
    height: auto;
    padding: 0;
    h1 {
      font-size: 2.2rem;
    }
    h3 {
      font-size: 1rem;
    }
    background-image: none;
  }
  @media (min-width: 1200px) {
    height: auto;
    h1 {
      font-size: 2.6rem;
    }
    h3 {
      font-size: 1.4rem;
    }
    background-image: none;
  }
`

export const N2Scroll = styled.div<{ img: string }>`
  background-image: url(${(props) => props.img});
  background-size: 45%;
  background-position-y: center;
  background-position-x: center;
  background-repeat: no-repeat;
  font-family: Georgia;
  padding: 18px 0;
  h1 {
    margin: 0;
    font-size: 0.8rem;
  }
  @media (min-width: 768px) {
    background-size: 37%;
    height: auto;
    padding: 20px;
    h1 {
      font-size: 1.6rem;
    }
  }
  @media (min-width: 992px) {
    background-size: 45%;
    padding: 0;
    height: auto;
    h1 {
      font-size: 2rem;
    }
    background-image: none;
  }
`
