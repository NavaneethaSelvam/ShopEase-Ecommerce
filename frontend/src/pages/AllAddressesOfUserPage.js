
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Modal, Button, Spinner } from 'react-bootstrap'

import {
    deleteUserAddress,
    getAllAddress,
    checkTokenValidation,
    logout
} from '../actions/userActions'

import {
    DELETE_USER_ADDRESS_RESET,
    GET_SINGLE_ADDRESS_RESET
} from '../constants'

import { useHistory } from 'react-router-dom'

import CreateAddressComponent from '../components/CreateAddressComponent'

import './AllAddressesOfUserPage.css'


function AllAddressesOfUserPage() {

    const history = useHistory()
    const dispatch = useDispatch()

    const [deleteAddress, setDeleteAddress] = useState(null)
    const [show, setShow] = useState(false)


    // =========================================
    // MODAL
    // =========================================

    const handleClose = () => {
        setShow(false)
    }

    const handleShow = () => {
        setShow(true)
    }


    // =========================================
    // LOGIN
    // =========================================

    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const { userInfo } = userLoginReducer


    // =========================================
    // TOKEN VALIDATION
    // =========================================

    const checkTokenValidationReducer = useSelector(
        state => state.checkTokenValidationReducer
    )

    const {
        error: tokenError
    } = checkTokenValidationReducer


    // =========================================
    // GET ADDRESSES
    // =========================================

    const getAllAddressesOfUserReducer = useSelector(
        state => state.getAllAddressesOfUserReducer
    )

    const {
        addresses,
        loading: loadingAllAddresses
    } = getAllAddressesOfUserReducer


    // =========================================
    // DELETE REDUCER
    // =========================================

    const deleteUserAddressReducer = useSelector(
        state => state.deleteUserAddressReducer
    )

    const {
        success: addressDeletionSuccess
    } = deleteUserAddressReducer


    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        if (!userInfo) {

            history.push('/login')

        } else {

            dispatch(checkTokenValidation())

            dispatch(getAllAddress())

            dispatch({
                type: GET_SINGLE_ADDRESS_RESET
            })
        }

    }, [
        dispatch,
        history,
        userInfo,
        addressDeletionSuccess
    ])


    // =========================================
    // TOKEN EXPIRED
    // =========================================

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

    }, [
        userInfo,
        tokenError,
        dispatch,
        history
    ])


    // =========================================
    // DELETE SUCCESS
    // =========================================

    useEffect(() => {

        if (addressDeletionSuccess) {

            alert('Address successfully deleted.')

            dispatch({
                type: DELETE_USER_ADDRESS_RESET
            })

            dispatch(getAllAddress())
        }

    }, [
        addressDeletionSuccess,
        dispatch
    ])


    // =========================================
    // DELETE HANDLER
    // =========================================

    const deleteAddressHandler = (address) => {

        setDeleteAddress(address)

        handleShow()
    }


    // =========================================
    // CONFIRM DELETE
    // =========================================

    const confirmDelete = () => {

        if (deleteAddress) {

            dispatch(
                deleteUserAddress(deleteAddress.id)
            )
        }

        handleClose()
    }


    // =========================================
    // BACK
    // =========================================

    const goBack = () => {
        history.goBack()
    }


    // =========================================
    // RETURN
    // =========================================

    return (

        <div className="addresses-page">

            <div className="addresses-container">


                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="addresses-header">

                    <div className="header-content">

                        <span className="addresses-label">
                            CHECKOUT
                        </span>

                        <h1>
                            Billing Address
                        </h1>

                        <p>
                            Choose where you want your order delivered
                        </p>

                    </div>


                    <button
                        className="back-checkout-btn"
                        onClick={goBack}
                    >
                        ← Back
                    </button>

                </div>


                {/* =========================================
                    DELETE MODAL
                ========================================= */}

                <Modal
                    show={show}
                    onHide={handleClose}
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>
                            ⚠ Delete Address
                        </Modal.Title>

                    </Modal.Header>


                    <Modal.Body>

                        {deleteAddress && (

                            <>

                                <p className="delete-question">
                                    Are you sure you want to delete this
                                    address?
                                </p>


                                <div className="delete-address-preview">

                                    <strong>
                                        {deleteAddress.name}
                                    </strong>

                                    <br />

                                    {deleteAddress.house_no},
                                    {' '}
                                    {deleteAddress.city},
                                    {' '}
                                    {deleteAddress.state}

                                </div>

                            </>
                        )}

                    </Modal.Body>


                    <Modal.Footer>

                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                        >
                            Confirm Delete
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>

                    </Modal.Footer>

                </Modal>


                {/* =========================================
                    LOADING
                ========================================= */}

                {loadingAllAddresses && (

                    <div className="addresses-loading">

                        <Spinner animation="border" />

                        <span>
                            Getting your saved addresses...
                        </span>

                    </div>

                )}


                {/* =========================================
                    SAVED ADDRESSES
                ========================================= */}

                {!loadingAllAddresses && (

                    <section className="saved-address-section">


                        {/* SECTION HEADER */}

                        <div className="section-title">

                            <div>

                                <span>
                                    SAVED ADDRESSES
                                </span>

                                <h2>
                                    Your Addresses
                                </h2>

                            </div>


                            <div className="address-count">

                                <strong>
                                    {addresses
                                        ? addresses.length
                                        : 0}
                                </strong>

                                <span>
                                    Saved
                                </span>

                            </div>

                        </div>


                        {/* =====================================
                            NO ADDRESS
                        ===================================== */}

                        {(!addresses ||
                            addresses.length === 0) && (

                            <div className="no-address-card">

                                <div className="no-address-icon">
                                    📍
                                </div>

                                <h3>
                                    No saved addresses
                                </h3>

                                <p>
                                    Add a billing address below to continue
                                    with your order.
                                </p>

                            </div>

                        )}


                        {/* =====================================
                            ADDRESS LIST
                        ===================================== */}

                        {addresses &&
                            addresses.length > 0 &&
                            addresses.map(
                                (address, idx) => (

                                    <Card
                                        key={
                                            address.id || idx
                                        }
                                        className="address-item-card"
                                    >


                                        {/* ADDRESS CONTENT */}

                                        <div className="address-card-top">


                                            {/* LOCATION ICON */}

                                            <div className="address-icon">

                                                <span>
                                                    📍
                                                </span>

                                            </div>


                                            {/* MAIN DETAILS */}

                                            <div className="address-main">


                                                {/* NAME */}

                                                <div className="address-name-row">

                                                    <h3>
                                                        {address.name}
                                                    </h3>

                                                    <span className="saved-badge">
                                                        SAVED
                                                    </span>

                                                </div>


                                                {/* PHONE */}

                                                <p className="address-phone">

                                                    <span className="phone-icon">
                                                        📞
                                                    </span>

                                                    +91{' '}
                                                    {address.phone_number}

                                                </p>


                                                {/* ADDRESS */}

                                                <div className="address-text">

                                                    <span className="address-line-icon">
                                                        🏠
                                                    </span>

                                                    <span>

                                                        {address.house_no}

                                                        {address.landmark &&
                                                            `, near ${address.landmark}`}

                                                        {address.city &&
                                                            `, ${address.city}`}

                                                        {address.state &&
                                                            `, ${address.state}`}

                                                        {address.pin_code &&
                                                            ` - ${address.pin_code}`}

                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================
                                            ACTION BUTTONS
                                        ================================= */}

                                        <div className="address-actions">


                                            <button
                                                className="edit-address-action"
                                                onClick={() =>
                                                    history.push(
                                                        `/all-addresses/${address.id}/`
                                                    )
                                                }
                                            >

                                                <span>
                                                    ✏️
                                                </span>

                                                Edit Address

                                            </button>


                                            <button
                                                className="delete-address-action"
                                                onClick={() =>
                                                    deleteAddressHandler(
                                                        address
                                                    )
                                                }
                                            >

                                                <span>
                                                    🗑️
                                                </span>

                                                Delete

                                            </button>

                                        </div>

                                    </Card>

                                )
                            )}

                    </section>

                )}


                {/* =========================================
                    NEW ADDRESS
                ========================================= */}

                <section className="new-address-section">


                    {/* DECORATIVE CIRCLES */}

                    <div className="new-address-glow glow-one"></div>
                    <div className="new-address-glow glow-two"></div>


                    {/* HEADER */}

                    <div className="new-address-header">

                        <div className="new-address-icon">
                            +
                        </div>


                        <div>

                            <span>
                                NEW ADDRESS
                            </span>

                            <h2>
                                Add Billing Address
                            </h2>

                            <p>
                                Add another delivery address for your order
                            </p>

                        </div>

                    </div>


                    {/* CREATE ADDRESS FORM */}

                    <div className="create-address-wrapper">

                        <CreateAddressComponent />

                    </div>

                </section>


            </div>

        </div>
    )
}


export default AllAddressesOfUserPage

