import axios from "axios";
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  
});

export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/api/login_auth/", { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error_message || "Login failed";
  }
};

export const signupUser = async (userData) => {
  try {
    
    const response = await api.post("/api/signup_auth/", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error_message || "Signup failed";
  }
};
export const loginAdmin = async (username, password) => {
  try {
    const response = await api.post("/api/login_admin/", { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error_message || "Login failed";
  }
};

export const signupAdmin = async (userData) => {
  try {
    
    const response = await api.post("/api/signup_admin/", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error_message || "Signup failed";
  }
};

export const loginTeacher= async (username, password) => {
  try {
    const response = await api.post("/api/login_auth_teacher/", { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error_message || "Login failed";
  }
};

export const signupTeacher = async (userData) => {
  try {
    
    const response = await api.post("/api/signup_auth_teacher/", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error_message || "Signup failed";
  }
};



export const fetchSkills = async () => {
  try {
    const response = await api.get(`/lmsai/api/skills/`);
    // console.log("Skills:", response.data);
    return response.data; 
  } catch (error) {
    throw new Error("Failed to fetch skills");
  }
};



export const generatequestionpaper = async (prompt) => {
  try {
    const response = await api.post('/lmsai/api/generate-questions/', { prompt });
    return response.data;
  } catch (error) {
    console.error('Error generating question paper:', error);
    throw error;
  }
};


export const storeAssessment = async (assessmentData) => {
  try {
    const response = await api.post("/lmsai/api/store_questions/", assessmentData);
    console.log("API Response Data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};




export const getTeacherAssessments = async (teacherId) => {
  try {
    const response = await api.post("/api/getting_assesment_id/", { 
      teacher_id: teacherId 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching assessments:', error.response?.data || error.message);
    throw error.response?.data?.error || "Failed to fetch assessments";
  }
};

export const getAssessmentDetails = async (assessmentId) => {
  try {
    const response = await api.get(`/api/assessment_details/${assessmentId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assessment details:', error.response?.data || error.message);
    throw error.response?.data?.error || "Failed to fetch assessment details";
  }
};


export const Assigntostudents = async (assessmentId) => {
  try {
    const response = await api.post(`/lmsai/api/assign/`, { assessment_id: assessmentId });
    console.log("API Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching assessment details:', error.response?.data || error.message);
    throw error.response?.data?.error || "Failed to fetch assessment details";
  }
};

export const tests = async (studentId = null) => {
  try {
    const response = await api.post('/api/test/', {  
      student_id: studentId  
    });
    console.log("Assessments:", response.data);
    return response.data; 
  } catch (error) {
    throw new Error("Failed to fetch assessments");
  }
};

export const fetchTest = async (testId: string) => {
  try {
    const response = await api.post('/api/tests/get', {  // Changed to POST
      testId: testId     
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching test:', error);
    throw error;
  }
};




export const submitTest = async (
  testId: string,
  studentId: string,
  answers: Record<string, string>,
  timeSpent: number
) => {
  try {
    const response = await api.post('/api/tests/submit', {
      testId,
      studentId,
      answers,
      timeSpent
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting test:', error);
    throw error;
  }
};


// services/api.ts
export const getCompletedTests = async (studentId: string) => {
  try {
    const response = await api.post('/api/tests/completed', {
      student_id: studentId
    });
    console.log("Completed Tests:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch completed tests");
  }
};


export const getTestResults = async (testId: string, studentId: string) => {
  try {
    const response = await api.post('/api/tests/results', {
      test_id: testId,
      student_id: studentId
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching test results:', error);
    throw error;
  }
};

export const deleteAssessmentAPI = async (assessmentId: string) => {
  try {
    const response = await api.post("/api/delete-assessment", {
      assessment_id: assessmentId,
    });
    console.log("Deleted:", response.data.message);
    return response.data;
  } catch (error: any) {
    console.error("Delete Error:", error.response?.data || error.message);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await api.post("/api/create_course", courseData);
    console.log("Course created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Course creation failed:", error.response?.data || error.message);
    throw error;
  }
};



export const saveCourse = async (courseData) => {
  try {
    const response = await api.post("/api/save_course", courseData);
    console.log("Course saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Course save failed:", error.response?.data || error.message);
    throw error;
  }
};


export const getCourseById = async (courseId) => {
  try {
    const response = await api.get(`/api/get_student_courses/${courseId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error.response?.data?.error_message || "Failed to fetch course";
  }
};


export const updateCourse = async (courseId: string, courseData: any): Promise<any> => {
  const response = await api.put(`/api/updatecourses/${courseId}/`, courseData);
  return response.data;
};




export const getCoursesByTeacherId = async (teacherId) => {
  try {
    const response = await api.get(`/api/get_teacher_courses/${teacherId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher's courses:", error);
    throw error.response?.data?.error || "Failed to fetch courses";
  }
};
export const getBlogsByTeacherId = async (teacherId) => {
  try {
    const response = await api.get(`/api/get_teacher_blogs/${teacherId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher's courses:", error);
    throw error.response?.data?.error || "Failed to fetch courses";
  }
};
export const getCourses = async () => {
  try {
    const response = await api.get('/api/get_courses/');
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error.response?.data?.error || "Failed to fetch courses";
  }
};
export const getBlogs = async () => {
  try {
    const response = await api.get('/api/get_blogs/');
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error.response?.data?.error || "Failed to fetch courses";
  }
};

// services/api.ts
export const getBlogById = async (id: string) => {
  try {
    const res = await api.get(`/api/viewblogs/${id}/`);
    if (res.status !== 200) throw new Error('Failed to fetch blog');
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch blog');
  }
};

export const updateBlog = async (id: string, body: any) => {
  try {
    const res = await api.put(`/api/updateblogs/${id}/`, body, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.status !== 200) throw new Error('Failed to update blog');
    return res.data;
  } catch (error) {
    throw new Error('Failed to update blog');
  }
};



// Fetch all students
export const students = async (): Promise<any> => {
  try {
    const response = await api.get('/api/students');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Archive a student (move to deleted_user collection)
export const archiveStudent = async (studentId: string): Promise<any> => {
  try {
    const response = await api.delete(`/api/deleted_student/${studentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update student information
export const updateStudent = async (studentId: string, data: any): Promise<any> => {
  try {
    const response = await api.put(`/api/updated_student/${studentId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addStudent = async (data) => {
  try {
  const response = await api.post('/api/add_student/', data);
  return response.data;
  }
  catch (error) {
    throw error;
  }
};



export const teachers = async () => {
  try {
  const res = await api.get('/api/teachers');
  return res.data;
}
catch (error) {
  throw error;
}
};

export const addTeacher = async (data: any) => {
  try {
  const res = await api.post('/api/add_teacher/', data);
  return res.data;
}
catch (error) {
  throw error;
}
};


export const updateTeacher = async (teacherId: string, data: any): Promise<any> => {
  try {
    const response = await api.put(`/api/updated_teacher/${teacherId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const archiveTeacher = async (id: string) => {
  try {
    
  const res = await api.delete(`/api/deleted_teacher/${id}`);
  return res.data;
}
catch (error) {
  throw error;
}
};

export const getHRs = async () => {
  try {
    const res = await api.get('/api/hr/');
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addHR = async (data: any) => {
  try {
    const res = await api.post('/api/add_hr/', data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateHR = async (hrId: string, data: any): Promise<any> => {
  try {
    const res = await api.put(`/api/update_hr/${hrId}/`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const archiveHR = async (id: string) => {
  try {
    const res = await api.delete(`/api/delete_hr/${id}/`);
    return res.data;
  } catch (error) {
    throw error;
  }
};



export const getTestById = async (id: string) => {
  try {
    const response = await api.get(`/api/tests/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch test data');
  }
};

// Save or update test (API endpoint should be created for this)
export const updateTestById = async (testId: string, updatedTest: any) => {
  try {
    const response = await api.put(`/api/updatetest/${testId}/`, updatedTest);
    console.log("Updated Test:", response.data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update test');
  }
};


export const createBlog = async (blogData) => {
  try {
    const response = await api.post("/api/create_blog/", blogData);
    console.log("Blog created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Blog creation failed:", error.response?.data || error.message);
    throw error;
  }
};


export default api;
