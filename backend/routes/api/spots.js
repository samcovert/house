const express = require('express');
const { Spot } = require('../../db/models');
const router = express.Router();


router.get('/', async (req, res, next) => {
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


module.exports = router;
