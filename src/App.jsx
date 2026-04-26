import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import CreateLesson from "./pages/CreateLesson";
import Lesson from "./pages/Lesson";
import CreateTest from "./pages/CreateTest";
import TestPage from "./pages/TestPage";
import AdminPanel from "./pages/AdminPanel";
// import AdminResults from "./pages/AdminResults"; // ❌ Удалить
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="page">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          <Route
            path="/courses/create"
            element={
              <ProtectedRoute role="admin">
                <CreateCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/edit/:id"
            element={
              <ProtectedRoute role="admin">
                <EditCourse />
              </ProtectedRoute>
            }
          />

          <Route path="/lessons/:id" element={<Lesson />} />

          <Route
            path="/lessons/create/:courseId"
            element={
              <ProtectedRoute role="admin">
                <CreateLesson />
              </ProtectedRoute>
            }
          />

          <Route path="/tests/:id" element={<TestPage />} />

          <Route
            path="/tests/create/:lessonId"
            element={
              <ProtectedRoute role="admin">
                <CreateTest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}