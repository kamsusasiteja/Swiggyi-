const express = require('express')
const handler = express.Router() //handler is the name of the express router object that we created
const [Address, User] = require('./models/usermodel')
const Food = require('./models/foodmodel')

// To register a single user

handler.post('/register', async (req, res) => {
    const { address, ...userInfo } = req.body
    const addressModelInstance = new Address(address)
    try {

        const saveAddress = await addressModelInstance.save()
        const userModelInstance = new User({ ...userInfo, address: saveAddress._id })

        const saveUser = await userModelInstance.save()
        const savedUserInfo = await User.findById(saveUser._id).select('-_id -__v').populate('address', '-_id -__v')

        res.json(savedUserInfo)

    } catch (err) {
        res.send('Address Error' + err)
    }

})

// Authenticate
handler.post('/authenticate', async (req, res) => {
    const valid = await User.findOne({ username: req.body.username, password: req.body.password })
    if (valid) {
        res.json({ "Message": "User Logged in Successfully" })
    }
    res.status(403);
    res.send();
})




//update a record
handler.put('/users', async (req, res) => {
    const result = await User.findOne({ id: req.body.id })
    if (!result) {
        res.json({ "Message": `Sorry user with ID ${req.body.id} not found ` })
    }
    else {

        const { address, ...requestBodyWithoutAddress } = req.body //... spread oper.. 
        const updateResult = await Address.findByIdAndUpdate(result.address.toString(), address, { new: true })
        const updateUser = await User.findByIdAndUpdate(result._id, { ...requestBodyWithoutAddress, address: updateResult._id }, { new: true }).populate('address')
        res.json(updateUser)
    }

})



// To get all the users
//send async req always to not block your process
handler.get('/users', async (req, res) => {
    try {
        const user = await User.find().populate('address')
        res.json(user)
    } catch (err) {
        res.send('Error' + err)
    }
})


//To get user by ID

handler.get('/users/:userID', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.userID }).populate('address')
        if (!user) {
            res.json({ "Message": `Sorry user with ID ${req.params.userID} not found ` })
        }
        else {
            res.json(user)
        }
    } catch (err) {
        res.send('Error' + err)
    }
})

// To delete by ID

handler.delete('/users/:userID', async (req, res) => {
    try {
        const deleteResult = await User.deleteOne({ id: req.params.userID })
        if (deleteResult.deletedCount === 0) {
            res.json({ "Message": `Sorry user with ID ${req.params.userID} not found ` })
        }
        else {
            res.json({ "Message": "User Deleted Successfully" })
        }
    } catch (err) {
        res.send('Error' + err)
    }
})


// To add new food into the system

handler.post('/food', async (req, res) => {
    const food = new Food({
        foodId: req.body.foodId,
        foodName: req.body.foodName,
        foodCost: req.body.foodCost,
        foodType: req.body.foodType
    })

    try {
        const newfood = await food.save()
        res.json(newfood)
    } catch (err) {
        res.send('Error' + err)
    }
})

//get all food

handler.get('/food', async (req, res) => {
    try {
        const user = await Food.find()
        res.json(user)
    } catch (err) {
        res.send('Error' + err)
    }
})

//To get food by ID

handler.get('/food/:foodID', async (req, res) => {
    try {
        const food = await Food.findOne({ id: req.params.foodID })
        if (!food) {
            res.json({ "Message": `Sorry user with ID ${req.params.foodID} not found ` })
        }
        else {
            res.json(food)
        }
    } catch (err) {
        res.send('Error' + err)
    }
})







//export the current module so that it will be avialble in app.js

module.exports = handler