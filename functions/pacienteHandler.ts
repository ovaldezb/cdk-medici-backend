const database = require('../service/pacienteDB');
const db = database(process.env.MONGODB_URI);
const headers ={
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Credentials' : true,
  'Content-Type': 'application/json'
};

export const handler = async function(event:any) {
  console.log(event);
  const method = event.requestContext.httpMethod;
  switch(method){
    case 'GET' :
      if (event.pathParameters === null){
        return findAllPacientes();
      }else if(event.pathParameters !=null && event.pathParameters.idPaciente !=null){
        return findPacienteById(event.pathParameters.idPaciente);
      }else if(event.pathParameters != null && event.pathParameters.apellido != null){
        return findPacienteByApellido(event);
      }else if(event.pathParameters != null && event.pathParameters.nombre != null ){
        return findPacienteByNombre(event);
      }else if(event.pathParameters != null && event.pathParameters.telefono != null){
        return findPacienteByTelefono(event);
      }
    case 'POST':
      return savePaciente(event);
    case 'PUT':
      return updatePaciente(event);
    case 'DELETE':
      return deletePaciente(event);
    default:
      throw new Error('Unsupported route '+method);
  }
}

async function savePaciente(event:any) {
  const body = JSON.parse(event.body);
  const savedPaciente = await db.savePaciente(body);
  return{
    statusCode: 200,
    body: JSON.stringify(savedPaciente),
    headers:headers,
    isBase64Encoded:false
  }
}

async function findAllPacientes() {
  const allPacientes = await db.findAllPacientes();
  return{
    statusCode: 200,
    body: JSON.stringify(allPacientes),
    headers:headers,
    isBase64Encoded:false
  }
}

async function findPacienteByNombre(event:any) {
  const pacienteByName = await db.findPacienteByNombre(event);
  return{
    statusCode: 200,
    body: JSON.stringify(pacienteByName),
    headers:headers,
    isBase64Encoded:false
  }
}

async function findPacienteById(idPaciente:string){
  const paciente = await db.findPacienteById(idPaciente);
  if(paciente===null){
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
    body: JSON.stringify(paciente),
    headers:headers,
    isBase64Encoded:false
  }
}

async function findPacienteByApellido(event:any) {
  const pacienteByApellido = await db.findPacienteByApellido(event);
  return{
    statusCode: 200,
    body: JSON.stringify(pacienteByApellido),
    headers:headers,
    isBase64Encoded:false
  }
}

async function findPacienteByTelefono(event:any) {
  const findPacienteByTelefono = await db.findPacienteByTelefono(event);
  return{
    statusCode: 200,
    body: JSON.stringify(findPacienteByTelefono),
    headers:headers,
    isBase64Encoded:false
  }
}

async function updatePaciente(event:any) {
  const updatedPaciente = await db.updatePacienteDB(event);
  return{
    statusCode: 200,
    body: JSON.stringify(updatedPaciente),
    headers:headers,
    isBase64Encoded:false
  }
}

async function deletePaciente(event:any) {
  const deletedPaciente = await db.deletePacienteDB(event);
  return{
    statusCode: 200,
    body: JSON.stringify(deletedPaciente),
    headers:headers,
    isBase64Encoded:false
  }
}