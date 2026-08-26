# Critérios para recursos externos

## Elegibilidade

Um recurso de GitHub, Hugging Face ou fonte financeira aberta só pode entrar no Duck Studio se houver benefício direto para produção, catálogo, acessibilidade, privacidade, operação ou análise de métricas. A fonte deve apresentar licença identificável, manutenção verificável, documentação suficiente e compatibilidade com execução web gerenciada.

| Critério | Aceitar | Excluir ou manter bloqueado |
|---|---|---|
| Licença | Código ou dados com licença explícita e compatível | Licença ausente, ambígua, não comercial ou incompatível |
| Música e mídia | Ferramentas, dados e modelos com direitos claros | Áudio, samples, vozes, obras ou corpus sem autorização de uso comercial |
| Segurança | Código revisável, sem segredo embutido e sem execução não confiável | Binários opacos, credenciais, instruções para ignorar controles ou acesso excessivo |
| Privacidade | Dados agregados, públicos ou fornecidos pelo proprietário | Dados bancários, pessoais, transacionais ou de clientes sem consentimento e finalidade |
| Open banking | Padrões, sandbox e dados públicos não pessoais | Acesso a contas reais, pagamentos ou scraping financeiro sem autorização explícita |
| Operação | Adaptador desligável, logs e aprovação do proprietário | Dependência única, job persistente incompatível ou automação financeira irreversível |

## Regra para dados financeiros

Dados financeiros abertos podem informar **contexto público agregado** ou arquitetura de conectores. Eles não devem ser usados para acessar contas, aconselhar investimento, executar pagamentos, determinar crédito ou produzir promessas de retorno. Conexões financeiras reais só podem ser ativadas depois de consentimento explícito, autenticação do proprietário, contrato com provedor e aprovação humana para ações sensíveis.
