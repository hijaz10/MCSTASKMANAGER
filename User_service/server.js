const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())

mongoose.connect('mongodb://mongo:27017/users').then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(`mongoDB connection faiure: ${err}`))

const User = new mongoose.Schema({
  name: {type: String, required:true},
  email: {type: String, required:true, unique: true},
  password: {type: String, required:true},

})

const Users = mongoose.model('Users', User)

app.post('/users', async (req, res) => {
  const {name, email, password } = req.body;

  try{
    const hashedpass = await bcrypt.hash(password, 10)

    const user = new Users({name, email, password:hashedpass})

    await user.save()
    res.status(201).json({Message: 'Registration was succesfull',
       user:{
          name,
          email,
          password:hashedpass
       }})
  }catch(error){
    console.error(error)
    res.status(500).json({error: 'Internal server error'})
  }

})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/users', async ( req, res) => {
  const users = await Users.find()
  res.json(users);
})

app.listen(port, () => {
  console.log(`User service listening on port ${port}`)
})
