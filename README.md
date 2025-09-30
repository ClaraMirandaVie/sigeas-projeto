# Sigeas-Projeto
# 📚 Sistema Escolar  

## Funcionalidades  

### 🔐 Login e autenticação (Admin, Professor, Aluno)  

#### 👤 Admin  
- Gerenciar turmas.  
- Gerenciar professores.  
- Gerenciar alunos.  

#### 👩‍🏫 Professor  
- Visualizar suas turmas.  
- Lançar chamadas e notas.  

#### 👨‍🎓 Aluno  
- Consultar suas notas.  
- Acompanhar sua frequência.  

---

## 👥 Usuários de Exemplo  

*Administrador:*  
- Usuário: admin  
- Senha: admin123  

*Professor:*  
- Usuário: prof.ana  
- Senha: ana123  

*Aluno:*  
- Usuário: aluno.joao  
- Senha: joao123  

---

## 🚀 Como Executar o Projeto  

1. Baixe ou clone este repositório:  
bash
git clone (nesse repositorio)

2. Instale as dependências na pasta do backend:
bash
npm i



## 🔎 Análise de Concorrentes

| Plataforma   | Visão Geral                                                                 | Pontos Fortes                                                                                          | Pontos Fracos                                                                                   | Funcionalidades Interessantes                                                |
|--------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| *Canvas LMS (Instructure)* | Amplamente adotado em educação básica e superior, com interface intuitiva, ecossistema de integrações e apps móveis. | - Grande comunidade e documentação.<br> - Usabilidade simples, app estável.<br> - Open-source, APIs e LTI. | - Configuração institucional exige equipe técnica.<br> - Analytics avançado depende de add-ons. | Assignments, Quizzes, Discussions, Mastery Paths. |
| *Docebo*   | Plataforma AI-first, voltada para educação corporativa, com automação e analytics robustos. | - Automação, certificações, gamificação.<br> - Advanced Analytics com previsões.<br> - Segurança corporativa (SSO, criptografia). | - Foco corporativo, menos adaptado a K-12.<br> - Custo mais alto que soluções open-source. | Jornadas automatizadas, marketplace de extensões, forecasting em analytics. |
| *Schoology* | LMS K-12 integrado ao PowerSchool, forte em comunicação entre escola e famílias. | - Integração com fluxos escolares e comunicação com pais.<br> - Repositório de recursos e currículo.<br> - Documentação consistente. | - Melhor experiência quando usado com PowerSchool.<br> - Performance limitada em cursos muito grandes. | Conexão com pais, colaboração docente, visão do progresso do aluno. |

### 📊 Comparação rápida com Google Classroom
- *Canvas*: mais completo e extensível, com trilhas de aprendizagem.  
- *Docebo*: analytics e automação além do modelo “sala de aula”.  
- *Schoology*: foco no dia a dia escolar com participação dos pais.

## 🎭 Criação de Personas

### 👩‍💼 Administrador — Usuário: admin | Senha: admin123

*Objetivos:*

- Padronizar currículos e trilhas; acompanhar métricas de engajamento e notas.

- Garantir acessibilidade e comunicação com famílias.

*Frustrações:*

- Relatórios fragmentados; difícil comparar turmas e professores.

- Integrações demoradas (chamada, notas, frequência).

*Necessidades no app:*

- ✅ Perfis e permissões.

- ✅ Gerenciar turmas.



### 👨‍🏫 Professor — Usuário: prof.ana | Senha: ana123

*Objetivos:*

- Publicar aulas, listas e quizzes rapidamente; acompanhar domínio por habilidade.

- Dar feedback ágil e reutilizar conteúdos entre turmas.

*Frustrações:*

- Subir provas e criar rubricas consome tempo.

- Dificuldade de ver quem está com dificuldades em tempo real.

*Necessidades no app:*

- ✅ Registrar chamada.

- ✅ Acompanhar alunos (notas/chamadas).



### 👩‍🎓 Aluno — Usuário: aluno.joao | Senha: joao123

*Objetivos:*

- Organizar estudos, acompanhar prazos, revisar conteúdos e simular provas.

Frustrações:

- Perde prazos quando as notificações são confusas.

- Aulas gravadas espalhadas.

Necessidades no app:

- ✅ Consultar notas.

- ✅ Acompanhar frequência.

## 🎨 Identidade Visual (Proposta)
## 🎨 Paleta (HEX)

### Primárias

- Baby Blue: #EAFBFF (ações principais, barras, links)

- Ivory: #FCF8F6 (backgrounds de seções, hover leve)

### Secundárias

- Teal Green: #00BBD1 (destaques acadêmicos, badges)

- Coral: #FFA0A3 (atalhos/indicadores informativos)

### Neutros

- Dark Blue: #050A30 (títulos)

- Midnight: #003D7A (texto secundário)

- Pewter: #96A1A8 (cards, superfícies)

- Branco: #FFFFFF

### Feedback/Estado

- Sucesso: #B4F8C8

- Alerta: #FEDE00

- Erro: #FF424E

- Info: #FFA0A3

### ✍️ Tipografia

- Interface/Texto corrido: Inter (sans-serif, alta legibilidade)

- Destaques/Headers opcionais: Source Sans 3 ou Poppins (boa hierarquia e peso variável)

## 💡 Justificativa de Design

*Por que essa paleta?*
- As cores escolhidas passam uma sensação de calma e confiança, que é superimportante em qualquer ambiente de estudo.

- O azul bebê #EAFBFF dá ideia de leveza e organização.

- O ivory #FCF8F6 deixa o fundo mais suave, sem cansar os olhos.

- O teal green #00BBD1 destaca conquistas e coisas importantes.

- O coral #FFA0A3 chama atenção de forma amigável, ideal para avisos rápidos.

- As cores neutras equilibram tudo e deixam o conteúdo em primeiro plano.

- As cores de feedback ajudam a entender rapidamente o que está acontecendo.

### Por que essas fontes?
A Inter foi escolhida porque é fácil de ler na tela, mesmo em listas pequenas.
Para títulos, o uso de Source Sans 3 ou Poppins traz modernidade sem perder clareza.

## 🎯 Relação com os objetivos pedagógicos

- O design foi pensado para ser bonito, mas principalmente funcional.

- As cores e fontes mantêm a atenção no conteúdo.

- O contraste entre tons claros e escuros facilita a leitura em celulares ou projetores.

- O ambiente digital se torna mais leve, organizado e fácil de navegar.
