const database = require('../service/signosDB');
const db = database(process.env.MONGODB_URI);
const headers ={
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Credentials' : true,
  'Content-Type': 'application/json'
};

export const handler = async function (event:any) {
  const method = event.requestContext.httpMethod;
  console.log(event);
  switch(method){
    case 'GET' :
      if(event.pathParameters != null ){
        
      }else{
        
      }
    case 'POST':
      return addSignos(event);
    case 'PUT':
      return updateSignos(event);
    case 'DELETE':
      
    default:
      throw new Error('Unsupported route '+method);
  }
}

async function addSignos(event:any){
  const body = JSON.parse(event.body);
  const signos = await db.saveSignos(body);
  if(signos===null){
    var errMessage = {
      message:'Error al asignar signos'
    };
    return{
      statusCode: 404,
      body: JSON.stringify(errMessage),
      headers:headers
    }
  }
  return{
    statusCode: 200,
    body: JSON.stringify(signos),
    headers:headers,
    isBase64Encoded:false
  }
}

async function updateSignos(event:any) {
  const idSignos = event.pathParameters.parametro;
  const body = JSON.parse(event.body);
  console.log('idSignos',idSignos);
  console.log('Body',body);
  const signosUpdated = await db.updateSignos(idSignos,body);
  if(signosUpdated.error != null){
    var errMessage = {
      message:'No se pudieron actualizar los signos para este id '+idSignos
    };
    return{
      statusCode: 404,
      body: JSON.stringify(errMessage),
      headers:headers
    }
  }
  return{
    statusCode: 200,
    body: JSON.stringify(signosUpdated),
    headers:headers,
    isBase64Encoded:false
  }
}