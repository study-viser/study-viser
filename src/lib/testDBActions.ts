'use server';

// this is for testDB only
import {
  createUser as _createUser,
  updateUser as _updateUser,
  deleteUser as _deleteUser,
  createCourse as _createCourse,
  updateCourse as _updateCourse,
  deleteCourse as _deleteCourse,
  enrollStudent as _enrollStudent,
  unenrollStudent as _unenrollStudent,
  getSecretCode as _getSecretCode,
  teachCourse as _teachCourse,
  createTerm as _createTerm,
  updateTerm as _updateTerm,
  deleteTerm as _deleteTerm,
  setBestSubmission as _setBestSubmission,
  createSubmission as _createSubmission,
  updateSubmission as _updateSubmission,
  deleteSubmission as _deleteSubmission,
  reviewSubmission as _reviewSubmission,
  approveSubmission as _approveSubmission,
  clearTermApproval as _clearTermApproval,
  getExtraCreditByUser as _getExtraCreditByUser,
  getExtraCreditByCourse as _getExtraCreditByCourse,
} from '@/lib/dbActions';

export async function createUser(...args: Parameters<typeof _createUser>) { return _createUser(...args); }
export async function updateUser(...args: Parameters<typeof _updateUser>) { return _updateUser(...args); }
export async function deleteUser(...args: Parameters<typeof _deleteUser>) { return _deleteUser(...args); }

export async function createCourse(...args: Parameters<typeof _createCourse>) { return _createCourse(...args); }
export async function updateCourse(...args: Parameters<typeof _updateCourse>) { return _updateCourse(...args); }
export async function deleteCourse(...args: Parameters<typeof _deleteCourse>) { return _deleteCourse(...args); }
export async function enrollStudent(...args: Parameters<typeof _enrollStudent>) { return _enrollStudent(...args); }
export async function unenrollStudent(...args: Parameters<typeof _unenrollStudent>) { return _unenrollStudent(...args); }
export async function getSecretCode(...args: Parameters<typeof _getSecretCode>) { return _getSecretCode(...args); }
export async function teachCourse(...args: Parameters<typeof _teachCourse>) { return _teachCourse(...args); }

export async function createTerm(...args: Parameters<typeof _createTerm>) { return _createTerm(...args); }
export async function updateTerm(...args: Parameters<typeof _updateTerm>) { return _updateTerm(...args); }
export async function deleteTerm(...args: Parameters<typeof _deleteTerm>) { return _deleteTerm(...args); }
export async function setBestSubmission(...args: Parameters<typeof _setBestSubmission>) { return _setBestSubmission(...args); }

export async function createSubmission(...args: Parameters<typeof _createSubmission>) { return _createSubmission(...args); }
export async function updateSubmission(...args: Parameters<typeof _updateSubmission>) { return _updateSubmission(...args); }
export async function deleteSubmission(...args: Parameters<typeof _deleteSubmission>) { return _deleteSubmission(...args); }
export async function reviewSubmission(...args: Parameters<typeof _reviewSubmission>) { return _reviewSubmission(...args); }
export async function approveSubmission(...args: Parameters<typeof _approveSubmission>) { return _approveSubmission(...args); }
export async function clearTermApproval(...args: Parameters<typeof _clearTermApproval>) { return _clearTermApproval(...args); }
export async function getExtraCreditByUser(...args: Parameters<typeof _getExtraCreditByUser>) { return _getExtraCreditByUser(...args); }
export async function getExtraCreditByCourse(...args: Parameters<typeof _getExtraCreditByCourse>) { return _getExtraCreditByCourse(...args); }
