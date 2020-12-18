import createVlolly from './createVlolly';
import listVlolly from './listVlolly';
import Lolly from './type';

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     lolly: Lolly
  }
}

exports.handler = async (event:AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "createVlolly":
            return await createVlolly(event.arguments.lolly);
        case "listVlolly":
            return await listVlolly();
               default:
            return null;
    }
}