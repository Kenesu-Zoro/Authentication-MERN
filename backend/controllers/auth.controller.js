import express from "express";
import { User } from '../models/user.model.js'
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail , sendPasswordResetEmail} from "../mailtrap/emails.js";

export const defaultPage = async (req, res) => {
    res.send("Welcome to the Authentication API");
}

export const signUp = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        try {

            if (!email || !password || !name) {
                throw new Error("All credentials are required");
            }

            const userAlreadyExists = await User.findOne({ email });

            if (userAlreadyExists) {
                return res.status(400).json({ success: false, message: "User already exists!" })
            }

        } catch (error) {
            return res.status(401).json({ success: false, message: error.message })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();


        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })

        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);
        //mailtrap
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            user: {
                ...user._doc,
                password: undefined
            }
        });


    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: "Verification code is required" });
    }

    try {
        const user = await User.findOne(
            {
                verificationToken: code,
                verificationTokenExpiresAt: { $gt: Date.now() }
            }
        )

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true, message: "Email verified successfully", user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email })
        // console.log("User:", user);
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid Credentials1" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials2" });
        }

        await generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();

        await user.save();

        res.status(200)
            .json({
                success: true,
                message: "Logged in successfully",
                user: {
                    ...user._doc,
                    password: undefined
                }
            });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const forgotPassword = async ( req, res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 900 * 1000; // 15 minutes

        await user.save();

        //send email
        await sendPasswordResetEmail(user.email, `http://localhost:5173/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset email sent" });

    } catch (error) {
        console.error("Error sending password reset email", error);
        throw new Error(`Error sending email ${error}`)
    }
}