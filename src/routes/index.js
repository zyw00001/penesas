// The top-level (parent) route
export default {
  path: '/',

  children: [
    require('./single/main').default,
    require('./single/login').default,
    require('./single/loginUser').default,
    require('./single/workCheck').default,
    require('./single/qcCheck').default,
    require('./notFound').default
  ],

  async action({ next }) {
    const route = await next();
    route.title = route.title ? `${route.title} - 天马` : '天马';
    route.description = route.description || '';
    return route;
  }
};
