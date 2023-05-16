import mongoose from 'mongoose';
const Cita = require('../models/citas');


const citaDB = (mongoUri:string)=>{
  const connectionHandler = mongoose.connect(mongoUri,{ });

  return {
    save:(params:any)=>{
      return new Cita({
        paciente : params.paciente,
        medico : params.medico,
        //signos : params.signos,
        fechaCita : params.fechaCita,
        horaCita : params.horaCita,
        duracion : params.duracion,
        isSignosTomados : params.isSignosTomados
      }).save()
      .then((citaSaved:any) =>{
        return {cita:citaSaved};
      })
      .catch((err:any)=>{
        return err;
      })
    },
    getCitasByFecha:(fechaFiltro:string)=>{
      return Cita.find(
        {
          fechaCita:{'$gte':`${fechaFiltro}T00:00:00.000Z`,'$lt':`${fechaFiltro}T23:59:59.999Z`}
        })
      .sort({horaCita:1})
      //.populate('medico')
      .populate('paciente')
      //.populate('signos')
      .then((allCitas:any)=>{
        return {citas:allCitas};
      })
      .catch((err:any)=>{
        return err;
      });
    },
    getCitasByFechaAndMedico:(fechaFiltro:string, idMedico:string)=>{
      return Cita.find(
        {
          fechaCita:{'$gte':`${fechaFiltro}T00:00:00.000Z`,'$lt':`${fechaFiltro}T23:59:59.999Z`},
          medico:{_id:idMedico}
        })
      .sort({horaCita:1})
      //.populate('medico')
      .populate('paciente')
      //.populate('signos')
      .then((allCitas:any)=>{
        return {citas:allCitas};
      })
      .catch((err:any)=>{
        return err;
      });
      
    },
    updateCita:(idCita:string, cita:any)=>{
      const body = JSON.parse(cita);
      return Cita.findOneAndUpdate({_id:idCita},body,{new:true})
      .then((citaUpdate:any)=>{
        return {cita:citaUpdate};
      })
      .catch((err:any)=>{
        return err;
      });
    },
    deleteCita:(idCita:string)=>{
      return Cita.findOneAndDelete({_id:idCita})
      .then((deleteCita:any)=>{
        return deleteCita;
      })
      .catch((err:any) =>{
        return err;
      })
    }
  }
}

module.exports = citaDB;