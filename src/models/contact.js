const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        unique: false,
        required: false,
        trimg: true,
        validate(value) {
            if(value.length > 5) {
                throw new Error("The title cannot be longer than 5 characters.");
            }
        }
    },
    phone: {
        type: String,
        unique: false,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isMobilePhone(value)){
                throw new Error("This is not a valid phone number!");
            }
        }
    },

},{
    timestamps: true
});

const Contact = new mongoose.model('Contact', contactSchema);

module.exports = Contact;