const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const Product = require("../models/Product");

const router = require("express").Router();

//Create
router.post("/", verifyTokenAndAdmin, async(req,res)=>{
    const newProduct = new Product(req.body)

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct)
    }catch(err){
        res.status(500).json(err)
    }

});

// Update product
router.put("/:id", verifyTokenAndAdmin, async (req,res) =>{

    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set: req.body  //take everything inside request and body and set it again
        }, {new: true});
        res.status(200).json(updatedProduct); // set new product
    }catch(err){
        res.status(500).json(err);
    }
    
});

// delete
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted...")
    }catch(err){
        res.status(500).json(err)
    }
}); // delete

// get product
router.get("/find/:id", async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).json(product); // success
    }catch(err){
        res.status(500).json(err)
    }
}); // get product

// get all products
router.get("/", async (req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let products;
        if( qNew ) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory){
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        }else {
            products = await Product.find();
        }
        res.status(200).json(products); // success
    }catch(err){
        res.status(500).json(err)
    }
}); // get all productss



module.exports = router;