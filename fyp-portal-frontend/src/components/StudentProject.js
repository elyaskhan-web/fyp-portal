import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentSideBar from './StudentSideBar';
import { FaCommentDots, FaFolderOpen } from 'react-icons/fa';

const StudentProject = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('https://fyp-portal-backend.onrender.com/api/api/projects/myprojects', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Projects fetched:', response.data);

        if (Array.isArray(response.data)) {
          // Sort the projects: accepted first, then others
          const sortedProjects = response.data.sort((a, b) => {
            if (a.status === 'accepted' && b.status !== 'accepted') return -1;
            if (a.status !== 'accepted' && b.status === 'accepted') return 1;
            return 0;
          });
          setProjects(sortedProjects);
        } else {
          throw new Error('Unexpected API response structure: projects array not found');
        }
      } catch (error) {
        console.error('Error fetching projects:', error.response?.data || error.message);
      }
    };

    fetchProjects();
  }, []);

  const handleCommentClick = (id) => {
    navigate(`/comments/${id}`);
  };

  const handleProjectDetailsClick = (id) => {
    navigate(`/project/${id}`);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700 border border-green-300 rounded px-2 py-1';
      case 'rejected':
        return 'bg-red-100 text-red-700 border border-red-300 rounded px-2 py-1';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300 rounded px-2 py-1';
      default:
        return '';
    }
  };

  const filteredProjects = projects.filter(project =>
    project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row">
      <StudentSideBar className="md:w-1/4" />

      <div className="flex-grow mt-16 md:mt-4 md:ml-4">
        <div className="container flex flex-col md:flex-row items-center justify-center w-auto h-16 bg-gray-100 mt-4 md:mt-16 md:pr-4 px-4 md:px-0">
          <span className="font-bold mr-2">Department Name:</span>
          <span>Computer Science and IT</span>
        </div>

        <div className="w-full md:w-auto mx-auto mt-5 mb-10 p-4 md:p-8 rounded-lg bg-gray-100">
          <span className="font-semibold ml-5">Projects</span>

          {/* SearchBar */}
          <div className="search mx-1 my-1">
            <div className="relative flex w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 pl-10"
                type="text"
                id="search"
                placeholder="Search projects by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="table-auto w-full border-collapse border border-gray-200 shadow-md rounded-lg">
              <thead className="">
                <tr className="header bg-[#6f5cc3] text-white">
                  <th className="px-4 py-3 text-left">Serial No</th>
                  <th className="px-4 py-3 text-left">Project Name</th>
                  <th className="px-4 py-3 text-left">Supervisor</th>
                  <th className="px-4 py-3 text-left">Project Type</th>
                  <th className="px-4 py-3 text-left">Group Members</th>
                  <th className="px-4 py-3 text-left">Degree Type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {filteredProjects.map((project, index) => (
                  <tr key={project._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="px-4 py-2 border-t border-gray-200">{index + 1}</td>
                    <td className="px-4 py-2 border-t border-gray-200">{project.projectTitle}</td>
                    <td className="px-4 py-2 border-t border-gray-200">{project.supervisor?.profile?.fullName || 'N/A'}</td>
                    <td className="px-4 py-2 border-t border-gray-200">{project.projectType}</td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      {[project.student?.username, ...project.groupMembers.filter(Boolean)].join(", ")}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200">{project.program}</td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      <span className={getStatusClass(project.status)}>{project.status}</span>
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      <div className="flex justify-center">
                        {project.status === 'accepted' && (
                          <>
                            <button onClick={() => handleProjectDetailsClick(project._id)} className="text-green-500 hover:text-green-700 mr-2" title="Open Project">
                              <FaFolderOpen />
                            </button>
                            <button onClick={() => handleCommentClick(project._id)} className="text-blue-500 hover:text-blue-700" title="Comment">
                              <FaCommentDots />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProject;
