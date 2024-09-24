// Import necessary hooks, components, and icons from libraries
import { useState } from "react"; // useState hook to manage component state
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
} from "@mui/material"; // Material UI components for layout and styling
import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close,
} from "@mui/icons-material"; // Material UI icons for navigation bar actions
import { useDispatch, useSelector } from "react-redux"; // Redux hooks to access and modify global state
import { setMode, setLogout } from "state"; // Action creators from Redux store for toggling mode and logging out
import { useNavigate } from "react-router-dom"; // React Router hook for navigating between pages
import FlexBetween from "components/FlexBetween"; // Custom component for flexbox layout with space between children

const Navbar = () => {
    // State hook to handle whether mobile menu is open or not
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);

    const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store
    const navigate = useNavigate(); // Hook to navigate between different routes
    const user = useSelector((state) => state.user); // Get the current user object from Redux state

    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); // Check if the screen width is larger than 1000px (desktop screen)
    const theme = useTheme(); // Hook to access the theme from Material UI for styling purposes

    // Extracting specific colors from the theme for easier use
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    // Concatenate firstName and lastName from the user object
    // const fullName = `${user.firstName} ${user.lastName}`;
    const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest"; // Check if user exists, otherwise show "Guest"


    return (
        // Custom FlexBetween component to align children with space between them, padding, and background color
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
            {/* Left side of the navbar */}
            <FlexBetween gap="1.75rem">
                <Typography
                    fontWeight="bold" // Set the font weight to bold
                    fontSize="clamp(1rem, 2rem, 2.25rem)" // Use clamp for responsive font size (min, preferred,max)
                    color="primary" // Primary color from the theme
                    onClick={() => navigate("/home")} // Navigate to home page on click
                    sx={{
                        "&:hover": { // Styling for hover effect
                            color: primaryLight, // Change color on hover
                            cursor: "pointer", // Show pointer cursor
                        },
                    }}
                >
                    EchoSpace {/* Name of the application */}
                </Typography>

                {/* Only show search bar on larger screens */}
                {isNonMobileScreens && (
                    <FlexBetween
                        backgroundColor={neutralLight} // Set background color to light neutral from theme
                        borderRadius="9px" // Rounded corners for the search bar
                        gap="3rem" // Space between search input and icon
                        padding="0.1rem 1.5rem" // Padding for search bar
                    >
                        <InputBase placeholder="Search..." /> {/* Search input field */}
                        <IconButton>
                            <Search /> {/* Search icon */}
                        </IconButton>
                    </FlexBetween>
                )}
            </FlexBetween>

            {/* Right side of the navbar for non-mobile screens */}
            {isNonMobileScreens ? (
                <FlexBetween gap="2rem"> {/* Space between icons */}
                    {/* Button to toggle between light and dark mode */}
                    <IconButton onClick={() => dispatch(setMode())}> {/* Dispatch Redux action to toggle mode */}
                        {theme.palette.mode === "dark" ? (
                            <DarkMode sx={{ fontSize: "25px" }} /> // Show dark mode icon when in dark mode 
                        ) : (
                            <LightMode sx={{ color: dark, fontSize: "25px" }} /> // Show light mode icon when in light mode 
                        )}
                    </IconButton>
                    <Message sx={{ fontSize: "25px" }} /> {/* Message icon */}
                    <Notifications sx={{ fontSize: "25px" }} /> {/* Notifications icon */}
                    <Help sx={{ fontSize: "25px" }} /> {/* Help icon */}

                    {/* Dropdown menu for user profile and logout */}
                    <FormControl variant="standard" value={fullName}>
                        <Select
                            value={fullName} // User's full name displayed in the dropdown
                            sx={{
                                backgroundColor: neutralLight, // Light background color for the dropdown
                                width: "150px", // Set dropdown width
                                borderRadius: "0.25rem", // Rounded corners
                                p: "0.25rem 1rem", // Padding
                                "& .MuiSvgIcon-root": { // Icon styles
                                    pr: "0.25rem", // Padding right
                                    width: "3rem", // Set icon width
                                },
                                "& .MuiSelect-select:focus": {
                                    backgroundColor: neutralLight, // Change background on focus
                                },
                            }}
                            input={<InputBase />} // Custom input component for the dropdown
                        >
                            <MenuItem value={fullName}>
                                <Typography>{fullName}</Typography> {/* Display user's full name */}
                            </MenuItem>
                            <MenuItem onClick={() => dispatch(setLogout())}> {/* Logout option */}
                                Log Out
                            </MenuItem>
                        </Select>
                    </FormControl>
                </FlexBetween>
            ) : (
                // Hamburger menu icon for mobile screens
                <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                    <Menu />
                </IconButton>
            )}

            {/* Mobile navigation */}
            {!isNonMobileScreens && isMobileMenuToggled && (
                <Box
                    position="fixed" // Fixed positioning for the mobile menu
                    right="0" // Align to the right
                    bottom="0" // Align to the bottom
                    height="100%" // Full height of the screen
                    zIndex="10" // Ensure the menu appears on top of other content
                    maxWidth="500px" // Maximum width for mobile menu
                    minWidth="300px" // Minimum width for mobile menu
                    backgroundColor={background} // Background color from theme
                >
                    {/* Close icon to close the mobile menu */}
                    <Box display="flex" justifyContent="flex-end" p="1rem">
                        <IconButton
                            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)} // Toggle mobile menu on click
                        >
                            <Close /> {/* Close icon */}
                        </IconButton>
                    </Box>

                    {/* Mobile menu items */}
                    <FlexBetween
                        display="flex"
                        flexDirection="column" // Arrange items vertically
                        justifyContent="center"
                        alignItems="center"
                        gap="3rem" // Space between items
                    >
                        {/* Icons for dark/light mode, messages, notifications, and help */}
                        <IconButton
                            onClick={() => dispatch(setMode())}
                            sx={{ fontSize: "25px" }}
                        >
                            {theme.palette.mode === "dark" ? (
                                <DarkMode sx={{ fontSize: "25px" }} />
                            ) : (
                                <LightMode sx={{ color: dark, fontSize: "25px" }} />
                            )}
                        </IconButton>
                        <Message sx={{ fontSize: "25px" }} />
                        <Notifications sx={{ fontSize: "25px" }} />
                        <Help sx={{ fontSize: "25px" }} />

                        {/* User dropdown menu for mobile screens */}
                        <FormControl variant="standard" value={fullName}>
                            <Select
                                value={fullName}
                                sx={{
                                    backgroundColor: neutralLight,
                                    width: "150px",
                                    borderRadius: "0.25rem",
                                    p: "0.25rem 1rem",
                                    "& .MuiSvgIcon-root": {
                                        pr: "0.25rem",
                                        width: "3rem",
                                    },
                                    "& .MuiSelect-select:focus": {
                                        backgroundColor: neutralLight,
                                    },
                                }}
                                input={<InputBase />}
                            >
                                <MenuItem value={fullName}>
                                    <Typography>{fullName}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => dispatch(setLogout())}> {/* Logout for mobile */}
                                    Log Out
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </FlexBetween>
                </Box>
            )}
        </FlexBetween>
    );
};

export default Navbar;
