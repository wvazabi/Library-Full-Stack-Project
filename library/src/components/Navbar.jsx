import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import BooksIcon from '@mui/icons-material/BookTwoTone';

// Define an array of page routes and titles
const pages = [
    { route: 'book', title: 'Book' },
    { route: 'category', title: 'Category' },
    { route: 'publisher', title: 'Publisher' },
    { route: 'author', title: 'Author' },
    { route: 'book-borrowing', title: 'Book Borrowing' },
];

function Navbar() {
    // State for managing the menu anchor element
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    // Function to open the navigation menu
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    // Function to close the navigation menu
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#4caf50' }}>
            <Container maxWidth="md">
                <Toolbar disableGutters>
                    {/* Icon displayed in larger screens */}
                    <BooksIcon fontSize='large' sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    {/* Title displayed in larger screens */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'brown',
                            textDecoration: 'none',
                        }}
                    >
                        LIBRARY
                    </Typography>

                    {/* Mobile menu icon and dropdown */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{ color: 'brown' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {/* Map through the pages and create menu items */}
                            {pages.map((page, index) => (
                                <MenuItem key={index} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" sx={{ color: 'brown' }}>
                                        <Link to={page.route} style={{ textDecoration: 'none', color: 'brown' }}>
                                            {page.title}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    {/* Icon displayed in smaller screens */}
                    <BooksIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    {/* Title displayed in smaller screens */}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'brown',
                            textDecoration: 'none',
                        }}
                    >
                        Library
                    </Typography>
                    {/* Desktop navigation buttons */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page, index) => (
                            <Button
                                key={index}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'brown', display: 'block' }}
                            >
                                <Typography textAlign="center">
                                    <Link to={page.route} style={{ textDecoration: 'none', color: 'brown' }}>
                                        {page.title}
                                    </Link>
                                </Typography>
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
