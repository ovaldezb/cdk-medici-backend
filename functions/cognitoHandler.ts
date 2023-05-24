const database = require('../service/cognitoDB');
const db = database(process.env.MONGODB_URI);

export const handler = async function(event:any) {
  
  console.log(event);
  const params = event.request;
  saveUsuario(params);
  return event;
}

async function saveUsuario(params:any){
  const user = await db.saveNewUser(params.userAttributes);
  console.log(user);
}