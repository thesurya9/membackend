const mongoose = require("mongoose");
const Video = mongoose.model('Video');
const fs = require('fs');
const moment = require('moment')
module.exports = {
    create: async (req, res) => {
        try {
            
            if(req.body && (req.body.youtube_url)){
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const url = req.body.youtube_url;
                const match = url.match(regExp);
                let utub = (match && match[2].length === 11) ? match[2]: null;
                const category = req.body.category;
                const title = req.body.title;
                const description = req.body.description;
                const youtube_url =  `https://www.youtube.com/embed/${utub}`;
                // Create Events in db
    
                const video1 = new Video({
                    title: title,
                    description: description,
                    category:category,
                    // video: video,
                    youtube_url: youtube_url,
                    // poster:posterfile
                })
                const videosFile = await video1.save();
                return res.status(201).json({
                    success: true,
                    message: 'Video uploaded successfully!',
                    data: videosFile
                })
            }else{
                return res.status(404).json({
                    success: false,
                    message: 'video not found'
                });
            }
            
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    updateVideo: async (req, res) => {
        try {
            let newvideo = '';
            if (req.body.youtube_url) {
                const newvid = req.body.youtube_url;
                const vid = newvid.includes('https://www.youtube.com/embed/');

                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const url = req.body.youtube_url;
                const match = url.match(regExp);
                let utub = (match && match[2].length === 11) ? match[2]: null;
                const youtube_url =  `https://www.youtube.com/embed/${utub}`;

                if (vid) {
                    newvideo = req.body.youtube_url;
                } else {
                    newvideo = youtube_url 
                }
            } else {
                newvideo = ''
            }

            const vid = await Video.findByIdAndUpdate({ _id: req.body.videoId }, {
                title: req.body.title,
                description: req.body.description,
                category:req.body.category,
                youtube_url: newvideo,
            });

            res.status(200).json({
                success: true,
                message: 'Updated your video successfully',
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    getvideos: async (req, res) => {
        try {
            if(req.body.category) {
                let video = await Video.find({ category: req.body.category }).lean();
                res.status(200).json({
                    success: true,
                    message: 'Fetched all Video success',
                    videoList: video
                })
            }else{
                const videos = await Video.find({});
                res.status(200).json({
                    success: true,
                    message: 'Fetched all Video success',
                    videoList: videos
                })
            }

            
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    

    deleteVideo: async (req, res) => {
        try {
            if (req.body && req.body.videoID) {
                const videoID = req.body.videoID;
                await Video.deleteOne({ _id: videoID });
                res.status(200).json({
                    success: true,
                    message: "video Deleted Successfuly!!",
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Not found videoID"
                });
            }

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    }

}
