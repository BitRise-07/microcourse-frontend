import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RoleRoute({ roles = [] }){
  const { user, token } = useAuth()
  const location = useLocation()
  if(!token || !user){
    return <Navigate to="/auth/login" replace state={{ from: location }} />
  }
  if(roles.length && !roles.includes(user.accountType)){
    return <Navigate to="/" replace />
  }
  return <Outlet />
}


