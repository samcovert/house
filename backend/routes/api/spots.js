const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { Op } = require("sequelize")


// Get all spots
router.get('/', requireAuth, async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
            attributes: [
                'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 'avgRating', 'previewImage'
            ]
        })
        res.json({spots})
    } catch(err) {
        console.error(err)
        next(err)
    }
})

// Get all spots owned by the current user
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;

    const spot = await Spot.findAll({
        where: { ownerId: userId }
    })
    return res.json(spot)
})


// Get details of a spot by spotId
router.get('/:spotId', requireAuth, async (req, res, next) => {
    const id = req.params.spotId;

   const spot = await Spot.findByPk(`${id}`);
        if (!spot) {
            res.status(404).json({
                message: "Spot couldn't be found"
            })
        } else {
            return res.json(spot)
        }
})

// Create a spot
router.post('/', requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const userId = req.user.id;

    try{
    const newSpot = Spot.build({
        ownerId: userId,
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
    })
    await newSpot.save();
    return res.status(201).json(newSpot)
    } catch(err) {
            console.error(err)
            next(err)
        }
})

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(`${spotId}`);
    if (!spot) {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        next(err)
    } else {
        const newImage = await SpotImage.create({
            url,
            preview
        })
        return res.json(newImage)
    }
})

// Edit a spot
router.put('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const { address, city, state, country, lat, lng, name, description } = req.body
    try {
        const spot = await Spot.findByPk(spotId)
        if (!spot) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            next(err)
        } else {
            spot.set({
                address: address,
                city: city,
                state: state,
                country: country,
                lat: lat,
                lng: lng,
                name: name,
                description: description
            })
            await spot.save()
            return res.json(spot)
        }
    } catch(err) {
        console.error(err)
        next(err)
    }
})

// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findByPk(`${spotId}`)
    if (!spot) {
        const err = new Error("Spot couldn't be found")
        err.status = 404
        next(err)
    } else {
        await spot.destroy()
        return res.json({
            "message": "Successfully deleted"
        })
    }
})

// Get all reviews by a spot id
router.get('/:spotId/reviews', async (req, res, next) => {
    const spotId = req.params.spotId

    const spot = await Spot.findByPk(`${spotId}`);
    if (!spot) {
        const err = new Error("Spot couldn't be found")
        err.status = 404
        next(err)
    } else {
        const reviews = await Review.findAll({
            where: { spotId: spotId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        })
        return res.json(reviews)
    }
})

// Create a review for a spot based on the spots id
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId
    const userId = req.user.id
    const { review, stars } = req.body

    try {
        const spot = await Spot.findByPk(`${spotId}`);
        const reviews = await Review.findAll({
            where: {
                userId: userId,
                spotId: spotId
            }
        })
        if (!spot) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            next(err)
        } else if (reviews.length) {
            const err = new Error("User already has a review for this spot")
            err.status = 500
            next(err)
        } else {
            const newReview = await Review.create({
                userId: userId,
                spotId: spotId,
                review: review,
                stars:stars
            })
            return res.status(201).json(newReview)
        }
    } catch(err) {
        console.error(err)
        next(err)
    }
})

// Get all bookings for a spot based on spots id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;

    const spot = await Spot.findByPk(`${spotId}`);
    if (!spot) {
        const err = new Error("Spot couldn't be found")
        err.status = 404
        next(err)
    } else if (spot.ownerId === userId) {
        const ownerBooking = await Booking.findAll({
            where: {
                userId: userId
            },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        })
        return res.json(ownerBooking)
    } else {
        const booking = await Booking.findAll({
            where: {
                spotId: spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })
        return res.json(booking)
    }
})

// Create a booking from a spot based on the spots id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId
    const userId = req.user.id
    const { startDate, endDate } = req.body

    const spot = await Spot.findByPk(`${spotId}`)
    if (!spot) {
        const err = new Error("Spot couldn't be found")
        err.status = 404
        next(err)
    }
    try{
        const bookings = await Booking.findAll({
            where: { spotId: spotId }
        })

        bookings.forEach(booking => {
            if (endDate >= booking.startDate && startDate <= booking.endDate) {
                return res.status(403).json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "errors": {
                      "startDate": "Start date conflicts with an existing booking",
                      "endDate": "End date conflicts with an existing booking"
                    }
                  })
            }
        })

        const validBooking = await Booking.create({
            spotId: spotId,
            userId: userId,
            startDate: startDate,
            endDate: endDate
        })
        return res.json(validBooking)

    } catch(err) {
        console.error(err)
        next(err)
    }
})




module.exports = router;
