import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'

const app = new Hono()

app.get('/', (c) => {
  return c.html(
    renderToString(
      <html>
        <head>
          <meta charSet='utf-8' />
          <meta content='width=device-width, initial-scale=1' name='viewport' />
          {import.meta.env.PROD ? (
            <script type='module' src='/static/client/main.js'></script>
          ) : (
            <script type='module' src='/src/client/main.tsx'></script>
          )}
        </head>
        <body>
          <div id='root'></div>
          <script src='https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js'></script>
        </body>
      </html>
    )
  )
})

export type AppType = typeof app

export default app
