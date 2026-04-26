import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, saveCourses } from "../utils/storage";
import { generateId } from "../utils/id";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Название курса обязательно";
    if (title.length > 100) newErrors.title = "Название не более 100 символов";
    if (description.length > 500) newErrors.description = "Описание не более 500 символов";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
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
      
      setIsSubmitting(false);
      setSuccessMessage("✅ Курс успешно создан!");
      
      setTimeout(() => {
        navigate("/courses");
      }, 1500);
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
        {successMessage && <div className="success-alert">{successMessage}</div>}
        
        <div className="form-field">
          <label>
            <span className="field-icon">📚</span>
            Название курса
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({});
            }}
            placeholder="Введите название курса"
            className={errors.title ? "error" : ""}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
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
            rows="5"
            className={errors.description ? "error" : ""}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
          <small className="field-hint">{description.length}/500 символов</small>
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