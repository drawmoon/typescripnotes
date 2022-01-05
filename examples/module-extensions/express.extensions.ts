import * as express from 'express';

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