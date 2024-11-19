import {Router} from 'express'
import {upload} from '../middlewares/multer.middleware.js'

import {addClient, addClientCat, addHomeLogo, addProduct, deleteCategory, deleteClient, deleteHomeLogo, deleteProduct, getHomeLogo, getProducts, getClients, getClientCategory, getPopup, updatePopup} from "../controllers/controller.js"

const router = Router()


// CREATE ROUTES
router.route("/addHomePageLogo").post(upload.single('logo'), addHomeLogo)
router.route("/addProduct").post(upload.single('image'), addProduct)
router.route("/addClientCategory").post(addClientCat)
router.route("/addClient").post(upload.single('image'), addClient)

// READ ROUTES
router.route("/getHomeLogo").get(getHomeLogo)
router.route("/getProducts").get(getProducts)
router.route("/getClients").get(getClients)
router.route("/getClientCategory").get(getClientCategory)
router.route("/getPopup").get(getPopup)

// UPDATE ROUTES
router.route("/editPopup").patch(upload.single('image'), updatePopup)


// DELETE ROUTES
router.delete('/deleteLogo/:id', deleteHomeLogo);
router.delete('/deleteProduct/:id', deleteProduct);
router.delete('/deleteClient/:id', deleteClient);
router.delete('/deleteCategory/:id', deleteCategory);

export default router;