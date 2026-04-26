import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourses, saveCourses } from "../utils/storage";
import { generateId } from "../utils/id";

export default function CreateLesson() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Пожалуйста, введите название урока");
      return;
    }

    setIsSubmitting(true);

    const courses = getCourses();
    const courseExists = courses.find(c => c.id == courseId);

    if (!courseExists) {
      alert("Курс не найден");
      setIsSubmitting(false);
      return;
    }

    const updated = courses.map(course => {
      if (course.id == courseId) {
        return {
          ...course,
          lessons: [
            ...(course.lessons || []),
            {
              id: generateId(),
              title: title.trim(),
              content: content.trim() || "Содержание урока будет добавлено позже",
              fileUrl: fileUrl || "",
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return course;
    });

    saveCourses(updated);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/courses/${courseId}`);
    }, 500);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <button onClick={() => navigate(`/courses/${courseId}`)} className="back-button">
          ← Назад к курсу
        </button>
        <h1>Создание нового урока</h1>
        <p className="form-subtitle">Добавьте материалы для студентов</p>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-field">
          <label>
            <span className="field-icon">📖</span>
            Название урока
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Введение в JavaScript"
            autoFocus
          />
          <small className="field-hint">
            Краткое и понятное название урока
          </small>
        </div>

        <div className="form-field">
          <label>
            <span className="field-icon">📄</span>
            Текст урока
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Здесь вы можете написать содержание урока, теорию, примеры кода..."
            rows="8"
          />
          <small className="field-hint">
            Подробное объяснение темы урока (необязательно)
          </small>
        </div>

        <div className="form-field">
          <label>
            <span className="field-icon">🔗</span>
            Ссылка на файл (необязательно)
          </label>
          <input
            type="url"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://example.com/presentation.pdf"
          />
          <small className="field-hint">
            Можно добавить ссылку на видео, презентацию, PDF или другой материал
          </small>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(`/courses/${courseId}`)} className="btn-secondary">
            Отмена
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Сохранение..." : "💾 Сохранить урок"}
          </button>
        </div>
      </form>
    </div>
  );
}