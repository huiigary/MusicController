import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

export function Room(props) {
  const [votesToSkip, setVotesToSkip] = useState(0)
  const [guestsCanSkip, setGuestsCanSkip] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [roomCode, setRoomCode] = useState('')

  const params = useParams() // used to get roomID typed in URL

  useEffect(() => {
    const getRoomDetails = async () => {
      await fetch(`/api/get-room?code=${params.roomCode}`) // TODO: make this roomCode
        .then((response) => response.json())
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

  // console.log({ roomCode, votesToSkip, guestsCanSkip, isHost })
  return (
    <div>
      <h3>Room code: {roomCode}</h3>
      <p>Votes: {votesToSkip}</p>
      <p>Guests can skip: {guestsCanSkip?.toString()}</p>
      <p>Host: {isHost?.toString()}</p>
    </div>
  )
}
