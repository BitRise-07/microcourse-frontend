import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export default function Login(){
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const onSubmit = async (e) => {
    e.preventDefault(); setErr('')
    const res = await login(email, password)
    if(res.ok){
      if(res.user?.accountType === 'Creator'){
        navigate('/creator/dashboard', { replace: true })
      } else if(res.user?.accountType === 'Admin'){
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate('/learner/dashboard', { replace: true })
      }
    }
    else setErr(res.error)
  }
  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div className="field"><label>Email</label><input value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
        <div className="field"><label>Password</label><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
        <button className="btn">Login</button>
      </form>
      {err && <p className="tag" style={{borderColor:'#ef4444',color:'#fca5a5'}}>{err}</p>}
      
    </div>
  )
}


