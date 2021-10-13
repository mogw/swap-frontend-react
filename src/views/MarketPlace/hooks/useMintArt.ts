import { useCallback } from 'react'
import { mintNFT, burnNFT, getTokenURI } from 'utils/calls'
import { useNftContract, useNftMintContract } from 'hooks/useContract'
import BigNumber from 'bignumber.js'

const useMintArt = (address: string) => {
  const nftContract = useNftContract()
  const nftMintContract = useNftMintContract()

  const handleMintArt = useCallback(
    async (tokenID: string) => {
      const txHash = await mintNFT(nftMintContract, tokenID)
      console.info(txHash)
    },
    [nftMintContract],
  )

  const handleBurnArt = useCallback(
    async (tokenID: string) => {
      const txHash = await burnNFT(nftContract, address, tokenID)
      console.info(txHash)
    },
    [nftContract, address],
  )

  const handleGetTokenURI = useCallback(
    async (tokenID: string) => {
      const tokenURI = await getTokenURI(nftContract, address, tokenID)
      return tokenURI
    },
    [nftContract, address],
  )

  return { onMintArt: handleMintArt, onBurnArt: handleBurnArt, onGetTokenURI: handleGetTokenURI }
}

export default useMintArt
