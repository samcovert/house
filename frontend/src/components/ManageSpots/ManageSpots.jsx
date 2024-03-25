import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrSpots } from "../../store/spots"
import { NavLink } from "react-router-dom"
import OpenModalButton from "../OpenModalButton"
import DeleteSpot from "../DeleteSpot"


const ManageSpots = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const spots = useSelector(state => state.spots)
    const spotList = Object.values(spots)
    const ownerSpots = []
    spotList.forEach((spot) => {
        if (spot.ownerId === user.id) ownerSpots.push(spot)
    })

    useEffect(() => {
        dispatch(fetchCurrSpots())
    }, [dispatch])

    if (ownerSpots.length === 0) {
        return (
            <NavLink to={`/spots/new`}>
                <button>Create a new Spot</button>
            </NavLink>
        )
    }
    return (
        <>
        <main className="manage-spots">
            <h1>Manage Spots</h1>
            {ownerSpots.map(spot => (
                <>
                <NavLink key={spot.name} to={`/spots/${spot.id}`}>
                    <div>
                        <img src={`${spot.previewImage}`}></img>
                    </div>
                    <div className="spot-details">
                        <span className="city">
                            {spot.city}, {spot.state}
                        </span>
                        <span className="rating">
                            ⭐️{spot.avgRating}
                        </span>
                    </div>
                    <div className="price">
                        ${spot.price}
                    </div>
                </NavLink>
                <NavLink to={`/spots/${spot.id}/edit`}>
                    <button>Update</button>
                </NavLink>
                <OpenModalButton
                buttonText='Delete'
                modalComponent={<DeleteSpot spotId={spot.id}/>}
                />
                </>
            ))}
        </main>
        </>
    )
}

export default ManageSpots
