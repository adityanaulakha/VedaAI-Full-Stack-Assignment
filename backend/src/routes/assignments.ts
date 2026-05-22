import { Router } from 'express';
import { createAssignment, getAssignments, getAssignmentById, deleteAssignment, regenerateAssignment } from '../controllers/assignmentController';

const router = Router();

router.post('/', createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.post('/:id/regenerate', regenerateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
