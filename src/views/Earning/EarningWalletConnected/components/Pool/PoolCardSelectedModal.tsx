import React from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getAddress } from 'utils/addressHelpers'
import { ModalContainer, InjectedModalProps, Text, ModalCloseButton } from '@spacegrimeswap/uikit'
import { Pool } from 'state/types'
import styled from 'styled-components'
// import TopStakers from '../TopStakers'
import PoolHavestCard from './PoolHavestCard'
import PoolStakeCard from './PoolStakeCard'

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

interface PoolCardSelectedModalProps extends InjectedModalProps {
  pool: Pool
  account?: string
}

export default function CustomModal({ onDismiss = () => null, pool, account }: PoolCardSelectedModalProps) {
  const { t } = useTranslation()
  const { pendingReward: earningsAsString = 0 } = pool.userData || {}

  const earnings = new BigNumber(earningsAsString)

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
            <LoremText>{t(`${pool.stakingToken.symbol}`)}</LoremText>
            {t(` to ${pool.earningToken.symbol}`)}
          </NowLive>
          <StyledCardText>
            {t(`Deposite ${pool.stakingToken.symbol} and earn ${pool.earningToken.symbol}`)}
          </StyledCardText>
        </StyledCardTitle>
        <Row>
          <Col>
            <PoolHavestCard pool={pool} earning={earnings} scaddress={getAddress(pool.contractAddress)} />
          </Col>
          <Col>
            <PoolStakeCard pool={pool} account={account} />
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
