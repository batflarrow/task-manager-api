const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp = require('sharp');
const {sendWelcomeEmail,sendGoodByEmail}=require('../emails/account')



router.post('/users', async (req, res) => {
    
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
       console.log(error)
        res.status(400).send(error)
    }
})


router.post('/users/login', async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({user:user,token})
    } 
    catch(e)
    {   console.log(e)
        res.status(400).send(e)
    }
})


router.post('/users/logout',auth,async (req,res)=>{

    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()

        res.send()
    }
    catch(e){
        console.log(e)
            res.status(500).send()
    }   

})


router.post('/users/logoutall',auth,async(req,res)=>{
try 
{
req.user.tokens=[]
await req.user.save()
res.status(200).send()
}
catch(e)
{   console.log(e)
    res.status(500).send()
}
})


router.get('/users/me',auth,async (req, res) => {

    res.send(req.user)
})

// router.get('/users/:id',auth, async (req, res) => {
//     const _id = req.params.id

//     if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
//         return res.status(404).send()
//     }

//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send(user)
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// }) not needed bitch

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: "Invalid updates"
        })
    }
    try {   
        //c 
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.status(200).send(req.user)

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
router.delete('/users/me',auth, async (req, res) => {
    
    try {
        await req.user.remove()
        sendGoodByEmail(req.user.email,req.user.name)
         res.send(req.user) 
    } catch (e) {
       console.log()
        res.status(500).send(e)
    }
})
const upload=multer({
    // dest:'avatar',
    limits:{
    fileSize:1000000
    },
    fileFilter(req,file,callback){

        if(!file.originalname.match(/\.(jpg||jpeg||png)$/))
        return callback(new Error('The file uploaded must be an image'))

        callback(undefined,true)
    }
})


router.post('/users/me/avatar',auth ,upload.single('avatar'),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth ,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
    // const _id=req.params.id
    // if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
    //         return res.status(404).send()
    //     }

    try{
        const user =await User.findById(req.params.id)
        if(!user||!user.avatar)
        throw new Error('User and user image not found')

        res.set('Content-Type','image/png')

        res.status(200).send(user.avatar)
    }
    catch(error)    
    {   
        res.status(404).send(error)
    }
})
module.exports = router

// const _id = req.user._id.toString()
    // if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
    //     return res.status(404).send()
    // }
 // const user = await User.findByIdAndDelete(_id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        // res.send(user)
