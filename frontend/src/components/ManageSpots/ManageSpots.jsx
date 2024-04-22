import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrSpots } from "../../store/spots"
import { NavLink } from "react-router-dom"
import OpenModalButton from "../OpenModalButton"
import DeleteSpot from "../DeleteSpot"
import './ManageSpots.css'


const ManageSpots = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const spots = useSelector(state => Object.values(state.spots).filter((spot) => spot.ownerId === user.id))
    // const spotList = Object.values(spots).filter((spot) => spot.ownerId === user.id)
    // const ownerSpots = []
    // spotList.forEach((spot) => {
    //     if (spot.ownerId === user.id) ownerSpots.push(spot)
    // })

    useEffect(() => {
        dispatch(fetchCurrSpots())
    }, [dispatch])

    if (spots.length === 0) {
        return (
            <>
            <h1>Manage Spots</h1>
            <NavLink to={`/spots/new`}>
                <button className='manage-spots-create-spot-button'>Create a new Spot</button>
            </NavLink>
            </>
        )
    }
    return (
        <>
        <main className="manage-spots">
            <div className="header">
            <h1>Manage Spots</h1>
            </div>
            <div className="spot-cards">
            {spots.map(spot => (
                <div key={spot.id}className="card">
                <NavLink key={spot.name} to={`/spots/${spot.id}`}>
                    <div>
                        <img src={`${spot.previewImage}`}></img>
                    </div>
                    <div className="spot-details">
                        <span className="city">
                            {spot.city}, {spot.state}
                        </span>
                        <span className="rating">
                        ⭐️{spot.avgStarRating ? parseInt(spot.avgStarRating).toFixed(1) : "New"}
                        </span>
                    </div>
                    <div className="price">
                        ${spot.price} night
                    </div>
                </NavLink>
                <NavLink to={`/spots/${spot.id}/edit`}>
                    <button className="update">Update</button>
                </NavLink>
                <OpenModalButton
                buttonText='Delete'
                modalComponent={<DeleteSpot spotId={spot.id}/>}
                />
                </div>
            ))}
            </div>
        </main>
        </>
    )
}

export default ManageSpots
