import React, { useState } from 'react'
import { Button, TextField, Typography, Grid } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

export function RoomJoin(props) {
  const navigate = useNavigate()
  let [roomCode, setRoomCode] = useState('')
  let [error, setError] = useState('')

  const handleTextFieldChange = (e) => {
    console.log('text field changed', e.target.value)
    setRoomCode(e.target.value)
  }

  const handleRoomButtonPressed = (e) => {
    console.log({ roomCode })
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: roomCode,
      }),
    }
    // post data of room to join to backend
    fetch('/api/join-room', requestOptions)
      .then((response) => {
        // go to existing room
        if (response.ok) {
          navigate(`/room/${roomCode}`)
        } else {
          // room not exist
          setError('Room not found!')
          console.log('room not exist!', { response })
        }
      })
      .catch((err) => {
        console.log('err:', { err })
      })
    console.log('room button pressed with code:', roomCode)
  }
  return (
    <Grid container spacing={1} algin='center'>
      {/* Title */}
      <Grid item xs={12} algin='center'>
        <Typography variant='h4' component='h4'>
          Join Room
        </Typography>
      </Grid>
      {/* Enter roomCode textfield */}
      <Grid item xs={12} algin='center'>
        <TextField
          error={error}
          label='code'
          placeholder='Enter room code'
          value={roomCode}
          helperText={error}
          variant='outlined'
          onChange={handleTextFieldChange}
        ></TextField>
      </Grid>
      {/* Buttons */}
      <Grid item xs={12} algin='center'>
        <Button
          variant='contained'
          color='primary'
          onClick={handleRoomButtonPressed}
        >
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} algin='center'>
        <Button variant='contained' color='secondary' to='/' component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  )
}
