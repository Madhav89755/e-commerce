const UserModel=require('./userModel')


UserModel.sync({ alter: true }).then(()=>{
    console.log("User model sync success");
}).catch(err=>{
    console.log("User model sync error", err);
})

module.exports = {
    UserModel
}