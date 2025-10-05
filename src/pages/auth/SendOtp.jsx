import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export default function SendOtp(){
  const { sendOtp } = useAuth()
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const onSubmit = async (e) => {
    e.preventDefault()
    setErr(''); setMsg('')
    const res = await sendOtp(email)
    if(res.ok) setMsg('OTP sent. Check your email.')
    else setErr(res.error)
  }
  return (
    <div className="card">
      <h2>Send OTP</h2>
      <form onSubmit={onSubmit}>
        <div className="field">
          <label>Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <button className="btn">Send OTP</button>
        
      </form>
      <a className="link text-sm mt-4 block text-center text-blue-500 hover:underline hover:text-blue-600" href="/auth/signup">Back to Signup</a>
      {msg && <p className="tag">{msg}</p>}
      {err && <p className="tag" style={{borderColor:'#ef4444',color:'#fca5a5'}}>{err}</p>}
    </div>
  )
}


