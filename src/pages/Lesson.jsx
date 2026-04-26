import { useParams } from "react-router-dom";
import { getCourses } from "../utils/storage";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Lesson() {
  const { id } = useParams();
  const { user } = useAuth();
  const courses = getCourses();

  let lesson = null;
  let currentCourse = null;

  courses.forEach(course => {
    const found = course.lessons?.find(l => l.id == id);
    if (found) {
      lesson = found;
      currentCourse = course;
    }
  });

  if (!lesson) return (
    <div className="not-found">
      <h2>Урок не найден</h2>
      <Link to="/courses">Вернуться к курсам</Link>
    </div>
  );

  return (
    <div className="lesson-page">
      <Link to={`/courses/${currentCourse?.id}`} className="back-link">
        ← Назад к курсу
      </Link>
      
      <div className="lesson-container">
        <div className="lesson-header">
          <h1>{lesson.title}</h1>
          <div className="lesson-meta">
            <span>📖 Курс: {currentCourse?.title}</span>
          </div>
        </div>

        <div className="lesson-content">
          <p>{lesson.content}</p>
          
          {lesson.fileUrl && (
            <div className="lesson-file">
              <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer" className="download-btn">
                📎 Скачать материалы урока
              </a>
            </div>
          )}
        </div>

        <div className="lesson-actions">
          {/* Кнопка создания теста видна ТОЛЬКО админу */}
          {user?.role === "admin" && (
            <Link to={`/tests/create/${lesson.id}`} className="btn-create-test">
              ✏️ Создать тест для этого урока
            </Link>
          )}
          
          {/* Кнопка прохождения теста видна всем */}
          <Link to={`/tests/${lesson.id}`} className="btn-take-test">
            📝 Пройти тест
          </Link>
        </div>
      </div>
    </div>
  );
}