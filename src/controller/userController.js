let usermodel = require("../model/userModel.js");
let categoryModel = require("../model/productModel.js");
let bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "#4545#";

exports.homePage = async (req, res) => {
    try {
        let user = null;

        if (req.user && req.user.email) {
            const data = await usermodel.verifyUserData(req.user.email);
            if (data && data.length > 0) {
                user = data[0];
            }
        }
        const categories = await categoryModel.getAllCategories(); 
        const subcat=await categoryModel.getAllSubCategories();
        res.render("Home.ejs", {
            user: user,
            categories: categories,
            subcategories: subcat
        });
    } catch (err) {
        res.render("Home.ejs", {
            user: null,
            categories: [],
            subcategories: [],
            msg: "Something went wrong while loading home page."
        });
    }
};

exports.LoginPage = (req, res) => {
    res.render("login.ejs", { msg: null });
};

exports.RegisterPage = (req, res) => {
    res.render("Register.ejs", { msg: null });
};

exports.SaveUserData = async (req, res) => {
    
    try {
        const { name, email, password, age } = req.body; 
        const photo = req.file?.filename || "default.jpg";
        const created_at = new Date().toISOString().slice(0, 10);
        const type = "user";

        const existingUser = await usermodel.verifyUserData(email);
        if (existingUser && existingUser.length > 0) {
            return res.render("Register.ejs", { msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await usermodel.SaveUserData(name, email, hashedPassword, age, photo, type, created_at); 

        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token);

        return res.redirect("/userProfile");

    } catch (err) {
        res.render("Register.ejs", { msg: "Error: " + err.message });
    }
};


exports.LoginUserData = async (req, res) => {
    try {
        const { email, password, type } = req.body; 


        let user;
        let isMatch;

        if (type === "admin") {
            user = await usermodel.verifyUserData(email);
        } else {
            user = await usermodel.verifyUserData(email);
        }
        if (!user || user.length === 0) {
            return res.render("login.ejs", { msg: "Invalid email or password" });
        }

        if (type === "admin") {
             isMatch = password===user[0].password;
            
        } else {
             isMatch = await bcrypt.compare(password, user[0].password);
        }
        
        if (!isMatch) {
            return res.render("login.ejs", { msg: "Invalid email or password" });
        }

        const token = jwt.sign({ email: user[0].email }, SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token);

        if (type === "admin") {
            return res.redirect("/adminDashboard");
        } else {
            return res.redirect("/userProfile");
        }

    } catch (err) {
        console.error("Login error:", err);
        res.render("login.ejs", { msg: "Error: " + err.message });
    }
};

exports.userProfile = async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    
    if (!req.user || !req.user.email) 
        {
            return res.redirect("/login");
        }
    try {
        const user = await usermodel.verifyUserData(req.user.email);
        if (user && user.length > 0) {
            console.log("User found:", user[0]);
            res.render("UserProfile.ejs", { user: user[0] });
        } else {
            console.log("User not found");
            return res.redirect("/login");
        }
    } catch (err) {
        res.render("login.ejs", { msg: "Something went wrong!" });
    }
};

exports.adminDashboard = async (req, res) => {
    if (!req.user || !req.user.email) return res.redirect("/login");

    try {
        const user = await usermodel.verifyUserData(req.user.email);
        if (user && user.length > 0 && user[0].type === "admin") {
            return res.render("AdminPage.ejs", { user: user[0] });
        } else {
            return res.redirect("/login");
        }
    } catch (err) {
        res.render("login.ejs", { msg: "Something went wrong!" });
    }
};

exports.logoutUser = (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
};

exports.ShowUserProfile = async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    if (!req.user || !req.user.email) return res.redirect("/login");

    try {
        const user = await usermodel.verifyUserData(req.user.email);
        console.log("User data for profile:", user);
        if (user && user.length > 0 ) {
             res.render("ProfilePage.ejs", { user: user[0] });
        } else {
            console.log("User not found");
            return res.redirect("/login");
        }
    } catch (err) {
        res.render("login.ejs", { msg: "Something went wrong!" });
    }
}