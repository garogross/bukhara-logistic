import React from 'react'
import {adminMainPagePath, loginPagePath, mainPagePath} from './path';
import { Navigate } from 'react-router-dom';
import {lsProps} from "../utils/lsProps";
import {getLSItem} from "../utils/functions/localStorage";
import {userRoles} from "../constants";

const PrivateRoute = ({element,noAuth,isAdmin}) => {
   const token = getLSItem(lsProps.token)
   const user = getLSItem(lsProps.user,true)
   const isAuthenticated = !token || !user
   const statement = noAuth ?
       !isAuthenticated :
       isAuthenticated  || (isAdmin && user.role === userRoles.employee) || (!isAdmin && user.role !== userRoles.employee)
   let navigateTo = loginPagePath
   if(!isAuthenticated) {
      navigateTo = user.role !== userRoles.employee ? adminMainPagePath : mainPagePath
   } else {
      if(noAuth) {
         navigateTo = isAdmin ? adminMainPagePath : mainPagePath
      }
      // if(isAdmin) navigateTo = `/admin${navigateTo}`
   }
   return (
       statement ? <Navigate to={navigateTo} replace={true} /> : element
   )
}

export default PrivateRoute
