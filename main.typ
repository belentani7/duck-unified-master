#import "report-theme.typ": report-accent, report-theme
#import "@preview/glossarium:0.5.10": make-glossary, register-glossary, print-glossary, gls

#let emerald = rgb("38F7BD")
#let deep = rgb("041813")
#let panel = rgb("0A2820")
#let mist = rgb("D6F6EA")
#let muted = rgb("9FC6B8")
#let divider = rgb("245E4D")

#show: report-theme.with(
  title: "Manual Operacional Duck Studio",
  author: "Duck Studio",
  rhythm: "report",
  running-header: true,
)
#set page(fill: deep, margin: (top: 1.75cm, bottom: 1.7cm, x: 1.8cm))
#set text(fill: mist, font: "Libertinus Serif", size: 10pt)
#set par(leading: 0.82em, spacing: 0.7em)
#show heading: set text(fill: emerald)
#show link: set text(fill: emerald)
#show: make-glossary

#let entries = (
  (key: "brief", short: "Brief", long: "Brief criativo", description: "Registro de objetivo, referências, mood, BPM e contexto de um projeto."),
  (key: "ativo", short: "Ativo", long: "Ativo digital", description: "Arquivo real inventariado com hash, acesso e metadados controlados."),
  (key: "licenca", short: "Licença", long: "Licença de uso", description: "Termos aprovados que definem a permissão de uso de um produto ou arquivo."),
  (key: "crm", short: "CRM", long: "Gestão de relacionamento", description: "Área para acompanhar leads reais, interesses, origem, status e notas internas."),
  (key: "automacao", short: "Automação", long: "Automação auditável", description: "Fluxo proposto que precisa respeitar regras, risco e aprovação configurada."),
  (key: "consentimento", short: "Consentimento", long: "Consentimento registrável", description: "Permissão específica registrada para uma finalidade de contato ou compartilhamento."),
  (key: "tres-nos", short: "Três nós", long: "Governança de três nós", description: "Validação de dados e regras, avaliação de risco e aprovação do proprietário."),
  (key: "cenario", short: "Cenário", long: "Cenário de receita", description: "Cálculo por premissas informadas; não é previsão, promessa ou recomendação financeira."),
  (key: "preview", short: "Preview", long: "Prévia autorizada", description: "Trecho de áudio autorizado para apresentação pública de um produto."),
  (key: "checkout", short: "Checkout", long: "Checkout seguro", description: "Etapa de compra hospedada por provedor de comércio configurado e autorizado."),
  (key: "shopify", short: "Shopify", long: "Integração Shopify", description: "Storefront, catálogo, carrinho e checkout dependentes de loja elegível e permissões corretas."),
  (key: "open-finance", short: "Open Finance", long: "Open Finance regulado", description: "Ecossistema financeiro baseado em consentimento e participantes regulados; não é ativo ou fonte de dados pessoais reutilizável."),
)
#register-glossary(entries)

#let label(content) = text(size: 7pt, weight: "bold", fill: emerald)[#content]
#let card(title, body) = block(
  fill: panel,
  stroke: 0.6pt + divider,
  radius: 10pt,
  inset: 13pt,
  breakable: true,
)[
  #text(size: 12pt, weight: "bold", fill: emerald)[#title]
  #v(0.35em)
  #text(fill: mist)[#body]
]
// ---------- Capa ----------
#page(fill: deep, margin: (top: 1.45cm, bottom: 1.45cm, x: 1.55cm), numbering: none, header: none)[
  #align(center)[
    #image("assets/duck-manual-emerald-crystal-cover.png", width: 100%, height: 8.2cm, fit: "cover")
  ]
  #v(1.5em)
  #label("DUCK STUDIO · OPERAÇÃO 01")
  #v(0.6em)
  #text(size: 28pt, weight: "bold", fill: mist)[Manual Operacional]
  #text(size: 28pt, style: "italic", fill: emerald)[Duck Studio]
  #v(0.7em)
  #text(size: 13pt, fill: muted)[Sistema criativo, comercial e auditável para beats, produção, licenças, clientes e ativos digitais.]
  #v(1.8em)
  #line(length: 100%, stroke: 0.7pt + divider)
  #v(1em)
  #grid(columns: (1fr, 1fr), gutter: 1.5em,
    [#label("EDIÇÃO") #linebreak() #text(weight: "bold")[Base operacional]],
    [#label("PRINCÍPIO") #linebreak() #text(weight: "bold")[Evidência antes de automação]],
  )
]

