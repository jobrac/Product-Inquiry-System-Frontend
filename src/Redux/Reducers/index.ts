import { combineReducers } from 'redux';
import UserAccount from './UserAccount';
import NavigationTitle from './NavigationTitle';
import Products from './Products';
import Suppliers from './Suppliers';
import Users from './Users';
import Search from './Search';
import MasterCodes from './MasterCodes';
import Category from './Category';
import status from './status';
import { Token } from 'Services';
import {status as stat} from '../Actions/Types';
import Notifications from './Notifications';
import Logs from './Logs';


const appReducer =  combineReducers({
    UserAccount,
    NavigationTitle,
    Products,
    Suppliers,
    Users,
    Search,
    MasterCodes,
    Category,
    status,
    Notifications,
    Logs,
});

const rootReducer = (state:any,action:any) => {

	if(action.type === stat.loggedIn && action.payload === false){
        Token.remove();
		state = {};
	}

	return appReducer(state,action);
}

export default rootReducer;