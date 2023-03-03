import './App.css'
import { CreateRoom } from './components/CreateRoom'
import { HomePage } from './components/Home'
import { RoomJoin } from './components/RoomJoin'
import { Room } from './components/Room'
import { Navigate, Route, Routes, Link, BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <div>
      {/* <HomePage></HomePage> */}
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<HomePage />}></Route>
          <Route path='/join' element={<RoomJoin />} />
          <Route path='/create' element={<CreateRoom />} />
          <Route path='/room/:roomCode' element={<Room />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App