// ---------- Sumário ----------
#page(numbering: none, header: none)[
  #text(size: 20pt, weight: "bold", fill: emerald)[Mapa de operação]
  #v(0.8em)
  #text(fill: muted)[Este manual explica o que já pode ser operado, o que ainda depende de conteúdo ou credenciais reais e como manter o controle de cada decisão.]
  #v(1em)
  #outline(title: [Sumário], indent: 1.2em)
  #v(1.5em)
  #block(fill: panel, stroke: 0.6pt + divider, radius: 10pt, inset: 14pt)[
    #label("REGRA CENTRAL")
    #v(0.4em)
    #text(size: 13pt, weight: "bold", fill: mist)[Interface não é integração.]
    #v(0.35em)
    #text(fill: muted)[Um botão, uma tela ou uma tabela vazia não provam venda, pagamento, licença emitida, ativo entregue ou automação concluída. Registre somente fatos verificáveis.]
  ]
]

#counter(page).update(1)

= Visão geral

Duck Studio combina presença artística, catálogo comercial, relacionamento com clientes e governança operacional. A experiência pública usa português do Brasil como padrão, com versões opcionais em espanhol e inglês. A área autenticada concentra briefs, projetos, @licenca, @ativo, CRM e controles do proprietário.

#grid(columns: (1fr, 1fr), gutter: 12pt,
  card([O que está pronto], [Site público, rotas multilíngues, autenticação, portal, briefs, feedback, aprovações, CRM leve, inventário de ativos, catálogo em rascunho, privacidade, governança e cenários por premissas.]),
  card([O que depende de você], [Portfólio autorizado, previews de áudio, capas, produtos, preços, termos de licença, recursos Windows e a decisão sobre Shopify.]),
)

== Rotina do proprietário

1. Entre no portal e valide que o acesso é de proprietário.
2. Envie arquivos próprios em *Ativos*. O inventário registra nome, categoria, acesso, hash e tamanho.
3. Crie modelos de licença somente com termos aprovados.
4. Crie produtos em rascunho e associe os ativos corretos.
5. Cadastre leads reais, projetos e tarefas; nunca preencha dados para “parecer ativo”.
6. Mantenha a pausa global ligada sempre que houver dúvida operacional ou jurídica.

= Site público e captação

O site público apresenta o estúdio, serviços, Beats, Beat Lab, recursos e acesso ao portal. A navegação oferece PT, ES e EN para páginas públicas. As versões alternativas explicam a proposta do estúdio; as áreas administrativas e do cliente permanecem no fluxo autenticado.

== Leads com consentimento

O formulário de contato registra nome, e-mail, serviço de interesse, mensagem, região de privacidade e preferência de contato. O consentimento é necessário antes de qualquer acompanhamento comercial automatizado. Uma solicitação de contato não equivale a compra, autorização de marketing ou relação contratual.

#block(fill: panel, stroke: 0.6pt + divider, radius: 10pt, inset: 14pt)[
  #label("BOA PRÁTICA")
  #v(0.35em)
  Antes de responder, atualize o lead no @crm com origem, interesse e status. Preserve apenas a informação necessária e evite inserir dados sensíveis em notas internas.
]

= Catálogo, produtos e licenças

O catálogo público é uma vitrine preparada para produtos reais. Enquanto não houver produto ativo, preço aprovado e @preview autorizado, não há venda, carrinho nem checkout real. Isso protege o estúdio contra publicação de material sem direitos confirmados.

== Fluxo comercial correto

#grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
  card([1 · Ativo], [Envie o arquivo real e defina seu nível de acesso: privado, cliente, licenciado ou público.]),
  card([2 · Licença], [Crie o modelo com versão e termos aprovados. Não copie termos de terceiros.]),
  card([3 · Produto], [Crie produto em rascunho, associe licença e ativo. Só publique após conferir metadados, preço e direitos.]),
)

