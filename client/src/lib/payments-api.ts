import { API_BASE_URL } from './api-config';
import { createPixPaymentDirect } from './4m-pagamentos-direct';

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
  status?: string;
  expiresAt?: string;
  createdAt?: string;
  error?: string;
}

/**
 * Cria uma solicitação de pagamento PIX através da API 4m Pagamentos
 * Esta função escolhe automaticamente a melhor estratégia:
 * 1. Se VITE_FOUR_M_PAGAMENTOS_API_KEY estiver disponível - Chama direto a API
 * 2. Caso contrário - Usa o backend local como intermediário
 */
export async function createPixPayment(data: PaymentRequest): Promise<PaymentResponse> {
  console.log(`Ambiente de execução: ${import.meta.env.PROD ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
  
  // Verificar se a chave da 4m Pagamentos está disponível no frontend
  const has4mPaymentKey = !!import.meta.env.VITE_FOUR_M_PAGAMENTOS_API_KEY;
  
  // Em produção, se tiver a chave, chama diretamente a API 4m Pagamentos
  if (import.meta.env.PROD && has4mPaymentKey) {
    console.log('Usando chamada direta para 4m Pagamentos API');
    
    try {
      // Usar a implementação direta
      return await createPixPaymentDirect(data);
    } catch (error: any) {
      console.error('Falha na chamada direta, tentando via backend local:', error.message);
      // Em caso de erro, tenta via backend local
    }
  }
  
  // Chamar via backend local
  const apiUrl = '/api/payments/pix';
    
  console.log(`URL da API de pagamentos (via backend): ${apiUrl}`);
  console.log('Dados de pagamento:', {
    name: data.name,
    cpf: data.cpf.substring(0, 3) + '***' + data.cpf.substring(data.cpf.length - 2),
    email: data.email || 'não informado'
  });
  
  try {
    // Configurar opções de requisição
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include' as RequestCredentials,
      body: JSON.stringify({
        name: data.name,
        cpf: data.cpf,
        email: data.email || '',
        phone: data.phone || '',
        amount: data.amount || 79.90,
        description: data.description || 'Pagamento via PIX',
        ...(data.product_id && { product_id: data.product_id })
      })
    };
    
    // Fazer a requisição
    const response = await fetch(apiUrl, requestOptions);
    
    // Verificar se a resposta foi bem sucedida
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro HTTP ${response.status}: ${errorText}`);
      throw new Error(`Falha na comunicação com o servidor: ${response.statusText}`);
    }
    
    // Processar a resposta
    const result = await response.json();
    
    console.log('Resposta do servidor recebida com sucesso');
    
    // Validar a resposta
    if (!result.pixCode || !result.pixQrCode) {
      throw new Error('A resposta do servidor não contém os dados de pagamento PIX necessários');
    }
    
    return result;
  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error);
    throw new Error(error.message || 'Não foi possível processar o pagamento no momento');
  }
}
