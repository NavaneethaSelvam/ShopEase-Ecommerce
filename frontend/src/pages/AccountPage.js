import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
userDetails,
logout,
checkTokenValidation
} from '../actions/userActions'
import Message from '../components/Message'
import { Spinner } from 'react-bootstrap'

import '../styles/Account.css'

function AccountPage() {


const history = useHistory()
const dispatch = useDispatch()


// TOKEN VALIDATION
const checkTokenValidationReducer = useSelector(
    state => state.checkTokenValidationReducer
)

const { error: tokenError } =
    checkTokenValidationReducer


// LOGIN DETAILS
const userLoginReducer = useSelector(
    state => state.userLoginReducer
)

const { userInfo } =
    userLoginReducer


// USER DETAILS
const userDetailsReducer = useSelector(
    state => state.userDetailsReducer
)

const {
    user: userAccDetails,
    loading
} = userDetailsReducer


// GET USER DETAILS
useEffect(() => {

    if (!userInfo) {

        history.push('/login')

    } else {

        dispatch(checkTokenValidation())

        dispatch(
            userDetails(userInfo.id)
        )

    }

}, [history, userInfo, dispatch])


// LOGOUT
const logoutHandler = () => {

    dispatch(logout())

    history.push('/login')

}


// TOKEN EXPIRED
if (
    userInfo &&
    tokenError ===
    'Request failed with status code 401'
) {

    alert(
        'Session expired, please login again.'
    )

    dispatch(logout())

    history.push('/login')

    window.location.reload()

}


// LOADING
if (loading) {

    return (

        <div className="account-loading">

            <Spinner animation="border" />

            <p>
                Getting your profile...
            </p>

        </div>

    )

}


return (

    <div className="account-page">


        <div className="account-container">


            {/* PROFILE HEADER */}

            <div className="account-header">


                <div className="account-avatar">

                    {userAccDetails?.username
                        ? userAccDetails.username
                            .charAt(0)
                            .toUpperCase()
                        : 'U'
                    }

                </div>


                <div className="account-header-info">

                    <span className="account-small-title">

                        MY ACCOUNT

                    </span>


                    <h1>

                        {userAccDetails?.username ||
                            'User'}

                    </h1>


                    <p>

                        Manage your profile and
                        account settings

                    </p>

                </div>

            </div>


            {/* ACCOUNT DETAILS */}

            <div className="account-details-card">


                <div className="account-section-heading">

                    <div>

                        <h2>

                            Profile Information

                        </h2>


                        <p>

                            Your personal account details

                        </p>

                    </div>


                    <span className="account-status">

                        ● Active

                    </span>

                </div>



                {/* USERNAME */}

                <div className="account-info-row">

                    <div className="account-info-icon">

                        👤

                    </div>


                    <div className="account-info-content">

                        <span>

                            Username

                        </span>


                        <strong>

                            {userAccDetails?.username ||
                                'Not available'}

                        </strong>

                    </div>

                </div>



                {/* EMAIL */}

                <div className="account-info-row">

                    <div className="account-info-icon">

                        ✉️

                    </div>


                    <div className="account-info-content">

                        <span>

                            Email Address

                        </span>


                        <strong>

                            {userAccDetails?.email ||
                                'Not available'}

                        </strong>

                    </div>

                </div>



                {/* ACCOUNT TYPE */}

                <div className="account-info-row">

                    <div className="account-info-icon">

                        🛡️

                    </div>


                    <div className="account-info-content">

                        <span>

                            Account Type

                        </span>


                        <strong>

                            {userAccDetails?.admin
                                ? 'Administrator'
                                : 'Customer'
                            }

                        </strong>

                    </div>

                </div>


            </div>



            {/* ACCOUNT ACTIONS */}

            <div className="account-actions">


                {/* UPDATE */}

                <Link
                    to="/account/update"
                    className="account-update-btn"
                >

                    <span>

                        ✏️

                    </span>

                    Update Account

                </Link>



                {/* DELETE */}

                <Link
                    to="/account/delete/"
                    className="account-delete-btn"
                >

                    <span>

                        🗑️

                    </span>

                    Delete Account

                </Link>


                {/* LOGOUT */}

                <button
                    onClick={logoutHandler}
                    className="account-logout-btn"
                >

                    <span>

                        ↪

                    </span>

                    Logout

                </button>


            </div>



            {/* SECURITY */}

            <div className="account-security">

                <span>

                    🔒

                </span>


                <p>

                    Your account information is securely protected.

                </p>

            </div>


        </div>


    </div>

)


}

export default AccountPage
