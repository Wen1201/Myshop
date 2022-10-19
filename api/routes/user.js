const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const User = require("../models/User.js");

const router = require("express").Router();

// Update user
router.put("/:id", verifyTokenAndAuthorization, async (req,res) =>{
    // should decide whether this token belongs to clients or admin or not
    // before update, check my password because user can change password
    // again encrypt my password
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    // update user
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body  //take everything inside request and body and set it again
        }, {new: true});
        res.status(200).json(updatedUser); // set new user
    }catch(err){
        res.status(500).json(err);
    }
    
});

// delete
router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...")
    }catch(err){
        res.status(500).json(err)
    }
}); // delete

// get user
router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc; // first one is password, others is other information(username, email...)
        res.status(200).json(others); // success
    }catch(err){
        res.status(500).json(err)
    }
}); // get user

// get all users
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    const query = req.query.new;
    try{
        // not return all users, return first five users
        const users = query 
        ? 
        await User.find().sort({_id: -1 }).limit(1) 
        : 
        await User.find();
        res.status(200).json(users); // success
    }catch(err){
        res.status(500).json(err)
    }
}); // get all users

// get user stats
router.get("/stats", verifyTokenAndAdmin, async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.setFullYear() - 1));
    
    try {
        const data = await User.aggregate([
            // match my condition
            {$match: {createdAt: { $gte: lastYear }}},
            {
                $project: {
                    // take the month number inside my created add date
                    month: { $month: "$createdAt" }, // create month variable

                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }, // sum every registerd user
                },
            },
        ]);
        
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;