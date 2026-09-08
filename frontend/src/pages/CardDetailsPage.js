import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { savedCardsList } from '../actions/cardActions'
import { checkTokenValidation, logout } from '../actions/userActions'
import { Link, useHistory } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

import Message from '../components/Message'
import DeleteCardComponent from '../components/DeleteCardComponent'

import './CardDetailsPage.css'

const CardDetailsPage = () => {

    const history = useHistory()
    const dispatch = useDispatch()

    const [userId, setUserId] = useState(0)
    const [runCardDeleteHandler, setRunCardDeleteHandler] = useState(false)
    const [deleteCardNumber, setDeleteCardNumber] = useState("")

    // Login reducer
    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const { userInfo } = userLoginReducer

    // Token validation reducer
    const checkTokenValidationReducer = useSelector(
        state => state.checkTokenValidationReducer
    )

    const { error: tokenError } = checkTokenValidationReducer

    // Saved cards reducer
    const savedCardsListReducer = useSelector(
        state => state.savedCardsListReducer
    )

    const {
        stripeCards = [],
        loading
    } = savedCardsListReducer

    // Delete card reducer
    const deleteSavedCardReducer = useSelector(
        state => state.deleteSavedCardReducer
    )

    const { success } = deleteSavedCardReducer

    // Toggle delete modal
    const toggleRunCardDeleteHandler = () => {
        setRunCardDeleteHandler(!runCardDeleteHandler)
    }

    useEffect(() => {

        if (!userInfo) {
            history.push('/login')
        } else {
            dispatch(checkTokenValidation())
            dispatch(savedCardsList())
        }

    }, [dispatch, history, userInfo])

    // Session expired
    useEffect(() => {

        if (
            userInfo &&
            tokenError === 'Request failed with status code 401'
        ) {
            alert('Session expired, please login again.')
            dispatch(logout())
            history.push('/login')
            window.location.reload()
        }

    }, [userInfo, tokenError, dispatch, history])

    // Card deleted
    useEffect(() => {

        if (success) {
            alert('Card successfully deleted.')
            window.location.reload()
        }

    }, [success])

    return (
        <div className="card-details-page">

            <div className="card-details-container">

                {/* Page Header */}
                <div className="card-page-header">
                    <div>
                        <h2>My Card</h2>
                        <p>Manage your saved payment card details</p>
                    </div>

                    <Link
                        to="/stripe-card-update/"
                        className="add-card-btn"
                    >
                        + Add / Update Card
                    </Link>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="card-loading">
                        <Spinner animation="border" />
                        <span>Getting card information...</span>
                    </div>
                )}

                {/* Delete Modal */}
                <DeleteCardComponent
                    userId={userId}
                    deleteCardNumber={deleteCardNumber}
                    runCardDeleteHandler={runCardDeleteHandler}
                    toggleRunCardDeleteHandler={
                        toggleRunCardDeleteHandler
                    }
                />

                {/* Cards */}
                {!loading && stripeCards.length > 0 ? (

                    <div className="saved-cards-list">

                        {stripeCards.map((each, idx) => (

                            <div
                                className="saved-card"
                                key={idx}
                            >

                                {/* Card Header */}
                                <div className="saved-card-header">
                                    <div>
                                        <h4>
                                            {each.name_on_card
                                                ? each.name_on_card
                                                : 'Card Holder'}
                                        </h4>

                                        <span>
                                            Saved Payment Card
                                        </span>
                                    </div>

                                    <div className="card-icon">
                                        💳
                                    </div>
                                </div>

                                {/* Card Number */}
                                <div className="card-number">
                                    **** **** **** {
                                        each.card_number
                                            ? each.card_number.slice(-4)
                                            : '****'
                                    }
                                </div>

                                {/* Card Details */}
                                <div className="card-info-grid">

                                    <div className="card-info-item">
                                        <span>Expiry Month</span>
                                        <strong>
                                            {each.exp_month || 'Not Set'}
                                        </strong>
                                    </div>

                                    <div className="card-info-item">
                                        <span>Expiry Year</span>
                                        <strong>
                                            {each.exp_year || 'Not Set'}
                                        </strong>
                                    </div>

                                    <div className="card-info-item">
                                        <span>City</span>
                                        <strong>
                                            {each.address_city || 'Not Set'}
                                        </strong>
                                    </div>

                                    <div className="card-info-item">
                                        <span>State</span>
                                        <strong>
                                            {each.address_state || 'Not Set'}
                                        </strong>
                                    </div>

                                    <div className="card-info-item">
                                        <span>Country</span>
                                        <strong>
                                            {each.address_country || 'Not Set'}
                                        </strong>
                                    </div>

                                    <div className="card-info-item">
                                        <span>ZIP Code</span>
                                        <strong>
                                            {each.address_zip || 'Not Set'}
                                        </strong>
                                    </div>

                                </div>

                                {/* Actions */}
                                <div className="card-actions">

                                    <Link
                                        to="/stripe-card-update/"
                                        className="update-card-btn"
                                    >
                                        Update Card
                                    </Link>

                                    <button
                                        type="button"
                                        className="delete-card-btn"
                                        onClick={() => {
                                            setDeleteCardNumber(
                                                each.card_number
                                            )
                                            setUserId(each.user)
                                            setRunCardDeleteHandler(
                                                !runCardDeleteHandler
                                            )
                                        }}
                                    >
                                        Delete Card
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : !loading ? (

                    <div className="no-card-message">
                        <Message variant="info">
                            Card details not available.
                        </Message>

                        <Link
                            to="/stripe-card-update/"
                            className="add-first-card-btn"
                        >
                            Add Your Card
                        </Link>
                    </div>

                ) : null}

            </div>

        </div>
    )
}

export default CardDetailsPage