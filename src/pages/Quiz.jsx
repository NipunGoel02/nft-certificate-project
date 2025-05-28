import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Quiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [courseName, setCourseName] = useState('');
  const [user, setUser] = useState(null);
  const [markingCompleted, setMarkingCompleted] = useState(false);
  const [cheatWarning, setCheatWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const timerRef = useRef(null);

  // Track time spent per question
  const timeSpentPerQuestion = useRef(new Array(questions.length).fill(0));
  // Track answer changes per question
  const answerChangesPerQuestion = useRef(new Array(questions.length).fill(0));
  // Track last time question was viewed
  const lastQuestionViewTime = useRef(Date.now());

  // Fetch user profile (to get completedCourses)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch {}
    };
    fetchUser();
  }, []);

  // Fetch quiz questions from the course
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.quizQuestions && response.data.quizQuestions.length > 0) {
          setQuestions(response.data.quizQuestions);
          setAnswers(new Array(response.data.quizQuestions.length).fill(null));
          setCourseName(response.data.title);
          // Initialize tracking arrays
          timeSpentPerQuestion.current = new Array(response.data.quizQuestions.length).fill(0);
          answerChangesPerQuestion.current = new Array(response.data.quizQuestions.length).fill(0);
          lastQuestionViewTime.current = Date.now();
        } else {
          setError('This course does not have any quiz questions yet.');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz questions');
        setLoading(false);
      }
    };
    fetchQuizQuestions();
  }, [courseId]);

  // Timer effect
  useEffect(() => {
    if (!loading && !error && questions.length > 0 && !quizComplete) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleQuizComplete();
            return 0;
          }
          // Update time spent on current question
          const now = Date.now();
          const elapsed = (now - lastQuestionViewTime.current) / 1000;
          timeSpentPerQuestion.current[currentQuestion] += elapsed;
          lastQuestionViewTime.current = now;
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, error, questions, quizComplete, currentQuestion]);

  // Detect tab switch or visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(count => count + 1);
      }
    };
    const handleWindowBlur = () => {
      setTabSwitchCount(count => count + 1);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  // Check if course is completed by user
  const isCompleted = user?.completedCourses?.map(id => id.toString()).includes(courseId);

  const handleAnswer = (option) => {
    const newAnswers = [...answers];
    if (newAnswers[currentQuestion] !== option) {
      // Increment answer change count if answer changed
      answerChangesPerQuestion.current[currentQuestion]++;
    }
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleJumpToQuestion = (index) => setCurrentQuestion(index);

  const handleQuizComplete = async () => {
    if (quizComplete) return;
    clearInterval(timerRef.current);
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.options[question.correctAnswer]) {
        correctAnswers++;
      }
    });
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);

    // Prepare cheatData
    const cheatData = {
      timeSpentPerQuestion: timeSpentPerQuestion.current,
      answerChangesPerQuestion: answerChangesPerQuestion.current,
      totalTime: 600 - timeLeft,
      tabSwitchCount: tabSwitchCount
    };

    // Call backend to submit quiz and mark course as completed
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/userCompletion/submit-quiz', { courseId, answers, cheatData }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizComplete(true);
      if (response.data.cheatSuspected) {
        setCheatWarning(true);
      } else {
        setCheatWarning(false);
      }
      // Do NOT mark course as completed here; wait for certificate claim
    } catch (error) {
      console.error('Quiz submission error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to submit quiz');
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Call backend to mark course as completed
  const markCourseCompleted = async () => {
    setMarkingCompleted(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/userCompletion/complete-course', { courseId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (user) {
        setUser({
          ...user,
          completedCourses: [...(user.completedCourses || []), courseId]
        });
      }
    } catch {}
    setMarkingCompleted(false);
  };

  const handleClaimCertificate = async () => {
    if (cheatWarning) {
      alert('Cheating suspected. You cannot claim the certificate.');
      return;
    }
    await markCourseCompleted();
    navigate(`/certificates/${courseId}`);
  };

  const handleRetakeQuiz = () => {
    if (isCompleted) {
      alert('You have already completed this quiz and claimed the certificate.');
      return;
    }
    setQuizComplete(false);
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(null));
    setTimeLeft(600);
    setCheatWarning(false);
    setTabSwitchCount(0);
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleQuizComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // --- UI RENDERING ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate(`/courses/${courseId}`)}
            className="inline-block px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors duration-300"
          >
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Course Completed</h2>
          <p className="text-gray-700 mb-6">You have already completed this course and claimed your certificate.</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
          <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Quiz Questions</h2>
          <p className="text-gray-600 mb-6">This course doesn't have any quiz questions yet.</p>
          <button 
            onClick={() => navigate(`/courses/${courseId}`)}
            className="inline-block px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors duration-300"
          >
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const passed = score >= 70;
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
          <div className="text-center mb-8">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {passed ? (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {passed ? 'Congratulations!' : 'Quiz Failed'}
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              {passed 
                ? `You've successfully completed the ${courseName} assessment.` 
                : `You didn't meet the passing criteria for the ${courseName} assessment.`}
            </p>
            {cheatWarning && (
              <p className="text-red-600 font-semibold mb-4">
                Cheating suspected. You cannot claim the certificate.
              </p>
            )}
            <div className="inline-block bg-gray-100 rounded-full px-6 py-3 mb-6">
              <span className="text-gray-700 font-medium">Your Score: </span>
              <span className={`text-xl font-bold ${
                passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {score}%
              </span>
              <span className="text-gray-500"> (Passing: 70%)</span>
            </div>
          </div>
          <div className="mb-8">
           
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!isCompleted && (
              <button
                onClick={handleRetakeQuiz}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={markingCompleted}
              >
                Retake Quiz
              </button>
            )}
            {passed && (
              <button
                onClick={handleClaimCertificate}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                disabled={markingCompleted || cheatWarning}
              >
                {markingCompleted ? "Marking Completed..." : "Claim Your Certificate"}
              </button>
            )}
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active quiz state
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-t-xl shadow p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{courseName} Assessment</h1>
              <p className="text-gray-600">Complete the quiz to earn your certificate</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className={`px-4 py-2 rounded-lg flex items-center ${
                timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div 
              className="bg-teal-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>
        {/* Question Navigation */}
        <div className="bg-gray-100 p-4 overflow-x-auto whitespace-nowrap">
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleJumpToQuestion(index)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentQuestion === index
                    ? 'bg-teal-600 text-white' 
                    : answers[index] !== null
                      ? 'bg-teal-100 text-teal-800 border border-teal-300'
                      : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        {/* Question Content */}
        <div className="bg-white rounded-b-xl shadow p-6">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-4 border rounded-lg transition-all ${
                    answers[currentQuestion] === option 
                      ? 'bg-teal-50 border-teal-500 shadow-md' 
                      : 'hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                      answers[currentQuestion] === option 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion] === null}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next'}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
