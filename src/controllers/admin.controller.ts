import Admin from "@/models/admin.model";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import secrets from "@/config/secrets";
import User from "@/models/user.model";

 // Extract email and password from the request body
export const Adminlogin = async (req, res) => {
  try {
  // Extract email and password from the request body   
    const { email, password } = req.body;

    // Check if a user with the provided email exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      // User with the provided email exists, so this is a login attempt
      if (password === existingAdmin.password) {
        return res.status(200).json({ message: "Login successful" });
      } else {
        return res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      // User with the provided email doesn't exist, so this is a signup attempt
      // You should hash the password before saving it in a production environment
      // For educational purposes, we're storing it as plain text here
      const newAdmin = new Admin({
        email,
        password, // You should hash the password here in a production environment
      });
// Save the new admin to the database
      await newAdmin.save();
// Respond with a success message      
      return res.status(201).json({ message: "Signup successful" });
    }
  } catch (error) {
    // Handle errors during login/signup
    console.error("Error occurred during login/signup:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request" });
  }
};


// Controller function for Admin logout
export const AdminlogOut = async (req, res) => {
  // Clear the cookie and respond with a success message
  res.cookie(secrets.token, null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout User Successfully",
  });
};


export const edit = async (req, res) => {
  try {
   // Extract email and password from the request parameters and body  
    const email = req.params.email;
    const { password } = req.body;

    // Find the user by email
    const user = await Admin.findOne({ email });
    console.log(user)

    if (!user) {
      // Admin not found, respond with a 404 error
      return res.status(404).json({ error: 'Email not found' });
    }

    // Update the user's password
    user.password = password;

    // Save the updated user to the database
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    // Handle errors during password update
    res.status(500).json({ message: 'An error occurred while updating the password' });
  }
};
