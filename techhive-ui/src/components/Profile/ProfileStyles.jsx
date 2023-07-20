import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ProfileContainer = styled(motion.div)`
    overflow: hidden;
    margin-bottom: 30px;
    margin-top: 20px; 
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:  #fee3e8; 
    height: 90vh;
    font-family: 'Montserrat', sans-serif;
`;

export const ProfileCard = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #FFFFFF;  // White color for the profile card
    border-radius: 15px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);  // Slightly bigger shadow for a better depth effect
    padding: 30px;
    margin: 20px;
    width: 90%;
    max-width: 500px;
`;

export const ProfilePicContainer = styled(motion.div)`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 30px;
    margin-top: 20px; 
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F0F0F0;
    position: relative;

    &:hover {
      border: 3px solid #FF6347;
      transition: border 0.3s ease-in-out;
    }

    svg {
        transition: opacity 0.3s ease;
      }
  
    &:hover svg {
        opacity: 0.7;
      }

    &:after {
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 20px;
      color: #ffffff;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover:after {
      opacity: 0.7;
    }
`;

export const ProfilePic = styled(motion.img)`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
`;

export const ProfileName = styled(motion.h1)`
    color: #333333;
    font-size: 2em;
    margin-bottom: 10px;
    text-transform: uppercase;
`;

export const ProfileEmail = styled(motion.h2)`
    color: #777777;
    font-size: 1.3em;
    margin-bottom: 25px;
`;

export const ProfileDetail = styled(motion.p)`
    color: #333333;
    font-size: 1.2em;
    text-align: left;
    width: 100%;
    border-bottom: 1px solid #DDDDDD;
    padding: 15px 0;
`;

export const ProfileDetailBold = styled.span`
    font-weight: bold;
    color: #FF6347; // Making the labels pop with a contrasting color
`;

export const FileInput = styled.input`
position: absolute;
bottom: 0;
right: 0;
opacity: 0;
width: 100%;
height: 100%;
cursor: pointer;
z-index: 1; 
`;

export const CloseButton = styled.button`
  
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #000;
  `;
