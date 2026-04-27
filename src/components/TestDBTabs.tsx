'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Col, Container, Nav, Row, Table, Form, Button, Alert } from 'react-bootstrap';
import UserItem from '@/components/UserItem';
import CourseItem from '@/components/CourseItem';
import TermItem from '@/components/TermItem';
import SubmissionItem from '@/components/SubmissionItem';
import { Prisma } from '@/generated/prisma/client';
import {
  createUser, updateUser, deleteUser,
  createCourse, updateCourse, deleteCourse, enrollStudent, unenrollStudent,
  createTerm, updateTerm, deleteTerm,
  createSubmission, updateSubmission, deleteSubmission, reviewSubmission,
} from '@/lib/dbActions';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = {
  users: Prisma.UserGetPayload<{
    include: { taughtCourses: true; enrolledCourses: true; submissions: true };
  }>[];
  courses: Prisma.CourseGetPayload<{
    include: { instructor: true; students: true; listing: true; terms: true };
  }>[];
  terms: Prisma.TermGetPayload<{
    include: { course: true; submissions: true; bestSubmission: true };
  }>[];
  submissions: Prisma.SubmissionGetPayload<{
    include: { creator: true; term: true };
  }>[];
};

type ModelTab = 'users' | 'courses' | 'terms' | 'submissions';
type SubTab = 'view' | 'actions';

const MODEL_TABS: { key: ModelTab; label: string }[] = [
  { key: 'users',       label: 'Users' },
  { key: 'courses',     label: 'Courses' },
  { key: 'terms',       label: 'Terms' },
  { key: 'submissions', label: 'Submissions' },
];

// ---------------------------------------------------------------------------
// Operations available per model
// ---------------------------------------------------------------------------

const USER_OPS = [
  'createUser', 'updateUser', 'deleteUser',
] as const;

const COURSE_OPS = [
  'createCourse', 'updateCourse', 'deleteCourse',
  'enrollStudent', 'unenrollStudent',
] as const;

const TERM_OPS = [
  'createTerm', 'updateTerm', 'deleteTerm', 'setBestSubmission',
] as const;

const SUBMISSION_OPS = [
  'createSubmission', 'updateSubmission', 'deleteSubmission', 'reviewSubmission',
] as const;

type UserOp = typeof USER_OPS[number];
type CourseOp = typeof COURSE_OPS[number];
type TermOp = typeof TERM_OPS[number];
type SubmissionOp = typeof SUBMISSION_OPS[number];

// ---------------------------------------------------------------------------
// Feedback helper
// ---------------------------------------------------------------------------

type Feedback = { type: 'success' | 'danger'; message: string } | null;

function FeedbackAlert({ feedback, onClose }: { feedback: Feedback; onClose: () => void }) {
  if (!feedback) return null;
  return (
    <Alert variant={feedback.type} dismissible onClose={onClose} className="mt-2">
      {feedback.message}
    </Alert>
  );
}

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------

function TextField({ name, label, placeholder, required, type = 'text' }: {
  name: string; label: string; placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <Form.Group className="mb-2" controlId={name}>
      <Form.Label>{label}{required && <span className="text-danger"> *</span>}</Form.Label>
      <Form.Control name={name} type={type} placeholder={placeholder} required={required} />
    </Form.Group>
  );
}

function SelectField({ name, label, options, required }: {
  name: string; label: string; required?: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <Form.Group className="mb-2" controlId={name}>
      <Form.Label>{label}{required && <span className="text-danger"> *</span>}</Form.Label>
      <Form.Select name={name} required={required}>
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </Form.Select>
    </Form.Group>
  );
}

function TextAreaField({ name, label, placeholder, required, rows = 3 }: {
  name: string; label: string; placeholder?: string; required?: boolean; rows?: number;
}) {
  return (
    <Form.Group className="mb-2" controlId={name}>
      <Form.Label>{label}{required && <span className="text-danger"> *</span>}</Form.Label>
      <Form.Control name={name} as="textarea" rows={rows} placeholder={placeholder} required={required} />
    </Form.Group>
  );
}

