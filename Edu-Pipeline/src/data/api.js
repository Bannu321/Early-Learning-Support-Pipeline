const API_URL = 'http://localhost:5000/api';

// 1. Submit Observation (POST)
export const analyzeObservation = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Server Error');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    alert("Could not connect to server. Is it running?");
    return null;
  }
};

// 2. Get All Stats for NGO (GET)
// If this was missing, the NGO page would crash!
export const getSchoolStats = async () => {
  try {
    const response = await fetch(`${API_URL}/observations`);
    if (!response.ok) throw new Error('Server Error');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return []; // Return empty array to prevent crash
  }
};

// 3. Get Teacher History (GET)
export const getTeacherHistory = async (teacherCode) => {
  try {
    const response = await fetch(`${API_URL}/teacher/history?teacherCode=${teacherCode}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};