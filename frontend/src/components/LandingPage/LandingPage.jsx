import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSpots } from "../../store/spots"
import { NavLink } from "react-router-dom"
import './LandingPage.css'


const LandingPage = () => {
    const dispatch = useDispatch()
    const allSpots = useSelector((state) => state.spots)
    const spots = Object.values(allSpots)
    console.log(spots)
    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch])

    return (
        <main className="landing">
            {spots.map(spot => (
                <NavLink key={spot.name} to={`spot/${spot.id}`}>
                    <div>
                        <img src={`${spot.previewImage}`}></img>
                    </div>
                    <div className="spot-details">
                        <span className="city">
                            {spot.city}, {spot.state}
                        </span>
                        <span className="rating">
                            {spot.avgRating}
                        </span>
                    </div>
                        <div className="price">
                            ${spot.price}
                        </div>
                </NavLink>
            ))}
        </main>
    )
}


export default LandingPage
