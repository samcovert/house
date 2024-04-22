import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSpots } from "../../store/spots"
import { NavLink } from "react-router-dom"
import './LandingPage.css'


const LandingPage = () => {
    const dispatch = useDispatch()
    const allSpots = useSelector((state) => state.spots)
    const spots = Object.values(allSpots)

    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch])
    return (
        <main className="landing">
            {spots.map(spot => (
                <NavLink key={spot.name} to={`spots/${spot.id}`} title={spot.name}>
                    <div>
                        <img src={`${spot.previewImage}`}></img>
                    </div>
                    <div className="spot-details">
                        <div className="city">
                            {spot.city}, {spot.state}
                        </div>
                        <div className="rating">
                            {spot.avgRating > 0 ? `⭐️${parseInt(spot.avgRating).toFixed(1)}` : "⭐️New"}
                        </div>
                        </div>
                        <div className="landing-page-price">
                            ${spot.price} night
                        </div>

                </NavLink>
            ))}
        </main>
    )
}


export default LandingPage
