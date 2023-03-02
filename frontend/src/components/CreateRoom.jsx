import React, { useState } from 'react'
import {
  Grid,
  Typography,
  Button,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Link,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export function CreateRoom(props) {
  const defaultVotes = 2
  const navigate = useNavigate()

  const [guestCanPause, setGuestPause] = useState(true)
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes)

  const handleVotesChange = (e) => {
    console.log('handle votes changing:', e.target.value)
    setVotesToSkip(e.target.value)
  }

  const handleGuestCanPauseChange = (e) => {
    console.log(
      'clicked guests can pause...',
      e.target.value,
      e.target.value === 'true' ? true : false
    )
    setGuestPause(e.target.value === 'true' ? true : false)
  }

  const handleRoomButtonClicked = () => {
    console.log('button room clicked')
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guests_can_pause: guestCanPause, // Note: the body key (votes_to_skip... etc) must match how it is written on the backend side
        // TOOD: fix guestCanPause to use saved state. It is only using default value.
      }),
    }

    // send the request to this endpoint--> then convert to json
    fetch('/api/create-room', requestOptions).then((response) =>
      response.json().then((data) => {
        console.log('create Room data:', { data, props })
        // props.history.push(`/room/${data.code}`)
        navigate(`/room/${data.code}`)
      })
    )
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        <Typography component='h4' variant='h4'>
          Create Room
        </Typography>
      </Grid>
      {/* To control playback */}
      <Grid item xs={12} align='center'>
        <FormControl component='fieldset'>
          <FormHelperText>
            <div algin='center'> Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={true}
            onChange={(e) => handleGuestCanPauseChange(e)}
          >
            <FormControlLabel
              value={true}
              control={<Radio color='primary'></Radio>}
              label='Play/Pause'
              labelPlacement='bottom'
            ></FormControlLabel>
            <FormControlLabel
              value={false}
              control={<Radio color='secondary'></Radio>}
              label='No control'
              labelPlacement='bottom'
            ></FormControlLabel>
          </RadioGroup>
        </FormControl>
      </Grid>
      {/* The number of people to skip song */}
      <Grid item xs={12} align='center'>
        <FormControl algin='center'>
          <TextField
            required={true}
            type='number'
            defaultValue={defaultVotes}
            onChange={(e) => handleVotesChange(e)}
            inputProps={{
              min: 1,
              style: { textAlign: 'center' },
            }}
          ></TextField>
          <FormHelperText>
            <div algin='center'>Votes required to skip</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {/* Buttons to submit/goBack ... component will be like a link*/}
      <Grid xs={12} item align='center'>
        <Button
          color='primary'
          variant='outlined'
          onClick={() => handleRoomButtonClicked()}
        >
          Create a Room
        </Button>
        <Button color='secondary' variant='contained' href='/' component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  )
}
