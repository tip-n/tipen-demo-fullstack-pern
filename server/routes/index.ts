import {Router, Request, Response} from "express"
const router = Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next) => {
  // res.render('index', { title: 'Express' });
  res.send("aaaaaaaa")
});

export default router