
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
    Row,
    Col,
    Container,
    Image,
    Card
} from 'react-bootstrap'

import { useDispatch, useSelector } from 'react-redux'

import { getProductDetails } from '../actions/productActions'

import CreateCardComponent from '../components/CreateCardComponent'
import ChargeCardComponent from '../components/ChargeCardComponent'
import Message from '../components/Message'
import UserAddressComponent from '../components/UserAddressComponent'

import { Spinner } from 'react-bootstrap'

import { savedCardsList } from '../actions/cardActions'

import {
    checkTokenValidation,
    logout
} from '../actions/userActions'

import {
    CHARGE_CARD_RESET
} from '../constants/index'

import './CheckoutPage.css'


const CheckoutPage = ({ match }) => {

    const history = useHistory()
    const dispatch = useDispatch()


    // =========================================
    // ADDRESS STATE
    // =========================================

    const [addressSelected, setAddressSelected] = useState(false)

    const [selectedAddressId, setSelectedAddressId] = useState(0)


    // =========================================
    // LOAD SAVED ADDRESS FROM LOCAL STORAGE
    // =========================================

    useEffect(() => {

        const savedAddressId =
            localStorage.getItem(
                'selectedAddressId'
            )

        if (savedAddressId) {

            setSelectedAddressId(
                Number(savedAddressId)
            )

            setAddressSelected(true)
        }

    }, [])


    // =========================================
    // ADDRESS SELECT HANDLER
    // =========================================

    const handleAddressId = (id) => {

        if (id) {

            setAddressSelected(true)

            setSelectedAddressId(
                Number(id)
            )

            // Save selected address
            localStorage.setItem(
                'selectedAddressId',
                id
            )

        } else {

            setAddressSelected(false)

            setSelectedAddressId(0)

            localStorage.removeItem(
                'selectedAddressId'
            )
        }
    }


    // =========================================
    // TOKEN VALIDATION
    // =========================================

    const checkTokenValidationReducer =
        useSelector(
            state =>
                state.checkTokenValidationReducer
        )

    const {
        error: tokenError
    } = checkTokenValidationReducer


    // =========================================
    // PRODUCT DETAILS
    // =========================================

    const productDetailsReducer =
        useSelector(
            state =>
                state.productDetailsReducer
        )

    const {
        loading,
        error,
        product
    } = productDetailsReducer


    // =========================================
    // CREATE CARD
    // =========================================

    const createCardReducer =
        useSelector(
            state =>
                state.createCardReducer
        )

    const {
        error: cardCreationError,
        success,
        loading: cardCreationLoading
    } = createCardReducer


    // =========================================
    // LOGIN
    // =========================================

    const userLoginReducer =
        useSelector(
            state =>
                state.userLoginReducer
        )

    const {
        userInfo
    } = userLoginReducer


    // =========================================
    // SAVED CARDS
    // =========================================

    const savedCardsListReducer =
        useSelector(
            state =>
                state.savedCardsListReducer
        )

    const {
        stripeCards = []
    } = savedCardsListReducer


    // =========================================
    // LOAD CHECKOUT
    // =========================================

    useEffect(() => {

        if (!userInfo) {

            history.push('/login')

            return
        }


        dispatch(
            checkTokenValidation()
        )


        dispatch(
            getProductDetails(
                match.params.id
            )
        )


        dispatch(
            savedCardsList()
        )


        dispatch({
            type: CHARGE_CARD_RESET
        })

    }, [
        dispatch,
        match.params.id,
        history,
        userInfo
    ])


    // =========================================
    // TOKEN EXPIRED
    // =========================================

    if (
        userInfo &&
        tokenError ===
        'Request failed with status code 401'
    ) {

        alert(
            'Session expired, please login again.'
        )

        dispatch(logout())

        localStorage.removeItem(
            'selectedAddressId'
        )

        history.push('/login')

        window.location.reload()
    }


    // =========================================
    // PRODUCT IMAGE
    // =========================================

    const getProductImage = () => {

        if (
            !product ||
            !product.image
        ) {

            return ''
        }


        const image =
            String(product.image)


        if (
            image.startsWith('http')
        ) {

            return image
        }


        return (
            'http://127.0.0.1:8000/images/' +
            image
                .replace(
                    '/images/',
                    ''
                )
                .replace(
                    'images/',
                    ''
                )
        )
    }


    // =========================================
    // RETURN
    // =========================================

    return (

        <div className="checkout-page">

            <Container
                className="checkout-container"
            >


                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="checkout-header">

                    <button
                        className="checkout-back-btn"
                        onClick={() =>
                            history.goBack()
                        }
                    >
                        ← Back
                    </button>


                    <div className="checkout-heading">

                        <span className="checkout-label">
                            SECURE CHECKOUT
                        </span>


                        <h1>
                            Complete Your Order
                        </h1>


                        <p>
                            Review your product, address
                            and payment details before
                            completing your purchase.
                        </p>

                    </div>

                </div>


                {/* =========================================
                    CARD ERROR
                ========================================= */}

                {cardCreationError && (

                    <div className="checkout-message">

                        <Message variant="danger">

                            {cardCreationError}

                        </Message>

                    </div>

                )}


                {/* =========================================
                    PRODUCT ERROR
                ========================================= */}

                {error && (

                    <div className="checkout-message">

                        <Message variant="danger">

                            {error}

                        </Message>

                    </div>

                )}


                {/* =========================================
                    LOADING
                ========================================= */}

                {loading && (

                    <div className="checkout-loading">

                        <Spinner
                            animation="border"
                        />

                        <span>
                            Getting Checkout Information...
                        </span>

                    </div>

                )}


                {!loading &&
                cardCreationLoading && (

                    <div className="checkout-loading">

                        <Spinner
                            animation="border"
                        />

                        <span>
                            Checking your card...
                        </span>

                    </div>

                )}


                {/* =========================================
                    MAIN CHECKOUT
                ========================================= */}

                {!loading &&
                !error &&
                product && (

                    <Row
                        className="checkout-row"
                    >


                        {/* =====================================
                            LEFT SIDE
                        ===================================== */}

                        <Col
                            lg={7}
                            md={12}
                        >


                            {/* =================================
                                PRODUCT SUMMARY
                            ================================= */}

                            <Card
                                className="checkout-card"
                            >

                                <Card.Body>

                                    <div className="section-heading">

                                        <div className="section-icon">
                                            🛍️
                                        </div>


                                        <div>

                                            <h2>
                                                Checkout Summary
                                            </h2>


                                            <p>
                                                Your selected product
                                            </p>

                                        </div>

                                    </div>


                                    <div className="product-summary">


                                        {/* PRODUCT IMAGE */}

                                        <div className="checkout-product-image-box">

                                            {getProductImage() ? (

                                                <Image
                                                    src={
                                                        getProductImage()
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    className="checkout-product-image"
                                                />

                                            ) : (

                                                <div className="checkout-image-fallback">
                                                    🛍️
                                                </div>

                                            )}

                                        </div>


                                        {/* PRODUCT INFO */}

                                        <div className="checkout-product-info">

                                            <span className="product-small-label">
                                                PRODUCT
                                            </span>


                                            <h3>
                                                {product.name}
                                            </h3>


                                            <p>
                                                {product.description}
                                            </p>


                                            <div className="checkout-product-bottom">

                                                <span className="checkout-price">

                                                    ₹ {product.price}

                                                </span>


                                                {product.stock ? (

                                                    <span className="checkout-stock">

                                                        ✓ In Stock

                                                    </span>

                                                ) : (

                                                    <span className="checkout-out-stock">

                                                        ✕ Out Of Stock

                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </Card.Body>

                            </Card>


                            {/* =================================
                                BILLING ADDRESS
                            ================================= */}

                            <Card
                                className="checkout-card address-card"
                            >

                                <Card.Body>

                                    <div className="section-heading">


                                        <div className="section-icon">
                                            📍
                                        </div>


                                        <div className="address-heading-content">

                                            <h2>
                                                Billing Address
                                            </h2>


                                            <p>
                                                Select an existing address
                                                or add a new one
                                            </p>

                                        </div>


                                        <Link
                                            to="/all-addresses/"
                                            className="edit-address-btn"
                                        >
                                            ✏ Edit / Add
                                        </Link>

                                    </div>


                                    {/* =================================
                                        SELECTED ADDRESS STATUS
                                    ================================= */}

                                    {addressSelected && (

                                        <div
                                            className="alert alert-success mt-3"
                                        >

                                            ✓ Address selected successfully

                                        </div>

                                    )}


                                    {!addressSelected && (

                                        <div
                                            className="alert alert-warning mt-3"
                                        >

                                            ⚠ Please select an address
                                            before payment

                                        </div>

                                    )}


                                    {/* ADDRESS COMPONENT */}

                                    <div className="address-component-wrapper">

                                        <UserAddressComponent
                                            handleAddressId={
                                                handleAddressId
                                            }
                                        />

                                    </div>

                                </Card.Body>

                            </Card>

                        </Col>


                        {/* =====================================
                            RIGHT SIDE
                        ===================================== */}

                        <Col
                            lg={5}
                            md={12}
                        >


                            <Card
                                className="checkout-card payment-card"
                            >

                                <Card.Body>


                                    {/* PAYMENT HEADER */}

                                    <div className="section-heading">

                                        <div className="section-icon payment-icon">
                                            💳
                                        </div>


                                        <div>

                                            <h2>
                                                Payment
                                            </h2>


                                            <p>
                                                Secure payment processing
                                            </p>

                                        </div>

                                    </div>


                                    {/* =================================
                                        ORDER TOTAL
                                    ================================= */}

                                    <div className="order-total-box">

                                        <div className="total-row">

                                            <span>
                                                Product
                                            </span>


                                            <strong>
                                                {product.name}
                                            </strong>

                                        </div>


                                        <div className="total-divider"></div>


                                        <div className="total-row final-total">

                                            <span>
                                                Total
                                            </span>


                                            <strong>
                                                ₹ {product.price}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* =================================
                                        PAYMENT COMPONENT
                                    ================================= */}

                                    <div className="payment-component">

                                        {success ? (

                                            <ChargeCardComponent
                                                selectedAddressId={
                                                    selectedAddressId
                                                }
                                                addressSelected={
                                                    addressSelected
                                                }
                                                product={
                                                    product
                                                }
                                            />

                                        ) : (

                                            <CreateCardComponent
                                                addressSelected={
                                                    addressSelected
                                                }
                                                stripeCards={
                                                    stripeCards
                                                }
                                            />

                                        )}

                                    </div>


                                    {/* =================================
                                        SECURITY
                                    ================================= */}

                                    <div className="secure-payment">

                                        <div className="secure-icon">
                                            🔒
                                        </div>


                                        <div>

                                            <strong>
                                                Secure Payment
                                            </strong>


                                            <p>
                                                Your payment information
                                                is securely protected.
                                            </p>

                                        </div>

                                    </div>

                                </Card.Body>

                            </Card>

                        </Col>

                    </Row>

                )}

            </Container>

        </div>
    )
}


export default CheckoutPage

