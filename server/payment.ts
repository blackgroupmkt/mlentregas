import axios from 'axios';

// Interface para o payload de solicitação de pagamento
interface PaymentRequest {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  amount: number;
  description?: string;
  product_id?: number;
}

// Interface para a resposta de pagamento da API 4m Pagamentos
interface PaymentResponse {
  id: string;
  transactionId: string;
  pixCode: string;
  pixQrCode: string;
  amount: number;
  status: string;
  expiresAt?: string;
  createdAt?: string;
  error?: string;
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

/**
 * Serviço para processar pagamentos através da API 4m Pagamentos
 */
export class PaymentService {
  private readonly API_URL = 'https://app.4mpagamentos.com/api/v1';
  private readonly apiKey: string | undefined;

  constructor() {
    // Obter a chave secreta das variáveis de ambiente
    this.apiKey = process.env.FOUR_M_PAGAMENTOS_API_KEY;
  }
  
  private ensureApiKey(): string {
    if (!this.apiKey) {
      throw new Error('Chave de API 4m Pagamentos não configurada');
    }
    return this.apiKey;
  }

  /**
   * Cria um pagamento PIX
   */
  async createPixPayment(data: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Criando transação PIX via 4m Pagamentos...', {
        name: data.name,
        email: data.email,
        cpf: data.cpf ? data.cpf.substring(0, 3) + '...' + data.cpf.substring(data.cpf.length - 2) : '',
        amount: data.amount
      });
      
      // Formatar CPF (remover caracteres não numéricos)
      const cpf = data.cpf.replace(/\D/g, '');
      
      // Formato do telefone (remover caracteres não numéricos)
      const phone = data.phone ? data.phone.replace(/\D/g, '') : this.generateRandomPhone();
      
      // Formatar amount como string com 2 casas decimais
      const formattedAmount = typeof data.amount === 'number' 
        ? data.amount.toFixed(2) 
        : parseFloat(data.amount).toFixed(2);
      
      // Preparar dados para a API 4m Pagamentos
      const paymentData = {
        amount: formattedAmount,
        customer_name: data.name,
        customer_email: data.email || this.generateRandomEmail(data.name),
        customer_cpf: cpf,
        customer_phone: phone,
        description: data.description || 'Pagamento via PIX',
        ...(data.product_id && { product_id: data.product_id })
      };
      
      console.log('Enviando dados para API 4m Pagamentos');
      
      // Configurar headers
      const apiKey = this.ensureApiKey();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      };
      
      // Chamar API 4m Pagamentos
      const response = await axios.post(
        `${this.API_URL}/payments`,
        paymentData,
        { headers, timeout: 30000 }
      );
      
      console.log('Transação criada:', response.data);
      
      if (response.status === 200 || response.status === 201) {
        const transaction = response.data;
        
        // Verificar se os campos necessários estão presentes
        if (!transaction.pixCode || !transaction.pixQrCode) {
          throw new Error('Resposta da API não contém os dados PIX necessários');
        }
        
        const result: PaymentResponse = {
          id: transaction.id,
          transactionId: transaction.transactionId,
          pixCode: transaction.pixCode,
          pixQrCode: transaction.pixQrCode,
          amount: transaction.amount,
          status: transaction.status || 'pending',
          expiresAt: transaction.expiresAt,
          createdAt: transaction.createdAt
        };
        
        console.log('Transação PIX criada com sucesso:', result.transactionId);
        
        return result;
      } else {
        throw new Error(`Erro ao criar pagamento: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Erro ao criar transação PIX:', error.message);
      
      if (error.response) {
        console.error('Detalhes do erro:', error.response.data);
      }
      
      throw new Error(error.message || 'Erro ao processar pagamento');
    }
  }

  /**
   * Verifica o status de um pagamento
   * Este endpoint é público e não requer autenticação
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      console.log('Verificando status da transação:', transactionId);
      
      // Endpoint público - não requer autenticação
      const response = await axios.get(
        `${this.API_URL}/transactions/${transactionId}`,
        { timeout: 10000 }
      );
      
      if (response.status === 200) {
        const statusData = response.data;
        console.log('Status da transação:', statusData.status);
        
        return {
          id: statusData.id,
          transactionId: statusData.transactionId,
          status: statusData.status,
          amount: statusData.amount,
          createdAt: statusData.createdAt,
          paidAt: statusData.paidAt
        };
      } else {
        throw new Error(`Erro ao verificar status: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Erro ao verificar status:', error.message);
      throw new Error(error.message || 'Erro ao verificar status do pagamento');
    }
  }
  
  // Método auxiliar para gerar email aleatório quando não fornecido
  private generateRandomEmail(name: string): string {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${cleanName}${randomNum}@${domain}`;
  }
  
  // Método auxiliar para gerar telefone aleatório quando não fornecido
  private generateRandomPhone(): string {
    const ddd = Math.floor(Math.random() * (99 - 11 + 1) + 11).toString();
    const number = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    return `${ddd}${number}`;
  }
}

// Exportar instância única do serviço
export const paymentService = new PaymentService();
