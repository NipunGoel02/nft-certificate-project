import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios.get('/api/courses/admin/courses', config).then(res => setCourses(res.data));
  }, []);

  const deleteCourse = async (id) => {
    if(window.confirm('Are you sure?')) {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`/api/courses/admin/courses/${id}`, config);
      setCourses(courses.filter(c => c._id !== id));
    }
  };
  console.log('Courses data:', courses, 'Type:', typeof courses, 'Is array:', Array.isArray(courses));



  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <Link to="/admin/courses/new" className="bg-teal-600 text-white px-4 py-2 rounded">
          Add New Course
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Instructor</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id} className="border-t">
                <td className="px-6 py-4">{course.title}</td>
                <td className="px-6 py-4">{course.instructor?.name || ''}</td>
                <td className="px-6 py-4 space-x-2">
                  <Link 
                    to={`/admin/courses/edit/${course._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deleteCourse(course._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
