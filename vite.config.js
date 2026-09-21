import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'

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
    '/devis': '/pages/devis.html',
    '/contact': '/pages/devis.html',
    '/a-propos': '/pages/a-propos.html',
    '/mentions-legales': '/pages/mentions-legales.html',
    '/services/site-web': '/pages/services/site-web.html',
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
            const { nom, email, societe, telephone, type_projet, budget, message, soumis_le } = JSON.parse(body)
            const fields = {
              'Nom complet': nom,
              'Email': email,
              'Projet': message,
              'Date de réception': soumis_le || new Date().toISOString(),
              'Statut lead': 'Nouveau',
            }
            if (societe)     fields['Société']        = societe
            if (telephone)   fields['Téléphone']      = telephone
            if (type_projet) fields['Type de projet'] = type_projet
            if (budget)      fields['Budget estimé']  = budget

            const airtableRes = await fetch(
              'https://api.airtable.com/v0/appQiGvTkB5xty0ev/tblI15PkGslM3g5jW',
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fields }),
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
          devis:           resolve(__dirname, 'src/pages/devis.html'),
          aPropos:         resolve(__dirname, 'src/pages/a-propos.html'),
          mentionsLegales: resolve(__dirname, 'src/pages/mentions-legales.html'),
          siteWeb:         resolve(__dirname, 'src/pages/services/site-web.html'),
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
