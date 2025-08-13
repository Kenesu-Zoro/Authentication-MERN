import express from "express";

export const defaultPage = async(req,res) => {
    res.send("Welcome to the Authentication API");
}

export const signUp = async(req,res) => {
    res.send("SIGNUP");
}

export const login = async(req,res) => {
    res.send("LOGIN");
}

export const logout = async(req,res) => {
    res.send("LOGOUT");
}

