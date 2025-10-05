import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedCourses = async () => {
      try {
        const { data } = await api.get('/api/v1/course/getAllCourses?limit=3&offset=0');
        setFeaturedCourses(data.data?.items || []);
      } catch (error) {
        console.error('Failed to load featured courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCourses();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ color: "var(--brand)" }}>Welcome to MicroCourses</h1>
        <p style={{ color: "var(--text)" }}>
          Learn, teach, and grow. Enroll in courses, create content, and earn certificates—all in one place.
        </p>
        <div className="flex">
            <Link to="/courses">
            <button className="btn">Browse Courses</button>
          </Link>
          <Link to="/auth/signup">
            <button className="btn secondary">Become a Teacher</button>
          </Link>
        </div>
      </div>

      <div className="spacer"></div>

      {/* Featured Courses Section */}
      {!loading && featuredCourses.length > 0 && (
        <>
          <h2 style={{ color: "var(--brand)", marginBottom: "12px" }}>Featured Courses</h2>
          <div className="grid cols-3">
            {featuredCourses.map(course => (
              <div className="card" key={course._id}>
                <img 
                  src={course.thumbnail} 
                  alt={course.courseName} 
                  style={{width:'100%',height:160,objectFit:'cover',borderRadius:8,marginBottom:8}} 
                />
                <h3>{course.courseName}</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                  {course.courseDescription?.substring(0, 100)}...
                </p>
                <div className="row">
                  <span className="tag">{course.category?.name}</span>
                  <span className="tag">${course.price}</span>
                </div>
                <div className="spacer" />
                <Link className="btn" to={`/courses/${course._id}`}>View Course</Link>
              </div>
            ))}
          </div>
          <div className="spacer"></div>
        </>
      )}

      <h2 style={{ color: "var(--brand)", marginBottom: "12px" }}>Features</h2>
      <div className="grid cols-3">
        <div className="card">
          <h3 style={{ color: "var(--brand)" }}>Enroll Courses</h3>
          <p style={{ color: "var(--muted)" }}>
            Students can browse and enroll in microcourses to learn at their own pace.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: "var(--brand)" }}>Create Courses</h3>
          <p style={{ color: "var(--muted)" }}>
            Teachers can add new courses, upload content, and manage their students.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: "var(--brand)" }}>Certificates</h3>
          <p style={{ color: "var(--muted)" }}>
            Students earn certificates on course completion to showcase their skills.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: "var(--brand)" }}>Track Progress</h3>
          <p style={{ color: "var(--muted)" }}>
            Monitor your learning progress and achievements in real-time.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: "var(--brand)" }}>Community</h3>
          <p style={{ color: "var(--muted)" }}>
            Connect with teachers and fellow students, ask questions, and collaborate.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: "var(--brand)" }}>Secure & Reliable</h3>
          <p style={{ color: "var(--muted)" }}>
            Safe platform to learn, teach, and share knowledge with trust.
          </p>
        </div>
      </div>

      <div className="spacer"></div>

      {/* Call to Action */}
      <div className="card" style={{ textAlign: "center" }}>
        <h2 style={{ color: "var(--brand)" }}>Start Your Journey Today</h2>
        <p style={{ color: "var(--text)" }}>
          Whether you want to learn or teach, MicroCourses has you covered.
        </p>
        <Link to="/auth/signup">
          <button className="btn">Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
