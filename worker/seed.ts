// Date inițiale: se scriu în KV doar la prima citire, dacă colecția nu există încă.
// Nu e servit public (e doar în codul Worker-ului).
export const SEED_LEADS: Record<string, unknown>[] = [
 {
  "name": "Le Caramel – Cofetărie Artizanală",
  "category": "Cofetărie",
  "city": "Constanța",
  "address": "Str. Pescarilor 39",
  "phone": "0733 518 250",
  "website": "",
  "score": 8,
  "status": "nou",
  "owner": "amandoi",
  "next_step": "Vizită în persoană, discuție cu proprietarul",
  "pitch": "Galerie cu torturi + formular de comandă tort personalizat (dată, porții, aromă, upload poză inspirație).",
  "notes": "Comenzile de torturi se fac acum trimițând poze pe chat (din recenzii). Verifică pe Google Maps dacă au buton Website.",
  "source": "Google Maps + cercetare Claude, 1 nov 2026"
 },
 {
  "name": "Pensiunea Alfa Mamaia Nord",
  "category": "Pensiune",
  "city": "Mamaia Nord",
  "address": "Bd. Mamaia Nord 32D",
  "phone": "0722 670 492",
  "website": "",
  "score": 8,
  "status": "nou",
  "owner": "amandoi",
  "next_step": "Sună acum, în extrasezon",
  "pitch": "Site RO + EN cu rezervare directă, poze piscină și vedere la lac; economisesc comisionul Booking.",
  "notes": "Pensiune premium de familie: piscină, loc de joacă, mic dejun gătit pe loc; recenziile o compară cu hoteluri de 5★. Apare doar pe platforme (Tripadvisor).",
  "source": "Google Maps + cercetare Claude, 1 nov 2026"
 },
 {
  "name": "Pensiunea Daiana",
  "category": "Pensiune",
  "city": "Mamaia-Sat",
  "address": "Mamaia-Sat",
  "phone": "0731 375 641",
  "website": "",
  "score": 7,
  "status": "nou",
  "owner": "amandoi",
  "next_step": "Telefon",
  "pitch": "Site simplu cu poze, prețuri și formular de rezervare, ca oaspeții care revin să rezerve direct.",
  "notes": "Oaspeți fideli (unii vin al 5-lea an), deschis și iarna.",
  "source": "Google Maps + cercetare Claude, 1 nov 2026"
 },
 {
  "name": "Miss Baker Studio",
  "category": "Cofetărie",
  "city": "Constanța",
  "address": "Bd. Mamaia 70, Bl. I1, parter",
  "phone": "0764 165 014",
  "website": "",
  "score": 7,
  "status": "nou",
  "owner": "amandoi",
  "next_step": "Vizită în persoană cu demo Enza's Bakery",
  "pitch": "Meniu online mereu actualizat + formular de comandă torturi.",
  "notes": "600+ recenzii, comenzi de torturi aniversare, produsele se schimbă (clienții cer înapoi un tort scos din meniu).",
  "source": "Google Maps + cercetare Claude, 1 nov 2026"
 },
 {
  "name": "Patrick's Bakery",
  "category": "Cafenea / patiserie",
  "city": "Constanța",
  "address": "Bd. Mamaia 270",
  "phone": "0721 131 452",
  "website": "",
  "score": 7,
  "status": "nou",
  "owner": "amandoi",
  "next_step": "Vizită, proprietarul e prietenos",
  "pitch": "Site cu meniu și formular de comandă, pentru localnici și turiștii din Mamaia.",
  "notes": "Firma Patrick's Cake Shop SRL, fără site găsit. Recenzii: „cea mai bună cafenea din Constanța”.",
  "source": "Google Maps + cercetare Claude, 1 nov 2026"
 },
 {
  "name": "Black Beauty Salon",
  "category": "Salon înfrumusețare",
  "city": "Constanța",
  "address": "Str. Avram Iancu 63",
  "phone": "0727 039 202",
  "website": "",
  "score": 6,
  "status": "nou",
  "owner": "amandoi",
  "next_step": "Telefon / vizită",
  "pitch": "Site cu profiluri stiliști, listă de prețuri și programare online pe stilist.",
  "notes": "Clientele vin pentru stiliste anume (Ruslana, Camelia).",
  "source": "Google Maps + cercetare Claude, 1 nov 2026"
 },
 {
  "name": "Diagnoză, deblocări auto și codări RXB",
  "category": "Service auto",
  "city": "Constanța",
  "address": "Str. Merișor 29",
  "phone": "0766 243 325",
  "website": "",
  "score": 6,
  "status": "nou",
  "owner": "amandoi",
  "next_step": "Telefon",
  "pitch": "Site de o pagină: servicii, mărci, buton de apel; ca să apară mai sus pe Google.",
  "notes": "Rating 5.0; un client din București l-a găsit pe Google, deci oamenii caută online.",
  "source": "Google Maps + cercetare Claude, 1 nov 2026"
 },
 {
  "name": "Vulcanizare Auto8CLM (mobilă)",
  "category": "Vulcanizare",
  "city": "Constanța",
  "address": "Bd. Aurel Vlaicu 215",
  "phone": "0790 842 932",
  "website": "",
  "score": 5,
  "status": "nou",
  "owner": "amandoi",
  "next_step": "Telefon, abordare cu tact",
  "pitch": "Catalog online cu anvelopele din stoc (poze, dimensiuni, prețuri).",
  "notes": "Recenzii negative că nu trimit poze/detalii la anvelope second-hand. Prezintă ca „mai mulți clienți”, nu „aveți recenzii proaste”.",
  "source": "Google Maps + cercetare Claude, 1 nov 2026"
 }
];

