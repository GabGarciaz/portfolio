# Projetos de programação e automação (InterMed, set a out de 2026)

Ordem sugerida de destaque: 1, 2, 3, 4, 5. Os outros servem de lista complementar.

---

## 1. InterMedFit: app de emagrecimento com assistente de IA
**Slug sugerido:** `intermedfit-app`

**Resumo:** app web instalável (PWA) de emagrecimento da InterMed, com plano de alimentação e treino personalizado, uma assistente de IA chamada Nina e assinatura mensal.

**Desafio:** transformar uma clínica de cirurgia plástica em uma marca de acompanhamento contínuo, com um produto digital que a pessoa usa todo dia e que a equipe consegue manter sem programador.

**Solução:**
- Quiz de entrada que monta o plano: objetivo, rotina, restrições (diabetes, pressão, vegano, uso de caneta para emagrecer) e local de treino.
- Nina, assistente de IA que troca receitas, ajusta a meta de água pelo peso, manda mensagens no momento certo e ensina quem não tem intimidade com tecnologia. Toda mudança no plano passa por confirmação da pessoa.
- "Meu corpo": IMC, massa magra, massa gorda e avaliação corporal guiada.
- Treino em tela cheia com mais de 40 vídeos de exercício gerados por IA, com versão feminina e masculina.
- Clube de benefícios, programa "Traga uma amiga" (50% de desconto por amiga que assina) e plano Black.
- Captação de contato no quiz e medição do funil da landing até a assinatura.
- Pacote Android pronto para a Google Play e material completo das lojas (descrição, capturas, segurança dos dados).

**Tecnologias:** PHP 8, SQLite, JavaScript puro, Service Worker (offline), API da Anthropic (Claude) para a Nina, Mercado Pago (assinatura), Bubblewrap/TWA para Android, Playwright para testes.

**Números para citar:** mais de 15 baterias de testes automáticos, mais de 40 vídeos de exercício, landing com versão 3D no computador e versão leve no celular.

---

## 2. Painel de Marketing com o Cometa, assistente de voz estilo "Jarvis"
**Slug sugerido:** `intermed-marketing-cometa`

**Resumo:** painel que reúne todos os perfis da empresa (Instagram, TikTok, YouTube e Facebook) e um assistente de IA com voz, o Cometa, que entende a empresa inteira e orquestra o marketing.

**Desafio:** a equipe de marketing não programa, e precisava de um lugar só para ver números, ter ideias, produzir vídeo e agendar posts sem trocar de ferramenta.

**Solução:**
- Visão geral dos perfis, detalhe por post nos últimos 90 dias, mapa de calor do melhor dia e horário e previsão de seguidores com faixa de certeza.
- Central em estilo HUD com um núcleo 3D de partículas que se espalha quando alguém fala e quando o Cometa responde.
- Voz: escuta pelo microfone e responde falando.
- O Cometa lê os números do painel, pesquisa tendências e reels de referência na internet, escreve roteiros com as skills de conteúdo, monta cronogramas e agenda posts.
- Base de conhecimento da empresa inteira e leitura dos números de tráfego e vendas em totais.
- Fila de publicação com aprovação humana obrigatória: o post só sai depois de um administrador aprovar, por clique ou por voz, com trilha de auditoria e proteção contra publicação duplicada.
- Publicação automática no Instagram pela Graph API.

**Tecnologias:** PHP, JavaScript puro, Three.js, Web Speech API, Web Audio, API da Anthropic com ferramentas (tool use e web search), Meta Graph API.

---

## 3. Fábrica de vídeos motion por código
**Slug sugerido:** `intermed-motion-codigo`

**Resumo:** sistema que transforma um roteiro em vídeo vertical pronto para Reels: animação, legenda palavra por palavra, narração e trilha, tudo gerado por código.

**Solução:**
- Cenas em HTML e GSAP, gravadas quadro a quadro num navegador sem tela e montadas em MP4.
- Narração automática, mixagem com volume padrão de rede social e conferência automática de zona segura (nada fica embaixo dos botões do Instagram).
- Versão em servidor: a IA escreve o roteiro, a equipe confere uma folha de quadros e aprova, e o servidor renderiza sozinho. O vídeo pronto pode ir direto para a fila de posts.
- Reels no estilo dos vídeos de referência mais vistos do nicho, analisados quadro a quadro antes.

**Tecnologias:** HTML, GSAP, Playwright, FFmpeg, Python, edge-tts, API da Anthropic, systemd.

---

## 4. Atribuição de vendas: de qual anúncio veio cada venda
**Slug sugerido:** `intermed-origem-vendas`

**Resumo:** cruzamento automático entre as conversas de WhatsApp vindas dos anúncios e as planilhas de fechamento das consultoras, para saber qual anúncio, qual canal orgânico e qual consultora vendeu.

**Desafio:** todos os anúncios são de clique para WhatsApp, então ferramentas comuns de rastreio (UTM) não funcionavam.

**Solução:** leitura das planilhas, casamento por telefone com casos "a conferir" para revisão humana, separação entre valor contratado, valor pago e valor recebido, aba do anúncio que está rodando e um vigia que confere de hora em hora se as planilhas, o CRM e os robôs estão funcionando e avisa a equipe no WhatsApp.

**Tecnologias:** PHP, Python, Google Sheets, Meta Marketing API, cron.

---

## 5. Robôs de WhatsApp e escritório virtual da equipe
**Slug sugerido:** `intermed-robos-escritorio`

**Resumo:** robôs que dão boas-vindas e postam em grupos de leads, um robô de vendas que convida leads quentes com teto diário e freio automático por pedidos de saída, e um "escritório virtual" na TV da equipe que comemora cada venda.

**Tecnologias:** Python, Docker, Evolution API (WhatsApp), Postgres, Redis, ponte segura com o site sem abrir porta no servidor.

---

## Projetos complementares
- **Site institucional com 3D:** nó dourado em 3D que acompanha a rolagem só no computador e versão leve no celular (a página caiu de 4,3 MB para 2,0 MB no celular).
- **Jornada "Monte seu projeto":** carrinho de procedimentos, quiz por procedimento, reserva da avaliação e pagamento por Pix ou cartão.
- **Chat de atendimento do site** com painel da equipe, avisos sonoros e limites contra abuso.
- **Portal do paciente (acompanhar pedido)** sem login por CPF.
- **Linkbio com formulário** que direciona cada lead para o grupo certo.
- **QR code rastreado por embaixador** do programa de indicação.
