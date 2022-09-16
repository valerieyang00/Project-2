const express = require('express')
const router = express.Router()
const db = require('../models')
// const user = require('../models/user')
const methodOverride = require("method-override")
// const activity = require('../models/activity')
router.use(methodOverride("_method"))

router.get('/:search', async (req, res) => {
    try {
        const feeds = await db.feed.findAll({
            include: [db.activity, db.user]
        })
        const comments = await db.comment.findAll({
            include: [db.feed, db.user]
        })
        const params = req.params.search
        res.render('feed/show.ejs', { params:params, feeds:feeds, user: res.locals.user, comments:comments})
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
        res.render('feed/new.ejs', { activity:activity})
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.post('/:activityid', async (req, res) => {
    try {
        const newFeed = await db.feed.create({
                activityId: req.params.activityid,
                userId: req.body.userId,
                content:req.body.content,
                status: req.body.status
        })
        res.redirect('/feed/all')
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.get('/users/:userid', async (req, res) => {
    try {
        const feeds = await db.feed.findAll({
            where: {
                userId: req.params.userid
            },
            include: [db.activity]
        })
        res.render('feed/user.ejs', { feeds:feeds})
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.get('/edit/:feedid', async (req, res) => {
    try {
        const feed = await db.feed.findOne({
            where: {
                id: req.params.feedid
            },
            include: [db.activity]
        })
        res.render('feed/edit.ejs', { feed:feed})
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})
router.delete('/users/:userid/:feedid', async (req, res) => {
    try {
        const feedDelete = await db.feed.destroy({
            where: {
                id: req.params.feedid
        }})
    
        res.redirect(`/feed/users/${req.params.userid}`)
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.put('/:feedid', async (req, res) => {
    try{
    const feedUpdate = await db.feed.update({
        content: req.body.content,
        status: req.body.status
    }, {
        where: {
            id: req.params.feedid
        }
    })
    const userId = req.body.userId
    res.redirect(`/feed/users/${userId}`)
} catch (err) {
    console.log(err)
    res.send('server error')
}
})

router.post('/comments/:feedid', async (req, res) => {
    try{
    const newComment = await db.comment.create({
        content: req.body.content,
        feedId: req.params.feedid,
        userId: req.body.userId

    })
    res.redirect("/feed/all")
} catch (err) {
    console.log(err)
    res.send('server error')
}
})



module.exports = router