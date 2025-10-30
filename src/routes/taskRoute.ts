import { Router } from "express";
import { GetAllTasks, GetTaskById, GetUserTasks, PostTask } from "../controllers/taskController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../utils/imageUpload";

const router = Router()


router.post('/create-task', authMiddleware, upload.array('images'), PostTask);
router.get('/get-tasks', GetAllTasks);

router.get('/get-tasks/:taskId', authMiddleware, GetTaskById);
router.get('/get-user-tasks', authMiddleware, GetUserTasks);

export default router;