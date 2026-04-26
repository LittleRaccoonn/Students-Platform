import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourses, saveCourses } from "../utils/storage";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const courses = getCourses();
    const course = courses.find(c => c.id == id);
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
    }
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Пожалуйста, введите название курса");
      return;
    }

    setIsSubmitting(true);

    const courses = getCourses();
    const updated = courses.map(course =>
      course.id == id
        ? { ...course, title: title.trim(), description: description.trim() }
        : course
    );

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
        <h1>Редактирование курса</h1>
        <p className="form-subtitle">Измените информацию о курсе</p>
      </div>

      <form onSubmit={handleUpdate} className="modern-form">
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
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/courses")} className="btn-secondary">
            Отмена
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Сохранение..." : "💾 Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}