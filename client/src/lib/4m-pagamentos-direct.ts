/**
 * Cliente direto para a API 4m Pagamentos
 * Para uso quando o secret está disponível como variável de ambiente
 */

// Interface para os dados da solicitação de pagamento
interface PaymentRequest {
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  amount?: number;
  description?: string;
  product_id?: number;
}

// Interface para a resposta do pagamento
interface PaymentResponse {
  id: string;
  transactionId: string;
  pixCode: string;
  pixQrCode: string;
  amount: number;
  status: string;
  expiresAt?: string;
  createdAt?: string;
}

// Interface para verificação de status
interface PaymentStatus {
  id: string;
  transactionId: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  amount: number;
  createdAt?: string;
  paidAt?: string;
}

// Gerar email aleatório para casos onde o email não é fornecido
function generateRandomEmail(name: string): string {
  const username = name.toLowerCase().replace(/\s+/g, '.').substring(0, 15);
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${username}.${randomString}@mail.shopee.br`;
}

// Gerar telefone aleatório para casos onde o telefone não é fornecido
function generateRandomPhone(): string {
  const ddd = Math.floor(Math.random() * (99 - 11) + 11);
  const numero1 = Math.floor(Math.random() * (99999 - 10000) + 10000);
  const numero2 = Math.floor(Math.random() * (9999 - 1000) + 1000);
  return `${ddd}${numero1}${numero2}`;
}

/**
 * Cria um pagamento PIX diretamente pelo frontend usando a API 4m Pagamentos
 * 
 * ATENÇÃO: Isto deve ser usado apenas quando VITE_FOUR_M_PAGAMENTOS_API_KEY está 
 * configurada no ambiente como variável segura.
 */
export async function createPixPaymentDirect(data: PaymentRequest): Promise<PaymentResponse> {
  // Obter API Key da variável de ambiente
  const apiKey = import.meta.env.VITE_FOUR_M_PAGAMENTOS_API_KEY;
  
  if (!apiKey) {
    throw new Error('VITE_FOUR_M_PAGAMENTOS_API_KEY não configurada no ambiente.');
  }
  
  // URL da API 4m Pagamentos
  const apiUrl = 'https://app.4mpagamentos.com/api/v1/payments';
  
  console.log('Criando transação PIX via 4m Pagamentos...');
  
  try {
    // Processar CPF - remover caracteres não numéricos
    const cpf = data.cpf.replace(/[^0-9]/g, '');
    
    // Processar telefone - remover caracteres não numéricos
    const phone = data.phone ? data.phone.replace(/\D/g, '') : generateRandomPhone();
    
    // Formatar amount como string com 2 casas decimais
    const amount = data.amount || 79.90;
    const formattedAmount = typeof amount === 'number' 
      ? amount.toFixed(2) 
      : parseFloat(amount).toFixed(2);
    
    const payload = {
      amount: formattedAmount,
      customer_name: data.name,
      customer_email: data.email || generateRandomEmail(data.name),
      customer_cpf: cpf,
      customer_phone: phone,
      description: data.description || 'Pagamento via PIX',
      ...(data.product_id && { product_id: data.product_id })
    };
    
    console.log('Enviando requisição para 4m Pagamentos:', {
      ...payload,
      customer_cpf: `${cpf.substring(0, 3)}***${cpf.substring(cpf.length - 2)}`,
    });
    
    // Configurar e enviar a requisição para a API 4m Pagamentos
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(payload)
    });
    
    // Verificar se a resposta foi bem sucedida
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API:', errorText);
      throw new Error(`Falha na comunicação com 4m Pagamentos: ${response.statusText}`);
    }
    
    // Processar a resposta
    const transaction = await response.json();
    console.log('Transação criada:', transaction);
    
    // Validar a resposta
    if (!transaction.pixCode || !transaction.pixQrCode) {
      console.error('Resposta da API incompleta:', transaction);
      throw new Error('Resposta da API não contém os dados PIX necessários');
    }
    
    return {
      id: transaction.id,
      transactionId: transaction.transactionId,
      pixCode: transaction.pixCode,
      pixQrCode: transaction.pixQrCode,
      amount: transaction.amount,
      status: transaction.status || 'pending',
      expiresAt: transaction.expiresAt,
      createdAt: transaction.createdAt
    };
  } catch (error: any) {
    console.error('Erro ao processar pagamento direto:', error);
    throw new Error(error.message || 'Não foi possível processar o pagamento no momento');
  }
}

/**
 * Verifica o status de um pagamento
 * Este endpoint é público e não requer autenticação
 */
export async function checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
  try {
    console.log('Verificando status da transação:', transactionId);
    
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
      throw new Error(`Erro ao verificar status: ${response.statusText}`);
    }
    
    const statusData = await response.json();
    console.log('Status:', statusData.status);
    
    return {
      id: statusData.id,
      transactionId: statusData.transactionId,
      status: statusData.status,
      amount: statusData.amount,
      createdAt: statusData.createdAt,
      paidAt: statusData.paidAt
    };
  } catch (error: any) {
    console.error('Erro ao verificar status:', error);
    throw new Error(error.message || 'Erro ao verificar status do pagamento');
  }
}

/**
 * Inicia verificação de status com polling a cada 5 segundos
 * Retorna uma promessa que resolve quando o pagamento for confirmado, expirado ou cancelado
 */
export function startPaymentStatusPolling(
  transactionId: string,
  onStatusChange?: (status: PaymentStatus) => void,
  onPaid?: (status: PaymentStatus) => void,
  onError?: (error: Error) => void
): () => void {
  let intervalId: NodeJS.Timeout | null = null;
  let stopped = false;
  
  const checkStatus = async () => {
    if (stopped) return;
    
    try {
      const statusData = await checkPaymentStatus(transactionId);
      
      // Notificar mudança de status
      if (onStatusChange) {
        onStatusChange(statusData);
      }
      
      // Verificar se o pagamento foi confirmado
      if (statusData.status === 'paid') {
        console.log('PAGAMENTO CONFIRMADO!');
        if (onPaid) {
          onPaid(statusData);
        }
        // Parar o polling
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } else if (statusData.status === 'expired' || statusData.status === 'cancelled') {
        console.log('Transação expirada ou cancelada');
        // Parar o polling
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    } catch (error: any) {
      console.error('Erro ao verificar status:', error);
      if (onError) {
        onError(error);
      }
    }
  };
  
  // Iniciar verificação imediata
  checkStatus();
  
  // Configurar polling a cada 5 segundos
  intervalId = setInterval(checkStatus, 5000);
  
  // Retornar função para parar o polling
  return () => {
    stopped = true;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}
