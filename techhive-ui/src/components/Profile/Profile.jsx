import React, { useContext, useEffect, useState, useCallback, createContext} from 'react';
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
    EditButton,
    SaveButton,
    InputField,
    ErrorMessage,
    SuccessMessage,
} from './ProfileStyles';
import { FaCamera, FaUserCircle } from 'react-icons/fa';

export const RefreshContext = createContext();

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState('');
  const [editMode, setEditMode] = useState(false)
  const [editedUser, setEditedUser] = useState({
    username: user ? user.username : '',
    email: user ? user.email : '',
    linkedin: user  ? user.linkedin: '',
    
  });
  const [refreshData, setRefreshData] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

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
    
      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: file.name,
      }));

     setRefreshData(true);
    } catch (error) {
      console.error(error);
    }
  }, [user, setUser]);

  const renderProfilePicture = () => {
    if (editMode) {
      // When in edit mode, show the uploaded profile picture if available
      if (profilePicture) {
        return <ProfilePic src={profilePicture} alt="Profile" />;
      } else {
        // If no uploaded picture, show a camera icon for uploading
        return (
          <>
            <FileInput type="file" accept="image/*" onChange={handleProfilePictureUpload} />
            <FaCamera style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 20, color: '#FF6347', opacity: 1 }} />
          </>
        );
      }
    } else if (user && user.profilePicture) {
      // When not in edit mode, show the user's profile picture from the database
      return <ProfilePic src={`http://localhost:3000/profile/picture/${user.id}`} alt="Profile" />;
    } else {
      // If no profile picture in the database, show a default icon
      return <FaUserCircle style={{ fontSize: 50, color: '#C0C0C0' }} />;
    }
  };

const handleEditProfile = () => {
  setEditMode(true);
};

useEffect(() => {
  setRefreshData(false);
}, [profilePicture]);

const handleSaveProfile = async () => {
  try {
    const response = await axios.put(`http://localhost:3000/users/${user.id}`, editedUser);
    setUser(response.data);
    setSuccessMessage('Profile has been updated.');
    setEditMode(false);
  } catch (error) {
    console.error(error);
    // Show error message
    setErrorMessage('Failed to update profile.');
  }
};

const handleCloseProfile = () => {
  setEditMode(false);
  setSuccessMessage('');
  setErrorMessage('');
};


const handleChange = (e) => {
  const { name, value } = e.target;
  setEditedUser((prevEditedUser) => ({
    ...prevEditedUser,
    [name]: value,
  }));
};

const renderProfileContent = () => {
  if (editMode) {
    return (
      <>
        <label htmlFor="username">Edit Username</label>
        <InputField type="text" id="username" name="username" value={editedUser.username} onChange={handleChange} />
        <label htmlFor="email">Edit Email</label>
        <InputField type="email" id="email" name="email" value={editedUser.email} onChange={handleChange} />
        <label htmlFor="linkedin">Edit LinkedIn</label>
        <InputField type="text" id="linkedin" name="linkedin" value={editedUser.linkedin} onChange={handleChange} />
        <SaveButton onClick={handleSaveProfile}>Save</SaveButton>
        <CloseButton onClick={handleCloseProfile}>Close</CloseButton>
      </>
    );
  } else if (user) {
    return (
      <>
        <ProfileName>{user.username}</ProfileName>
        <ProfileEmail>{user.email}</ProfileEmail>
        {user.linkedin && (
          <ProfileDetail>
            <ProfileDetailBold>LinkedIn: </ProfileDetailBold>
            <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
              {user.linkedin}
            </a>
          </ProfileDetail>
        )}
        <ProfileDetail>
          <ProfileDetailBold>Account Type: </ProfileDetailBold>
          {user.accountType}
        </ProfileDetail>
        {user.accountType === 'company' && (
          <ProfileDetail>
            <ProfileDetailBold>Industry: </ProfileDetailBold>
            {user.industry}
          </ProfileDetail>
        )}
        {user.accountType === 'student' && (
          <>
            <ProfileDetail>
              <ProfileDetailBold>University: </ProfileDetailBold>
              {user.university}
            </ProfileDetail>
            <ProfileDetail>
              <ProfileDetailBold>Major: </ProfileDetailBold>
              {user.major}
            </ProfileDetail>
          </>
        )}
        <EditButton onClick={handleEditProfile}>Edit Profile</EditButton>
      </>
    );
  } else {
    return null;
  }
};

return (
  <RefreshContext.Provider value={setRefreshData}>
    <ProfileContainer>
      <ProfileCard>
        <ProfilePicContainer>
          {refreshData ? null : renderProfilePicture()}
        </ProfilePicContainer>
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        {renderProfileContent()}
      </ProfileCard>
    </ProfileContainer>
  </RefreshContext.Provider>
);
};

export default Profile;