import bcrypt from "bcryptjs"
import  User  from "../models/user_models.js"
import jwt from "jsonwebtoken"
import uploadImageDb from "../db_imageUpload/profileUpload.js"
import Post from "../models/Post_models.js"
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "something is missing please check..!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "this id have already account",
                success: false,
            });
        }
        const hashedpassword = await bcrypt.hash(password, 10)
        await User.create({
            username,
            email,
            password: hashedpassword,
        });
        return res.status(201).json({
            message: "account created succesfuly ",
            success: true,
        });

    } catch (error) {
        console.log("error at registor controller", error)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "something is missing please check..!",
                success: false,
            });
        }

        let user = await User.findOne({ email })
      //  console.log(user);
        if (!user) {
            return res.status(401).json({
                message: "dont have account ...!",
                success: false,
            })
        }
      //  console.log(password,user.password)
        const isPasswordMatch = await bcrypt.compare(password, user.password);
       // console.log(isPasswordMatch)
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "incorrect password",
                success: false,
            })
        }
        // popolet 
        const populatePosts= await Promise.all(
            user.posts.map(async(postId)=>{
                const post =await  Post.findById(postId);
                if(post.auther.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio,
            follower: user.follower,
            following: user.following,
            posts: populatePosts
        }

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 1000 }).json({
            message: `welcome back ${user.username}`,
            success: true,
            user
        })

    }
    catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: " logout succesfully",
            success: true,

        })
    } catch (error) {
        console.log(error);
    }
}
