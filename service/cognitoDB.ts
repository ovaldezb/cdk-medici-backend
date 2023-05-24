import mongoose from "mongoose";
const Usuario = require('../models/usuario');

const cognitoDB = (mongoUri:any)=>{
  mongoose.connect(mongoUri);

  return {
    saveNewUser:(params:any)=>{
      return new Usuario({
        nombre: params.given_name,
        apellidoP: params.middle_name,
        apellidoM: params.family_name,
        email: params.email,
        telefono: params.phone_number,
        sucursal: params['custom:sucursal'],
        perfil: params['custom:perfil'],
        cedula: params['custom:cedula'],
        isAdmin: params['custom:isAdmin']
      })
      .save()
      .then((savedCognito:any)=>{
        return savedCognito;
      })
      .catch((err:any)=>{
        console.log(err);
      })
    }
  }

}