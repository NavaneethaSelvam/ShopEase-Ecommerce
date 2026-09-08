import React, { useState } from 'react'

import {
    Form,
    Button,
    Card,
    InputGroup
} from 'react-bootstrap'

import {
    useDispatch,
    useSelector
} from 'react-redux'

import {
    createUserAddress,
    getAllAddress
} from '../actions/userActions'

import {
    CREATE_USER_ADDRESS_RESET
} from '../constants'

import Message from './Message'

import './CreateAddressComponent.css'


const CreateAddressComponent = ({ toggleCreateAddress }) => {

    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [pinCode, setPinCode] = useState("")
    const [houseNumber, setHouseNumber] = useState("")
    const [landmark, setLandmark] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")


    const createUserAddressReducer = useSelector(
        state => state.createUserAddressReducer
    )

    const {
        loading,
        success: addressCreationSuccess,
        error: errorCreatingAddress
    } = createUserAddressReducer


    const addressSubmitHandler = (e) => {

        e.preventDefault()

        const addressData = {
            name: name,
            phone_number: phoneNumber,
            pin_code: pinCode,
            house_no: houseNumber,
            landmark: landmark,
            city: city,
            state: state
        }

        dispatch(
            createUserAddress(addressData)
        )
    }


    if (addressCreationSuccess) {

        alert("Address successfully created.")

        dispatch({
            type: CREATE_USER_ADDRESS_RESET
        })

        dispatch(
            getAllAddress()
        )

        toggleCreateAddress()
    }


    return (

        <div className="create-address-wrapper">


            {/* Decorative background */}

            <div className="address-decoration address-decoration-one"></div>
            <div className="address-decoration address-decoration-two"></div>


            <Card className="create-address-card">


                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="address-card-header">

                    <div className="address-header-icon">

                        📍

                    </div>

                    <div>

                        <span className="address-mini-title">
                            DELIVERY DETAILS
                        </span>

                        <h2>
                            Add New Address
                        </h2>

                        <p>
                            Enter your delivery details below
                        </p>

                    </div>

                </div>


                {/* =====================================
                    ERROR
                ===================================== */}

                {errorCreatingAddress && (

                    <div className="address-error">

                        <Message variant="danger">
                            {errorCreatingAddress}
                        </Message>

                    </div>

                )}


                <Form
                    onSubmit={addressSubmitHandler}
                    className="address-form"
                >


                    {/* =====================================
                        PERSONAL DETAILS
                    ===================================== */}

                    <div className="address-section-title">

                        <span>👤</span>

                        <div>

                            <h4>
                                Personal Details
                            </h4>

                            <p>
                                Who should receive the order?
                            </p>

                        </div>

                    </div>


                    <div className="address-grid">


                        {/* NAME */}

                        <Form.Group
                            controlId="name"
                            className="address-form-group"
                        >

                            <Form.Label>
                                Full Name
                            </Form.Label>

                            <div className="address-input-wrapper">

                                <span>
                                    👤
                                </span>

                                <Form.Control
                                    autoFocus
                                    required
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />

                            </div>

                        </Form.Group>


                        {/* PHONE */}

                        <Form.Group
                            controlId="phoneNumber"
                            className="address-form-group"
                        >

                            <Form.Label>
                                Phone Number
                            </Form.Label>

                            <InputGroup className="address-phone-group">

                                <InputGroup.Text>
                                    🇮🇳 +91
                                </InputGroup.Text>

                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="10 digit mobile number"
                                    pattern="[0-9]{10}"
                                    maxLength="10"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                />

                            </InputGroup>

                        </Form.Group>

                    </div>


                    {/* =====================================
                        ADDRESS DETAILS
                    ===================================== */}

                    <div className="address-section-title">

                        <span>🏠</span>

                        <div>

                            <h4>
                                Address Details
                            </h4>

                            <p>
                                Where should we deliver your order?
                            </p>

                        </div>

                    </div>


                    {/* HOUSE */}

                    <Form.Group
                        controlId="houseNumber"
                        className="address-form-group"
                    >

                        <Form.Label>
                            House No. / Street Address
                        </Form.Label>

                        <div className="address-input-wrapper">

                            <span>
                                🏠
                            </span>

                            <Form.Control
                                required
                                type="text"
                                placeholder="House number, street name"
                                value={houseNumber}
                                onChange={(e) =>
                                    setHouseNumber(e.target.value)
                                }
                            />

                        </div>

                    </Form.Group>


                    {/* LANDMARK */}

                    <Form.Group
                        controlId="landmark"
                        className="address-form-group"
                    >

                        <Form.Label>

                            Landmark

                            <small>
                                Optional
                            </small>

                        </Form.Label>

                        <div className="address-input-wrapper">

                            <span>
                                📌
                            </span>

                            <Form.Control
                                type="text"
                                placeholder="Nearby landmark"
                                value={landmark}
                                onChange={(e) =>
                                    setLandmark(e.target.value)
                                }
                            />

                        </div>

                    </Form.Group>


                    <div className="address-grid">


                        {/* CITY */}

                        <Form.Group
                            controlId="city"
                            className="address-form-group"
                        >

                            <Form.Label>
                                City
                            </Form.Label>

                            <div className="address-input-wrapper">

                                <span>
                                    🌆
                                </span>

                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter city"
                                    value={city}
                                    onChange={(e) =>
                                        setCity(e.target.value)
                                    }
                                />

                            </div>

                        </Form.Group>


                        {/* STATE */}

                        <Form.Group
                            controlId="state"
                            className="address-form-group"
                        >

                            <Form.Label>
                                State
                            </Form.Label>

                            <div className="address-input-wrapper">

                                <span>
                                    🗺️
                                </span>

                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter state"
                                    value={state}
                                    onChange={(e) =>
                                        setState(e.target.value)
                                    }
                                />

                            </div>

                        </Form.Group>

                    </div>


                    {/* PIN */}

                    <Form.Group
                        controlId="pinCode"
                        className="address-form-group"
                    >

                        <Form.Label>
                            PIN Code
                        </Form.Label>

                        <div className="address-input-wrapper">

                            <span>
                                📮
                            </span>

                            <Form.Control
                                required
                                type="text"
                                placeholder="6 digit PIN code"
                                pattern="[0-9]{6}"
                                maxLength="6"
                                value={pinCode}
                                onChange={(e) =>
                                    setPinCode(
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                            />

                        </div>

                    </Form.Group>


                    {/* =====================================
                        SECURITY INFO
                    ===================================== */}

                    <div className="address-security">

                        <span>
                            🔒
                        </span>

                        <div>

                            <strong>
                                Your information is secure
                            </strong>

                            <p>
                                Your address details are only used
                                for order delivery.
                            </p>

                        </div>

                    </div>


                    {/* =====================================
                        BUTTONS
                    ===================================== */}

                    <div className="address-buttons">


                        <Button
                            type="button"
                            className="address-cancel-btn"
                            onClick={toggleCreateAddress}
                        >

                            Cancel

                        </Button>


                        <Button
                            type="submit"
                            className="address-save-btn"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="address-spinner">
                                        ⟳
                                    </span>

                                    Saving...
                                </>

                            ) : (

                                <>
                                    <span>
                                        ✓
                                    </span>

                                    Save Address
                                </>

                            )}

                        </Button>

                    </div>


                </Form>

            </Card>

        </div>
    )
}


export default CreateAddressComponent