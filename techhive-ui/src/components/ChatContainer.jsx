import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput.jsx";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, receiveMessageRoute} from "../utils/APIRoutes";
import { UserContext } from '../UserContext.jsx';
import { FaUserCircle } from 'react-icons/fa';


export default function ChatContainer({ currentChat, socket }) {
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 

useEffect(() => {
  const fetchMessages = async () => {
    try {
      const response = await axios.post(receiveMessageRoute, {
        from: user.username,
        to: currentChat.username,
      });
      const messagesFromServer = response.data;

      const formattedMessages = messagesFromServer.map((msg) => ({
        ...msg,
        fromSelf: msg.sender === user.username,
        timestamp: parseISOString(msg.createdAt),
        originalTimestamp: parseISOString(msg.createdAt),
        
      }));

      console.log(
        "Parsed dates:",
        formattedMessages.map((msg) => msg.timestamp)
      );

      formattedMessages.sort((a, b) => a.timestamp - b.timestamp);

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  if (currentChat && user) {
    fetchMessages();
  }
}, [currentChat, user]);

// Function to check if two dates are the same day
const isSameDay = (date1, date2) =>
date1.getDate() === date2.getDate() &&
date1.getMonth() === date2.getMonth() &&
date1.getFullYear() === date2.getFullYear();

// Function to format the date for display
const formatDate = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (!date || !(date instanceof Date && !isNaN(date))) {
    return "Hello Invalid Date: " + date;
  }

  if (isSameDay(date, today)) {
    return "Today";
  } else if (isSameDay(date, yesterday)) {
    return "Yesterday";
  } else {
    const options = { month: "short", day: "numeric" };
    const day = date.getDate();
    let suffix = "th";
    if (day !== 11 && day !== 12 && day !== 13) {
      if (day % 10 === 1) {
        suffix = "st";
      } else if (day % 10 === 2) {
        suffix = "nd";
      } else if (day % 10 === 3) {
        suffix = "rd";
      }
    }
    return date.toLocaleDateString(undefined, options) + " " + day + suffix;
  }
}



// Helper function to group messages by date
const groupMessagesByDate = (messages) => {
  const groupedMessages = [];
  let currentDate = null;
  let lastDateSeparator = null;

  messages.forEach((message) => {
    const timestamp = new Date(message.originalTimestamp);

    if (!currentDate || !isSameDay(timestamp, currentDate)) {
      currentDate = timestamp;
      const formattedDate = formatDate(currentDate);
      // Avoid adding another date separator if it's the same as the last one
      if (formattedDate !== lastDateSeparator) {
        groupedMessages.push({
          type: "dateSeparator",
          timestamp: currentDate,
        });
        lastDateSeparator = formattedDate;
      }
    }

    groupedMessages.push({
      type: "message",
      ...message,
    });
  });

  return groupedMessages;
};


// Merge and sort sent and received messages
let allMessages = [...messages, ...receivedMessages];
allMessages.sort((a, b) => a.timestamp - b.timestamp);
allMessages = groupMessagesByDate(allMessages);


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


    const createdAt = parseISOString(response.data.createdAt);
    const newMessage = {
      fromSelf: true,
      message: msg,
      timestamp: createdAt,
      originalTimestamp: createdAt,
    };

    setMessages((prevMessages) => {
      let newMessages = [...prevMessages, newMessage];
      newMessages.sort((a, b) => a.timestamp - b.timestamp);
      return newMessages;
    });

  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Listen for new messages via socket
useEffect(() => {
  if (socket.current) {
    socket.current.on("msg-receiver", (msg) => {
      const receivedMessage = {
        fromSelf: false,
        message: msg.message,
        timestamp: parseISOString(msg.timestamp),
        originalTimestamp: parseISOString(msg.timestamp),
      };

      setMessages((prevMessages) => [...prevMessages, receivedMessage].sort((a, b) => a.timestamp - b.timestamp));
    });
  }

  // Clean up the listener when the component is unmounted
  return () => {
    if (socket.current) {
      socket.current.off("msg-receiver");
    }
  };
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
        {currentChat.profilePicture ? (
            <Avatar src={`http://localhost:3000/profile/picture/${currentChat.id}`} alt="Profile" />
          ) : (
            <FaUserCircle size={40} color="#C0C0C0" />
          )}
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
        {allMessages.map((item, index) => {
          if (item.type === "dateSeparator") {
            return (
              <DateSeparator key={uuidv4()}>
                {formatDate(item.timestamp)}
              </DateSeparator>
            );
          } else {
            const message = item;
  
            return (
              <Message
                key={uuidv4()}
                fromSelf={message.fromSelf}
                id={`message-${message.originalTimestamp}`}
              >
                <div className="content">
                  <SearchHighlight
                    text={message.message}
                    query={searchQuery}
                    highlightStyle={{ backgroundColor: "yellow" }}
                  />
                  {message.fromSelf ? <span className="sender">You</span> : null}
                  <span className="timestamp">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              </Message>
            );
          }
        })}
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
      return "Invalid Date: [" + timestamp + "]";
    }
  
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return timestamp.toLocaleString(undefined, options);
  }
  
  function parseISOString(s) {
    if (!s) {
      return new Date();
    }
    // Parse the ISO string using Date.parse
    const timestamp = Date.parse(s);
    // Check if the parsing was successful and return the Date object
    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    }
    // If parsing failed, return the current date
    return new Date();
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
  grid-template-rows: auto 1fr auto;
  gap: 0.1rem;
  overflow: hidden;
  background-color: #f5f5f5;
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

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

const Username = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: #fff;
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

const DateSeparator = styled.div`
  text-align: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: blackz;
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
    color: ${({ fromSelf }) => (fromSelf ? "#FFFFFF" : "#333")};
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