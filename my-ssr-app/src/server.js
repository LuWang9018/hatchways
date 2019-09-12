import React from 'react';
//use the static router
import { StaticRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
//something to make react-loadable work on SSR
import { getBundles } from 'react-loadable/webpack';
import stats from '../build/react-loadable.json';

//Extracted react router config, for use on both client and server side,
//Trust me, we will come to this later
import AppRoutes from 'src/AppRoutes';

//create a simple ssr class to be exposed to other server side code,
//especially in the koa route
class SSR {
  //called in outside route
  render(url, data) {
    let modules = [];
    const context = {};
    const html = ReactDOMServer.renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <StaticRouter location={url} context={context}>
          <AppRoutes initialData={data} />
        </StaticRouter>
      </Loadable.Capture>
    );
    let bundles = getBundles(stats, modules);
    return {
      html,
      scripts: this.generateBundleScripts(bundles),
    };
  }

  generateBundleScripts(bundles) {
    return bundles
      .filter(bundle => bundle.file.endsWith('.js'))
      .map(bundle => {
        return `<script type="text/javascript" src="${bundle.file}"></script>\n`;
      });
  }

  static preloadAll() {
    return Loadable.preloadAll();
  }
}

export default SSR;
