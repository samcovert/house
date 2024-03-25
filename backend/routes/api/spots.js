const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { Op } = require("sequelize");
const { handleValidationErrors, validateSpot, validateReviews, validateQuery } = require('../../utils/validation');
const review = require('../../db/models/review');



// Get all spots
router.get('/', validateQuery, async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
    try {
        page = !page ? 1 : parseInt(page)
        size = !size ? 20 : parseInt(size)
        const pagination = {}

        if (page >= 1 && size >= 1) {
            pagination.limit = size
            pagination.offset = size * (page - 1)
        }
        page = +page
        size = +size
        maxLat = +maxLat
        minLat = +minLat
        maxLng = +maxLng
        minLng = +minLng
        maxPrice = +maxPrice
        minPrice = +minPrice

        const where = {}

        if (minLat) {
            where.lat = {
                [Op.gte]: [minLat]
            }
        }
        if (maxLat) {
            where.lat = {
                [Op.lte]: [maxLat]
            }
        }
        if (minLat && maxLat) {
            where.lat = {
                [Op.between]: [minLat, maxLat]
            }
        }
        if (minLng) {
            where.lng = {
                [Op.gte]: [minLng]
            }
        }
        if (maxLng) {
            where.lng = {
                [Op.lte]: [maxLng]
            }
        }
        if (minLng && maxLng) {
            where.lng = {
                [Op.between]: [minLng, maxLng]
            }
        }
        if (maxPrice) {
            where.price = {
                [Op.lte]: [maxPrice]
            }
        }
        if (minPrice) {
            where.price = {
                [Op.gte]: [minPrice]
            }
        }
        if (minPrice && maxPrice) {
            where.price = {
                [Op.between]: [minPrice, maxPrice]
            }
        }

        const spots = await Spot.findAll({
            include: [
                { model : Review },
                { model: SpotImage }
            ],
            where,
            ...pagination
        })
        let spotList = []
        spots.forEach(spot => {
            spotList.push(spot.toJSON())
        })
        spotList.forEach(spot => {
            spot.SpotImages.forEach(img => {
                if (img.preview === true) {
                    spot.previewImage = img.url
                }
            })
            if (!spot.previewImage) {
                spot.previewImage = 'No preview image found'
            }
            delete spot.SpotImages
        })
        spotList.forEach(spot => {
            let avg = 0
            spot.Reviews.forEach(review => {
                avg += review.stars
                avg = avg / spot.Reviews.length
                spot.avgRating = avg
            })
            if (!spot.avgRating) {
                spot.avgRating = 'No avgRating found'
            }
            delete spot.Reviews
        })
        res.json({
            Spots: spotList,
            page,
            size
        })
    } catch(err) {
        console.error(err)
        next(err)
    }
})

// Get all spots owned by the current user
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;

    const spots = await Spot.findAll({
        where: { ownerId: userId },
        include: [
            { model : Review },
            { model: SpotImage }
        ]
    })
    let spotList = []
        spots.forEach(spot => {
            spotList.push(spot.toJSON())
        })
        spotList.forEach(spot => {
            spot.SpotImages.forEach(img => {
                if (img.preview === true) {
                    spot.previewImage = img.url
                }
            })
            if (!spot.previewImage) {
                spot.previewImage = 'No preview image found'
            }
            // delete spot.Reviews
            delete spot.SpotImages
        })
        spotList.forEach(spot => {
            let avg = 0
            spot.Reviews.forEach(review => {
                avg += review.stars
                avg = avg / spot.Reviews.length
                spot.avgRating = avg
            })
            if (!spot.avgRating) {
                spot.avgRating = 'No avgRating found'
            }
            delete spot.Reviews
        })
        res.json({
            "Spots": spotList
        })
})


