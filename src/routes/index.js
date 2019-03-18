// The top-level (parent) route
export default {
  path: '/',

  children: [
    require('./single/main').default,
    require('./notFound').default
  ],

  async action({ next }) {
    const route = await next();
    route.title = route.title ? `${route.title} - 天马` : '天马';
    route.description = route.description || '';
    return route;
  }
};
