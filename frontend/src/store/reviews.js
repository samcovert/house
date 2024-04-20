import { csrfFetch } from "./csrf";
import { fetchSpotDetails } from "./spots";


const GET_REVIEWS = 'reviews/GET_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
const DELETE = '/reviews/DELETE'

const getReviews = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
}

const createReview = (review) => {
    return {
        type: CREATE_REVIEW,
        review
    }
}


const deleteReview = (reviewId) => {
    return {
        type: DELETE,
        reviewId
    }
}

export const fetchReviews = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`)

    if (res.ok) {
        const reviews = await res.json();
        dispatch(getReviews(reviews.Reviews))
        return reviews
    }
}

export const fetchCreateReview = (spotId, review, user) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(review),
        headers: { "Content-Type": "application/json" }
    })

    if (res.ok) {
        const newReview = await res.json()
        newReview.spotId = +spotId
        const reviewData = {
            ...newReview,
            User: user
        }
        dispatch(createReview(reviewData))
        dispatch(fetchSpotDetails(spotId))
        return reviewData
    }
}

export const fetchDeleteReview = (reviewId, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        let review = await res.json()
        dispatch(deleteReview(reviewId))
        dispatch(fetchSpotDetails(spotId))
        return review
    }
}

const initialState = {}
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEWS: {
            const reviewsState = { ...state }
            action.reviews.forEach(review => reviewsState[review.id] = review)
            return reviewsState
        }
        case CREATE_REVIEW: {
            const newState = {
                ...state,
                [action.review.id]: action.review
            }
            return newState
        }
        case DELETE: {
            const newState = { ...state };
            delete newState[action.reviewId]
            return newState;
        }
        default:
            return state
    }
}

export default reviewsReducer
