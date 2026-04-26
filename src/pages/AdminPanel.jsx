import { useState, useEffect } from "react";
import { getCourses, saveCourses } from "../utils/storage";
import { generateId } from "../utils/id";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const createCourse = () => {
    if (!newTitle.trim()) {
      alert("Введите название курса");
      return;
    }

    setIsSubmitting(true);

    const newCourse = {
      id: generateId(),
      title: newTitle.trim(),
      description: newDescription.trim() || "Описание будет добавлено позже",
      lessons: [],
      createdAt: new Date().toISOString(),
      students: 0
    };

    const updated = [...courses, newCourse];
    setCourses(updated);
    saveCourses(updated);
    
    setNewTitle("");
    setNewDescription("");
    setShowForm(false);
    setIsSubmitting(false);
    
    alert("✅ Курс успешно создан!");
  };

  const deleteCourse = (id, title) => {
    if (window.confirm(`Вы уверены, что хотите удалить курс "${title}"?`)) {
      const updated = courses.filter(c => c.id !== id);
      setCourses(updated);
      saveCourses(updated);
      alert("🗑️ Курс удален");
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h1>⚙️ Панель администратора</h1>
          <p className="admin-subtitle">Управление курсами и контентом</p>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-header">
          <h2>➕ Создать новый курс</h2>
          <button 
            className="toggle-form-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "− Свернуть" : "+ Развернуть"}
          </button>
        </div>

        {showForm && (
          <div className="create-course-card">
            <div className="form-group-modern">
              <label>Название курса</label>
              <input
                type="text"
                placeholder="Например: Продвинутый React"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group-modern">
              <label>Описание курса</label>
              <textarea
                placeholder="Расскажите, о чем этот курс..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows="3"
              />
            </div>

            <div className="form-actions-modern">
              <button 
                className="btn-cancel-modern" 
                onClick={() => {
                  setShowForm(false);
                  setNewTitle("");
                  setNewDescription("");
                }}
              >
                Отмена
              </button>
              <button 
                className="btn-create-modern" 
                onClick={createCourse}
                disabled={isSubmitting || !newTitle.trim()}
              >
                {isSubmitting ? "Создание..." : "✨ Создать курс"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="admin-section">
        <div className="section-header">
          <h2>📚 Существующие курсы</h2>
          <span className="courses-count">{courses.length} курсов</span>
        </div>

        {courses.length === 0 ? (
          <div className="empty-courses">
            <p>Пока нет созданных курсов</p>
            <button onClick={() => setShowForm(true)} className="btn-create-first">
              Создать первый курс
            </button>
          </div>
        ) : (
          <div className="courses-list-admin">
            {courses.map(course => (
              <div key={course.id} className="course-item-admin">
                <div className="course-info">
                  <div className="course-icon">📘</div>
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-meta">
                      <span className="meta-badge">
                        📖 {course.lessons?.length || 0} уроков
                      </span>
                      <span className="meta-badge">
                        👨‍🎓 {course.students || 0} студентов
                      </span>
                      <span className="meta-badge">
                        📅 {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'Недавно'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="course-actions-admin">
                  <Link to={`/courses/${course.id}`} className="action-link view-link">
                    Просмотр
                  </Link>
                  <Link to={`/courses/edit/${course.id}`} className="action-link edit-link">
                    Редактировать
                  </Link>
                  <button 
                    onClick={() => deleteCourse(course.id, course.title)} 
                    className="action-link delete-link"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-tip">
        <p>💡 <strong>Совет:</strong> Чтобы увидеть результаты студентов, перейдите в любой курс и прокрутите вниз до раздела "Результаты студентов"</p>
      </div>
    </div>
  );
}