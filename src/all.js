import create from './create';

create([
  require('./routes/all/main').default,
  require('./routes/notFound').default
]);
