
import React, { useState, useEffect } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import {
    getProductDetails,
    updateProduct
} from '../actions/productActions'

import {
    checkTokenValidation,
    logout
} from '../actions/userActions'

import { UPDATE_PRODUCT_RESET } from '../constants'

import Message from '../components/Message'


const ProductUpdatePage = ({ match }) => {

    const history = useHistory()
    const dispatch = useDispatch()

    // =========================================
    // PRODUCT DETAILS REDUCER
    // =========================================

    const productDetailsReducer = useSelector(
        state => state.productDetailsReducer
    )

    const {
        loading: loadingPageDetails,
        error: productDetailsError,
        product
    } = productDetailsReducer


    // =========================================
    // USER LOGIN REDUCER
    // =========================================

    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const {
        userInfo
    } = userLoginReducer


    // =========================================
    // UPDATE PRODUCT REDUCER
    // =========================================

    const updateProductReducer = useSelector(
        state => state.updateProductReducer
    )

    const {
        success: productUpdationSuccess,
        loading: loadingProductUpdations,
        error: productUpdationError
    } = updateProductReducer


    // =========================================
    // TOKEN VALIDATION REDUCER
    // =========================================

    const checkTokenValidationReducer = useSelector(
        state => state.checkTokenValidationReducer
    )

    const {
        error: tokenError
    } = checkTokenValidationReducer


    // =========================================
    // FORM STATES
    // =========================================

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState(false)
    const [image, setImage] = useState("")

    const [newImage, setNewImage] = useState(false)


    // =========================================
    // SCROLL TO TOP
    // =========================================

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }


    // =========================================
    // CHECK ADMIN + GET PRODUCT
    // =========================================

    useEffect(() => {

        if (!userInfo) {
            history.push("/login")
            return
        }

        if (!userInfo.admin) {
            history.push("/")
            return
        }

        dispatch(checkTokenValidation())

        dispatch(
            getProductDetails(match.params.id)
        )

    }, [
        dispatch,
        userInfo,
        history,
        match.params.id
    ])


    // =========================================
    // SET PRODUCT DATA INTO FORM
    // =========================================

    useEffect(() => {

        if (product && product.id) {

            setName(product.name || "")
            setDescription(product.description || "")
            setPrice(product.price || "")
            setStock(product.stock || false)

        }

    }, [product])


    // =========================================
    // SUBMIT UPDATE
    // =========================================

    const onSubmit = (e) => {

        e.preventDefault()

        if (!product || !product.id) {
            return
        }

        const form_data = new FormData()

        form_data.append(
            'name',
            name
        )

        form_data.append(
            'description',
            description
        )

        form_data.append(
            'price',
            price
        )

        form_data.append(
            'stock',
            stock
        )

        // Only send image if user selected a new image
        if (newImage && image) {
            form_data.append(
                'image',
                image
            )
        }


        dispatch(
            updateProduct(
                product.id,
                form_data
            )
        )
    }


    // =========================================
    // UPDATE SUCCESS
    // =========================================

    useEffect(() => {

        if (productUpdationSuccess && product) {

            alert("Product successfully updated.")

            dispatch({
                type: UPDATE_PRODUCT_RESET
            })

            history.push(
                `/product/${product.id}`
            )
        }

    }, [
        productUpdationSuccess,
        product,
        dispatch,
        history
    ])


    // =========================================
    // TOKEN EXPIRED
    // =========================================

    useEffect(() => {

        if (
            userInfo &&
            tokenError === "Request failed with status code 401"
        ) {

            alert(
                "Session expired, please login again."
            )

            dispatch(logout())

            history.push("/login")

            window.location.reload()
        }

    }, [
        tokenError,
        userInfo,
        dispatch,
        history
    ])


    // =========================================
    // IMAGE ERROR MESSAGE
    // =========================================

    const getUpdateError = () => {

        if (!productUpdationError) {
            return null
        }

        if (
            productUpdationError.image &&
            Array.isArray(productUpdationError.image)
        ) {
            return productUpdationError.image[0]
        }

        if (
            typeof productUpdationError === "string"
        ) {
            return productUpdationError
        }

        if (
            productUpdationError.detail
        ) {
            return productUpdationError.detail
        }

        return "Unable to update product."
    }


    // =========================================
    // LOADING PRODUCT
    // =========================================

    if (
        loadingPageDetails ||
        !product ||
        !product.id
    ) {

        return (

            <div>

                {loadingPageDetails && (

                    <span
                        style={{
                            display: "flex"
                        }}
                    >

                        <h5>
                            Getting Product Details
                        </h5>

                        <span className="ml-2">

                            <Spinner
                                animation="border"
                            />

                        </span>

                    </span>

                )}

                {productDetailsError && (

                    <Message variant="danger">
                        {productDetailsError}
                    </Message>

                )}

            </div>

        )
    }


    // =========================================
    // RETURN
    // =========================================

    return (

        <div>

            {/* =========================================
                PAGE TITLE
            ========================================= */}

            <span
                className="d-flex justify-content-center text-info"
            >

                <em>
                    Edit Product
                </em>

            </span>


            {/* =========================================
                ERROR
            ========================================= */}

            {productUpdationError && (

                <div>

                    {scrollToTop()}

                    <Message variant="danger">

                        {getUpdateError()}

                    </Message>

                </div>

            )}


            {/* =========================================
                UPDATE LOADING
            ========================================= */}

            {loadingProductUpdations && (

                <span
                    style={{
                        display: "flex"
                    }}
                >

                    <h5>
                        Updating Product
                    </h5>

                    <span className="ml-2">

                        <Spinner
                            animation="border"
                        />

                    </span>

                </span>

            )}


            {/* =========================================
                FORM
            ========================================= */}

            <Form
                onSubmit={onSubmit}
            >


                {/* =========================================
                    PRODUCT IMAGE
                ========================================= */}

                <Form.Group controlId="image">

                    <Form.Label>

                        <b>
                            Product Image
                        </b>

                    </Form.Label>


                    <p>

                        <img
                            src={product.image}
                            alt={product.name}
                            height="200"
                        />

                    </p>


                    {newImage ? (

                        <div>

                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => {

                                    if (
                                        e.target.files &&
                                        e.target.files.length > 0
                                    ) {

                                        setImage(
                                            e.target.files[0]
                                        )

                                    }

                                }}
                            />


                            <span
                                onClick={() => {

                                    setNewImage(false)

                                    setImage("")

                                    dispatch({
                                        type:
                                            UPDATE_PRODUCT_RESET
                                    })

                                }}
                                className="btn btn-primary btn-sm mt-2"
                            >

                                Cancel

                            </span>

                        </div>

                    ) : (

                        <p>

                            <span
                                onClick={() =>
                                    setNewImage(true)
                                }
                                className="btn btn-success btn-sm"
                            >

                                Choose Different Image

                            </span>

                        </p>

                    )}

                </Form.Group>


                {/* =========================================
                    PRODUCT NAME
                ========================================= */}

                <Form.Group controlId="name">

                    <Form.Label>

                        <b>
                            Product Name
                        </b>

                    </Form.Label>

                    <Form.Control
                        autoFocus
                        type="text"
                        value={name}
                        placeholder="Product name"
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />

                </Form.Group>


                {/* =========================================
                    DESCRIPTION
                ========================================= */}

                <Form.Group controlId="description">

                    <Form.Label>

                        <b>
                            Product Description
                        </b>

                    </Form.Label>

                    <Form.Control
                        type="text"
                        value={description}
                        placeholder="Product description"
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        required
                    />

                </Form.Group>


                {/* =========================================
                    PRICE
                ========================================= */}

                <Form.Group controlId="price">

                    <Form.Label>

                        <b>
                            Price
                        </b>

                    </Form.Label>

                    <Form.Control
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        placeholder="199.99"
                        onChange={(e) =>
                            setPrice(e.target.value)
                        }
                        required
                    />

                </Form.Group>


                {/* =========================================
                    STOCK
                ========================================= */}

                <span
                    style={{
                        display: "flex"
                    }}
                >

                    <label>
                        In Stock
                    </label>

                    <input
                        type="checkbox"
                        checked={stock}
                        className="ml-2 mt-2"
                        onChange={() =>
                            setStock(!stock)
                        }
                    />

                </span>


                {/* =========================================
                    BUTTONS
                ========================================= */}

                <Button
                    type="submit"
                    variant="success"
                    className="btn-sm button-focus-css mb-4"
                    disabled={loadingProductUpdations}
                >

                    {loadingProductUpdations
                        ? "Updating..."
                        : "Save Changes"
                    }

                </Button>


                <Button
                    type="button"
                    onClick={() =>
                        history.push(
                            `/product/${product.id}`
                        )
                    }
                    variant="primary"
                    className="btn-sm ml-2 button-focus-css mb-4"
                >

                    Cancel

                </Button>

            </Form>

        </div>

    )
}


export default ProductUpdatePage