// Get details of a spot by spotId
router.get('/:spotId', async (req, res, next) => {
    const id = req.params.spotId;

   const spots = await Spot.findByPk(id, {
    include: [
        {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
        },
        {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
        }
    ]
   });
        if (!spots) {
            res.status(404).json({
                message: "Spot couldn't be found"
            })
        }
        const numReviews = await Review.count({
            where: { spotId: id }
        })
        const reviews = await Review.findAll({
            where: { spotId: id }
        })
        let avg = 0
        reviews.forEach(review => {
            avg += review.stars
        })
        avg = avg / reviews.length
        const spotList = []
        spotList.push(spots.toJSON())
        spotList.forEach(spot => {
            spot.numReviews = numReviews
            spot.avgStarRating = avg
        })
        return res.json(spotList[0])
})

// Create a spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const userId = req.user.id;

    if (!userId) {
        return res.status(403).json({
            message: forbidden
        })
    }
    try{
            const newSpot = await Spot.create({
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
            // await newSpot.save();
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
    const user = req.user.id

    const spot = await Spot.findByPk(`${spotId}`);
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    } else if (spot.ownerId !== user) {
        return res.status(403).json({
            message: "Forbidden"
        })
    } else {
        const newImage = SpotImage.build({
            spotId,
            url,
            preview
        })
        await newImage.save()
        const image = await SpotImage.findByPk(newImage.id, {
            attributes: ['id', 'url', 'preview']
        })
        return res.json(image)
    }
})

// Edit a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const spotId = req.params.spotId;
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const user = req.user.id

    try {
        const spot = await Spot.findByPk(spotId)
        if (!spot) {
            return res.status(404).json({
                "message": "Spot couldn't be found"
            })
        } else if (spot.ownerId !== user) {
            return res.status(403).json({
                message: "Forbidden"
            })
        } else {
            spot.set({
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
    const user = req.user.id

    const spot = await Spot.findByPk(`${spotId}`)
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    } else if (spot.ownerId !== user) {
        return res.status(403).json({
            message: "Forbidden"
        })
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
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
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
        return res.json({
            Reviews: reviews
        })
    }
})

// Create a review for a spot based on the spots id
router.post('/:spotId/reviews', requireAuth, validateReviews, async (req, res, next) => {
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
            return res.status(404).json({
                "message": "Spot couldn't be found"
            })
        } else if (reviews.length) {
            return res.status(500).json({
                "message": "User already has a review for this spot"
            })
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
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    } else if (spot.ownerId === userId) {
        const ownerBooking = await Booking.findAll({
            where: {
                spotId: spotId
            },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        })
        return res.json({
            Bookings: ownerBooking
        })
    } else {
        const booking = await Booking.findAll({
            where: {
                spotId: spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })
        return res.json({
            Bookings: booking
        })
    }
})

// Create a booking from a spot based on the spots id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId
    const userId = req.user.id
    const { startDate, endDate } = req.body
    const today = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    const spot = await Spot.findByPk(spotId)
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    } else if (spot.ownerId === userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    } else if (end <= today) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        })
    } else if (start < today && end <= start) {
        return res.status(400).json({
            message: "Bad request",
            errors: {
                startDate: "startDate cannot be in the past",
                endDate: "endDate cannot be on or before startDate"
            }
        })
    } else if (start < today) {
        return res.status(400).json({
            message: "Bad request",
            errors: {
                startDate: "startDate cannot be in the past"
            }
        })
    } else if (end <= start) {
        return res.status(400).json({
            message: "Bad request",
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
        })
    }
    try{
        const bookings = await Booking.findAll({
            where: { spotId: spotId }
        })

        bookings.forEach(booking => {
            if ((startDate >= booking.startDate && startDate <= booking.endDate) && (endDate >= booking.startDate && endDate <= booking.endDate)) {
                return res.status(403).json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "errors": {
                      "startDate": "Start date conflicts with an existing booking",
                      "endDate": "End date conflicts with an existing booking"
                    }
                })
            } else if (startDate >= booking.startDate && startDate <= booking.endDate) {
                return res.status(403).json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "errors": {
                      "startDate": "Start date conflicts with an existing booking"
                    }
                })
            } else if (endDate >= booking.startDate && endDate <= booking.endDate) {
                return res.status(403).json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "errors": {
                      "endDate": "End date conflicts with an existing booking"
                    }
                })
            } else if (startDate <= booking.startDate && endDate >= booking.endDate) {
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
