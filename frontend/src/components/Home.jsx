import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  Link,
  BrowserRouter,
} from 'react-router-dom'
import { CreateRoom } from './CreateRoom'
import { RoomJoin } from './RoomJoin'
import { Room } from './Room'
import { Button, ButtonGroup, Grid, Typography } from '@mui/material'

export function HomePage(props) {
  const [roomCode, setRoomCode] = useState(null)
  // didMount via useEffect with empty []
  useEffect(() => {
    fetch('/api/user-in-room') // if returns roomCode then user is in a room with a session
      .then((response) => response.json())
      .then((data) => {
        console.log('user in room:', { data })
        setRoomCode(data.code)
      })
  }, [])

  const displayHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align='center'>
          <Typography variant='h3' compact='h3'>
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <ButtonGroup disableElevation variant='contained'>
            <Button color='primary' to='/join' component={Link}>
              Join a room
            </Button>
            <Button color='secondary' to='/create' component={Link}>
              Create a room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path='/'
          element={
            roomCode ? (
              <Navigate replace to={`/room/${roomCode}`}></Navigate>
            ) : (
              displayHomePage()
            )
          }
        ></Route>
        <Route path='/join' element={<RoomJoin />} />
        <Route path='/create' element={<CreateRoom />} />
        <Route path='/room/:roomCode' element={<Room />} />
      </Routes>
    </BrowserRouter>
  )
  // return <h1> Home page {props.name}</h1>
}
