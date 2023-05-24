const database = require('../service/perfilDB');
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
    case 'GET':
      return getAllPerfiles(event);
    case 'POST':  
      return creaPerfil(event);
    case 'PUT':
      return actualizaPerfil(event);
    case 'DELETE':
      return eliminaPerfil(event);
  }
}

async function getAllPerfiles(params:any) {
  const perfiles = await db.findAllPerfilesDB(params);
  if(perfiles.error !=null){
    var errMessage = {
      message:'Error al obtener los perfiles'
    };
    return{
      statusCode: 404,
      body: JSON.stringify(errMessage),
      headers:headers
    }
  }
  return{
    statusCode: 200,
    body: JSON.stringify(perfiles),
    headers:headers
  }
}

async function creaPerfil(params:any) {
  const body = JSON.parse(params.body);
  const savePerfil = await db.savePerfilDB(body);
  if(savePerfil.error != null){
    return{
      statusCode: 404,
      body: JSON.stringify({
        message:'Error al crear el perfil'
      }),
      headers:headers
    } 
  }
  return{
    statusCode: 200,
    body: JSON.stringify(savePerfil),
    headers:headers
  }
}

async function actualizaPerfil(params:any) {
  const idPerfil = params.pathParameters.idPerfil;
  const body = JSON.parse(params.body);
  const perfilUpdated = await db.updatePerfilDB(idPerfil,body);
  if(perfilUpdated.error != null || perfilUpdated===null){
    return{
      statusCode: 404,
      body: JSON.stringify({
        message:'Error al actualizar el perfil '+idPerfil
      }),
      headers:headers
    } 
  }
  return{
    statusCode: 200,
    body: JSON.stringify(perfilUpdated),
    headers:headers
  }
}

async function eliminaPerfil(params:any) {
  const idPerfil = params.pathParameters.idPerfil;
  const perfilDeleted = await db.deletePerfilDB(idPerfil);
  if(perfilDeleted.error != null){
    return{
      statusCode: 404,
      body: JSON.stringify({
        message:'Error al eliminar el perfil '+idPerfil
      }),
      headers:headers
    }
  }
  return{
    statusCode: 200,
    body: JSON.stringify(perfilDeleted),
    headers:headers
  }
}
