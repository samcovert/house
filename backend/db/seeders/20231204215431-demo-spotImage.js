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
        url: '../../images/phxhouse.jpeg',
        preview: true
      },
      {
        spotId: 2,
        url: '../../images/crunkcreek.jpeg',
        preview: true
      },
      {
        spotId: 3,
        url: '../../images/cliffhanger.jpeg',
        preview: true
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
