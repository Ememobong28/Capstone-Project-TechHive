import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { UserContext } from "../../UserContext.jsx"; 
import { allUsersRoute, host } from "../../utils/APIRoutes.jsx";
import ChatContainer from "../ChatContainer.jsx";
import Contacts from "../Contacts/Contacts.jsx";


export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const { user: currentUser } = useContext(UserContext);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  console.log(currentUser._id,currentUser )

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        // if (currentUser.picture) {
          try {
            const response = await axios.get(`${allUsersRoute}`);
            const data = response.data;
            console.log("Contacts API Response:", data); // Log the API response
            setContacts(data);
          } catch (error) {
            console.error("Error fetching contacts:", error);
          }
        // } else {
        //   // navigate("/setAvatar");
        // }
      }
    };
  
    fetchContacts();
  }, [currentUser, navigate]);
  
  console.log(allUsersRoute)
  
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat && <ChatContainer currentChat={currentChat} socket={socket} />}
        
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: white;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;