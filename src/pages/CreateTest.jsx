import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTests, saveTests } from "../utils/storage";
import { generateId } from "../utils/id";

export default function CreateTest() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        question: "",
        options: ["", "", ""],
        correct: 0
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (window.confirm("Удалить этот вопрос?")) {
      const copy = [...questions];
      copy.splice(index, 1);
      setQuestions(copy);
    }
  };

  const updateQuestion = (index, value) => {
    const copy = [...questions];
    copy[index].question = value;
    setQuestions(copy);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const copy = [...questions];
    copy[qIndex].options[oIndex] = value;
    setQuestions(copy);
  };

  const setCorrect = (qIndex, value) => {
    const copy = [...questions];
    copy[qIndex].correct = parseInt(value);
    setQuestions(copy);
  };

  const saveTest = () => {
    // Валидация
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`❌ Вопрос ${i + 1}: введите текст вопроса`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          alert(`❌ Вопрос ${i + 1}: заполните вариант ответа ${j + 1}`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    const tests = getTests();
    const newTest = {
      id: generateId(),
      lessonId: lessonId,
      questions: questions.map(q => ({
        question: q.question,
        options: q.options,
        correct: q.correct
      })),
      createdAt: new Date().toISOString()
    };

    saveTests([...tests, newTest]);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/lessons/${lessonId}`);
    }, 500);
  };

  return (
    <div className="test-builder-container">
      <div className="test-builder-header">
        <button onClick={() => navigate(`/lessons/${lessonId}`)} className="back-button">
          ← Назад к уроку
        </button>
        <h1>📝 Конструктор теста</h1>
        <p className="builder-subtitle">Создайте вопросы для проверки знаний студентов</p>
      </div>

      <div className="questions-list">
        {questions.map((q, index) => (
          <div key={q.id} className="question-card">
            <div className="question-header">
              <h3>Вопрос {index + 1}</h3>
              <button 
                className="remove-question-btn"
                onClick={() => removeQuestion(index)}
              >
                🗑️ Удалить
              </button>
            </div>

            <div className="question-field">
              <label>Текст вопроса</label>
              <input
                type="text"
                placeholder="Например: Что такое React?"
                value={q.question}
                onChange={(e) => updateQuestion(index, e.target.value)}
              />
            </div>

            <div className="options-field">
              <label>Варианты ответов</label>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="option-input">
                  <span className="option-letter">{String.fromCharCode(65 + optIndex)}.</span>
                  <input
                    type="text"
                    placeholder={`Вариант ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(index, optIndex, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="correct-field">
              <label>✅ Правильный ответ</label>
              <select value={q.correct} onChange={(e) => setCorrect(index, e.target.value)}>
                <option value={0}>Вариант A</option>
                <option value={1}>Вариант B</option>
                <option value={2}>Вариант C</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="test-builder-actions">
        <button onClick={addQuestion} className="add-question-btn">
          + Добавить вопрос
        </button>
        
        {questions.length > 0 && (
          <button 
            onClick={saveTest} 
            className="save-test-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохранение..." : "💾 Сохранить тест"}
          </button>
        )}
      </div>
    </div>
  );
}