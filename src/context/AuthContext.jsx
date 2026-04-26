import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Ошибка парсинга user:", e);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const register = (form) => {
    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Проверка существует ли пользователь
      const exists = users.find(u => u.email === form.email);
      if (exists) return false;

      // Проверка кода учителя
      if (form.role === "admin" && form.code !== "12334") {
        return "wrong_code";
      }

      const newUser = {
        id: Date.now(),
        email: form.email,
        password: form.password,
        name: form.name,
        surname: form.surname,
        birthDate: form.birthDate,
        role: form.role,
        avatar: ""
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      console.log("Пользователь зарегистрирован:", newUser);
      return true;
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      return false;
    }
  };

  const login = ({ email, password }) => {
    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      console.log("Все пользователи:", users);

      const found = users.find(
        u => u.email === email && u.password === password
      );

      if (!found) {
        console.log("Пользователь не найден");
        return false;
      }

      console.log("Пользователь найден:", found);
      setUser(found);
      localStorage.setItem("user", JSON.stringify(found));
      return true;
    } catch (error) {
      console.error("Ошибка логина:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    
    // Обновляем пользователя в массиве users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(u => 
      u.id === user.id ? updated : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      register,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);