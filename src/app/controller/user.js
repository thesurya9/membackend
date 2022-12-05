'use strict';
const userHelper = require('./../helper/user');
const response = require('./../responses');
const passport = require('passport');
const jwtService = require("./../services/jwtService");
const mongoose = require("mongoose");
const User = mongoose.model('User');
const s3 = require('../helper/s3');
const user = require('./../helper/user');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')



function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

var otpDetail = {
    otp: '',
    email: ''
}

module.exports = {
    // login controller
    login: (req, res) => {

        passport.authenticate('local', async (err, user, info) => {
            if (err) { return response.error(res, err); }
            if (!user) { return response.unAuthorize(res, info); }
            let token = await new jwtService().createJwtToken({ id: user._id, company: user.company, plan: user.plan, role: user.role });
            return response.ok(res, {
                token,
                email: user.email,
                role: user.role,
                userid: user._id,
                plan: user.plan,
                userFullname: `${user.name} ${user.lastname} ${user.secondlastname}`,
                profile_image: user.profileimg ? user.profileimg : null
            });
            // return response.ok(res, { token, username: user });

        })(req, res);
    },
    signUp: async (req, res) => {
        try {
            let user = await User.findOne({ username: req.body.email });
            if (!user) {
                let user = new User({
                    name: req.body.name,
                    lastname: req.body.lastname,
                    secondlastname: req.body.secondlastname,
                    company: req.body.company,
                    website: req.body.website,
                    username: req.body.email,
                    password: req.body.password,
                    role: req.body.role || 'USER'
                });
                user.password = user.encryptPassword(req.body.password);
                await user.save();
                let token = await new jwtService().createJwtToken({ id: user._id, company: user.company, plan: user.plan, role: user.role });
                return response.created(res, { token, username: user.username, role: user.role, plan: user.plan });
            } else {
                return response.conflict(res);
            }
        } catch (error) {
            return response.error(res, error);
        }
    },
    me: async (req, res) => {
        try {
            let user = await userHelper.find({ _id: req.user.id });
            return response.ok(res, user);
        }
        catch (error) {
            return response.error(res, error);
        }
    },

    getProfile: async (req, res) => {
        try {
            if (req.body && req.body.userId)
                var userid = req.body.userId;
            const user = await User.findById({ _id: userid }, { 'password': 0 });
            res.status(200).json({
                success: true,
                message: "Fetched your profile successfully",
                profile: user
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    updateProfile: async (req, res) => {
        try {

            var userid = req.body.userId;
            var name = req.body.name;
            var lname = req.body.lastname;
            var slname = req.body.secondlastname;
            var company = req.body.company;
            var website = req.body.website;
            var descrption = req.body.description;
            let img = '';
            let users = '';
            if (req.body && req.body.profileimg) {
                img = await s3.upload({ file: req.body.profileimg, filename: 'userImage_' + userid });
                if (img) {
                    users = await User.findByIdAndUpdate(userid, {
                        name: name,
                        lastname: lname,
                        secondlastname: slname,
                        company: company,
                        website: website,
                        descrption: descrption,
                        profileimg: img
                    });

                    res.status(200).json({
                        success: true,
                        message: "Updated your profile successfully",
                        profile: users
                    })
                }
            }

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },


    forgotPassword: async (req, res) => {
        try {
            const username = { username: req.body.email }
            const u = await User.findOneAndUpdate(username, {
                password: req.body.password
            });
            u.password = u.encryptPassword(req.body.password);
            await u.save();
            res.status(200).json({
                success: true,
                message: "New password generated successfully",
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    sendotp: async (req, res) => {
        try {
            const username = { username: req.body.email }
            const u = await User.find(username);
            if (u.length > 0) {
                const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
                const now = new Date();
                const expiration_time = AddMinutesToDate(now, 10);

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    port: 465,               // true for 465, false for other ports
                    auth: {
                        user:"2digitinnovations@gmail.com",  //'soporte@mujeresemprendedoras.cl',
                        pass: '8700010362', //'soporte3233',
                    },
                    tls: {
                        rejectUnauthorized: false
                    },
                    secure: true,
                });

                const mailData = {
                    from: 'soporte@mujeresemprendedoras.cl',  // sender address
                    to: req.body.email,   // list of receivers
                    subject: 'Change Password',
                    text: `Your verify otp is ${otp}, You can only use it for 10 minutes, then it is expired`,
                };

                transporter.sendMail(mailData, function (err, info) {
                    if (err)
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    else {
                        otpDetail = {
                            otp: otp,
                            email: req.body.email
                        }
                        setTimeout(() => {
                            otpDetail = {
                                otp: '',
                            }
                        }, 600000);
                        return res.status(200).json({
                            success: true,
                            message: 'Successfully sent otp to your verify email'
                        });
                    }
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Does not exist'
                });
            }
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },


    otpVerify: async (req, res) => {
        try {
            console.log('request',req.body)
            console.log(otpDetail)
            if (otpDetail && otpDetail.email && otpDetail.otp) {
                if (req.body.email == otpDetail.email && req.body.otp == otpDetail.otp) {

                    res.status(200).json({
                        success: true,
                        message: "Your account verify successfully",
                    })
                    otpDetail = {
                        otp: '',
                        email: ''
                    }
                } else {
                    return res.status(500).json({
                        success: false,
                        message: 'Sorry , Not found your otp'
                    });
                }
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Sorry , please regeneret new otp.'
                });
            }

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },


    getUsers: async (req, res) => {
        try {
            const allUser = await User.find({ role: 'USER' }, { 'password': 0 });
            res.status(200).json({
                success: true,
                message: "Fetched All users successfully",
                userList: allUser
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    changePlan: async (req, res) => {
        try {
            const allUser = await User.findByIdAndUpdate(req.body.user_id, { 'plan': req.body.plan });
            return res.status(200).json({
                success: true,
                message: "Plan updated successfully"
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    }



};