// ---------------------------------------------------------------------------
// User Action Form
// ---------------------------------------------------------------------------

function UserActionForm({ op, users, onSuccess }: {
  op: UserOp; users: Props['users']; onSuccess: () => void;
}) {
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const f = new FormData(e.currentTarget);

    try {
      switch (op) {
        case 'createUser':
          await createUser({
            name:     f.get('name') as string,
            email:    f.get('email') as string,
            password: f.get('password') as string,
            role:     f.get('role') as 'STUDENT' | 'TA' | 'INSTRUCTOR' | 'ADMIN',
          });
          break;

        case 'updateUser':
          await updateUser(f.get('id') as string, {
            name:     f.get('name') as string || undefined,
            email:    f.get('email') as string || undefined,
            password: f.get('password') as string || undefined,
            role:     f.get('role') as 'STUDENT' | 'TA' | 'INSTRUCTOR' | 'ADMIN' || undefined,
          });
          break;

        case 'deleteUser':
          await deleteUser(f.get('id') as string);
          break;
      }

      setFeedback({ type: 'success', message: `${op} succeeded.` });
      (e.target as HTMLFormElement).reset();
      onSuccess();
    } catch (err) {
      setFeedback({ type: 'danger', message: err instanceof Error ? err.message : 'Failed.' });
    }
  };

  const userOptions = users.map(u => ({ value: u.id, label: `${u.name} — ${u.email}` }));

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <FeedbackAlert feedback={feedback} onClose={() => setFeedback(null)} />

      {/* User selector — for update/delete */}
      {(op === 'updateUser' || op === 'deleteUser') && (
        <SelectField name="id" label="Select User" options={userOptions} required />
      )}

      {/* Fields for create/update */}
      {(op === 'createUser' || op === 'updateUser') && (
        <Row>
          <Col md={6}><TextField name="name" label="Name" placeholder="Full name" required={op === 'createUser'} /></Col>
          <Col md={6}><TextField name="email" label="Email" type="email" placeholder="email@example.com" required={op === 'createUser'} /></Col>
          <Col md={6}><TextField name="password" label="Password" type="password" placeholder="Password" required={op === 'createUser'} /></Col>
          <Col md={6}>
            <Form.Group className="mb-2" controlId="role">
              <Form.Label>Role{op === 'createUser' && <span className="text-danger"> *</span>}</Form.Label>
              <Form.Select name="role" required={op === 'createUser'}>
                <option value="">Select...</option>
                <option value="STUDENT">Student</option>
                <option value="TA">TA</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      )}

      <Button type="submit" variant={op === 'deleteUser' ? 'danger' : 'primary'} className="mt-1">
        {op}
      </Button>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Course Action Form
// ---------------------------------------------------------------------------

