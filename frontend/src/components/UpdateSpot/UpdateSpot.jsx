import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSpotDetails, fetchUpdateSpot } from "../../store/spots"
import { useNavigate, useParams } from "react-router-dom"
import './UpdateSpot.css'

const UpdateSpot = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const spot = useSelector(state => state.spots[spotId])
    const [isLoaded, setIsLoaded] = useState(false)
    const [country, setCountry] = useState(spot.country)
    const [address, setAddress] = useState(spot.address)
    const [city, setCity] = useState(spot.city)
    const [state, setState] = useState(spot.state)
    const [description, setDescription] = useState(spot.description)
    const [name, setName] = useState(spot.name)
    const [price, setPrice] = useState(spot.price)
    const [img, setImg] = useState('')
    const [img2, setImg2] = useState('')
    const [img3, setImg3] = useState('')
    const [lat, setLat] = useState(spot.lat)
    const [lng, setLng] = useState(spot.lng)
    const [errors, setErrors] = useState({})
    // const user = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(fetchSpotDetails(+spotId))
            .then(setIsLoaded(true))
    }, [dispatch, spotId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        let validationErrors = {}


        if (country.length === 0) validationErrors.country = 'Country is required'
        if (address.length === 0) validationErrors.address = 'Address is required'
        if (city.length === 0) validationErrors.city = 'City is required'
        if (state.length === 0) validationErrors.state = 'State is required'
        if (description.length < 30) validationErrors.description = 'Description needs to be a minimum of 30 characters'
        if (name.length === 0) validationErrors.name = 'Name is required'
        if (!price) validationErrors.price = 'Price is required'
        if (address.length === 0) validationErrors.address = 'Address is required'
        // if (img.length === 0) validationErrors.img = 'Preview image is required'
        // if (!img.endsWith('.png') || !img.endsWith('.jpg') || !img.endsWith('.jpeg')) validationErrors.img = 'Image URL must end in .png, .jpg, or .jpeg'
        // if (!img2.endsWith('.png') || !img2.endsWith('.jpg') || !img2.endsWith('.jpeg')) validationErrors.img2 = 'Image URL must end in .png, .jpg, or .jpeg'
        // if (!img3.endsWith('.png') || !img3.endsWith('.jpg') || !img3.endsWith('.jpeg')) validationErrors.img3 = 'Image URL must end in .png, .jpg, or .jpeg'

        if (Object.values(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        } else {
            const updatedSpot = {
                country,
                address,
                city,
                state,
                description,
                name,
                price,
                lat,
                lng,
            }
            const newSpot = await dispatch(fetchUpdateSpot(spotId, updatedSpot))
            if (newSpot) {
                navigate(`/spots/${newSpot.id}`)
            }
        }
    }
    return (
        <>
            {
                isLoaded &&
                <main className="update-spot-form">
                <div className="heading">
                    <h1>Update your Spot</h1>
                    <h2>Where&apos;s your place located?</h2>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Country
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="Country"
                            />
                        </label>
                        {errors.country && <p className="errors">{errors.country}</p>}
                        <label>
                            Street Address
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Address"
                            />
                            {errors.address && <p className="errors">{errors.address}</p>}
                        </label>
                        <label className="city">
                            City
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                            />
                            {errors.city && <p className="errors">{errors.city}</p>}
                        </label>
                        <label className="state">
                            State
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="State"
                            />
                            {errors.state && <p className="errors">{errors.state}</p>}
                        </label>
                        <label className="lat">
                            Latitude
                            <input
                                type="text"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                placeholder="Latitude"
                            />
                        </label>
                        <label className="lng">
                            Longitude
                            <input
                                type="text"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                placeholder="Longitude"
                            />
                        </label>
                        <div className="line"></div>
                        <h2>Describe your place to guests</h2>
                        <p>Mention the best features of your space, any special amentities like
                            fast wifi or parking, and what you love about the neighborhood</p>
                        <input className="description-box"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please write at least 30 characters"
                        />
                        {errors.description && <p className="errors">{errors.description}</p>}
                        <div className="line"></div>
                        <h2>Create a title for your spot</h2>
                        <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name of your spot"
                        />
                        {errors.name && <p className="errors">{errors.name}</p>}
                        <div className="line"></div>
                        <h2>Set a base price for your spot</h2>
                        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        <label>
                        <div className="price-input">
                            <div className="dollar-sign">
                            $
                            </div>
                            <input className="price-input-box"
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Price per night (USD)"
                            />
                            </div>
                            {errors.price && <p className="errors">{errors.price}</p>}
                        </label>
                        <div className="line"></div>
                        <h2>Liven up your spot with photos</h2>
                        <p>Submit a link to at least one photo to publish your spot.</p>
                        <input
                            type="text"
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                            placeholder="Preview Image URL"
                        />
                        {errors.img && <p className="errors">{errors.img}</p>}
                        <input
                            type="text"
                            value={img2}
                            onChange={(e) => setImg2(e.target.value)}
                            placeholder="Image URL"
                        />
                        {errors.img2 && <p className="errors">{errors.img2}</p>}
                        <input
                            type="text"
                            value={img3}
                            onChange={(e) => setImg3(e.target.value)}
                            placeholder="Image URL"
                        />
                        {errors.img3 && <p className="errors">{errors.img3}</p>}
                        <div className="line"></div>
                        <div className="create-spot-button-div">
                        <button className="create-spot-button"
                            type="submit"
                        >Update Spot</button>
                        </div>
                    </form>
                </main>
            }
        </>
    )
}

export default UpdateSpot
