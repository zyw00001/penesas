import create from './create';

create({
  path: '/',

  children: [
    require('./routes/single/main').default,
    require('./routes/notFound').default
  ],

  async action({ next }) {
    const route = await next();
    route.title = route.title ? `${route.title} - 天马` : '天马';
    route.description = route.description || '';
    return route;
  }
});
