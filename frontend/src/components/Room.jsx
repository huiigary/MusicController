import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Grid, Button, Typography } from '@mui/material'

export function Room(props) {
  const [votesToSkip, setVotesToSkip] = useState(0)
  const [guestsCanSkip, setGuestsCanSkip] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [roomCode, setRoomCode] = useState('')

  const params = useParams() // to get roomID typed in URL
  const navigate = useNavigate() // to navigate URLs
  const clearRoomCode = () => setRoomCode(null)

  useEffect(() => {
    const getRoomDetails = async () => {
      await fetch(`/api/get-room?code=${params.roomCode}`) // TODO: make this roomCode
        .then((response) => {
          // if no response, clear roomcode and go back to home
          if (!response.ok) {
            clearRoomCode()
            navigate('/')
          }
          return response.json()
        })
        .then((data) => {
          console.log('get room data is:', { data })
          setVotesToSkip(data.votes_to_skip)
          setGuestsCanSkip(data.guests_can_pause)
          setIsHost(data.is_host)
        })
    }

    setRoomCode(params.roomCode)
    console.log('room code is:', params?.roomCode, { roomCode }) // note: calling setState doesnt change state in the running code--> Need to save the nextState in the
    getRoomDetails()
  }, [])

  const leaveRoomPressed = () => {
    // create requestOptions for a POST request
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch(`/api/leave-room`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log('leave room data:', { data })
        // if we leave room, redirect to the home page
        navigate('/')
      })
  }

  return (
    <Grid container>
      <Grid item xs={12} algin='center'>
        <Typography variant='h3'>{roomCode}</Typography>
      </Grid>
      <Grid item xs={12} algin='center'>
        <Typography variant='h6'>Votes to skip : {votesToSkip}</Typography>
      </Grid>
      <Grid item xs={12} algin='center'>
        <Typography variant='h6'>
          Guests can skip: {guestsCanSkip?.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} algin='center'>
        <Typography variant='h6'>isHost? {isHost?.toString()}</Typography>
      </Grid>

      <Button
        variant='contained'
        algin='center'
        color='secondary'
        onClick={leaveRoomPressed}
      >
        Leave Room
      </Button>
    </Grid>
  )
}
