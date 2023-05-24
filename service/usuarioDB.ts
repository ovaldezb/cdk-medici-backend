import mongoose from "mongoose";
const Usuario = require('../models/usuario');

const usuariosDB = (mongoUri:string)=>{
  mongoose.connect(mongoUri,{ });
  return{
    getAllUsers:(params:any)=>{
      return Usuario.find()
      .then((listaUsuarios:any)=>{
        return {usuarios:listaUsuarios}
      })
      .catch((error:any)=>{
        console.log(error);
        return {error:error}
      })
    },
    deleteUserDB:(idUsuario:string)=>{
      return Usuario.findOneAndDelete({_id:idUsuario})
      .then((deletedUsuario:any)=>{
        return deletedUsuario;
      })
      .catch((error:any)=>{
        console.log(error);
        return {error:error}
      })
    }
  }

}

module.exports = usuariosDB;