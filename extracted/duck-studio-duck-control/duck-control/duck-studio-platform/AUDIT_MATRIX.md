# Matriz de auditoria — Duck Studio

## Escopo e método

Esta matriz registra o estado observado no código, banco, rotas e configuração da versão atual. **Funcional** significa que há código e fluxo implementados; não significa que dados comerciais, credenciais ou ativos externos já estejam ativos. Itens sem evidência são classificados explicitamente como parciais, pendentes ou bloqueados.

| Módulo | Estado | Evidência observada | Ação priorizada |
|---|---|---|---|
| Site público e identidade visual | Funcional | Rotas públicas, design responsivo e conteúdo em pt-BR | P3: concluir metadados multilíngues e conteúdo real autorizado |
| Versões públicas ES/EN | Parcial | Rotas `/es` e `/en` com páginas públicas traduzidas | P3: centralizar dicionários e adicionar SEO internacional |
| Catálogo de beats | Parcial | Filtros e cartões funcionam, mas catálogo está em código e a prévia é visual | P1: migrar para produtos reais e arquivos autorizados |
| Checkout e pagamentos | Bloqueado por credencial | Shopify não possui permissão de storefront; não há pagamento simulado | P0: resolver credenciais, webhook e idempotência antes de ativar |
| Produtos e licenças | Preparado parcialmente | Estruturas de página e requisitos definidos, sem catálogo ou termos reais | P1: modelar no banco e publicar após aprovação dos termos |
| Portal de clientes | Funcional parcial | OAuth, briefs, projetos, feedback e aprovação de etapas existem | P1: incluir compras, licenças e entregas privadas quando houver dados reais |
| Beat Lab | Funcional parcial | Gera e salva uma proposta de brief baseada em escolhas do usuário | P1: conectar a áudio, stems e renderização somente com ativos autorizados |
| Recursos Windows | Parcial | Guia disponível; não há recursos premium ou arquivos de cliente publicados | P1: conectar ativos S3 com autorização por cliente |
| Controle de três nós | Funcional | Pausa global, avaliação de dados/risco/aprovação e log de controle existem | P1: ampliar motor de tarefas e ações auditáveis |
| Leads e consentimento | Funcional parcial | Captura de consentimento e região existem | P0: implementar solicitação de direitos e verificação de identidade |
| Métricas e receita | Sem dados comerciais | O painel mostra apenas contagens reais; não há vendas inventadas | P1: integrar pedidos confirmados e custos antes de cálculo probabilístico |
| IA e geração musical | Preparado | Beat Lab é independente de IA e não há áudio inventado | P4: criar adaptador de IA somente após definir provedor/licença |
| Segurança web | Parcial | OAuth, procedimentos protegidos, validação Zod e RBAC administrativo existem | P0: adicionar cabeçalhos, limitar payload e testar autorização/privacidade |
| Infraestrutura física e jobs persistentes | Não configurado | A execução usa ambiente web gerenciado e não inclui máquina própria | P4: documentar evolução para ambiente persistente se houver necessidade comprovada |
| Git e legado | Funcional | Projeto possui histórico remoto gerenciado e arquivos existentes preservados | P2: salvar checkpoint após a validação da ampliação |

## Prioridades

**P0** cobre credenciais, segurança, proteção de dados e a ausência de pagamentos reais. **P1** cobre catálogo real, produtos, licenças, ativos privados, CRM e automações comerciais. **P2** cobre documentação e observabilidade. **P3** cobre refinamentos de experiência e SEO. **P4** representa infraestrutura física, filas persistentes e IA avançada, que não devem ser inventadas neste ambiente.

## Decisão de preservação

O site público, explorador de beats, portal, Beat Lab e controle de três nós são preservados. Não há remoção de módulos ativos. Funcionalidades que dependem de Shopify, dados comerciais, áudio, termos de licença, ativos ou infraestrutura externa permanecem identificadas como pendentes, e não como simuladas.
