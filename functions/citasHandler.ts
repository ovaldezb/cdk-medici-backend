
const database = require('../service/citasDB');
const db = database(process.env.MONGODB_URI);
const headers ={
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Credentials' : true,
  'Content-Type': 'application/json'
};
require('../models/paciente');

export const handler = async function(event:any) {
  const method = event.requestContext.httpMethod;
  switch(method){
    case 'GET' :
      if(event.pathParameters != null && event.pathParameters.idMedico != null){
        return getCitasByFechaAndMedico(event.pathParameters.parametro,event.pathParameters.idMedico); //findById(event.pathParameters.idCondominio);
      }else{
        return getCitasByFecha(event.pathParameters.parametro);
      }
    case 'POST':
      return addCita(event);
    case 'PUT':
      return updateCita(event);
    case 'DELETE':
      return deleteCita(event.pathParameters.parametro);
    default:
      throw new Error('Unsupported route '+method);
  }
}

async function addCita(event:any){
  const body = JSON.parse(event.body);
  const savedCita =  await db.save(body);
  return{
    statusCode: 200,
    body: JSON.stringify(savedCita),
    headers:headers
  }
}

async function getCitasByFecha(fechaFiltro:string){
  const citas = await db.getCitasByFecha(fechaFiltro);
  if(citas === null){
    var errMessage = {
      message:'No existen citas para esta fecha'
    };
    return{
      statusCode: 404,
      body: JSON.stringify(errMessage),
      headers:headers
    }  
  }
  return{
    statusCode: 200,
    body: JSON.stringify(citas),
    headers:headers
  }
}

async function getCitasByFechaAndMedico(fechaFiltro:string, idMedico:string){
  const citas = await db.getCitasByFechaAndMedico(fechaFiltro, idMedico);
  if(citas === null){
    var errMessage = {
      message:'No existen citas para esta fecha'
    };
    return{
      statusCode: 400,
      body: JSON.stringify(errMessage),
      headers:headers
    }  
  }
  return{
    statusCode: 200,
    body: JSON.stringify(citas),
    headers:headers
  }
}

async function updateCita(event:any){
  const body = JSON.parse(event.body);
  const idCita = event.pathParameters.parametro;
  const updateCita = await db.updateCita(idCita,body);
  if(updateCita===null){
    let bodyMessage = {
      message : 'No existen registros para actualizar'
    };
    return{
      statusCode: 404,
      body: JSON.stringify(bodyMessage),
      headers:headers
    }
  }else{
    return{
      statusCode:200,
      body: JSON.stringify(updateCita),
      headers:headers,
    }
  }
}

async function deleteCita(idCita:string) {
  const delCita = await db.deleteCita(idCita);
  if(delCita===null){
    let bodyMessage = {
      message : 'No se pudo eliminar la cita'
    };
    return{
      statusCode: 404,
      body: JSON.stringify(bodyMessage),
      headers:headers
    }
  }else{
    return{
      statusCode:200,
      body: JSON.stringify(delCita),
      headers:headers,
    }
  }
}