import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";

export class BckStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

        // Creates the AppSync API
        const api = new appsync.GraphqlApi(this, 'Api', {
          name: "lolly",
          schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
          authorizationConfig: {
            defaultAuthorization: {
              authorizationType: appsync.AuthorizationType.API_KEY,
              
            },
          },
          xrayEnabled: true,
        });
            // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
     });
 
     // Prints out the AppSync GraphQL API key to the terminal
     new cdk.CfnOutput(this, "GraphQLAPIKey", {
       value: api.apiKey || ''
     });
 
     // Prints out the stack region to the terminal
     new cdk.CfnOutput(this, "Stack Region", {
       value: this.region
     });

     const lollyLambda = new lambda.Function(this, 'lollylambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('functions'),
      memorySize: 1024
    });
    
    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource('lambdaDatasourcelolly', lollyLambda);


    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listVlolly"
    });
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createVlolly"
    });
    
    const lollyTable = new ddb.Table(this, 'CDKlolly', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    lollyTable.grantFullAccess(lollyLambda)
    
    // Create an environment variable that we will use in the function code
    lollyLambda.addEnvironment('LOLLY_TABLE', lollyTable.tableName);
  }
}
