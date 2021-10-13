import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import useToast from 'hooks/useToast'

import { CardBody, Flex, CardRibbon, Button } from '@spacegrimeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { StyledCard, StyledCardInner } from './StyledCard'
import StyledCardHeader from './StyledCardHeader'

const StyledButton = styled(Button)<{ isChecked: boolean }>`
  background-color: ${({ isChecked }) => (isChecked ? '#fa1dbb' : '#1fc7d4')};
  padding: 10px 35px;
  border-radius: 30px;
  font-family: Barlow;
  text-align: center;
  font-weight: 100;
  text-shadow: 0 0 10px, 0 0 10px;
`

export interface NFTArt {
  artworkType: string
  artworkName: string
  artistName: string
  portfolioURL: string
  description: string
  royalties: number
  filePath: string
  hash: string
  isChecked: boolean
}

const NFTCard: React.FC<{ cardTitle: string; description: string; isChecked: boolean; hash: string }> = ({
  cardTitle,
  description,
  isChecked,
  hash,
}) => {
  const { t } = useTranslation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const handleButton = () => {
    const formData = new FormData()
    formData.append('hash', hash)

    const requestUrl = isChecked
      ? 'http://localhost:5000/api/v0/nft/uncheckArtwork'
      : 'http://localhost:5000/api/v0/nft/checkArtwork'

    const msg = isChecked ? 'Uncheck Success' : 'Check Success'

    setRequestedApproval(true)
    axios
      .post(requestUrl, formData)
      .then((res) => {
        if (res.status) toastSuccess(msg)
        setRequestedApproval(false)
      })
      .catch((err) => {
        toastError(err.name, err.message)
        setRequestedApproval(false)
      })
  }

  return (
    <StyledCard isChecked={isChecked} ribbon={isChecked && <CardRibbon variantColor="primary" text={t('Checked')} />}>
      <StyledCardInner>
        <StyledCardHeader isChecked={isChecked} cardTitle={cardTitle} description={description} />
        <CardBody style={{ padding: '0px' }}>
          <Flex mt="6px" flexDirection="column">
            {/* <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
              {t('NFT Artwork Image')}
            </Text> */}
            <img
              src={`https://gateway.pinata.cloud/ipfs/${hash}`}
              alt="Artwork Img"
              style={{ borderRadius: '25px', marginBottom: '10px' }}
            />
            <StyledButton onClick={handleButton} isChecked={isChecked}>
              {isChecked ? 'Uncheck Artwork' : 'Check Artwork'}
            </StyledButton>
          </Flex>
        </CardBody>
      </StyledCardInner>
    </StyledCard>
  )
}

export default NFTCard
