'use strict';

const { User, Spot, sequelize } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'Spots';
   await Spot.bulkCreate(//options,
   [
    {
      ownerId: 1,
      address: '123 north st',
      city: 'Phoenix',
      state: 'AZ',
      country: 'US',
      lat: '33.4484',
      lng: '112.0704',
      name: 'phx house',
      description: 'great house',
      price: '300'
    },
    {
      ownerId: 2,
      address: '321 south st',
      city: 'Albuquerque',
      state: 'NM',
      country: 'US',
      lat: '35.4484',
      lng: '108.0704',
      name: 'abq house',
      description: 'big house',
      price: '500'
    },
    {
      ownerId: 3,
      address: '111 west st',
      city: 'Albuquerque',
      state: 'NM',
      country: 'US',
      lat: '36.4484',
      lng: '111.0704',
      name: 'that one house',
      description: 'small house',
      price: '100'
    },
   ], { validate: true })

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['phx house', 'abq house', 'that one house'] }
    }, {})
  }
};
