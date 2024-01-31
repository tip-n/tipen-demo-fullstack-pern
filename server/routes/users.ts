import { registerUserService } from "@services/users";
import {Router, Request, Response} from "express"
import { validationResult } from "express-validator";
import { validateRegisterUser } from "middlewares/user";
const router = Router();

/* GET users listing. */
router.get('/', (req: Request, res: Response, next) => {
  res.send('respond with a resource');
});
router.post(
  '/register',
  ...validateRegisterUser,
  (req: Request, res: Response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
      return
    }

    const { firstname, lastname, password, email } = req.body

    registerUserService({
      firstname,
      lastname, 
      email,
      password
    })

    console.log("body : ", req.body)
    res.send("success")
});

export default router
