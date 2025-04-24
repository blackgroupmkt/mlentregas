import { FC, useState } from 'react';
import Header from '../components/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import TreinamentoModal from '../components/TreinamentoModal';

// Nova imagem de treinamento Mercado Livre
const kitTreinamentoImage = 'https://i.ibb.co/hRkC63LG/Inserir-um-ti-tulo-2.webp';

const Treinamento: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      
      <div className="w-full bg-[#FFE602] py-1 px-6 flex items-center relative overflow-hidden border-t border-[#272F76]">
        {/* Meia-lua no canto direito */}
        <div className="absolute right-0 top-0 bottom-0 w-32 h-full rounded-l-full bg-[#FFD100]"></div>
        
        <div className="flex items-center relative z-10">
          <div className="text-[#303674] mr-3">
            <i className="fas fa-chevron-right text-3xl font-black" style={{color: '#303674'}}></i>
          </div>
          <div className="leading-none">
            <h1 className="text-base font-bold text-[#303674] mb-0">Treinamento Online</h1>
            <p className="text-[#303674] text-sm mt-0" style={{transform: 'translateY(-2px)'}}>Mercado Livre</p>
          </div>
        </div>
      </div>
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Status de Aprovação */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="bg-[#F8F8FF] p-4 border-b border-[#272F7620]">
              <h3 className="font-semibold text-[#272F76]">Status do Cadastro</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full space-y-4">
                  <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-4">
                    <div className="flex items-center">
                      <div className="text-green-500 mr-3">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-green-700">Aprovado - Kit de Segurança Confirmado!</h4>
                        <p className="text-sm text-green-600">Seu cadastro foi aprovado e o pagamento do Kit foi confirmado. Entrega em até 5 dias úteis.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-sm text-gray-700 font-medium">
                      Sua jornada como Motorista Parceiro Mercado Livre está quase completa! <strong>PARA FINALIZAR O PROCESSO 
                      E LIBERAR SEU ACESSO AO SISTEMA</strong>, você precisa concluir o treinamento online oficial 
                      de 3 horas do Mercado Livre para entregadores. 
                      <span className="block mt-2 text-red-600">O treinamento é OBRIGATÓRIO para receber suas credenciais e acessar o aplicativo.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sobre o treinamento */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="bg-[#F8F8FF] p-4 border-b border-[#272F7620]">
              <h3 className="font-semibold text-[#272F76]">Treinamento Online Mercado Livre</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-2/5">
                  <img 
                    src={kitTreinamentoImage} 
                    alt="Treinamento Shopee" 
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="w-full md:w-3/5">
                  <h4 className="text-lg font-medium mb-3">Curso Online de 3 horas</h4>
                  <p className="text-gray-600 mb-4">
                    Este treinamento essencial capacita você com todos os conhecimentos e habilidades 
                    necessários para atuar como um parceiro Mercado Livre de excelência.
                  </p>
                  <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
                    <h5 className="text-red-700 font-bold text-md mb-2">⚠️ ATENÇÃO: TREINAMENTO OBRIGATÓRIO</h5>
                    <p className="text-sm text-red-800">
                      Este treinamento é <strong>OBRIGATÓRIO</strong> para começar a trabalhar como Entregador Mercado Livre. 
                      Sem a conclusão do curso online de 3 horas:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-red-800">
                      <li>Você <strong>NÃO receberá</strong> as credenciais para acessar o aplicativo</li>
                      <li>Seu cadastro ficará <strong>PENDENTE</strong> no sistema</li>
                      <li>Você <strong>NÃO poderá</strong> receber ou realizar entregas</li>
                      <li>Seu kit de segurança será entregue, mas você <strong>NÃO poderá</strong> iniciar suas atividades</li>
                    </ul>
                  </div>
                  <Button 
                    className="w-full bg-[#272F76] hover:bg-[#1e234d] text-white font-medium py-3"
                    onClick={() => setModalOpen(true)}
                  >
                    Iniciar Treinamento Agora
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conteúdo do treinamento */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="bg-[#F8F8FF] p-4 border-b border-[#272F7620]">
              <h3 className="font-semibold text-[#272F76]">O que você vai aprender</h3>
            </div>
            <div className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-gray-700 font-medium">
                    Módulo 1: Introdução ao Mercado Livre e à sua plataforma de entregas
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>História e crescimento do Mercado Livre no Brasil</li>
                      <li>Como funciona o ecossistema de entregas Mercado Livre</li>
                      <li>Benefícios de ser um Motorista Parceiro Mercado Livre</li>
                      <li>Estrutura de ganhos e oportunidades de crescimento</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-gray-700 font-medium">
                    Módulo 2: Utilizando o aplicativo de entregas Mercado Livre
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Download e configuração do aplicativo de entregas</li>
                      <li>Navegação e funcionalidades principais</li>
                      <li>Aceitar, gerenciar e completar entregas</li>
                      <li>Sistema de rotas otimizadas e GPS integrado</li>
                      <li>Resolução de problemas comuns no aplicativo</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-gray-700 font-medium">
                    Módulo 3: Procedimentos de coleta e entrega
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Protocolo de coleta no centro de distribuição Mercado Livre</li>
                      <li>Verificação e confirmação de encomendas</li>
                      <li>Melhores práticas para acondicionamento de pacotes</li>
                      <li>Procedimentos de entrega e validação</li>
                      <li>Lidar com ausência de destinatários</li>
                      <li>Protocolos de devolução quando necessário</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-gray-700 font-medium">
                    Módulo 4: Segurança e boas práticas
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Uso correto do kit de segurança Mercado Livre</li>
                      <li>Prevenção de acidentes durante o transporte</li>
                      <li>Direção defensiva e economia de combustível</li>
                      <li>Manutenção preventiva do veículo</li>
                      <li>Protocolos em caso de emergências</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-gray-700 font-medium">
                    Módulo 5: Atendimento ao cliente e situações especiais
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Etiqueta profissional e representação da marca Mercado Livre</li>
                      <li>Comunicação eficaz com clientes</li>
                      <li>Lidar com situações desafiadoras</li>
                      <li>Política de não-confrontação</li>
                      <li>Protocolo para entregas de alto valor</li>
                      <li>Entregas sensíveis ou que exigem cuidados especiais</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-gray-700 font-medium">
                    Módulo 6: Gestão financeira e sistema de pagamentos
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Compreendendo seu extrato de ganhos</li>
                      <li>Ciclos de pagamento e processamento</li>
                      <li>Bônus por desempenho e campanhas especiais</li>
                      <li>Dicas para maximizar seus ganhos</li>
                      <li>Questões fiscais para trabalhadores autônomos</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-8 bg-[#F8F8FF] p-4 rounded-md border border-[#272F7620]">
                <h4 className="text-md font-bold text-[#272F76] mb-2">Certificação Mercado Livre para Entregadores</h4>
                <p className="text-[#272F76] text-sm mb-2">
                  Ao completar o treinamento, você receberá o Certificado Oficial Mercado Livre para Entregadores, 
                  que é <strong>OBRIGATÓRIO</strong> para:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-[#272F76]">
                  <li>Receber as credenciais de acesso ao aplicativo Mercado Livre Entregas</li>
                  <li>Ativar seu cadastro como entregador oficial</li>
                  <li>Começar a receber solicitações de entrega na sua região</li>
                  <li>Ter seu primeiro pagamento processado</li>
                </ul>
                <p className="text-[#272F76] text-sm mt-2 font-bold">
                  Atenção: Sem a conclusão do treinamento de 3 horas, seu acesso ao sistema permanecerá bloqueado.
                </p>
              </div>
            </div>
          </div>
          
          {/* Banner de conclusão */}
          <div className="bg-[#F8F8FF] p-6 rounded-lg border border-[#272F7620] mb-8">
            <div className="text-center">
              <h3 className="text-[#272F76] text-xl font-bold mb-3">Ganhe dinheiro sendo um Motorista Parceiro Mercado Livre</h3>
              <p className="text-gray-700 mb-4">
                Estamos felizes em tê-lo como parte da nossa equipe de entregadores. <strong>Lembre-se:</strong> 
                você precisa concluir este treinamento obrigatório de 3 horas para liberar seu acesso ao aplicativo 
                e começar a receber solicitações de entrega na sua região!
              </p>
              <p className="text-red-600 text-sm font-bold mb-4">
                ATENÇÃO: Sem a conclusão do treinamento, seu cadastro permanecerá pendente e você não poderá
                iniciar suas atividades como entregador Mercado Livre.
              </p>
              <Button 
                className="bg-[#272F76] hover:bg-[#1e234d] text-white font-medium py-3 px-8"
                onClick={() => setModalOpen(true)}
              >
                Iniciar Treinamento Agora
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de agendamento do treinamento */}
      <TreinamentoModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Treinamento;