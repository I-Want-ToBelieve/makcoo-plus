import styled from '@emotion/styled'

interface Props {
  $size: number
}

export const StyledCircleButton = <T extends 'a' | 'button'>(tag: T) => styled(
  tag
)<Props>`
  border: 3.2px solid #000000;
  background: #ffffff;
  text-decoration: none;
  color: #000000;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: unset;
  padding: 8px;
  transition: all 0.5s;
  ${({ $size }) => `
    width: ${$size * 16}px;
    height: ${$size * 16}px;
  `}

  &:is(:hover, :focus, :active) {
    // color: #ffffff;
    // background: #000000;
  }
`

export const StyledButton = StyledCircleButton('button')
export const StyledLink = StyledCircleButton('a')
