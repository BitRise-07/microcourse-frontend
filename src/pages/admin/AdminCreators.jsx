import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function AdminCreators(){
  const [creators, setCreators] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/api/v1/admin/creators')
      setCreators(data.data || [])
    } catch(e){ setError('Failed to load creators') }
  }
  useEffect(() => { load() }, [])

  const approve = async (id) => {
    try { await api.post('/api/v1/admin/approve-creator', { creatorId: id }); await load() } catch(e){ alert('Approve failed') }
  }

  return (
    <div className="grid cols-3">
      {error && <div className="card" style={{gridColumn:'1/-1'}}>{error}</div>}
      {creators.map(u => (
        <div className="card" key={u._id}>
          <h3>{u.firstName} {u.lastName}</h3>
          <div className="tag">{u.email}</div>
          <div className="tag">Approved: {u.isApproved ? 'Yes' : 'No'}</div>
          <div className="spacer" />
          {!u.isApproved && <button className="btn" onClick={()=>approve(u._id)}>Approve</button>}
        </div>
      ))}
    </div>
  )
}





