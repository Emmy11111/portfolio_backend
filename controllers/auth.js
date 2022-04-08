const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.Register = async(req,res)=>{
 try{
     req.body.email = req.body.email.toLowerCase();
     let userExist = await User.find({email: req.body.email});
     if(userExist.length<=0){

        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(
                          `${req.body.password}`,
                          salt
                        );
                        req.body.password = hash;

         let saveUser = new User(req.body);
         let userInfo = await saveUser.save();

        const userId = userInfo._id;
        const token = jwt.sign(
          { userId },
          "e-portfolio-2022-api-tkn"
        );
     
         return res.status(200).send({user: userInfo,token: token});
     }else{
         return res.status(200).send({message: `Email had already taken, please try different email address`})
     }

 }
 catch(error){
     console.log(error)
     return res.status(400).send(error);
 }
}

exports.Login = (req, res) => {
    let { email, password } = req.body;
    email = req.body.email.toLowerCase()
  
    User.findOne({ email }).then((result) => {
      if (result) {
        let dbPass = result.password;
        const valid = bcrypt.compareSync(`${password}`, dbPass);
  
        if (valid) {
          const userId = result._id;
          const token = jwt.sign(
            { userId },
            "e-portfolio-2022-api-tkn"
          );
  
          return res.send({ error: false, token: token, user: result });
        } else {
          return res.send({ error: "Incorrect email or password" });
        }
      } else {
        return res.send({ error: "Incorrect email or password" });
      }
    });
  };

exports.getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      return res.status(200).send(user);
    } catch (error) {
      return res.status(404).send(error.message);
    }
};

exports.getAllUsers = async (req, res) => {
  try{
     let users = await User.find({});
     res.status(200).send(users);
 }
 catch(error){
     console.log(error)
     return res.status(400).send(error);
 }
};