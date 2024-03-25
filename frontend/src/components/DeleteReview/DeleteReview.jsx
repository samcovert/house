import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { useState } from "react"
import { fetchDeleteReview } from "../../store/reviews"

const DeleteReview = ({ reviewId }) => {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({})

    const handleClick = (e) => {
        e.preventDefault()
        setErrors({})
        dispatch(fetchDeleteReview(reviewId))
            .then(closeModal)
            .catch(async (res) => {
                let data = await res.json()
                if (data && data.errors) setErrors(data.errors)
            })
    }
    return (
        <>
            <form className="delete-review-form">
                <div>
                    <h3>Confirm Delete</h3>
                    <p>Are you sure you want to delete this review?</p>
                    {errors.message && (
                        <div>{errors}</div>
                    )}
                    <div>
                        <button onClick={handleClick} className="delete-button">Yes (Delete Review)</button>
                        <button onClick={closeModal} className="cancel-button">No (Keep Review)</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default DeleteReview;
