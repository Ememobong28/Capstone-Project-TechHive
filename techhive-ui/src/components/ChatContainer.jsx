import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput.jsx";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, receiveMessageRoute} from "../utils/APIRoutes";
import { UserContext } from '../UserContext.jsx';

export default function ChatContainer({ currentChat, socket }) {
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMessages, setFilteredMessages] = useState([]);
    

useEffect(() => {
    const fetchMessages = async () => {
        try {
          const response = await axios.post(receiveMessageRoute, {
            from: user.username,
            to: currentChat.username,
          });
          const messagesFromServer = response.data;
      
          // Filter messages where the sender is the current user (fromSelf)
          const sentMessages = messagesFromServer
            .filter((msg) => msg.sender === user.username)
            .map((msg) => ({
              ...msg,
              timestamp: parseISOString(msg.createdAt),
              originalTimestamp: msg.createdAt,
            }));
      
          // Filter messages where the sender is the current chat user (received messages)
          const receivedMessages = messagesFromServer
            .filter((msg) => msg.sender === currentChat.username)
            .map((msg) => ({
              ...msg,
              timestamp: parseISOString(msg.createdAt),
              originalTimestamp: msg.createdAt,
            }));
      
          setMessages(sentMessages);
          setReceivedMessages(receivedMessages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

  if (currentChat && user) {
    fetchMessages();
  }
}, [currentChat, user]);

  
 const handleSendMsg = async (msg) => {
      try {
        socket.current.emit("send-msg", {
          to: currentChat.username,
          from: user.username,
          msg,
        }, {
            headers: {
              'Content-Type': 'application/json',
            },
        });
  
        const response = await axios.post(sendMessageRoute, {
            from: user.username,
            to: currentChat.username,
            message: msg,
          });
      
        const createdAt = response.data.createdAt;

        const newMessage = {
        fromSelf: true,
        message: msg,
        timestamp: new Date(s),
        originalTimestamp: createdAt, 
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      
      const receivedMessage = {
        fromSelf: false,
        message: msg,
        timestamp: new Date(s),
        originalTimestamp: new Date(s), 
      };
      setReceivedMessages((prev) => [...prev, receivedMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
    useEffect(() => {
      if (socket.current) {
        socket.current.on("msg-receiver", (msg) => {
            setReceivedMessages((prev) => [...prev, { fromSelf: false, message: msg , timestamp: new Date()}]);
        });
      }
    }, [socket]);
  
    // Helper function to check if a message contains the search query
    const doesMessageContainQuery = (message, query) => {
    return message.message.toLowerCase().includes(query.toLowerCase());
  };

    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
 
      // Helper function to count occurrences of the search query in the messages
    const countOccurrences = (query) => {
      const allMessages = [...messages, ...receivedMessages];
      let count = 0;
     for (const message of allMessages) {
      if (doesMessageContainQuery(message, query)) {
        count++;
      }
    }
    return count;
  };

   // Determine if there are any occurrences for the current search query
   const hasOccurrences = countOccurrences(searchQuery) > 0;
    
   // Function to scroll to the next occurrence of the search query
    const scrollToNextOccurrence = () => {
    // Combine sent and received messages into one array
    const allMessages = [...messages, ...receivedMessages];
    const index = allMessages.findIndex((message) =>
      doesMessageContainQuery(message, searchQuery)
    );

    if (index !== -1) {
      const targetElement = document.getElementById(`message-${index}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };


    return (
        <Container>
          <ChatHeader>
           <UserDetails>
            <Avatar src="//this" alt="" />
            <h3>{currentChat.username}</h3>
          </UserDetails>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && hasOccurrences && (
            <Occurrences>
              {countOccurrences(searchQuery)} occurrences
              <SearchButton onClick={scrollToNextOccurrence}>
                <span role="img" aria-label="Scroll to next occurrence">
                  ⬇️
                </span>
              </SearchButton>
            </Occurrences>
          )}
        </SearchContainer>
      </ChatHeader>
        <ChatMessages>
        {messages.map((message) => (
          <Message key={uuidv4()} fromSelf={message.fromSelf} id={`message-${message.originalTimestamp}`}>
            <div className="content">
              <SearchHighlight
                text={message.message}
                query={searchQuery}
                highlightStyle={{ backgroundColor: "yellow" }}
              />
              {message.fromSelf ? <span className="sender">You</span> : null}
            </div>
            <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
          </Message>
        ))}
        {receivedMessages.map((message) => (
          <Message key={uuidv4()} fromSelf={message.fromSelf} id={`message-${message.originalTimestamp}`}>
            <div className="content">
              <SearchHighlight
                text={message.message}
                query={searchQuery}
                highlightStyle={{ backgroundColor: "yellow" }}
              />
              {!message.fromSelf && <span className="receiver">{currentChat.username}</span>}
            </div>
            <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
          </Message>
        ))}
        <div ref={scrollRef}></div>
       </ChatMessages>
          <ChatInputContainer>
            <ChatInput handleSendMsg={handleSendMsg} />
          </ChatInputContainer>
    </Container>
      );
    }

const SearchHighlight = ({ text, query, highlightStyle }) => {
    if (!query) return text;
      
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
      
    return parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} style={highlightStyle}>
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        );
      }; 

function formatTimestamp(timestamp) {
    // Check if the timestamp is valid
    if (!(timestamp instanceof Date && !isNaN(timestamp))) {
      return "Invalid Date";
    }
  
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return timestamp.toLocaleString(undefined, options);
  }
  

function parseISOString(s) {
    if (!s) {
      return new Date(); 
    }
    return new Date(s); 
  }
  
const Occurrences = styled.div`
    background-color: #f1c40f;
    color: #333; 
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
  `;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Container = styled.div`
    display: grid;
    grid-template-rows:  auto 1fr auto,
    gap: 0.1rem;
    overflow: hidden;
    background-color: #f5f5f;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        grid-template-rows: 15% 70% 15%;
      }
    `;
    
const ChatHeader = styled.div`
    padding: 1rem;
    background-color: #333;
    color: #fff;
    height: 40%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;
  
    
const ChatMessages = styled.div`
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
          background-color: #ffffff39;
          width: 0.1rem;
          border-radius: 1rem;
        }
      }
    `;
    
const Message = styled(({ fromSelf, ...rest }) => <div {...rest} />)`
    display: flex;
    flex-direction: column;
    align-items: ${({ fromSelf }) => (fromSelf ? "flex-end" : "flex-start")};
    .content {
      max-width: 70%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 14px;
      border-radius: 1rem;
      color:${({ fromSelf }) => (fromSelf ? "#FFFFFF" : "#333")};
      background-color: ${({ fromSelf }) => (fromSelf ? "#4f04ff21" : "#9900ff20")};
      margin-bottom: 0.5rem;
    }
    .sender {
        display: ${({ fromSelf }) => (fromSelf ? "block" : "none")};
        align-self: flex-end;
        margin: 0.5rem 0;
        font-size: 14px;
        color: ${({ fromSelf }) => (fromSelf ? "#a1a1a1" : "#FFFFFF")};
      }
      .receiver {
        display: ${({ fromSelf }) => (fromSelf ? "none" : "block")};
        align-self: flex-start;
        margin: 0.5rem 0;
        font-size: 14px;
        color: ${({ fromSelf }) => (fromSelf ? "#FFFFFF" : "#a1a1a1")};
      }
      .timestamp {
        font-size: 0.9rem;
        color: #a1a1a1;
        margin-top: 0.3rem;
        align-self: ${({ fromSelf }) => (fromSelf ? "flex-end" : "flex-start")};
      }
  `;
    
const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #fff;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  object-fit: cover;
`;

const SearchInput = styled.input`
  border: none;
  border-bottom: 1px solid #fff;
  background-color: transparent;
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  outline: none;
  width: 100%;
  &::placeholder {
    color: #fff;
    opacity: 0.7;
  }
`;

const SearchButton = styled.button`
  border: none;
  background-color: transparent;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  outline: none;
`;
    