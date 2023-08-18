import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, styled } from '@mui/material';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const Section = styled('section')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const CardMediaStyled = styled(CardMedia)({
  objectFit: 'fit',
});

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }));

function ColorstackCommunity() {
  return (
    <StyledContainer maxWidth="lg" className="colorstack-community">
      <Typography variant="h2" align="center" gutterBottom>
        Join the Colorstack Community
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        Connecting students, fostering innovation, and creating opportunities
      </Typography>

      <Section className="mission-section">
        <Typography variant="h4" align="center" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" align="center">
          ColorStack's mission is to increase the number of Black and Latinx Computer Science graduates
          who go on to start rewarding technical careers. We are dedicated to providing a platform for
          students to collaborate, learn, and grow together in the world of technology. Join us in shaping the future!
        </Typography>
      </Section>

      <Section className="benefits-section">
        <Typography variant="h4" align="center" gutterBottom>
          Benefits of Joining
        </Typography>
        <Grid container spacing={3}>
          {/* Benefits Map */}
          {[
            {
              image: '/CS2.jpeg',
              title: 'Skill Enhancement',
              description:
                'Access to workshops, hackathons, and learning resources that will boost your skills in various tech domains.',
            },
            {
              image: '/CS.jpg',
              title: 'Networking',
              description:
                'Connect with fellow students, mentors, and professionals in the tech industry to broaden your network.',
            },
            {
              image: '/CS3.jpeg',
              title: 'Projects and Opportunities',
              description:
                'Collaborate on exciting projects and gain access to internship and job opportunities from our partner companies.',
            },
          ].map((benefit, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard>
                <CardMediaStyled component="img" height="300" image={benefit.image} alt={`Benefit ${index + 1}`} />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2">{benefit.description}</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Section>

      <Section className="get-involved-section">
        <Typography variant="h4" align="center" gutterBottom>
          Get Involved Today!
        </Typography>
        <Typography variant="body1" align="center">
          Ready to take your journey in technology to the next level? Join the Colorstack community and become a part of
          something extraordinary.
        </Typography>
        <StyledButton
          variant="contained"
          color="primary"
          component={RouterLink}
          to="https://www.colorstack.org/"
          target="_blank"
        >
          Join Now
        </StyledButton>
      </Section>
    </StyledContainer>
  );
}

export default ColorstackCommunity;
