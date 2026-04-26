import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTests, getResults, saveResults } from "../utils/storage";
import { generateId } from "../utils/id";

export default function TestPage() {
  const { id } = useParams();

  const test = getTests().find(t => String(t.lessonId) === String(id));

  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const results = getResults();

    const alreadyDone = results.find(
      r => String(r.lessonId) === String(id)
    );

    if (alreadyDone) {
      setBlocked(true);
      setResult(alreadyDone);
    }
  }, [id]);

  if (!test) {
    return <p>Теста нет</p>;
  }

  const handleSelect = (qIndex, optIndex) => {
    setAnswers(prev => ({
      ...prev,
      [qIndex]: optIndex
    }));
  };

  const submit = () => {
    let score = 0;

    test.questions.forEach((q, i) => {
      if (answers[i] === q.correct) {
        score++;
      }
    });

    const percent = Math.round(
      (score / test.questions.length) * 100
    );

    const finalResult = {
      id: generateId(),
      lessonId: id,
      score,
      total: test.questions.length,
      percent
    };

    const results = getResults();
    saveResults([...results, finalResult]);

    setResult(finalResult);
    setBlocked(true);
  };

  if (blocked && result) {
    return (
      <div className="card">
        <h2>Вы уже прошли тест</h2>
        <p>Результат: {result.percent}%</p>
        <p>
          Балл: {result.score} / {result.total}
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div
        className="card"
        style={{
          background:
            result.percent >= 50 ? "#dcfce7" : "#fee2e2"
        }}
      >
        <h2>
          {result.percent >= 50
            ? "Ты сдал 🎉"
            : "Не сдано 😔"}
        </h2>

        <p>
          Балл: {result.score} / {result.total}
        </p>

        <p>Процент: {result.percent}%</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Тест</h2>

      {test.questions.map((q, i) => (
        <div key={i} className="card">
          <p><b>{q.question}</b></p>

          {q.options.map((opt, j) => (
            <label
              key={j}
              style={{ display: "block", cursor: "pointer" }}
            >
              <input
                type="radio"
                name={`q-${i}`}
                checked={answers[i] === j}
                onChange={() => handleSelect(i, j)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button onClick={submit}>
        Завершить
      </button>
    </div>
  );
}