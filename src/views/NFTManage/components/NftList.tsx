import React from 'react'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'

import { GetAllArtworks } from '../apis/getAllArtworks'
import NFTCard from './NFTCard'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const NftList = () => {
  const { artworks, requestedApproval } = GetAllArtworks()
  console.log(artworks)

  return (
    <CardLayout>
      {artworks.map((art) => (
        <NFTCard
          key={art.hash}
          cardTitle={art.artworkName}
          description={art.description}
          isChecked={art.isChecked}
          hash={art.hash}
        />
      ))}
    </CardLayout>
  )
}

export default NftList
