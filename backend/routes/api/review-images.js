const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Delete a review image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const imageId = req.params.imageId;
    const user = req.user.id

    const image = await ReviewImage.findByPk(imageId)
    const review = await Review.findAll({
        where: { id: image.reviewId }
    })
    if (!image || !review) {
        return res.status(404).json({
            message: "Review Image couldn't be found"
        })
    } else if (review.userId !== user) {
        return res.status(403).json({
            message: "Forbidden"
        })
    } else {
        await image.destroy()
        return res.json({
            "message": "Successfully deleted"
        })
    }
})



module.exports = router
