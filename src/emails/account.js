const sgMail=require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'dwivedia2001@gmail.com',
        subject:'Welcome to Task-manager app',
        text: `Welcom to the app, ${name}. Let me know how are you getting along with the app`
        })
        

}

const sendGoodByEmail=(email,name)=>{

    sgMail.send({
        to:email,
        from:'dwivedia2001@gmail.com',
        subject:'Bye bye from the task-manager app',
        text:`It was fun serving you ${name}, We hop taht you enjoyed using our service too :). Do tell us why you cancelled` 
    })

}


module.exports={
    sendWelcomeEmail,
    sendGoodByEmail
}


// sgMail.send({
// to:'dwivedia2001@gmail.com',
// from:'dwivedia2001@gmail.com',
// subject:'This is my first creation',
// text: 'I hope this actually gets to you'
// })


