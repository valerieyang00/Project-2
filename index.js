//required packages
require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const db = require('./models')
const crypto = require('crypto-js')
const axios = require('axios')
const moment = require('moment')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const morgan = require('morgan');
const _ = require('lodash');
const path = require('path')


// console.log('server secret:', process.env.ENC_SECRET)


//config express app/middlewares
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const methodOverride = require("method-override")
app.use(methodOverride("_method"))
app.use(express.static("public"))
app.use(express.static("files"))
//our custom auth middleware
//next tells express to move on to next route or middleware in the chain 
app.use(async (req, res, next) => {
    //if there is a cookie on the incoming request, we want to look up the user in the db
    if (req.cookies.userId) {
        //need to decrypt the uer id before we look up the in the db
        const decryptedId = crypto.AES.decrypt(req.cookies.userId.toString(), process.env.ENC_SECRET)
        const decryptedIdString = decryptedId.toString(crypto.enc.Utf8)
        const user = await db.user.findByPk(decryptedIdString)
        // res.locals (mount the user here, so it passes down to all other routes)
        res.locals.user = user
    } else {
        //if no user (no cookie) -- set the user to be null in the res.locals
        res.locals.user = null
    }
    next()
})
app.use(fileUpload())
app.use(cors())
app.use(morgan('dev'))

// middleware that allows us to access the 'moment' library in every EJS view
app.use((req, res, next) => {
    res.locals.moment = moment
    next()
  })

//controllers set up
app.use('/users', require('./controllers/users'))
app.use('/saved', require('./controllers/saved'))
app.use('/reviews', require('./controllers/reviews'))
app.use('/feed', require('./controllers/feed'))


//route definitions
app.get('/', (req, res) => {
    res.render('home.ejs')
})


app.get('/:type', (req, res) => {
    axios.get(`http://www.boredapi.com/api/activity?type=${req.params.type}`)
        .then(response => {
            res.render('activities/show.ejs', { data: response.data, type: req.params.type, message: req.query.message ? req.query.message : null, user: res.locals.user })
        })
})



//listen on port
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})