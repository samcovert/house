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
    let { spotId } = useParams();
    spotId = +spotId
    const dispatch = useDispatch()
    const spot = useSelector((state) => state.spots[spotId])
    const [isLoaded, setIsLoaded] = useState(false)
    const reviewList = useSelector((state) => state.reviews)
    const reviews = Object.values(reviewList).filter(review => review.spotId === +spotId)

    const months = ["Jan", "Feb", 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const session = useSelector((state) => state.session.user)
    const userHasReview = reviews.find(currReview => currReview.userId === session?.id)

    useEffect(() => {
        dispatch(fetchSpotDetails(+spotId))
            .then(dispatch(fetchReviews(+spotId)))
            .then(() => setIsLoaded(true))
    }, [dispatch, spotId])


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
                            <ul key={img.id}>
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
                                hidden={!session || spot.Owner.id === session?.id || userHasReview}
                            >
                                <OpenModalButton
                                    buttonText='Post Your Review'
                                    modalComponent={<PostReviewModal spotId={spotId}/>}
                                />
                            </span>
                        </div>
                        <span hidden={reviews.length !== 0 || (session.user && spot.Owner.id === session.id)}>
                            Be the first to post a review!
                        </span>
                        <div className="review-data">
                            <span> ⭐️{spot.avgStarRating ? parseInt(spot.avgStarRating).toFixed(1) : "New"}</span>
                            <span> · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</span>
                            {reviews && reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review) => (
                                <div key={review.id}>
                                    <p>{review.User.firstName}</p>
                                    <p>{months[new Date(review.createdAt).getMonth()]} {review.createdAt.split('-')[0]}</p>
                                    <p>{review.review}</p>
                                    <span hidden={review.userId !== session?.id}>
                                        <OpenModalButton
                                            buttonText='Delete'
                                            modalComponent={<DeleteReview reviewId={review.id} spotId={spotId} />}
                                        />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                }
        </>

    )
}

export default SpotDetails
