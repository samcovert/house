import { csrfFetch } from "./csrf"


const GET_ALL_SPOTS = '/spots/GET_ALL_SPOTS'
const GET_SPOT_DETAILS = '/spots/GET_SPOT_DETAILS'
const CREATE_NEW_SPOT = '/spots/CREATE_NEW_SPOT'
const UPDATE_SPOT = '/spots/UPDATE_SPOT'
const ADD_IMG = '/spots/ADD_IMG'
const DELETE_SPOT = '/spots/DELETE_SPOT'

const deleteSpot = spotId => {
    return {
        type: DELETE_SPOT,
        spotId
    }
}

const addImg = img => {
    return {
        type: ADD_IMG,
        img
    }
}

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

export const fetchAddImg = (spotId, img) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(img)
    })
    if (res.ok) {
        const newImg = await res.json()
        dispatch(addImg(newImg))
        return newImg
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
        dispatch(fetchSpots())
        return updatedSpot
    }
}

export const fetchDeleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        const spot = await res.json()
        dispatch(deleteSpot(spotId))
        dispatch(fetchSpots())
        return spot
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
        case ADD_IMG: {
            return {
            ...state,
            [action.img.spotId]: {
              ...state[action.img.spotId],
              SpotImages: [
                {
                  url: action.img.url,
                  preview: action.img.preview,
                  spotId: action.img.spotId,
                }
              ]
            }
          };
        }
        case DELETE_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId]
            return newState;
        }
        default:
            return state
    }
}

export default spotsReducer
