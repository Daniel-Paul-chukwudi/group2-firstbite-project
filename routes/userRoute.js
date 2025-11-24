const {signUp,verifyUser,signIn,forgotPassword,resetPassword, changePassword, getOne, getAll, updateUser} = require('../controllers/UserController')
const express = require('express')
const router = express.Router()
const {signUpValidator,signInValidator,forgotPasswordValidator,resetPasswordValidator,changePasswordValidator} = require('../middleware/validator')

/**
 * @swagger
 * /signUp:
 *   post:
 *     summary: Create a new user account
 *     description: Registers a new user, checks for duplicate email/phone, hashes password, generates OTP, and sends verification email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - confirmPassword
 *               - phoneNumber
 *               - deliveryAddress
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               confirmPassword:
 *                 type: string
 *                 example: "Password123!"
 *               phoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *               deliveryAddress:
 *                 type: string
 *                 example: "14 Broad Street, Lagos Island"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 data:
 *                   type: object
 *                   description: Newly created user object
 *                 token:
 *                   type: string
 *                   description: JWT verification token
 *       400:
 *         description: Bad request — duplicate email, duplicate phone, or password mismatch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "email is already in use"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.post('/signUp',signUpValidator,signUp)

/**
 * @swagger
 * /verify/{token}:
 *   post:
 *     summary: Verify user email using OTP and token
 *     description: 
 *       Verifies a user's email address by validating the JWT token and comparing the submitted OTP with the one sent to the user's email.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: JWT verification token sent to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "4829"
 *     responses:
 *       200:
 *         description: Email verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email verification successful"
 *       400:
 *         description: Invalid or expired token, wrong OTP, or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     emailExpired:
 *                       value: "Email Expired"
 *                     otpExpired:
 *                       value: "OTP expired"
 *                     invalidOtp:
 *                       value: "Invalid otp"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Unexpected server failure"
 */
router.post('/verify/:token',verifyUser)

/**
 * @swagger
 * /signIn:
 *   post:
 *     summary: User Sign-In
 *     description: Authenticates a user using email and password. Ensures account is verified before login.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome John Doe we are happy to see you"
 *       400:
 *         description: Missing fields or invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     missingEmail:
 *                       value: "Please enter your email"
 *                     invalidCredentials:
 *                       value: "invalid login credentials"
 *       403:
 *         description: Email not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kindly verify your email to continue"
 *       404:
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "invalid login credentials"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Unexpected server failure"
 */
router.post('/signIn',signInValidator,signIn)

/**
 * @swagger
 * /forgot:
 *   post:
 *     summary: Request a password reset
 *     description: Sends a password reset email containing a verification link. The link expires in 5 minutes.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "check your email for further instructions"
 *       400:
 *         description: Email does not exist in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "email does not exist"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "internal server error"
 *                 error:
 *                   type: string
 *                   example: "Unexpected failure during request"
 */
router.post('/forgot',forgotPasswordValidator,forgotPassword)

/**
 * @swagger
 * /reset/{token}:
 *   post:
 *     summary: Reset a user's password
 *     description: Resets the user's password after verifying the reset token. Token expires in 5 minutes.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Password reset JWT token sent via email
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "NewPass123!"
 *               confirmPassword:
 *                 type: string
 *                 example: "NewPass123!"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "password successfully changed"
 *       400:
 *         description: Invalid token or mismatched passwords
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "passwords do not match"
 *       500:
 *         description: Server error during password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "internal server error"
 *                 error:
 *                   type: string
 */
router.post('/reset/:token',resetPasswordValidator,resetPassword)

/**
 * @swagger
 * /change/{id}:
 *   post:
 *     summary: Change a user's password
 *     description: Allows a logged-in user to change their current password by providing the old password and a new one.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID of the account whose password is being changed
 *         schema:
 *           type: string
 *           example: "67a1b23f8e4c9a12b4567890"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 description: Current password
 *                 example: "OldPass123!"
 *               newPassword:
 *                 type: string
 *                 description: New desired password
 *                 example: "NewStrongPass123!"
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password
 *                 example: "NewStrongPass123!"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: New passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Passwords do not match"
 *       404:
 *         description: User not found or current password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     userNotFound:
 *                       value: "user not found"
 *                     wrongPassword:
 *                       value: "Invalid current password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "internal server error"
 *                 error:
 *                   type: string
 */
router.post('/change/:id',changePasswordValidator,changePassword)

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Fetch a single user by ID
 *     description: Retrieves the details of a user using their unique ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *           example: "67a1b23f8e4c9a12b4567890"
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user found"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67a1b23f8e4c9a12b4567890"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+2348012345678"
 *                     deliveryAddress:
 *                       type: string
 *                       example: "123 Example Street, Lagos, Nigeria"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Missing userId in request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "userId required"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "internal server error"
 *                 error:
 *                   type: string
 *                   example: "MongoError: something went wrong"
 */
router.get('/user/:id',getOne)

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Fetch all users
 *     description: Retrieves a list of all users in the database.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of all users or an empty database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All users in DB"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "67a1b23f8e4c9a12b4567890"
 *                       fullName:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "johndoe@example.com"
 *                       phoneNumber:
 *                         type: string
 *                         example: "+2348012345678"
 *                       deliveryAddress:
 *                         type: string
 *                         example: "123 Example Street, Lagos, Nigeria"
 *                       isVerified:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "internal server error"
 *                 error:
 *                   type: string
 *                   example: "MongoError: something went wrong"
 */
router.get('/user',getAll)

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update a user
 *     description: Updates the details of a specific user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *           example: "67a1b23f8e4c9a12b4567890"
 *     requestBody:
 *       description: Fields to update for the user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "janedoe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               deliveryAddress:
 *                 type: string
 *                 example: "456 Example Avenue, Lagos, Nigeria"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67a1b23f8e4c9a12b4567890"
 *                     fullName:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       example: "janedoe@example.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+2348012345678"
 *                     deliveryAddress:
 *                       type: string
 *                       example: "456 Example Avenue, Lagos, Nigeria"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "MongoError: something went wrong"
 */
router.patch('/user/:id',updateUser)


module.exports = router




