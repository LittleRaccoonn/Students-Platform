import { useAuth } from "../context/AuthContext";
import { getCompletedCourses } from "../utils/storage";
import { useState, useEffect } from "react";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [completedCount, setCompletedCount] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState(0);

  useEffect(() => {
    // Подсчёт завершённых курсов
    const completed = getCompletedCourses();
    const userCompleted = completed.filter(c => c.userId === user?.id || true); // Временно показываем все
    setCompletedCount(completed.length);

    // Подсчёт записанных курсов пользователя
    const myCourses = JSON.parse(localStorage.getItem(`myCourses_${user?.email}`)) || [];
    setEnrolledCourses(myCourses.length);
  }, [user]);

  const upload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateUser({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={user?.avatar || "https://via.placeholder.com/120"}
            alt="Avatar"
            className="profile-avatar"
          />
          <label className="avatar-upload-label">
            📷
            <input type="file" onChange={upload} accept="image/*" />
          </label>
        </div>
        
        <h2 className="profile-name">{user?.name} {user?.surname}</h2>
        
        <div className={`profile-role ${user?.role === 'admin' ? 'role-admin' : 'role-student'}`}>
          {user?.role === 'admin' ? '👨‍🏫 Преподаватель' : '🎓 Студент'}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Завершённых курсов</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{enrolledCourses}</div>
            <div className="stat-label">Активных курсов</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{user?.role === 'admin' ? '👑' : '⭐'}</div>
            <div className="stat-label">{user?.role === 'admin' ? 'Преподаватель' : 'Студент'}</div>
          </div>
        </div>
      </div>

      <div className="profile-info">
        <h3>📋 Личная информация</h3>
        
        <div className="info-row">
          <div className="info-label">Email:</div>
          <div className="info-value">{user?.email}</div>
        </div>
        
        <div className="info-row">
          <div className="info-label">Имя:</div>
          <div className="info-value">{user?.name || "Не указано"}</div>
        </div>
        
        <div className="info-row">
          <div className="info-label">Фамилия:</div>
          <div className="info-value">{user?.surname || "Не указано"}</div>
        </div>
        
        <div className="info-row">
          <div className="info-label">Дата рождения:</div>
          <div className="info-value">{formatDate(user?.birthDate)}</div>
        </div>
        
        <div className="info-row">
          <div className="info-label">Дата регистрации:</div>
          <div className="info-value">{new Date(user?.id).toLocaleDateString('ru-RU')}</div>
        </div>
      </div>
    </div>
  );
}