import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal"
import { FaStar } from "react-icons/fa"
import './PostReviewModal.css'
import { fetchCreateReview } from "../../store/reviews"


const PostReviewModal = ({ spotId }) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    let starSelect = [1, 2, 3, 4, 5]
    const [currSelection, setCurrSelection] = useState(0)
    const [hover, setHover] = useState(0)
    const [newReview, setNewReview] = useState('')
    const [firstName, setFirstName] = useState('')
    const [errors, setErrors] = useState({})
    spotId = +spotId
    const user = useSelector(state => state.session.user)
    errors
    const disabled = newReview.length < 10 || currSelection === 0;

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (user) setFirstName(user.firstName)
        let review = {
            User: { firstName: firstName },
            spotId: spotId,
            userId: user.id,
            review: newReview,
            stars: currSelection,
        }
        await dispatch(fetchCreateReview(spotId, review, user))
            .catch(async (res) => {
                let data = await res.json()
                if (data && data.errors) setErrors(data.errors)
            })
        closeModal()
    }

    return (
        <div>
            <form className="post-review" onSubmit={handleSubmit}>
                <h3>How was your Stay?</h3>

                <textarea className="review-text" value={newReview}
                    onChange={e => setNewReview(e.target.value)}
                    rows="7" cols="30" placeholder="Leave your review here...">
                </textarea>
                <div className="star-rating">
                    {starSelect.map(selection => {
                        return <div key={selection}
                            className={currSelection >= selection || hover >= selection ? "filled" : "empty"}
                            onMouseEnter={() => setHover(selection)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setCurrSelection(selection)}
                        >
                            <FaStar />
                        </div>
                    })}
                    Stars
                </div>
                <button className="review-button" disabled={disabled}>Submit Your Review</button>
            </form>
        </div>
    )
}

export default PostReviewModal
