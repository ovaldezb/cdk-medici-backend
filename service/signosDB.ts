import mongoose from 'mongoose';
const Signos = require('../models/signos');


const signosDB = (mongoUri:string)=>{
  mongoose.connect(mongoUri);

  return{
    saveSignos:(params:any)=>{
      return  new Signos({
        paciente : params.paciente,
        peso : params.peso,
        presionCis : params.presionCis,
        presionDias : params.presionDias,
        temperatura : params.temperatura,
        fechaToma : params.fechaToma,
      }).save()
      .then((signosSaved:any) =>{
        return {signos:signosSaved};
      })
      .catch((err:any) =>{
        return {error:err};
      });
    },
    updateSignos:(idSignos:string,signos:any)=>{
      return Signos.findOneAndUpdate({_id:idSignos},signos,{new:true})
      .then((signosUpdated:any) =>{
        console.log('Updated',signosUpdated);
        return {signos:signosUpdated};
      })
      .catch((err:any)=>{
        console.log('Error en update signos:',err);
        return {error:err};
      })
    }
  };
}

module.exports = signosDB;