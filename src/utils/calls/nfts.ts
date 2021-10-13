import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_MINT_NFT_FEE } from 'config'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const mintNFT = async (nftContract, tokenID) => {
  const tx = await nftContract.mint(tokenID, {
    gasLimit: DEFAULT_GAS_LIMIT,
    value: `0x${DEFAULT_MINT_NFT_FEE.toString(16)}`,
  })
  const receipt = await tx.wait()
  return receipt.status
}

export const burnNFT = async (nftContract, address, tokenID) => {
  const tx = await nftContract.burn(address, tokenID, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const getTokenURI = async (nftContract, address, tokenID) => {
  const uri = await nftContract.tokenURI(tokenID)
  return uri
}

// Exchange
export const buyToken = async (nftExchangeContract, tokenID) => {
  const tx = await nftExchangeContract.buyToken(tokenID, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const readyToSellToken = async (nftExchangeContract, tokenID, price) => {
  const tx = await nftExchangeContract.readyToSellToken(tokenID, price, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const cancelSellToken = async (nftExchangeContract, tokenID) => {
  const tx = await nftExchangeContract.cancelSellToken(tokenID, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const setCurrentPrice = async (nftExchangeContract, tokenID, price) => {
  const tx = await nftExchangeContract.setCurrentPrice(tokenID, price, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const getAskLength = async (nftExchangeContract) => {
  const askLen = await nftExchangeContract.getAskLength()
  return askLen
}

export const getAsks = async (nftExchangeContract) => {
  const askLen = await nftExchangeContract.getAsks()
  return askLen
}

export const getAsksDesc = async (nftExchangeContract) => {
  const askLen = await nftExchangeContract.getAsksDesc()
  return askLen
}

export const getAsksByPage = async (nftExchangeContract, page, size) => {
  const askLen = await nftExchangeContract.getAsksByPage(page, size)
  return askLen
}

export const getAsksByPageDesc = async (nftExchangeContract, page, size) => {
  const askLen = await nftExchangeContract.getAsksByPageDesc(page, size)
  return askLen
}

export const getAsksByUser = async (nftExchangeContract, user) => {
  const askLen = await nftExchangeContract.getAsksByUser(user)
  return askLen
}

export const getAsksByUserDesc = async (nftExchangeContract, user) => {
  const askLen = await nftExchangeContract.getAsksByUserDesc(user)
  return askLen
}
