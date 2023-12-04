'use strict';

const { User, Spot, Review } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Reviews';
    await Review.bulkCreate(options, [
      {
        spotId: 1,
        userId: 1,
        review: 'good house',
        stars: 4
      },
      {
        spotId: 2,
        userId: 2,
        review: 'bad house',
        stars: 1
      },
      {
        spotId: 3,
        userId: 3,
        review: 'great house',
        stars: 5
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ['good house', 'bad house', 'great house']}
    }, {})
  }
};
