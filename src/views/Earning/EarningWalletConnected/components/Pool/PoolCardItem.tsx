import React from 'react'
import styled from 'styled-components'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { Button, useModal } from '@spacegrimeswap/uikit'
import { getBalanceAmount } from 'utils/formatBalance'
import PoolCardSelectedModal from './PoolCardSelectedModal'

const StyledCard = styled.div`
  position: relative;
  background: rgba(200, 205, 255, 0.63);
  border: 2px solid #c6c9ec;
  border-radius: 30px;
  box-shadow: 0 0 30px 5px rgba(99, 107, 222);
  width: 240px;
  min-width: 200px;
  padding: 24px 10px;
  justify-content: center;
  font-family: 'Barlow';
  margin: 0 12px 32px 12px;
  & Button {
    display: block;
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    bottom: 10px;
    left: 70px;
  }
  & img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 61px !important;
    height: 61px !important;
    margin-bottom: 12px;
  }
  // opacity: 0.4;
  &:hover {
    background: rgba(200, 205, 255, 1);
  }
`

const StyledCardTitle = styled.div`
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
`

const Row = styled.div`
  align-items: start;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  margin-bottom: 4px;
  padding: 4px 12px 4px 12px;
`

const ColLeft = styled.div`
  text-align: left;
`

const ColLeftMin = styled.div`
  text-align: left;
  font-size: 12px;
`

const ColRight = styled.div`
  text-align: right;
  word-break: break-word;
`

const ColRightMin = styled.div`
  text-align: right;
  font-size: 12px;
`

const PoolCardItem: React.FC<{ pool: Pool; account?: string }> = ({ pool, account }) => {
  const { t } = useTranslation()

  const [onCardClick] = useModal(<PoolCardSelectedModal pool={pool} account={account} />)

  return (
    <StyledCard>
      <img src="/images/earning/cardlogo.png" alt="card-logo" />
      <br />
      <StyledCardTitle>{t(`${pool.stakingToken.symbol} to ${pool.earningToken.symbol}`)}</StyledCardTitle>
      <Row>
        <ColLeft>{t('Stake:')}</ColLeft>
        <ColRight>{t(`${getBalanceAmount(pool.userData.stakedBalance)} ${pool.stakingToken.symbol}`)}</ColRight>
      </Row>
      <Row>
        <ColLeft>{t('Earn:')}</ColLeft>
        <ColRight>{t(`${getBalanceAmount(pool.userData.pendingReward)} ${pool.earningToken.symbol}`)}</ColRight>
      </Row>
      <Row>
        <ColLeft>{t('APR:')}</ColLeft>
        <ColRight>{t(`${pool.apr}`)}</ColRight>
      </Row>
      <br />
      <Row>
        <ColLeftMin>{t('Total staked:')}</ColLeftMin>
        <ColRightMin>{t(`${getBalanceAmount(pool.totalStaked)}`)}</ColRightMin>
      </Row>
      <Row>
        <ColLeftMin>{t('End in:')}</ColLeftMin>
        <ColRightMin>{t(`${pool.endBlock} block`)}</ColRightMin>
      </Row>
      <Row>
        <ColLeftMin>{t('Max stake per user:')}</ColLeftMin>
        {/* <ColRightMin>{t(`${getBalanceAmount(pool.stakingLimit)}`)}</ColRightMin> */}
        <ColRightMin style={{ width: '50px', overflow: 'hidden', textOverflow: 'clip' }}>
          {t(`${pool.stakingLimit}`)}
        </ColRightMin>
      </Row>
      <br />
      <br />
      <Button
        onClick={onCardClick}
        style={{ color: 'black', backgroundImage: 'linear-gradient(180deg, #19fff4, #abffb0)' }}
        scale="sm"
      >
        {t('SELECT')}
      </Button>
    </StyledCard>
  )
}

export default PoolCardItem
