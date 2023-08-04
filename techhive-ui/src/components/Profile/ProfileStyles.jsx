import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ProfileContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fee3e8;
  min-height: 60vh;
  font-family: 'Montserrat', sans-serif;
`;

export const ProfileCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 20px;
  height: 50%;
  width: 75%;
  max-width: 600px;
`;

export const ProfilePicContainer = styled(motion.div)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  position: relative;

  &:hover {
    border: 3px solid #ff6347;
    transition: border 0.3s ease-in-out;
  }

  svg {
    transition: opacity 0.3s ease;
  }

  &:hover svg {
    opacity: 0.7;
  }

  &:after {
    content: 'Upload';
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 14px;
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
  text-transform: capitalize;
`;

export const ProfileEmail = styled(motion.h2)`
  color: #777777;
  font-size: 1.3em;
  margin-bottom: 20px;
`;

export const ProfileDetail = styled(motion.p)`
  color: #333333;
  font-size: 1.2em;
  text-align: left;
  width: 100%;
  padding: 10px 0;
`;

export const ProfileDetailBold = styled.span`
  font-weight: bold;
  color: #ff6347;
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
  background: none;
  border: none;
  margin-top: 10px;
  font-size: 15px;
  font-weight: medium;
  cursor: pointer;
  color: white;
  background-color: red;
  z-index: 2;
`;

export const EditButton = styled.button`
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background-color: #ff6347;
    opacity: 0.8;
  }
`;

export const SaveButton = styled(EditButton)`
  background-color: #008000;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #dddddd;
  border-radius: 5px;
  font-size: 1em;
`;

export const ErrorMessage = styled.p`
  color: #ff0000;
  font-size: 1em;
  margin-top: 10px;
`;

export const SuccessMessage = styled.p`
  color: #008000;
  font-size: 1em;
  margin-top: 10px;
`;
