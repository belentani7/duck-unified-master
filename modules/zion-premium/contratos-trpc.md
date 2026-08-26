# Contratos tRPC do Studio

| Procedimento | Acesso | Entrada | Resultado |
|---|---|---|---|
| `duckStudio.getProjects` | Autenticado | Nenhuma | Projetos do proprietário ordenados por criação. |
| `duckStudio.createProject` | Autenticado | Nome, artista, BPM, tonalidade e gênero validados. | Projeto persistido e evento de auditoria. |
| `duckStudio.getStems` | Autenticado | `projectId` positivo. | Stems do projeto se ele pertence ao usuário. |
| `duckStudio.uploadStem` | Autenticado | Projeto, nome, MIME e base64 validados. | Stem armazenado, metadados persistidos e link derivado. |
| `duckStudio.updateStemStatus` | Autenticado | Identificador, estado e nota opcional. | Estado revisado e auditado. |
| `duckStudio.getComments` | Autenticado | `projectId` positivo. | Comentários temporizados do projeto autorizado. |
| `duckStudio.addComment` | Autenticado | Projeto, autor, conteúdo e timestamp. | Comentário persistido e auditado. |
| `duckStudio.getAuditLogs` | Autenticado | Nenhuma | Auditoria do proprietário. |
| `duckStudio.getPlugins` | Público | Nenhuma | Catálogo de referências legais. |
| `duckStudio.aiChat` | Público | Mensagem, idioma e histórico opcional. | Resposta local com `mode: local-rule-based`. |

Os procedimentos privados retornam `NOT_FOUND` quando um recurso não pertence ao usuário, evitando confirmar a existência de um projeto de terceiros. Falhas de banco retornam `SERVICE_UNAVAILABLE`; entradas inválidas são rejeitadas pelo contrato Zod ou por erro `BAD_REQUEST` específico.
