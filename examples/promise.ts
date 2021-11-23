async function mainAsync(): Promise<number> {
  const save = async () => {
    await delay(2000);

    console.log('save table with id = 1.');
  };

  const publish = async () => {
    await delay(5000);

    console.log('publish table with id = 1.');
  };

  const notify = async () => {
    await delay(2000);

    console.log('notify the table with id = 1 has been published.');
  };

  await save();

  // functions will execute in background
  publish().then();
  notify().then();

  // or use `Promise.all`
  // Promise.all([publish(), notify()]).then();

  console.log('successful.');
  return 1;
}

function delay(ms = 1): Promise<void> {
  return new Promise<void>((r) => {
    setTimeout(r, ms);
  });
}

mainAsync().then((id) => console.log(`id = ${id}`));
