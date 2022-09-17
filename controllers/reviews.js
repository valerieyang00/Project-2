const express = require('express')
const router = express.Router()
const db = require('../models')
// const user = require('../models/user')
const methodOverride = require("method-override")
// const activity = require('../models/activity')
router.use(methodOverride("_method"))


router.get('/:type', async (req, res) => {
    try {
        const recs = await db.recommendation.findAll({
            order: [['createdAt', 'DESC']],
            include: [db.activity, db.user]
        }
        )
        const type = req.params.type
        res.render('reviews/show.ejs', { recs: recs, activitytype:type})
      } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.get('/new/:activityid', async (req, res) => {
    try {
        const activity = await db.activity.findOne({
            where: {
                id: req.params.activityid
            },
            include: [db.user]
        })
        console.log(activity)
        res.render('reviews/new.ejs', { activity:activity, user: activity.user })
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.post('/:userid/:activityid', async (req, res) => {
    try {
        const recommendation = await db.recommendation.create({
            userId: req.params.userid,
            activityId: req.params.activityid,
            title: req.body.title,
            resource: req.body.resource,
            content: req.body.content,
            rating: req.body.rating
        })
        res.redirect(`/reviews/users/${req.params.userid}`)
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.get('/users/:userid', async (req, res) => {
    try {
        const recs = await db.recommendation.findAll({
            where: {
                userId: req.params.userid
            },
            order: [['createdAt', 'DESC']],
            include: [db.activity]
        })
        res.render('reviews/user.ejs', { recs: recs, activity: recs.activity })
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})
router.delete('/users/:userid/:activityid', async (req, res) => {
    try {
        const recDelete = await db.recommendation.destroy({
            where: {
                userId: req.params.userid,
                activityId: req.params.activityid
            }
        })
        res.redirect(`/reviews/users/${req.params.userid}`)
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

module.exports = router