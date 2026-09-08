import React, { useState, useEffect } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import './AccountUpdatePage.css'

import {
    userDetails,
    userUpdateDetails,
    checkTokenValidation,
    logout
} from '../actions/userActions'

import Message from '../components/Message'
import { UPDATE_USER_DETAILS_RESET } from '../constants'

import '../styles/Account.css'


function AccountUpdatePage() {

    const history = useHistory()
    const dispatch = useDispatch()


    // =========================================
    // LOCAL STATE
    // =========================================

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [formError, setFormError] = useState("")


    // =========================================
    // REDUX - LOGIN
    // =========================================

    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const { userInfo } = userLoginReducer


    // =========================================
    // REDUX - USER DETAILS
    // =========================================

    const userDetailsReducer = useSelector(
        state => state.userDetailsReducer
    )

    const {
        user: userAccDetails,
        loading
    } = userDetailsReducer


    // =========================================
    // REDUX - UPDATE USER
    // =========================================

    const userDetailsUpdateReducer = useSelector(
        state => state.userDetailsUpdateReducer
    )

    const {
        success,
        loading: updateLoading,
        error: updateError
    } = userDetailsUpdateReducer


    // =========================================
    // REDUX - TOKEN VALIDATION
    // =========================================

    const checkTokenValidationReducer = useSelector(
        state => state.checkTokenValidationReducer
    )

    const {
        error: tokenError
    } = checkTokenValidationReducer


    // =========================================
    // GET USER DETAILS
    // =========================================

    useEffect(() => {

        if (!userInfo) {

            history.push("/login")

            return
        }

        dispatch(checkTokenValidation())

        dispatch(userDetails(userInfo.id))

    }, [dispatch, history, userInfo])


    // =========================================
    // SESSION EXPIRED
    // =========================================

    useEffect(() => {

        if (
            userInfo &&
            tokenError === "Request failed with status code 401"
        ) {

            alert("Session expired, please login again.")

            dispatch(logout())

            history.push("/login")
        }

    }, [
        tokenError,
        userInfo,
        dispatch,
        history
    ])


    // =========================================
    // UPDATE SUCCESS
    // =========================================

    useEffect(() => {

        if (success) {

            alert("Account successfully updated.")

            dispatch({
                type: UPDATE_USER_DETAILS_RESET
            })

            history.push("/account")
        }

    }, [
        success,
        dispatch,
        history
    ])


    // =========================================
    // SUBMIT FORM
    // =========================================

    const onSubmit = (e) => {

        e.preventDefault()

        setFormError("")


        // -------------------------------
        // USERNAME
        // -------------------------------

        const updatedUsername =
            username === ""
                ? userAccDetails.username
                : username


        // -------------------------------
        // EMAIL
        // -------------------------------

        const updatedEmail =
            email === ""
                ? userAccDetails.email
                : email


        // -------------------------------
        // PASSWORD VALIDATION
        // -------------------------------

        if (password || confirmPassword) {

            if (password !== confirmPassword) {

                setFormError(
                    "Passwords do not match."
                )

                return
            }
        }


        // -------------------------------
        // USER DATA
        // -------------------------------

        const userData = {

            username: updatedUsername,

            email: updatedEmail,

            password: password

        }


        // -------------------------------
        // DISPATCH UPDATE
        // -------------------------------

        dispatch(
            userUpdateDetails(userData)
        )
    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="account-page">

                <div className="account-loading">

                    <Spinner animation="border" />

                    <span>
                        Loading your profile...
                    </span>

                </div>

            </div>
        )
    }


    // =========================================
    // USER DETAILS NOT AVAILABLE
    // =========================================

    if (!userAccDetails) {

        return (

            <div className="account-page">

                <div className="account-loading">

                    <Spinner animation="border" />

                    <span>
                        Loading account details...
                    </span>

                </div>

            </div>
        )
    }


    // =========================================
    // UI
    // =========================================

    return (

        <div className="account-page">

            <div className="account-container">


                {/* =================================
                    BACK TO PROFILE
                ================================= */}

                <Link
                    to="/account"
                    className="account-back-link"
                >

                    ← Back to Profile

                </Link>



                {/* =================================
                    MAIN CARD
                ================================= */}

                <div className="account-card">


                    {/* =================================
                        HEADER
                    ================================= */}

                    <div className="account-header">


                        <div className="account-header-icon">

                            ✏️

                        </div>


                        <div>

                            <span className="account-small-title">

                                ACCOUNT SETTINGS

                            </span>


                            <h1>

                                Update Profile

                            </h1>


                            <p>

                                Update your personal information
                                and keep your account secure.

                            </p>

                        </div>

                    </div>



                    {/* =================================
                        FORM ERROR
                    ================================= */}

                    {formError && (

                        <div className="account-error">

                            {formError}

                        </div>

                    )}



                    {/* =================================
                        UPDATE ERROR
                    ================================= */}

                    {updateError && (

                        <div className="account-error">

                            <Message variant="danger">

                                {
                                    typeof updateError === "string"
                                        ? updateError
                                        : "Unable to update account."
                                }

                            </Message>

                        </div>

                    )}



                    {/* =================================
                        FORM
                    ================================= */}

                    <Form
                        onSubmit={onSubmit}
                        className="account-form"
                    >


                        {/* =================================
                            USERNAME
                        ================================= */}

                        <Form.Group
                            controlId="username"
                            className="account-form-group"
                        >

                            <Form.Label>

                                Username

                            </Form.Label>


                            <div className="account-input-wrapper">


                                <span>

                                    👤

                                </span>


                                <Form.Control

                                    type="text"

                                    placeholder={
                                        userAccDetails.username ||
                                        "Enter username"
                                    }

                                    defaultValue={
                                        userAccDetails.username
                                    }

                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }

                                />

                            </div>

                        </Form.Group>



                        {/* =================================
                            EMAIL
                        ================================= */}

                        <Form.Group
                            controlId="email"
                            className="account-form-group"
                        >

                            <Form.Label>

                                Email Address

                            </Form.Label>


                            <div className="account-input-wrapper">


                                <span>

                                    📧

                                </span>


                                <Form.Control

                                    type="email"

                                    placeholder={
                                        userAccDetails.email ||
                                        "Enter email address"
                                    }

                                    defaultValue={
                                        userAccDetails.email
                                    }

                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }

                                />

                            </div>

                        </Form.Group>



                        {/* =================================
                            PASSWORD SECTION
                        ================================= */}

                        <div className="account-password-section">


                            <div className="account-section-title">

                                <h3>

                                    Change Password

                                </h3>


                                <p>

                                    Leave these fields empty
                                    if you don't want to change
                                    your password.

                                </p>

                            </div>



                            {/* =================================
                                NEW PASSWORD
                            ================================= */}

                            <Form.Group
                                controlId="password"
                                className="account-form-group"
                            >

                                <Form.Label>

                                    New Password

                                </Form.Label>


                                <div className="account-input-wrapper">


                                    <span>

                                        🔒

                                    </span>


                                    <Form.Control

                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }

                                        placeholder="Enter new password"

                                        value={password}

                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }

                                    />


                                    <button

                                        type="button"

                                        className="account-password-toggle"

                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }

                                    >

                                        {
                                            showPassword
                                                ? "🙈"
                                                : "👁️"
                                        }

                                    </button>

                                </div>

                            </Form.Group>



                            {/* =================================
                                CONFIRM PASSWORD
                            ================================= */}

                            <Form.Group
                                controlId="confirmPassword"
                                className="account-form-group"
                            >

                                <Form.Label>

                                    Confirm New Password

                                </Form.Label>


                                <div className="account-input-wrapper">


                                    <span>

                                        🔐

                                    </span>


                                    <Form.Control

                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }

                                        placeholder="Confirm new password"

                                        value={confirmPassword}

                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }

                                    />


                                    <button

                                        type="button"

                                        className="account-password-toggle"

                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }

                                    >

                                        {
                                            showConfirmPassword
                                                ? "🙈"
                                                : "👁️"
                                        }

                                    </button>

                                </div>

                            </Form.Group>

                        </div>



                        {/* =================================
                            BUTTONS
                        ================================= */}

                        <div className="account-button-row">


                            {/* SAVE BUTTON */}

                            <button

                                type="submit"

                                className="account-save-btn"

                                disabled={updateLoading}

                            >

                                {

                                    updateLoading

                                        ? (

                                            <>

                                                <Spinner
                                                    animation="border"
                                                    size="sm"
                                                />

                                                <span>
                                                    Saving...
                                                </span>

                                            </>

                                        )

                                        : (

                                            <>

                                                <span>
                                                    Save Changes
                                                </span>

                                                <span>
                                                    ✓
                                                </span>

                                            </>

                                        )

                                }

                            </button>



                            {/* CANCEL BUTTON */}

                            <Link

                                to="/account"

                                className="account-cancel-btn"

                            >

                                Cancel

                            </Link>


                        </div>


                    </Form>


                </div>

            </div>

        </div>

    )
}


export default AccountUpdatePage