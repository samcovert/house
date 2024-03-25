'use strict';

const { SpotImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await SpotImage.bulkCreate(//options,
    [
      {
        spotId: 1,
        url: 'https://samsclub13.s3.us-west-2.amazonaws.com/phxhouse.jpeg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://samsclub13.s3.us-west-2.amazonaws.com/crunkcreek.jpeg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://samsclub13.s3.us-west-2.amazonaws.com/cliffhanger.jpeg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://samsclub13.s3.us-west-2.amazonaws.com/phxhouse2.jpeg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://samsclub13.s3.us-west-2.amazonaws.com/phxhouse3.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://samsclub13.s3.us-west-2.amazonaws.com/crunkcreek2.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://samsclub13.s3.us-west-2.amazonaws.com/crunkcreek3.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://samsclub13.s3.us-west-2.amazonaws.com/cliffhanger2.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://samsclub13.s3.us-west-2.amazonaws.com/cliffhanger3.jpeg',
        preview: false
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['picture.jpeg', 'house.jpeg', 'housepic.jpeg']}
    }, {})
  }
};
