
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
    deleteProduct,
    getProductDetails
} from '../actions/productActions'

import Message from '../components/Message'

import {
    Spinner,
    Button,
    Modal
} from 'react-bootstrap'

import { Link } from 'react-router-dom'

import {
    CREATE_PRODUCT_RESET,
    DELETE_PRODUCT_RESET,
    UPDATE_PRODUCT_RESET
} from '../constants'

import './ProductDetailsPage.css'


function ProductDetailsPage({ history, match }) {

    const dispatch = useDispatch()

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
    // PRODUCT DETAILS
    // =========================================

    const productDetailsReducer = useSelector(
        state => state.productDetailsReducer
    )

    const {
        loading,
        error,
        product
    } = productDetailsReducer


    // =========================================
    // USER
    // =========================================

    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const {
        userInfo
    } = userLoginReducer


    // =========================================
    // DELETE PRODUCT
    // =========================================

    const deleteProductReducer = useSelector(
        state => state.deleteProductReducer
    )

    const {
        success: productDeletionSuccess
    } = deleteProductReducer


    // =========================================
    // GET PRODUCT DETAILS
    // =========================================

    useEffect(() => {

        dispatch(
            getProductDetails(match.params.id)
        )

        dispatch({
            type: UPDATE_PRODUCT_RESET
        })

        dispatch({
            type: CREATE_PRODUCT_RESET
        })

    }, [dispatch, match.params.id])


    // =========================================
    // CONFIRM DELETE
    // =========================================

    const confirmDelete = () => {

        dispatch(
            deleteProduct(match.params.id)
        )

        handleClose()
    }


    // =========================================
    // AFTER DELETE
    // =========================================

    useEffect(() => {

        if (productDeletionSuccess) {

            alert('Product successfully deleted.')

            dispatch({
                type: DELETE_PRODUCT_RESET
            })

            history.push('/')

        }

    }, [
        productDeletionSuccess,
        dispatch,
        history
    ])


    // =========================================
    // UNIVERSAL PRODUCT IMAGE URL
    // =========================================

    const getImageUrl = (image) => {

        if (!image) {
            return ''
        }

        const imageValue = String(image).trim()

        // External image
        if (
            imageValue.startsWith('http://') ||
            imageValue.startsWith('https://')
        ) {
            return imageValue
        }

        // Remove Django image path if already present
        const imageName = imageValue
            .replace(/^\/images\//, '')
            .replace(/^images\//, '')
            .replace(/^\/media\//, '')
            .replace(/^media\//, '')

        return `http://127.0.0.1:8000/images/${imageName}`
    }


    // =========================================
    // RETURN
    // =========================================

    return (

        <div className="product-details-page">


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
                        ⚠ Delete Confirmation
                    </Modal.Title>

                </Modal.Header>


                <Modal.Body>

                    Are you sure you want to delete this product{' '}

                    <strong>
                        "{product && product.name}"
                    </strong>

                    ?

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

            {loading && (

                <div className="product-loading">

                    <Spinner animation="border" />

                    <span>
                        Getting Product Details...
                    </span>

                </div>

            )}


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <div className="product-error">

                    <Message variant="danger">
                        {error}
                    </Message>

                </div>

            )}


            {/* =========================================
                PRODUCT DETAILS
            ========================================= */}

            {!loading && !error && product && (

                <div className="product-details-container">


                    {/* =========================================
                        BACK BUTTON
                    ========================================= */}

                    <button
                        className="back-button"
                        onClick={() => history.goBack()}
                    >
                        ← Back to Products
                    </button>


                    {/* =========================================
                        MAIN CARD
                    ========================================= */}

                    <div className="product-details-card">


                        {/* =========================================
                            IMAGE SECTION
                        ========================================= */}

                        <div className="product-image-section">

                            <div className="product-image-box">

                                <img
                                    src={getImageUrl(product.image)}
                                    alt={product.name}
                                    className="product-details-image"

                                    onLoad={(e) => {

                                        console.log(
                                            'IMAGE LOADED:',
                                            e.target.src
                                        )

                                    }}

                                    onError={(e) => {

                                        console.log(
                                            'IMAGE ERROR:',
                                            e.target.src
                                        )

                                        e.target.style.display = 'none'

                                        e.target.parentElement.classList.add(
                                            'image-not-found'
                                        )

                                    }}
                                />


                                {/* IMAGE FALLBACK */}

                                <div className="image-fallback">

                                    <div className="fallback-icon">
                                        🛍️
                                    </div>

                                    <span>
                                        Image not available
                                    </span>

                                </div>

                            </div>


                            {/* =========================================
                                ADMIN BUTTONS
                            ========================================= */}

                            {userInfo && userInfo.admin && (

                                <div className="admin-buttons">

                                    <button
                                        className="admin-delete-btn"
                                        onClick={handleShow}
                                    >
                                        🗑 Delete Product
                                    </button>


                                    <button
                                        className="admin-edit-btn"
                                        onClick={() =>
                                            history.push(
                                                `/product-update/${product.id}/`
                                            )
                                        }
                                    >
                                        ✏ Edit Product
                                    </button>

                                </div>

                            )}

                        </div>


                        {/* =========================================
                            PRODUCT INFORMATION
                        ========================================= */}

                        <div className="product-info-section">

                            <span className="product-category">
                                PRODUCT DETAILS
                            </span>


                            <h1 className="product-title">
                                {product.name}
                            </h1>


                            {/* RATING */}

                            <div className="product-rating">

                                <span className="stars">
                                    ★★★★★
                                </span>

                                <span className="rating-text">
                                    Customer Rating
                                </span>

                            </div>


                            {/* PRICE */}

                            <div className="product-price-box">

                                <div className="price-content">

                                    <span className="price-label">
                                        Price
                                    </span>

                                    <span className="product-price">
                                        ₹ {product.price}
                                    </span>

                                </div>

                            </div>


                            {/* DESCRIPTION */}

                            <div className="product-description">

                                <h3>
                                    Description
                                </h3>

                                <p>
                                    {product.description}
                                </p>

                            </div>


                            {/* STOCK */}

                            <div className="stock-section">

                                {product.stock ? (

                                    <span className="in-stock">
                                        ✓ In Stock
                                    </span>

                                ) : (

                                    <span className="out-stock">
                                        ✕ Out Of Stock
                                    </span>

                                )}

                            </div>


                            {/* BUY */}

                            <div className="buy-section">

                                {product.stock ? (

                                    <Link
                                        to={`${product.id}/checkout/`}
                                        className="buy-button"
                                    >
                                        💳 Pay with Stripe
                                    </Link>

                                ) : (

                                    <button
                                        className="buy-button disabled"
                                        disabled
                                    >
                                        Out Of Stock
                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}


export default ProductDetailsPage

