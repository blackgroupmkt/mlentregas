/**
 * Script de integração com Facebook Pixel
 * Implementação priorizada para execução no frontend (Netlify)
 */

// Lista de todos os Facebook Pixel IDs a serem utilizados
const FACEBOOK_PIXEL_IDS = [
  '1792580288175805',  // Pixel principal solicitado
];

// Mantemos o ID original como referência para compatibilidade com código existente
const FACEBOOK_PIXEL_ID = FACEBOOK_PIXEL_IDS[0];

/**
 * Inicializa o Facebook Pixel
 */
export function initFacebookPixel(): void {
  console.log('[PIXEL] Inicializando Facebook Pixels');
  
  // Adicionar o script do Facebook Pixel à página
  if (typeof window !== 'undefined' && !window.fbq) {
    const head = document.head || document.getElementsByTagName('head')[0];
    const pixelScript = document.createElement('script');
    pixelScript.type = 'text/javascript';
    
    // Criar o código base do Facebook Pixel
    pixelScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    `;
    
    // Adicionar inicialização para todos os Pixel IDs
    FACEBOOK_PIXEL_IDS.forEach(pixelId => {
      pixelScript.innerHTML += `
      fbq('init', '${pixelId}');
      `;
    });
    
    // Adicionar o tracking de PageView
    pixelScript.innerHTML += `fbq('track', 'PageView');`;
    
    head.appendChild(pixelScript);

    // Adicionar noscript fallback para rastreamento para todos os pixels
    FACEBOOK_PIXEL_IDS.forEach(pixelId => {
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      head.appendChild(noscript);
    });
    
    console.log(`[PIXEL] ${FACEBOOK_PIXEL_IDS.length} Facebook Pixels inicializados com sucesso.`);
  }
}

/**
 * Rastreia um evento do Facebook Pixel
 * @param eventName Nome do evento
 * @param eventData Dados do evento (opcional)
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>): void {
  if (typeof window !== 'undefined') {
    // Inicializar o Pixel se ainda não estiver inicializado
    if (!window.fbq) {
      initFacebookPixel();
      
      // Aguardar a inicialização do pixel
      setTimeout(() => {
        if (window.fbq) {
          console.log(`[PIXEL] Rastreando evento após inicialização: ${eventName}`, eventData || '');
          window.fbq('track', eventName, eventData);
        } else {
          console.warn('[PIXEL] Falha ao inicializar o Facebook Pixel para rastrear evento.');
        }
      }, 500);
      return;
    }
    
    console.log(`[PIXEL] Rastreando evento: ${eventName}`, eventData || '');
    window.fbq('track', eventName, eventData);
  } else {
    console.warn('[PIXEL] Ambiente sem janela detectado, não é possível rastrear evento.');
  }
}

/**
 * Rastreia um evento de compra aprovada
 * @param transactionId ID da transação
 * @param amount Valor da transação
 * @param currency Moeda (default: BRL)
 * @param itemName Nome do item
 * @param isApproved Flag que indica se o pagamento foi aprovado
 */
export function trackPurchase(
  transactionId: string, 
  amount: number,
  currency: string = 'BRL',
  itemName: string = 'Kit de Segurança Mercado Livre',
  isApproved: boolean = true // Por padrão, apenas rastreia aprovados
): boolean {
  // Garantir que apenas vendas aprovadas sejam rastreadas
  if (!isApproved) {
    console.log('[PIXEL] Ignorando evento de compra não aprovada:', { transactionId, amount });
    return false;
  }

  console.log('[PIXEL] Rastreando compra aprovada:', { transactionId, amount });
  
  const eventData = {
    value: amount,
    currency: currency,
    content_name: itemName,
    content_type: 'product',
    content_ids: [transactionId],
    transaction_id: transactionId,
  };
  
  try {
    // Método principal: Usando fbq padrão com trackSingle para garantir que o rastreamento seja feito no pixel correto
    if (typeof window !== 'undefined' && window.fbq) {
      const pixelId = FACEBOOK_PIXEL_IDS[0];
      window.fbq('trackSingle', pixelId, 'Purchase', eventData);
      console.log(`[PIXEL] Evento Purchase enviado para o pixel ID ${pixelId}`);
    }
    
    // Método de backup: Chamada direta ao pixel via imagem (funciona mesmo com bloqueadores)
    const pixelId = FACEBOOK_PIXEL_IDS[0];
    const img = new Image();
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=Purchase&cd[value]=${amount}&cd[currency]=${currency}&cd[content_name]=${encodeURIComponent(itemName)}&cd[content_type]=product&cd[content_ids]=${transactionId}&cd[transaction_id]=${transactionId}&noscript=1`;
    
    console.log(`[PIXEL] Evento de compra enviado com sucesso para o Facebook Pixel ID: ${pixelId}`);
    return true;
  } catch (error) {
    console.error('[PIXEL] Erro ao rastrear compra:', error);
    return false;
  }
}

