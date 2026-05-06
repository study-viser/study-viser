'use server';

// this is for testDB page only
export {
  createUser,
  updateUser,
  deleteUser,
} from '@/lib/dbActions';

export {
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  unenrollStudent,
  getSecretCode,
  teachCourse,
} from '@/lib/dbActions';

export {
  createTerm,
  updateTerm,
  deleteTerm,
  setBestSubmission,
} from '@/lib/dbActions';

export {
  createSubmission,
  updateSubmission,
  deleteSubmission,
  reviewSubmission,
  approveSubmission,
  clearTermApproval,
  getExtraCreditByUser,
  getExtraCreditByCourse,
} from '@/lib/dbActions';
