const mongoose = require("mongoose");
const Mentors = mongoose.model('Mentors');
const s3 = require('../helper/s3');



module.exports = {

    create: async (req, res) => {
        try { 
            const name = req.body.name;
            const title = req.body.title;
            const description = req.body.description;           
            const biodescription = req.body.biodescription;
            
            // Create mentors in db

            const mentors = new Mentors({
                name: name,
                title: title,
                description: description,
                biodescription: biodescription,
            })

            
            if (req.body && req.body.profileImg) { 
                const img = await s3.upload({ file: req.body.profileImg, filename: 'mentorImage_' + mentors._id });
                mentors.profileImg = img;
            }

            const mentorss = await mentors.save();
            return res.status(201).json({
                success: true,
                message: 'Data Saved successfully!',
                data: mentorss
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    getMentors: async (req, res) => {
        try {
            const mentors = await Mentors.find({});
            res.status(200).json({
                success: true,
                message: 'Fetched all Mentors success',
                MentorsList: mentors
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    deleteMentors: async (req, res) => {
        try {
            // if (req){
            //     if(req.body && req.body.mentorsID) {
            //         const mentorsid = req.body.mentorsID;
            //         await Video.deleteOne({ _id: mentorsid });
            //         res.status(200).json({
            //             success: true,
            //             message: "video Deleted Successfuly!!",
            //         })
            //     } else {
            //         return res.status(404).json({
            //             success: false,
            //             message: "Not found mentorsID"
            //         });
            //     }
            // }else{
            //     await Mentors.deleteMany();
            // }
            await Mentors.deleteMany();
            res.status(200).json({
                success: true,
                message: "Mentors Deleted Successfuly!!",
            })

        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    }
}