/**
 * Verifica o status de um pagamento diretamente na API For4Payments
 * Esta função permite que o frontend verifique o status diretamente 
 * quando o backend não conseguir processar
 * 
 * Atualizada para apenas rastrear vendas aprovadas no Facebook Pixel 1792580288175805
 */
export async function checkPaymentStatus(paymentId: string, apiKey: string): Promise<any> {
  try {
    console.log('[PIXEL] Verificando status da transação diretamente do frontend:', paymentId);
    console.log('[PIXEL] API Key disponível:', apiKey ? 'Sim (não exibida por segurança)' : 'Não');
    
    // Garantir que temos uma API key
    if (!apiKey) {
      console.error('[PIXEL] VITE_FOR4PAYMENTS_SECRET_KEY não está definida no frontend');
      return { success: false, error: 'API Key não disponível' };
    }
    
    // Adicionando cabeçalhos extras para evitar bloqueios CORS
    const headers = {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest'
    };
    
    // Enviar requisição para verificar status
    const response = await fetch(`https://app.for4payments.com.br/api/v1/transaction.getPayment?id=${paymentId}`, {
      method: 'GET',
      headers,
      mode: 'cors',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API For4Payments: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[PIXEL] Status do pagamento verificado:', data);
    
    // Lista de status que podem ser considerados "aprovados"
    const approvedStatusList = ['APPROVED', 'approved', 'PAID', 'paid', 'COMPLETED', 'completed'];
    
    // Verificar se o status está na lista de aprovados
    const isApproved = data && data.status && approvedStatusList.includes(data.status.toUpperCase());
    
    if (isApproved) {
      console.log('[PIXEL] Pagamento APROVADO! Rastreando evento de conversão...');
      
      // Obter o valor da transação ou usar o valor padrão
      const amount = data.amount ? parseFloat(data.amount) / 100 : 79.90; // Kit Mercado Livre custa 79,90
      
      // Enviar evento de conversão apenas se aprovado
      const result = trackPurchase(
        paymentId, 
        amount, 
        'BRL', 
        'Kit de Segurança Mercado Livre', 
        true // Garantir explicitamente que apenas vendas aprovadas são rastreadas
      );
      
      // Registrar o sucesso do evento
      if (result) {
        console.log(`[PIXEL] Evento de conversão enviado com sucesso para o Facebook Pixel ID: ${FACEBOOK_PIXEL_IDS[0]}`);
      } else {
        console.warn('[PIXEL] Falha ao enviar evento de conversão.');
      }
      
      return { success: true, data, approved: true };
    } else {
      console.log('[PIXEL] Pagamento NÃO APROVADO. Nenhum evento de conversão será rastreado.');
      return { success: true, data, approved: false };
    }
  } catch (error) {
    console.error('[PIXEL] Erro ao verificar status diretamente:', error);
    return { success: false, error, approved: false };
  }
}

// Adicionar tipagem para o Facebook Pixel no window global
declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}