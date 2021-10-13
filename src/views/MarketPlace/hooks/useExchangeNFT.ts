import { useCallback } from 'react'
import {
  buyToken,
  readyToSellToken,
  cancelSellToken,
  setCurrentPrice,
  getAskLength,
  getAsks,
  getAsksDesc,
  getAsksByPage,
  getAsksByPageDesc,
  getAsksByUser,
  getAsksByUserDesc,
} from 'utils/calls'
import { useExchangeNftContract } from 'hooks/useContract'
import BigNumber from 'bignumber.js'

const useExchangeNFT = () => {
  const exchangeNftContract = useExchangeNftContract()

  const handleBuyToken = useCallback(
    async (tokenID: string) => {
      const txHash = await buyToken(exchangeNftContract, tokenID)
      console.info(txHash)
    },
    [exchangeNftContract],
  )

  const handleReadyToSellToken = useCallback(
    async (tokenID: string, price: BigNumber) => {
      const txHash = await readyToSellToken(exchangeNftContract, tokenID, price)
      console.info(txHash)
    },
    [exchangeNftContract],
  )

  const handleCancelSellToken = useCallback(
    async (tokenID: string) => {
      const txHash = await cancelSellToken(exchangeNftContract, tokenID)
      console.info(txHash)
    },
    [exchangeNftContract],
  )

  const handleSetCurrentPrice = useCallback(
    async (tokenID: string, price: BigNumber) => {
      const txHash = await setCurrentPrice(exchangeNftContract, tokenID, price)
      console.info(txHash)
    },
    [exchangeNftContract],
  )

  const handleGetAskLength = useCallback(async () => {
    const txHash = await getAskLength(exchangeNftContract)
    console.info(txHash)
  }, [exchangeNftContract])

  const handleGetAsks = useCallback(async () => {
    const txHash = await getAsks(exchangeNftContract)
    console.info(txHash)
  }, [exchangeNftContract])

  const handleGetAsksDesc = useCallback(async () => {
    const txHash = await getAsksDesc(exchangeNftContract)
    console.info(txHash)
  }, [exchangeNftContract])

  const handleGetAsksByPage = useCallback(
    async (page, size) => {
      const txHash = await getAsksByPage(exchangeNftContract, page, size)
      console.info(txHash)
    },
    [exchangeNftContract],
  )

  const handleGetAsksByPageDesc = useCallback(
    async (page, size) => {
      const txHash = await getAsksByPageDesc(exchangeNftContract, page, size)
      console.info(txHash)
    },
    [exchangeNftContract],
  )

  const handleGetAsksByUser = useCallback(
    async (user) => {
      const txHash = await getAsksByUser(exchangeNftContract, user)
      console.info(txHash)
    },
    [exchangeNftContract],
  )

  const handleGetAsksByUserDesc = useCallback(
    async (user) => {
      const txHash = await getAsksByUserDesc(exchangeNftContract, user)
      console.info(txHash)
    },
    [exchangeNftContract],
  )

  return {
    onBuyToken: handleBuyToken,
    onReadyToSellToken: handleReadyToSellToken,
    onCancelSellToken: handleCancelSellToken,
    onSetCurrentPrice: handleSetCurrentPrice,
    onGetAskLength: handleGetAskLength,
    onGetAsks: handleGetAsks,
    onGetAsksDesc: handleGetAsksDesc,
    onGetAsksByPage: handleGetAsksByPage,
    onGetAsksByPageDesc: handleGetAsksByPageDesc,
    onGetAsksByUser: handleGetAsksByUser,
    onGetAsksByUserDesc: handleGetAsksByUserDesc,
  }
}

export default useExchangeNFT
