"use strict"
const _ = require('lodash')

const getInfo = ({fields = [], data = {}}) => {
    return _.pick(data, fields)
}

module.exports = getInfo