import express from 'express';
import { signUp, login, logout, defaultPage, verifyEmail } from '../controllers/auth.controller.js';

const Router = express.Router();

Router.route("/").get(defaultPage);  // useful to chain requests to the same endpoint.
Router.route("/signup").post(signUp);
Router.route("/login").post(login);
Router.route("/logout").post(logout);  
Router.route("/verify-email").post(verifyEmail); 

// Router.get("/", defaultPage); best for single method of request.

export default Router;