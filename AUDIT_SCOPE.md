# Escopo de controles aplicados

Os controles implementados nesta versão são proporcionais a um aplicativo web gerenciado. A aplicação desativa a identificação do framework, limita corpos de requisição a 12 MB e define cabeçalhos contra MIME sniffing, enquadramento indevido, exposição excessiva de referrer e permissões de navegador não necessárias. HSTS é emitido somente em produção, onde a conexão deve estar sob HTTPS.

O design preserva o glassmorfismo, mas fornece uma alternativa de transparência reduzida e foco visível para navegação por teclado. Os procedimentos de domínio permanecem protegidos por autenticação, papel administrativo e validação Zod.

Não foram declarados como implementados: WAF, rate limiting distribuído, backup 3-2-1, pentest, mTLS, filas persistentes, processamento em segundo plano, infraestrutura física, TLS gerenciado pelo provedor, pagamentos ou recuperação de desastre. Esses itens precisam de infraestrutura, credenciais, escopo de teste ou contrato operacional próprios.
