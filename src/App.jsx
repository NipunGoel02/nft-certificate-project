import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/preloader.css';
import { useState, useEffect } from 'react';
import AdminUsers from './pages/AdminUsers.jsx';

import Preloader from './components/PreLoaded.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/Coursedetail';
import CourseLearning from './pages/CourseLearning';
import Quiz from './pages/Quiz';
import Certificate from './pages/Certificate';
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute'; // New admin route component
import HackathonOrganizerRoute from './components/Auth/HackathonOrganizerRoute'; // New hackathon organizer route component
import InternshipOrganizerRoute from './components/Auth/InternshipOrganizerRoute'; // New internship organizer route component
import Profile from './pages/Profile';
import Login from './components/Auth/Login.jsx';
import Signup from './components/Auth/Signup';
import CoursePanel from './pages/CoursePanel';
import AdminLayout from './components/AdminLayout'; // New admin layout
import HackathonOrganizerLayout from './components/HackathonOrganizerLayout';
import AdminCourses from './pages/AdminCourse'; // Admin courses list
import CourseForm from './pages/CourseForm'; // Admin course form
import HackathonList from './pages/hackathon/HackathonList';
import HackathonDetail from './pages/hackathon/HackathonDetail';
import CreateHackathon from './pages/hackathon/CreateHackathon';
import SubmitProject from './pages/hackathon/SubmitProject';
import Layout from './Layout.jsx';
import TeamManagement from './pages/hackathon/TeamManagment.jsx';
import MyHackathons from './pages/hackathon/MyHackathons.jsx';
import Participants from './pages/hackathon/Participants.jsx';
import OrganizerSubmissions from './pages/hackathon/OrganizerSubmissions.jsx';
import OrganizerCertificates from './pages/hackathon/OrganizerCertificates.jsx';
import PendingInvitations from './pages/hackathon/PendingInvitations.jsx';
import HackathonCertificate from './pages/hackathon/HackathonCertificate.jsx';
import CreateInternship from './pages/internship/CreateInternship';
import InternshipOrganizerSubmissions from './pages/internship/OrganizerSubmissions';
import InternshipOrganizerCertificates from './pages/internship/OrganizerCertificates';
import InternshipPendingInvitations from './pages/internship/PendingInvitations';
import InternshipCertificate from './pages/internship/InternshipCertificate';
import MyInternships from './pages/internship/MyInternships';
import InternshipDetail from './pages/internship/InternshipDetail';
import InternshipOrganizerLayout from './components/InternshipOrganizerLayout';
import PublicProfile from './pages/PublicProfile.jsx';

import './App.css';

function App() {
   const [loading, setLoading] = useState(true);
   
  useEffect(() => {
    // Hide preloader after content loads
    window.addEventListener('load', () => {
      setTimeout(() => setLoading(false), 3000);
    });

        setTimeout(() => setLoading(false), 5000);
  }, []);
  return (
        <>
      {loading && <Preloader />}

     <div className={loading ? 'hidden' : ''}>

    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <div style={{ height: '1px' }}></div> {/* Spacer div */}

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */} 
               <Route element={<Layout />}></Route>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseDetail />} />
               <Route path="/courses/:courseId/learn" element={<CourseLearning />} />
                  <Route path="/courses/:courseId/quiz" element={<Quiz />} />
                   <Route path="/certificates/:courseId" element={<Certificate />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/public-profile/:id" element={<PublicProfile />} />

              {/* Authenticated User Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/course-panel" element={<CoursePanel />} />
                <Route path="/courses/:courseId/learn" element={<CourseLearning />} />
                <Route path="/courses/:courseId/quiz" element={<Quiz />} />
                <Route path="/certificates/:courseId" element={<Certificate />} />
                {/* Hackathon routes requiring authentication */}
                <Route path="/hackathons/:id/team" element={<TeamManagement />} />

                <Route path="/hackathons/:id/submit" element={<SubmitProject />} />
              </Route>

              {/* Public Hackathon Routes*/}
              <Route element={<HackathonOrganizerRoute />}>
                <Route path="/hackathons/create" element={<CreateHackathon />} />
                <Route path="/organizer" element={<HackathonOrganizerLayout />}>
                  <Route path="my-hackathons" element={<MyHackathons />} />
                  <Route path="participants" element={<Participants />} />
                  <Route path="submissions" element={<OrganizerSubmissions />} />
                  <Route path="judging" element={<div>Judging Page (to be implemented)</div>} />
                <Route path="certificates" element={<OrganizerCertificates />} />
                <Route path="analytics" element={<div>Analytics Page (to be implemented)</div>} />
              
              </Route>
            </Route>
              <Route path="pending-invitations" element={<PendingInvitations />} />
              <Route path="/hackathons" element={<HackathonList />} />
              <Route path="/hackathons/:id" element={<HackathonDetail />} />
              <Route path="/hackathons/certificate/:hackathonId" element={<HackathonCertificate />} />

              {/* Internship Routes */}
              <Route element={<InternshipOrganizerRoute />}>
                           <Route path='/internships' element = {<InternshipOrganizerLayout />} />
                           <Route path="/internships/create" element={<CreateInternship />} />
                           <Route path="/internships/my-internships" element  = {<MyInternships />} />          
                           <Route path="/internships/organizer/submissions" element={<InternshipOrganizerSubmissions />} />
                           <Route path="/internships/organizer/certificates" element={<InternshipOrganizerCertificates />} />
                           <Route path="/internships/pending-invitations" element={<InternshipPendingInvitations />} />
              </Route>
              <Route path="/internships/certificate/:internshipId" element={<InternshipCertificate />} />
              <Route path="/internships/:id" element={<InternshipDetail />} />

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
       <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminCourses />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="courses/new" element={<CourseForm />} />
                  <Route path="courses/edit/:id" element={<CourseForm />} />
                  <Route path="users" element={<AdminUsers />} />



                </Route>
              </Route>
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
    </div>
    </>
  );
}

export default App;
