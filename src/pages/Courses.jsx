import { useEffect, useState } from "react";
import { getCourses, saveCourses } from "../utils/storage";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const deleteCourse = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот курс?")) {
      const updated = courses.filter(c => c.id !== id);
      setCourses(updated);
      saveCourses(updated);
    }
  };

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h2>📚 Все курсы</h2>
        {user?.role === "admin" && (
          <Link to="/courses/create" className="btn">
            + Создать курс
          </Link>
        )}
      </div>

      {courses.length === 0 && (
        <div className="empty-state">
          <p>Пока нет курсов</p>
          {user?.role === "admin" && (
            <Link to="/courses/create">Создать первый курс →</Link>
          )}
        </div>
      )}

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-card-inner">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description || "Нет описания"}</p>
              
              <div className="course-stats">
                <span>📖 {course.lessons?.length || 0} уроков</span>
              </div>
              
              <div className="course-actions">
                <Link to={`/courses/${course.id}`} className="btn-open">
                  Открыть курс
                </Link>
                
                {user?.role === "admin" && (
                  <>
                    <Link to={`/courses/edit/${course.id}`} className="btn-edit" title="Редактировать">
                      ✏️
                    </Link>
                    <button onClick={() => deleteCourse(course.id)} className="btn-delete" title="Удалить">
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}