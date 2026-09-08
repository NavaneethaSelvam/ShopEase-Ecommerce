
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { login } from '../actions/userActions'
import Message from '../components/Message'

import '../styles/LoginPage.css'

function LoginPage({ history }) {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch()

    // =========================================
    // REDUX
    // =========================================

    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const {
        error,
        userInfo,
        loading
    } = userLoginReducer


    // =========================================
    // REDIRECT AFTER LOGIN
    // =========================================

    useEffect(() => {

        if (userInfo) {
            history.push('/')
        }

    }, [history, userInfo])


    // =========================================
    // LOGIN HANDLER
    // =========================================

    const submitHandler = (e) => {

        e.preventDefault()

        dispatch(
            login(
                username,
                password
            )
        )
    }


    return (

        <div className="login-page">

            <div className="login-card">

                {/* =================================
                    LEFT BRAND SECTION
                ================================= */}

                <div className="login-brand">

                    <div className="login-brand-content">

                        <div className="login-logo">
                            🛍️
                        </div>

                        <h1>
                            Shop<span>Ease</span>
                        </h1>

                        <p className="login-tagline">
                            Shop smarter. Live better.
                        </p>


                        <div className="login-welcome">

                            <h2>
                                Welcome Back! 👋
                            </h2>

                            <p>
                                Sign in to discover amazing products
                                and continue your shopping journey.
                            </p>

                        </div>


                        <div className="login-benefits">

                            <div className="login-benefit">
                                <span>✓</span>
                                <p>Discover amazing products</p>
                            </div>

                            <div className="login-benefit">
                                <span>✓</span>
                                <p>Fast & secure checkout</p>
                            </div>

                            <div className="login-benefit">
                                <span>✓</span>
                                <p>Track your orders easily</p>
                            </div>

                        </div>

                    </div>

                    <div className="login-decoration decoration-one"></div>
                    <div className="login-decoration decoration-two"></div>

                </div>


                {/* =================================
                    RIGHT FORM SECTION
                ================================= */}

                <div className="login-form-section">

                    <div className="login-form-wrapper">


                        {/* HEADING */}

                        <div className="login-heading">

                            <span className="login-small-title">
                                ACCOUNT LOGIN
                            </span>

                            <h2>
                                Sign In
                            </h2>

                            <p>
                                Welcome back! Please enter your
                                details to continue.
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="login-error">

                                <Message variant="danger">
                                    {error}
                                </Message>

                            </div>

                        )}


                        {/* FORM */}

                        <Form onSubmit={submitHandler}>


                            {/* USERNAME */}

                            <Form.Group
                                controlId="username"
                                className="login-form-group"
                            >

                                <Form.Label>
                                    Username
                                </Form.Label>

                                <div className="login-input">

                                    <span className="input-icon">
                                        👤
                                    </span>

                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                            </Form.Group>


                            {/* PASSWORD */}

                            <Form.Group
                                controlId="password"
                                className="login-form-group"
                            >

                                <div className="password-label-row">

                                    <Form.Label>
                                        Password
                                    </Form.Label>

                                </div>

                                <div className="login-input">

                                    <span className="input-icon">
                                        🔒
                                    </span>

                                    <Form.Control
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>

                                </div>

                            </Form.Group>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="login-submit-btn"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="login-spinner"></span>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <span className="login-arrow">
                                            →
                                        </span>
                                    </>
                                )}

                            </button>

                        </Form>


                        {/* REGISTER */}

                        <div className="login-register">

                            <span>
                                New to ShopEase?
                            </span>

                            <Link to="/register">
                                Create an account
                            </Link>

                        </div>


                        {/* SECURITY */}

                        <div className="login-security">

                            <span>🔒</span>

                            <p>
                                Your login information is securely protected.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default LoginPage

