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
    updateSignos:(req:any)=>{
      let idSignos = req.pathParameters.idSignos;
      return Signos.findOneAndUpdate({_id:idSignos},JSON.parse(req.body),{new:true})
      .then((signosUpdated:any) =>{
        return {signos:signosUpdated};
      })
      .catch((err:any)=>{
        console.log(err);
        return err;
      })
    }
  };
}

module.exports = signosDB;