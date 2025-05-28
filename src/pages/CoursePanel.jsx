import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCourse } from '../services/courseService';

const CoursePanel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    lessonCount: 0,
    duration: '',
    level: '',
    sections: [],
    outcomes: [],
    requirements: [],
    instructor: {
      name: '',
      title: '',
      bio: '',
      avatar: ''
    }
  });

  const [sectionInput, setSectionInput] = useState({ title: '', duration: '', lessons: [] });
  const [lessonInput, setLessonInput] = useState({ title: '', duration: '', type: '' });
  const [outcomeInput, setOutcomeInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('instructor.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        instructor: {
          ...prev.instructor,
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddLesson = () => {
    if (lessonInput.title && lessonInput.duration && lessonInput.type) {
      setSectionInput(prev => ({
        ...prev,
        lessons: [...prev.lessons, lessonInput]
      }));
      setLessonInput({ title: '', duration: '', type: '' });
    }
  };

  const handleAddSection = () => {
    if (sectionInput.title && sectionInput.duration && sectionInput.lessons.length > 0) {
      setFormData(prev => ({
        ...prev,
        sections: [...prev.sections, sectionInput]
      }));
      setSectionInput({ title: '', duration: '', lessons: [] });
    }
  };

  const handleAddOutcome = () => {
    if (outcomeInput) {
      setFormData(prev => ({
        ...prev,
        outcomes: [...prev.outcomes, outcomeInput]
      }));
      setOutcomeInput('');
    }
  };

  const handleAddRequirement = () => {
    if (requirementInput) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput]
      }));
      setRequirementInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming token is stored in localStorage after login
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to add a course.');
        return;
      }
      await addCourse(formData, token);
      setMessage('Course added successfully!');
      navigate('/courses');
    } catch (error) {
      setMessage('Failed to add course: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Course</h1>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="input" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="input" />
        <input type="text" name="thumbnail" placeholder="Thumbnail URL" value={formData.thumbnail} onChange={handleChange} className="input" />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required className="input" />
        <input type="number" name="lessonCount" placeholder="Lesson Count" value={formData.lessonCount} onChange={handleChange} className="input" />
        <input type="text" name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} className="input" />
        <input type="text" name="level" placeholder="Level" value={formData.level} onChange={handleChange} className="input" />

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Add Section</h2>
          <input type="text" placeholder="Section Title" value={sectionInput.title} onChange={e => setSectionInput(prev => ({ ...prev, title: e.target.value }))} className="input mb-2" />
          <input type="text" placeholder="Section Duration" value={sectionInput.duration} onChange={e => setSectionInput(prev => ({ ...prev, duration: e.target.value }))} className="input mb-2" />
          <div>
            <h3 className="font-semibold mb-1">Add Lesson</h3>
            <input type="text" placeholder="Lesson Title" value={lessonInput.title} onChange={e => setLessonInput(prev => ({ ...prev, title: e.target.value }))} className="input mb-1" />
            <input type="text" placeholder="Lesson Duration" value={lessonInput.duration} onChange={e => setLessonInput(prev => ({ ...prev, duration: e.target.value }))} className="input mb-1" />
            <input type="text" placeholder="Lesson Type" value={lessonInput.type} onChange={e => setLessonInput(prev => ({ ...prev, type: e.target.value }))} className="input mb-2" />
            <button type="button" onClick={handleAddLesson} className="btn btn-secondary mb-2">Add Lesson</button>
          </div>
          <div>
            <h4 className="font-semibold">Lessons in Section:</h4>
            <ul className="list-disc list-inside">
              {sectionInput.lessons.map((lesson, index) => (
                <li key={index}>{lesson.title} - {lesson.duration} ({lesson.type})</li>
              ))}
            </ul>
          </div>
          <button type="button" onClick={handleAddSection} className="btn btn-primary mt-2">Add Section</button>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Outcomes</h2>
          <input type="text" placeholder="Add Outcome" value={outcomeInput} onChange={e => setOutcomeInput(e.target.value)} className="input mb-2" />
          <button type="button" onClick={handleAddOutcome} className="btn btn-secondary mb-2">Add Outcome</button>
          <ul className="list-disc list-inside">
            {formData.outcomes.map((outcome, index) => (
              <li key={index}>{outcome}</li>
            ))}
          </ul>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Requirements</h2>
          <input type="text" placeholder="Add Requirement" value={requirementInput} onChange={e => setRequirementInput(e.target.value)} className="input mb-2" />
          <button type="button" onClick={handleAddRequirement} className="btn btn-secondary mb-2">Add Requirement</button>
          <ul className="list-disc list-inside">
            {formData.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Instructor</h2>
          <input type="text" name="instructor.name" placeholder="Name" value={formData.instructor.name} onChange={handleChange} className="input mb-2" />
          <input type="text" name="instructor.title" placeholder="Title" value={formData.instructor.title} onChange={handleChange} className="input mb-2" />
          <textarea name="instructor.bio" placeholder="Bio" value={formData.instructor.bio} onChange={handleChange} className="input mb-2" />
          <input type="text" name="instructor.avatar" placeholder="Avatar URL" value={formData.instructor.avatar} onChange={handleChange} className="input mb-2" />
        </div>

        <button type="submit" className="btn btn-primary">Add Course</button>
      </form>
    </div>
  );
};

export default CoursePanel;
