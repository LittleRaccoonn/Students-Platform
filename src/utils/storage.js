export const getCourses = () =>
  JSON.parse(localStorage.getItem("courses")) || [];

export const saveCourses = (courses) =>
  localStorage.setItem("courses", JSON.stringify(courses));

export const getTests = () =>
  JSON.parse(localStorage.getItem("tests")) || [];

export const saveTests = (tests) =>
  localStorage.setItem("tests", JSON.stringify(tests));

export const getResults = () =>
  JSON.parse(localStorage.getItem("results")) || [];

export const saveResults = (results) =>
  localStorage.setItem("results", JSON.stringify(results));

export const getCompletedCourses = () =>
  JSON.parse(localStorage.getItem("completedCourses")) || [];

export const saveCompletedCourses = (data) =>
  localStorage.setItem("completedCourses", JSON.stringify(data));

/* 👇 пользовательские курсы (по email) */
export const getUserCourses = (email) => {
  const all = JSON.parse(localStorage.getItem("userCourses")) || {};
  return all[email] || [];
};

export const saveUserCourses = (email, courses) => {
  const all = JSON.parse(localStorage.getItem("userCourses")) || {};
  all[email] = courses;
  localStorage.setItem("userCourses", JSON.stringify(all));
};

export const getUsers = () =>
  JSON.parse(localStorage.getItem("users")) || [];

export const saveUsers = (users) =>
  localStorage.setItem("users", JSON.stringify(users));

export const getUserCompletedCourses = (userId) => {
  const allCompleted = JSON.parse(localStorage.getItem("completedCourses")) || [];
  return allCompleted.filter(course => course.userId === userId);
};