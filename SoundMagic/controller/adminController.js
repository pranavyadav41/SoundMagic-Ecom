const User =require('../model/userModel');
const bcrypt = require('bcrypt');


const loadLogin = async(req,res)=>{
    try {
        res.render('adminLogin')
    } catch (error) {
        
        console.log(error.message);
    }
}

const insertAdmin = async(req,res)=>{
    const email = req.body.email;
    const password =req.body.password;
    try {
        const user = await User.findOne({email});
        // const admin = await User.findOne({isAdmin:'true'})

        if(!user){
            res.render('adminLogin',{error:"Invalid Email or Password"})
        }else if(!user.isAdmin){
            res.render('adminLogin',{error:"Oops! you are not admin."})
        }

        const passwordMatch = await bcrypt.compare(password,user.password);
        if(passwordMatch){
            req.session.user_id = user._id
            res.redirect('/admin/dashboard')
        }else{
            res.render('adminLogin',{error:"Invalid Email or Password"})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async(req,res)=>{
    try {
        res.render('index')
    } catch (error) {
        console.log(error.message);
    }
}

const loadUsers = async(req,res)=>{
    try {
        var search = '';
        if(req.query.search){
            search = req.query.search;
        }
        const user = await User.find({
            $or:[{firstname:{$regex:'.*'+search+'.*',$options:'i'}},
                 {lastname:{$regex:'.*'+search+'.*',$options:'i'}},
                 {email:{$regex:'.*'+search+'.*',$options:'i'}},
                 {mobile:{$regex:'.*'+search+'.*',$options:'i'}}]
        });
        res.render('userList',{user})
      
        
    } catch (error) {
        console.log(error.message);
    }
}

// blocking 
const userBlock = async (req, res) => {
    try {

        const userID = req.params.userID
        const user = await User.findOne({ _id: userID })
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.isBlocked = true;
        await user.save()
        res.json({ message: 'User blocked successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}

// unblocking
const userUnblock = async (req, res) => {
    try {

        const userID = req.params.userID

        const user = await User.findOne({ _id: userID })
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.isBlocked = false;
        await user.save()
        res.json({ message: 'User Unblocked successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}

const adminLogout = async(req,res)=>{
    try {

        req.session.destroy();
        res.redirect('/admin')
        
    } catch (error) {
        
        console.log(error.message)
    }
}



module.exports = {
    loadLogin,
    insertAdmin,
    loadUsers,
    loadDashboard,
    userBlock,
    userUnblock,
    adminLogout
}
