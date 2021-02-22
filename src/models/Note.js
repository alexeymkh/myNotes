const mongoose = require('mongoose');

const {
    createModel
} = require('./helpers');

const Note = createModel({
    text: {
        type: String,
        required: true,
        maxlength: 1000,
    },
});

module.exports = mongoose.model('Note', Note);