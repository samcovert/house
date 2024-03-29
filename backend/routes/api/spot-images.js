const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Delete a spot image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const imageId = req.params.imageId;
    const user = req.user.id

    const image = await SpotImage.findByPk(imageId, {
        include: [
            { model: Spot }
        ]
    })
    if (!image) {
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        })
    } else if (image.Spot.ownerId !== user) {
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
