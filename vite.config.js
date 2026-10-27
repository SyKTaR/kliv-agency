import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { prepareContact } from './api/contact-data.mjs'

const htmlPartialsPlugin = ({ enableFigmaCapture = false } = {}) => ({
  name: 'html-partials',
  transformIndexHtml(html) {
    let out = html.replace(/<!--#include\s+(\S+?)-->/g, (_, name) => {
      const path = resolve(__dirname, `src/partials/${name}.html`)
      return readFileSync(path, 'utf-8')
    })
    if (enableFigmaCapture && !out.includes('html-to-design/capture.js')) {
      out = out.replace(
        '</head>',
        '  <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>\n</head>'
      )
    }
    return out
  }
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const cleanUrlRedirects = {
    '/': '/pages/index.html',
    '/index.html': '/pages/index.html',
    '/contact': '/pages/contact.html',
    '/guides': '/pages/guides/index.html',
    '/guides/agence-web-ou-freelance': '/pages/guides/agence-web-ou-freelance.html',
    '/guides/remplacer-excel-par-un-outil-sur-mesure': '/pages/guides/remplacer-excel-par-un-outil-sur-mesure.html',
    '/guides/refonte-ou-nouveau-site': '/pages/guides/refonte-ou-nouveau-site.html',
    '/agence-web-roissy-en-brie': '/pages/agence-web-roissy-en-brie.html',
    '/agence-web-seine-et-marne': '/pages/agence-web-seine-et-marne.html',
    '/a-propos': '/pages/a-propos.html',
    '/mentions-legales': '/pages/mentions-legales.html',
    '/services/site-web': '/pages/services/site-web.html',
    '/services/refonte-site-web': '/pages/services/refonte-site-web.html',
    '/services/identite-marque': '/pages/services/identite-marque.html',
    '/services/outil-metier': '/pages/services/outil-metier.html',
    '/services/crm-dashboard': '/pages/services/crm-dashboard.html',
    '/services/accompagnement': '/pages/services/accompagnement.html',
  }

  const devServerPlugin = {
    name: 'dev-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [pathname] = (req.url || '').split('?')
        if (pathname === '/devis' || pathname === '/devis/' || pathname === '/pages/devis.html') {
          res.statusCode = 301
          res.setHeader('Location', '/contact')
          res.end()
          return
        }
        if (pathname !== '/' && pathname.endsWith('/') && cleanUrlRedirects[pathname.slice(0, -1)]) {
          res.statusCode = 301
          res.setHeader('Location', pathname.slice(0, -1))
          res.end()
          return
        }
        const destination = cleanUrlRedirects[pathname]
        if (destination) {
          res.statusCode = 302
          res.setHeader('Location', destination)
          res.end()
          return
        }
        next()
      })
      server.middlewares.use('/api/contact', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }
        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', async () => {
          try {
            const prepared = prepareContact(JSON.parse(body))
            res.setHeader('Content-Type', 'application/json')
            if (prepared.spam) { res.statusCode = 200; res.end(JSON.stringify({ success: true })); return }
            if (prepared.error) { res.statusCode = 400; res.end(JSON.stringify({ error: prepared.error })); return }
            const fields = prepared.fields

            const airtableRes = await fetch(
              'https://api.airtable.com/v0/appQiGvTkB5xty0ev/tblI15PkGslM3g5jW',
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fields, typecast: true }),
              }
            )
            if (!airtableRes.ok) throw new Error(await airtableRes.text())
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true }))
          } catch (err) {
            console.error('Airtable error:', err)
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Erreur Airtable' }))
          }
        })
      })
    }
  }

  return {
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'public'),
    plugins: [
      htmlPartialsPlugin({ enableFigmaCapture: env.ENABLE_FIGMA_CAPTURE === 'true' }),
      devServerPlugin,
    ],
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main:            resolve(__dirname, 'src/pages/index.html'),
          notFound:        resolve(__dirname, 'src/404.html'),
          contact:         resolve(__dirname, 'src/pages/contact.html'),
          guides:          resolve(__dirname, 'src/pages/guides/index.html'),
          guideAgence:     resolve(__dirname, 'src/pages/guides/agence-web-ou-freelance.html'),
          guideExcel:      resolve(__dirname, 'src/pages/guides/remplacer-excel-par-un-outil-sur-mesure.html'),
          guideRefonte:    resolve(__dirname, 'src/pages/guides/refonte-ou-nouveau-site.html'),
          agenceRoissy:    resolve(__dirname, 'src/pages/agence-web-roissy-en-brie.html'),
          agenceSeineMarne: resolve(__dirname, 'src/pages/agence-web-seine-et-marne.html'),
          aPropos:         resolve(__dirname, 'src/pages/a-propos.html'),
          mentionsLegales: resolve(__dirname, 'src/pages/mentions-legales.html'),
          siteWeb:         resolve(__dirname, 'src/pages/services/site-web.html'),
          refonteSiteWeb:  resolve(__dirname, 'src/pages/services/refonte-site-web.html'),
          identiteMarque:  resolve(__dirname, 'src/pages/services/identite-marque.html'),
          outilMetier:     resolve(__dirname, 'src/pages/services/outil-metier.html'),
          crmDashboard:    resolve(__dirname, 'src/pages/services/crm-dashboard.html'),
          accompagnement:  resolve(__dirname, 'src/pages/services/accompagnement.html'),
        }
      }
    },
    server: {
      open: '/pages/index.html',
    }
  }
})
