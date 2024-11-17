import { Logo, Product, ClientageCategory, Client, Popup } from '../models/models.js';
import {asyncHandler, ApiError, ApiResponse, uploadOnCloudinary} from '../utils/index.js'
import {v2 as cloudinary} from "cloudinary";

const popupId = "6736d67d2ccbd3c3805860d3"

//CRUD OPERATIONS


// CREATE
const addHomeLogo = asyncHandler( async (req, res) => {

    const {name} = req.body;

    if (name.trim() == '') {
        throw new ApiError(400, "Name field is required.")
    }
    
    const logoLocalPath = req.file.path;

    if (!logoLocalPath) {
        throw new ApiError(400, "Image field is required.")
    }

    const logo = await uploadOnCloudinary(logoLocalPath)

    const addedLogo = await Logo.create({
        name: name,
        logo: logo.url,
    })

    if (!addedLogo) {
        throw new ApiError(500, "Something went wrong at the server side.")
    }

    return res
    .status(201)
    .json( new ApiResponse(200, addedLogo, "Logo added successfully!"))
})

const addProduct = asyncHandler ( async (req, res) => {

    const {name} = req.body;

    if (name.trim() == "") {
        throw new ApiError(400, "Name field is required.")
    }

    const imageLocalPath = req.files?.image[0]?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Image field is required.")
    }

    const image = await uploadOnCloudinary(imageLocalPath)

    const addedProduct = await Product.create({
        name: name,
        image: image.url,
    })

    if (!addedProduct) {
        throw new ApiError(500, "Something went wrong at the server side.")
    }

    return res
    .status(201)
    .json( new ApiResponse(200, addedProduct, "Product added successfully!"))
})

const addClientCat = asyncHandler ( async (req, res) => {

    const { name } = req.body


    if (name.trim() == '') {
        throw new ApiError(400, "Name field is required.")
    }

    const addedClient = await ClientageCategory.create({
        name: name,
    })

    if (!addedClient) {
        throw new ApiError(500, "Something went wrong at the server side.")
    }

    return res
    .status(201)
    .json( new ApiResponse(200, addedClient, "Client Category added successfully!"))
})

const addClient = asyncHandler ( async (req, res) => {

    const {name, category} = req.body

    if (
        [name, category].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "All fields are required.")
    }

    const imageLocalPath = req.files?.image[0]?.path

    if (!imageLocalPath) {
        throw new ApiError(400, "Image is required.")
    }

    const image = await uploadOnCloudinary(imageLocalPath)

    if (!image) {
        throw new ApiError(500, "Image not uploaded on server, problem in the Cloud Image service.")
    }

    const addedClient = await Client.create({
        name: name,
        category: category,
        image: image.url,
    })

    if (!addedClient) {
        throw new ApiError(500, "Something went wrong while adding the Client. Problem in database server.")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, addedClient, "Client added successfully!"))
})


// READ
const getHomeLogo = asyncHandler ( async (req, res) => {

    try {
        const logos = await Logo.find(); // Fetch all data from the Client model
        res.status(200).json({
          success: true,
          message: "Fetched all logos successfully",
          data: logos,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch logos",
          error: error.message,
        });
      }

})

const getProducts = asyncHandler ( async (req, res) => {

    try {
        const products = await Product.find(); // Fetch all data from the Client model
        res.status(200).json({
          success: true,
          message: "Fetched all products successfully",
          data: products,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch products",
          error: error.message,
        });
      }

})

const getClients = asyncHandler ( async (req, res) => {

    try {
        const clients = await Client.find(); // Fetch all data from the Client model
        res.status(200).json({
          success: true,
          message: "Fetched all clients successfully",
          data: clients,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch clients",
          error: error.message,
        });
      }

})

const getClientCategory = asyncHandler ( async (req, res) => {

    try {
        const category = await ClientageCategory.find(); // Fetch all data from the Client model
        res.status(200).json({
          success: true,
          message: "Fetched all client categories successfully",
          data: category,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch categories",
          error: error.message,
        });
      }

})

const getPopup = asyncHandler ( async (req, res) => {

    try {
        const popup = await Popup.findById(popupId); // Fetch all data from the Client model
        res.status(200).json({
          success: true,
          message: "Fetched Popup data successfully",
          data: popup,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch Popup data",
          error: error.message,
        });
      }

})



// EDIT
const updatePopup = asyncHandler ( async (req, res) => {

    const {name, description, price} = req.body

    if (
        [name, description].some( (field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "All fields are required.")
    }

    if (price<0) {
        throw new ApiError(400, "Price can not be negative.")
    }

    const imageLocalPath = req.files?.image[0]?.path

    if (!imageLocalPath){
        throw new ApiError(401, "Image field is required.")
    }

    const data = await Popup.findById(popupId)
    const temp = data.image.split('/').slice(-1)[0].split('.')[0]

    const image = await uploadOnCloudinary(imageLocalPath)

    if(!image) {
        throw new ApiError(500, "IMAGE NOT UPLOADED.")
    }

    const popup = await Popup.findByIdAndUpdate(
        popupId,
        {
            $set: {
                name: name,
                description: description,
                price: price,
                image: image.url
            }
        },
        { new: true }
    )

    await cloudinary.uploader.destroy(temp);
    

    return res
    .status(200)
    .json( new ApiResponse(200, popup, "UPDATED SUCCESSFULLY!"))

})



// DELETE
const deleteHomeLogo = asyncHandler ( async (req, res) => {

    const { id } = req.params;

    try {
        const logo = await Logo.findById(id);
        
        if (!logo) {
            return res.status(404).json({
                success: false,
                message: 'Logo not found'
            });
        }

        await logo.deleteOne();
        
        if (logo.logo) {
            const temp = logo.logo.split('/').slice(-1)[0].split('.')[0]
            await cloudinary.uploader.destroy(temp);
        }

        res.status(200).json({
            success: true,
            message: 'Logo deleted successfully',
            data: logo
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete Logo',
            error: error.message
        });
    }
    
})

const deleteProduct = asyncHandler ( async (req, res) => {
    
    const { id } = req.params;
    
    try {
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'product not found'
            });
        }

        
        if (product.image) {
            const temp = product.image.split('/').slice(-1)[0].split('.')[0]
            await cloudinary.uploader.destroy(temp);
        }

        await product.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Product and associated image deleted successfully',
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
    
})

const deleteClient = asyncHandler ( async (req, res) => {
    
    const { id } = req.params;
    
    try {
        
        const client = await Client.findById(id);
        
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }
        
        if (client.image) {
            const temp = client.image.split('/').slice(-1)[0].split('.')[0]
            await cloudinary.uploader.destroy(temp);
        }
        
        await client.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Client and associated image deleted successfully',
            data: client
        });

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete Client',
            error: error.message
        });
    }
})

const deleteCategory = asyncHandler ( async (req, res) => {
    
    const { id } = req.params;
    
    const category = await ClientageCategory.findById(id);
    
    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found'
        });
    }

    const clients = await Client.find({ category: category })
    
    if (clients.length > 0 ){
        return res.status(400).json({
            success: false,
            message: "Cannot delete category. There are clients associated with this category.",
        });
    }
    
    await category.deleteOne()
    
    res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
    });
    
})


export {
    addHomeLogo,
    addProduct,
    addClientCat,
    addClient,

    getHomeLogo,
    getProducts,
    getClients,
    getClientCategory,
    getPopup,

    updatePopup,
    
    deleteHomeLogo,
    deleteProduct,
    deleteClient,
    deleteCategory,
}