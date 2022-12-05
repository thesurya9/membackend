'use strict';

const express = require('express');
const router = require('express').Router();
const user = require('../../app/controller/user');
const plan = require('../../app/controller/plan');
const blog = require('../../app/controller/blog');
const foro = require('../../app/controller/foro');
const event = require('../../app/controller/event');
const videos = require('../../app/controller/videos');
const mentorship = require('../../app/controller/mentorship');
const mentors = require('../../app/controller/mentors');
const notification = require('../../app/controller/notification');
const isAuthenticated = require("./../../middlewares/isAuthenticated");

// STEP-1 add route

// add route
router.post('/login', user.login);
router.post('/signUp', user.signUp);
router.post('/getProfile', user.getProfile);
router.post('/updatetProfile', user.updateProfile);
router.post('/forgotPassword', user.forgotPassword);
router.post('/sendOtp', user.sendotp);
router.post('/verifyOtp', user.otpVerify);
router.get('/getUsers', user.getUsers);
router.post('/me', isAuthenticated, user.me);

// plan
router.post('/changePlan', isAuthenticated, user.changePlan);
router.get('/plans', isAuthenticated, plan.plans);

// Event Routes

router.use('/profile', express.static('images'))
router.use('/videos', express.static('videos'))

// Blog routes
router.post('/createblog', blog.create);
router.post('/getblogs', blog.getblogs)
router.post('/updateblogs', blog.updateBlogs)
router.post('/deleteblog', blog.deleteblog);
router.post('/likeBlog', isAuthenticated, blog.likeBlog);
router.post('/addComment', isAuthenticated, blog.addComment);
router.get('/getComments/:blog', isAuthenticated, blog.getComments);
router.post('/deleteComments', blog.deleteComment);

//Foro route
router.post('/createforo', foro.create);
router.post('/getforos', foro.getforos)
router.post('/updateforo', foro.updateForo)
router.post('/deleteforo', foro.deleteforo);
router.post('/likeForo', isAuthenticated, foro.likeForo);
router.post('/addForoComment', isAuthenticated, foro.addComment);
router.get('/getForoComments/:foro', isAuthenticated, foro.getComments);
router.post('/deleteForoComments', foro.deleteComment);

//Events Route
router.post('/createevent', event.create);
router.post('/getevents', event.getevents);
router.post('/editEvent', event.updateEvent);
router.post('/deleteEvent', event.deleteEvent);
router.post('/addInterest', isAuthenticated, event.addInterest);
router.post('/addGoing', isAuthenticated, event.addGoing);
router.get('/listInterest/:event', isAuthenticated, event.listInterest);
router.get('/listGoing/:event',isAuthenticated, event.listGoing);

router.post('/listMyEvents', isAuthenticated, event.listMyEvents);
router.post('/listGoMyEvents',isAuthenticated, event.listGoMyEvents);



//Videos Route
router.post('/createvideo', videos.create);
router.post('/deletevideo', videos.deleteVideo);
router.post('/getvideo', videos.getvideos);
router.post('/updateVideo', videos.updateVideo);


//MentorShip Route 
router.post('/createMentorshipReq', mentorship.create);
router.get('/getMentorship', mentorship.getMentorship);

//Mentors Route 
router.post('/createMentors', mentors.create);
router.get('/getMentors', mentors.getMentors);
router.delete('/deleteMentors', mentors.deleteMentors);

//notification Route
router.post('/createNotification', notification.createNotification);
router.post('/getNotification', notification.getNotification);
router.post('/deleteNotification', notification.deletenotification);

module.exports = router
