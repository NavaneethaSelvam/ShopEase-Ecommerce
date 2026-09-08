import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Spinner } from 'react-bootstrap'

import { register } from '../actions/userActions'
import Message from '../components/Message'

import './RegisterPage.css'


function RegisterPage({ history }) {

    // =========================================
    // LOCAL STATE
    // =========================================

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [message, setMessage] = useState("")

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false)


    // =========================================
    // REDUX
    // =========================================

    const dispatch = useDispatch()

    const userRegisterReducer = useSelector(
        state => state.userRegisterReducer
    )

    const {
        loading,
        error,
        userInfo
    } = userRegisterReducer


    // =========================================
    // REDIRECT AFTER REGISTER
    // =========================================

    useEffect(() => {

        if (userInfo) {

            history.push('/')

        }

    }, [history, userInfo])


    // =========================================
    // SUBMIT
    // =========================================

    const submitHandler = (e) => {

        e.preventDefault()

        setMessage("")


        if (password !== confirmPassword) {

            setMessage(
                'Passwords do not match!'
            )

            return

        }


        dispatch(
            register(
                username,
                email,
                password
            )
        )

    }


    // =========================================
    // UI
    // =========================================

    return (

        <div className="register-page">


            {/* BACKGROUND DECORATION */}

            <div className="register-shape shape-one"></div>

            <div className="register-shape shape-two"></div>


            <div className="register-container">


                {/* =============================
                    LEFT SIDE
                ============================= */}

                <div className="register-banner">


                    <div className="register-logo">

                        🛍️

                    </div>


                    <span className="register-tag">

                        WELCOME TO OUR STORE

                    </span>


                    <h1>

                        Start your shopping
                        journey today.

                    </h1>


                    <p>

                        Create an account and explore
                        amazing products, offers and
                        a seamless shopping experience.

                    </p>


                    <div className="register-features">


                        <div>

                            <span>✓</span>

                            <p>
                                Secure account
                            </p>

                        </div>


                        <div>

                            <span>✓</span>

                            <p>
                                Easy checkout
                            </p>

                        </div>


                        <div>

                            <span>✓</span>

                            <p>
                                Exclusive offers
                            </p>

                        </div>


                    </div>


                </div>



                {/* =============================
                    RIGHT SIDE - FORM
                ============================= */}

                <div className="register-form-section">


                    <div className="register-heading">


                        <span className="register-small-title">

                            CREATE ACCOUNT

                        </span>


                        <h2>

                            Sign Up

                        </h2>


                        <p>

                            Join us and start shopping today.

                        </p>


                    </div>



                    {/* =============================
                        ERROR
                    ============================= */}

                    {message && (

                        <div className="register-error">

                            {message}

                        </div>

                    )}


                    {error && (

                        <div className="register-message">

                            <Message variant="danger">

                                {error}

                            </Message>

                        </div>

                    )}



                    {/* =============================
                        FORM
                    ============================= */}

                    <Form
                        onSubmit={submitHandler}
                        className="register-form"
                    >


                        {/* USERNAME */}

                        <Form.Group
                            controlId="name"
                            className="register-form-group"
                        >

                            <Form.Label>

                                Username

                            </Form.Label>


                            <div className="register-input-wrapper">

                                <span className="register-input-icon">

                                    👤

                                </span>


                                <Form.Control

                                    required

                                    type="text"

                                    placeholder="Enter your username"

                                    value={username}

                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }

                                />

                            </div>

                        </Form.Group>



                        {/* EMAIL */}

                        <Form.Group
                            controlId="email"
                            className="register-form-group"
                        >

                            <Form.Label>

                                Email Address

                            </Form.Label>


                            <div className="register-input-wrapper">

                                <span className="register-input-icon">

                                    ✉️

                                </span>


                                <Form.Control

                                    required

                                    type="email"

                                    placeholder="Enter your email"

                                    value={email}

                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }

                                />

                            </div>

                        </Form.Group>



                        {/* PASSWORD */}

                        <Form.Group
                            controlId="password"
                            className="register-form-group"
                        >

                            <Form.Label>

                                Password

                            </Form.Label>


                            <div className="register-input-wrapper">

                                <span className="register-input-icon">

                                    🔒

                                </span>


                                <Form.Control

                                    required

                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }

                                    placeholder="Create a password"

                                    value={password}

                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }

                                />


                                <button

                                    type="button"

                                    className="register-password-toggle"

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



                        {/* CONFIRM PASSWORD */}

                        <Form.Group
                            controlId="passwordConfirm"
                            className="register-form-group"
                        >

                            <Form.Label>

                                Confirm Password

                            </Form.Label>


                            <div className="register-input-wrapper">

                                <span className="register-input-icon">

                                    🔐

                                </span>


                                <Form.Control

                                    required

                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }

                                    placeholder="Confirm your password"

                                    value={confirmPassword}

                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }

                                />


                                <button

                                    type="button"

                                    className="register-password-toggle"

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



                        {/* SUBMIT */}

                        <button

                            type="submit"

                            className="register-submit-btn"

                            disabled={loading}

                        >

                            {

                                loading

                                    ? (

                                        <>

                                            <Spinner
                                                animation="border"
                                                size="sm"
                                            />

                                            <span>
                                                Creating Account...
                                            </span>

                                        </>

                                    )

                                    : (

                                        <>

                                            <span>
                                                Create Account
                                            </span>

                                            <span>
                                                →
                                            </span>

                                        </>

                                    )

                            }

                        </button>


                    </Form>



                    {/* LOGIN */}

                    <div className="register-login">

                        <span>

                            Already have an account?

                        </span>


                        <Link to="/login">

                            Login here

                        </Link>

                    </div>


                </div>


            </div>


        </div>

    )
}


export default RegisterPage