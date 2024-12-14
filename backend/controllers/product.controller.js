import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async(req, res) => {
    try{
        const products = await Product.find({}); //find all products
        res.json({products});
    }
    catch(error){
        console.log("Error in get all products controller", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

export const getFeaturedProducts = async(req, res) => {
    try
    {
        let featuredProducts =  await redis.get("featured_products");
        if(featuredProducts){
            return res.json({products: JSON.parse(featuredProducts)});
        }

        //If not in redis fetch from MongoDB
        featuredProducts = await Product.find({isFeatured: true}).lean();

        if(!featuredProducts){
            return res.status(404).json({message: "No featured products found"});
        }

        //Store in redis for future quick access
        await redis.set("featured_products", JSON.stringify(featuredProducts));

        res.json({products: featuredProducts});

    }catch(error){
        console.log("Error in get featured products controller", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

export const createProduct = async(req, res) => {
    try{
        const {name, description, price, image, category} = req.body;
        let cloudinaryresponse = null;
        if(image){
            cloudinaryresponse = await cloudinary.uploader.upload(image, {
                folder: "products"
            });
        }
        
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryresponse?.secure_url,
            category
        });

        res.status(201).json({product});
    }catch(error){
        console.log("Error in create product controller", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

export const deleteProduct = async(req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }
        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];
            try{
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from cloudinary");
            }catch(error){
                console.log("Error in deleting product image from cloudinary", error.message);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Product deleted successfully"});

    }
    catch(error){
        console.log("Error in delete product controller", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

export const getRecommendedProducts = async(req, res) => {
    try{
        const products = await Product.aggregate([
            {
                $sample: {size: 4 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ])
        res.json({products});
    }
    catch(error){
        console.log("Error in get recommended products controller", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

export const getProductsByCategory = async(req, res) => {
    const {category} = req.params;
    try{
        const products = await Product.find({category});
        res.json({products});
    }catch(error){
        console.log("Error in get products by category controller", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

export const toggleFeaturedProduct = async(req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json({product: updatedProduct});
        }
        else{
            res.status(404).json({message: "Product not found"});
        }
    }
    catch(error){
        console.log("Error in toggle featured product controller", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

async function updateFeaturedProductsCache(){
    try{
        const featuredProducts = await Product.find({isFeatured: true}).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    }catch(error){
        console.log("Error in update featured products cache", error.message);
    }
}