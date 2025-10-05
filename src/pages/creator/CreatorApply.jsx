import { useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../auth/AuthContext'

export default function CreatorApply(){
  const { user, setUser } = useAuth()
  const [creatorId, setCreatorId] = useState(user?.id || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault(); setError(''); setMessage('')
    try {
    
      setMessage('Application submitted. An admin must approve your account.')
    } catch(e){ setError('Failed to apply') }
  }

  const selfPromoteIfAdmin = async () => {
    try {
      const { data } = await api.post('/api/v1/admin/approve-creator', { creatorId: creatorId })
      setMessage(data.message)
      setUser(u => u ? { ...u, accountType: 'Creator', isApproved: true } : u)
      localStorage.setItem('mc_user', JSON.stringify({ ...user, accountType: 'Creator', isApproved: true }))
    } catch(e){ setError(e?.response?.data?.error?.message || 'Approve failed') }
  }

  return (
    <div className="card">
      <h2>Apply as Creator</h2>
      <form onSubmit={submit}>
        <div className="field">
          <label>Your User ID</label>
          <input value={creatorId} onChange={e=>setCreatorId(e.target.value)} />
        </div>
        <button className="btn">Submit Application</button>
      </form>
      <div className="spacer" />
      <div className="tag">Admin will approve your account</div>
      <div className="spacer" />
      <button className="btn secondary" onClick={selfPromoteIfAdmin}>[Admin Only] Approve Now</button>
      {message && <p className="tag">{message}</p>}
      {error && <p className="tag" style={{borderColor:'#ef4444',color:'#fca5a5'}}>{error}</p>}
    </div>
  )
}


