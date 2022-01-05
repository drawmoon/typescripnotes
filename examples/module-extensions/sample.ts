import * as express from 'express';
import { Request, Response } from 'express';
import './express.extensions';

// 使用扩展函数
const app = express();

app.get('/', (req: Request, res: Response) => {
  req.setItem('msg', 'Hello, World!');

  const msg = req.getItem('msg');

  res.send(msg);
});

app.listen(3000, () => {
  console.log('Now listening on: http://localhost:3000.');
});
