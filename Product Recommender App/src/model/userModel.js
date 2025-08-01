let db=require("../../db.js")
exports.verifyUserData=(email)=>{
    return new Promise((resolve,reject)=>{
         db.query("select * from users where email=?",[email],(err,result)=>{
            if(err)
            {
                reject(err)
            }
            else{
        
                resolve(result)
            }
         })
    })
}
exports.SaveUserData=(name, email, password, age, photo, type, created_at)=>{
    return new Promise((resolve,reject)=>{
        db.query("insert into users values('0',?,?,?,?,?,?,?)",[name,email,password,age,photo,type,created_at],(err,result)=>{
            if(err)
            {    console.log(err)
                reject("Does not store Data")
            }else{
                console.log(result)
                resolve("Store Data Successfully");
            }
        })
    })
}