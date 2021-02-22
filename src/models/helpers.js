const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = {
    createModel: newModelFields => {
        const Model = new Schema({
            ...newModelFields,
            created_at: {
                type: Date,
                default: Date.now
            },
            updated_at: {
                type: Date,
                default: Date.now
            }
        });
    
        Model.pre('save', function (next) {
            this.updated_at = Date.now();
    
            next();
        });
    
        return Model;
    }
}