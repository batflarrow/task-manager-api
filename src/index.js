const express = require('express')
require('./db/mongoose')//used for running the file mongoose
const app = express()
const userRouter = require('./Routers/user')
const tasksRouter = require('./Routers/task')

const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(tasksRouter)

app.listen(port, () => {
    console.log('Server is up on port ', port)
})

// app.use((req,res,next)=>{
//     if(req.method=='GET')
//     {
//         res.send('Get requests are diabled')
//     }
//     else{
//         next()

//     }

// })

// app.use((req,res,next)=>{
//     res.status(503).send('Sorry for the inconvenince Our site will resume shortly')
// })

// const multer=require('multer')

// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//         fileFilter(req,file,cb)  {
//             // !file.originalname.endsWith('.pdf')||
//             if((!file.originalname.match(/\.(doc|docx)$/)))
//             {return cb(new Error('It must be a word file'))

//         }

//             cb(undefined,true)



//         }

// })
// app.post('/upload',upload.single('upload'),(req,res)=>{

//     res.send()

// })


// const main=async()=>{
// const user=await User.findById('5ffb3e7b58c1dd152468953f')
// await user.populate('tasks').execPopulate()
// console.log(user.tasks)


// }

// main()

// const jwt=require('jsonwebtoken')
// const myfunction=async()=>{
//    const token= await  jwt.sign({_id:'abc123'},'heyboishowareyou',{'expiresIn': '7 days'})

//    console.log(token)

//    const data=jwt.verify(token,'heyboishowareyou')
//    console.log(data)
// }
// myfunction()


// }



    // Task.findById(_id).then((task)=>{
    //     if(!task)
    //     {   
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{

    //     res.status(500).send(e)

    // })

    // Task.find({}).then((tasks)=>{
    //     res.status(200).send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })

    // User.findById(_id).then((user)=>{
//     if(!user)
//     {
//     return res.status(404).send(user)
//     }
//     res.send(user)
// }).catch((e)=>{
//     console.log(e)
//    res.status(500).send(e)
// })

// User.find({}).then((users) => {

    //     res.send(users)

    // }).catch((error) => {

    //     res.status(500).send()

    // })
     // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })