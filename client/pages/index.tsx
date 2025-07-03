import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import MicIcon from '@mui/icons-material/Mic';
import EqualizerIcon from '@mui/icons-material/Equalizer';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Head>
        <title>Studio Booking Assistant</title>
        <meta name="description" content="Manage your recording studio bookings, staff, and clients efficiently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Studio Booking Assistant
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            Efficiently manage your recording studio bookings, staff, and client communications
          </Typography>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* Dashboard Stats */}
            <Grid item xs={12} md={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 40 }} />
                <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                  8
                </Typography>
                <Typography variant="body2">Upcoming Bookings</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                }}
              >
                <PeopleIcon sx={{ fontSize: 40 }} />
                <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                  12
                </Typography>
                <Typography variant="body2">Active Clients</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'info.light',
                  color: 'info.contrastText',
                }}
              >
                <MicIcon sx={{ fontSize: 40 }} />
                <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                  3
                </Typography>
                <Typography variant="body2">Engineers Available</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'warning.light',
                  color: 'warning.contrastText',
                }}
              >
                <EqualizerIcon sx={{ fontSize: 40 }} />
                <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                  85%
                </Typography>
                <Typography variant="body2">Studio Utilization</Typography>
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="contained" color="primary">
                    New Booking
                  </Button>
                  <Button variant="contained" color="secondary">
                    Add Client
                  </Button>
                  <Button variant="contained" color="info">
                    Manage Equipment
                  </Button>
                  <Button variant="contained" color="success">
                    Generate Report
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Today's Schedule */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 1 }}>
                <Typography variant="h5" gutterBottom>
                  Today's Schedule
                </Typography>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    9:00 AM - 12:00 PM
                  </Typography>
                  <Typography>
                    Studio A: Red Mountain Band (Recording Session)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Engineer: John Smith
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    1:00 PM - 4:00 PM
                  </Typography>
                  <Typography>
                    Studio B: Sarah Johnson (Vocal Tracking)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Engineer: Emily Davis
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    5:00 PM - 9:00 PM
                  </Typography>
                  <Typography>
                    Studio A: The Nighthawks (Mixing Session)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Engineer: Michael Wong
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Home;