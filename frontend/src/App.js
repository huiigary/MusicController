import logo from './logo.svg';
import './App.css';
import {useState, useEffect } from 'react'



function App() {
  const [room, setRoom] = useState([])
  useEffect (() => {
    async function fetchBooks() {
      const res = await fetch("http://127.0.0.1:8000/api/room");
      res.json()
      console.log({res})
     .then(res => setRoom(res.response))
     .catch(err => console.log(err));
    }
    fetchBooks();
 },[])
  return (
     <div className="App">
       <header className="App-header">
         <h1>DjangoReact</h1>
       </header>
       <div className="book-list">
         <div className="book-item">
           <h2>Book Name</h2>
           <p>Author</p>
           <p>Description</p>
         </div>
       </div>
     </div>
  )
}
export default App;
