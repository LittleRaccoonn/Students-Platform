import { useEffect, useState } from "react";
import { getCourses } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setCourses(getCourses());
    
    const saved = JSON.parse(localStorage.getItem(`myCourses_${user?.email}`)) || [];
    setMyCourses(saved);
  }, [user]);

  const addCourse = (course) => {
    if (!myCourses.find(c => c.id === course.id)) {
      const updated = [...myCourses, course];
      setMyCourses(updated);
      localStorage.setItem(`myCourses_${user?.email}`, JSON.stringify(updated));
      alert(`✅ Курс "${course.title}" добавлен в ваши курсы!`);
    } else {
      alert("ℹ️ Этот курс уже у вас в списке");
    }
  };

  const removeCourse = (courseId, courseTitle) => {
    if (window.confirm(`Удалить курс "${courseTitle}" из ваших курсов?`)) {
      const updated = myCourses.filter(c => c.id !== courseId);
      setMyCourses(updated);
      localStorage.setItem(`myCourses_${user?.email}`, JSON.stringify(updated));
      alert(`🗑️ Курс "${courseTitle}" удален`);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome">
        <h1>👋 Добро пожаловать, {user?.name}!</h1>
        <p className="welcome-text">Продолжайте учиться и развиваться</p>
      </div>

      {/* Поиск курсов */}
      <div className="search-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Поиск курсов по названию или описанию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Доступные курсы */}
      <div className="dashboard-section">
        <div className="section-title">
          <h2>📚 Доступные курсы</h2>
          <span className="courses-badge">{filteredCourses.length} курсов</span>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="empty-state-dashboard">
            <p>😔 Курсы не найдены</p>
            {searchTerm && <p>Попробуйте изменить поисковый запрос</p>}
          </div>
        ) : (
          <div className="dashboard-courses-grid">
            {filteredCourses.map(course => (
              <div key={course.id} className="dashboard-course-card">
                <div className="course-card-header">
                  <div className="course-icon">📘</div>
                  <h3>{course.title}</h3>
                </div>
                <p>{course.description}</p>
                <div className="course-card-footer">
                  <span className="lessons-count">📖 {course.lessons?.length || 0} уроков</span>
                  <button 
                    onClick={() => addCourse(course)} 
                    className="add-course-btn"
                  >
                    + Добавить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Мои курсы */}
      <div className="dashboard-section">
        <div className="section-title">
          <h2>⭐ Мои курсы</h2>
          <span className="courses-badge">{myCourses.length} курсов</span>
        </div>

        {myCourses.length === 0 ? (
          <div className="empty-state-dashboard">
            <p>📭 У вас пока нет курсов</p>
            <p>Добавьте курс из списка выше, чтобы начать обучение!</p>
          </div>
        ) : (
          <div className="dashboard-courses-grid">
            {myCourses.map(course => (
              <div key={course.id} className="dashboard-course-card my-course">
                <div className="course-card-header">
                  <div className="course-icon">🎓</div>
                  <h3>{course.title}</h3>
                </div>
                <p>{course.description}</p>
                <div className="course-card-footer">
                  <Link to={`/courses/${course.id}`} className="continue-btn">
                    Продолжить обучение →
                  </Link>
                  <button 
                    onClick={() => removeCourse(course.id, course.title)} 
                    className="remove-course-btn"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}