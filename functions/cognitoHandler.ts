const database = require('../service/citasDB');
const db = database(process.env.MONGODB_URI);

export const handler = async function(event:any) {
  console.log('Cognito Lambda');
}