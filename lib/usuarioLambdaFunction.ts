import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";



export class SwUsuarioLambdaFunction extends Construct{
  public readonly usuariosLambda:NodejsFunction;
  constructor(scope: Construct, id: string, userPoolId:string){
    super(scope, id);
    const nodeJSPropsCognito: NodejsFunctionProps ={
      bundling: {
        externalModules: [
          'aws-sdk'
        ]
      },
      environment: {
        MONGODB_URI: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
        USER_POOL_ID:userPoolId
      },
      runtime: Runtime.NODEJS_16_X
    }

    this.usuariosLambda = this.createUsuariosLambda(nodeJSPropsCognito);
  }

  private createUsuariosLambda(nodeJsProps:NodejsFunctionProps):NodejsFunction{
    const usuarioFunction = new NodejsFunction(this,'UsuariosFunction',{
      functionName:'UsuariosFunction',
      entry:join(__dirname,'/../functions/usuariosHandler.ts'),
      ...nodeJsProps
    });
    return usuarioFunction;
  }
}