== Shopify e checkout

O fluxo Shopify está *pendente*. A integração precisa de loja elegível e permissões de storefront para emitir o token correto. Enquanto isso não estiver configurado, o catálogo não deve prometer compra segura nem apresentar preços definitivos. Quando houver loja, conecte catálogo, variantes de licença, previews e checkout em sequência.

#block(fill: rgb("3A260F"), stroke: 0.6pt + rgb("D59639"), radius: 10pt, inset: 14pt)[
  #text(weight: "bold", fill: rgb("FFD47A"))[Não publique antes de confirmar.] #text(fill: mist)[Preço, titularidade, licença, arquivo e visual precisam estar confirmados pelo Duck.]
]

= Portal de clientes

O portal autenticado permite enviar @brief, acompanhar projetos, revisar entregas, deixar feedback e aprovar etapas. Cada cliente vê somente informações autorizadas para seu acesso.

== Brief e Beat Lab

O @brief reúne objetivo, referências, mood, BPM e gênero. O Beat Lab transforma esses parâmetros em uma proposta de direção: preset, estrutura e variação. Ao salvar, a proposta vira um brief rastreável. O Beat Lab não gera faixa, stems ou renderização automática; ele organiza a direção criativa antes da produção humana ou de uma futura integração aprovada.

== Entregas e feedback

Quando um projeto estiver ativo, o cliente pode encontrar marcos, arquivos associados e espaço para feedback. Uma aprovação deve ser dada apenas depois de ouvir ou revisar o material correto. Para cada nova versão, atualize o ativo e preserve a ligação com o projeto.

= Ativos, recursos e acesso licenciado

O gestor de @ativo serve para arquivos reais: áudio, imagem, vídeo, preset, documento, arquivo de projeto ou outro material. O arquivo é armazenado com inventário e hash; o acesso é definido pelo proprietário.

== Distribuição segura

Arquivos que exigem licença não devem ser expostos por URL pública permanente. O portal de licenças consulta o histórico do cliente e pede ao servidor uma URL temporária somente quando existe autorização válida. Recursos Windows, presets e guias só devem ser publicados depois de preparados e atribuídos ao cliente correto.

#grid(columns: (1fr, 1fr), gutter: 12pt,
  card([Faça], [Use nomes claros, categorias corretas, versões e termos aprovados. Mantenha cópia mestre fora do catálogo público.]),
  card([Não faça], [Não compartilhe arquivos de terceiros, stems sem autorização, dados pessoais em nomes de arquivos ou links permanentes de conteúdo licenciado.]),
)

= CRM e operação comercial

O @crm leve acompanha leads reais, interesse, origem, status e notas internas. Ele não substitui uma plataforma de vendas externa, mas organiza o acompanhamento antes de uma integração de e-mail ou checkout.

== Cadência simples

#table(
  columns: (1.3fr, 1fr, 2.3fr),
  inset: 8pt,
  stroke: 0.4pt + divider,
  [#text(weight: "bold", fill: emerald)[Momento]], [#text(weight: "bold", fill: emerald)[Responsável]], [#text(weight: "bold", fill: emerald)[Ação verificável]],
  [Entrada], [Proprietário], [Criar lead, registrar origem e confirmar preferência de contato.],
  [Qualificação], [Proprietário], [Registrar interesse, escopo e próxima ação; não presumir orçamento ou consentimento.],
  [Proposta], [Proprietário], [Relacionar serviço ou produto real e registrar o que foi oferecido.],
  [Projeto], [Estúdio], [Abrir projeto após acordo confirmado e vincular o brief.],
  [Pós-entrega], [Proprietário], [Solicitar feedback somente conforme consentimento e política aplicável.],
)

= Auditoria e governança

Toda @automacao proposta passa por @tres-nos. O primeiro nó verifica dados, destinatário, consentimento e regras. O segundo classifica risco. O terceiro exige aprovação do proprietário quando a ação é sensível ou a configuração manual estiver ligada.

== Pausa global

