import { csrfFetch } from "./csrf"


const GET_ALL_SPOTS = '/spots/GET_ALL_SPOTS'
const GET_SPOT_DETAILS = '/spots/GET_SPOT_DETAILS'
const CREATE_NEW_SPOT = '/spots/CREATE_NEW_SPOT'
const UPDATE_SPOT = '/spots/UPDATE_SPOT'

const getAllSpots = spots => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}

const getSpotDetails = spot => {
    return {
        type: GET_SPOT_DETAILS,
        spot
    }
}

const createSpot = newSpot => {
    return {
        type: CREATE_NEW_SPOT,
        newSpot
    }
}

const updateSpot = updatedSpot => {
    return {
        type: UPDATE_SPOT,
        updatedSpot
    }
}


export const fetchSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots')

    if (res.ok) {
        const spots = await res.json()
        dispatch(getAllSpots(spots))
        return spots
    }
}

export const fetchSpotDetails = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`)

    if (res.ok) {
        const spot = await res.json()
        dispatch(getSpotDetails(spot))
        return spot
    }
}

export const fetchNewSpot = (data) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (res.ok) {
        const newSpot = await res.json()
        dispatch(createSpot(newSpot))
        return newSpot;
    }
}



export const fetchCurrSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current')

    if (res.ok) {
        const spots = await res.json()
        dispatch(getAllSpots(spots))
        return spots
    }
}

export const fetchUpdateSpot = (spotId, spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        body: JSON.stringify(spot)
    })
    if (res.ok) {
        const updatedSpot = await res.json()
        dispatch(updateSpot(updatedSpot))
        return updatedSpot
    }
}

export const fetchDeleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(fetchCurrSpots())
        return res
    }
}


const initialState = {}
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const spotsState = { ...state }
            action.spots.Spots.forEach(spot => (spotsState[spot.id] = spot))
            return spotsState
        }
        case GET_SPOT_DETAILS: {
            return {
                ...state,
                [action.spot.id]: action.spot
            }
        }
        case CREATE_NEW_SPOT: {
            return {
                ...state,
                [action.newSpot.id]: {
                    ...state[action.newSpot.id],
                    ...action.newSpot
                }
            }
        }
        case UPDATE_SPOT: {
            return {
                ...state,
                [action.updatedSpot.id]: {...state[action.updatedSpot]}
            }
        }
        default:
            return state
    }
}

export default spotsReducer
