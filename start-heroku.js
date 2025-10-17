// Servidor de inicialização simples para Heroku
// Garante que funciona mesmo com configurações incorretas

import express from 'express';
import cors from 'cors';
import compression from 'compression';

const app = express();
const PORT = process.env.PORT || 5000;

// Log de inicialização
console.log('='.repeat(50));
console.log('SHOPEE DELIVERY PARTNERS - HEROKU START');
console.log('='.repeat(50));
console.log(`Node Version: ${process.version}`);
console.log(`PORT: ${PORT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`Time: ${new Date().toISOString()}`);
console.log('='.repeat(50));

// Middlewares básicos
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log de todas as requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mock data
const mockRegions = [
  { name: "São Paulo", abbr: "SP", vacancies: 26 },
  { name: "Rio de Janeiro", abbr: "RJ", vacancies: 18 },
  { name: "Minas Gerais", abbr: "MG", vacancies: 14 },
  { name: "Distrito Federal", abbr: "DF", vacancies: 12 },
  { name: "Paraná", abbr: "PR", vacancies: 11 },
  { name: "Bahia", abbr: "BA", vacancies: 10 },
  { name: "Rio Grande do Sul", abbr: "RS", vacancies: 12 },
  { name: "Santa Catarina", abbr: "SC", vacancies: 10 },
  { name: "Goiás", abbr: "GO", vacancies: 9 },
  { name: "Pernambuco", abbr: "PE", vacancies: 9 },
  { name: "Ceará", abbr: "CE", vacancies: 8 },
  { name: "Amazonas", abbr: "AM", vacancies: 7 },
  { name: "Pará", abbr: "PA", vacancies: 7 },
  { name: "Espírito Santo", abbr: "ES", vacancies: 6 },
  { name: "Mato Grosso", abbr: "MT", vacancies: 6 },
  { name: "Alagoas", abbr: "AL", vacancies: 5 },
  { name: "Maranhão", abbr: "MA", vacancies: 5 },
  { name: "Mato Grosso do Sul", abbr: "MS", vacancies: 5 },
  { name: "Paraíba", abbr: "PB", vacancies: 5 },
  { name: "Rio Grande do Norte", abbr: "RN", vacancies: 5 },
  { name: "Acre", abbr: "AC", vacancies: 4 },
  { name: "Piauí", abbr: "PI", vacancies: 4 },
  { name: "Rondônia", abbr: "RO", vacancies: 4 },
  { name: "Sergipe", abbr: "SE", vacancies: 4 },
  { name: "Tocantins", abbr: "TO", vacancies: 4 },
  { name: "Amapá", abbr: "AP", vacancies: 3 },
  { name: "Roraima", abbr: "RR", vacancies: 3 }
];

// Rotas
app.get('/', (req, res) => {
  res.json({
    name: 'Shopee Delivery Partners API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      regions: '/api/regions',
      payments: '/api/payments/create-pix'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    port: PORT,
    uptime: process.uptime()
  });
});

app.get('/api/regions', (req, res) => {
  console.log('Regions requested');
  res.json(mockRegions);
});

app.post('/api/payments/create-pix', (req, res) => {
  const { name, cpf, email, phone, amount } = req.body;
  
  console.log('Payment request:', { name, cpf: cpf?.substring(0, 3) + '***', amount });
  
  if (!name || !cpf || !amount) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  
  const paymentId = `pix_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136${cpf}5204000053039865802BR5913Shopee${name}6009SAOPAULO62070503***6304${Math.floor(Math.random() * 10000)}`;
  const pixQrCode = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(pixCode)}`;
  
  res.json({
    id: paymentId,
    pixCode: pixCode,
    pixQrCode: pixQrCode,
    status: 'pending'
  });
});

// Catch-all para APIs não encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`✅ SERVER STARTED SUCCESSFULLY`);
  console.log(`🌐 Listening on port ${PORT}`);
  console.log(`🔗 http://0.0.0.0:${PORT}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
