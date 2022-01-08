const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    houseno: {
        type: Number,
        required: true

    },
    street: {
        type: String,
        required:true

    },
    city: {
        type: String,
        required:true

    },
    state: {
        type:String,
        required:true

    },
    zip: {
        type: Number,
        required:true

    }

})
const userSchema = new mongoose.Schema({

    id:{
        type: Number,
        required: true

    },
    username: {
        type: String,
        required: true

    },
    email:{
        type: String,
        required: true

    },
    password:{
        type: String,
        required: true

    },
    address :{
        type: mongoose.Schema.Types.ObjectId ,
        ref : 'Address',
        required: true

    }
})

// export

// module.exports = mongoose.model('User',foodSchema)
const Address = mongoose.model('Address',addressSchema)
const User = mongoose.model('User',userSchema)

module.exports = [Address, User]

