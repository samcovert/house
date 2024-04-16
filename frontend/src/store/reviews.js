import { csrfFetch } from "./csrf";


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

export const fetchCreateReview = (spotId, review) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(review),
        headers: { "Content-Type": "application/json" }
    })
    console.log(review)
    if (res.ok) {
        const newReview = await res.json()
        newReview.spotId = +spotId
        console.log(newReview)
        dispatch(createReview(newReview))
        return newReview
    }
}

export const fetchDeleteReview = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        let review = await res.json()
        dispatch(deleteReview(reviewId))
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