A pausa global bloqueia ações externas. Use-a antes de mudar regras, revisar uma reclamação, alterar termos, receber uma solicitação de privacidade ou identificar comportamento inesperado. A trilha de auditoria deve registrar mudanças de controle e decisões relevantes.

== Privacidade

A rota pública de privacidade registra pedido de consulta, retirada de @consentimento ou exclusão. O processamento exige verificação humana de identidade pelo proprietário. Não exclua dados com base em pedido não verificado e não envie exportações a endereços sem confirmação.

= Cenários de receita e ativos

O painel de crescimento organiza @cenario de receita com premissas informadas pelo proprietário. Ele serve para comparar hipóteses operacionais — por exemplo, volume de leads, taxa de resposta, ticket e custo — e não para garantir retorno, prever vendas ou aconselhar investimento.

> Dados ausentes devem aparecer como insuficientes. Não substitua métricas reais por números “bonitos”.

Para se tornar útil, o painel precisa de dados observados: pedidos confirmados, origem de lead, custos de produção, tempo de entrega, produtos ativos e receita recebida. A interpretação final continua sendo do proprietário.

= Recursos externos e Open Finance

O painel de recursos externos contém adaptadores *desativados por padrão*. Cada entrada apresenta estado e checklist; nenhuma possui credencial embutida, chama serviço remoto ou acessa conta bancária.

#grid(columns: (1fr, 1fr), gutter: 12pt,
  card([Selecionados para futuro], [music-metadata para metadados de arquivos próprios; Tone.js para previews autorizados; audioFlux em serviço separado; PDMX apenas para pesquisa simbólica; dados abertos agregados do Banco Central.]),
  card([Bloqueados ou excluídos], [Open Finance requer participante regulado, consentimento, autenticação e confirmação. Modelos de áudio com licença comercial condicionada não entram sem revisão contratual.]),
)

Open Finance não é caminho para coletar dados financeiros de clientes, criar ativos automaticamente ou movimentar dinheiro. Qualquer parceria futura deve envolver instituição regulada, consentimento explícito e revisão jurídica e de segurança.

= Checklist de ativação

== Antes de publicar catálogo

- [ ] Portfólio, créditos e capas confirmados.
- [ ] Previews de áudio autorizados e testados.
- [ ] Produtos, preço e moeda definidos.
- [ ] Termos de licença aprovados e versionados.
- [ ] Ativos associados ao produto certo.
- [ ] Shopify ou outro provedor de checkout configurado.

== Antes de ativar automação externa

- [ ] Finalidade, destinatário e consentimento verificados.
- [ ] Risco avaliado pelos três nós.
- [ ] Pausa global revisada.
- [ ] Aprovação do proprietário registrada quando necessária.
- [ ] Trilha de auditoria disponível.

== Antes da entrega final do projeto

- [ ] Brief aprovado e escopo confirmado.
- [ ] Arquivo final associado à versão correta.
- [ ] Licença emitida ou termos confirmados.
- [ ] Cliente recebeu acesso temporário autorizado.
- [ ] Feedback e aprovação registrados.

= Limites atuais e evolução

O ambiente atual não executa workers persistentes, renderização pesada ou automações autônomas de alto risco. O sistema está preparado para evoluir, mas não afirma possuir máquina física, autonomia financeira, processamento contínuo, pagamento ativo, dados bancários ou geração musical profissional automática.

As próximas prioridades são: cadastrar ativos e termos reais, resolver Shopify, ligar pedido confirmado à emissão de licença, incorporar métricas observadas e executar a bateria final de testes autorizada. A acessibilidade com teclado e leitor de tela deve ser verificada no ambiente publicado.

= Glossário operacional

#print-glossary(entries, show-all: true, disable-back-references: true)

= Encerramento

#block(fill: panel, stroke: 0.6pt + divider, radius: 12pt, inset: 16pt)[
  #text(size: 15pt, weight: "bold", fill: emerald)[Crie com controle. Venda com clareza. Cresça com evidência.]
  #v(0.5em)
  #text(fill: muted)[Duck Studio foi estruturado para valor artístico e operação responsável: cada ativo precisa de origem, cada licença precisa de termo e cada automação precisa de motivo, limite e registro.]
]
