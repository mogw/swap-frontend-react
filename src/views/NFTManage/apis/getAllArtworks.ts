import { useEffect, useState } from 'react'
import axios from 'axios'
import useToast from 'hooks/useToast'

// Approve CAKE auto pool
export const GetAllArtworks = () => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [artworks, setArtworks] = useState([])
  const { toastError } = useToast()

  useEffect(() => {
    setRequestedApproval(true)
    axios
      .get('http://localhost:5000/api/v0/nft/getAllArtworks')
      .then((res) => {
        setRequestedApproval(false)
        if (res.status) setArtworks(res.data.data)
      })
      .catch((err) => {
        setRequestedApproval(false)
        toastError(err.name, err.message)
      })
  }, [toastError])

  return { artworks, requestedApproval }
}
