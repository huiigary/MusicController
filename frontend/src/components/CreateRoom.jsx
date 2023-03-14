import React, { useState, useEffect } from 'react'
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
  Collapse,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Alert from '@material-ui/lab/Alert'

const defaultProps = {
  votesToSkip: 2,
  guestsCanPause: true,
  update: false,
  roomCode: null,
  updateCallback: () => {},
}
export function CreateRoom(props = defaultProps) {
  useEffect(() => {
    console.log('Create room props:', { props })
  }, [])
  const defaultVotes = 2
  const navigate = useNavigate()
  const [guestsCanPause, setGuestPause] = useState(true)
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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
        guests_can_pause: guestsCanPause, // Note: the body key (votes_to_skip... etc) must match how it is written on the backend side
        // TOOD: fix guestCanPause to use saved state. It is only using default value.
      }),
    }

    // send the request to this endpoint--> then convert to json
    fetch('/api/create-room', requestOptions).then((response) =>
      response.json().then((data) => {
        console.log('create Room data:', { data, props })
        navigate(`/room/${data.code}`)
      })
    )
  }

  const updateRoomPressed = () => {
    // create requestOptions for a POST request
    console.log(
      { props, votesToSkip, guestCanPause: guestsCanPause },
      props.roomCode
    )
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guests_can_pause: guestsCanPause,
        code: props.code,
      }),
    }

    console.log({ requestOptions })
    fetch(`/api/update-room`, requestOptions).then((response) => {
      console.log('update room response', { response })
      if (response.ok) {
        setSuccessMessage('Room updated successfully')
      } else {
        setErrorMessage('Error updating room...')
      }
      // use the function from props (from Room)
      props.updateCallback()
    })
  }

  const displayCreateButtons = () => {
    return (
      <Grid container>
        <Grid xs={12} item align='center'>
          <Button
            color='primary'
            variant='outlined'
            onClick={handleRoomButtonClicked}
          >
            Create a Room
          </Button>
          <Button
            color='secondary'
            variant='contained'
            href='/'
            component={Link}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    )
  }

  const displayUpdateButtons = () => {
    return (
      <Grid container>
        <Grid xs={12} item align='center'>
          <Button
            color='primary'
            variant='outlined'
            onClick={updateRoomPressed}
          >
            Update Room
          </Button>
        </Grid>
      </Grid>
    )
  }

  const title = props?.update ? 'Update Room' : 'Create Room'

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        {/* Upon update --> display user success/fail messages */}
        {/* <Collapse in={successMessage !== '' || errorMessage !== ''}>
          {successMessage !== '' ? (
            <Alert
              severity='success'
              onClose={() => {
                setSuccessMessage('')
              }}
            >
              {successMessage}
            </Alert>
          ) : (
            <Alert severity='error' onClose={() => setErrorMessage('')}>
              {errorMessage}
            </Alert>
          )}
        </Collapse> */}
        <Typography component='h4' variant='h4'>
          {title}
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
            defaultValue={props.guestsCanPause}
            onChange={handleGuestCanPauseChange}
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
            defaultValue={props?.votesToSkip}
            // onChange={(e) => handleVotesChange(e)}
            onChange={handleVotesChange}
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
      {props?.update ? displayUpdateButtons() : displayCreateButtons()}
    </Grid>
  )
}
