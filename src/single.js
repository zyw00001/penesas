import create from './create';

create([
  require('./routes/single/main').default,
  require('./routes/single/login').default,
  require('./routes/single/loginUser').default,
  require('./routes/single/workCheck').default,
  require('./routes/single/qcCheck').default,
  require('./routes/single/load').default,
  require('./routes/notFound').default
]);
