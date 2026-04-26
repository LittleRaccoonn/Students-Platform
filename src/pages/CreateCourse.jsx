import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, saveCourses } from "../utils/storage";
import { generateId } from "../utils/id";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Пожалуйста, введите название курса");
      return;
    }

    setIsSubmitting(true);

    const courses = getCourses();
    const newCourse = {
      id: generateId(),
      title: title.trim(),
      description: description.trim() || "Описание будет добавлено позже",
      lessons: [],
      createdAt: new Date().toISOString(),
      students: 0
    };

    const updated = [...courses, newCourse];
    saveCourses(updated);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/courses");
    }, 500);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <button onClick={() => navigate("/courses")} className="back-button">
          ← Назад
        </button>
        <h1>Создание нового курса</h1>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-field">
          <label>
            <span className="field-icon">📚</span>
            Название курса
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название курса"
            autoFocus
          />
          <small className="field-hint">
            Название должно быть понятным и привлекательным
          </small>
        </div>

        <div className="form-field">
          <label>
            <span className="field-icon">📝</span>
            Описание курса
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Расскажите, о чем этот курс..."
            rows="6"
          />
          <small className="field-hint">
            Опишите, чему научатся студенты (необязательно)
          </small>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/courses")} className="btn-secondary">
            Отмена
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Создание..." : "✨ Создать курс"}
          </button>
        </div>
      </form>
    </div>
  );
}