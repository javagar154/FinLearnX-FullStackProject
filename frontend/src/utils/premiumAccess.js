// FinLearnX – Individual Premium Course Access System
// Each course is unlocked independently for $100

export const isPremiumCourseUnlocked = (courseId) => {
  try {
    const unlocked = JSON.parse(localStorage.getItem('flx_unlocked_courses') || '[]');
    return unlocked.includes(courseId);
  } catch { return false; }
};

export const unlockPremiumCourse = (courseId) => {
  try {
    const unlocked = JSON.parse(localStorage.getItem('flx_unlocked_courses') || '[]');
    if (!unlocked.includes(courseId)) {
      unlocked.push(courseId);
      localStorage.setItem('flx_unlocked_courses', JSON.stringify(unlocked));
    }
  } catch {}
};

export const getUnlockedCourses = () => {
  try {
    return JSON.parse(localStorage.getItem('flx_unlocked_courses') || '[]');
  } catch { return []; }
};

export const unlockAllPremium = () => {
  // Legacy support — if old flx_premium flag exists, migrate
  if (localStorage.getItem('flx_premium') === 'true') {
    const { PREMIUM_COURSES } = require('../data/premiumCourses');
    const ids = PREMIUM_COURSES.map(c => c.id);
    localStorage.setItem('flx_unlocked_courses', JSON.stringify(ids));
    localStorage.removeItem('flx_premium');
  }
};
