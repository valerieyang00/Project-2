const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const methodOverride = require("method-override")
router.use(methodOverride("_method"))
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')

//GET render a form to create new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs')
})

//POST /users -- create new user in the db

router.post('/', async (req, res) => {
    //create a new user
    try {
        // have to hash the password before creating new user
        const hashedPW = bcrypt.hashSync(req.body.password, 12)
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            },
            defaults: {
                password: hashedPW,
                name: req.body.name,
                city: req.body.city,
                state: req.body.state,
            }  
        })
        // if the user was found.... send them to login and let them know they already have an account
        if (!created) {
            console.log('user already exists')
            res.redirect('/users/login?message=This email already exists. Please log into your account to continue.')
        } else {
            //store new user's id as a cookie in the browser
            const encryptedUserId = crypto.AES.encrypt(newUser.id.toString(), process.env.ENC_SECRET)
            const encryptedUserIdString = encryptedUserId.toString() // have to stringify
            // res.cookie('key', value)
            res.cookie('userId', encryptedUserIdString)
            //redirect to the homepage
            if (req.files) {
                const photo = req.files.photo
                const filePath = path.join(__dirname, '..', "files", photo.name)
                photo.mv(filePath, (err) => {
                    console.log(err)
                })
                const addPhoto = await db.user.update({
                    photo: req.files.photo.name
                }, {where: {
                    email: req.body.email
                }})
            }
            res.redirect('users/profile')
        }
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})


// GET /users/login -- show a login from to user
router.get('/login', (req, res) => {
    res.render('users/login.ejs', {
        // if the req.query.message exist, pass it as message, otherwise pass in null
        // ternary operator (old syntax, shorthand for if/else)
        // condition ? expression if truthy : expression if falsy
        message: req.query.message ? req.query.message : null
    })
})

//POST /users/login -- accept a payload of form data and use it to log a user in
router.post('/login', async (req, res) => {
    try {
        console.log(req.query)
        //look up the user in the db using the supplied email
        const user = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        const noLoginMsg = 'Incorrect username or password'
        //if the user is not found -- send the user back to the login form
        if (!user) {
            console.log('user not found')
            res.redirect('/users/login?message=' + noLoginMsg)
        }
        //if the user found, but given wrong password, send them back to login form
        else if (!bcrypt.compareSync(req.body.password, user.password)) {
            console.log('password does not match')
            //passing in query ?key= 
            res.redirect('/users/login?message=' + noLoginMsg)
            //if the user is found and the supplised pw matches what's in db, log them in
        } else {
            const encryptedUserId = crypto.AES.encrypt(user.id.toString(), process.env.ENC_SECRET)
            const encryptedUserIdString = encryptedUserId.toString() // have to stringify
            // res.cookie('key', value)
            res.cookie('userId', encryptedUserIdString)
            res.redirect('/users/profile')
        }

    } catch (err) {
        console.log(err)
        res.send('server error')
    }

})

//GET /users/logout -- log out a user by clearing cookies
router.get('/logout', (req, res) => {
    //clear the cookie and redirect to homepage
    res.clearCookie('userId')
    res.redirect('/')
})

router.get('/profile', async (req, res) => {
    try {
        const msgFail = 'Current password is invalid.'
        const msgSuccess = 'Password reset successful'
    // if the user is not logged in, redirect to login form
    if (!res.locals.user) {
        res.redirect('/users/login?message=Please login to view your profile')
    } else {
        // otherwise, show them their profile
        const userData = await db.user.findOne({
            where: {
                id: res.locals.user.id
            }
        })
        res.render('users/profile.ejs', {
            user: res.locals.user, image: userData.photo, message: req.query.message ? req.query.message : null, msgFail:msgFail, msgSuccess:msgSuccess
        })
    }
} catch(err){
    console.log(err)
    res.send('server error')
}})

router.get('/profile/:id', (req, res) => {
    // if the user is not logged in, redirect to login form
    if (!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource')
    } else {
        // otherwise, show them their profile
        res.render('users/edit.ejs', {
            user: res.locals.user
        })
    }
})

router.put('/profile/:id', async (req, res) => {
    try {
        const changes = await db.user.update({
            name: req.body.username,
            email: req.body.email,
            city: req.body.city,
            state: req.body.state,
        }, {where: {
            id: req.params.id
        }})
        res.redirect('/users/profile')
    }catch(err) {
        console.log(err)
        res.send('server error')
    }
})
router.delete('/profile/:id', async (req, res) => {
    try {
        const user = await db.user.findOne({
        where: {
            id: res.locals.user.id
        }
    })
        // check user's current password before proceeding to deletion of user account
        const msgFail = 'Current password is invalid.'
        if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.redirect(`/users/profile?message=${msgFail}`)
    } else {
        const deleteUser = await db.user.destroy({
            where: {
                id: req.params.id
            }})
            res.clearCookie('userId')
            res.redirect('/')
    }
 
    }catch(err) {
        console.log(err)
        res.send('server error')
    }
})

router.put('/profile/photo/:id/', async (req, res) => {
    try {
        const user = await db.user.findOne({
            where: {
                id: res.locals.user.id
            }
        })
        // if file was uploaded, update user photo to new file in req.files
        if (req.files) {
            const photo = req.files.photo
            const filePath = path.join(__dirname, '..', "files", photo.name)
            photo.mv(filePath, (err) => {
                console.log(err)
            })
            const updatePhoto = await db.user.update({
                photo: req.files.photo.name
            }, {where: {
                id: user.id
            }})
            res.redirect('/users/profile')
        } else {
            // if no req.files available from req, route to profile page with error message
            res.redirect('/users/profile?message=new photo was not uploaded. try again')
        }

       
    }catch(err) {
        console.log(err)
        res.send('server error')
    }
})

router.put('/profile/pw/:id/', async (req, res) => {
    try {
        const user = await db.user.findOne({
            where: {
                id: res.locals.user.id
            }
        })
        // check current password before updating password to new password supplied from form
        const msgFail = 'Current password is invalid.'
        const msgSuccess = 'Password reset successful'
        if (!bcrypt.compareSync(req.body.oldpw, user.password)) {
            res.redirect(`/users/profile?message=${msgFail}`)
        } else {
            const newHashedPW = bcrypt.hashSync(req.body.newpw, 12)
            const updatePW = await db.user.update({
                password: newHashedPW
            }, {where: {
                id: user.id
            }})
            res.redirect(`/users/profile?message=${msgSuccess}`)
        }
       
    }catch(err) {
        console.log(err)
        res.send('server error')
    }
})




module.exports = router