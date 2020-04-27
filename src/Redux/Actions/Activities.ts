import { Activities as act,status } from './Types';
import { Token } from 'Services';
import { request } from 'Services/Requests/StaticMethods';
import Url from 'Services/ServerUrl';


export const Activities = () => {
    return async (dispatch:any,getState:any) => {
        
        let tempActivities = getState().Activities.data;
        let params = getState().Activities.params;

        dispatch({type    : act.data,payload : '',});
        dispatch({type    : act.status,payload : 'pending',});
        
    
        const token = Token.get();
        if(token === '' || token === null){
            dispatch({type    : status.loggedIn,payload : false,});
            dispatch({type    : act.status,payload : 'done',});
            return;
        }
        
        const a = await request({url     : Url.logs,method  : 'GET',params    : params})   

        if (a.status === 200) {
            dispatch({type    : act.data,payload : a});
            dispatch({type    : act.status,payload : 'done',});
            return;
        }

        if(a.network_error){
            dispatch({type    : status.error,payload : true,});
            dispatch({type    : act.data,payload:tempActivities});
            dispatch({type    : act.status,payload : 'done',});
            return;
        }
    }
}

export const ActivitiesParams = (data:any) => {
    return async (dispatch:any) => {    
        dispatch({type:act.params,payload:data});
    }
}