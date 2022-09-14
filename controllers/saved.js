const express = require('express')
const router = express.Router()
const db = require('../models')
const user = require('../models/user')
const methodOverride = require("method-override")
const activity = require('../models/activity')
router.use(methodOverride("_method"))

router.get('/', async (req, res) => {
    try {
        const saved = await db.activity.findAll()
        res.render('activities/saved.ejs', { saved: saved })
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.get('/completed', async (req, res) => {
    try {
        const saved = await db.activity.findAll()
        res.render('activities/completed.ejs', { saved: saved })
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.get('/logs/:id', async (req, res) => {
    try {
        const logs = await db.log.findAll({
            where: {
                activityId: req.params.id,
            }
        })
        const activity = await db.activity.findOne({
            where: {
                id: req.params.id
            }
        })
        res.render('activities/logs.ejs', { logs: logs, activity: activity })
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.post('/logs/:id', async (req, res) => {
    try {
        const newLog = await db.log.create({
            activityId: req.params.id,
            userId: res.locals.user.id,
            title: req.body.title,
            content: req.body.content           
        })
        res.redirect(`/saved/logs/${req.params.id}`)
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.get('/logs/:id/:logid', async (req, res) => {
    try {
        console.log(req.params.logid)
        const log = await db.log.findOne({
            where: {
                id: req.params.logid
            }
        })
        res.render('activities/editlogs.ejs', { log:log })
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})

router.post('/', async (req, res) => {
    try {
        const newSaved = await db.activity.findOrCreate({
            where: {
                activity: req.body.activity,
                userId: res.locals.user.id
            },
            defaults: {
                participants: req.body.participants,
                accessibility: req.body.accessibility,
                price: req.body.price,
                type: req.body.type,
                in_progress: false,
                completed: false
            }
        })
        res.redirect(`/${req.body.type}?message=Successfully Saved!`)
    } catch (err) {
        console.log(err)
        res.send('server error')
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const unsave = await db.activity.destroy({
            where: {
                id: req.params.id
            },
        })
        res.redirect('/saved')
    } catch (err) {
        console.log(err)
        res.send('server error')
    }
})


router.put('/:id', async (req, res) => {
    try {
        console.log(req.body)
        if (req.body.name === "completed") {
            const completed = await db.activity.update({
                completed: true,
                in_progress: true
            }, {
                where: {
                    id: req.params.id
                }
            })
        } else {
            const inProgress = await db.activity.update({
                in_progress: true
            }, {
                where: {
                    id: req.params.id
                }
            })
        }
        res.redirect('/saved')
    } catch (err) {
        console.log(err)
        res.send('server error')
    }

})



module.exports = router