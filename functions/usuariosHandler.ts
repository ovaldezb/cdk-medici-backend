const AWS = require('aws-sdk');
const database = require('../service/usuarioDB');
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
      return getAllUsuarios(event);
    case 'DELETE':
      deleteUsuarioFromCognito(event);
      return deleteUsuario(event);
    default:
      throw new Error('Unsupported route '+method);
  }
}

async function getAllUsuarios(params:any) {
  const listaUsuario = await db.getAllUsers(params);
  if(listaUsuario.error != null || listaUsuario === null){
    return{
      statusCode: 404,
      body: JSON.stringify({
        message:'No existen medico para este id'
      }),
      headers:headers
    }
  }
  return{
    statusCode: 200,
    body: JSON.stringify(listaUsuario),
    headers:headers
  }
}

async function deleteUsuario(params:any) {
  const idUsuario = params.pathParameters.idusuario;
  const deleteUsuario = await db.deleteUserDB(idUsuario);
  if(deleteUsuario.error != null || deleteUsuario === null){
    return{
      statusCode: 404,
      body: JSON.stringify({
        message:'Error al borra el usuario '+idUsuario
      }),
      headers:headers
    }
  }
  return{
    statusCode: 200,
    body: JSON.stringify(deleteUsuario),
    headers:headers
  }
}

async function deleteUsuarioFromCognito(event:any) {
  const cognito = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18",
  });
  const USERPOOLID = process.env.USER_POOL_ID;
  const EMAIL = event.pathParameters.email;
  const cognitoParams = {
      UserPoolId: USERPOOLID,
      Username: EMAIL
  };
  let response = await cognito.adminDeleteUser(cognitoParams).promise();
  console.log(JSON.stringify(response, null, 2));
}