# Curadoria externa para Duck Studio

## Decisão de adoção

Os recursos abaixo foram avaliados para resolver capacidades concretas. Eles **não** foram instalados, baixados nem acionados na plataforma nesta etapa. A adoção deve passar por revisão de versão, compatibilidade, licença e bateria de testes quando o proprietário autorizar a validação final.

| Prioridade | Recurso | Origem | Uso proposto | Estado | Condição de ativação |
|---|---|---|---|---|---|
| P1 | [music-metadata](https://github.com/Borewit/music-metadata) | GitHub, MIT | Extrair duração, bitrate e tags no envio de arquivo real. | Selecionado | Adicionar dependência, validar formatos e registrar os metadados sem alterar o arquivo. |
| P1 | [Tone.js](https://github.com/Tonejs/Tone.js) | GitHub, MIT | Prévia, metrônomo e interação sonora no navegador. | Selecionado | Incluir somente após previews próprios autorizados e revisão de carregamento/performance. |
| P2 | [audioFlux](https://github.com/libAudioFlux/audioFlux) | GitHub, MIT | Análise offline de características para BPM, tonalidade e classificação. | Selecionado para ambiente separado | Requer serviço de processamento fora do runtime atual e política para arquivos enviados. |
| P2 | [PDMX](https://huggingface.co/papers/2409.10831) | Hugging Face / pesquisa | Referência de estruturas MusicXML de domínio público em pesquisa de MIDI. | Selecionado para pesquisa | Usar apenas em experimento isolado; não redistribuir, não usar como catálogo e não alegar autoria. |
| P3 | [Dados abertos BCB](https://opendata.bcb.gov.br/en/dataset/?res_format=API) | Banco Central do Brasil | Contexto agregado opcional, com fonte e data. | Selecionado com limites | Consumir somente séries públicas agregadas; nunca perfil individual, pagamento ou recomendação financeira. |
| P0 — bloqueado | [Open Finance Brasil](https://www.bcb.gov.br/en/financialstability/open_finance) | Banco Central do Brasil | Referência para arquitetura de consentimento e governança. | Não integrar diretamente | Exige participante regulado/parceiro, consentimento, autenticação, confirmação e compliance aplicável. |
| P0 — excluído | [Stable Audio Open 1.0](https://huggingface.co/stabilityai/stable-audio-open-1.0) | Hugging Face | Geração de áudio. | Excluído | Uso comercial depende de licença específica; não incorporar sem avaliação contratual e infraestrutura apropriada. |

## Recursos explicitamente não aproveitados

> Não serão baixados corpus, samples, vozes, loops, faixas, modelos sem licença comercial clara nem código que exija credenciais de terceiros ou execução persistente não suportada.

A página oficial do Open Finance Brasil afirma que o compartilhamento de dados e serviços é realizado a critério do cliente e depende de consentimento prévio, livre e informado, que pode ser revogado. Além disso, apenas instituições supervisionadas participam diretamente do ecossistema.[1] Dessa forma, o produto não tratará Open Finance como fonte de “ativos” ou acesso bancário reutilizável.

## Roteiro de ativação

1. O proprietário envia conteúdos próprios e autoriza seus usos.
2. O gestor de ativos calcula hash e preserva inventário; o catálogo liga produto, licença e arquivo.
3. Depois de haver previews e termos reais, a equipe escolhe uma integração P1 e executa testes de segurança, formato e desempenho.
4. Recursos P2 só entram em serviço separado, com orçamento, observabilidade e política de retenção de arquivos.
5. A conexão financeira permanece desativada até existência de parceiro regulado, consentimento verificável e fluxo de aprovação humana.

## Preparação implementada

O painel do proprietário agora expõe um registro de adaptadores externos. Todos começam desativados, sem segredos, sem chamadas remotas e sem tratamento de dados financeiros pessoais. Cada adaptador apresenta estado e checklist de ativação; o registro é somente administrativo até que uma integração seja formalmente aprovada.

## Referências

[1] [Banco Central do Brasil — Open Finance](https://www.bcb.gov.br/en/financialstability/open_finance)

[2] [GitHub — music-metadata](https://github.com/Borewit/music-metadata)

[3] [GitHub — Tone.js](https://github.com/Tonejs/Tone.js)

[4] [GitHub — audioFlux](https://github.com/libAudioFlux/audioFlux)

[5] [Hugging Face — PDMX](https://huggingface.co/papers/2409.10831)

[6] [Hugging Face — Stable Audio Open 1.0](https://huggingface.co/stabilityai/stable-audio-open-1.0)

[7] [Portal de Dados Abertos do Banco Central](https://opendata.bcb.gov.br/en/dataset/?res_format=API)
