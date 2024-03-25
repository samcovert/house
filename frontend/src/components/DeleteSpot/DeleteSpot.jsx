import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { fetchDeleteSpot } from "../../store/spots"
import { useState } from "react"


const DeleteSpot = ({ spotId }) => {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({})

    const handleClick = (e) => {
        e.preventDefault()
        setErrors({})
        dispatch(fetchDeleteSpot(spotId))
            .then(closeModal)
            .catch(async (res) => {
                let data = await res.json()
                if (data && data.errors) setErrors(data.errors)
            })
    }
    return (
        <>
            <form className="delete-spot-form">
                <div>
                    <h3>Confirm Delete</h3>
                    <p>Are you sure you want to remove this spot from the listings?</p>
                    {errors.message && (
                        <div>{errors}</div>
                    )}
                    <div>
                        <button onClick={handleClick} className="delete-button">Yes (Delete Spot)</button>
                        <button onClick={closeModal} className="cancel-button">No (Keep Spot)</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default DeleteSpot
