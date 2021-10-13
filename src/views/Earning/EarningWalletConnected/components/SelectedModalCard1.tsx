// eslint-disable-next-line
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { fetchFarmUserDataAsync } from 'state/farms'
import { getBalanceAmount } from 'utils/formatBalance'
import { Button, Text } from '@spacegrimeswap/uikit'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import ConnectWalletButton from 'components/ConnectWalletButton'
import StakeAction from './StakeAction'
import useApproveFarm from '../../hooks/useApproveFarm'

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

const SelectedModalCard1: React.FC<{ farm: FarmWithStakedValue; account?: string; addLiquidityUrl?: string }> = ({
  farm,
  account,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = farm
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
  } = farm.userData || {}

  const allowance = new BigNumber(allowanceAsString)
  const tokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)
  const lpAddress = getAddress(lpAddresses)
  // const isApproved = account && allowance && allowance.isGreaterThan(0)
  const dispatch = useAppDispatch()

  const lpContract = useERC20(lpAddress)

  const { onApprove } = useApproveFarm(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account, pid])

  const renderApprovalOrStakeButton = () => {
    const isApproved = account && allowance && allowance.isGreaterThan(0)

    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={farm.lpSymbol}
        pair={getAddress(farm.lpAddresses)}
        pid={farm.pid}
        addLiquidityUrl={addLiquidityUrl}
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
      <StyledText style={{ fontSize: '18px' }}>{farm.lpSymbol + t(' Staked')}</StyledText>

      {!account ? <ConnectWalletButton scale="sm" /> : renderApprovalOrStakeButton()}
    </StyledCard>
  )
}

export default SelectedModalCard1
