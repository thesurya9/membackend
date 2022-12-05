const mongoose = require("mongoose");
const Mentorship = mongoose.model('Mentorship');
module.exports = {

    create: async (req, res) => {
        try {         
            const name = req.body.name;
            const email = req.body.email;
            const mobile = req.body.mobile;           
            const question = req.body.question;
            const mentorname = req.body.mentorname;
            // Create blogs in db

            const mentorship = new Mentorship({
                name: name,
                email: email,
                mobile: mobile,
                question: question,
                mentorname: mentorname,
                // posteddate: new Date()
            })
            const mentorships = await mentorship.save();
            return res.status(201).json({
                success: true,
                message: 'Data Saved successfully!',
                data: mentorships
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    getMentorship: async (req, res) => {
        try {
            const mentorship = await Mentorship.find({});
            res.status(200).json({
                success: true,
                message: 'Fetched all Mentorship success',
                bogsList: mentorship
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            });
        }
    },

    // deleteblog: async (req, res) => {
    //     try {
    //         if(req.body && req.body.blogId){
    //             const blogId = req.body.blogId;            
    //             await Blog.deleteOne({ _id: blogId });            
    //             res.status(200).json({
    //                 success: true,
    //                 message: "Blog Deleted Successfuly!!",                
    //             })
    //         }else{
    //             res.status(404).json({
    //                 success: false,
    //                 message: "Not found blogId",                
    //             })
    //         }
            
    //     } catch (e) {
    //         return res.status(500).json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

}