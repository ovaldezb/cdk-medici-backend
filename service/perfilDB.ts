import mongoose from "mongoose";
const Perfil = require('../models/perfil');

const perfilDB = (mongoUri:any)=>{
  mongoose.connect(mongoUri);
  return {
    savePerfilDB:(params:any)=>{
      return new Perfil({
        nombre: params.nombre
      })
      .save()
      .then((savedPerfil:any)=>{
        return {perfil:savedPerfil}
      })
      .catch((error:any)=>{
        console.log(error);
        return {error:error}
      });
    },
    findAllPerfilesDB:(params:any)=>{
      return Perfil.find()
        .then((perfiles:any)=>{
          return {perfiles:perfiles}
        })
        .catch((error:any)=>{
          console.log(error);
          return {error:error}
        });
    },
    updatePerfilDB:(idPerfil:any, perfil:any)=>{
      return Perfil.findOneAndUpdate({_id:idPerfil}, perfil, {new:true})
      .then((updatedPerfil:any)=>{
        return {perfil:updatedPerfil}
      })
      .catch((error:any)=>{
        console.log(error);
        return {error:error}
      });
    },
    deletePerfilDB:(idPerfil:string)=>{
      return Perfil.findOneAndDelete({_id:idPerfil})
      .then((deletedPerfil:any)=>{
        return deletedPerfil;
      })
      .catch((error:any)=>{
        console.log(error);
        return {error:error}
      });
    }
  }
}

module.exports = perfilDB;