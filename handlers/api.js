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

        res.status(201).json(savedUserInfo)

    } catch (err) {
        res.status(500).send('Internal Server Error')
    }

})

// Authenticate an User, Check id a User with a specific username & password exists or not
handler.post('/authenticate', async (req, res) => {
    try{
    const valid = await User.findOne({ username: req.body.username, password: req.body.password })
    if (valid) {
        res.json({ "Message": "User Logged in Successfully" })
    }
    res.status(403);
    res.send();
    }catch(err){
        res.status(500).send('Internal Server Error')
    }
})



// To get all the users
//send async req always to not block your process
handler.get('/users', async (req, res) => {
    try {
        const user = await User.find().select('-_id -__v').populate('address', '-_id -__v')
        res.json(user)
    } catch (err) {
        res.status(500).send('Internal Server Error')
    }
})



//To get user by ID

handler.get('/users/:userID', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.userID }).select('-_id -__v').populate('address', '-_id -__v')
        if (!user) {
            res.status(404).json({ "Message": `Sorry user with ID ${req.params.userID} not found ` })
        }
        else {
            res.json(user)
        }
    } catch (err) {
        res.status(500).send('Internal Server Error')
    }
})


//update a record
handler.put('/users', async (req, res) => {
    try{
    const result = await User.findOne({ id: req.body.id })
    if (!result) {
        res.status(404).json({ "Message": `Sorry user with ID ${req.body.id} not found ` })
    }
    else {

        const { address, ...requestBodyWithoutAddress } = req.body //... spread operator.. 
        const updateResult = await Address.findByIdAndUpdate(result.address.toString(), address, { new: true })
        const updateUser = await User
                                    .findByIdAndUpdate(
                                        result._id, 
                                        { ...requestBodyWithoutAddress, address: updateResult._id }, 
                                        { new: true })
                                    .select('-_id -__v')
                                    .populate('address', '-_id -__v')
        res.json(updateUser)
    }
    }catch(err){
        res.status(500).send('Internal Server Error')
    }

})



// To delete by ID

handler.delete('/users/:userID', async (req, res) => {
    try {
        const deleteResult = await User.deleteOne({ id: req.params.userID })
        if (deleteResult.deletedCount === 0) {
            res.status(404).json({ "Message": `Sorry user with ID ${req.params.userID} not found ` })
        }
        else {
            res.json({ "Message": "User Deleted Successfully" })
        }
    } catch (err) {
        res.status(500).send('Internal Server Error')
    }
})


// To add new food into the system
// Food Model instance is being created. .save() function saves data 
handler.post('/food', async (req, res) => {
    const food = new Food({
        foodId: req.body.foodId,
        foodName: req.body.foodName,
        foodCost: req.body.foodCost,
        foodType: req.body.foodType
    })

    try {
        const saveResult = await food.save() 
        const {_id,__v,...newfood} = saveResult._doc
        newfood.id=_id
        res.status(201).json(newfood)
    } catch (err) {
        res.status(500).send('Internal Server Error')
    }
})

//get all food

handler.get('/food', async (req, res) => {
    try {
        const food = await Food.find().select('-_id -__v')
        res.json(food)
    } catch (err) {
        res.status(500).send('Internal Server Error')
    }
})

//To get food by ID

handler.get('/food/:foodID', async (req, res) => {
    try {
        const food = await Food.findOne({ foodId: req.params.foodID }).exec()
        if (!food) {
            res.json({ "Message": `Sorry food not found ` })
        }
        else {
            const {_id,__v,...newfood} = food._doc
            newfood.id=_id
            res.json(newfood)
        }
    } catch (err) {
        res.status(500).send('Internal Server Error')
    }
})







//export the current module so that it will be avialble in app.js

module.exports = handler