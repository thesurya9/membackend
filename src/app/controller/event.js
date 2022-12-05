const mongoose = require("mongoose");
const Event = mongoose.model('Event');
const EventInterested = mongoose.model('EventInterested');
const EventGoing = mongoose.model('EventGoing');
const s3 = require('../helper/s3');

module.exports = {

    create: async (req, res) => {
        try {

            const title = req.body.title;
            const description = req.body.description;
            const postedby = req.body.postedby;
            const category = req.body.category;
            const startdate = req.body.startdate;
            const enddate = req.body.enddate;
            const starttime = req.body.starttime;
            const endtime = req.body.endtime;
            const website = req.body.website;
            const fee = req.body.fee;
            const address = req.body.address;

            // Create Events in db

            const event = new Event({
                title: title,
                description: description,
                postedby: postedby,
                category: category,
                startdate: startdate,
                enddate: enddate,
                website: website,
                fee: fee,
                starttime: starttime,
                endtime: endtime,
                address: address
                // posteddate: new Date()
            })

            if (req.body && req.body.image) {
                const img = await s3.upload({ file: req.body.image, filename: 'eventImage_' + event._id });
                event.image = img;
            } else {
                event.image = '';
            }
            const events = await event.save();
            return res.status(201).json({
                success: true,
                message: 'Event created successfully!',
                data: events
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },


    getevents: async (req, res) => {
        try {
            if (req.body.category) {
                let event = await Event.find({ category: req.body.category }).lean();
                let eventids = event.map(ev => ev._id);
                let eventI = await EventInterested.find({ event: { $in: eventids } }).lean();
                let eventg = await EventGoing.find({ event: { $in: eventids } }).lean();
                let eventsCount = {};
                let eventsGCount = {};
                eventI.map(e => {
                    eventsCount[e.event] = e.users.length;
                })

                eventg.map(ele => {
                    eventsGCount[ele.event] = ele.users.length;
                })
                event = event.map(e => {
                    e.totalInterested = eventsCount[e._id];
                    return e;
                });

                event = event.map(ele => {
                    ele.totalGoing = eventsGCount[ele._id];
                    return ele;
                });
                res.status(200).json({
                    success: true,
                    message: 'Fetched all Events success',
                    eventList: event
                })
            } else {
                let event = await Event.find().lean();
                let eventids = event.map(ev => ev._id);
                let eventI = await EventInterested.find({ event: { $in: eventids } }).lean();
                let eventg = await EventGoing.find({ event: { $in: eventids } }).lean();
                let eventsCount = {};
                let eventsGCount = {};
                eventI.map(e => {
                    eventsCount[e.event] = e.users.length;
                });
                eventg.map(ele => {
                    eventsGCount[ele.event] = ele.users.length;
                })
                event = event.map(e => {
                    e.totalInterested = eventsCount[e._id];
                    return e;
                });
                event = event.map(ele => {
                    ele.totalGoing = eventsGCount[ele._id];
                    return ele;
                });
                res.status(200).json({
                    success: true,
                    message: 'Fetched all Events success',
                    eventList: event
                })
            }

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },


    updateEvent: async (req, res) => {
        try {
            let newimg = '';
            if (req.body.image) {
                const newImage = req.body.image;
                const img = newImage.includes('https')

                if (img) {
                    newimg = req.body.image;
                } else {
                    newimg = await s3.upload({ file: req.body.image, filename: 'eventImage_' + req.body.eventId })
                }
            } else {
                newimg = ''
            }

            const event = await Event.findByIdAndUpdate({ _id: req.body.eventId }, {
                title: req.body.title,
                description: req.body.description,
                postedby: req.body.postedby,
                category: req.body.category,
                startdate: req.body.startdate,
                enddate: req.body.enddate,
                starttime: req.body.starttime,
                endtime: req.body.endtime,
                website: req.body.website,
                fee: req.body.fee,
                address: req.body.address,
                image: newimg
            });

            res.status(200).json({
                success: true,
                message: 'Updated your event successfully',
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            if (req.body && req.body.evnetID) {
                const evnetID = req.body.evnetID;
                await Event.deleteOne({ _id: evnetID });
                res.status(200).json({
                    success: true,
                    message: "evnet Deleted Successfuly!!",
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Not found evnetID"
                });
            }

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    addInterest: async (req, res) => {
        try {

            let eventInterested = await EventInterested.findOne({ event: req.body.event });

            if (!eventInterested) {
                eventInterested = await EventInterested.create({ event: req.body.event, users: [req.user.id] });
                // eventInterested.users.push(req.user.id);
                // await eventInterested.save();
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Allready added to event!!",
                });
            }
            return res.status(200).json({
                success: true,
                message: "You have been added to event!!",
                data: eventInterested.event
            });

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    addGoing: async (req, res) => {
        try {

            let eventGoing = await EventGoing.findOne({ event: req.body.event });

            if (!eventGoing) {
                eventGoing = await EventGoing.create({ event: req.body.event, users: [req.user.id] });

                // eventGoing.users.push(req.user.id);
                // await eventGoing.save();
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Allready added to event!!",
                });
            }
            // else {
            //     eventGoing = await EventGoing.create({ event: req.body.event, users: [req.user.id] });
            // }
            return res.status(200).json({
                success: true,
                message: "You have been added to event!!",
                data: eventGoing.event
            });

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },


    listGoing: async (req, res) => {
        try {

            let eventGoing = await EventGoing.findOne({ event: req.params.event }).populate({
                path: 'users', select: 'name'
            });
            return res.status(200).json({
                success: true,
                message: "List of going of this event",
                data: eventGoing
            });

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    listInterest: async (req, res) => {
        try {

            let eventInterested = await EventInterested.findOne({ event: req.params.event }).populate({
                path: 'users', select: 'name'
            });
            return res.status(200).json({
                success: true,
                message: "List of interests of this event",
                data: eventInterested
            });

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    listMyEvents: async (req, res) => {
        try {
            let eventInterested = await EventInterested.find({ 'users': { $elemMatch: { $eq: (req.body.user_id || req.user.id) } } }, { 'users': 0 }).populate({
                path: 'event', select: 'title'
            });
            return res.status(200).json({
                success: true,
                message: "List of interests of this event",
                data: eventInterested
            });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    listGoMyEvents: async (req, res) => {
        try {
            let eventgoing = await EventGoing.find({ 'users': { $elemMatch: { $eq: (req.body.user_id || req.user.id) } } }, { 'users': 0 }).populate({
                path: 'event', select: 'title'
            });
            return res.status(200).json({
                success: true,
                message: "List of going of this event",
                data: eventgoing
            });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    }

}