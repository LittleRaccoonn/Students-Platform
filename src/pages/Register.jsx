import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    birthDate: "",
    role: "student",
    code: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handle = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password || !form.name || !form.surname) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    const res = register(form);

    if (res === "wrong_code") {
      setError("Неверный код учителя");
      return;
    }

    if (!res) {
      setError("Пользователь с таким email уже существует");
      return;
    }

    setSuccess("Регистрация успешна! Перенаправление...");
    setTimeout(() => nav("/login"), 2000);
  };

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Создание аккаунта</h1>
        <p className="form-subtitle">Присоединяйтесь к нашей платформе</p>
      </div>

      <form onSubmit={handle} className="modern-form">
        {error && <div className="error-alert">{error}</div>}
        {success && <div className="success-alert">{success}</div>}

        <div className="form-row">
          <div className="form-field">
            <label>Имя</label>
            <input name="name" placeholder="Иван" onChange={change} required />
          </div>

          <div className="form-field">
            <label>Фамилия</label>
            <input name="surname" placeholder="Петров" onChange={change} required />
          </div>
        </div>

        <div className="form-field">
          <label>Email</label>
          <input name="email" type="email" placeholder="ivan@example.com" onChange={change} required />
        </div>

        <div className="form-field">
          <label>Пароль</label>
          <input name="password" type="password" placeholder="••••••" onChange={change} required />
        </div>

        <div className="form-field">
          <label>Дата рождения</label>
          <input name="birthDate" type="date" onChange={change} />
        </div>

        <div className="form-field">
          <label>Роль</label>
          <select name="role" onChange={change}>
            <option value="student">Студент</option>
            <option value="admin">Учитель</option>
          </select>
        </div>

        {form.role === "admin" && (
          <div className="form-field">
            <label>Код учителя</label>
            <input name="code" placeholder="Введите код" onChange={change} />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Зарегистрироваться
          </button>
        </div>

        <p className="auth-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
}