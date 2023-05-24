import mongoose from 'mongoose';
const Medico = require('../models/medico');

const medicoDB = (mongoUri:string)=>{
  const connectionHandler = mongoose.connect(mongoUri);

  return {
    close: ()=>{
      mongoose.connection.close();
    },
    save:(params:any)=>{
      const medico = new Medico({
        nombre: params.nombre,
        especialidad: params.especialidad
      }).save()
      return {medico:medico};
    },
    getMedicoById:(idMedico:any)=>{
      return Medico.findById(idMedico)
      .then((medico:any) =>{
        return {medico:medico};
      }).catch((err:any)=>{
        return err;
      });
    },
    getAllMedicos:()=>{
      return Medico.find()
      .then((medicos:any) =>{
        return {medicos:medicos};
      })
      .catch((error:any) =>{
        console.log(error)
        return {error:error};
      })
    },
    updateMedicoDB:(idMedico:string, medico:any)=>{
      const body = JSON.parse(medico)
      return Medico.findOneAndUpdate({_id:idMedico},body,{new:true})
      .then((updatedMedico:any)=>{
        return {medico:updatedMedico};
      })
      .catch((error:any)=>{
        console.log(error)
        return {error:error};
      })
    },
    delete:(idMedico:string)=>{
      return Medico.findOneAndDelete({_id:idMedico})
      .then((deletedMedico:any)=>{
        return deletedMedico;
      })
      .catch((error:any)=>{
        console.log(error)
        return {error:error};
      })
    }
  }

}

module.exports = medicoDB;