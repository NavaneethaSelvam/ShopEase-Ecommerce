
import React, { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import { createCard } from '../actions/cardActions'

import Message from './Message'
import DeleteCardComponent from './DeleteCardComponent'

const current_year = new Date().getFullYear()


const CreateCardComponent = ({
    stripeCards = [],
    addressSelected
}) => {

    const history = useHistory()
    const dispatch = useDispatch()


    // =========================================
    // STATE
    // =========================================

    const [userId] = useState(0)

    const [runCardDeleteHandler, setRunCardDeleteHandler] =
        useState(false)

    const [differentCard, setDifferentCard] =
        useState(false)

    const [cardDetails, setCardDetails] =
        useState(false)

    const [cardDetailsId, setCardDetailsId] =
        useState(0)

    const [showStripeCard, setShowStripeCard] =
        useState(true)

    const [deleteCardNumber] =
        useState("")

    const [email, setEmail] =
        useState("")

    const [cardNumber, setCardNumber] =
        useState("")

    const [expMonth, setExpMonth] =
        useState("")

    const [expYear, setExpYear] =
        useState("")

    const [cvc, setCvc] =
        useState("")

    const [saveCard, setSaveCard] =
        useState(false)


    // =========================================
    // LOGIN REDUCER
    // =========================================

    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const {
        userInfo
    } = userLoginReducer


    // =========================================
    // CREATE CARD REDUCER
    // =========================================

    const createCardReducer = useSelector(
        state => state.createCardReducer
    )

    const {
        loading: cardLoading,
        error: cardError,
        success: cardSuccess
    } = createCardReducer


    // =========================================
    // DELETE CARD REDUCER
    // =========================================

    const deleteSavedCardReducer = useSelector(
        state => state.deleteSavedCardReducer
    )

    const {
        loading: deleteLoading,
        success: deleteSuccess,
        error: deleteError
    } = deleteSavedCardReducer


    // =========================================
    // LOGIN CHECK
    // =========================================

    useEffect(() => {

        if (!userInfo) {
            history.push("/login")
        }

    }, [history, userInfo])


    // =========================================
    // CREATE CARD SUCCESS
    // =========================================

    useEffect(() => {

        if (cardSuccess) {

            setCardNumber("")
            setExpMonth("")
            setExpYear("")
            setCvc("")

        }

    }, [cardSuccess])


    // =========================================
    // DELETE SUCCESS
    // =========================================

    useEffect(() => {

        if (deleteSuccess) {

            alert("Card successfully deleted.")

            window.location.reload()

        }

    }, [deleteSuccess])


    // =========================================
    // CARD SUBMIT
    // =========================================

    const handleCardSubmittion = (e) => {

        e.preventDefault()


        // =====================================
        // ADDRESS VALIDATION
        // =====================================

        if (!addressSelected) {

            alert(
                "Please select or add your Address to continue"
            )

            return
        }


        // =====================================
        // CARD NUMBER VALIDATION
        // =====================================

        const cleanCardNumber =
            cardNumber.replace(/\D/g, "")


        if (!cleanCardNumber) {

            alert(
                "Please enter your card number"
            )

            return
        }


        if (cleanCardNumber.length !== 16) {

            alert(
                "Card number must contain exactly 16 digits"
            )

            return
        }


        // =====================================
        // EXPIRY MONTH VALIDATION
        // =====================================

        if (!expMonth) {

            alert(
                "Please select Exp Month"
            )

            return
        }


        // =====================================
        // EXPIRY YEAR VALIDATION
        // =====================================

        if (!expYear) {

            alert(
                "Please select Exp Year"
            )

            return
        }


        // =====================================
        // CVC VALIDATION
        // =====================================

        const cleanCvc =
            cvc.replace(/\D/g, "")


        if (!cleanCvc) {

            alert(
                "Please enter CVC number"
            )

            return
        }


        if (cleanCvc.length !== 3) {

            alert(
                "CVC must contain exactly 3 digits"
            )

            return
        }


        // =====================================
        // EMAIL
        // =====================================

        const finalEmail =
            email.trim() !== ""
                ? email.trim()
                : userInfo?.email || ""


        if (!finalEmail) {

            alert(
                "Email address is required"
            )

            return
        }


        // =====================================
        // DATA
        // =====================================

        const data = {

            email: finalEmail,

            cardNumber:
                cleanCardNumber,

            expMonth:
                Number(expMonth),

            expYear:
                Number(expYear),

            cvc:
                Number(cleanCvc),

            saveCard:
                saveCard

        }


        // =====================================
        // CREATE CARD
        // =====================================

        dispatch(
            createCard(data)
        )

    }


    // =========================================
    // PAY WITH SAVED CARD
    // =========================================

    const payWithSavedCard = (cardData) => {

        if (!addressSelected) {

            alert(
                "Please select or add your Address to continue"
            )

            return
        }


        const data = {

            email:
                cardData.email ||
                userInfo?.email ||
                "",

            cardNumber:
                cardData.card_number,

            expMonth:
                Number(cardData.exp_month),

            expYear:
                Number(cardData.exp_year),

            cvc:
                Number(cardData.cvc || 0),

            saveCard:
                false

        }


        dispatch(
            createCard(data)
        )

    }


    // =========================================
    // SHOW CARD DETAILS
    // =========================================

    const showCardDetails = (cardData) => {

        if (
            cardDetails &&
            cardData.id === cardDetailsId
        ) {

            return (

                <div
                    style={{
                        marginTop: "15px",
                        padding: "12px",
                        background: "#f8f5ff",
                        borderRadius: "10px"
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            setCardDetails(false)
                        }
                        className="btn btn-outline-danger btn-sm"
                        style={{
                            float: "right"
                        }}
                    >
                        Close
                    </button>


                    <p>
                        <b>Exp Month:</b>{" "}
                        {cardData.exp_month}
                    </p>


                    <p>
                        <b>Exp Year:</b>{" "}
                        {cardData.exp_year}
                    </p>

                </div>

            )

        }

        return null
    }


    // =========================================
    // DELETE CARD MODAL
    // =========================================

    const toggleRunCardDeleteHandler = () => {

        setRunCardDeleteHandler(
            !runCardDeleteHandler
        )

    }


    // =========================================
    // RETURN
    // =========================================

    return (

        <div>


            {/* =====================================
                DELETE CARD COMPONENT
            ===================================== */}

            <DeleteCardComponent

                userId={userId}

                deleteCardNumber={deleteCardNumber}

                runCardDeleteHandler={
                    runCardDeleteHandler
                }

                toggleRunCardDeleteHandler={
                    toggleRunCardDeleteHandler
                }

            />


            {/* =====================================
                DELETE LOADING
            ===================================== */}

            {deleteLoading && (

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "15px"
                    }}
                >

                    <strong>
                        Deleting card...
                    </strong>

                    <Spinner
                        animation="border"
                        size="sm"
                        className="ml-2"
                    />

                </div>

            )}


            {/* =====================================
                ERROR
            ===================================== */}

            {cardError && (

                <Message variant="danger">
                    {cardError}
                </Message>

            )}


            {deleteError && (

                <Message variant="danger">
                    {deleteError}
                </Message>

            )}


            {/* =====================================
                NEW CARD
            ===================================== */}

            <Card
                className="p-4"
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "15px"
                }}
            >


                <button
                    type="button"
                    className={
                        showStripeCard
                            ? "btn btn-sm btn-danger mb-3"
                            : "btn btn-sm btn-primary mb-3"
                    }
                    onClick={() =>
                        setShowStripeCard(
                            !showStripeCard
                        )
                    }
                >

                    {showStripeCard
                        ? "Close"
                        : "Enter New Card"}

                </button>


                {showStripeCard && (

                    <Form
                        onSubmit={
                            handleCardSubmittion
                        }
                    >


                        {/* =================================
                            EMAIL
                        ================================= */}

                        {differentCard ? (

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    <b>
                                        Card Holder Email Address
                                    </b>

                                </Form.Label>


                                <Form.Control
                                    autoFocus
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Email address"
                                    required
                                />

                            </Form.Group>

                        ) : (

                            <div className="mb-3">

                                <b>
                                    Customer Email:
                                </b>{" "}

                                {userInfo
                                    ? userInfo.email
                                    : ""}

                            </div>

                        )}


                        <p>

                            <Link
                                to="#"
                                onClick={(e) => {

                                    e.preventDefault()

                                    setDifferentCard(
                                        !differentCard
                                    )

                                    setEmail("")

                                }}
                            >

                                {differentCard
                                    ? "Use Your default Email"
                                    : "Use a different Card"}

                            </Link>

                        </p>


                        {/* =================================
                            CARD NUMBER
                        ================================= */}

                        <Form.Group className="mb-3">

                            <Form.Label>

                                <b>
                                    Card Number
                                </b>

                            </Form.Label>


                            <Form.Control

                                type="text"

                                inputMode="numeric"

                                value={cardNumber}

                                onChange={(e) => {

                                    const value =
                                        e.target.value
                                            .replace(
                                                /\D/g,
                                                ""
                                            )
                                            .slice(
                                                0,
                                                16
                                            )

                                    setCardNumber(
                                        value
                                    )

                                }}

                                placeholder="1234567812345678"

                                maxLength="16"

                                autoComplete="off"

                                required

                            />

                        </Form.Group>


                        {/* =================================
                            EXPIRY + CVC
                        ================================= */}

                        <Row>


                            {/* MONTH */}

                            <Col>

                                <Form.Group className="mb-3">

                                    <Form.Label>

                                        <b>
                                            Exp Month
                                        </b>

                                    </Form.Label>


                                    <select

                                        className="form-control"

                                        value={expMonth}

                                        onChange={(e) =>
                                            setExpMonth(
                                                e.target.value
                                            )
                                        }

                                        required
                                    >

                                        <option value="">
                                            -- Select Month --
                                        </option>


                                        {Array.from(
                                            {
                                                length: 12
                                            },
                                            (x, i) => (

                                                <option
                                                    key={i}
                                                    value={i + 1}
                                                >
                                                    {i + 1}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </Form.Group>

                            </Col>


                            {/* YEAR */}

                            <Col>

                                <Form.Group className="mb-3">

                                    <Form.Label>

                                        <b>
                                            Exp Year
                                        </b>

                                    </Form.Label>


                                    <select

                                        className="form-control"

                                        value={expYear}

                                        onChange={(e) =>
                                            setExpYear(
                                                e.target.value
                                            )
                                        }

                                        required
                                    >

                                        <option value="">
                                            -- Select Year --
                                        </option>


                                        {Array.from(
                                            {
                                                length: 21
                                            },
                                            (x, i) => (

                                                <option
                                                    key={i}
                                                    value={
                                                        current_year + i
                                                    }
                                                >
                                                    {
                                                        current_year + i
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </Form.Group>

                            </Col>


                            {/* CVC */}

                            <Col>

                                <Form.Group className="mb-3">

                                    <Form.Label>

                                        <b>
                                            CVC Number
                                        </b>

                                    </Form.Label>


                                    <Form.Control

                                        type="text"

                                        inputMode="numeric"

                                        value={cvc}

                                        onChange={(e) => {

                                            const value =
                                                e.target.value
                                                    .replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                    .slice(
                                                        0,
                                                        3
                                                    )

                                            setCvc(
                                                value
                                            )

                                        }}

                                        placeholder="123"

                                        maxLength="3"

                                        autoComplete="off"

                                        required

                                    />

                                </Form.Group>

                            </Col>

                        </Row>


                        {/* =================================
                            SAVE CARD
                        ================================= */}

                        {!differentCard && (

                            <Form.Group className="mb-3">

                                <Form.Check

                                    type="checkbox"

                                    id="saveCard"

                                    label="Save my card for future payments"

                                    checked={
                                        saveCard
                                    }

                                    onChange={(e) =>
                                        setSaveCard(
                                            e.target.checked
                                        )
                                    }

                                />

                            </Form.Group>

                        )}


                        {/* =================================
                            SUBMIT
                        ================================= */}

                        <Button

                            variant="primary"

                            type="submit"

                            disabled={
                                cardLoading
                            }

                            style={{
                                width: "100%",
                                padding: "10px",
                                fontWeight: "600"
                            }}

                        >

                            {cardLoading ? (

                                <>

                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        className="mr-2"
                                    />

                                    Processing...

                                </>

                            ) : (

                                "Submit"

                            )}

                        </Button>


                    </Form>

                )}

            </Card>


            {/* =====================================
                SAVED CARDS
            ===================================== */}

            <Card
                className="my-4 p-4"
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "15px"
                }}
            >

                <h5>
                    💳 Saved Cards
                </h5>


                <hr />


                {stripeCards &&
                stripeCards.length > 0 ? (

                    stripeCards.map(
                        (cardData) => (

                            <div
                                key={cardData.id}
                                className="mb-3"
                            >

                                <Card
                                    className="p-3"
                                    style={{
                                        border:
                                            "1px solid #C6ACE7",
                                        borderRadius:
                                            "12px"
                                    }}
                                >


                                    {/* CARD NUMBER */}

                                    <p>

                                        <b>
                                            Card Number:
                                        </b>{" "}

                                        XXXX XXXX XXXX{" "}

                                        {cardData.card_number
                                            ? cardData.card_number.slice(-4)
                                            : "----"}

                                    </p>


                                    {/* CARD DETAILS */}

                                    {showCardDetails(
                                        cardData
                                    )}


                                    {/* BUTTONS */}

                                    <div>

                                        <button
                                            type="button"
                                            onClick={() => {

                                                setCardDetails(
                                                    true
                                                )

                                                setCardDetailsId(
                                                    cardData.id
                                                )

                                            }}
                                            className="btn btn-sm btn-outline-primary"
                                        >

                                            Show Card Details

                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                payWithSavedCard(
                                                    cardData
                                                )
                                            }
                                            className="ml-2 btn btn-sm btn-outline-success"
                                        >

                                            Pay with this Card

                                        </button>

                                    </div>


                                </Card>


                                {/* EDIT CARD */}

                                <span

                                    onClick={() =>
                                        history.push(
                                            "/stripe-card-details/"
                                        )
                                    }

                                    style={{
                                        cursor: "pointer"
                                    }}

                                >

                                    <i
                                        title="Edit card"
                                        className="fas fa-edit fa-lg edit-button-css mr-2"
                                    ></i>

                                </span>


                            </div>

                        )

                    )

                ) : (

                    <p className="text-muted mb-0">
                        No saved card.
                    </p>

                )}

            </Card>

        </div>

    )

}


export default CreateCardComponent

