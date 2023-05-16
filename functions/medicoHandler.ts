const database = require('../service/medicoDB');
const db = database(process.env.MONGODB_URI);
const headers ={
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Credentials' : true,
  'Content-Type': 'application/json'
};

export const handler = async function(event:any) {
  const method = event.requestContext.httpMethod;
  switch(method){
    case 'GET' :
      if(event.pathParameters != null ){
        return getMedicoById(event.pathParameters.idMedico);
      }else{
        return getAllMedicos();
      }
    case 'POST':
      return saveMedico(event.body);
    case 'PUT':
      return updateMedico(event.pathParameters.idMedico, event.body);
    case 'DELETE':
      return deleteMedico(event.pathParameters.idMedico);
    default:
      throw new Error('Unsupported route '+method);
  }
}

async function saveMedico(medico:any) {
  console.log('Save Medico',medico);
  const body = JSON.parse(medico);
  const savedMedico =  await db.save(body);
  
  return{
    statusCode: 200,
    body: JSON.stringify(savedMedico),
    headers:headers,
    isBase64Encoded:false
  }
}

async function getMedicoById(idMedico:string){
  const medico = await db.getMedicoById(idMedico);
  if(medico === null){
    var errMessage = {
      message:'No existen medico para este id'
    };
    return{
      statusCode: 404,
      body: JSON.stringify(errMessage),
      headers:headers
    }  
  }
  return{
    statusCode: 200,
    body: JSON.stringify(medico),
    headers:headers
  }
}

async function getAllMedicos() {
  const medicos = await db.getAllMedicos();
  if(medicos === null){
    var errMessage = {
      message:'No existen medico para este id'
    };
    return{
      statusCode: 404,
      body: JSON.stringify(errMessage),
      headers:headers
    }  
  }
  return{
    statusCode: 200,
    body: JSON.stringify(medicos),
    headers:headers
  }
}

async function updateMedico(idMedico:string, medico:any) {
  const medicoUpdated = await db.updateMedicoDB(idMedico, medico);
  if(medicoUpdated === null){
    var errMessage = {
      message:'No se pudo actualizar el medico'
    };
    return{
      statusCode: 404,
      body: JSON.stringify(errMessage),
      headers:headers
    }  
  }
  return{
    statusCode: 200,
    body: JSON.stringify(medicoUpdated),
    headers:headers
  }
}

async function deleteMedico(idMedico:string) {
  const medicoDeleted = await db.delete(idMedico);
  if(medicoDeleted === null){
    var errMessage = {
      message:'No se pudo actualizar el medico'
    };
    return{
      statusCode: 404,
      body: JSON.stringify(errMessage),
      headers:headers
    }  
  }
  return{
    statusCode: 200,
    body: JSON.stringify(medicoDeleted),
    headers:headers
  }
}

