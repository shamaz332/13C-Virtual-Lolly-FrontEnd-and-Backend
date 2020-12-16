import createVlolly from './createVlolly';
import listVlolly from './listLolly';


import Lolly from './types';

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
        case "crecreateVlollyateBookmark":
            return await createVlolly(event.arguments.lolly);
            case "listVlolly":
                return await listVlolly();
               default:
            return null;
    }
}