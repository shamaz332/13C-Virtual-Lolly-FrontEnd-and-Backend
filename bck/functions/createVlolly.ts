const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
// const eventBridge = new AWS.EventBridge();
const codepipeline = new AWS.CodePipeline();
import Lolly from "./type";

async function createVlolly(lolly: Lolly) {
  const params = {
    TableName: process.env.LOLLY_TABLE,
    Item: lolly,
  };

  var Pipparams = {
    name: "BckStack-LollyPipeline196A152A-19R4CFA54XIQC",
    
  };

  try {
    await docClient.put(params).promise();
    await codepipeline
    .startPipelineExecution(Pipparams, function (err: any, data: any) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
      }
    })
    .promise();
    return lolly;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}

export default createVlolly;

// exports.handler = (event: any, context: any) => {
//   console.log(event);
//   context.succeed(event);
//   return context.pipeline;
// };
