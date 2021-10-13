import React from 'react'
import styled from 'styled-components'
import { Heading } from '@spacegrimeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import NftList from './components/NftList'

const StyledHero = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 32px;
`

const NFTManage = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledHero>
        <Heading as="h1" scale="xxl" color="secondary">
          {t('NFT Artworks Management')}
        </Heading>
      </StyledHero>
      <NftList />
    </Page>
  )
}

export default NFTManage
