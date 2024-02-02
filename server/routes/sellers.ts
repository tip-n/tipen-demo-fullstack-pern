import {Router, Request, Response} from "express"

import {
  getSellerProfileController,
  loginSellerController,
  registerSellerController,
  updateSellerProfileController
} from "controller/sellers";
import {
  validateGetSellerProfile,
  validateLoginseller,
  validateRegisterSeller,
  validateUpdateSellerProfile
} from "middlewares/seller";

const router = Router();

/* GET sellers listing. */
router.get('/', (req: Request, res: Response, next) => {
  res.send('respond with a resource');
});
router.post('/register', ...validateRegisterSeller, registerSellerController);
router.post('/login', ...validateLoginseller, loginSellerController);
router.get("/profile", ...validateGetSellerProfile, getSellerProfileController);
router.put("/profile", ...validateUpdateSellerProfile, updateSellerProfileController);

export default router
