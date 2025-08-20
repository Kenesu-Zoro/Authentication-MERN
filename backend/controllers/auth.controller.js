import express from "express";
import { User } from '../models/user.model.js'
import bcrypt from 'bcrypt';

export const defaultPage = async (req, res) => {
    res.send("Welcome to the Authentication API");
}

export const signUp = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        try {
            if (!email || !password || !name) {
                throw new Error("All credentials are required")
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


    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
};

export const login = async (req, res) => {
    res.send("LOGIN");
}

export const logout = async (req, res) => {
    res.send("LOGOUT");
}
