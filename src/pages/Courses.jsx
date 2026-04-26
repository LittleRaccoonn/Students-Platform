import { useEffect, useState } from "react";
import { getCourses, saveCourses } from "../utils/storage";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const { user } = useAuth();

  useEffect(() => {
    const allCourses = getCourses();
    setCourses(allCourses);
  }, []);

  // Фильтрация и сортировка
  let filteredAndSorted = [...courses];

  // Поиск
  if (searchTerm) {
    filteredAndSorted = filteredAndSorted.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Сортировка
  filteredAndSorted.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredAndSorted.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);

  const deleteCourse = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот курс?")) {
      const updated = courses.filter(c => c.id !== id);
      setCourses(updated);
      saveCourses(updated);
      alert("✅ Курс удален");
    }
  };

  // Сброс на первую страницу при поиске или сортировке
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h2>📚 Все курсы</h2>
        {user?.role === "admin" && (
          <Link to="/courses/create" className="create-btn">
            + Создать курс
          </Link>
        )}
      </div>

      {/* Панель поиска и сортировки */}
      <div className="filters-panel">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Поиск курсов по названию или описанию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">По названию</option>
            <option value="createdAt">По дате создания</option>
          </select>

          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑ По возрастанию" : "↓ По убыванию"}
          </button>
        </div>
      </div>

      {/* Список курсов */}
      {currentCourses.length === 0 ? (
        <div className="empty-state">
          <p>😔 Курсы не найдены</p>
          {searchTerm && <p>Попробуйте изменить поисковый запрос</p>}
        </div>
      ) : (
        <>
          <div className="courses-grid">
            {currentCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-card-inner">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description || "Нет описания"}</p>
                  
                  <div className="course-stats">
                    <span>📖 {course.lessons?.length || 0} уроков</span>
                  </div>
                  
                  <div className="course-actions">
                    <Link to={`/courses/${course.id}`} className="btn-open">
                      Открыть курс
                    </Link>
                    
                    {user?.role === "admin" && (
                      <>
                        <Link to={`/courses/edit/${course.id}`} className="btn-edit" title="Редактировать">
                          ✏️
                        </Link>
                        <button onClick={() => deleteCourse(course.id)} className="btn-delete" title="Удалить">
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Назад
              </button>
              <span className="page-info">
                Страница {currentPage} из {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Вперед →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}