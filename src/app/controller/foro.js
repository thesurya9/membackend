const mongoose = require("mongoose");
const Foro = mongoose.model('Foro');
const LikeForo = mongoose.model('LikeForo');
const CommentForo = mongoose.model('CommentForo');
const fs = require('fs');
const moment = require('moment')
const s3 = require('../helper/s3');


module.exports = {

    create: async (req, res) => {
        try {

            const title = req.body.title;
            const description = req.body.description;
            const postedby = req.body.postedby;
            const category = req.body.category;
            // Create blogs in db
            const foro = new Foro({
                title: title,
                description: description,
                postedby: postedby,
                category: category
            });
            if (req.body && req.body.image) {
                const img = await s3.upload({ file: req.body.image, filename: 'foroImage_' + foro._id });
                foro.image = img;
            }

            const foros = await foro.save();
            return res.status(201).json({
                success: true,
                message: 'foro created successfully!',
                data: foros
            });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },


    getforos: async (req, res) => {
        try {
            let foro = await Foro.find({ category: req.body.category }).lean();
            let foroids = foro.map(ev => ev._id);
            let likeC = await LikeForo.find({ foro: { $in: foroids } }).lean();
            let Comments = await CommentForo.find().lean();
            
            let likesCount = {};
            likeC.map(e => {
                likesCount[e.foro] = e.liked_by.length;
            })
            
            foro = foro.map(e => {
                if(likesCount[e._id] > 0){
                    e.totalLikes = likesCount[e._id]; 
                }else{
                    e.totalLikes = 0;
                }
                e.totalComments = Comments.filter((c) => {
                    if(c.foro){
                        if(c.foro.toString() == e._id.toString() )
                        { 
                            return c;
                        } 
                    }
                }).length;
                return e;
            });
          
            res.status(200).json({
                success: true,
                message: 'Fetched all foros success',
                bogsList: foro
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    // deleteTopic: async (req, res) => {
    //     try {
    //         const topic_id = req.params['topicID'];
    //         await Topic.deleteOne({ _id: topic_id });
    //         return response.ok(res, { message: "Topic Deleted Successfuly!!" }); --need to ask how to implemet ok ?
    //     } catch (err) {
    //         return response.error(res, err);
    //     }
    // },

    deleteforo: async (req, res) => {
        try {
            if (req.body && req.body.foroId) {
                const foroId = req.body.foroId;
                await Foro.deleteOne({ _id: foroId });
                res.status(200).json({
                    success: true,
                    message: "Foro Deleted Successfuly!!",
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: "Not found foroId",
                })
            }

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    updateForo: async (req, res) => {
        try {
            let newimg = '';
            if(req.body.image){
                const newImage = req.body.image;
                const img = newImage.includes('https')
               
                if (img) {
                    newimg = req.body.image;
                } else {
                    newimg = await s3.upload({ file: req.body.image, filename: 'foroImage_' + req.body.foroId })
                }
            }else{
                newimg =''
            }
          
            const foro = await Foro.findByIdAndUpdate({ _id: req.body.foroId }, {
                title: req.body.title,
                description: req.body.description,
                postedby: req.body.postedby,
                category: req.body.category,
                image: newimg
            });
          
            res.status(200).json({
                success: true,
                message: 'Updated your foro successfully',
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },
    likeForo: async (req, res) => {
        try {
            let msg = 'Foro Liked!!';
            let like = await LikeForo.findOne({ foro: req.body.foro });
            if (like) {
                let alreadyLiked = like.liked_by.find(l => l == req.user.id);
                if (alreadyLiked) {
                    like.liked_by = like.liked_by.filter(l => l != req.user.id);
                    msg = 'Foro disliked!!';
                } else {
                    like.liked_by.push(req.user.id);
                }
                await like.save();
            } else {
                like = await LikeForo.create({ foro: req.body.foro, liked_by: [req.user.id] });
            }
            console.log(like)
            return res.status(200).json({
                success: true,
                message: msg,
                like:like,
                likes: like.liked_by.length
            });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },
    addComment: async (req, res) => {
        try {
            let reqBody = req.body;
           const comment= await CommentForo.create({ foro: reqBody.foro, comment_by: req.user.id, comment: reqBody.comment });
            return res.status(200).json({
                success: true,
                message: "Comments added!!",
            });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message,
            });
        }
    },
    getComments: async (req, res) => {
        try {
            const comments = await CommentForo.find({ foro: req.params.foro }).populate({ path: 'comment_by', select: 'name' })
            return res.status(200).json({
                success: true,
                message: "list of comments for this foro post",
                comments: comments
            });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    deleteComment: async (req, res) => {
        try {
            // if (req.body && req.body.blogId) {
            //     const blogId = req.body.blogId;
                await CommentForo.deleteMany();
                res.status(200).json({
                    success: true,
                    message: "Comment Deleted Successfuly!!",
                })
            // } else {
            //     res.status(404).json({
            //         success: false,
            //         message: "Not found blogId",
            //     })
            // }

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

}
