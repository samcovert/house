import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchNewSpot } from "../../store/spots"
import { useNavigate } from "react-router-dom"
import './CreateNewSpot.css'


const CreateNewSpot = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [img, setImg] = useState('')
    const [img2, setImg2] = useState('')
    const [img3, setImg3] = useState('')
    const [lat, setLat] = useState(0)
    const [lng, setLng] = useState(0)
    const [errors, setErrors] = useState({})
    const user = useSelector(state => state.session.user)


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
        if (img.length === 0) validationErrors.img = 'Preview image is required'
        // if (!img.endsWith('.png') || !img.endsWith('.jpg') || !img.endsWith('.jpeg')) validationErrors.img = 'Image URL must end in .png, .jpg, or .jpeg'
        // if (!img2.endsWith('.png') || !img2.endsWith('.jpg') || !img2.endsWith('.jpeg')) validationErrors.img2 = 'Image URL must end in .png, .jpg, or .jpeg'
        // if (!img3.endsWith('.png') || !img3.endsWith('.jpg') || !img3.endsWith('.jpeg')) validationErrors.img3 = 'Image URL must end in .png, .jpg, or .jpeg'
        if (Object.values(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        } else {
            const payload = {
                ownerId: user.id,
                country: country,
                address: address,
                city: address,
                state: state,
                description: description,
                name: name,
                price: price,
                lat: lat,
                lng: lng,
            }
            const newSpot = await dispatch(fetchNewSpot(payload))

            if (newSpot) {
                navigate(`/spots/${newSpot.id}`)

            }
        }
    }

    return (
        <>
            <h1>Create A New Spot</h1>
            <h2>Where&apos;s your place located?</h2>
            <p>Guests will only get your exact address once they booked a reservation.</p>
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
                <label>
                    City
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                    />
                    {errors.city && <p className="errors">{errors.city}</p>}
                </label>
                <label>
                    State
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                    />
                    {errors.state && <p className="errors">{errors.state}</p>}
                </label>
                <label>
                    Latitude
                    <input
                        type="text"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder="Latitude"
                    />
                </label>
                <label>
                    Longitude
                    <input
                        type="text"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        placeholder="Longitude"
                    />
                </label>
                <h2>Describe your place to guests</h2>
                <p>Mention the best features of your space, any special amentities like
                    fast wifi or parking, and what you love about the neighborhood</p>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please write at least 30 characters"
                />
                {errors.description && <p className="errors">{errors.description}</p>}
                <h2>Create a title for your spot</h2>
                <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name of your spot"
                />
                {errors.name && <p className="errors">{errors.name}</p>}
                <h2>Set a base price for your spot</h2>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <label>
                    $
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price per night (USD)"
                    />
                    {errors.price && <p className="errors">{errors.price}</p>}
                </label>
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
                <button
                type="submit"
                >Create Spot</button>
            </form>
        </>
    )
}

export default CreateNewSpot