function CourseActionForm({ op, courses, users, onSuccess }: {
  op: CourseOp; courses: Props['courses']; users: Props['users']; onSuccess: () => void;
}) {
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const f = new FormData(e.currentTarget);

    try {
      switch (op) {
        case 'createCourse':
          await createCourse({
            crn:         parseInt(f.get('crn') as string, 10),
            code:        f.get('code') as string,
            title:       f.get('title') as string,
            description: f.get('description') as string || undefined,
            location:    f.get('location') as string || undefined,
            // secret is auto-generated by DB @default(uuid())
          });
          break;

        case 'updateCourse':
          await updateCourse(parseInt(f.get('crn') as string, 10), {
            code:        f.get('code') as string || undefined,
            title:       f.get('title') as string || undefined,
            description: f.get('description') as string || undefined,
            location:    f.get('location') as string || undefined,
          });
          break;

        case 'deleteCourse':
          await deleteCourse(parseInt(f.get('crn') as string, 10));
          break;

        case 'enrollStudent':
          // enrollStudent uses course secret, not CRN
          await enrollStudent(f.get('secret') as string, f.get('studentId') as string);
          break;

        case 'unenrollStudent':
          await unenrollStudent(
            parseInt(f.get('crn') as string, 10),
            f.get('studentId') as string,
          );
          break;
      }

      setFeedback({ type: 'success', message: `${op} succeeded.` });
      (e.target as HTMLFormElement).reset();
      onSuccess();
    } catch (err) {
      setFeedback({ type: 'danger', message: err instanceof Error ? err.message : 'Failed.' });
    }
  };

  const courseOptions = courses.map(c => ({ value: String(c.crn), label: `${c.crn} — ${c.code}` }));
  const userOptions   = users.map(u => ({ value: u.id, label: `${u.name} — ${u.email}` }));

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <FeedbackAlert feedback={feedback} onClose={() => setFeedback(null)} />

      {/* CRN selector for update/delete/unenroll */}
      {(op === 'updateCourse' || op === 'deleteCourse' || op === 'unenrollStudent') && (
        <SelectField name="crn" label="Select Course (CRN)" options={courseOptions} required />
      )}

      {/* Secret field for enrollStudent */}
      {op === 'enrollStudent' && (
        <TextField name="secret" label="Course Secret" placeholder="UUID secret" required />
      )}

      {/* Student selector for enroll/unenroll */}
      {(op === 'enrollStudent' || op === 'unenrollStudent') && (
        <SelectField name="studentId" label="Select Student" options={userOptions} required />
      )}

      {/* Fields for create/update */}
      {(op === 'createCourse' || op === 'updateCourse') && (
        <Row>
          {op === 'createCourse' && (
            <Col md={3}><TextField name="crn" label="CRN" type="number" placeholder="e.g. 2824" required /></Col>
          )}
          <Col md={3}><TextField name="code" label="Code" placeholder="ICS 111" required={op === 'createCourse'} /></Col>
          <Col md={6}><TextField name="title" label="Title" placeholder="Course title" required={op === 'createCourse'} /></Col>
          <Col md={8}><TextAreaField name="description" label="Description" placeholder="Optional" /></Col>
          <Col md={4}><TextField name="location" label="Location" placeholder="e.g. POST 318" /></Col>
        </Row>
      )}

      <Button type="submit" variant={op === 'deleteCourse' ? 'danger' : 'primary'} className="mt-1">
        {op}
      </Button>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Term Action Form
// ---------------------------------------------------------------------------

