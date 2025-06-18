import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Container,
  List,
  ListItem,
  Link,
  Drawer,
  useTheme,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { Brightness4, Brightness7, Menu as MenuIcon, Close as CloseIcon, LinkedIn, Twitter, Facebook, Instagram, Send, ChatBubbleOutline, ArrowUpward } from '@mui/icons-material';
import { keyframes } from '@mui/system';

// Define the custom theme for light and dark modes
const getAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#00C2B8', // Teal
      },
      secondary: {
        main: '#6F42C1', // Purple
      },
      accent: {
        main: '#F4D35E', // Yellow
      },
      text: {
        primary: mode === 'dark' ? '#e2e8f0' : '#2d3748', // Light gray for dark bg, Dark gray for light bg
        secondary: mode === 'dark' ? '#2d3748' : '#e2e8f0', // Dark gray for dark bg, Light gray for light bg
      },
      background: {
        default: mode === 'dark' ? '#1a202c' : '#ffffff', // Dark charcoal for dark, White for light
        paper: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', // Card background
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      h1: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 900,
        lineHeight: 1.1,
      },
      h2: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 800,
      },
      h3: {
        fontFamily: 'Inter, sans-serif',
      },
      h4: {
        fontFamily: 'Inter, sans-serif',
      },
      // For Anton font, used in hero and metrics
      anton: {
        fontFamily: 'Anton, sans-serif',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 50,
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.3s ease',
            padding: '0.8rem 1.8rem',
            '&.MuiButton-sizeSmall': {
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem',
            },
          },
          containedPrimary: ({ theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
            border: `2px solid ${theme.palette.primary.main}`,
            '&:hover': {
              backgroundColor: theme.palette.accent.main,
              borderColor: theme.palette.accent.main,
              transform: 'translateY(-3px)',
              boxShadow: `0 8px 20px ${theme.palette.primary.main}66`, // 66 for 40% opacity
            },
          }),
          outlinedPrimary: ({ theme }) => ({
            background: 'none',
            color: theme.palette.primary.main,
            border: `2px solid ${theme.palette.primary.main}`,
            '&:hover': {
              background: theme.palette.primary.main,
              color: theme.palette.background.default,
              transform: 'translateY(-3px)',
              boxShadow: `0 8px 20px ${theme.palette.primary.main}66`,
            },
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 102, 0.8)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            paddingY: '1rem',
            zIndex: 1000,
            transition: 'background 0.3s ease, border-bottom 0.3s ease',
            boxShadow: 'none', // Remove default app bar shadow
          }),
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'none',
            },
          },
        },
      },
    },
  });

// Keyframes for logo carousel
const scrollLogos = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

