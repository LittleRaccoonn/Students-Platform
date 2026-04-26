import { useParams, Link } from "react-router-dom";
import { getCourses } from "../utils/storage";
import { getCompletedCourses, saveCompletedCourses, getResults } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [courseResults, setCourseResults] = useState([]);

  useEffect(() => {
    const courses = getCourses();
    const foundCourse = courses.find(c => c.id == id);
    setCourse(foundCourse);
  }, [id]);

  useEffect(() => {
    if (!course) return;

    // Проверяем, завершен ли курс (только для студентов)
    if (user && user.role !== "admin") {
      const completedCourses = getCompletedCourses();
      const isCompleted = completedCourses.find(c => c.id === course.id && c.userId === user.id);
      setCompleted(!!isCompleted);
    }

    // Загружаем результаты тестов (ТОЛЬКО для админа)
    if (user?.role === "admin" && course.lessons) {
      const allResults = getResults();
      const lessonIds = course.lessons.map(l => l.id);
      const results = allResults.filter(r => lessonIds.includes(r.lessonId));
      setCourseResults(results);
    }
  }, [course, user]);

  if (!course) return (
    <div className="not-found">
      <h2>Курс не найден</h2>
      <Link to="/courses">Вернуться к курсам</Link>
    </div>
  );

  const completeCourse = () => {
    const completedCourses = getCompletedCourses();
    const exists = completedCourses.find(c => c.id === course.id && c.userId === user?.id);

    if (!exists) {
      const updated = [
        { 
          id: course.id, 
          title: course.title, 
          userId: user?.id,
          completedAt: new Date().toISOString() 
        },
        ...completedCourses
      ];
      saveCompletedCourses(updated);
      setCompleted(true);
      alert("🎉 Поздравляем! Курс завершён!");
    } else {
      alert("Вы уже завершили этот курс");
    }
  };

  const getAverageScore = () => {
    if (courseResults.length === 0) return 0;
    const sum = courseResults.reduce((acc, r) => acc + r.percent, 0);
    return Math.round(sum / courseResults.length);
  };

  return (
    <div className="course-detail">
      <Link to="/courses" className="back-link">← Назад к курсам</Link>
      
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
        {completed && (
          <div className="completed-badge">✅ Курс завершен</div>
        )}
      </div>

      {/* Результаты для админа - видны ТОЛЬКО в деталях курса */}
      {user?.role === "admin" && courseResults.length > 0 && (
        <div className="admin-results-section">
          <h3>📊 Результаты студентов по этому курсу</h3>
          <div className="results-summary">
            <div className="summary-card">
              <span className="summary-number">{courseResults.length}</span>
              <span className="summary-label">Пройдено тестов</span>
            </div>
            <div className="summary-card">
              <span className="summary-number">{getAverageScore()}%</span>
              <span className="summary-label">Средний балл</span>
            </div>
          </div>
          <div className="results-list">
            {courseResults.map((result, idx) => (
              <div key={result.id} className="result-item-mini">
                <span className="result-number">#{idx + 1}</span>
                <span className="result-score">{result.percent}%</span>
                <div className="result-bar">
                  <div 
                    className="result-fill" 
                    style={{ 
                      width: `${result.percent}%`,
                      background: result.percent >= 70 ? '#38a169' : result.percent >= 50 ? '#ed8936' : '#e53e3e'
                    }}
                  />
                </div>
                <span className="result-detail">{result.score}/{result.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Если у админа нет результатов */}
      {user?.role === "admin" && courseResults.length === 0 && course.lessons?.length > 0 && (
        <div className="admin-results-section">
          <h3>📊 Результаты студентов</h3>
          <p className="no-results">Пока нет результатов тестов по этому курсу</p>
        </div>
      )}

      <div className="lessons-section">
        <div className="lessons-header">
          <h2>📖 Уроки курса</h2>
          {user?.role === "admin" && (
            <Link to={`/lessons/create/${course.id}`} className="btn">
              + Добавить урок
            </Link>
          )}
        </div>

        {course.lessons?.length === 0 && (
          <div className="empty-lessons">
            <p>В этом курсе пока нет уроков</p>
            {user?.role === "admin" && (
              <Link to={`/lessons/create/${course.id}`}>Добавить первый урок →</Link>
            )}
          </div>
        )}

        <div className="lessons-grid">
          {course.lessons?.map((lesson, index) => (
            <div key={lesson.id} className="lesson-card">
              <div className="lesson-number">{index + 1}</div>
              <div className="lesson-content">
                <h3>{lesson.title}</h3>
                <p>{lesson.content?.substring(0, 100)}...</p>
                <Link to={`/lessons/${lesson.id}`} className="btn-open-lesson">
                  Перейти к уроку →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {course.lessons?.length > 0 && user?.role !== "admin" && !completed && (
        <div className="complete-course">
          <button onClick={completeCourse} className="btn-complete">
            🎓 Завершить курс
          </button>
        </div>
      )}
    </div>
  );
}