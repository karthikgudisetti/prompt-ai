const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const submitIntake = async (profile) => {
  const res = await fetch(`${API_BASE}/intake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit student intake');
  }
  return res.json();
};

export const generateIdeas = async (studentId) => {
  const res = await fetch(`${API_BASE}/ideas/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate project ideas');
  }
  return res.json();
};

export const generateMentorPlan = async (ideaId) => {
  const res = await fetch(`${API_BASE}/mentor/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ideaId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate mentor roadmap');
  }
  return res.json();
};

export const getMentorPlan = async (planId) => {
  const res = await fetch(`${API_BASE}/mentor-plans/${planId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch mentor plan');
  }
  return res.json();
};

export const triggerReplan = async (planId, constraint) => {
  const res = await fetch(`${API_BASE}/mentor-plans/${planId}/replan`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ constraint })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to execute surgical replan');
  }
  return res.json();
};
