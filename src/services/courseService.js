const BASE_URL =  'http://localhost:5000';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getCourses = async () => {
  const res = await fetch(`${BASE_URL}/api/courses`);
  if (!res.ok) {
    throw new Error('Failed to fetch courses');
  }
  const data = await res.json();
  return data;
};

export const getCourseById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/courses/${id}`);
  if (!res.ok) {
    throw new Error('Course not found');
  }
  const data = await res.json();
  return data;
};

export const enrollInCourse = async (courseId, token) => {
  const res = await fetch(`${BASE_URL}/api/auth/enroll`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ courseId }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to enroll in course');
  }
  const data = await res.json();
  return data;
};

export const addCourse = async (courseData, token) => {
  const res = await fetch(`${BASE_URL}/api/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(courseData)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to add course');
  }
  const data = await res.json();
  return data;
};
