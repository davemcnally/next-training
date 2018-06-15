require('@remy/envy');
const express = require('express');
const next = require('next');
const { parse } = require('url');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // custom handlers go here…
    server.use(require('./routes'));

    server.get('/session/:slug', (req, res) => {
      const { slug } = req.params;
      app.render(req, res, '/session', { ...req.query, slug });
    });

    server.get('*', (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      app.render(req, res, pathname, query);
    });

    server.listen(process.env.PORT, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
