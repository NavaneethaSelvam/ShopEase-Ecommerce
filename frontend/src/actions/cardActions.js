import {
    CARD_CREATE_REQUEST,
    CARD_CREATE_SUCCESS,
    CARD_CREATE_FAIL,

    CHARGE_CARD_REQUEST,
    CHARGE_CARD_SUCCESS,
    CHARGE_CARD_FAIL,

    SAVED_CARDS_LIST_REQUEST,
    SAVED_CARDS_LIST_SUCCESS,
    SAVED_CARDS_LIST_FAIL,

    DELETE_SAVED_CARD_REQUEST,
    DELETE_SAVED_CARD_SUCCESS,
    DELETE_SAVED_CARD_FAIL,

    UPDATE_STRIPE_CARD_REQUEST,
    UPDATE_STRIPE_CARD_SUCCESS,
    UPDATE_STRIPE_CARD_FAIL,

} from '../constants/index'

import axios from 'axios'


// Render Backend URL
const API_URL = "https://shopease-backend-5flz.onrender.com"


// ======================================================
// CREATE CARD
// ======================================================

export const createCard = (cardData) => async (dispatch, getState) => {

    try {

        dispatch({
            type: CARD_CREATE_REQUEST
        })

        const {
            userLoginReducer: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
                "Card-Number": cardData.cardNumber,
            }
        }

        const { data } = await axios.post(
            `${API_URL}/payments/create-card/`,
            {
                email: cardData.email,
                number: cardData.cardNumber,
                exp_month: cardData.expMonth,
                exp_year: cardData.expYear,
                cvc: cardData.cvc,
                save_card: cardData.saveCard
            },
            config
        )

        dispatch({
            type: CARD_CREATE_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: CARD_CREATE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message
        })
    }
}


// ======================================================
// CHARGE CUSTOMER
// ======================================================

export const chargeCustomer = (cardData) => async (dispatch, getState) => {

    try {

        dispatch({
            type: CHARGE_CARD_REQUEST
        })

        const {
            userLoginReducer: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            `${API_URL}/payments/charge-customer/`,
            cardData,
            config
        )

        dispatch({
            type: CHARGE_CARD_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: CHARGE_CARD_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message
        })
    }
}


// ======================================================
// SAVED CARDS LIST
// ======================================================

export const savedCardsList = () => async (dispatch, getState) => {

    try {

        dispatch({
            type: SAVED_CARDS_LIST_REQUEST,
        })

        const {
            userLoginReducer: { userInfo }
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(
            `${API_URL}/account/stripe-cards/`,
            config
        )

        dispatch({
            type: SAVED_CARDS_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: SAVED_CARDS_LIST_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message
        })
    }
}


// ======================================================
// UPDATE STRIPE CARD
// ======================================================

export const updateStripeCard = (cardData) => async (dispatch, getState) => {

    try {

        dispatch({
            type: UPDATE_STRIPE_CARD_REQUEST
        })

        const {
            userLoginReducer: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            `${API_URL}/payments/update-card/`,
            cardData,
            config
        )

        dispatch({
            type: UPDATE_STRIPE_CARD_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: UPDATE_STRIPE_CARD_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message
        })
    }
}


// ======================================================
// DELETE SAVED CARD
// ======================================================

export const deleteSavedCard = (card_number) => async (dispatch, getState) => {

    try {

        dispatch({
            type: DELETE_SAVED_CARD_REQUEST,
        })

        const {
            userLoginReducer: { userInfo }
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            `${API_URL}/payments/delete-card/`,
            {
                card_number: card_number
            },
            config
        )

        dispatch({
            type: DELETE_SAVED_CARD_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: DELETE_SAVED_CARD_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message
        })
    }
}