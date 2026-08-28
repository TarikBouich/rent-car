import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// In-memory relay for cross-device signature capture
const signatureStore = {}

const signatureRelayPlugin = () => ({
  name: 'signature-relay',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // Allow CORS for the API
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      if (req.method === 'OPTIONS') {
         res.statusCode = 200;
         res.end();
         return;
      }

      if (req.url.startsWith('/api/signature')) {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', () => {
             try {
                const data = JSON.parse(body)
                if (data.action === 'CREATE') {
                   signatureStore[data.token] = { status: 'pending', dataUrl: null, pin: data.pin }
                   res.setHeader('Content-Type', 'application/json')
                   res.end(JSON.stringify({ success: true }))
                } else if (data.action === 'VERIFY') {
                   const session = signatureStore[data.token]
                   if (session && session.pin === data.pin) {
                      res.setHeader('Content-Type', 'application/json')
                      res.end(JSON.stringify({ success: true }))
                   } else {
                      res.statusCode = 401
                      res.setHeader('Content-Type', 'application/json')
                      res.end(JSON.stringify({ error: 'Invalid PIN' }))
                   }
                } else if (data.action === 'UPDATE') {
                   if (signatureStore[data.token]) {
                      signatureStore[data.token].status = 'signed'
                      signatureStore[data.token].dataUrl = data.dataUrl
                   }
                   res.setHeader('Content-Type', 'application/json')
                   res.end(JSON.stringify({ success: true }))
                } else if (data.action === 'DELETE') {
                   delete signatureStore[data.token]
                   res.setHeader('Content-Type', 'application/json')
                   res.end(JSON.stringify({ success: true }))
                } else {
                   res.statusCode = 400
                   res.end(JSON.stringify({ error: 'Unknown action' }))
                }
             } catch(e) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Invalid JSON' }))
             }
          })
        } else if (req.method === 'GET') {
           const url = new URL(req.url, `http://${req.headers.host}`)
           const token = url.searchParams.get('token')
           res.setHeader('Content-Type', 'application/json')
           const session = signatureStore[token]
           if (session) {
              // Never leak the PIN via GET. Only return status and metadata.
              res.end(JSON.stringify({ status: session.status, dataUrl: session.dataUrl }))
           } else {
              res.end(JSON.stringify(null))
           }
        }
      } else {
        next()
      }
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), signatureRelayPlugin()],
  server: {
    host: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
