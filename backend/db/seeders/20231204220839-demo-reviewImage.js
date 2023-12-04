'use strict';

const { ReviewImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    await ReviewImage.bulkCreate(options, [
      {
        reviewId: 1,
        url: 'review.jpeg'
      },
      {
        reviewId: 2,
        url: 'image.jpeg'
      },
      {
        reviewId: 3,
        url: 'reviewimage.jpeg'
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['review.jpeg', 'image.jpeg', 'reviewimage.jpeg']}
    }, {})
  }
};
