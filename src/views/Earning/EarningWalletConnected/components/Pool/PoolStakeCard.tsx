// eslint-disable-next-line
import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { Pool } from 'state/types'
import { getBalanceAmount } from 'utils/formatBalance'
import { Button, Text } from '@spacegrimeswap/uikit'
import { PoolCategory } from 'config/constants/types'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useApprovePool } from '../../../hooks/useApprove'
import PoolStakeAction from './Actions/PoolStakeAction'

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

const PoolStakeCard: React.FC<{
  pool: Pool
  account?: string
}> = ({ pool, account }) => {
  const { t } = useTranslation()
  const {
    allowance: allowanceAsString = 0,
    stakingTokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
  } = pool.userData || {}
  const [isApproved, setIsApproved] = useState(false)

  // const allowance = new BigNumber(allowanceAsString)
  const stakingTokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)
  // const earnings = new BigNumber(earningsAsString)
  // const lpAddress = getAddress(pool.contractAddress)
  // const isApproved = account && allowance && allowance.isGreaterThan(0)
  // const dispatch = useAppDispatch()

  useEffect(() => {
    const allowance = new BigNumber(allowanceAsString)
    const isAppr = account && allowance && allowance.isGreaterThan(0)
    setIsApproved(isAppr)
  }, [account, allowanceAsString])

  const { sousId, stakingToken, earningToken, poolCategory } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const isStaked = stakedBalance.gt(0)
  // const needsApproval = !allowance.gt(0) && !isBnbPool
  // const isLoading = !userData

  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const { handleApprove, requestedApproval } = useApprovePool(stakingTokenContract, sousId, earningToken.symbol)

  const renderApprovalOrStakeButton = () => {
    // const isApproved = account && allowance && allowance.isGreaterThan(0)
    return isApproved ? (
      <PoolStakeAction
        pool={pool}
        stakingTokenBalance={stakingTokenBalance}
        stakedBalance={stakedBalance}
        isBnbPool={isBnbPool}
        isStaked={isStaked}
      />
    ) : (
      <Button scale="sm" disabled={requestedApproval} onClick={handleApprove}>
        {t('Approve')}
      </Button>
    )
  }

  return (
    <StyledCard>
      <img src="/images/earning/X2 Token_small.png" alt="card-logo" />
      <StyledText style={{ fontSize: '28px' }}>{getBalanceAmount(stakedBalance).toNumber()}</StyledText>
      <StyledText style={{ fontSize: '18px' }}>{pool.stakingToken.symbol + t(' Staked')}</StyledText>

      {!account ? <ConnectWalletButton scale="sm" /> : renderApprovalOrStakeButton()}
    </StyledCard>
  )
}

export default PoolStakeCard
