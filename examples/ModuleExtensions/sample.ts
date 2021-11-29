import * as express from 'express';
import { Request, Response } from 'express';

// 扩展函数实现
express.request.getItem = function (key: string): string {
  if (this.items) {
    return this.items[key];
  }
  return undefined;
};

express.request.setItem = function (key: string, value: string): void {
  if (this.items) {
    this.items[key] = value;
  }
  this.items = { [key]: value };
};

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
