import { Skeleton, Stack, keyframes, styled } from '@mui/material'
import React from 'react'

const TypingLoader = () => {
  return (
    <Stack 
    padding={"0.5rem"}
    spacing={"0.5rem"}
    direction={"row"}
    justifyContent={"center"}
    marginBottom={"1rem"}
    >
        <BouncingSkeleton variant='circular' width={15} height={15}
        sx={{
            animationDelay: "0.1s"
        }}/>
        <BouncingSkeleton variant='circular' width={15} height={15}
        sx={{
            animationDelay: "0.2s"
        }}/>
        <BouncingSkeleton variant='circular' width={15} height={15}
        sx={{
            animationDelay: "0.4s"
        }}/>
        <BouncingSkeleton variant='circular' width={15} height={15}
        sx={{
            animationDelay: "0.6s"
        }}/>
    </Stack>
  )
}

export default TypingLoader

const bounceAnimation = keyframes`
    0% {transform: scale(1);}
    50% {transform: scale(1.5);}
    100% {transform: scale(1);}
`

const BouncingSkeleton = styled(Skeleton)(() => ({
    animation: `${bounceAnimation} 1s infinite`
}))