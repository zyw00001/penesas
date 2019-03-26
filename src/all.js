import create from './create';

create([
  require('./routes/all/main').default,
  require('./routes/all/bar').default,
  require('./routes/notFound').default
]);
