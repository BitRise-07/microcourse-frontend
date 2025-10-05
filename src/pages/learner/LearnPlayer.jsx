import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

export default function LearnPlayer(){
  const { courseId, sectionId, lessonOrder } = useParams()
  const [course, setCourse] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post('/api/v1/course/getCourseDetails', { courseId })
        setCourse(data.data)
      } catch(e){
        setError(e?.response?.data?.error?.message || 'Failed to load course')
      } finally { setLoading(false) }
    })()
  }, [courseId])

  const current = useMemo(() => {
    if(!course) return null
    const sec = course.courseContent?.find(s => s._id === sectionId)
    if(!sec) return null
    const les = [...(sec.lessons||[])].find(l => String(l.order) === String(lessonOrder))
    return les ? { section: sec, lesson: les } : null
  }, [course, sectionId, lessonOrder])

  const markComplete = async () => {
    try {
      const { data } = await api.post('/api/v1/course/completeLesson', { courseId, sectionId, lessonOrder: Number(lessonOrder) })
      if(data.certificate){
        alert(`Certificate issued! Serial: ${data.certificate.serialHash}`)
      }
      const sec = current.section
      const lessons = [...sec.lessons].sort((a,b)=>a.order-b.order)
      const idx = lessons.findIndex(l => String(l.order) === String(lessonOrder))
      if(idx >= 0 && idx < lessons.length - 1){
        const next = lessons[idx+1]
        navigate(`/learn/${courseId}/${sec._id}/${next.order}`)
      } else {
        const allSections = course.courseContent
        const secIdx = allSections.findIndex(s => s._id === sec._id)
        if(secIdx >=0 && secIdx < allSections.length - 1){
          const nextSec = allSections[secIdx+1]
          if(nextSec.lessons?.length){
            navigate(`/learn/${courseId}/${nextSec._id}/${nextSec.lessons.sort((a,b)=>a.order-b.order)[0].order}`)
          } else {
            navigate('/progress')
          }
        } else {
          navigate('/progress')
        }
      }
    } catch(e){ setError(e?.response?.data?.error?.message || 'Failed to complete') }
  }

  if(loading) return <div className="card">Loading...</div>
  if(error) return <div className="card">{error}</div>
  if(!current) return <div className="card">Lesson not found</div>

  return (
    <div className="card">
      <h2>{current.lesson.title}</h2>
      {current.lesson.videoUrl ? (
        <video src={current.lesson.videoUrl} style={{width:'100%',borderRadius:8}} controls />
      ) : (
        <div className="tag">No video</div>
      )}
      <div className="spacer" />
      <h3>Transcript</h3>
      <pre style={{whiteSpace:'pre-wrap'}}>{current.lesson.transcript}</pre>
      <div className="spacer" />
      <button className="btn" onClick={markComplete}>Mark as complete</button>
    </div>
  )
}


