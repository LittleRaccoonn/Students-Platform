export const initDemoData = () => {
  // Проверяем, есть ли уже пользователи
  const users = localStorage.getItem("users");
  if (!users || JSON.parse(users).length === 0) {
    // Создаём демо-пользователей
    const demoUsers = [
      {
        id: 1,
        email: "student@test.com",
        password: "123456",
        name: "Иван",
        surname: "Петров",
        birthDate: "1995-05-15",
        role: "student",
        avatar: ""
      },
      {
        id: 2,
        email: "teacher@test.com",
        password: "123456",
        name: "Анна",
        surname: "Сидорова",
        birthDate: "1988-10-20",
        role: "admin",
        avatar: ""
      }
    ];
    localStorage.setItem("users", JSON.stringify(demoUsers));
    console.log("✅ Демо-пользователи созданы:", demoUsers);
  }

  // Проверяем, есть ли уже курсы
  const courses = localStorage.getItem("courses");
  if (!courses || JSON.parse(courses).length === 0) {
    // Создаём демо-курсы
    const demoCourses = [
      {
        id: "course_1",
        title: "JavaScript для начинающих",
        description: "Полный курс по JavaScript с нуля до продвинутого уровня. Изучите основы программирования и создавайте интерактивные веб-страницы.",
        lessons: [
          {
            id: "lesson_1_1",
            title: "Введение в JavaScript",
            content: "JavaScript - это язык программирования, который добавляет интерактивность на веб-страницы. Он работает в браузере и позволяет создавать динамический контент.",
            fileUrl: ""
          },
          {
            id: "lesson_1_2",
            title: "Переменные и типы данных",
            content: "В JavaScript есть разные типы данных: числа, строки, булевы значения, массивы и объекты. Переменные объявляются с помощью let, const или var.",
            fileUrl: ""
          },
          {
            id: "lesson_1_3",
            title: "Функции в JavaScript",
            content: "Функции - это блоки кода, которые можно вызывать многократно. Они помогают организовать код и избежать повторений.",
            fileUrl: ""
          }
        ]
      },
      {
        id: "course_2",
        title: "React с нуля",
        description: "Изучите React - самую популярную библиотеку для создания пользовательских интерфейсов. Создавайте современные веб-приложения.",
        lessons: [
          {
            id: "lesson_2_1",
            title: "Что такое React",
            content: "React - это библиотека для создания пользовательских интерфейсов. Она использует компонентный подход и виртуальный DOM.",
            fileUrl: ""
          },
          {
            id: "lesson_2_2",
            title: "Компоненты и пропсы",
            content: "Компоненты - это строительные блоки React-приложений. Они могут принимать пропсы и возвращать JSX.",
            fileUrl: ""
          }
        ]
      },
      {
        id: "course_3",
        title: "HTML и CSS",
        description: "Базовый курс по вёрстке веб-страниц. Научитесь создавать красивые и адаптивные сайты.",
        lessons: []
      }
    ];
    localStorage.setItem("courses", JSON.stringify(demoCourses));
    console.log("✅ Демо-курсы созданы:", demoCourses);
  }

  // Проверяем, есть ли тесты
  const tests = localStorage.getItem("tests");
  if (!tests || JSON.parse(tests).length === 0) {
    // Создаём демо-тесты
    const demoTests = [
      {
        id: "test_1",
        lessonId: "lesson_1_1",
        questions: [
          {
            question: "Что такое JavaScript?",
            options: [
              "Язык программирования",
              "База данных",
              "Стиль CSS",
              "HTML-тег"
            ],
            correct: 0
          },
          {
            question: "Где выполняется JavaScript?",
            options: [
              "На сервере",
              "В браузере пользователя",
              "В базе данных",
              "В компиляторе"
            ],
            correct: 1
          }
        ]
      },
      {
        id: "test_2",
        lessonId: "lesson_1_2",
        questions: [
          {
            question: "Как объявить переменную в современном JavaScript?",
            options: [
              "var x = 5",
              "let x = 5",
              "x = 5",
              "int x = 5"
            ],
            correct: 1
          },
          {
            question: "Какой тип данных используется для хранения текста?",
            options: [
              "Number",
              "String",
              "Boolean",
              "Array"
            ],
            correct: 1
          }
        ]
      }
    ];
    localStorage.setItem("tests", JSON.stringify(demoTests));
    console.log("✅ Демо-тесты созданы");
  }

  // Инициализируем пустые результаты, если их нет
  const results = localStorage.getItem("results");
  if (!results) {
    localStorage.setItem("results", JSON.stringify([]));
  }

  // Инициализируем завершённые курсы
  const completedCourses = localStorage.getItem("completedCourses");
  if (!completedCourses) {
    localStorage.setItem("completedCourses", JSON.stringify([]));
  }

  console.log("🎉 Демо-данные успешно загружены!");
};