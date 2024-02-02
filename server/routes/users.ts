import {Router, Request, Response} from "express"

import {
  getUserProfileController,
  loginUserController,
  registerUserController,
  updateUserProfileController
} from "controller/users";
import {
  validateGetUserProfile,
  validateLoginuser,
  validateRegisterUser,
  validateUpdateUserProfile
} from "middlewares/user";

const router = Router();

/* GET users listing. */
router.get('/', (req: Request, res: Response, next) => {
  res.send('respond with a resource');
});
router.post('/register', ...validateRegisterUser, registerUserController);
router.post('/login', ...validateLoginuser, loginUserController);
router.get("/profile", ...validateGetUserProfile, getUserProfileController);
router.put("/profile", ...validateUpdateUserProfile, updateUserProfileController);

export default router
