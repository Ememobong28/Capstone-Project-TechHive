import React, { useContext, useState, useCallback} from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import { 
  ProfileContainer,
    ProfileCard,
    ProfilePicContainer,
    ProfilePic,
    ProfileName,
    ProfileEmail,
    ProfileDetail,
    ProfileDetailBold,
    FileInput,
    CloseButton,
} from './ProfileStyles';
import { FaCamera } from 'react-icons/fa';


const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState('');


  const handleProfilePictureUpload =useCallback( async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await axios.post(`http://localhost:3000/users/${user.id}/profilePicture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfilePicture(URL.createObjectURL(file));
    
      // Update the user object with the new profile picture filename
      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: file.name,
      }));
    
    } catch (error) {
      console.error(error);
    }
  }, [user, setUser]);

  const renderProfilePicture = () => {
    if (profilePicture) {
      return <ProfilePic src={profilePicture} alt="Profile" />;
  } else if (user && user.profilePicture) {
      return <ProfilePic src={`http://localhost:3000/profile/picture/${user.id}`} alt="Profile" />;
  } else {
      return null;
  }
};



return (
  <ProfileContainer>
    <ProfileCard>
      <ProfilePicContainer>
      <FileInput type="file" accept="image/*" onChange={handleProfilePictureUpload} />
          {!profilePicture && <FaCamera style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 20, color: '#FF6347', opacity: 1 }} />}
          {renderProfilePicture()}
        </ProfilePicContainer>
      {user && (
        <>
          <ProfileName>{user.username}</ProfileName>
          <ProfileEmail>{user.email}</ProfileEmail>
          <ProfileDetail>
            <ProfileDetailBold>Account Type: </ProfileDetailBold>{user.accountType}
          </ProfileDetail>
          {user.accountType === 'company' && 
            <ProfileDetail>
              <ProfileDetailBold>Industry: </ProfileDetailBold>{user.industry}
            </ProfileDetail>}
          {user.accountType === 'student' && 
            <>
              <ProfileDetail>
                <ProfileDetailBold>University: </ProfileDetailBold>{user.university}
              </ProfileDetail>
              <ProfileDetail>
                <ProfileDetailBold>Major: </ProfileDetailBold>{user.major}
              </ProfileDetail>
            </>
          }
        </>
      )}
    </ProfileCard>
  </ProfileContainer>
);
};

export default Profile;