function App() {
  const [mode, setMode] = useState(localStorage.getItem('theme') || 'dark');
  const theme = getAppTheme(mode);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const [caseStudyModalOpen, setCaseStudyModalOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotMessages, setChatbotMessages] = useState([]);
  const chatbotBodyRef = useRef(null);

  // Helper for responsive breakpoints
  const mdAndUp = theme.breakpoints.up('md');
  const smAndUp = theme.breakpoints.up('sm');

  // Theme toggle
  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  };

  // Scroll event listener for sticky header, CTA, and back-to-top
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setStickyCtaVisible(window.scrollY > heroBottom);
      }
      setBackToTopVisible(window.scrollY > 300);

      // Active navigation link highlighting (simplified for MUI)
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - (theme.spacing(8) * 1); // Adjust for AppBar height
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      document.querySelectorAll('.nav-link-item').forEach(linkElement => {
        if (linkElement.dataset.section === current) {
          linkElement.classList.add('active');
        } else {
          linkElement.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [theme]); // Re-run effect if theme changes to adjust AppBar height

  // Chatbot message handling
  const addChatMessage = (sender, text) => {
    setChatbotMessages((prevMessages) => [...prevMessages, { sender, text }]);
  };

  const getBotResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('services')) {
      return 'We offer Software Services, Cloud Transformation, AI & ML Solutions, and Digital Marketing Strategy. What interests you the most?';
    } else if (lowerCaseMessage.includes('contact')) {
      return 'You can reach us via email at info@itsolutions.com or call us at +1 (234) 567-890.';
    } else if (lowerCaseMessage.includes('audit')) {
      return "Great! To book a free audit, please visit our 'Contact' section or click the 'Book a Demo' button in the header.";
    } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return 'Hello! How can I assist you today?';
    } else {
      return "I'm still learning! Can you please rephrase or ask about our services, contact info, or free audit?";
    }
  };

  const handleSendMessage = (messageText) => {
    if (messageText.trim()) {
      addChatMessage('user', messageText.trim());
      setTimeout(() => {
        addChatMessage('bot', getBotResponse(messageText.trim()));
      }, 500);
    }
  };

  // Scroll to bottom of chatbot body on new message
  useEffect(() => {
    if (chatbotBodyRef.current) {
      chatbotBodyRef.current.scrollTop = chatbotBodyRef.current.scrollHeight;
    }
  }, [chatbotMessages]);

  // Case Study Modal Data
  const caseStudyContent = {
    'case-study-1': {
      title: 'Revolutionizing Fintech with AI',
      image: 'https://placehold.co/800x500/37D5BB/FFFFFF?text=AI+Fintech+Platform',
      paragraphs: [
        "Our client, a leading fintech startup, needed to enhance their transaction processing capabilities and detect fraud more efficiently. We developed a bespoke AI-powered platform that integrated machine learning models for anomaly detection and predictive analytics.",
        "The solution led to a remarkable 40% increase in transaction efficiency, significantly reduced manual intervention, and improved fraud detection accuracy by 25%. This innovation positioned our client as a leader in secure and efficient financial operations."
      ]
    },
    'case-study-2': {
      title: 'Seamless Cloud Migration for Enterprise',
      image: 'https://placehold.co/800x500/6F42C1/FFFFFF?text=Enterprise+Cloud+Migration',
      paragraphs: [
        "A large enterprise with complex legacy systems faced challenges in scalability, maintenance, and operational costs. We devised a comprehensive cloud migration strategy, moving their entire infrastructure to a robust and secure cloud environment.",
        "The migration resulted in a 25% reduction in operational costs, enhanced system reliability, and significantly improved scalability, allowing the client to adapt quickly to market demands and new business opportunities."
      ]
    },
    'case-study-3': {
      title: 'E-commerce Platform Redesign & Growth',
      image: 'https://placehold.co/800x500/00C2B8/FFFFFF?text=E-commerce+Redesign',
      paragraphs: [
        "Our e-commerce client sought to improve user experience and increase conversion rates. We undertook a complete redesign of their platform, focusing on intuitive navigation, mobile responsiveness, and a streamlined checkout process.",
        "This strategic overhaul led to a 30% increase in conversion rates, a 50% reduction in bounce rate, and a significant boost in customer satisfaction, driving substantial revenue growth for the client."
      ]
    }
  };

  const [currentCaseStudy, setCurrentCaseStudy] = useState(null);

  const openCaseStudyModal = (id) => {
    setCurrentCaseStudy(caseStudyContent[id]);
    setCaseStudyModalOpen(true);
  };

  const closeCaseStudyModal = () => {
    setCaseStudyModalOpen(false);
    setCurrentCaseStudy(null);
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.6,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: 'background-color 0.3s ease, color 0.3s ease',
        overflowX: 'hidden',
      }}>
        {/* Header Section */}
        <AppBar position="fixed" sx={{
          background: mode === 'dark' ? 'rgba(0, 0, 102, 0.8)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          paddingY: '1rem',
          zIndex: 1000,
          transition: 'background 0.3s ease, border-bottom 0.3s ease',
          boxShadow: 'none',
        }}>
          <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="#hero" sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="img" src="http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/Nichi-logo.png" alt="IT Solutions Inc. Logo" sx={{ height: 50 }} />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <List sx={{ display: 'flex', gap: '2.5rem', listStyle: 'none', padding: 0 }}>
                {['Home', 'About', 'Services', 'Industries', 'Partnerships', 'Blog', 'Contact'].map((item, index) => (
                  <ListItem key={item} disablePadding>
                    <Link
                      href={`#${item.toLowerCase().replace(' ', '-')}`}
                      sx={{
                        color: '#000066', // Specific color from CSS
                        textDecoration: 'none',
                        fontWeight: 500,
                        position: 'relative',
                        paddingY: '0.25rem',
                        transition: 'color 0.3s ease',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                        '&.active': { // Placeholder for active class
                          color: theme.palette.primary.main,
                        }
                      }}
                      className="nav-link-item" // Add class for JS to target
                      data-section={item.toLowerCase().replace(' ', '-')}
                    >
                      <Typography variant="body1">{item}</Typography>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <IconButton onClick={toggleTheme} color="inherit" aria-label="Toggle dark and light theme"
                sx={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiSvgIcon-root': {
                    width: 24,
                    height: 24,
                    color: theme.palette.accent.main,
                  }
                }}
              >
                {mode === 'dark' ? <Brightness7 sx={{ color: '#000066' }} /> : <Brightness4 />}
              </IconButton>
              <Button variant="contained" color="primary" sx={{ display: { xs: 'none', md: 'flex' } }}>
                Book a Demo
              </Button>
              <IconButton
                sx={{ display: { xs: 'flex', md: 'none' }, width: 40, height: 40, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', p: 0 }}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <Box component="span" sx={{ display: 'block', width: '100%', height: 3, backgroundColor: theme.palette.primary.main, borderRadius: 5, transition: 'all 0.3s ease-in-out', transformOrigin: 'center', ...(mobileOpen && { transform: 'translateY(8px) rotate(45deg)' }) }} />
                <Box component="span" sx={{ display: 'block', width: '100%', height: 3, backgroundColor: theme.palette.primary.main, borderRadius: 5, transition: 'all 0.3s ease-in-out', transformOrigin: 'center', ...(mobileOpen && { opacity: 0 }) }} />
                <Box component="span" sx={{ display: 'block', width: '100%', height: 3, backgroundColor: theme.palette.primary.main, borderRadius: 5, transition: 'all 0.3s ease-in-out', transformOrigin: 'center', ...(mobileOpen && { transform: 'translateY(-8px) rotate(-45deg)' }) }} />
              </IconButton>
            </Box>
          </Container>
        </AppBar>

        {/* Mobile Navigation Overlay */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: {
              width: '100vw',
              height: '100vh',
              background: mode === 'dark' ? 'rgba(26, 32, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              zIndex: 999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.4s ease-out',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              display: { xs: 'block', md: 'none' }
            }}
          >
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: theme.palette.primary.main }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ listStyle: 'none', textAlign: 'center', padding: 0 }}>
            {['Home', 'About', 'Services', 'Industries', 'Partnerships', 'Case Studies', 'Blog', 'Contact'].map((item) => (
              <ListItem key={item} disablePadding sx={{ marginY: '2rem' }}>
                <Link
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    color: theme.palette.text.primary,
                    textDecoration: 'none',
                    fontSize: '2rem',
                    fontWeight: 600,
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <Typography variant="inherit">{item}</Typography>
                </Link>
              </ListItem>
            ))}
            <ListItem disablePadding sx={{ marginY: '2rem' }}>
              <Button variant="contained" color="primary" sx={{ width: '100%' }}>
                Book a Demo
              </Button>
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content Area */}
        <Box component="main">
          {/* Hero Section - Simplified, actual 3JS background omitted for MUI conversion */}
          <Box id="hero" sx={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            textAlign: 'center',
            paddingTop: '80px',
            backgroundColor: '#0d1117', // Fallback for 3JS
            color: '#fff',
          }}>
            {/* 3JS Canvas Placeholder */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
              // Background styles might go here if not using 3JS for now
            }} id="hero-canvas-container" />
            <Box sx={{
              position: 'relative',
              zIndex: 2,
              color: '#fff',
              padding: '1rem',
            }}>
              <Typography variant="h1" sx={{
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                textShadow: '4px 4px 10px rgba(0,0,0,0.5)',
                // Animations omitted for brevity, would use GSAP/React state
              }}>
                <Box component="span" sx={{ display: 'inline-block' }}>Leading </Box>
                <Box component="span" sx={{ display: 'inline-block', color: theme.palette.primary.main }}>Digital </Box>
                <Box component="span" sx={{ display: 'inline-block' }}>Innovation</Box>
              </Typography>
              <Typography variant="h6" sx={{
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                maxWidth: 800,
                margin: '0 auto 2.5rem',
                color: 'rgba(255, 255, 255, 0.8)',
                // Animations omitted
              }}>
                Empowering businesses with cutting-edge software, cloud solutions, AI, and comprehensive digital strategies for unparalleled growth.
              </Typography>
              <Box sx={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center',
                flexDirection: { xs: 'column', md: 'row' },
                // Animations omitted
              }}>
                <Button variant="contained" color="primary">Explore Services</Button>
                <Button variant="outlined" color="primary" sx={{
                  background: 'none',
                  color: theme.palette.primary.main,
                  border: `2px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    background: theme.palette.primary.main,
                    color: theme.palette.background.default,
                  },
                }}>
                  Book a Consultation
                </Button>
              </Box>
            </Box>
          </Box>

          {/* About Section */}
          <Box id="about" component="section" sx={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
            <Container maxWidth="lg">
              <Typography variant="h2" align="center" sx={{
                fontSize: { xs: '2.2rem', md: '2.8rem' },
                fontWeight: 800,
                marginBottom: '0.5rem',
                color: theme.palette.primary.main,
                textShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              }}>
                About Us
              </Typography>
              <Typography variant="subtitle1" align="center" sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: theme.palette.text.secondary,
                marginBottom: { xs: '2rem', md: '3rem' },
                maxWidth: 800,
                marginX: 'auto',
              }}>
                Pioneering digital transformation through innovative technology and strategic insights.
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: '3rem',
                alignItems: 'center',
              }}>
                <Box sx={{ order: { xs: -1, md: 0 } }}> {/* Image first on mobile */}
                  <Box component="img" src="https://placehold.co/600x400/00C2B8/FFFFFF?text=About+Us+Image" alt="About Us" sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 3,
                    boxShadow: `0 10px 30px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                  }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    color: theme.palette.primary.main,
                  }}>
                    Driving Innovation for a Digital Future
                  </Typography>
                  <Typography variant="body1" sx={{
                    marginBottom: '1.2rem',
                    lineHeight: 1.8,
                    color: theme.palette.text.primary,
                  }}>
                    At Nichi-In Software Solutions, we are dedicated to transforming businesses
                    through cutting-edge technology. Our expertise spans bespoke software development,
                    seamless cloud migrations, advanced AI and machine learning implementations,
                    and result-driven digital marketing strategies.
                  </Typography>
                  <Typography variant="body1" sx={{
                    marginBottom: '1.2rem',
                    lineHeight: 1.8,
                    color: theme.palette.text.primary,
                  }}>
                    We partner with clients to understand their unique challenges,
                    design innovative solutions, and deliver measurable impact.
                    Our commitment to excellence ensures that our clients stay ahead in the rapidly evolving digital landscape.
                  </Typography>
                  <Button variant="contained" color="primary">Learn More</Button>
                </Box>
              </Box>
            </Container>
          </Box>

          {/* Services Section */}
          <Box id="services" component="section" sx={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{
                fontSize: { xs: '2.2rem', md: '2.8rem' },
                fontWeight: 800,
                marginBottom: '0.5rem',
                color: theme.palette.primary.main,
                textShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              }}>
                Our Core Services
              </Typography>
              <Typography variant="subtitle1" sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: theme.palette.text.secondary,
                marginBottom: { xs: '2rem', md: '3rem' },
                maxWidth: 800,
                marginX: 'auto',
              }}>
                Comprehensive solutions designed to accelerate your business growth and digital transformation.
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(280px, 1fr))' },
                gap: '2rem',
              }}>
                {['Software Development', 'Cloud Transformation', 'AI & ML Solutions', 'Digital Marketing'].map((service, index) => (
                  <Box key={service} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '2.5rem',
                    background: theme.palette.background.paper,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: 3,
                    boxShadow: `0 8px 32px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                    transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    '&:hover .icon-wrapper': {
                      transform: 'scale(1.1)',
                      boxShadow: `0 0 30px ${theme.palette.primary.main}CC`, // CC for 80% opacity
                    },
                  }}>
                    <Box className="icon-wrapper" sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '50%',
                      padding: '1rem',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 80,
                      height: 80,
                      boxShadow: `0 0 20px ${theme.palette.primary.main}99`, // 99 for 60% opacity
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}>
                      {/* Placeholder icons, replace with actual SVGs or MUI icons */}
                      {index === 0 && <Box component="span" sx={{ fontSize: '48px', color: theme.palette.background.default }}>💻</Box>}
                      {index === 1 && <Box component="span" sx={{ fontSize: '48px', color: theme.palette.background.default }}>☁️</Box>}
                      {index === 2 && <Box component="span" sx={{ fontSize: '48px', color: theme.palette.background.default }}>🧠</Box>}
                      {index === 3 && <Box component="span" sx={{ fontSize: '48px', color: theme.palette.background.default }}>📈</Box>}
                    </Box>
                    <Typography variant="h3" sx={{
                      fontSize: '1.8rem',
                      marginBottom: '1rem',
                      color: theme.palette.primary.main,
                    }}>
                      {service}
                    </Typography>
                    <Typography variant="body1" sx={{
                      fontSize: '1rem',
                      color: theme.palette.text.primary,
                      marginBottom: '1.5rem',
                    }}>
                      {service === 'Software Development' && 'Crafting custom software solutions tailored to your business needs, from concept to deployment.'}
                      {service === 'Cloud Transformation' && 'Migrate to the cloud seamlessly, optimizing infrastructure for scalability, security, and efficiency.'}
                      {service === 'AI & ML Solutions' && 'Leverage artificial intelligence and machine learning to unlock insights and automate processes.'}
                      {service === 'Digital Marketing' && 'Boost your online presence and reach your target audience with data-driven marketing strategies.'}
                    </Typography>
                    <Link href="#" sx={{
                      color: theme.palette.accent.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}>
                      Read More
                    </Link>
                  </Box>
                ))}
              </Box>
            </Container>
          </Box>

          {/* Industry Slider Section - Simplified, JS animation omitted */}
          <Box id="industries" component="section" sx={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: '#0d1117',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            padding: 0,
            // Industry slider JS/GSAP animation would be here
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: 8,
              transformOrigin: 'center left',
              backgroundColor: theme.palette.accent.main,
              boxShadow: `0 0 15px ${theme.palette.accent.main}66`,
              zIndex: 10,
              // transform: 'scaleX(0%)' - controlled by JS
            }} className="progress-bar" />
            <Typography variant="h1" sx={{
              position: 'absolute',
              bottom: '1rem',
              right: { xs: '1.5rem', md: '2.5rem' },
              color: '#fff',
              zIndex: 10,
              textShadow: '5px 5px 15px rgba(0,0,0,0.15)',
              fontFamily: 'Anton, sans-serif',
              fontSize: { xs: '1.5rem', md: '2rem' },
            }} className="progress-counter">
              0% {/* Controlled by JS */}
            </Typography>

            <Box sx={{
              display: 'flex',
              height: '100vh',
              width: 'fit-content', // Will be adjusted by JS
              // transform: 'translateX(0)' - controlled by JS
            }} className="scroller">
              {[
                { title: 'Manufacturing', img: 'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/14331.jpg' },
                { title: 'Retail & E-commerce', img: 'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/vendor-weighting-fresh-produce-buyer.jpg' },
                { title: 'Healthcare', img: 'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/5044.jpg' },
                { title: 'Finance', img: 'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/2237.jpg' },
                { title: 'Logistics', img: 'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/41092.jpg' },
                { title: 'Education', img: 'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/60360.jpg' },
                { title: 'Government', img: 'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/2149153256.jpg' },
              ].map((slide, index) => (
                <Box key={index} sx={{
                  flexShrink: 0,
                  width: '100vw',
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '2rem',
                  boxSizing: 'border-box',
                  color: '#fff',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${slide.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 1,
                    zIndex: 1,
                    transition: 'opacity 0.6s ease-out',
                  },
                  '& h1': {
                    fontFamily: 'Anton, sans-serif',
                    fontSize: { xs: '10vw', sm: '8vw', md: '8vw' },
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    letterSpacing: '-2px',
                    margin: 0,
                    position: 'relative',
                    zIndex: 2,
                    opacity: 0, // Controlled by JS 'is-active' class
                    transform: 'scale(0.9)', // Controlled by JS 'is-active' class
                    transition: 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                    textShadow: '2px 2px 8px rgba(0,0,0,0.4)',
                  },
                  // '.is-active & h1': { opacity: 1, transform: 'scale(1)' } // CSS class for active slide
                }} className="industry-slide">
                  <Typography variant="h1">{slide.title}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{
              position: 'absolute',
              bottom: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: { xs: '0.5rem', md: '0.75rem' },
              zIndex: 10,
            }} className="pagination-dots">
              {/* Dots generated by JS */}
            </Box>
          </Box>

          {/* Partnerships Showcase - Slick Carousel not directly translatable to MUI sx, simplified layout */}
          <Box id="partnerships-showcase" component="section" sx={{
            height: '100vh',
            width: '100vw',
            padding: 0,
            overflow: 'hidden',
            background: '#111',
            color: '#fff',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            <Box sx={{
              position: 'relative',
              width: { xs: '100vw', md: '50vw' },
              height: { xs: '50%', md: '100vh' },
              overflow: 'hidden',
              zIndex: 1,
            }} className="slideshow slideshow-left">
              {/* Main Slider Content (Simplified to show one item) */}
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 2,
                },
                '& img': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  zIndex: 1,
                }
              }}>
                <Box component="img" src="http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/SF2135X1500.png" alt="Salesforce Partner" />
                <Box sx={{
                  position: 'absolute',
                  bottom: 60,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'left',
                  width: '80%',
                  zIndex: 5,
                  pointerEvents: 'auto',
                }}>
                  <Typography variant="body1" sx={{ fontSize: { xs: 16, md: 20 }, marginBottom: '15px', color: 'white' }}>
                    Empower your enterprise with world-class CRM implementations that streamline workflows,
                    enhance customer engagement, and drive measurable business growth through customized Salesforce strategies.
                  </Typography>
                  <Button variant="contained" sx={{
                    padding: '10px 25px',
                    background: '#fff',
                    color: '#000',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: 16,
                    cursor: 'pointer',
                    transition: '0.3s ease',
                    '&:hover': {
                      background: '#eee',
                      transform: 'scale(1.05)',
                    }
                  }}>Learn More</Button>
                </Box>
              </Box>
            </Box>

            <Box sx={{
              width: { xs: '100vw', md: '50vw' },
              height: { xs: '50%', md: '100vh' },
              pointerEvents: 'none',
              zIndex: 1,
              overflow: 'hidden',
            }} className="slideshow slideshow-right">
              {/* Mirror Slider Content (Simplified to show one item) */}
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                '& img': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                }
              }}>
                <Box component="img" src="http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/2150010125.jpg" alt="Product Development" />
              </Box>
            </Box>

            <Typography variant="h1" sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              textAlign: 'center',
              fontSize: { xs: 40, md: 80 },
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: { xs: 5, md: 12 },
              zIndex: 100,
              pointerEvents: 'none',
              lineHeight: 0.8,
            }} className="slideshow-text">
              Salesforce Partner {/* This would change with JS */}
            </Typography>

            {/* Slick Dots Placeholder - will need custom React component */}
            <Box sx={{
              position: 'absolute',
              zIndex: 100,
              width: 40,
              height: 'auto',
              bottom: 'auto',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              left: 'auto',
              color: '#fff',
              display: 'block',
              paddingRight: '10px',
            }} className="slick-dots">
              {/* Dots would be rendered here */}
            </Box>
          </Box>


          {/* Our Members Section */}
          <Box id="our-members" component="section" sx={{
            backgroundColor: theme.palette.background.default,
            padding: '6rem 0',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <Container maxWidth="lg">
              <Typography variant="h2" align="center" sx={{
                fontSize: { xs: '2.2rem', md: '2.8rem' },
                fontWeight: 800,
                marginBottom: '0.5rem',
                color: theme.palette.primary.main,
                textShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              }}>
                Our Esteemed Memberships
              </Typography>
              <Typography variant="subtitle1" align="center" sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: theme.palette.text.secondary,
                marginBottom: { xs: '2rem', md: '3rem' },
                maxWidth: 800,
                marginX: 'auto',
              }}>
                Proudly affiliated with leading industry organizations, fostering innovation and excellence.
              </Typography>
              <Box sx={{
                width: '100%',
                overflow: 'hidden',
                marginTop: '3rem',
                backgroundColor: theme.palette.background.paper,
                borderRadius: 3,
                paddingY: '2rem',
                boxShadow: `inset 0 0 10px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
                position: 'relative',
              }}>
                <Box sx={{
                  display: 'flex',
                  width: 'fit-content', // This needs to be dynamic based on content
                  animation: `${scrollLogos} 30s linear infinite`,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    animationPlayState: 'paused',
                  },
                  '& img': {
                    height: 80,
                    margin: '0 40px',
                    objectFit: 'contain',
                    filter: 'grayscale(100%) brightness(0.8)',
                    transition: 'filter 0.3s ease',
                    '&:hover': {
                      filter: 'grayscale(0%) brightness(1)',
                    },
                  },
                }} className="logo-carousel-track">
                  {[
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/2-1.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/1-2.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/3-1.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/4-1.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/ESC.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/5-1.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/ITPNCN-Logo-1.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/IACC.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/JCCIC.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/jccib.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/NASSCOM_Certificate.png',
                    // Duplicate for seamless loop
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/2-1.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/1-2.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/3-1.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/4-1.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/ESC.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/5-1.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/ITPNCN-Logo-1.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/IACC.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/JCCIC.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/jccib.png',
                    'http://localhost/Nichi-in%20Revamp/wp-content/uploads/2025/06/NASSCOM_Certificate.png',
                  ].map((logo, index) => (
                    <Box component="img" key={index} src={logo} alt={`Member Logo ${index + 1}`} />
                  ))}
                </Box>
              </Box>
            </Container>
          </Box>

          {/* Metrics Section */}
          <Box id="metrics" component="section" sx={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{
                fontSize: { xs: '2.2rem', md: '2.8rem' },
                fontWeight: 800,
                marginBottom: '0.5rem',
                color: theme.palette.primary.main,
                textShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              }}>
                Our Achievements
              </Typography>
              <Typography variant="subtitle1" sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: theme.palette.text.secondary,
                marginBottom: { xs: '2rem', md: '3rem' },
                maxWidth: 800,
                marginX: 'auto',
              }}>
                Quantifiable results reflecting our dedication to excellence and client success.
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(220px, 1fr))' },
                gap: '2rem',
                textAlign: 'center',
              }}>
                {[
                  { number: '150+', label: 'Successful Projects' },
                  { number: '10+', label: 'Years of Experience' },
                  { number: '99.9%', label: 'Client Satisfaction' },
                  { number: '20+', label: 'Global Clients' },
                ].map((metric, index) => (
                  <Box key={index} sx={{ padding: '2rem', background: theme.palette.background.paper,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: 3,
                    boxShadow: `0 8px 32px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                  }}>
                    <Typography variant="h1" component="span" sx={{
                      fontFamily: 'Anton, sans-serif',
                      fontSize: '4rem',
                      fontWeight: 700,
                      color: theme.palette.accent.main,
                      lineHeight: 1,
                      display: 'block',
                      marginBottom: '0.5rem',
                      textShadow: `2px 2px 8px ${theme.palette.accent.main}66`,
                    }}>
                      {metric.number}
                    </Typography>
                    <Typography variant="subtitle1" sx={{
                      fontSize: '1.1rem',
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}>
                      {metric.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Container>
          </Box>

          {/* Case Studies Section */}
          <Box id="case-studies" component="section" sx={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{
                fontSize: { xs: '2.2rem', md: '2.8rem' },
                fontWeight: 800,
                marginBottom: '0.5rem',
                color: theme.palette.primary.main,
                textShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              }}>
                Case Studies
              </Typography>
              <Typography variant="subtitle1" sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: theme.palette.text.secondary,
                marginBottom: { xs: '2rem', md: '3rem' },
                maxWidth: 800,
                marginX: 'auto',
              }}>
                Explore how our innovative solutions have delivered tangible results for our clients.
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' },
                gap: '2rem',
              }}>
                {Object.keys(caseStudyContent).map((key) => (
                  <Box
                    key={key}
                    data-modal-target={key}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      background: theme.palette.background.paper,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: 3,
                      boxShadow: `0 8px 32px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                      transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                      '&:hover img': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Box sx={{
                      width: '100%',
                      height: 220,
                      overflow: 'hidden',
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                    }}>
                      <Box component="img" src={caseStudyContent[key].image} alt={caseStudyContent[key].title} sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }} />
                    </Box>
                    <Box sx={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h4" sx={{
                        fontSize: '1.6rem',
                        marginBottom: '0.5rem',
                        color: theme.palette.primary.main,
                      }}>
                        {caseStudyContent[key].title}
                      </Typography>
                      <Typography variant="body2" sx={{
                        fontSize: '0.95rem',
                        color: theme.palette.text.secondary,
                        marginBottom: '1rem',
                        flexGrow: 1,
                      }}>
                        {caseStudyContent[key].paragraphs[0]} {/* Show first paragraph as snippet */}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ alignSelf: 'flex-start', marginTop: '1rem' }}
                        onClick={() => openCaseStudyModal(key)}
                      >
                        View Case Study
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Container>
          </Box>

          {/* Testimonials Section - Simplified, JS animation omitted */}
          <Box id="testimonials" component="section" sx={{
            padding: '6rem 0',
            backgroundColor: theme.palette.background.default, // Using theme default, original had specific bg
            backgroundImage: 'url("https://alcs-slider.netlify.app/images/pattern-curve.svg")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left bottom',
            backgroundSize: '280px 72px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            color: '#2d3748', // Original dark blue
            position: 'relative', // For buttons positioning
          }}>
            <Container maxWidth="md" sx={{
              width: '100%',
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {[
                {
                  quote: "Nichi-In Solutions transformed our outdated systems into a streamlined, cloud-based platform. Their expertise and dedication were exceptional, leading to significant improvements in our operational efficiency.",
                  author: "Jane Doe",
                  title: "CEO, Tech Innovators"
                },
                {
                  quote: "The AI solution provided by Nichi-In greatly enhanced our data analysis capabilities, giving us insights we never had before. Their team was professional, responsive, and truly understood our needs.",
                  author: "John Smith",
                  title: "Data Scientist, Global Analytics"
                },
                {
                  quote: "We are thrilled with the results of our digital marketing campaign executed by Nichi-In. Our online presence has grown exponentially, directly translating to increased leads and conversions.",
                  author: "Emily White",
                  title: "Marketing Director, Creative Brands"
                },
              ].map((testimonial, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    opacity: 0,
                    visibility: 'hidden',
                    transform: 'scale(0.95)',
                    transition: 'opacity 0.8s ease, visibility 0.8s ease, transform 0.8s ease',
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: { xs: 'center', md: 'left' },
                    pointerEvents: 'none',
                    gap: { xs: '32px', md: '64px' }, // Gap on mobile and desktop
                    // Simplified: only show the first testimonial
                    ...(index === 0 && {
                      opacity: 1,
                      visibility: 'visible',
                      transform: 'scale(1)',
                      position: 'relative',
                      zIndex: 1,
                      pointerEvents: 'auto',
                    }),
                  }}
                  className={`slide ${index === 0 ? 'active' : ''}`} // Placeholder for active class
                >
                  <Box sx={{
                    padding: '32px',
                    backgroundImage: 'url("https://alcs-slider.netlify.app/images/pattern-quotes.svg")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: { xs: 'top', md: '0% 0%' },
                    backgroundSize: { xs: '60px', md: '80px' },
                    flex: { md: 1 },
                  }}>
                    <Typography variant="blockquote" component="p" sx={{
                      fontWeight: 300,
                      lineHeight: 1.6,
                      marginBottom: '24px',
                      fontSize: { xs: '1rem', md: '1.25rem' },
                    }}>
                      "{testimonial.quote}"
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {testimonial.author}
                      <Box component="span" sx={{
                        display: { xs: 'block', md: 'inline' },
                        color: '#607d8b', // Grayish blue
                        fontWeight: 500,
                        marginLeft: { xs: 0, md: '8px' },
                      }}>
                        {testimonial.title}
                      </Box>
                    </Typography>
                  </Box>
                  <Box sx={{
                    padding: '30px',
                    backgroundImage: 'url("https://alcs-slider.netlify.app/images/pattern-bg.svg")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}>
                    <Box component="img" src={`https://placehold.co/${index === 0 ? '200x200' : '280x280'}/757575/FFFFFF?text=Client+Photo`} alt={testimonial.author} sx={{
                      width: { xs: '200px', md: '280px' },
                      borderRadius: 3,
                      boxShadow: '0px 16px 40px rgba(135, 105, 210, 0.4)',
                    }} />
                  </Box>
                </Box>
              ))}

              <Box sx={{
                position: 'absolute',
                bottom: { xs: '-30px', md: '-50px' },
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                backgroundColor: 'white',
                borderRadius: '50px',
                width: 80,
                height: 40,
                overflow: 'hidden',
                zIndex: 10,
              }}>
                <IconButton sx={{
                  width: '50%',
                  height: '100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  cursor: 'pointer',
                  backgroundImage: 'url("https://alcs-slider.netlify.app/images/icon-prev.svg")',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.25)', backgroundColor: 'transparent' },
                }} aria-label="Previous testimonial" />
                <IconButton sx={{
                  width: '50%',
                  height: '100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  cursor: 'pointer',
                  backgroundImage: 'url("https://alcs-slider.netlify.app/images/icon-next.svg")',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.25)', backgroundColor: 'transparent' },
                }} aria-label="Next testimonial" />
              </Box>
            </Container>
          </Box>


          {/* Blog Section */}
          <Box id="blog" component="section" sx={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{
                fontSize: { xs: '2.2rem', md: '2.8rem' },
                fontWeight: 800,
                marginBottom: '0.5rem',
                color: theme.palette.primary.main,
                textShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              }}>
                Latest from Our Blog
              </Typography>
              <Typography variant="subtitle1" sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: theme.palette.text.secondary,
                marginBottom: { xs: '2rem', md: '3rem' },
                maxWidth: 800,
                marginX: 'auto',
              }}>
                Stay updated with our insights, industry trends, and technology breakthroughs.
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' },
                gap: '2rem',
              }}>
                {[
                  { title: 'The Future of AI in Business', date: 'May 20, 2025', author: 'IT Solutions Team', image: 'https://placehold.co/400x200/F4D35E/2d3748?text=AI+Future' },
                  { title: 'Cloud Security Best Practices', date: 'May 15, 2025', author: 'IT Solutions Team', image: 'https://placehold.co/400x200/00C2B8/2d3748?text=Cloud+Security' },
                  { title: 'Mastering Digital Marketing', date: 'May 10, 2025', author: 'IT Solutions Team', image: 'https://placehold.co/400x200/6F42C1/FFFFFF?text=Digital+Marketing' },
                ].map((post, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      background: theme.palette.background.paper,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: 3,
                      boxShadow: `0 8px 32px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                      transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                      '&:hover img': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Box sx={{
                      width: '100%',
                      height: 200,
                      overflow: 'hidden',
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                    }}>
                      <Box component="img" src={post.image} alt={post.title} sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }} />
                    </Box>
                    <Box sx={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h4" sx={{
                        fontSize: '1.6rem',
                        marginBottom: '0.5rem',
                        color: theme.palette.primary.main,
                      }}>
                        {post.title}
                      </Typography>
                      <Box sx={{
                        fontSize: '0.85rem',
                        color: theme.palette.text.secondary,
                        marginBottom: '1rem',
                        display: 'flex',
                        gap: '1rem',
                      }}>
                        <Typography component="span">{post.date}</Typography>
                        <Typography component="span">by {post.author}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{
                        fontSize: '0.95rem',
                        color: theme.palette.text.primary,
                        marginBottom: '1rem',
                        flexGrow: 1,
                      }}>
                        {post.title === 'The Future of AI in Business' && 'A deep dive into how artificial intelligence is reshaping industries and creating new opportunities.'}
                        {post.title === 'Cloud Security Best Practices' && 'Essential guidelines for securing your data and applications in the cloud environment.'}
                        {post.title === 'Mastering Digital Marketing' && 'Strategies and tips to optimize your digital presence and drive successful campaigns.'}
                      </Typography>
                      <Link href="#" sx={{
                        color: theme.palette.accent.main,
                        textDecoration: 'none',
                        fontWeight: 600,
                        alignSelf: 'flex-start',
                        transition: 'color 0.3s ease',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}>
                        Read More
                      </Link>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Container>
          </Box>

          {/* Contact Section */}
          <Box id="contact" component="section" sx={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{
                fontSize: { xs: '2.2rem', md: '2.8rem' },
                fontWeight: 800,
                marginBottom: '0.5rem',
                color: theme.palette.primary.main,
                textShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              }}>
                Get in Touch
              </Typography>
              <Typography variant="subtitle1" sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: theme.palette.text.secondary,
                marginBottom: { xs: '2rem', md: '3rem' },
                maxWidth: 800,
                marginX: 'auto',
              }}>
                Have a question or a project in mind? We'd love to hear from you.
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' },
                gap: '3rem',
                alignItems: 'flex-start',
              }}>
                <Box sx={{
                  background: theme.palette.background.paper,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: 3,
                  boxShadow: `0 8px 32px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                  padding: '2rem',
                }}>
                  <Typography variant="h3" sx={{
                    fontSize: '2rem',
                    marginBottom: '1.5rem',
                    color: theme.palette.primary.main,
                  }}>
                    Send us a Message
                  </Typography>
                  <form>
                    <Box sx={{ marginBottom: '1.5rem' }}>
                      <Typography component="label" htmlFor="name" sx={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: theme.palette.text.primary }}>Name</Typography>
                      <Box
                        component="input"
                        type="text"
                        id="name"
                        placeholder="Your Name"
                        sx={{
                          width: '100%',
                          padding: '0.8rem',
                          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                          borderRadius: '8px',
                          backgroundColor: theme.palette.background.paper,
                          color: theme.palette.text.primary,
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease, background-color 0.3s ease',
                          '&:focus': {
                            outline: 'none',
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 3px ${theme.palette.primary.main}4D`, // 4D for 30% opacity
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ marginBottom: '1.5rem' }}>
                      <Typography component="label" htmlFor="email" sx={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: theme.palette.text.primary }}>Email</Typography>
                      <Box
                        component="input"
                        type="email"
                        id="email"
                        placeholder="your@example.com"
                        sx={{
                          width: '100%',
                          padding: '0.8rem',
                          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                          borderRadius: '8px',
                          backgroundColor: theme.palette.background.paper,
                          color: theme.palette.text.primary,
                          fontSize: '1rem',
                          '&:focus': {
                            outline: 'none',
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 3px ${theme.palette.primary.main}4D`,
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ marginBottom: '1.5rem' }}>
                      <Typography component="label" htmlFor="message" sx={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: theme.palette.text.primary }}>Message</Typography>
                      <Box
                        component="textarea"
                        id="message"
                        rows="5"
                        placeholder="Your message here..."
                        sx={{
                          width: '100%',
                          padding: '0.8rem',
                          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                          borderRadius: '8px',
                          backgroundColor: theme.palette.background.paper,
                          color: theme.palette.text.primary,
                          fontSize: '1rem',
                          '&:focus': {
                            outline: 'none',
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 3px ${theme.palette.primary.main}4D`,
                          },
                        }}
                      />
                    </Box>
                    <Button variant="contained" color="primary" sx={{ width: '100%' }}>Send Message</Button>
                  </form>
                  {/* Form message placeholder */}
                  {/* <Box sx={{ marginTop: '1rem', padding: '1rem', borderRadius: 2, fontWeight: 600, backgroundColor: 'rgba(0, 194, 184, 0.2)', color: theme.palette.primary.main }}>
                    Your message has been sent successfully!
                  </Box> */}
                </Box>

                <Box sx={{
                  background: theme.palette.background.paper,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: 3,
                  boxShadow: `0 8px 32px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                  padding: '2rem',
                }}>
                  <Typography variant="h3" sx={{
                    fontSize: '2rem',
                    marginBottom: '1.5rem',
                    color: theme.palette.primary.main,
                  }}>
                    Contact Information
                  </Typography>
                  <List sx={{ listStyle: 'none', marginBottom: '2rem', padding: 0 }}>
                    <ListItem disablePadding sx={{ marginBottom: '1rem', color: theme.palette.text.primary }}>
                      <Typography component="strong" sx={{ color: theme.palette.primary.main, marginRight: '0.5rem' }}>Email:</Typography>
                      <Link href="mailto:info@itsolutions.com" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>info@itsolutions.com</Link>
                    </ListItem>
                    <ListItem disablePadding sx={{ marginBottom: '1rem', color: theme.palette.text.primary }}>
                      <Typography component="strong" sx={{ color: theme.palette.primary.main, marginRight: '0.5rem' }}>Phone:</Typography>
                      <Link href="tel:+1234567890" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>+1 (234) 567-890</Link>
                    </ListItem>
                    <ListItem disablePadding sx={{ marginBottom: '1rem', color: theme.palette.text.primary }}>
                      <Typography component="strong" sx={{ color: theme.palette.primary.main, marginRight: '0.5rem' }}>Address:</Typography>
                      <Typography component="span">#813, Dr.Puneeth Rajkumar Road, Hosakerehalli, Banashankari 3rd Stage, Bengaluru – 560 085, India</Typography>
                    </ListItem>
                  </List>
                  <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}>
                    <Box
                      component="iframe"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.752329367375!2d77.53032481482103!3d12.918903590892011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3ffc47f7d1b3%3A0xf670d8a5c40e0e3!2sNichi-In%20Software%20Solutions%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1678278783456!5m2!1sen!2sin"
                      width="100%"
                      height="300"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      sx={{ display: 'block', border: 0 }}
                    />
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>

        {/* Footer Section */}
        <Box component="footer" sx={{
          backgroundColor: '#000066', // Specific color from CSS
          color: 'rgba(255, 255, 255, 0.7)',
          paddingY: '3rem',
          fontSize: '0.9rem',
          ...(mode === 'light' && {
            backgroundColor: '#060646', // Specific light theme footer color
          }),
        }}>
          <Container maxWidth="lg">
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(200px, 1fr))' },
              gap: '2rem',
              marginBottom: '2rem',
            }}>
              <Box>
                <Typography variant="h4" sx={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Quick Links</Typography>
                <List sx={{ listStyle: 'none', padding: 0 }}>
                  {['Home', 'About Us', 'Services', 'Industries', 'Partnerships', 'Contact'].map((item) => (
                    <ListItem key={item} disablePadding sx={{ marginBottom: '0.7rem' }}>
                      <Link href={`#${item.toLowerCase().replace(' ', '-')}`} color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
                        {item}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography variant="h4" sx={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>About the Company</Typography>
                <Typography variant="body2" sx={{ color: 'inherit' }}>
                  Empowering businesses through cutting-edge software, cloud, AI, and marketing strategies. Your trusted partner for digital transformation.
                </Typography>
                <Box sx={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <Link href="https://linkedin.com/company/youritsolutions" target="_blank" aria-label="LinkedIn" sx={{ color: 'inherit', '&:hover': { color: theme.palette.primary.main } }}><LinkedIn /></Link>
                  <Link href="https://x.com/nichiinsoft" target="_blank" aria-label="Twitter" sx={{ color: 'inherit', '&:hover': { color: theme.palette.primary.main } }}><Twitter /></Link>
                  <Link href="https://www.facebook.com/people/Nichi-In-Software-Solutions-Pvt-Ltd/100072343385812/#" target="_blank" aria-label="Facebook" sx={{ color: 'inherit', '&:hover': { color: theme.palette.primary.main } }}><Facebook /></Link>
                  <Link href="https://instagram.com/youritsolutions" target="_blank" aria-label="Instagram" sx={{ color: 'inherit', '&:hover': { color: theme.palette.primary.main } }}><Instagram /></Link>
                </Box>
              </Box>

              <Box>
                <Typography variant="h4" sx={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Resources</Typography>
                <List sx={{ listStyle: 'none', padding: 0 }}>
                  {['Privacy Policy', 'Terms of Service', 'Support', 'Careers'].map((item) => (
                    <ListItem key={item} disablePadding sx={{ marginBottom: '0.7rem' }}>
                      <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
                        {item}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography variant="h4" sx={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Corporate Office</Typography>
                <Typography variant="body2" sx={{ color: 'inherit' }}>
                  #813, Dr.Puneeth Rajkumar Road, Hosakerehalli, Banashankari 3rd Stage, Bengaluru – 560 085, India
                </Typography>
                <Typography variant="h4" sx={{ color: '#fff', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '1rem' }}>Development Center 2</Typography>
                <Typography variant="body2" sx={{ color: 'inherit' }}>
                  #812, 1st Floor, Dr.Puneeth Rajkumar Road, Hosakerehalli, Banashankari 3rd Stage, Bengaluru – 560 085, India
                </Typography>
              </Box>
            </Box>
            <Box sx={{
              textAlign: 'center',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              marginTop: '2rem',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              <Typography variant="body2">&copy; 2025 Nichi-In Software Solutions Inc. All rights reserved.</Typography>
            </Box>
          </Container>
        </Box>

        {/* Sticky Marketing CTA Bar */}
        <Box sx={{
          position: 'fixed',
          bottom: stickyCtaVisible ? 0 : -100,
          left: 0,
          width: '100%',
          background: mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          paddingY: '1rem',
          color: mode === 'dark' ? '#fff' : theme.palette.text.primary,
          textAlign: 'center',
          zIndex: 900,
          transition: 'bottom 0.3s ease-out',
          boxShadow: `0 -5px 15px ${mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
        }}>
          <Container maxWidth="lg" sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: '0.5rem', md: 0 }
          }}>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
              Ready to transform your business? <Box component="span" sx={{ color: theme.palette.accent.main }}>Book a Free Audit!</Box>
            </Typography>
            <Button variant="contained" color="primary" size="small" sx={{
              width: { xs: '100%', md: 'auto' },
              '&:hover': {
                boxShadow: `0 0 15px ${theme.palette.primary.main}, 0 0 30px ${theme.palette.primary.main}`,
              },
            }}>
              Book Audit Now
            </Button>
            <IconButton onClick={() => setStickyCtaVisible(false)} sx={{
              background: 'none',
              border: 'none',
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.primary,
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: mode === 'dark' ? '#fff' : theme.palette.primary.main,
              },
              position: { xs: 'absolute', md: 'static' },
              top: '0.5rem',
              right: '0.5rem',
            }}>
              <CloseIcon />
            </IconButton>
          </Container>
        </Box>

        {/* Back to Top Button */}
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
            border: 'none',
            borderRadius: '50%',
            width: 50,
            height: 50,
            minWidth: 50, // Ensure button does not shrink
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: `0 4px 10px ${theme.palette.primary.main}66`,
            opacity: backToTopVisible ? 1 : 0,
            visibility: backToTopVisible ? 'visible' : 'hidden',
            transform: backToTopVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.3s ease-out',
            zIndex: 950,
            '&:hover': {
              backgroundColor: theme.palette.accent.main,
              transform: 'translateY(-5px)',
              boxShadow: `0 8px 15px ${theme.palette.accent.main}66`,
            },
          }}
          aria-label="Back to top"
        >
          <ArrowUpward />
        </Button>

        {/* Case Study Modals */}
        {caseStudyModalOpen && currentCaseStudy && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 1050,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: caseStudyModalOpen ? 1 : 0,
            visibility: caseStudyModalOpen ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease',
          }}>
            <Box sx={{
              position: 'relative',
              maxWidth: 800,
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              transform: caseStudyModalOpen ? 'scale(1)' : 'scale(0.9)',
              transition: 'transform 0.3s ease',
              background: theme.palette.background.paper,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: 3,
              boxShadow: `0 8px 32px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
              padding: '1.5rem', // Padding moved here
            }}>
              <IconButton onClick={closeCaseStudyModal} sx={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: theme.palette.text.primary,
                fontSize: '2rem',
                cursor: 'pointer',
                zIndex: 1060,
                transition: 'color 0.3s ease',
                '&:hover': { color: theme.palette.primary.main },
              }} aria-label="Close modal">
                &times;
              </IconButton>
              <Box sx={{
                padding: 0, // Padding already on parent Box
                color: theme.palette.text.primary,
              }}>
                <Box component="img" src={currentCaseStudy.image} alt={currentCaseStudy.title} sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  marginBottom: '1.5rem',
                }} />
                <Typography variant="h4" sx={{
                  fontSize: '2rem',
                  marginBottom: '1rem',
                  color: theme.palette.primary.main,
                }}>
                  {currentCaseStudy.title}
                </Typography>
                {currentCaseStudy.paragraphs.map((p, idx) => (
                  <Typography key={idx} variant="body1" sx={{ marginBottom: '1rem', lineHeight: 1.7 }}>
                    {p}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Chatbot Toggle Button */}
        <IconButton onClick={() => setChatbotOpen(!chatbotOpen)} sx={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.background.default,
          border: 'none',
          borderRadius: '50%',
          width: 60,
          height: 60,
          minWidth: 60, // Ensure button does not shrink
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.8rem',
          cursor: 'pointer',
          boxShadow: `0 4px 10px ${theme.palette.primary.main}66`,
          zIndex: 1100,
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: theme.palette.primary.main, // Keep color on hover
          },
        }}>
          <ChatBubbleOutline sx={{ width: 32, height: 32, stroke: theme.palette.background.default }} />
        </IconButton>

        {/* Chatbot Window */}
        {chatbotOpen && (
          <Box sx={{
            position: 'fixed',
            bottom: '80px',
            left: '1.5rem',
            width: { xs: 'calc(100vw - 3rem)', md: 350 },
            height: { xs: '80vh', md: 500 },
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: `0 8px 32px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
            zIndex: 1099,
            transform: 'translateY(0) scale(1)', // Always open to scale(1)
            opacity: 1,
            visibility: 'visible',
            transition: 'all 0.3s ease-out',
            background: theme.palette.background.paper, // Use paper for chatbot background
          }}>
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}>
              <Typography variant="h4" sx={{ color: theme.palette.text.primary, margin: 0, fontSize: '1.2rem' }}>
                Chatbot Assistant
              </Typography>
              <IconButton onClick={() => setChatbotOpen(false)} sx={{
                background: 'none',
                border: 'none',
                color: theme.palette.text.primary,
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': { color: theme.palette.primary.main },
              }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box ref={chatbotBodyRef} sx={{
              flexGrow: 1,
              padding: '1rem',
              overflowY: 'auto',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              ...(mode === 'light' && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }),
            }}>
              {chatbotMessages.map((msg, index) => (
                <Box key={index} sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                  ...(msg.sender === 'user' && { justifyContent: 'flex-end' }),
                }}>
                  {msg.sender === 'bot' && (
                    <Box sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '1.2rem',
                      marginRight: '0.5rem',
                      flexShrink: 0,
                    }}>
                      🤖
                    </Box>
                  )}
                  <Box sx={{
                    backgroundColor: msg.sender === 'user' ? theme.palette.primary.main : theme.palette.background.paper,
                    color: msg.sender === 'user' ? theme.palette.background.default : theme.palette.text.primary,
                    padding: '0.8rem 1.2rem',
                    borderRadius: '12px',
                    maxWidth: '80%',
                    wordWrap: 'break-word',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    borderBottomRightRadius: msg.sender === 'user' ? 0 : '12px',
                    borderBottomLeftRadius: msg.sender === 'bot' ? 0 : '12px',
                  }}>
                    <Typography variant="body2">{msg.text}</Typography>
                    {msg.sender === 'bot' && msg.text.includes('services') && (
                      <Box sx={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                        {[
                          'Tell me about Software Services',
                          'Cloud Transformation details',
                          'AI & ML Solutions overview',
                          'Digital Marketing Strategy'
                        ].map((topic, topicIndex) => (
                          <Box key={topicIndex} component="li" sx={{ marginBottom: '0.5rem' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: `1px solid ${theme.palette.primary.main}`,
                                color: theme.palette.primary.main,
                                padding: '0.5rem 0.8rem',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                                fontSize: '0.9rem',
                                '&:hover': {
                                  backgroundColor: theme.palette.primary.main,
                                  color: theme.palette.background.default,
                                },
                              }}
                              onClick={() => handleSendMessage(topic)}
                            >
                              {topic}
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                  {msg.sender === 'user' && (
                    <Box sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.secondary.main,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '1.2rem',
                      marginLeft: '0.5rem',
                      flexShrink: 0,
                      order: 2,
                    }}>
                      👤
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            <Box sx={{
              display: 'flex',
              padding: '1rem',
              borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              background: 'rgba(255, 255, 255, 0.1)',
              gap: '0.5rem',
            }}>
              <Box sx={{ position: 'relative', flexGrow: 1 }}>
                <Box
                  component="input"
                  type="text"
                  id="chatbot-input"
                  placeholder=" " // Important for floating label
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  sx={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    paddingTop: '1.2rem',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px',
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease, background-color 0.3s ease',
                    '&:focus': {
                      outline: 'none',
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 3px ${theme.palette.primary.main}4D`,
                    },
                  }}
                />
                <Typography component="label" htmlFor="chatbot-input" sx={{
                  position: 'absolute',
                  left: '1rem',
                  top: '0.5rem',
                  color: theme.palette.text.secondary,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease',
                  pointerEvents: 'none',
                  'input:focus + &': {
                    top: '0.2rem',
                    fontSize: '0.7rem',
                    color: theme.palette.primary.main,
                  },
                  'input:not(:placeholder-shown) + &': {
                    top: '0.2rem',
                    fontSize: '0.7rem',
                    color: theme.palette.primary.main,
                  },
                }}>
                  Type your message...
                </Typography>
              </Box>
              <IconButton onClick={() => {
                const inputElement = document.getElementById('chatbot-input');
                handleSendMessage(inputElement.value);
                inputElement.value = '';
              }} sx={{
                backgroundColor: theme.palette.primary.main,
                border: 'none',
                borderRadius: '8px',
                padding: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: theme.palette.accent.main,
                },
                '& svg': {
                  width: 24,
                  height: 24,
                  color: theme.palette.background.default,
                }
              }}>
                <Send />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
