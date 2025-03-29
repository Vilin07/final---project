

const user= require("../models/user.js")



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