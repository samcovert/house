

const GET_ALL_SPOTS = '/spots/GET_ALL_SPOTS'

const getAllSpots = spots => {
    return {
        type: GET_ALL_SPOTS,
        spots
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

const initialState = {}
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const spotsState = { ...state }
            action.spots.Spots.forEach(spot => (spotsState[spot.id] = spot))
            return spotsState
        }
        default:
            return state
    }
}

export default spotsReducer
