import React from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getAddress } from 'utils/addressHelpers'
import { ModalContainer, InjectedModalProps, Text, ModalCloseButton } from '@spacegrimeswap/uikit'
import styled from 'styled-components'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import SelectedModalCard from './SelectedModalCard'
import SelectedModalCard1 from './SelectedModalCard1'
// import TopStakers from './TopStakers'

const StyledModal = styled(ModalContainer)`
  border: none;
  box-shadow: none;
  background: rgba(200, 205, 255, 0);
  position: relative;
  padding: 24px;
  // min-width: 1000px;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  .cancel {
    width: 30px;
    height: 30px;
    margin-top: 15px;
    margin-right: 20px;
  }
`

const StyledCard = styled.div`
  position: relative;
  padding: 24px;
  justify-content: center;
  font-family: 'Barlow';
  & Button {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  & img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0px;
  }
`

const StyledCardTitle = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

const Row = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`

const Col = styled.div`
  text-align: center;
  margin: 0 35px;
`

const NowLive = styled(Text)`
  color: white;
  font-size: 54px;
  display: inline;
  font-family: 'Poppins';
`

const LoremText = styled(Text)`
  background-color: #fa1db6;
  font-size: 54px;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline;
  font-family: 'Poppins';
`

const StyledCardText = styled(Text)`
  font-size: 20px;
  color: white;
  font-family: 'Barlow';
`

interface CurrencySearchModalProps extends InjectedModalProps {
  farm: FarmWithStakedValue
  earn: string
  account?: string
  addLiquidityUrl?: string
}

export default function CustomModal({
  onDismiss = () => null,
  farm,
  earn,
  account,
  addLiquidityUrl,
}: CurrencySearchModalProps) {
  const { t } = useTranslation()
  const { pid, lpAddresses } = farm
  const {
    // allowance: allowanceAsString = 0,
    // tokenBalance: tokenBalanceAsString = 0,
    // stakedBalance: stakedBalanceAsString = 0,
    earnings: earningsAsString = 0,
  } = farm.userData || {}

  const earnings = new BigNumber(earningsAsString)
  const lpAddress = getAddress(lpAddresses)

  return (
    <StyledModal minWidth="940px">
      <div style={{ textAlign: 'end' }}>
        <ModalCloseButton onDismiss={onDismiss} />
      </div>
      <StyledCard>
        <img
          style={{ width: '179px !important', height: '179px !important' }}
          src="/images/earning/X2 Token.png"
          alt="card-logo"
        />
        <StyledCardTitle>
          <NowLive>
            <LoremText>{t(`${farm.lpSymbol}`)}</LoremText>
            {t(` to ${earn}`)}
          </NowLive>
          <StyledCardText>{t('Deposite GRIMEX Tokens and earn X2')}</StyledCardText>
        </StyledCardTitle>
        <Row>
          <Col>
            <SelectedModalCard earning={earnings} pid={pid} pair={lpAddress} />
          </Col>
          <Col>
            <SelectedModalCard1 farm={farm} account={account} addLiquidityUrl={addLiquidityUrl} />
          </Col>
        </Row>
        <StyledCardText style={{ textAlign: 'center' }}>
          {t('Every time you stake and unstake LP tokens, the contract will automatically harvest X2 rewards for you!')}
        </StyledCardText>
        {/* <TopStakers /> */}
      </StyledCard>
    </StyledModal>
  )
}
