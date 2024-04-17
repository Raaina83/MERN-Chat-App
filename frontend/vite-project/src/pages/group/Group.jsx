import { Grid, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';

function Group() {
  const navigate = useNavigate()
  const navigateBack = () => {
    navigate("/")
  }

  const IconBtns = <>
  <Tooltip>
    <IconButton sx={{
      position: "absolute",
      top: "2rem",
      left: "2rem",
      bgcolor: "#003300",
      color: "white",
      ":hover": {
        bgcolor: "black"
      }
    }}
    onClick={navigateBack}>
      <KeyboardBackspaceIcon/>
    </IconButton>
  </Tooltip>
  </>

  return (
    <Grid container height={"100vh"}>
      <Grid item
      sx={{
        display: {
          xs: "none",
          sm: "block"
        }
      }}
      sm={4}
      bgcolor={"bisque"}
      >GroupsList</Grid>

      <Grid
      item
      xs={12}
      sm={8}
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "1rem 3rem",
        alignItems: "center",
        position: "relative"
      }}
      >{IconBtns}</Grid>
    </Grid>
  )
}

export default Group