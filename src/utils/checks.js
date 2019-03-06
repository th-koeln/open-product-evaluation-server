const propertyExists = (object, property) =>
  Object.prototype.hasOwnProperty.call((object.toObject) ? object.toObject() : object, property)

const valueExists = (object, property) =>
  propertyExists(object, property)
  && object[property] !== null

const stringExists = (object, property) =>
  valueExists(object, property)
  && object[property] !== ''

const arrayExists = (object, property) =>
  valueExists(object, property)
  && object[property].length > 0

module.exports = Object.freeze({
  propertyExists,
  valueExists,
  stringExists,
  arrayExists,
})