function TermActionForm({ op, courses, terms, submissions, onSuccess }: {
  op: TermOp;
  courses: Props['courses'];
  terms: Props['terms'];
  submissions: Props['submissions'];
  onSuccess: () => void;
}) {
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const f = new FormData(e.currentTarget);

    try {
      switch (op) {
        case 'createTerm':
          await createTerm({
            courseCRN:      parseInt(f.get('courseCRN') as string, 10),
            word:           f.get('word') as string,
            maxSubmissions: parseInt(f.get('maxSubmissions') as string, 10),
            week:           f.get('week') ? parseInt(f.get('week') as string, 10) : undefined,
            difficulty:     f.get('difficulty') as 'Basic' | 'Moderate' | 'Advanced',
            imageRequired:  f.get('imageRequired') === 'on',
          });
          break;

        case 'updateTerm':
          await updateTerm(f.get('id') as string, {
            word:           f.get('word') as string || undefined,
            maxSubmissions: f.get('maxSubmissions') ? parseInt(f.get('maxSubmissions') as string, 10) : undefined,
            week:           f.get('week') ? parseInt(f.get('week') as string, 10) : undefined,
            difficulty:     f.get('difficulty') as 'Basic' | 'Moderate' | 'Advanced' || undefined,
            imageRequired:  f.get('imageRequired') ? f.get('imageRequired') === 'on' : undefined,
          });
          break;

        case 'deleteTerm':
          await deleteTerm(f.get('id') as string);
          break;
      }

      setFeedback({ type: 'success', message: `${op} succeeded.` });
      (e.target as HTMLFormElement).reset();
      onSuccess();
    } catch (err) {
      setFeedback({ type: 'danger', message: err instanceof Error ? err.message : 'Failed.' });
    }
  };

  const courseOptions     = courses.map(c => ({ value: String(c.crn), label: `${c.crn} — ${c.code}` }));
  const termOptions       = terms.map(t => ({ value: t.id, label: `${t.word} (CRN ${t.courseCRN})` }));
  const submissionOptions = submissions.map(s => ({ value: s.id, label: `${s.id.slice(-6)} — ${s.creator.name}` }));

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <FeedbackAlert feedback={feedback} onClose={() => setFeedback(null)} />

      {/* Term selector for update/delete/setBest */}
      {(op === 'updateTerm' || op === 'deleteTerm') && (
        <SelectField name="id" label="Select Term" options={termOptions} required />
      )}
      {op === 'setBestSubmission' && (
        <>
          <SelectField name="termId"       label="Select Term"       options={termOptions}       required />
          <SelectField name="submissionId" label="Select Submission" options={submissionOptions} required />
        </>
      )}

      {/* Fields for create/update */}
      {(op === 'createTerm' || op === 'updateTerm') && (
        <Row>
          {op === 'createTerm' && (
            <Col md={4}>
              <SelectField name="courseCRN" label="Course" options={courseOptions} required />
            </Col>
          )}
          <Col md={4}><TextField name="word" label="Word" placeholder="Term to define" required={op === 'createTerm'} /></Col>
          <Col md={2}><TextField name="week" label="Week" type="number" placeholder="1–17" /></Col>
          <Col md={2}><TextField name="maxSubmissions" label="Max Submissions" type="number" placeholder="3" required={op === 'createTerm'} /></Col>
          <Col md={4}>
            <Form.Group className="mb-2" controlId="difficulty">
              <Form.Label>Difficulty{op === 'createTerm' && <span className="text-danger"> *</span>}</Form.Label>
              <Form.Select name="difficulty" required={op === 'createTerm'}>
                <option value="">Select...</option>
                <option value="BASIC">Basic</option>
                <option value="MODERATE">Moderate</option>
                <option value="ADVANCED">Advanced</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-end mb-2">
            <Form.Check type="switch" name="imageRequired" id="imageRequired" label="Image Required" />
          </Col>
        </Row>
      )}

      <Button type="submit" variant={op === 'deleteTerm' ? 'danger' : 'primary'} className="mt-1">
        {op}
      </Button>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Submission Action Form
// ---------------------------------------------------------------------------

