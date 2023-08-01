import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg + emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <form onSubmit={sendChat}>
        <InputContainer>
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          <InputField
            type="text"
            placeholder="Type a message..."
            onChange={(e) => setMsg(e.target.value)}
            value={msg}
          />
          <SendButton type="submit">
            <IoMdSend />
          </SendButton>
          {showEmojiPicker && (
            <EmojiPickerContainer>
              <Picker onEmojiClick={handleEmojiClick} />
            </EmojiPickerContainer>
          )}
        </InputContainer>
      </form>
    </Container>
  );
}

const Container = styled.div`
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 5px;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #fff;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  svg {
    color: #9a86f3;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  top: -290px;
  left: -10px;
  background-color: #fff;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
  flex: 1;
  border: none;
  background-color: transparent;
  font-size: 0.9rem;
  outline: none;
  border-radius: 10px;
  color: #000;
  padding: 0.5rem 0;
  margin: 0;
  &::placeholder {
    color: #a1a1a1;
  }
`;

const SendButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #9a86f3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;
