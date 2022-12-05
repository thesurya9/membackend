const mongoose = require("mongoose");
const Blog = mongoose.model('Blog');
const Like = mongoose.model('Like');
const Comment = mongoose.model('Comment');
const s3 = require('../helper/s3');


module.exports = {

    create: async (req, res) => {
        try {

            const title = req.body.title;
            const description = req.body.description;
            const postedby = req.body.postedby;
            const category = req.body.category;
            // Create blogs in db
            const blog = new Blog({
                title: title,
                description: description,
                postedby: postedby,
                category: category
            });
            if (req.body && req.body.image) {
                const img = await s3.upload({ file: req.body.image, filename: 'blogImage_' + blog._id });
                blog.image = img;
            }

            const blogs = await blog.save();
            return res.status(201).json({
                success: true,
                message: 'Blog created successfully!',
                data: blogs
            });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },


    getblogs: async (req, res) => {
        try {
            let blog = await Blog.find({ category: req.body.category }).lean();
            let blogids = blog.map(ev => ev._id);
            let likeC = await Like.find({ blog: { $in: blogids } }).lean();
            let Comments = await Comment.find().lean();
            
            let likesCount = {};
            likeC.map(e => {
                likesCount[e.blog] = e.liked_by.length;
            })
            
            blog = blog.map(e => {
                if(likesCount[e._id] > 0){
                    e.totalLikes = likesCount[e._id]; 
                }else{
                    e.totalLikes = 0;
                }
                e.totalComments = Comments.filter((c) => {if(c.blog.toString() == e._id.toString()){ return c;} }).length;
                return e;
            });
          
            res.status(200).json({
                success: true,
                message: 'Fetched all blogs success',
                bogsList: blog
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

    deleteblog: async (req, res) => {
        try {
            if (req.body && req.body.blogId) {
                const blogId = req.body.blogId;
                await Blog.deleteOne({ _id: blogId });
                res.status(200).json({
                    success: true,
                    message: "Blog Deleted Successfuly!!",
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: "Not found blogId",
                })
            }

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    updateBlogs: async (req, res) => {
        try {
            let newimg = '';
            if(req.body.image){
                const newImage = req.body.image;
                const img = newImage.includes('https')
               
                if (img) {
                    newimg = req.body.image;
                } else {
                    newimg = await s3.upload({ file: req.body.image, filename: 'blogImage_' + req.body.blogId })
                }
            }else{
                newimg =''
            }
          
            const blog = await Blog.findByIdAndUpdate({ _id: req.body.blogId }, {
                title: req.body.title,
                description: req.body.description,
                postedby: req.body.postedby,
                category: req.body.category,
                image: newimg
            });
          
            res.status(200).json({
                success: true,
                message: 'Updated your blog successfully',
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },
    likeBlog: async (req, res) => {
        try {
            let msg = 'Blog Liked!!';
            let like = await Like.findOne({ blog: req.body.blog });
            if (like) {
                let alreadyLiked = like.liked_by.find(l => l == req.user.id);
                if (alreadyLiked) {
                    like.liked_by = like.liked_by.filter(l => l != req.user.id);
                    msg = 'Blog disiked!!';
                } else {
                    like.liked_by.push(req.user.id);
                }
                await like.save();
            } else {
                like = await Like.create({ blog: req.body.blog, liked_by: [req.user.id] });
            }
            return res.status(200).json({
                success: true,
                message: msg,
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
            await Comment.create({ blog: reqBody.blog, comment_by: req.user.id, comment: reqBody.comment });
            return res.status(200).json({
                success: true,
                message: "Comments added!!"
            });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },
    getComments: async (req, res) => {
        try {
            const comments = await Comment.find({ blog: req.params.blog }).populate({ path: 'comment_by', select: 'name' })
            return res.status(200).json({
                success: true,
                message: "list of comments for this blog post",
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
                await Comment.deleteMany();
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
