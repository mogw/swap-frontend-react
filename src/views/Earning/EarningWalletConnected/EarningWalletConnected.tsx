import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex } from '@spacegrimeswap/uikit'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import { getAddress } from 'utils/addressHelpers'
import { useFarms, usePollFarmsData, usePriceGrimexBusd } from 'state/farms/hooks'
import { useFetchPublicPoolsData, usePools, useCakeVault } from 'state/pools/hooks'
import Loading from 'components/Loading'
import isArchivedPid from 'utils/farmHelpers'
import { latinise } from 'utils/latinise'
import { Farm, Pool } from 'state/types'
import { getFarmApr } from 'utils/apr'
import { orderBy, partition } from 'lodash'
import Page from './components/Page'
import { TabStatus, EarningWalletTab } from './components/EarningWalletTab'
import WalletCardItem, { FarmWithStakedValue } from './components/WalletCardItem'
import PoolCardItem from './components/Pool/PoolCardItem'
import BaseLayout from '../../../components/BaseLayout'
import { BottomGradient, BottomGradientDark } from '../../../components/BottomGradient'
import { getAprData, getCakeVaultEarnings } from './helpers'

const StyledFlexLayout = styled(BaseLayout)`
  justify-content: center;
  margin: 24px;
  max-width: 1500px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
`

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 800px;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`

const EarningWalletConnected = () => {
  const { t } = useTranslation()
  const { data: farmsLP, userDataLoaded } = useFarms()
  const grimexPrice = usePriceGrimexBusd()
  const [query, setQuery] = useState('')
  const { account } = useWeb3React()
  const { pools: poolsWithoutAutoVault, userDataLoaded: userPoolDataLoaded } = usePools(account)
  const [newArray, setnewArray] = useState([])
  const [sortOption, setSortOption] = useState('hot')
  const [tabStatus, setTabStatus] = useState(TabStatus.TabHot)

  const {
    userData: { cakeAtLastUserAction, userShares },
    fees: { performanceFee },
    pricePerFullShare,
    totalCakeInVault,
  } = useCakeVault()
  // const accountHasVaultShares = userShares && userShares.gt(0)
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  const pools = useMemo(() => {
    // const cakePool = poolsWithoutAutoVault.find((pool) => pool.sousId === 0)
    // const cakeAutoVault = { ...cakePool, isAutoVault: true }
    return [/* cakeAutoVault, */ ...poolsWithoutAutoVault]
  }, [poolsWithoutAutoVault])

  // const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const [stakeGrimexPools, nonStakeGrimexPools] = useMemo(
    () => partition(pools, (pool) => pool.stakingToken.symbol === 'GRIMEX'),
    [pools],
  )
  const [earnGrimexPools, nonEarnGrimexPools] = useMemo(
    () => partition(pools, (pool) => pool.earningToken.symbol === 'GRIMEX'),
    [pools],
  )

  // const stakedOnlyFinishedPools = useMemo(
  //   () =>
  //     finishedPools.filter((pool) => {
  //       if (pool.isAutoVault) {
  //         return accountHasVaultShares
  //       }
  //       return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
  //     }),
  //   [finishedPools, accountHasVaultShares],
  // )

  // const stakedOnlyOpenPools = useMemo(
  //   () =>
  //     openPools.filter((pool) => {
  //       if (pool.isAutoVault) {
  //         return accountHasVaultShares
  //       }
  //       return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
  //     }),
  //   [openPools, accountHasVaultShares],
  // )
  // const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollFarmsData(false)
  useFetchPublicPoolsData()

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid))

  // const userDataReady = !account || (!!account && userDataLoaded && userPoolDataLoaded)
  // const earnGrimexFarms = farmsLP.filter(
  //   (farm) => farm.pid !== 0 && farm.multiplier !== '0X' && isEarnGrimexPid(farm.pid),
  // )
  // const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X' && !isArchivedPid(farm.pid))
  // const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid))

  const [isActive, setActive] = useState(true)

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteToken.busdPrice) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice)
        const lpAddress = getAddress(farm.lpAddresses)
        const { cakeRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(new BigNumber(farm.poolWeight), grimexPrice, totalLiquidity, lpAddress)
          : { cakeRewardsApr: 0, lpRewardsApr: 0 }

        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }
      return farmsToDisplayWithAPR
    },
    [grimexPrice, query, isActive],
  )

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms
      }
    }

    switch (tabStatus) {
      case TabStatus.TabHot:
        chosenFarms = farmsList(activeFarms)
        break
      case TabStatus.TabEarnGrimex:
        break
      case TabStatus.TabGrimexStaking:
        break
      case TabStatus.TabEarnNFT:
        break
      case TabStatus.TabNFTStaking:
        break
      case TabStatus.TabOthers:
        break
      case TabStatus.TabEnded:
        break
      default:
        break
    }

    return sortFarms(chosenFarms)
  }, [sortOption, activeFarms, farmsList, tabStatus])

  const chosenPoolsMemoized = useMemo(() => {
    let chosenPools
    const sortPools = (poolsToSort: Pool[]): Pool[] => {
      switch (sortOption) {
        case 'apr':
          // Ternary is needed to prevent pools without APR (like MIX) getting top spot
          return orderBy(
            poolsToSort,
            (pool: Pool) => (pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            poolsToSort,
            (pool: Pool) => {
              if (!pool.userData || !pool.earningTokenPrice) {
                return 0
              }
              return pool.isAutoVault
                ? getCakeVaultEarnings(
                    account,
                    cakeAtLastUserAction,
                    userShares,
                    pricePerFullShare,
                    pool.earningTokenPrice,
                  ).autoUsdToDisplay
                : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
            },
            'desc',
          )
        case 'totalStaked':
          return orderBy(
            poolsToSort,
            (pool: Pool) => (pool.isAutoVault ? totalCakeInVault.toNumber() : pool.totalStaked.toNumber()),
            'desc',
          )
        default:
          return poolsToSort
      }
    }
    chosenPools = []

    switch (tabStatus) {
      case TabStatus.TabHot:
        break
      case TabStatus.TabEarnGrimex:
        chosenPools = earnGrimexPools
        break
      case TabStatus.TabGrimexStaking:
        chosenPools = stakeGrimexPools
        break
      case TabStatus.TabEarnNFT:
        break
      case TabStatus.TabNFTStaking:
        break
      case TabStatus.TabOthers:
        break
      case TabStatus.TabEnded:
        break
      default:
        break
    }

    return sortPools(chosenPools)
  }, [
    sortOption,
    // pools,
    tabStatus,
    account,
    cakeAtLastUserAction,
    performanceFeeAsDecimal,
    pricePerFullShare,
    totalCakeInVault,
    userShares,
    stakeGrimexPools,
    earnGrimexPools,
  ])

  useEffect(() => {
    const initFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid))
    setnewArray(initFarms)
  }, [farmsLP])

  const callback = (status) => {
    setTabStatus(status)
  }
  const { theme } = useTheme()

  return (
    <Page>
      <StyledContent>
        <Heading as="h1" scale="xxl" fontFamily="Akira Expanded" color="white" mb="24px">
          {t('Earning')}
        </Heading>

        <EarningWalletTab getCardCount={callback} />

        <StyledFlexLayout>
          {chosenFarmsMemoized.map((farm) => (
            <WalletCardItem key={farm.pid} farm={farm} earn="GRIMEX" account={account} />
          ))}
          {chosenPoolsMemoized.map((pool) => (
            <PoolCardItem key={pool.sousId} pool={pool} account={account} />
          ))}
        </StyledFlexLayout>
      </StyledContent>
      {theme.isDark ? (
        <BottomGradientDark style={{ height: '100px', width: '100%', position: 'fixed', bottom: '0' }} />
      ) : (
        <BottomGradient style={{ height: '100px', width: '100%', position: 'fixed', bottom: '0' }} />
      )}

      {account && !userDataLoaded && (
        <Flex justifyContent="center">
          <Loading />
        </Flex>
      )}
    </Page>
  )
}

export default EarningWalletConnected
