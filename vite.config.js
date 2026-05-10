import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'public'),
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main:         resolve(__dirname, 'src/pages/index.html'),
          services:     resolve(__dirname, 'src/pages/services.html'),
          realisations: resolve(__dirname, 'src/pages/realisations.html'),
          agence:       resolve(__dirname, 'src/pages/agence.html'),
          contact:      resolve(__dirname, 'src/pages/contact.html'),
          devis:        resolve(__dirname, 'src/pages/devis.html'),
        }
      }
    },
    server: {
      open: '/pages/index.html',
      configureServer(server) {
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
  }
})
