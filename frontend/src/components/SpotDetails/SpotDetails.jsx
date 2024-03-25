import { useParams } from "react-router-dom"
import { fetchSpotDetails } from "../../store/spots"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../store/reviews";
import './SpotDetails.css';
import PostReviewModal from "../PostReview";
import OpenModalButton from '../OpenModalButton'
import DeleteReview from "../DeleteReview";

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch()
    const spot = useSelector((state) => state.spots[spotId])
    const [isLoaded, setIsLoaded] = useState(false)
    const reviews = useSelector((state) => state.reviews)
    const reviewList = Object.values(reviews)
    const review = []
    reviewList.forEach((currReview) => {
        if (currReview.spotId === +spotId){
            review.push(currReview)
        }})
    const months = ["Jan", "Feb", 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const session = useSelector((state) => state.session.user)
    const userHasReview = reviewList.find(currReview => currReview.userId === session.id)
    useEffect(() => {
        dispatch(fetchSpotDetails(spotId))
            .then(dispatch(fetchReviews(spotId)))
            .then(() => setIsLoaded(true))
    }, [dispatch, spotId, isLoaded])

    const handleClick = () => {
        alert("Feature Coming Soon...")
    }

    return (
        <>
               {isLoaded &&
                <main className="spot-details-page">
        <h1 className="spot-name">{spot.name}</h1>
        <div className="spot-details">{spot.city}, {spot.state}, {spot.country}</div>
        <div className="spot-images">
            {spot.SpotImages.map(img => (
                <ul key={spot.id}>
                    <img src={img.url}></img>
                </ul>
            ))}
        </div>
        <div className="spot-host">Hosted By {spot.Owner.firstName} {spot.Owner.lastName}</div>
        <div className="spot-descrition">{spot.description}</div>
        <div className="reserve-box">
            <span> ${spot.price} per night</span>
            <span> ⭐️{spot.avgStarRating ? parseInt(spot.avgStarRating).toFixed(1) : "New"}</span>
            <span> · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</span>
            <button onClick={handleClick}>Reserve</button>
        </div>
        <div className="reviews">
            <div className="review-modal">
                <span
                hidden={!session || spot.Owner.id === session.id || !userHasReview}
                >
                    <OpenModalButton
                    buttonText = 'Post Your Review'
                    modalComponent={<PostReviewModal spotId={spotId}/>}
                    />
                </span>
            </div>
            <span hidden={review.length !== 0 || (session.user && spot.Owner.id === session.id)}>
                Be the first to post a review!
            </span>
            <div className="review-data">
            <span> ⭐️{spot.avgStarRating ? parseInt(spot.avgStarRating).toFixed(1) : "New"}</span>
            <span> · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</span>
                {review && review.map((review, index) => (
                    <div key={index}>
                        <p>{review.firstName}</p>
                        <p>{months[new Date(review.createdAt).getMonth()]} {review.createdAt.split('-')[0]}</p>
                        <p>{review.review}</p>
                        <span hidden={review.userId !== session.id}>
                            <OpenModalButton
                            buttonText='Delete'
                            modalComponent={<DeleteReview reviewId={review.id}/>}
                            />
                        </span>
                    </div>
                ))}
            </div>
        </div>
        </main>}
        </>

    )
}

export default SpotDetails
