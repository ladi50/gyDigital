const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fake: {
        type: Array,
        required: true
    }
});

const domain = mongoose.model("Domain", domainSchema);

module.exports = domain;