import UserModel from './models/user.model.js'

export default class UserMongoDAO {


 static async findUserById (uid) {
    return await UserModel.findById(uid)
 }


 static async getUsers () {
    return await UserModel.find({})
 }      

 static async createUser (newUser){    
    return await UserModel.create(newUser)
}

static async updateUser (uid,body){
    return await UserModel.updateOne({_id: uid }, { $set: body })
}

static async deleteUser (uid){
    return await UserModel.deleteOne({ _id: uid })
}


} 