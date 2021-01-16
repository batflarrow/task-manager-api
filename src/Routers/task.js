const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth=require('../middleware/auth')


router.post('/tasks',auth,async (req, res) => {
    // const task = new Task(req.body)
    const task=new Task(
        {
            ...req.body,
            owner:req.user._id
        }
    )
try{
await task.save()
res.status(201).send(task)
}catch(error)
{
    res.status(400).send()
}


})


//GET /tasks?completed=true||false
//GET /tasks?limit=12&skip=2
// /tasks?sortBy=createdAt_asc||_dsc
router.get('/tasks',auth,async (req,res)=>{
    
    const completed=req.query.completed
    const match={}
    const sort={}
    
    if(req.query.sortBy)
    {
        const parts=req.query.sortBy.split('_')
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }


        if(completed)
        {   if(completed=="true")
            match.completed=true
            else
            match.completed=false
        }
    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        // const tasks=await Task.find({})
        res.status(200).send(req.user.tasks)
    }catch(e)
    {
        res.status(500).send()
    }

    

    
})


router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id

    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
       
        return res.status(404).send()
      }

      try{
        const task=await Task.findOne({_id,owner:req.user._id})
        if(!task)
            {   
                return res.status(404).send()
            }
            res.send(task)
      }catch(e)
      {
          res.status(500).send(e)
      }


})


router.patch('/tasks/:id',auth,async (req,res)=>{
const _id=req.params.id
const updates=Object.keys(req.body)
const validUpdates=['description','completed']

const isValidOperation=updates.every((update)=>validUpdates.includes(update))

if(!isValidOperation){
return res.status(400).send({error:"Invalid updates"})
}
if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
       
    return res.status(404).send()
  }
try{

    const task=await Task.findOne({_id,owner:req.user._id})
   
    if(!task)
    {
       return res.status(404).send()
    }
  
    // const task=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
    updates.forEach((update) =>task[update]=req.body[update])
    await task.save()
    res.send(task)

}catch(e)
{   console.log(e)
    res.status(400).send(e)
}

})


router.delete('/tasks/:id',auth,async (req,res)=>{

const _id=req.params.id
if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
       
    return res.status(404).send()
  }

  try{
    const task = await Task.findOneAndDelete({_id,owner:req.user._id})

    if(!task)
    {
       return res.status(404).send()
    }
    res.send(task)
  }
  catch(e)
  {
      res.status(500).send()
  }



})



module.exports=router