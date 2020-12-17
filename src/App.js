import './App.css';
import React, { useState, useEffect, useReducer } from 'react';
import CoursesList from './CoursesList';
import Search from './Search';

const courses_data = [
  {
    title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
    author: "Maximilian Schwarzmülller",
    hours_video: 40.5,
    number_of_lectures: 490,
    rating: 4.6,
    url: "https://codingthesmartway.com/courses/react-complete-guide/"
  },
  {
    title: "Modern React with Redux",
    author: "Stephen Grider",
    hours_video: 47.5,
    number_of_lectures: 488,
    rating: 4.6,
    url: "https://codingthesmartway.com/courses/modern-react-with-redux/"
  },
  {
    title: "The Complete React Developer Course (w/ Hooks and Redux)",
    author: "Andrew Mead",
    hours_video: 39,
    number_of_lectures: 200,
    rating: 4.7,
    url: "http://codingthesmartway.net/courses/complete-react-web-app-developer/"
  }
];

const coursesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COURSES':
      return action.payload;
    case 'REMOVE_COURSE':
      return state.filter(
        course => action.payload.id !== course.id
      );
    default:
      throw new Error();
  }
};

const App = () => {
  const [courses, dispatchCourses] = useReducer(
    coursesReducer,
    []
  );

  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState(
    localStorage.getItem('searchText') || ''
  );

  const handleSearch = event => {
    setSearchText(event.target.value);
  };

  const handleRemoveCourse = course => {
    dispatchCourses({
      type: 'REMOVE_COURSE',
      payload: course
    })
  };

  const getCoursesAsync = () =>
    new Promise(resolve =>
      setTimeout(
        () => resolve({ courses: courses_data }),
        2000
      )
    );

  useEffect(() => {
    setIsLoading(true);
    getCoursesAsync().then(result => {
      dispatchCourses({
        type: 'SET_COURSES',
        payload: result.courses
      });
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('searchText', searchText)
  }, [searchText]);

  //TODO: make this case-insensitive search
  const filteredCourses = courses.filter(course => {
    return course.title.includes(searchText) || course.author.includes(searchText);
  });

  return (
    <div>
      <h1>List of Courses</h1>
      <hr />

      <Search onSearch={handleSearch} />

      {isLoading ? (
        <p>Loading courses ...</p>
      ) : (
          <CoursesList courses={filteredCourses} handleRemoveCourse={handleRemoveCourse} />
        )}

    </div>
  );
}

export default App;