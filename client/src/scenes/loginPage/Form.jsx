// Import necessary dependencies
import { useState } from "react"; // React hook to manage component state
import {
    Box, Button, TextField, useMediaQuery, Typography, useTheme
} from "@mui/material"; // Material-UI components for layout, inputs, buttons, and responsive design
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // Icon for the edit action
import { Formik } from "formik"; // Form handling library
import * as yup from "yup"; // Yup for schema validation
import { useNavigate } from "react-router-dom"; // React Router hook for navigation between pages
import { useDispatch } from "react-redux"; // Redux hook to dispatch actions to the store
import { setLogin } from "state"; // Redux action to handle login
import Dropzone from "react-dropzone"; // Dropzone component for handling file uploads
import FlexBetween from "components/FlexBetween"; // Custom layout component for flexbox alignment

// Schema for form validation using Yup (for registration)
const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required"),
});

// Schema for form validation using Yup (for login)
const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
});

// Initial values for the registration form
const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
};

// Initial values for the login form
const initialValuesLogin = {
    email: "",
    password: "",
};

// Form component
const Form = () => {
    const [pageType, setPageType] = useState("login"); // Manage state to track whether it's login or registration page
    const { palette } = useTheme(); // Access theme (palette) from Material-UI
    const dispatch = useDispatch(); // Redux dispatch function to trigger actions
    const navigate = useNavigate(); // React Router hook for navigating between routes
    const isNonMobile = useMediaQuery("(min-width:600px)"); // Check if the screen width is greater than 600px for responsive design
    const isLogin = pageType === "login"; // Check if it's login page
    const isRegister = pageType === "register"; // Check if it's registration page

    // Function to handle registration process
    const register = async (values, onSubmitProps) => {
        // Create a form data object to handle the image file along with other fields
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value]); // Append all values to formData
        }
        formData.append("picturePath", values.picture.name); // Append the picture name separately

        // Send the form data to the backend server for registration
        const savedUserResponse = await fetch(
            "http://localhost:3001/auth/register",
            {
                method: "POST", // POST request to create a new user
                body: formData, // Send the formData with the request
            }
        );
        const savedUser = await savedUserResponse.json(); // Parse the response JSON
        onSubmitProps.resetForm(); // Reset the form once submitted

        if (savedUser) {
            setPageType("login"); // Switch to login page after successful registration
        }
    };

    // Function to handle login process
    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
            method: "POST", // POST request to log in
            headers: { "Content-Type": "application/json" }, // Set headers to send JSON data
            body: JSON.stringify(values), // Send the login data as JSON
        });
        const loggedIn = await loggedInResponse.json(); // Parse the response JSON
        onSubmitProps.resetForm(); // Reset the form after submission
        if (loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user, // Save the user data in Redux store
                    token: loggedIn.token, // Save the authentication token
                })
            );
            navigate("/home"); // Navigate to the home page upon successful login
        }
    };

    // Function to handle form submission for either login or registration
    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps); // Call login function if it's login page
        if (isRegister) await register(values, onSubmitProps); // Call register function if it's registration page
    };

    return (
        // Formik component for form management, handles validation and form submission
        <Formik
            onSubmit={handleFormSubmit} // Handles the form submission
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister} // Use appropriate initial values depending on the page type
            validationSchema={isLogin ? loginSchema : registerSchema} // Use appropriate validation schema
        >
            {({
                values, // Current values of the form fields
                errors, // Validation errors
                touched, // Tracks which fields have been touched
                handleBlur, // Handles onBlur event for form fields
                handleChange, // Handles onChange event for form fields
                handleSubmit, // Submits the form
                setFieldValue, // Function to manually set field values
                resetForm, // Resets the form
            }) => (
                <form onSubmit={handleSubmit}> {/* Form wrapper */}
                    <Box
                        display="grid" // Use grid layout for form fields
                        gap="30px" // Add spacing between fields
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))" // Use 4-column grid layout
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }, // For smaller screens, each field spans 4 columns
                        }}
                    >
                        {/* Show these fields only if the page type is 'register' */}
                        {isRegister && (
                            <>
                                <TextField
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    error={Boolean(touched.firstName) && Boolean(errors.firstName)} // Show error if field is touched and invalid
                                    helperText={touched.firstName && errors.firstName} // Display validation message
                                    sx={{ gridColumn: "span 2" }} // Span 2 columns
                                />
                                <TextField
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="location"
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                helperText={touched.location && errors.location}
                                sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Occupation"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.occupation}
                                    name="occupation"
                                    error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                                helperText={touched.occupation && errors.occupation}
                                sx={{ gridColumn: "span 4" }}
                                />
                                {/* File upload section for picture */}
                                <Box
                                    gridColumn="span 4"
                                    border={`1px solid ${palette.neutral.medium}`} // Styled border for the dropzone
                                    borderRadius="5px" // Rounded corners
                                    p="1rem"
                                >
                                    <Dropzone
                                        acceptedFiles=".jpg,.jpeg,.png" // Accept only image files
                                        multiple={false} // Only allow single file upload
                                        onDrop={(acceptedFiles) =>
                                            setFieldValue("picture", acceptedFiles[0]) // Set the picture value in formik
                                        }
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <Box
                                                {...getRootProps()} // Bind the root props to the drop area
                                                border={`2px dashed ${palette.primary.main}`} // Styled dashed border
                                                p="1rem"
                                                sx={{ "&:hover": { cursor: "pointer" } }} // Show pointer cursor on hover
                                            >
                                                <input {...getInputProps()} /> {/* Bind input props to hidden input */}
                                                {!values.picture ? (
                                                    <p>Add Picture Here</p> // Show placeholder text if no picture is selected
                                                ) : (
                                                    <FlexBetween>
                                                        <Typography>{values.picture.name}</Typography> {/* Show the selected picture name */}
                                                        <EditOutlinedIcon /> {/* Edit icon next to the picture name */}
                                                    </FlexBetween>
                                                )}
                                            </Box>
                                        )}
                                    </Dropzone>
                                </Box>
                            </>
                        )}

                        {/* Fields for both login and register pages */}
                        <TextField
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        sx={{ gridColumn: "span 4" }}
                        />
                    </Box>

                    {/* Submit button and toggle link */}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "2rem 0", // Margin above and below
                                p: "1rem", // Padding inside the button
                                backgroundColor: palette.primary.main, // Primary button color
                                color: palette.background.alt, // Text color
                                "&:hover": { color: palette.primary.main }, // Hover effect
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"} {/* Change button text based on page type */}
                        </Button>
                        {/* Toggle between login and register pages */}
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login"); // Toggle page type
                                resetForm(); // Reset form fields
                            }}
                            sx={{
                                textDecoration: "underline", // Underline text
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer", // Show pointer cursor on hover
                                    color: palette.primary.light, // Change text color on hover
                                },
                            }}
                        >
                            {/* Toggle text based on page type */}
                            {isLogin
                                ? "Don't have an account? Sign Up here."
                                : "Already have an account? Login here."}
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;
