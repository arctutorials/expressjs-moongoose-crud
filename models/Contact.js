const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: [true, "First name is required"],
        minLength: 3,
        maxLength: 20,
        trim: true,
        validate: {
            validator: function(value){
                const nameRegex = /^[a-zA-Z\s]*$/;
                return nameRegex.test(value);
            },
            message: "First name must container only alphabetic characters"
        }
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    emailAddress: {
        type: String,
        unique: [true, "Email address already exists"],
        required: true
    },
    age: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model("Contact", contactSchema);