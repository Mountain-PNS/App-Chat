import { useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import { AuthContex } from "./context/AuthContex";
import ChatContexProvider from "./context/ChatContex";
function App() {
  const [count, setCount] = useState(0);
  const {user} = useContext(AuthContex)
  // console.log(user);
  return (
    <>
     <ChatContexProvider user={user}>
      <NavBar/>
      <Container className="text-secondary">
        <Routes>
        <Route path="/" element={ user ? <Chat /> : <Login/> } />
          <Route path="/register" element={user ? <Chat /> : <Register/>} />
          <Route path="/login" element={user ? <Chat /> : <Login/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
      </ChatContexProvider>
    </>
  );
}

export default App;
