import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function AdminCategories(){
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [newCat, setNewCat] = useState({ name:'', description:'' })
  const [update, setUpdate] = useState({ categoryId:'', name:'', description:'' })
  const [deleteId, setDeleteId] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/api/v1/category/all')
      setCategories(data.data || [])
    } catch(e){ setError('Failed to load categories') }
  }
  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/v1/category/createCategory', newCat)
      setNewCat({ name:'', description:'' })
      await load()
      alert('Category created')
    } catch(e){ alert('Create failed') }
  }

  const updateCategory = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/v1/category/updateCategory', update)
      await load()
      alert('Category updated')
    } catch(e){ alert('Update failed') }
  }

  const deleteCategory = async (e) => {
    e.preventDefault()
    if(!deleteId) return
    try {
      await api.post('/api/v1/category/deleteCategory', { categoryId: deleteId })
      setDeleteId('')
      await load()
      alert('Category deleted')
    } catch(e){ alert('Delete failed') }
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
      <div className="card">
        <h3>All Categories</h3>
        {error && <div className="tag">{error}</div>}
        <ul>
          {categories.map(c => (
            <li key={c._id} style={{marginBottom:8}}>
              <strong>{c.name}</strong> - {c.description}
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3>Create Category</h3>
        <form onSubmit={create}>
          <div className="field"><label>Name</label><input value={newCat.name} onChange={e=>setNewCat(n=>({...n,name:e.target.value}))} /></div>
          <div className="field"><label>Description</label><input value={newCat.description} onChange={e=>setNewCat(n=>({...n,description:e.target.value}))} /></div>
          <button className="btn">Add</button>
        </form>
        <div className="spacer" />
        <h3>Update Category</h3>
        <form onSubmit={updateCategory}>
          <div className="field">
            <label>Select Category</label>
            <select
              value={update.categoryId}
              onChange={(e)=>{
                const id = e.target.value;
                const cat = categories.find(c => c._id === id)
                setUpdate(u=>({
                  ...u,
                  categoryId: id,
                  name: cat?.name || '',
                  description: cat?.description || ''
                }))
              }}
            >
              <option value="">Select</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field"><label>New Name</label><input value={update.name} onChange={e=>setUpdate(u=>({...u,name:e.target.value}))} /></div>
          <div className="field"><label>New Description</label><input value={update.description} onChange={e=>setUpdate(u=>({...u,description:e.target.value}))} /></div>
          <button className="btn">Update</button>
        </form>
        <div className="spacer" />
        <h3>Delete Category</h3>
        <form onSubmit={deleteCategory}>
          <div className="field">
            <label>Select Category</label>
            <select value={deleteId} onChange={(e)=>setDeleteId(e.target.value)}>
              <option value="">Select</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <button className="btn danger" disabled={!deleteId}>Delete</button>
        </form>
      </div>
    </div>
  )
}


