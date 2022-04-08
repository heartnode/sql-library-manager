'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init({
    title:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{
          msg: '"Title" is required.'
        },
        notEmpty:{
          msg: '"Title" is required.'
        }
      }
    },
    author:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{
          msg: '"Author" is required.'
        },
        notEmpty:{
          msg: '"Author" is required.'
        }
      }
    }, 
    genre:{
      type: DataTypes.STRING,
      allowNull: true,
      /*
      validate:{
        notNull: {
          msg: '"Genre" is required.',
        },
        notEmpty:{
          msg: '"Genre" is required.',
        }
      }
      */
    }, 
    year:{
      type:DataTypes.INTEGER,
      allowNull: true,
      /*
      validate:{
        notNull: {
          msg: '"Year" is required.',
        },
        notEmpty:{
          msg: '"Year" is required.'
        }
      }
      */
    } 
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};