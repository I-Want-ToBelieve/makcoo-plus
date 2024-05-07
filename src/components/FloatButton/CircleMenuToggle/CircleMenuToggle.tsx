import { FC } from 'react'

import {
  StyledCircleMenuBurgerBar,
  StyledCircleMenuToggle,
} from './StyledCircleMenuToggle'

interface Props {
  size: number
  menuActive: boolean
  toggleMenu: () => void
  className?: string
}

export const CircleMenuToggle: FC<Props> = ({
  size = 1,
  menuActive = false,
  className,
  toggleMenu,
}) => {
  return (
    <StyledCircleMenuToggle
      className={className}
      onClick={toggleMenu}
      menuActive={menuActive}
      size={size}
    >
      <StyledCircleMenuBurgerBar />
      <StyledCircleMenuBurgerBar />
      <StyledCircleMenuBurgerBar />
    </StyledCircleMenuToggle>
  )
}
