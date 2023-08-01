import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Logo from "../Logo/Logo";
import { UserContext } from '../../UserContext.jsx';

export default function Contacts({ contacts, changeChat }) {
  const { user } = useContext(UserContext);
  const [currentUsername, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        setCurrentUserName(user.username);
      } else {
        setCurrentUserName('Guest');
      }
    };

    fetchUserInfo();
  }, [user]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };


  return (
    <>
      {user && (
        <Container>
          <div className="brand">
            <Logo />
            <h3>TechHive</h3>
          </div>
          <div className="contacts">
          {Array.isArray(contacts) && contacts.map((contact, index) => {
              return (
                <div
                   key={contact.username}
                   className={`contact ${
                   index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="username">
              <h2>{currentUsername}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
display: grid;
grid-template-rows: 10% 80% 10%;
overflow: hidden;
background-color: #fff;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
gap: 1rem;
padding: 1rem;
max-width: 300px;
width: 100%;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: #9a86f3;
      text-transform: uppercase;
      font-size: 1.2rem;
      margin: 0;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: black;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #9a86f3 ;
      height: 50px;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      font-size: 14px;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: #000;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
      color: #fff;
    }
  }

  .current-user {
    background-color: #9a86f3;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    font-size: 0.9rem;
    .avatar {
      img {
        height: 4rem;
        width: 4rem;
        border-radius: 50%;
      }
    }
    .username {
      h2 {
        color: #fff;
        margin: 0;
        font-size: 1.1rem;
      }
    }
  }
`;
