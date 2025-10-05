import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../auth/AuthContext'

export default function CreatorDashboard(){
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [myCourses, setMyCourses] = useState([])
  const [sections, setSections] = useState([])
  const [enrollmentsByCourseId, setEnrollmentsByCourseId] = useState({})
  const [courseForm, setCourseForm] = useState({ courseName:'', courseDescription:'', whatYouWillLearn:'', price:'', tag:'', category:'', thumbnail:null })
  const [sectionForm, setSectionForm] = useState({ sectionName:'', courseId:'' })
  const [lessonForm, setLessonForm] = useState({ sectionId:'', title:'', order:'', videoFile:null })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [creatingCourse, setCreatingCourse] = useState(false)
  const [creatingSection, setCreatingSection] = useState(false)
  const [addingLesson, setAddingLesson] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const [catRes, courseRes] = await Promise.all([
          api.get('/api/v1/category/all'),
          api.get('/api/v1/course/mine')
        ])
        setCategories(catRes.data.data || catRes.data.categories || [])
        const mine = courseRes.data.data || []
        setMyCourses(mine)
        // Fetch details for each course to see enrolled students
        const detailPromises = mine.map(c => api.post('/api/v1/course/getCourseDetails', { courseId: c._id }).catch(()=>null))
        const details = await Promise.all(detailPromises)
        const mapping = {}
        details.forEach((res, idx) => {
          if(res && res.data && res.data.data){
            const course = res.data.data
            mapping[mine[idx]._id] = Array.isArray(course.studentsEnrolled) ? course.studentsEnrolled : []
          } else {
            mapping[mine[idx]._id] = []
          }
        })
        setEnrollmentsByCourseId(mapping)
      } catch(e){}
    })()
  }, [])

  const createCourse = async (e) => {
    e.preventDefault(); setError(''); setMessage(''); setCreatingCourse(true)
    try {
      const fd = new FormData()
      fd.append('courseName', courseForm.courseName)
      fd.append('courseDescription', courseForm.courseDescription)
      fd.append('whatYouWillLearn', courseForm.whatYouWillLearn)
      fd.append('price', courseForm.price)
      fd.append('tag', courseForm.tag)
      fd.append('category', courseForm.category)
      if(courseForm.thumbnail) fd.append('thumbnailImage', courseForm.thumbnail)
      const { data } = await api.post('/api/v1/course/createCourse', fd, { headers: { 'Content-Type':'multipart/form-data' } })
      alert('Course created')
      setMessage('Course created: ' + data.data.courseName + ' (status Draft)')
      setSectionForm(s => ({...s, courseId: data.data._id}))
      setCourseForm({ courseName:'', courseDescription:'', whatYouWillLearn:'', price:'', tag:'', category:'', thumbnail:null })
    } catch(e){ setError(e?.response?.data?.error?.message || 'Create course failed') }
    finally { setCreatingCourse(false) }
  }

  const loadSections = async (courseId) => {
    try {
      const { data } = await api.post('/api/v1/course/getCourseDetails', { courseId })
      setSections(data.data?.courseContent || [])
    } catch(e){  }
  }

  const createSection = async (e) => {
    e.preventDefault(); setError(''); setMessage(''); setCreatingSection(true)
    try {
      const { data } = await api.post('/api/v1/course/addSection', { sectionName: sectionForm.sectionName, courseId: sectionForm.courseId })
      alert('Section created')
      setMessage('Section created: ' + (data.data?.sectionName || sectionForm.sectionName))
      setLessonForm(l => ({...l, sectionId: data.data?.courseContent?.slice(-1)[0]?._id || ''}))
      await loadSections(sectionForm.courseId)
    } catch(e){ setError(e?.response?.data?.error?.message || 'Create section failed') }
    finally { setCreatingSection(false) }
  }

  const addLesson = async (e) => {
    e.preventDefault(); setError(''); setMessage(''); setAddingLesson(true)
    try {
      const fd = new FormData()
      fd.append('sectionId', lessonForm.sectionId)
      fd.append('title', lessonForm.title)
      fd.append('order', lessonForm.order)
      if(lessonForm.videoFile) fd.append('videoFile', lessonForm.videoFile)
      const { data } = await api.post('/api/v1/course/addLesson', fd, { headers: { 'Content-Type':'multipart/form-data' } })
      alert('Lesson created')
      setMessage('Lesson added. Total lessons: ' + (data.data?.lessons?.length || '?'))
    } catch(e){ setError(e?.response?.data?.error?.message || 'Add lesson failed') }
    finally { setAddingLesson(false) }
  }

  if(!user){
    return <div className="card">Please login as a Creator to view dashboard.</div>
  }
  if(user?.accountType === 'Creator' && user?.isApproved === false){
    return <div className="card">Your creator account is pending approval.</div>
  }
  if(user?.accountType !== 'Creator'){
    return <div className="card">Access denied. Creator account required.</div>
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
      <div className="card" style={{gridColumn:'1/-1'}}>
        <h2>Welcome, {user.firstName || ''} {user.lastName || ''}</h2>
        <div className="row"><span className="tag">{user.email}</span><span className="tag">Role: {user.accountType}</span>{user.isApproved && <span className="tag">Approved</span>}</div>
      </div>
      <div className="card">
        <h3>Create Course</h3>
        <form onSubmit={createCourse}>
          <div className="field"><label>Name</label><input value={courseForm.courseName} onChange={e=>setCourseForm(f=>({...f,courseName:e.target.value}))} /></div>
          <div className="field"><label>Description</label><textarea value={courseForm.courseDescription} onChange={e=>setCourseForm(f=>({...f,courseDescription:e.target.value}))} /></div>
          <div className="field"><label>What you will learn</label><textarea value={courseForm.whatYouWillLearn} onChange={e=>setCourseForm(f=>({...f,whatYouWillLearn:e.target.value}))} /></div>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:16}}>
            <div className="field"><label>Price</label><input value={courseForm.price} onChange={e=>setCourseForm(f=>({...f,price:e.target.value}))} /></div>
            <div className="field"><label>Tags (comma)</label><input value={courseForm.tag} onChange={e=>setCourseForm(f=>({...f,tag:e.target.value}))} /></div>
          </div>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:16}}>
            <div className="field"><label>Category</label>
              <select value={courseForm.category} onChange={e=>setCourseForm(f=>({...f,category:e.target.value}))}>
                <option value="">Select</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Thumbnail</label><input type="file" onChange={e=>setCourseForm(f=>({...f,thumbnail:e.target.files?.[0] || null}))} /></div>
          </div>
          <button className="btn" disabled={creatingCourse}>{creatingCourse ? 'Creating…' : 'Create'}</button>
        </form>
      </div>

      <div className="card">
        <h3>Create Section</h3>
        <form onSubmit={createSection}>
          <div className="field">
            <label>Course</label>
            <select value={sectionForm.courseId} onChange={e=>setSectionForm(f=>({...f,courseId:e.target.value}))}>
              <option value="">Select Course</option>
              {myCourses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
            </select>
          </div>
          <div className="field"><label>Section Name</label><input value={sectionForm.sectionName} onChange={e=>setSectionForm(f=>({...f,sectionName:e.target.value}))} /></div>
          <button className="btn" disabled={creatingSection}>{creatingSection ? 'Adding…' : 'Add Section'}</button>
        </form>
        <div className="spacer" />
        <h3>Add Lesson</h3>
        <form onSubmit={addLesson}>
          <div className="field">
            <label>Course</label>
            <select onChange={e=>loadSections(e.target.value)}>
              <option value="">Select Course</option>
              {myCourses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Section</label>
            <select value={lessonForm.sectionId} onChange={e=>setLessonForm(f=>({...f,sectionId:e.target.value}))}>
              <option value="">Select Section</option>
              {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
            </select>
          </div>
          <div className="field"><label>Title</label><input value={lessonForm.title} onChange={e=>setLessonForm(f=>({...f,title:e.target.value}))} /></div>
          <div className="field"><label>Order</label><input value={lessonForm.order} onChange={e=>setLessonForm(f=>({...f,order:e.target.value}))} /></div>
          <div className="field"><label>Video</label><input type="file" onChange={e=>setLessonForm(f=>({...f,videoFile:e.target.files?.[0] || null}))} /></div>
          <button className="btn" disabled={addingLesson}>{addingLesson ? 'Adding…' : 'Add Lesson'}</button>
        </form>
      </div>

      <div className="card" style={{gridColumn:'1/-1'}}>
        <h3>Your Courses & Enrollments</h3>
        <div className="grid cols-3">
          {myCourses.map(c => {
            const enrolled = enrollmentsByCourseId[c._id] || []
            return (
              <div className="card" key={c._id}>
                {c.thumbnail && <img src={c.thumbnail} alt={c.courseName} style={{width:'100%',height:140,objectFit:'cover',borderRadius:8,marginBottom:8}} />}
                <h4>{c.courseName}</h4>
                <div className="row">
                  <span className="tag">{c.category?.name}</span>
               
                </div>
                <div className="tag" style={{marginTop:8}}>{enrolled.length} enrolled</div>
              </div>
            )
          })}
        </div>
      </div>

      {message && <div className="card" style={{gridColumn:'1/-1'}}>{message}</div>}
      {error && <div className="card" style={{gridColumn:'1/-1', borderColor:'#ef4444', color:'#fca5a5'}}>{error}</div>}
    </div>
  )
}


