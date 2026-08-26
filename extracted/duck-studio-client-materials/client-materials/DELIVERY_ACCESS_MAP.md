# Mapa de acesso — Duck Studio

> Esta entrega separa o controle administrativo do Duck dos materiais que podem ser compartilhados com clientes. O conteúdo do pacote de cliente é deliberadamente restrito.

| Área ou arquivo | Acesso do Duck | Acesso do cliente | Observação |
|---|---:|---:|---|
| Código-fonte `client/`, `server/`, `shared/`, `drizzle/` | Sim | Não | Exclusivo de desenvolvimento e administração. |
| Banco de dados e migrações | Sim | Não | Estrutura interna; nunca expor credenciais ou dados. |
| Painéis de CRM, crescimento, ativos, comércio e privacidade | Sim, com conta de proprietário | Não | Rotas protegidas e controles operacionais. |
| Portal de briefs, projetos, feedback e licenças | Sim | Sim, somente por conta autenticada e autorização | O cliente vê apenas seus próprios dados e ativos licenciados. |
| Manual operacional em PDF | Sim | Sim | Material informativo autorizado para compartilhamento. |
| Previews, recursos Windows e ativos licenciados | Sim | Somente quando publicados e autorizados | Não há arquivos comerciais reais incluídos nesta entrega. |
| Segredos, arquivos `.env`, logs, cookies, tokens e credenciais | Sim, apenas no ambiente seguro | Não | Excluídos de todos os ZIPs. |

## Pacotes incluídos

O pacote **Duck Control** contém o código-fonte e a documentação administrativa necessários para operar e evoluir o projeto. Ele não contém dependências instaladas, arquivos de build, logs, credenciais, dados de produção ou arquivos temporários.

O pacote **Client Materials** contém somente o manual premium e este mapa de acesso. Ele não contém código-fonte, ferramentas administrativas, dados de CRM, banco de dados, contratos internos, arquivos privados ou segredos.

## Conteúdo ainda não liberado

Portfólio real, previews de áudio, produtos, preços, termos de licença, recursos Windows e ativos licenciados ainda dependem de autorização e cadastro do Duck. Eles não foram incluídos nem simulados nos pacotes.