function SubmissionActionForm({ op, users, terms, submissions, onSuccess }: {
  op: SubmissionOp;
  users: Props['users'];
  terms: Props['terms'];
  submissions: Props['submissions'];
  onSuccess: () => void;
}) {
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const f = new FormData(e.currentTarget);

    try {
      switch (op) {
        case 'createSubmission':
          await createSubmission({
            creatorId:  f.get('creatorId') as string,
            termId:     f.get('termId') as string,
            definition: f.get('definition') as string,
            points:     f.get('points') ? parseFloat(f.get('points') as string) : undefined,
          });
          break;

        case 'updateSubmission':
          await updateSubmission(f.get('id') as string, {
            definition:  f.get('definition') as string || undefined,
            points:      f.get('points') ? parseFloat(f.get('points') as string) : undefined,
            wasReviewed: f.get('wasReviewed') ? f.get('wasReviewed') === 'true' : undefined,
            termId:      f.get('termId') as string || undefined,
          });
          break;

        case 'deleteSubmission':
          await deleteSubmission(f.get('id') as string);
          break;

        case 'reviewSubmission':
          await reviewSubmission(
            f.get('id') as string,
            parseFloat(f.get('points') as string),
          );
          break;
      }

      setFeedback({ type: 'success', message: `${op} succeeded.` });
      (e.target as HTMLFormElement).reset();
      onSuccess();
    } catch (err) {
      setFeedback({ type: 'danger', message: err instanceof Error ? err.message : 'Failed.' });
    }
  };

  const userOptions       = users.map(u => ({ value: u.id, label: `${u.name} — ${u.email}` }));
  const termOptions       = terms.map(t => ({ value: t.id, label: `${t.word} (CRN ${t.courseCRN})` }));
  const submissionOptions = submissions.map(s => ({ value: s.id, label: `...${s.id.slice(-6)} — ${s.creator.name} — ${s.term?.word ?? 'no term'}` }));

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <FeedbackAlert feedback={feedback} onClose={() => setFeedback(null)} />

      {/* Submission selector for update/delete/review */}
      {(op === 'updateSubmission' || op === 'deleteSubmission' || op === 'reviewSubmission') && (
        <SelectField name="id" label="Select Submission" options={submissionOptions} required />
      )}

      {/* Fields for create */}
      {op === 'createSubmission' && (
        <Row>
          <Col md={6}><SelectField name="creatorId" label="Creator (User)" options={userOptions} required /></Col>
          <Col md={6}><SelectField name="termId"    label="Term"           options={termOptions}  required /></Col>
        </Row>
      )}

      {/* Term selector for update */}
      {op === 'updateSubmission' && (
        <SelectField name="termId" label="Change Term (optional)" options={termOptions} />
      )}

      {/* Definition for create/update */}
      {(op === 'createSubmission' || op === 'updateSubmission') && (
        <TextAreaField
          name="definition"
          label="Definition"
          placeholder="Written answer, URL, or file reference"
          required={op === 'createSubmission'}
          rows={3}
        />
      )}

      {/* Points for create/update/review */}
      {(op === 'createSubmission' || op === 'updateSubmission' || op === 'reviewSubmission') && (
        <TextField
          name="points"
          label="Points"
          type="number"
          placeholder="0"
          required={op === 'reviewSubmission'}
        />
      )}

      {/* wasReviewed toggle for update */}
      {op === 'updateSubmission' && (
        <Form.Group className="mb-2" controlId="wasReviewed">
          <Form.Label>Reviewed Status</Form.Label>
          <Form.Select name="wasReviewed">
            <option value="">No change</option>
            <option value="true">Reviewed</option>
            <option value="false">Not Reviewed</option>
          </Form.Select>
        </Form.Group>
      )}

      <Button type="submit" variant={op === 'deleteSubmission' ? 'danger' : 'primary'} className="mt-1">
        {op}
      </Button>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const TestDBTabs = ({ users, courses, terms, submissions }: Props) => {
  const router = useRouter();
  const [activeModel, setActiveModel] = useState<ModelTab>('users');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('view');

  // Operation state per model
  const [userOp,       setUserOp]       = useState<UserOp>('createUser');
  const [courseOp,     setCourseOp]     = useState<CourseOp>('createCourse');
  const [termOp,       setTermOp]       = useState<TermOp>('createTerm');
  const [submissionOp, setSubmissionOp] = useState<SubmissionOp>('createSubmission');

  // Refresh server data after any mutation
  const handleSuccess = () => router.refresh();

  return (
    <Container id="testDB" className="py-4">

      {/* Model tabs */}
      <Nav variant="tabs" className="mb-0">
        {MODEL_TABS.map(({ key, label }) => (
          <Nav.Item key={key}>
            <Nav.Link
              active={activeModel === key}
              onClick={() => { setActiveModel(key); setActiveSubTab('view'); }}
              style={{ cursor: 'pointer' }}
            >
              {label}
              <span className="ms-2 badge bg-secondary">
                {key === 'users'       ? users.length
                  : key === 'courses'  ? courses.length
                  : key === 'terms'    ? terms.length
                  : submissions.length}
              </span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* Sub-tabs: View / Actions */}
      <Nav variant="pills" className="mb-3 mt-2 ms-1">
        <Nav.Item>
          <Nav.Link active={activeSubTab === 'view'}    onClick={() => setActiveSubTab('view')}    style={{ cursor: 'pointer' }}>View</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={activeSubTab === 'actions'} onClick={() => setActiveSubTab('actions')} style={{ cursor: 'pointer' }}>Actions</Nav.Link>
        </Nav.Item>
      </Nav>

      <Row>
        <Col xs={12}>

          {/* ── Users ─────────────────────────────────────────────────── */}
          {activeModel === 'users' && activeSubTab === 'view' && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Role</th>
                  <th>Taught Courses</th><th>Enrolled Courses</th><th>Submissions</th>
                </tr>
              </thead>
              <tbody>{users.map(u => <UserItem key={u.id} {...u} />)}</tbody>
            </Table>
          )}
          {activeModel === 'users' && activeSubTab === 'actions' && (
            <>
              <Form.Group className="mb-3" controlId="userOpSelect">
                <Form.Label><strong>Operation</strong></Form.Label>
                <Form.Select value={userOp} onChange={e => setUserOp(e.target.value as UserOp)}>
                  {USER_OPS.map(op => <option key={op} value={op}>{op}</option>)}
                </Form.Select>
              </Form.Group>
              <UserActionForm op={userOp} users={users} onSuccess={handleSuccess} />
            </>
          )}

          {/* ── Courses ───────────────────────────────────────────────── */}
          {activeModel === 'courses' && activeSubTab === 'view' && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>CRN</th>
                  <th>Secret</th>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Instructor</th>
                  <th>Students</th>
                  <th>Listing</th>
                  <th>External URLs</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <CourseItem key={course.crn} {...course} />
                ))}
              </tbody>
            </Table>
          )}
          {activeModel === 'courses' && activeSubTab === 'actions' && (
            <>
              <Form.Group className="mb-3" controlId="courseOpSelect">
                <Form.Label><strong>Operation</strong></Form.Label>
                <Form.Select value={courseOp} onChange={e => setCourseOp(e.target.value as CourseOp)}>
                  {COURSE_OPS.map(op => <option key={op} value={op}>{op}</option>)}
                </Form.Select>
              </Form.Group>
              <CourseActionForm op={courseOp} courses={courses} users={users} onSuccess={handleSuccess} />
            </>
          )}

          {/* ── Terms ─────────────────────────────────────────────────── */}
          {activeModel === 'terms' && activeSubTab === 'view' && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Word</th>
                  <th>Course</th>
                  <th>Week</th>
                  <th>Covered On</th>
                  <th>Submissions</th>
                  <th>Best Submission</th>
                  <th>Difficulty</th>
                  <th>Image Required</th>
                </tr>
              </thead>
              <tbody>
                {terms.map((term) => (
                  <TermItem key={term.id} {...term} />
                ))}
              </tbody>
            </Table>
          )}
          {activeModel === 'terms' && activeSubTab === 'actions' && (
            <>
              <Form.Group className="mb-3" controlId="termOpSelect">
                <Form.Label><strong>Operation</strong></Form.Label>
                <Form.Select value={termOp} onChange={e => setTermOp(e.target.value as TermOp)}>
                  {TERM_OPS.map(op => <option key={op} value={op}>{op}</option>)}
                </Form.Select>
              </Form.Group>
              <TermActionForm op={termOp} courses={courses} terms={terms} submissions={submissions} onSuccess={handleSuccess} />
            </>
          )}

          {/* ── Submissions ───────────────────────────────────────────── */}
          {activeModel === 'submissions' && activeSubTab === 'view' && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Creator</th>
                  <th>Term</th>
                  <th>Definition</th>
                  <th>Points</th>
                  <th>Reviewed</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <SubmissionItem key={submission.id} {...submission} />
                ))}
              </tbody>
            </Table>
          )}
          {activeModel === 'submissions' && activeSubTab === 'actions' && (
            <>
              <Form.Group className="mb-3" controlId="submissionOpSelect">
                <Form.Label><strong>Operation</strong></Form.Label>
                <Form.Select value={submissionOp} onChange={e => setSubmissionOp(e.target.value as SubmissionOp)}>
                  {SUBMISSION_OPS.map(op => <option key={op} value={op}>{op}</option>)}
                </Form.Select>
              </Form.Group>
              <SubmissionActionForm op={submissionOp} users={users} terms={terms} submissions={submissions} onSuccess={handleSuccess} />
            </>
          )}

        </Col>
      </Row>
    </Container>
  );
};

export default TestDBTabs;
