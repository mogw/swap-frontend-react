// eslint-disable-next-line
import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import { getBalanceAmount } from 'utils/formatBalance'
import { Text } from '@spacegrimeswap/uikit'
import PoolHavestAction from './Actions/PoolHavestAction'

const StyledCard = styled.div`
  position: relative;
  background: rgba(200, 205, 255, 0.63);
  border: 2px solid #c6c9ec;
  border-radius: 30px;
  box-shadow: 0 0 30px 5px rgba(99, 107, 222);
  width: 236px;
  justify-content: center;
  font-family: 'Barlow';
  & Button {
    display: block;
    font-size: 14px;
    color: black;
    background-image: linear-gradient(180deg, #19fff4, #abffb0);
    margin: 7px auto;
  }
  & img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 150px !important;
    height: 150px !important;
    margin-bottom: 0;
  }
  // opacity: 0.4;
  &:hover {
    background: rgba(200, 205, 255, 1);
  }
`

const StyledText = styled(Text)`
  color: '#414076';
  font-weight: 'bold';
  font-family: 'Barlow';
`

const PoolHavestCard: React.FC<{ earning: BigNumber; scaddress: string; pool: Pool }> = ({
  earning,
  // scaddress,
  pool,
}) => {
  const { t } = useTranslation()

  return (
    <StyledCard>
      <img src="/images/earning/X2 Token_small.png" alt="card-logo" />
      <StyledText style={{ fontSize: '28px' }}>{t(`${getBalanceAmount(earning)}`)}</StyledText>
      <StyledText style={{ fontSize: '18px' }}>{t(`${pool.earningToken.symbol} Earned`)}</StyledText>
      <PoolHavestAction
        earnings={earning}
        earningToken={pool.earningToken}
        sousId={pool.sousId}
        earningTokenPrice={pool.earningTokenPrice}
        isBnbPool={false}
      />
    </StyledCard>
  )
}

export default PoolHavestCard
