const express = require('express')
const router = express.Router()
const db = require('../models')
const methodOverride = require("method-override")
router.use(methodOverride("_method"))


router.get('/:type', async (req, res) => {
    try {
        const recs = await db.recommendation.findAll({
            // display newer reviews on top
            order: [['createdAt', 'DESC']],
            include: [db.activity, db.user]
        }
        )
        const type = req.params.type
            // to pass in the number of logged-in users' reviews posted to display on 'my reviews'
        const userRecs = await db.recommendation.count({
            where: {
                userId: res.locals.user.id
            }
        })
        res.render('reviews/show.ejs', { recs: recs, activitytype:type, userRecs: userRecs})
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
        res.redirect("/reviews/all")
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
        const userRecs = await db.recommendation.count({
            where: {
                userId: res.locals.user.id
            }
        })
        res.render('reviews/user.ejs', { recs: recs, activity: recs.activity, userRecs:userRecs })
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})
router.delete('/users/:userid/:id', async (req, res) => {
    try {
        const recDelete = await db.recommendation.destroy({
            where: {
                userId: req.params.userid,
                id: req.params.id
            }
        })
        res.redirect(`/reviews/users/${req.params.userid}`)
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})
router.get('/edit/:id', async (req, res) => {
    try {
        const rec = await db.recommendation.findOne({
            where: {                
                id: req.params.id
            }
        })
        res.render("reviews/edit.ejs", {rec:rec})
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})
router.put('/:userid/:id', async (req, res) => {
    try {
        const recUpdate = await db.recommendation.update({
            title: req.body.title,
            resource: req.body.resource,
            content: req.body.content,
            rating: req.body.rating
        }, {where: {                
                id: req.params.id,
            }
        })
        res.redirect(`/reviews/users/${req.params.userid}`)
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

module.exports = router