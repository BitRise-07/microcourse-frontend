import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export default function Signup(){
  const { signup } = useAuth()
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', confirmPassword:'', accountType:'Learner', contactNumber:'', otp:'' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const onChange = (e) => setForm(f => ({...f, [e.target.name]: e.target.value}))
  const onSubmit = async (e) => {
    e.preventDefault(); setErr(''); setMsg('')
    const res = await signup(form)
    if(res.ok) setMsg('Registered. You can login now.')
    else setErr(res.error)
  }
  return (
    <div className="card">
      <h2>Signup</h2>
      <form onSubmit={onSubmit}>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:16}}>
          <div className="field"><label>First Name</label><input name="firstName" value={form.firstName} onChange={onChange} /></div>
          <div className="field"><label>Last Name</label><input name="lastName" value={form.lastName} onChange={onChange} /></div>
        </div>
        <div className="field"><label>Email</label><input name="email" value={form.email} onChange={onChange} /></div>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:16}}>
          <div className="field"><label>Password</label><input type="password" name="password" value={form.password} onChange={onChange} /></div>
          <div className="field"><label>Confirm Password</label><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} /></div>
        </div>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:16}}>
          <div className="field"><label>Account Type</label>
            <select name="accountType" value={form.accountType} onChange={onChange}>
              <option value="Learner">Learner</option>
              <option value="Creator">Creator</option>
            </select>
          </div>
          <div className="field"><label>Contact Number</label><input name="contactNumber" value={form.contactNumber} onChange={onChange} /></div>
        </div>
        <div className="field"><label>OTP</label><input name="otp" value={form.otp} onChange={onChange} /></div>
        <button className="btn">Create Account</button>
      </form>
      {msg && <p className="tag">{msg}</p>}
      {err && <p className="tag" style={{borderColor:'#ef4444',color:'#fca5a5'}}>{err}</p>}
      <div className="spacer" />
      <a href="/auth/send-otp">Need OTP?</a>
    </div>
  )
}


