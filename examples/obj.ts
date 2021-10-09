interface TableField {
  id: string;
  type: string;
  filter: string;
}

const t1: TableField = {
  id: '1',
  type: 'Measure',
  filter: 'price is not null',
};

const t2: TableField = { ...t1, filter: undefined };

console.log(t2);
