const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { validateReviews } = require('../../utils/validation')

// Get all reviews of the current user
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id

    const reviews = await Review.findAll({
        where: { userId: userId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [
                    {
                    model: SpotImage,
                    attributes: ['preview', 'url']
                    }
                ]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })
    let reviewList = []
    reviews.forEach(review => {
        reviewList.push(review.toJSON())
    })
    reviewList.forEach(review => {
        const image = review.Spot.SpotImages
        image.forEach(img => {
            // console.log(img.preview)
            if (img.preview === true) {
            review.Spot.previewImage = img.url
            console.log(review)
            } else {
                review.Spot.previewImage = 'No preview image found'
            }
            delete review.Spot.SpotImages
        })
    })
    return res.json({
        Reviews: reviewList
    })
})

// Add an image to a review based on the reviews id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const { url } = req.body;
    const user = req.user.id

    const review = await Review.findByPk(reviewId);
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    } else if (review.userId !== user) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
    const numImages = await ReviewImage.count({
        where: {
            reviewId: reviewId
        }
    })
    if (numImages >= 10) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached"
        })
    } else {
        const newImage = ReviewImage.build({
            reviewId: reviewId,
            url: url
        })
        await newImage.save()
        const img = await ReviewImage.findByPk(newImage.id, {
            attributes: ['id', 'url']
        })
        return res.json(img)
    }
})

// Edit a review
router.put('/:reviewId', requireAuth, validateReviews, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const { review, stars } = req.body
    const user = req.user.id

    try {
        const findReview = await Review.findByPk(`${reviewId}`)
        if (!findReview) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        } else if (findReview.userId !== user) {
            return res.status(403).json({
                message: "Forbidden"
            })
        } else {
            findReview.set({
                review: review,
                stars: stars
            })
            await findReview.save()
            return res.json(findReview)
        }
    } catch(err) {
        console.error(err)
        next(err)
    }
})

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const reviewId = req.params.reviewId
    const user = req.user.id

    const deleteReview = await Review.findByPk(`${reviewId}`)
    if (!deleteReview) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    } else if (deleteReview.userId !== user) {
        return res.status(403).json({
            message: "Forbidden"
        })
    } else {
        await deleteReview.destroy()
        return res.json({
            "message": "Successfully deleted"
        })
    }
})


module.exports = router
