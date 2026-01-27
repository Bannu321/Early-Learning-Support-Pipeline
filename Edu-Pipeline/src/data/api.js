// AUTOMATIC URL SWITCHING
// If we are in production (Vercel), use the Environment Variable.
// If we are local, use localhost.
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 1. Submit Observation (POST)
export const analyzeObservation = async (formData) => {
  try {
    const response = await fetch(`${API_BASE}/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Server Error');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    alert("Could not connect to server.");
    return null;
  }
};

// 2. Get All Stats for NGO (GET)
export const getSchoolStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/observations`);
    if (!response.ok) throw new Error('Server Error');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

// 3. Get Teacher History (GET)
export const getTeacherHistory = async (teacherCode) => {
  try {
    const response = await fetch(`${API_BASE}/teacher/history?teacherCode=${teacherCode}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};