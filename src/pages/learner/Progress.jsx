import { useEffect, useState } from 'react'
import api from '../../services/api'



export default function Progress(){
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/v1/course/getAllCourses?limit=50&offset=0')
        setItems(data.data.items || data.data || [])
      } catch(e){ setError('Failed to load progress') }
    })()
  }, [])

  if(error) return <div className="card">{error}</div>
  return (
    <div className="card">
      <h2>Your Progress</h2>
      <p>This page summarizes your enrolled courses after you mark lessons complete.</p>
      <div className="spacer" />
      <div className="grid cols-3">
        {items.map(c => (
          <div className="card" key={c._id}>
            <h3>{c.courseName}</h3>
            <div className="tag">Category: {c.category?.name || '-'}</div>
            <div className="tag">Price: ${c.price}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


