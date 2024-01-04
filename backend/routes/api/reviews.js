const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();


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
                model: Spot
            },
            {
                model: ReviewImage
            }
        ]
    })
    return res.json({ reviews })
})

// Add an image to a review based on the reviews id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const { url } = req.body;

    const review = await Review.findByPk(`${reviewId}`);
    if (!review) {
        const err = new Error("Review couldn't be found")
        err.status = 404;
        next(err)
    }
    const numImages = await ReviewImage.count({
        where: {
            reviewId: reviewId
        }
    })
    if (numImages > 10) {
        const err = new Error("Maximum number of images for this resource was reached")
        err.status = 403
        next(err)
    } else {
        const newImage = await ReviewImage.create({
            reviewId: reviewId,
            url: url
        })
        return res.json(newImage)
    }
})

// Edit a review
router.put('/:reviewId', requireAuth, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const { review, stars } = req.body

    try {
        const findReview = await Review.findByPk(`${reviewId}`)
        if (!findReview) {
            const err = new Error("Review couldn't be found")
            err.status = 404
            next(err)
        } else if (review.length === 0) {
            res.status(400).json({
                "message": "Bad Request",
                "errors": "Review text is required"
            })
        } else if (isNaN(stars) || stars < 0 || stars > 5) {
            res.status(400).json({
                "message": "Bad Request",
                "errors": "Stars must be an integer from 1 to 5"
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

    const deleteReview = await Review.findByPk(`${reviewId}`)
    if (!deleteReview) {
        const err = new Error("Review couldn't be found")
        err.status = 404
        next(err)
    } else {
        await deleteReview.destroy()
        return res.json({
            "message": "Successfully deleted"
        })
    }
})


module.exports = router
