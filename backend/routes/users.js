import express from "express";


import {register} from "../controllers/signup.js";
import {login} from "../controllers/login.js"
const router=express.Router();



router.route("/register").post(register);
router.route("/login").post(login);

export default router;