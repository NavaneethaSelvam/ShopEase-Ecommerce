
import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import {
    checkTokenValidation,
    getAllOrders,
    logout,
    changeDeliveryStatus
} from '../actions/userActions'

import { CHANGE_DELIVERY_STATUS_RESET } from '../constants'

import { useHistory } from 'react-router-dom'

import { Spinner } from 'react-bootstrap'

import { dateCheck } from '../components/GetDate'

import SearchBarForOrdersPage from '../components/SearchBarForOrdersPage'

import './OrdersListPage.css'


function OrdersListPage() {

    const history = useHistory()

    const dispatch = useDispatch()


    // =========================================
    // CURRENT DATE
    // =========================================

    const todaysDate = dateCheck(
        new Date().toISOString().slice(0, 10)
    )

    const [currentDateInfo] = useState(todaysDate)

    const [
        idOfchangeDeliveryStatus,
        setIdOfchangeDeliveryStatus
    ] = useState(0)

    const [
        cloneSearchTerm,
        setCloneSearchTerm
    ] = useState("")


    // =========================================
    // LOGIN REDUCER
    // =========================================

    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const { userInfo } = userLoginReducer


    // =========================================
    // ORDERS REDUCER
    // =========================================

    const getAllOrdersReducer = useSelector(
        state => state.getAllOrdersReducer
    )

    const {
        orders = [],
        loading: loadingOrders
    } = getAllOrdersReducer


    // =========================================
    // DELIVERY STATUS REDUCER
    // =========================================

    const changeDeliveryStatusReducer =
        useSelector(
            state => state.changeDeliveryStatusReducer
        )

    const {
        success: deliveryStatusChangeSuccess,
        loading: deliveryStatusChangeSpinner
    } = changeDeliveryStatusReducer


    // =========================================
    // TOKEN VALIDATION REDUCER
    // =========================================

    const checkTokenValidationReducer =
        useSelector(
            state => state.checkTokenValidationReducer
        )

    const {
        error: tokenError
    } = checkTokenValidationReducer


    // =========================================
    // GET ORDERS
    // =========================================

    useEffect(() => {

        if (!userInfo) {

            history.push("/login")

        } else {

            dispatch(
                checkTokenValidation()
            )

            dispatch(
                getAllOrders()
            )

        }

    }, [
        userInfo,
        dispatch,
        history
    ])


    // =========================================
    // SESSION EXPIRED
    // =========================================

    useEffect(() => {

        if (
            userInfo &&
            tokenError ===
            "Request failed with status code 401"
        ) {

            alert(
                "Session expired, please login again."
            )

            dispatch(
                logout()
            )

            history.push("/login")

            window.location.reload()

        }

    }, [
        userInfo,
        tokenError,
        dispatch,
        history
    ])


    // =========================================
    // CHANGE DELIVERY STATUS
    // =========================================

    const changeDeliveryStatusHandler = (
        id,
        status
    ) => {

        setIdOfchangeDeliveryStatus(id)

        const productData = {

            is_delivered: status,

            delivered_at:
                status
                    ? currentDateInfo
                    : "Not Delivered"

        }

        dispatch(
            changeDeliveryStatus(
                id,
                productData
            )
        )

    }


    // =========================================
    // DELIVERY SUCCESS
    // =========================================

    useEffect(() => {

        if (deliveryStatusChangeSuccess) {

            alert(
                "Delivery status changed successfully"
            )

            dispatch({
                type: CHANGE_DELIVERY_STATUS_RESET
            })

            dispatch(
                getAllOrders()
            )

        }

    }, [
        deliveryStatusChangeSuccess,
        dispatch
    ])


    // =========================================
    // SEARCH
    // =========================================

    const handleSearchTerm = (term) => {

        setCloneSearchTerm(
            (term || "").toLowerCase()
        )

    }


    // =========================================
    // FILTER ORDERS
    // =========================================

    const filteredOrders =
        Array.isArray(orders)
            ? orders.filter((item) => {

                return (

                    (item.name || "")
                        .toLowerCase()
                        .includes(
                            cloneSearchTerm
                        )

                    ||

                    (item.ordered_item || "")
                        .toLowerCase()
                        .includes(
                            cloneSearchTerm
                        )

                    ||

                    (item.address || "")
                        .toLowerCase()
                        .includes(
                            cloneSearchTerm
                        )

                )

            })
            : []


    // =========================================
    // RETURN
    // =========================================

    return (

        <div className="orders-page">


            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="orders-hero">

                <div className="orders-hero-content">

                    <span className="orders-small-title">
                        MY ACCOUNT
                    </span>

                    <h1>
                        My Orders
                    </h1>

                    <p>
                        Track your orders and view your
                        purchase details
                    </p>

                </div>


                <div className="orders-total-box">

                    <span>
                        Total Orders
                    </span>

                    <strong>
                        {filteredOrders.length}
                    </strong>

                </div>

            </div>


            {/* =====================================
                ADMIN SEARCH
            ===================================== */}

            {userInfo &&
                userInfo.admin && (

                    <div className="orders-admin-search">

                        <div className="admin-search-title">

                            <h5>
                                Order Management
                            </h5>

                            <p>
                                Search and manage customer orders
                            </p>

                        </div>


                        <SearchBarForOrdersPage

                            handleSearchTerm={
                                handleSearchTerm
                            }

                            placeholderValue={
                                "Search customer, product or address"
                            }

                        />

                    </div>

                )
            }


            {/* =====================================
                LOADING
            ===================================== */}

            {loadingOrders && (

                <div className="orders-loading">

                    <Spinner
                        animation="border"
                        size="sm"
                    />

                    <span>
                        Loading your orders...
                    </span>

                </div>

            )}


            {/* =====================================
                ORDERS
            ===================================== */}

            {!loadingOrders &&
                filteredOrders.length > 0 && (

                    <div className="customer-orders-list">

                        {filteredOrders.map(
                            (order, idx) => (

                                <div
                                    className="order-card"
                                    key={
                                        order.id || idx
                                    }
                                >


                                    {/* =================================
                                        ORDER HEADER
                                    ================================= */}

                                    <div className="order-card-header">

                                        <div className="order-id-block">

                                            <span className="order-label">
                                                ORDER ID
                                            </span>

                                            <strong className="order-number">
                                                #{order.id}
                                            </strong>

                                        </div>


                                        <div className="order-date">

                                            <span>
                                                Ordered on
                                            </span>

                                            <strong>

                                                {order.paid_at
                                                    ? dateCheck(
                                                        order.paid_at
                                                    )
                                                    : "Not Available"}

                                            </strong>

                                        </div>

                                    </div>


                                    {/* =================================
                                        PRODUCT SECTION
                                    ================================= */}

                                    <div className="order-product-section">


                                        <div className="product-icon">
                                            🛍️
                                        </div>


                                        <div className="product-info">

                                            <span>
                                                PRODUCT
                                            </span>

                                            <h3>
                                                {order.ordered_item}
                                            </h3>

                                        </div>


                                        <div className="product-price">

                                            <span>
                                                TOTAL AMOUNT
                                            </span>

                                            <strong>
                                                ₹{order.total_price}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* =================================
                                        STATUS SECTION
                                    ================================= */}

                                    <div className="order-status-section">


                                        {/* PAYMENT */}

                                        <div className="status-item">

                                            <div
                                                className={
                                                    order.paid_status
                                                        ? "status-circle completed"
                                                        : "status-circle pending"
                                                }
                                            >

                                                {order.paid_status
                                                    ? "✓"
                                                    : "!"}

                                            </div>


                                            <div className="status-text">

                                                <strong>
                                                    Payment
                                                </strong>

                                                <span>

                                                    {order.paid_status
                                                        ? "Payment completed"
                                                        : "Payment pending"}

                                                </span>

                                            </div>

                                        </div>


                                        <div className="status-line"></div>


                                        {/* DELIVERY */}

                                        <div className="status-item">

                                            <div
                                                className={
                                                    order.is_delivered
                                                        ? "status-circle completed"
                                                        : "status-circle pending"
                                                }
                                            >

                                                {order.is_delivered
                                                    ? "✓"
                                                    : "•"}

                                            </div>


                                            <div className="status-text">

                                                <strong>
                                                    Delivery
                                                </strong>

                                                <span>

                                                    {order.is_delivered
                                                        ? "Delivered"
                                                        : "Order Processing"}

                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================
                                        DETAILS
                                    ================================= */}

                                    <div className="order-details-grid">


                                        {/* ADDRESS */}

                                        <div className="order-detail">

                                            <div className="detail-icon">
                                                📍
                                            </div>

                                            <div>

                                                <span>
                                                    DELIVERY ADDRESS
                                                </span>

                                                <p>
                                                    {order.address ||
                                                        "Address not available"}
                                                </p>

                                            </div>

                                        </div>


                                        {/* CARD */}

                                        <div className="order-detail">

                                            <div className="detail-icon">
                                                💳
                                            </div>

                                            <div>

                                                <span>
                                                    PAYMENT METHOD
                                                </span>

                                                <p>

                                                    Card ending in{" "}

                                                    <strong>

                                                        {order.card_number
                                                            ? order.card_number.slice(-4)
                                                            : "----"}

                                                    </strong>

                                                </p>

                                            </div>

                                        </div>


                                        {/* PAID DATE */}

                                        <div className="order-detail">

                                            <div className="detail-icon">
                                                🗓️
                                            </div>

                                            <div>

                                                <span>
                                                    PAID ON
                                                </span>

                                                <p>

                                                    {order.paid_at
                                                        ? dateCheck(
                                                            order.paid_at
                                                        )
                                                        : "Not Available"}

                                                </p>

                                            </div>

                                        </div>


                                        {/* DELIVERY DATE */}

                                        <div className="order-detail">

                                            <div className="detail-icon">
                                                🚚
                                            </div>

                                            <div>

                                                <span>
                                                    DELIVERED ON
                                                </span>

                                                <p>

                                                    {order.is_delivered
                                                        ? order.delivered_at
                                                        : "Not delivered yet"}

                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================
                                        FOOTER
                                    ================================= */}

                                    <div className="order-card-footer">


                                        <div>

                                            {order.is_delivered ? (

                                                <span className="delivery-badge delivered">

                                                    ✓ Delivered

                                                </span>

                                            ) : (

                                                <span className="delivery-badge processing">

                                                    ⏳ Processing

                                                </span>

                                            )}

                                        </div>


                                        {/* =================================
                                            ADMIN ACTION
                                        ================================= */}

                                        {userInfo &&
                                            userInfo.admin && (

                                                <div>

                                                    {order.is_delivered ? (

                                                        <button

                                                            className="admin-delivery-btn danger"

                                                            onClick={() =>
                                                                changeDeliveryStatusHandler(
                                                                    order.id,
                                                                    false
                                                                )
                                                            }

                                                            disabled={
                                                                deliveryStatusChangeSpinner &&
                                                                idOfchangeDeliveryStatus ===
                                                                order.id
                                                            }

                                                        >

                                                            {deliveryStatusChangeSpinner &&
                                                                idOfchangeDeliveryStatus ===
                                                                order.id ? (

                                                                <Spinner
                                                                    animation="border"
                                                                    size="sm"
                                                                />

                                                            ) : (

                                                                "Mark Undelivered"

                                                            )}

                                                        </button>

                                                    ) : (

                                                        <button

                                                            className="admin-delivery-btn primary"

                                                            onClick={() =>
                                                                changeDeliveryStatusHandler(
                                                                    order.id,
                                                                    true
                                                                )
                                                            }

                                                            disabled={
                                                                deliveryStatusChangeSpinner &&
                                                                idOfchangeDeliveryStatus ===
                                                                order.id
                                                            }

                                                        >

                                                            {deliveryStatusChangeSpinner &&
                                                                idOfchangeDeliveryStatus ===
                                                                order.id ? (

                                                                <Spinner
                                                                    animation="border"
                                                                    size="sm"
                                                                />

                                                            ) : (

                                                                "Mark Delivered"

                                                            )}

                                                        </button>

                                                    )}

                                                </div>

                                            )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}


            {/* =====================================
                NO ORDERS
            ===================================== */}

            {!loadingOrders &&
                filteredOrders.length === 0 && (

                    <div className="no-orders">

                        <div className="no-orders-icon">
                            📦
                        </div>

                        <h4>
                            No Orders Found
                        </h4>

                        <p>
                            You haven't placed any orders yet.
                        </p>

                        <button

                            className="continue-shopping-btn"

                            onClick={() =>
                                history.push("/")
                            }

                        >

                            Continue Shopping

                        </button>

                    </div>

                )}

        </div>

    )

}


export default OrdersListPage

