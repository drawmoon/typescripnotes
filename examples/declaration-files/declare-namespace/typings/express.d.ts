declare namespace Express {
  export interface Request {
    items: Record<string, string>;

    getItem(key: string): string | undefined;
    
    setItem(key: string, value: string): void;
  }
}