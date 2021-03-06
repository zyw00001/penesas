import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import UniversalRouter from 'universal-router';
import queryString from 'query-string';
import history from './core/history';
import App from './components/App';
import { ErrorReporter } from './core/devUtils';
import getStore from './store';

export default (children) => {
  global.store = getStore(window.initState);

  const routes = {
    children,
    path: '/',
    async action({ next }) {
      const route = await next();
      route.title = route.title ? `${route.title} - 天马` : '天马';
      route.description = route.description || '';
      return route;
    }
  };

  const context = {
    insertCss: (...styles) => {
      // eslint-disable-next-line no-underscore-dangle
      const removeCss = styles.map(x => x._insertCss());
      return () => { removeCss.forEach(f => f()); };
    },
    store: global.store,
  };

  function updateTag(tagName, keyName, keyValue, attrName, attrValue) {
    const node = document.head.querySelector(`${tagName}[${keyName}="${keyValue}"]`);
    if (node && node.getAttribute(attrName) === attrValue) return;

    // Remove and create a new tag in taskOrder to make it work with bookmarks in Safari
    if (node) {
      node.parentNode.removeChild(node);
    }
    if (typeof attrValue === 'string') {
      const nextNode = document.createElement(tagName);
      nextNode.setAttribute(keyName, keyValue);
      nextNode.setAttribute(attrName, attrValue);
      document.head.appendChild(nextNode);
    }
  }

  function updateMeta(name, content) {
    updateTag('meta', 'name', name, 'content', content);
  }

// Switch off the native scroll restoration behavior and handle it manually
// https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
  const scrollPositionsHistory = {};
  if (window.history && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  let onRenderComplete = function initialRenderComplete() {
    const elem = document.getElementById('css');
    if (elem) elem.parentNode.removeChild(elem);
    onRenderComplete = function renderComplete(route, location) {
      document.title = route.title;

      updateMeta('description', route.description);

      let scrollX = 0;
      let scrollY = 0;
      const pos = scrollPositionsHistory[location.key];
      if (pos) {
        scrollX = pos.scrollX;
        scrollY = pos.scrollY;
      } else {
        const targetHash = location.hash.substr(1);
        if (targetHash) {
          const target = document.getElementById(targetHash);
          if (target) {
            scrollY = window.pageYOffset + target.getBoundingClientRect().top;
          }
        }
      }

      // Restore the scroll position if it was saved into the state
      // or scroll to the given #hash anchor
      // or scroll to top of the page
      window.scrollTo(scrollX, scrollY);
    };
  };

// Make taps on links and buttons work fast on mobiles
  FastClick.attach(document.body);

  const container = document.getElementById('app');
  let appInstance;
  let currentLocation = history.location;

// Re-render the app when window.location changes
  async function onLocationChange(location) {
    // Remember the latest scroll position for the previous location
    scrollPositionsHistory[currentLocation.key] = {
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset,
    };
    // Delete stored scroll position for next page if any
    if (history.action === 'PUSH') {
      delete scrollPositionsHistory[location.key];
    }
    currentLocation = location;

    try {
      const route = await UniversalRouter.resolve(routes, {
        path: location.pathname,
        query: queryString.parse(location.search),
        url: location.pathname
      });

      // Prevent multiple page renders during the routing process
      if (currentLocation.key !== location.key) {
        return;
      }

      if (route.redirect) {
        history.replace(route.redirect);
        return;
      }

      appInstance = ReactDOM.render(
        <App context={context}>{route.component}</App>,
        container,
        () => onRenderComplete(route, location)
      );
    } catch (error) {
      // Current url has been changed during navigation process, do nothing
      if (currentLocation.key !== location.key) {
        return;
      }

      if (process.env.NODE_ENV !== 'production') {
        appInstance = null;
        document.title = `Error: ${error.message}`;
        ReactDOM.render(<ErrorReporter error={error} />, container);
      }
    }
  }

  history.listen(onLocationChange);
  onLocationChange(currentLocation);
}

