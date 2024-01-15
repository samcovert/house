'use strict';

const { Booking } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await Booking.bulkCreate(//options,
    [
      {
        spotId: 1,
        userId: 1,
        startDate: '2022-01-01',
        endDate: '2022-01-03'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2023-02-01',
        endDate: '2023-02-03'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2021-01-01',
        endDate: '2021-01-03'
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['2022-01-01', '2023-02-01', '2021-01-01']}
    }, {})
  }
};
