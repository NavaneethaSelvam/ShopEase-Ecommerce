import React, { useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
    logout,
    userAccountDelete,
    checkTokenValidation
} from '../actions/userActions'
import Message from '../components/Message'
import { useHistory } from 'react-router-dom'
import { DELETE_USER_ACCOUNT_RESET } from '../constants'

import './DeleteUserAccount.css'


function DeleteUserAccount() {

    const history = useHistory()
    const dispatch = useDispatch()

    const [myPassword, setMyPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)


    // =========================================
    // LOGIN REDUCER
    // =========================================

    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const { userInfo } = userLoginReducer


    // =========================================
    // DELETE USER ACCOUNT REDUCER
    // =========================================

    const deleteUserAccountReducer = useSelector(
        state => state.deleteUserAccountReducer
    )

    const {
        success,
        loading,
        error
    } = deleteUserAccountReducer


    // =========================================
    // SUBMIT
    // =========================================

    const onSubmit = (e) => {

        e.preventDefault()

        const userData = {
            id: userInfo.id,
            password: myPassword
        }

        dispatch(checkTokenValidation())

        dispatch(userAccountDelete(userData))
    }


    // =========================================
    // SUCCESS
    // =========================================

    if (success) {

        alert("Account successfully deleted.")

        dispatch({
            type: DELETE_USER_ACCOUNT_RESET
        })

        dispatch(logout())

        history.push("/login")

        window.location.reload()
    }


    // =========================================
    // UI
    // =========================================

    return (

        <div className="delete-account-page">

            <div className="delete-bg-circle circle-one"></div>
            <div className="delete-bg-circle circle-two"></div>
            <div className="delete-bg-circle circle-three"></div>


            <div className="delete-account-container">


                {/* BACK BUTTON */}

                <button
                    className="delete-back-btn"
                    onClick={() => history.push("/account")}
                >

                    <span>←</span>

                    Back to Profile

                </button>


                {/* MAIN CARD */}

                <div className="delete-account-card">


                    {/* ICON */}

                    <div className="delete-icon-wrapper">

                        <div className="delete-icon">

                            ⚠️

                        </div>

                    </div>


                    {/* HEADER */}

                    <div className="delete-header">

                        <div className="delete-badge">

                            ACCOUNT SECURITY

                        </div>


                        <h1>

                            Delete Your Account

                        </h1>


                        <p>

                            We're sorry to see you go.
                            Please confirm your password
                            to continue.

                        </p>

                    </div>


                    {/* WARNING */}

                    <div className="delete-warning-box">

                        <div className="warning-icon">

                            !

                        </div>


                        <div>

                            <h4>

                                Permanent action

                            </h4>


                            <p>

                                Deleting your account will permanently
                                remove your profile and account data.
                                This action cannot be undone.

                            </p>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="delete-error">

                            <Message variant="danger">

                                <strong>
                                    Incorrect Password!
                                </strong>

                                <br />

                                Please enter your correct account password.

                            </Message>

                        </div>

                    )}


                    {/* FORM */}

                    <Form
                        onSubmit={onSubmit}
                        className="delete-form"
                    >


                        <Form.Group
                            controlId="password"
                            className="delete-form-group"
                        >

                            <Form.Label>

                                Confirm your password

                            </Form.Label>


                            <div className="delete-input-wrapper">


                                <span className="password-icon">

                                    🔒

                                </span>


                                <Form.Control

                                    required

                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }

                                    placeholder="Enter your password"

                                    value={myPassword}

                                    onChange={(e) =>
                                        setMyPassword(
                                            e.target.value
                                        )
                                    }

                                />


                                <button

                                    type="button"

                                    className="password-show-btn"

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


                        {/* SECURITY MESSAGE */}

                        <div className="security-message">

                            <span className="security-icon">

                                🛡️

                            </span>


                            <div>

                                <strong>

                                    Your account is protected

                                </strong>


                                <p>

                                    We need your password to verify
                                    your identity before deleting
                                    the account.

                                </p>

                            </div>

                        </div>


                        {/* BUTTONS */}

                        <div className="delete-buttons">


                            <button

                                type="button"

                                className="cancel-delete-btn"

                                onClick={() =>
                                    history.push("/account")
                                }

                            >

                                Cancel

                            </button>


                            <button

                                type="submit"

                                className="confirm-delete-btn"

                                disabled={loading}

                            >

                                {loading ? (

                                    <>

                                        <Spinner
                                            animation="border"
                                            size="sm"
                                        />

                                        <span>
                                            Deleting...
                                        </span>

                                    </>

                                ) : (

                                    <>

                                        <span>
                                            🗑️
                                        </span>

                                        <span>
                                            Confirm Delete
                                        </span>

                                    </>

                                )}

                            </button>

                        </div>


                    </Form>


                    {/* FOOTER */}

                    <div className="delete-footer">

                        <span>⚠️</span>

                        <span>

                            Once your account is deleted,
                            it cannot be recovered.

                        </span>

                    </div>


                </div>

            </div>

        </div>
    )
}


export default DeleteUserAccount