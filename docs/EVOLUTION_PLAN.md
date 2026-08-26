# Plano de evolução responsável — Duck Studio

## Legado preservado

O projeto existente é tratado como ativo. O site público, catálogo visual, portal, Beat Lab e governança em três nós são mantidos. A regra de evolução é **preservar → adaptar → ampliar**, e não reescrever por estética. Cada novo provedor deve entrar por um adaptador, mantendo o núcleo de produtos, licenças, ativos, eventos e tarefas independente do fornecedor.

## Máquina física e processamento persistente

Não existe máquina física, worker persistente, fila distribuída ou infraestrutura de backup própria nesta versão. Quando tarefas pesadas, renderização musical, conversão de áudio, sincronização contínua ou monitoramento 24 horas forem necessários, o próximo passo é uma infraestrutura persistente com fila, armazenamento de objetos, observabilidade e política de recuperação. Até então, a plataforma permanece adequada a fluxos web transacionais curtos e não declara execução em segundo plano.

## Autonomia financeira responsável

Autonomia financeira, neste projeto, significa reduzir trabalho operacional em processos comerciais aprovados: registrar lead, organizar produto, preparar licença, acompanhar status e liberar ativos somente após confirmação verificável. Ela não significa investir, movimentar dinheiro, alterar preços, conceder reembolsos ou publicar produtos sem controle humano.

O painel de cenários usa somente premissas registradas pelo proprietário. Sem pedidos confirmados, custo de aquisição, reembolsos e custos operacionais, o resultado deve permanecer como **dados insuficientes**. A integração de Shopify, quando receber permissões válidas, deverá fornecer pedidos e status reais. Qualquer integração de pagamento precisa incluir idempotência, webhook autenticado, reconciliação e aprovação para exceções.

## Ativos digitais e licenças

O banco já possui modelos para produtos, modelos de licença, pedidos, licenças emitidas e ativos digitais. A ativação depende de termos aprovados, produtos reais, arquivos autorizados e provedor de comércio. A entrega deve usar armazenamento com chave privada e verificação de autorização; links públicos permanentes não são adequados para arquivos licenciados.

## Critério de ampliação

Uma expansão só deve ser promovida quando reduzir erro, reduzir trabalho, melhorar conversão com dados, reforçar segurança, melhorar experiência do cliente ou preparar crescimento modular. Recursos sem essa justificativa ficam fora da versão atual.
