import express from 'express'
import user from '../controllers/user.js'
import {authMiddleware,isBlocked, isVerified} from '../middlewares/authMiddleware.js'
import {  uploadPhoto } from '../middlewares/uploadImage.js'
import { deleteImage, uploadImage } from '../controllers/upload.js'

const userRouter = express.Router()

// Upload profile picture
userRouter.post('/profile-picture',authMiddleware,isBlocked,isVerified,uploadPhoto.single('image'),uploadImage)

// get user
userRouter.get('/get-user-id/:id',authMiddleware,isBlocked,isVerified,user.getUserId)
userRouter.get('/get-single-user',authMiddleware,isBlocked,isVerified,user.getUser)

// delete picture 
userRouter.delete('/delete-image/:id',authMiddleware,isBlocked,isVerified,deleteImage)

// Send verification email
userRouter.post('/send-verification-email',authMiddleware,isBlocked, user.sendVerificationEmail);
// Verify account - link will be send to the user -
userRouter.get('/verify/:token',authMiddleware,isBlocked, user.verifyUser)

// Add more user informations
userRouter.post('/update-profile',authMiddleware,isBlocked,isVerified,user.updateProfile)

export default userRouter ;