import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as CodePipeline from "@aws-cdk/aws-codepipeline";
import * as CodePipelineAction from "@aws-cdk/aws-codepipeline-actions";
import * as CodeBuild from "@aws-cdk/aws-codebuild";
import {
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";

// event bridge
import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";

export class BckLolly extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


           // 😀😀😀😀😀😀😀😀😀😀 Creates the AppSync API😀😀😀😀😀😀😀😀😀😀😀

    const api = new appsync.GraphqlApi(this, "LollyApi", {
      name: "lolly",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });

       // 😀😀😀😀😀😀😀😀😀😀 show to console😀😀😀😀😀😀😀😀😀😀😀

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });
       // 😀😀😀😀😀😀😀😀😀😀 permession😀😀😀😀😀😀😀😀😀😀😀


    const role = new Role(this, "LambdaRoleForLolly", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["lambda:*", "codepipeline:*", "dynamodb:*", "logs:*"],
      resources: ["*"],
    });
    role.addToPolicy(policy);


       // 😀😀😀😀😀😀😀😀😀😀 lambda😀😀😀😀😀😀😀😀😀😀😀

    const lollyLambda = new lambda.Function(this, "LollyFunc", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "main.handler",
      code: lambda.Code.fromAsset("functions"),
      memorySize: 1024,
      role: role,
    });

    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource(
      "lambdaDatasourcelolly",
      lollyLambda
    );

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listVlolly",
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createVlolly",
    });

    const lollyTable = new ddb.Table(this, "LollyTable", {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    lollyTable.grantFullAccess(lollyLambda);

    // Create an environment variable that we will use in the function code
    lollyLambda.addEnvironment("LOLLY_TABLE", lollyTable.tableName);

    // CI CD pipeline code



   // 😀😀😀😀😀😀😀😀😀😀 Deploy Gatsby on s3 bucket😀😀😀😀😀😀😀😀😀😀😀

 
    const myBucket = new s3.Bucket(this, "lollybucket", {
      versioned: true,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,

    });
    myBucket.grantReadWrite(lollyLambda);

    const dist = new cloudfront.Distribution(this, "LollyDistribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(myBucket),
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        
      },
      enableIpv6: true,
    });

    new s3Deployment.BucketDeployment(this, "deploylolly", {
      sources: [s3Deployment.Source.asset("../client/public")],
      destinationBucket: myBucket,
      distribution: dist,
      prune: false,
      
      
    });
    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: dist.domainName,
    });
    //Code build action, Here you will define a complete build
    const s3Build = new CodeBuild.PipelineProject(this, "s3Build", {
      buildSpec: CodeBuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            "runtime-versions": {
              nodejs: 12,
            },
            commands: ["cd client", "npm i -g gatsby", "npm install"],
          },
          build: {
            commands: ["gatsby build", "ls"],
          },
        },
        artifacts: {
          "base-directory": "./client/public", ///outputting our generated Gatsby Build files to the public directory
          files: ["*/*"],
        },
      }),
      environment: {
        buildImage: CodeBuild.LinuxBuildImage.STANDARD_3_0, ///BuildImage version 3 because we are using nodejs environment 12
      },
    });
   // 😀😀😀😀😀😀😀😀😀😀Artifact😀😀😀😀😀😀😀😀😀😀😀
   
    // Artifact from source stage
    const sourceOutput = new CodePipeline.Artifact();

    // Artifact from build stage
    const S3Output = new CodePipeline.Artifact();
   // 😀😀😀😀😀😀😀😀😀😀Permessions😀😀😀😀😀😀😀😀😀😀😀

    const secondPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:*", "lambda:*", "codepipeline:*"],
      resources: ["*"],
    });
    s3Build.addToRolePolicy(secondPolicy);


   // 😀😀😀😀😀😀😀😀😀😀Pipiline Creation😀😀😀😀😀😀😀😀😀😀😀


    const pipeline = new CodePipeline.Pipeline(this, "LollyPipeline", {
      crossAccountKeys: false, //Pipeline construct creates an AWS Key Management Service (AWS KMS) which cost $1/month. this will save your $1.
      restartExecutionOnUpdate: true, //Indicates whether to rerun the AWS CodePipeline pipeline after you update it.
    });


   // 😀😀😀😀😀😀😀😀😀😀Add steges to pipiline😀😀😀😀😀😀😀😀😀😀😀

    //First Stage Source
 
    
    pipeline.addStage({
      stageName: "Source",
      actions: [
        new CodePipelineAction.GitHubSourceAction({
          actionName: "Checkout",
          owner: "shamaz332",
          repo: "13C-Virtual-Lolly-FrontEnd-and-Backend",
          oauthToken: cdk.SecretValue.secretsManager("GITHUB_TOKEN"), ///create token on github and save it on aws secret manager
          output: sourceOutput, ///Output will save in the sourceOutput Artifact
          branch: "master", ///Branch of your repo
        }),
      ],
    });
    pipeline.addStage({
      stageName: "Build",
      actions: [
        new CodePipelineAction.CodeBuildAction({
          actionName: "s3Build",
          project: s3Build,
          input: sourceOutput,
          outputs: [S3Output],
        }),
      ],
    });

    pipeline.addStage({
      stageName: "Deploy",
      actions: [
        new CodePipelineAction.S3DeployAction({
          actionName: "s3Build",
          input: S3Output,
          bucket: myBucket,
        }),
      ],
    });


   // 😀😀😀😀😀😀😀😀😀adding eventbridge to start build😀😀😀😀😀😀😀😀😀😀😀😀
    // const bus = new events.EventBus(this, "lollyEventBus", {
    //   eventBusName: "LollyBus",
    // });

    // const rule = new events.Rule(this, "lollyRule", {
    //   description: "description",
    //   eventPattern: {
    //     source: ["lollusource"],
    //     detailType: ["lollusource"],
    //     detail: ["lolly"],
    //   },
    //   eventBus: bus,
    // });
    // rule.addTarget(new targets.CodeBuildProject(s3Build));
  }
}