// Lista de pe github.com/ComposioHQ/awesome-claude-skills (1 nov 2026)
export const SEED_SKILLS: Record<string, unknown>[] = [
 {
  "name": "docx",
  "category": "Document Processing",
  "url": "https://github.com/anthropics/skills/tree/main/skills/docx",
  "description": "Create, edit, analyze Word docs with tracked changes, comments, formatting.",
  "status": "avem_deja",
  "notes": "E deja inclus în Claude."
 },
 {
  "name": "pdf",
  "category": "Document Processing",
  "url": "https://github.com/anthropics/skills/tree/main/skills/pdf",
  "description": "Extract text, tables, metadata, merge & annotate PDFs.",
  "status": "avem_deja",
  "notes": "E deja inclus în Claude."
 },
 {
  "name": "pptx",
  "category": "Document Processing",
  "url": "https://github.com/anthropics/skills/tree/main/skills/pptx",
  "description": "Read, generate, and adjust slides, layouts, templates.",
  "status": "avem_deja",
  "notes": "E deja inclus în Claude."
 },
 {
  "name": "xlsx",
  "category": "Document Processing",
  "url": "https://github.com/anthropics/skills/tree/main/skills/xlsx",
  "description": "Spreadsheet manipulation: formulas, charts, data transformations.",
  "status": "avem_deja",
  "notes": "E deja inclus în Claude."
 },
 {
  "name": "Markdown to EPUB Converter",
  "category": "Document Processing",
  "url": "https://github.com/smerchek/claude-epub-skill",
  "description": "Converts markdown documents and chat summaries into professional EPUB ebook files.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Master Claude for Legal",
  "category": "Document Processing",
  "url": "https://github.com/sboghossian/master-claude-for-legal",
  "description": "Skill pack for legal teams. NDA triage, multi-party version diff, citation verifier, meeting brief, and the Friday-newsletter status synthesis pattern. Includes 10 reference docs (privilege, verification, long…",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "artifacts-builder",
  "category": "Development & Code Tools",
  "url": "https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder",
  "description": "Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui).",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "aws-skills",
  "category": "Development & Code Tools",
  "url": "https://github.com/zxkane/aws-skills",
  "description": "AWS development with CDK best practices, cost optimization MCP servers, and serverless/event-driven architecture patterns.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "building-blog",
  "category": "Development & Code Tools",
  "url": "https://github.com/BuildShipGrowRepeat/nextjs-sanity-blog-skill",
  "description": "Adds an SEO-first, i18n-ready blog to a Next.js + Sanity site via a 40-question intake, a one-page plan, and a 20-section spec. Includes a generator for AI hero images via Gemini 3 Pro Image (Nano Banana Pro).",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Changelog Generator",
  "category": "Development & Code Tools",
  "url": "./changelog-generator/",
  "description": "Automatically creates user-facing changelogs from git commits by analyzing history and transforming technical commits into customer-friendly release notes.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Chrome Relay",
  "category": "Development & Code Tools",
  "url": "https://chrome-relay.kushalsm.com/",
  "description": "Drives the user's already-open Chrome session — cookies, SSO, extensions, localhost — through a local CLI bridge. Real-Chrome counterpart to Playwright Browser Automation; install via npx skills add chrome-relay + a…",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Claude Code Terminal Title",
  "category": "Development & Code Tools",
  "url": "https://github.com/bluzername/claude-code-terminal-title",
  "description": "Gives each Claud-Code terminal window a dynamic title that describes the work being done so you don't lose track of what window is doing what.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Connect",
  "category": "Development & Code Tools",
  "url": "./connect/",
  "description": "Connect Claude to any app. Send emails, create issues, post messages, update databases - take real actions across Gmail, Slack, GitHub, Notion, and 1000+ services.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "D3.js Visualization",
  "category": "Development & Code Tools",
  "url": "https://github.com/chrisvoncsefalvay/claude-d3js-skill",
  "description": "Teaches Claude to produce D3 charts and interactive data visualizations.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "FFUF Web Fuzzing",
  "category": "Development & Code Tools",
  "url": "https://github.com/jthack/ffuf_claude_skill",
  "description": "Integrates the ffuf web fuzzer so Claude can run fuzzing tasks and analyze results for vulnerabilities.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "finishing-a-development-branch",
  "category": "Development & Code Tools",
  "url": "https://github.com/obra/superpowers/tree/main/skills/finishing-a-development-branch",
  "description": "Guides completion of development work by presenting clear options and handling chosen workflow.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Full-Page Screenshot",
  "category": "Development & Code Tools",
  "url": "https://github.com/LewisLiu007/full-page-screenshot",
  "description": "Captures full-page screenshots of web pages via Chrome DevTools Protocol with zero dependencies.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "great_cto",
  "category": "Development & Code Tools",
  "url": "https://github.com/avelikiy/great_cto",
  "description": "Claude Code plugin: 7 specialised subagents (tech-lead, senior-dev, qa-engineer, security-officer, devops, l3-support, project-auditor) orchestrating a full SDLC pipeline — architecture, TDD, 12-angle code review,…",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "iOS Simulator",
  "category": "Development & Code Tools",
  "url": "https://github.com/conorluddy/ios-simulator-skill",
  "description": "Enables Claude to interact with iOS Simulator for testing and debugging iOS applications.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "jules",
  "category": "Development & Code Tools",
  "url": "https://github.com/sanjay3290/ai-skills/tree/main/skills/jules",
  "description": "Delegate coding tasks to Google Jules AI agent for async bug fixes, documentation, tests, and feature implementation on GitHub repos.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "LangSmith Fetch",
  "category": "Development & Code Tools",
  "url": "./langsmith-fetch/",
  "description": "Debug LangChain and LangGraph agents by automatically fetching and analyzing execution traces from LangSmith Studio. First AI observability skill for Claude Code.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "lean-ctx",
  "category": "Development & Code Tools",
  "url": "https://github.com/yvgude/lean-ctx",
  "description": "MCP server and context runtime for AI coding agents: session caching, AST-aware compression, and 90+ shell patterns to reduce token usage. Supports Claude Code, Cursor, Copilot, and other integrations. Install the…",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "MCP Builder",
  "category": "Development & Code Tools",
  "url": "./mcp-builder/",
  "description": "Guides creation of high-quality MCP (Model Context Protocol) servers for integrating external APIs and services with LLMs using Python or TypeScript.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "move-code-quality-skill",
  "category": "Development & Code Tools",
  "url": "https://github.com/1NickPappas/move-code-quality-skill",
  "description": "Analyzes Move language packages against the official Move Book Code Quality Checklist for Move 2024 Edition compliance and best practices.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "OpenWeb",
  "category": "Development & Code Tools",
  "url": "https://github.com/openweb-org/openweb",
  "description": "Agent-native way to access any website. Calls the same APIs the website calls (JSON in, JSON out) with auth (cookies, JWT, CSRF, signing) auto-resolved per request. 90+ sites built in.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "overkill",
  "category": "Development & Code Tools",
  "url": "https://github.com/santiago-vargas-de-kruijf/claude-overkill",
  "description": "Surfaces advanced, maximalist alternatives to whatever solution is being discussed — advanced data structures, distributed-systems algorithms, niche frameworks, design patterns, and frontier tooling — each ranked on…",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Playwright Browser Automation",
  "category": "Development & Code Tools",
  "url": "https://github.com/lackeyjb/playwright-skill",
  "description": "Model-invoked Playwright automation for testing and validating web applications.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "prompt-engineering",
  "category": "Development & Code Tools",
  "url": "https://github.com/NeoLabHQ/context-engineering-kit/tree/master/plugins/customaize-agent/skills/prompt-engineering",
  "description": "Teaches well-known prompt engineering techniques and patterns, including Anthropic best practices and agent persuasion principles.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "pypict-claude-skill",
  "category": "Development & Code Tools",
  "url": "https://github.com/omkamal/pypict-claude-skill",
  "description": "Design comprehensive test cases using PICT (Pairwise Independent Combinatorial Testing) for requirements or code, generating optimized test suites with pairwise coverage.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "reddit-fetch",
  "category": "Development & Code Tools",
  "url": "https://github.com/ykdojo/claude-code-tips/tree/main/skills/reddit-fetch",
  "description": "Fetches Reddit content via Gemini CLI when WebFetch is blocked or returns 403 errors.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Septim Agents Pack",
  "category": "Development & Code Tools",
  "url": "https://septimlabs.com/tools/agents?utm_source=awesome-claude-skills&utm_medium=awesome-list&utm_campaign=oss-backlink",
  "description": "10 named Claude Code sub-agents (Atlas, Luca, Canon, Ember, Tally, Nova, Ward, Mira, Juno, Pip) covering planning, architecture, brand, marketing, finance, design, legal, customer, research, and coordination. Drop…",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Skill Creator",
  "category": "Development & Code Tools",
  "url": "./skill-creator/",
  "description": "Provides guidance for creating effective Claude Skills that extend capabilities with specialized knowledge, workflows, and tool integrations.",
  "status": "avem_deja",
  "notes": "E deja inclus în Claude."
 },
 {
  "name": "Skill Seekers",
  "category": "Development & Code Tools",
  "url": "https://github.com/yusufkaraaslan/Skill_Seekers",
  "description": "Automatically converts any documentation website into a Claude AI skill in minutes.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "software-architecture",
  "category": "Development & Code Tools",
  "url": "https://github.com/NeoLabHQ/context-engineering-kit/tree/master/plugins/ddd/skills/software-architecture",
  "description": "Implements design patterns including Clean Architecture, SOLID principles, and comprehensive software design best practices.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "subagent-driven-development",
  "category": "Development & Code Tools",
  "url": "https://github.com/NeoLabHQ/context-engineering-kit/tree/master/plugins/sadd/skills/subagent-driven-development",
  "description": "Dispatches independent subagents for individual tasks with code review checkpoints between iterations for rapid, controlled development.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "test-driven-development",
  "category": "Development & Code Tools",
  "url": "https://github.com/obra/superpowers/tree/main/skills/test-driven-development",
  "description": "Use when implementing any feature or bugfix, before writing implementation code.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "using-git-worktrees",
  "category": "Development & Code Tools",
  "url": "https://github.com/obra/superpowers/blob/main/skills/using-git-worktrees/",
  "description": "Creates isolated git worktrees with smart directory selection and safety verification.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Webapp Testing",
  "category": "Development & Code Tools",
  "url": "./webapp-testing/",
  "description": "Tests local web applications using Playwright for verifying frontend functionality, debugging UI behavior, and capturing screenshots.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "CSV Data Summarizer",
  "category": "Data & Analysis",
  "url": "https://github.com/coffeefuelbump/csv-data-summarizer-claude-skill",
  "description": "Automatically analyzes CSV files and generates comprehensive insights with visualizations without requiring user prompts.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "deep-research",
  "category": "Data & Analysis",
  "url": "https://github.com/sanjay3290/ai-skills/tree/main/skills/deep-research",
  "description": "Execute autonomous multi-step research using Gemini Deep Research Agent for market analysis, competitive landscaping, and literature reviews.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "postgres",
  "category": "Data & Analysis",
  "url": "https://github.com/sanjay3290/ai-skills/tree/main/skills/postgres",
  "description": "Execute safe read-only SQL queries against PostgreSQL databases with multi-connection support and defense-in-depth security.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "recursive-research",
  "category": "Data & Analysis",
  "url": "https://github.com/Anjos2/recursive-research",
  "description": "Recursive research up to PhD level across any domain (science, tech, business, arts, humanities) with source tiering, WDM + Munger inversion for autonomous decisions, and disk checkpointing to survive context compaction.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "root-cause-tracing",
  "category": "Data & Analysis",
  "url": "https://github.com/obra/superpowers/tree/main/skills/root-cause-tracing",
  "description": "Use when errors occur deep in execution and you need to trace back to find the original trigger.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Brand Build Skills",
  "category": "Business & Marketing",
  "url": "https://github.com/rampstackco/claude-skills",
  "description": "59-skill library covering the full website lifecycle: brand, design, content, SEO, dev, ops, growth, and research. Stack-agnostic with an Ahrefs MCP-powered SEO audit suite. Includes a meta-skill for writing your own.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Brand Guidelines",
  "category": "Business & Marketing",
  "url": "./brand-guidelines/",
  "description": "Applies Anthropic's official brand colors and typography to artifacts for consistent visual identity and professional design standards.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Competitive Ads Extractor",
  "category": "Business & Marketing",
  "url": "./competitive-ads-extractor/",
  "description": "Extracts and analyzes competitors' ads from ad libraries to understand messaging and creative approaches that resonate.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "Domain Name Brainstormer",
  "category": "Business & Marketing",
  "url": "./domain-name-brainstormer/",
  "description": "Generates creative domain name ideas and checks availability across multiple TLDs including .com, .io, .dev, and .ai extensions.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "Internal Comms",
  "category": "Business & Marketing",
  "url": "./internal-comms/",
  "description": "Helps write internal communications including 3P updates, company newsletters, FAQs, status reports, and project updates using company-specific formats.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Lead Research Assistant",
  "category": "Business & Marketing",
  "url": "./lead-research-assistant/",
  "description": "Identifies and qualifies high-quality leads by analyzing your product, searching for target companies, and providing actionable outreach strategies.",
  "status": "instalat",
  "notes": "Salvat în contul lui Vladimir pe 1 nov 2026."
 },
 {
  "name": "article-extractor",
  "category": "Communication & Writing",
  "url": "https://github.com/michalparkola/tapestry-skills-for-claude-code/tree/main/article-extractor",
  "description": "Extract full article text and metadata from web pages.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "brainstorming",
  "category": "Communication & Writing",
  "url": "https://github.com/obra/superpowers/tree/main/skills/brainstorming",
  "description": "Transform rough ideas into fully-formed designs through structured questioning and alternative exploration.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "Content Research Writer",
  "category": "Communication & Writing",
  "url": "./content-research-writer/",
  "description": "Assists in writing high-quality content by conducting research, adding citations, improving hooks, and providing section-by-section feedback.",
  "status": "instalat",
  "notes": "Salvat în contul lui Vladimir pe 1 nov 2026."
 },
 {
  "name": "family-history-research",
  "category": "Communication & Writing",
  "url": "https://github.com/emaynard/claude-family-history-research-skill",
  "description": "Provides assistance with planning family history and genealogy research projects.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Meeting Insights Analyzer",
  "category": "Communication & Writing",
  "url": "./meeting-insights-analyzer/",
  "description": "Analyzes meeting transcripts to uncover behavioral patterns including conflict avoidance, speaking ratios, filler words, and leadership style.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "NotebookLM Integration",
  "category": "Communication & Writing",
  "url": "https://github.com/PleasePrompto/notebooklm-skill",
  "description": "Lets Claude Code chat directly with NotebookLM for source-grounded answers based exclusively on uploaded documents.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Twitter Algorithm Optimizer",
  "category": "Communication & Writing",
  "url": "./twitter-algorithm-optimizer/",
  "description": "Analyze and optimize tweets for maximum reach using Twitter's open-source algorithm insights. Rewrite and edit tweets to improve engagement and visibility.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "anydesign",
  "category": "Creative & Media",
  "url": "https://github.com/uxKero/anydesign",
  "description": "Analyzes any image, URL, or Figma file and generates a structured design.md with the full design system, component inventory, and reconstruction notes — portable to v0, Lovable, Cursor or any AI builder.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "Canvas Design",
  "category": "Creative & Media",
  "url": "./canvas-design/",
  "description": "Creates beautiful visual art in PNG and PDF documents using design philosophy and aesthetic principles for posters, designs, and static pieces.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "imagen",
  "category": "Creative & Media",
  "url": "https://github.com/sanjay3290/ai-skills/tree/main/skills/imagen",
  "description": "Generate images using Google Gemini's image generation API for UI mockups, icons, illustrations, and visual assets.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Image Enhancer",
  "category": "Creative & Media",
  "url": "./image-enhancer/",
  "description": "Improves image and screenshot quality by enhancing resolution, sharpness, and clarity for professional presentations and documentation.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "Slack GIF Creator",
  "category": "Creative & Media",
  "url": "./slack-gif-creator/",
  "description": "Creates animated GIFs optimized for Slack with validators for size constraints and composable animation primitives.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Theme Factory",
  "category": "Creative & Media",
  "url": "./theme-factory/",
  "description": "Applies professional font and color themes to artifacts including slides, docs, reports, and HTML landing pages with 10 pre-set themes.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "Video Downloader",
  "category": "Creative & Media",
  "url": "./video-downloader/",
  "description": "Downloads videos from YouTube and other platforms for offline viewing, editing, or archival with support for various formats and quality options.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "youtube-transcript",
  "category": "Creative & Media",
  "url": "https://github.com/michalparkola/tapestry-skills-for-claude-code/tree/main/youtube-transcript",
  "description": "Fetch transcripts from YouTube videos and prepare summaries.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "swiftui-design-skill",
  "category": "Creative & Media",
  "url": "https://github.com/wholiver/swiftui-design-skill",
  "description": "SwiftUI 前端设计 skill — 反 AI Slop 六条铁律、设计方向顾问、品牌资产协议、五维评审。支持 Claude Code / Cursor / Codex / OpenCode 等全部 AI agent 平台。",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Pixelbin-Media-Generation",
  "category": "Creative & Media",
  "url": "https://github.com/anandpareek-hub/pixelbin-claude-skill",
  "description": "Generate and edit images & videos with 85+ API portfolio and build visually appealing website pages",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "File Organizer",
  "category": "Productivity & Organization",
  "url": "./file-organizer/",
  "description": "Intelligently organizes files and folders by understanding context, finding duplicates, and suggesting better organizational structures.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Invoice Organizer",
  "category": "Productivity & Organization",
  "url": "./invoice-organizer/",
  "description": "Automatically organizes invoices and receipts for tax preparation by reading files, extracting information, and renaming consistently.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "kaizen",
  "category": "Productivity & Organization",
  "url": "https://github.com/NeoLabHQ/context-engineering-kit/tree/master/plugins/kaizen/skills/kaizen",
  "description": "Applies continuous improvement methodology with multiple analytical approaches, based on Japanese Kaizen philosophy and Lean methodology.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "n8n-skills",
  "category": "Productivity & Organization",
  "url": "https://github.com/haunchen/n8n-skills",
  "description": "Enables AI assistants to directly understand and operate n8n workflows.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Raffle Winner Picker",
  "category": "Productivity & Organization",
  "url": "./raffle-winner-picker/",
  "description": "Randomly selects winners from lists, spreadsheets, or Google Sheets for giveaways and contests with cryptographically secure randomness.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "solo-skills",
  "category": "Productivity & Organization",
  "url": "https://github.com/rockscy/solo-skills",
  "description": "7 bilingual (EN+中文) skills for solo founders and indie devs: launch tweets, customer emails, decision frameworks, postmortems. Each skill includes an explicit \"When NOT to use\" section.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Tailored Resume Generator",
  "category": "Productivity & Organization",
  "url": "./tailored-resume-generator/",
  "description": "Analyzes job descriptions and generates tailored resumes that highlight relevant experience, skills, and achievements to maximize interview chances.",
  "status": "de_incercat",
  "notes": ""
 },
 {
  "name": "ship-learn-next",
  "category": "Productivity & Organization",
  "url": "https://github.com/michalparkola/tapestry-skills-for-claude-code/tree/main/ship-learn-next",
  "description": "Skill to help iterate on what to build or learn next, based on feedback loops.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "tapestry",
  "category": "Productivity & Organization",
  "url": "https://github.com/michalparkola/tapestry-skills-for-claude-code/tree/main/tapestry",
  "description": "Interlink and summarize related documents into knowledge networks.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "git-pushing",
  "category": "Collaboration & Project Management",
  "url": "https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin/skills/git-pushing",
  "description": "Automate git operations and repository interactions.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "google-workspace-skills",
  "category": "Collaboration & Project Management",
  "url": "https://github.com/sanjay3290/ai-skills/tree/main/skills",
  "description": "Suite of Google Workspace integrations: Gmail, Calendar, Chat, Docs, Sheets, Slides, and Drive with cross-platform OAuth.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "mercury-mcp",
  "category": "Collaboration & Project Management",
  "url": "https://www.teamoffsite.ai/proton/docs/skill",
  "description": "Cheatsheet for the Mercury (Proton) MCP tools. Message agent teammates, manage threads, create tasks, and schedule automations across coordinated agent teams.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "outline",
  "category": "Collaboration & Project Management",
  "url": "https://github.com/sanjay3290/ai-skills/tree/main/skills/outline",
  "description": "Search, read, create, and manage documents in Outline wiki instances (cloud or self-hosted).",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "review-implementing",
  "category": "Collaboration & Project Management",
  "url": "https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin/skills/review-implementing",
  "description": "Evaluate code implementation plans and align with specs.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "test-fixing",
  "category": "Collaboration & Project Management",
  "url": "https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin/skills/test-fixing",
  "description": "Detect failing tests and propose patches or fixes.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "computer-forensics",
  "category": "Security & Systems",
  "url": "https://github.com/mhattingpete/claude-skills-marketplace/tree/main/computer-forensics-skills/skills/computer-forensics",
  "description": "Digital forensics analysis and investigation techniques.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "file-deletion",
  "category": "Security & Systems",
  "url": "https://github.com/mhattingpete/claude-skills-marketplace/tree/main/computer-forensics-skills/skills/file-deletion",
  "description": "Secure file deletion and data sanitization methods.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "metadata-extraction",
  "category": "Security & Systems",
  "url": "https://github.com/mhattingpete/claude-skills-marketplace/tree/main/computer-forensics-skills/skills/metadata-extraction",
  "description": "Extract and analyze file metadata for forensic purposes.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "threat-hunting-with-sigma-rules",
  "category": "Security & Systems",
  "url": "https://github.com/jthack/threat-hunting-with-sigma-rules-skill",
  "description": "Use Sigma detection rules to hunt for threats and analyze security events.",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "ASD-AuDHD-PAI-Skills",
  "category": "Assistive Technology",
  "url": "https://github.com/emory/ASD-AuDHD-PAI-Skills",
  "description": "New collection, first skill pda-reframing can reframe requests or decisions to defeat Persistent Demand Avoidance flavors of autism spectrum disorders, or people with ADHD that struggle to Start tasks and need help…",
  "status": "neevaluat",
  "notes": ""
 },
 {
  "name": "Close Automation",
  "category": "Composio · CRM & Sales",
  "url": "./close-automation/",
  "description": "Automate Close CRM: leads, contacts, opportunities, activities, and pipelines.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "HubSpot Automation",
  "category": "Composio · CRM & Sales",
  "url": "./hubspot-automation/",
  "description": "Automate HubSpot CRM: contacts, deals, companies, tickets, and email engagement.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Pipedrive Automation",
  "category": "Composio · CRM & Sales",
  "url": "./pipedrive-automation/",
  "description": "Automate Pipedrive: deals, contacts, organizations, activities, and pipelines.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Salesforce Automation",
  "category": "Composio · CRM & Sales",
  "url": "./salesforce-automation/",
  "description": "Automate Salesforce: objects, records, SOQL queries, and bulk operations.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Zoho CRM Automation",
  "category": "Composio · CRM & Sales",
  "url": "./zoho-crm-automation/",
  "description": "Automate Zoho CRM: leads, contacts, deals, accounts, and modules.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Asana Automation",
  "category": "Composio · Project Management",
  "url": "./asana-automation/",
  "description": "Automate Asana: tasks, projects, sections, assignments, and workspaces.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Basecamp Automation",
  "category": "Composio · Project Management",
  "url": "./basecamp-automation/",
  "description": "Automate Basecamp: to-do lists, messages, people, groups, and projects.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "ClickUp Automation",
  "category": "Composio · Project Management",
  "url": "./clickup-automation/",
  "description": "Automate ClickUp: tasks, lists, spaces, goals, and time tracking.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Jira Automation",
  "category": "Composio · Project Management",
  "url": "./jira-automation/",
  "description": "Automate Jira: issues, projects, boards, sprints, and JQL queries.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Linear Automation",
  "category": "Composio · Project Management",
  "url": "./linear-automation/",
  "description": "Automate Linear: issues, projects, cycles, teams, and workflows.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Monday Automation",
  "category": "Composio · Project Management",
  "url": "./monday-automation/",
  "description": "Automate Monday.com: boards, items, columns, groups, and workspaces.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Notion Automation",
  "category": "Composio · Project Management",
  "url": "./notion-automation/",
  "description": "Automate Notion: pages, databases, blocks, comments, and search.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Todoist Automation",
  "category": "Composio · Project Management",
  "url": "./todoist-automation/",
  "description": "Automate Todoist: tasks, projects, sections, labels, and filters.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Trello Automation",
  "category": "Composio · Project Management",
  "url": "./trello-automation/",
  "description": "Automate Trello: boards, cards, lists, members, and checklists.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Wrike Automation",
  "category": "Composio · Project Management",
  "url": "./wrike-automation/",
  "description": "Automate Wrike: tasks, folders, projects, comments, and workflows.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Discord Automation",
  "category": "Composio · Communication",
  "url": "./discord-automation/",
  "description": "Automate Discord: messages, channels, servers, roles, and reactions.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Intercom Automation",
  "category": "Composio · Communication",
  "url": "./intercom-automation/",
  "description": "Automate Intercom: conversations, contacts, companies, tickets, and articles.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Microsoft Teams Automation",
  "category": "Composio · Communication",
  "url": "./microsoft-teams-automation/",
  "description": "Automate Teams: messages, channels, teams, chats, and meetings.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Slack Automation",
  "category": "Composio · Communication",
  "url": "./slack-automation/",
  "description": "Automate Slack: messages, channels, search, reactions, threads, and scheduling.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Telegram Automation",
  "category": "Composio · Communication",
  "url": "./telegram-automation/",
  "description": "Automate Telegram: messages, chats, media, groups, and bots.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "WhatsApp Automation",
  "category": "Composio · Communication",
  "url": "./whatsapp-automation/",
  "description": "Automate WhatsApp: messages, media, templates, groups, and business profiles.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Gmail Automation",
  "category": "Composio · Email",
  "url": "./gmail-automation/",
  "description": "Automate Gmail: send/reply, search, labels, drafts, and attachments.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Outlook Automation",
  "category": "Composio · Email",
  "url": "./outlook-automation/",
  "description": "Automate Outlook: emails, folders, contacts, and calendar integration.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Postmark Automation",
  "category": "Composio · Email",
  "url": "./postmark-automation/",
  "description": "Automate Postmark: transactional emails, templates, servers, and delivery stats.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "SendGrid Automation",
  "category": "Composio · Email",
  "url": "./sendgrid-automation/",
  "description": "Automate SendGrid: emails, templates, contacts, lists, and campaign stats.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Bitbucket Automation",
  "category": "Composio · Code & DevOps",
  "url": "./bitbucket-automation/",
  "description": "Automate Bitbucket: repos, PRs, branches, issues, and workspaces.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "CircleCI Automation",
  "category": "Composio · Code & DevOps",
  "url": "./circleci-automation/",
  "description": "Automate CircleCI: pipelines, workflows, jobs, and project configuration.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Datadog Automation",
  "category": "Composio · Code & DevOps",
  "url": "./datadog-automation/",
  "description": "Automate Datadog: monitors, dashboards, metrics, incidents, and alerts.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "GitHub Automation",
  "category": "Composio · Code & DevOps",
  "url": "./github-automation/",
  "description": "Automate GitHub: issues, PRs, repos, branches, actions, and code search.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "GitLab Automation",
  "category": "Composio · Code & DevOps",
  "url": "./gitlab-automation/",
  "description": "Automate GitLab: issues, MRs, projects, pipelines, and branches.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "PagerDuty Automation",
  "category": "Composio · Code & DevOps",
  "url": "./pagerduty-automation/",
  "description": "Automate PagerDuty: incidents, services, schedules, escalation policies, and on-call.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Render Automation",
  "category": "Composio · Code & DevOps",
  "url": "./render-automation/",
  "description": "Automate Render: services, deploys, and project management.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Sentry Automation",
  "category": "Composio · Code & DevOps",
  "url": "./sentry-automation/",
  "description": "Automate Sentry: issues, events, projects, releases, and alerts.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Supabase Automation",
  "category": "Composio · Code & DevOps",
  "url": "./supabase-automation/",
  "description": "Automate Supabase: SQL queries, table schemas, edge functions, and storage.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Vercel Automation",
  "category": "Composio · Code & DevOps",
  "url": "./vercel-automation/",
  "description": "Automate Vercel: deployments, projects, domains, environment variables, and logs.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Box Automation",
  "category": "Composio · Storage & Files",
  "url": "./box-automation/",
  "description": "Automate Box: files, folders, search, sharing, collaborations, and sign requests.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Dropbox Automation",
  "category": "Composio · Storage & Files",
  "url": "./dropbox-automation/",
  "description": "Automate Dropbox: files, folders, search, sharing, and batch operations.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Google Drive Automation",
  "category": "Composio · Storage & Files",
  "url": "./google-drive-automation/",
  "description": "Automate Google Drive: upload, download, search, share, and organize files.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "OneDrive Automation",
  "category": "Composio · Storage & Files",
  "url": "./one-drive-automation/",
  "description": "Automate OneDrive: files, folders, search, sharing, permissions, and versioning.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Airtable Automation",
  "category": "Composio · Spreadsheets & Databases",
  "url": "./airtable-automation/",
  "description": "Automate Airtable: records, tables, bases, views, and field management.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Coda Automation",
  "category": "Composio · Spreadsheets & Databases",
  "url": "./coda-automation/",
  "description": "Automate Coda: docs, tables, rows, formulas, and automations.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Google Sheets Automation",
  "category": "Composio · Spreadsheets & Databases",
  "url": "./googlesheets-automation/",
  "description": "Automate Google Sheets: read/write cells, formatting, formulas, and batch operations.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Cal.com Automation",
  "category": "Composio · Calendar & Scheduling",
  "url": "./cal-com-automation/",
  "description": "Automate Cal.com: event types, bookings, availability, and scheduling.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Calendly Automation",
  "category": "Composio · Calendar & Scheduling",
  "url": "./calendly-automation/",
  "description": "Automate Calendly: events, invitees, event types, scheduling links, and availability.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Google Calendar Automation",
  "category": "Composio · Calendar & Scheduling",
  "url": "./google-calendar-automation/",
  "description": "Automate Google Calendar: events, attendees, free/busy, and recurring schedules.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Outlook Calendar Automation",
  "category": "Composio · Calendar & Scheduling",
  "url": "./outlook-calendar-automation/",
  "description": "Automate Outlook Calendar: events, attendees, reminders, and recurring schedules.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Instagram Automation",
  "category": "Composio · Social Media",
  "url": "./instagram-automation/",
  "description": "Automate Instagram: posts, stories, comments, media, and business insights.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "LinkedIn Automation",
  "category": "Composio · Social Media",
  "url": "./linkedin-automation/",
  "description": "Automate LinkedIn: posts, profiles, companies, images, and comments.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Reddit Automation",
  "category": "Composio · Social Media",
  "url": "./reddit-automation/",
  "description": "Automate Reddit: posts, comments, subreddits, voting, and moderation.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "TikTok Automation",
  "category": "Composio · Social Media",
  "url": "./tiktok-automation/",
  "description": "Automate TikTok: video uploads, queries, and creator management.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Twitter Automation",
  "category": "Composio · Social Media",
  "url": "./twitter-automation/",
  "description": "Automate Twitter/X: tweets, search, users, lists, and engagement.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "YouTube Automation",
  "category": "Composio · Social Media",
  "url": "./youtube-automation/",
  "description": "Automate YouTube: videos, channels, playlists, comments, and subscriptions.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "ActiveCampaign Automation",
  "category": "Composio · Marketing & Email Marketing",
  "url": "./activecampaign-automation/",
  "description": "Automate ActiveCampaign: contacts, deals, campaigns, lists, and automations.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Brevo Automation",
  "category": "Composio · Marketing & Email Marketing",
  "url": "./brevo-automation/",
  "description": "Automate Brevo: contacts, email campaigns, transactional emails, and lists.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "ConvertKit Automation",
  "category": "Composio · Marketing & Email Marketing",
  "url": "./convertkit-automation/",
  "description": "Automate ConvertKit (Kit): subscribers, tags, sequences, broadcasts, and forms.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Klaviyo Automation",
  "category": "Composio · Marketing & Email Marketing",
  "url": "./klaviyo-automation/",
  "description": "Automate Klaviyo: profiles, lists, segments, campaigns, and events.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Mailchimp Automation",
  "category": "Composio · Marketing & Email Marketing",
  "url": "./mailchimp-automation/",
  "description": "Automate Mailchimp: audiences, campaigns, templates, segments, and reports.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Freshdesk Automation",
  "category": "Composio · Support & Helpdesk",
  "url": "./freshdesk-automation/",
  "description": "Automate Freshdesk: tickets, contacts, agents, groups, and canned responses.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Freshservice Automation",
  "category": "Composio · Support & Helpdesk",
  "url": "./freshservice-automation/",
  "description": "Automate Freshservice: tickets, assets, changes, problems, and service catalog.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Help Scout Automation",
  "category": "Composio · Support & Helpdesk",
  "url": "./helpdesk-automation/",
  "description": "Automate Help Scout: conversations, customers, mailboxes, and tags.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Zendesk Automation",
  "category": "Composio · Support & Helpdesk",
  "url": "./zendesk-automation/",
  "description": "Automate Zendesk: tickets, users, organizations, search, and macros.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Shopify Automation",
  "category": "Composio · E-commerce & Payments",
  "url": "./shopify-automation/",
  "description": "Automate Shopify: products, orders, customers, inventory, and GraphQL queries.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Square Automation",
  "category": "Composio · E-commerce & Payments",
  "url": "./square-automation/",
  "description": "Automate Square: payments, customers, catalog, orders, and locations.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Stripe Automation",
  "category": "Composio · E-commerce & Payments",
  "url": "./stripe-automation/",
  "description": "Automate Stripe: charges, customers, products, subscriptions, and refunds.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Canva Automation",
  "category": "Composio · Design & Collaboration",
  "url": "./canva-automation/",
  "description": "Automate Canva: designs, templates, assets, folders, and brand kits.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Confluence Automation",
  "category": "Composio · Design & Collaboration",
  "url": "./confluence-automation/",
  "description": "Automate Confluence: pages, spaces, search, CQL, labels, and versions.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "DocuSign Automation",
  "category": "Composio · Design & Collaboration",
  "url": "./docusign-automation/",
  "description": "Automate DocuSign: envelopes, templates, signing, and document management.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Figma Automation",
  "category": "Composio · Design & Collaboration",
  "url": "./figma-automation/",
  "description": "Automate Figma: files, components, comments, projects, and team management.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Miro Automation",
  "category": "Composio · Design & Collaboration",
  "url": "./miro-automation/",
  "description": "Automate Miro: boards, sticky notes, shapes, connectors, and items.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Webflow Automation",
  "category": "Composio · Design & Collaboration",
  "url": "./webflow-automation/",
  "description": "Automate Webflow: CMS collections, items, sites, publishing, and assets.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Amplitude Automation",
  "category": "Composio · Analytics & Data",
  "url": "./amplitude-automation/",
  "description": "Automate Amplitude: events, cohorts, user properties, and analytics queries.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Google Analytics Automation",
  "category": "Composio · Analytics & Data",
  "url": "./google-analytics-automation/",
  "description": "Automate Google Analytics: reports, dimensions, metrics, and property management.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Mixpanel Automation",
  "category": "Composio · Analytics & Data",
  "url": "./mixpanel-automation/",
  "description": "Automate Mixpanel: events, funnels, cohorts, annotations, and JQL queries.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "PostHog Automation",
  "category": "Composio · Analytics & Data",
  "url": "./posthog-automation/",
  "description": "Automate PostHog: events, persons, feature flags, insights, and annotations.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Segment Automation",
  "category": "Composio · Analytics & Data",
  "url": "./segment-automation/",
  "description": "Automate Segment: sources, destinations, tracking, and warehouse connections.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "BambooHR Automation",
  "category": "Composio · HR & People",
  "url": "./bamboohr-automation/",
  "description": "Automate BambooHR: employees, time off, reports, and directory management.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Make Automation",
  "category": "Composio · Automation Platforms",
  "url": "./make-automation/",
  "description": "Automate Make (Integromat): scenarios, connections, and execution management.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 },
 {
  "name": "Zoom Automation",
  "category": "Composio · Zoom & Meetings",
  "url": "./zoom-automation/",
  "description": "Automate Zoom: meetings, recordings, participants, webinars, and reports.",
  "status": "neevaluat",
  "notes": "Necesită cont + cheie Composio (Rube MCP)."
 }
];
