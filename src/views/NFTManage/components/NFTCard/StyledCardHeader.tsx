import React from 'react'
import { CardHeader, Heading, Text, Flex } from '@spacegrimeswap/uikit'
import styled from 'styled-components'

const Wrapper = styled(CardHeader)<{ isChecked?: boolean }>`
  background: ${({ isChecked }) => (isChecked ? '#56195a' : '#70dce4')};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const StyledCardHeader: React.FC<{ cardTitle: string; description: string; isChecked?: boolean }> = ({
  cardTitle,
  description,
  isChecked = false,
}) => {
  return (
    <Wrapper isChecked={isChecked}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color={isChecked ? 'textDisabled' : 'body'} scale="lg">
            {cardTitle}
          </Heading>
          <Text color={isChecked ? 'textDisabled' : 'textSubtle'}>{description}</Text>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
