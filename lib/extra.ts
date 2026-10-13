/* Vendor badges, open-source projects and the AI Tools catalogue.
   Verified October 2026. Re-check prices and links each quarter. */

export type Issuer = "aws" | "ms" | "openai" | "hf" | "anthropic" | "google";
/** [issuer, title, url, note, paid?] */
export type Badge = [Issuer, string, string, string, boolean?];
/** [repo, url, note] */
export type Repo = [string, string, string];
/** [name, url, pricing text, kind, new in 2025–26?, description] */
export type ToolKind = "oss" | "free" | "freemium" | "paid";
export type Tool = [string, string, string, ToolKind, boolean, string];

export const ISSUERS: Record<Issuer, string> = {
  aws: "AWS", ms: "Microsoft Learn", openai: "OpenAI", hf: "Hugging Face", anthropic: "Anthropic", google: "Google",
};

export const LAST_VERIFIED = "Oct 2026";

const SB = "https://skillbuilder.aws/category/domain/generative-ai";
const AGENTIC = "https://skillbuilder.aws/learn/32Y249P272/aws-agentic-ai-demonstrated/TTAJ5WKYTS";
const MICRO2 = "https://aws.amazon.com/blogs/training-and-certification/prove-your-agentic-ai-skills-two-new-microcredentials-now-available/";
const MLOPS = "https://aws.amazon.com/blogs/training-and-certification/microcredentials-from-aws-are-now-free-heres-why-that-matters/";
const AIF = "https://aws.amazon.com/certification/certified-ai-practitioner/";
const MLA = "https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/";
const AIP = "https://aws.amazon.com/certification/certified-generative-ai-developer-professional/";
const AI103 = "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/";
const AI901 = "https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/";
const APPLIED = "https://learn.microsoft.com/credentials/applied-skills/";
const CREDS = "https://learn.microsoft.com/credentials/";
const ACADEMY = "https://academy.openai.com/";
const ANTH = "https://anthropic.skilljar.com/";
const OA_NOTE = "Free completion certificate (not a formal OpenAI Certification)";

export const BADGES: Record<string, Badge[]> = {
  mcp: [
    ["ms", "Applied Skills: Integrate MCP tools with agents in Microsoft Foundry", "https://learn.microsoft.com/en-us/credentials/applied-skills/integrate-model-context-protocol-tools-with-agents-in-microsoft-foundry/", "Free credential"],
    ["aws", "AWS Agentic AI Demonstrated", AGENTIC, "Free microcredential badge"],
    ["openai", "Docs: Connectors and MCP servers", "https://platform.openai.com/docs/guides/tools-connectors-mcp", "Free guide"],
    ["hf", "Hugging Face MCP Course", "https://huggingface.co/learn/mcp-course", "Free certificate"],
    ["anthropic", "Anthropic Academy: Intro to MCP + Advanced Topics", ANTH, "Free certificate"],
  ],
  agents: [
    ["aws", "AWS Agentic AI Demonstrated", AGENTIC, "Free microcredential badge"],
    ["aws", "Building Generative AI Applications Using Amazon Bedrock", SB, "Free course"],
    ["ms", "Learning path: Develop AI agents on Azure", "https://learn.microsoft.com/en-us/training/paths/develop-ai-agents-azure/", "Free path"],
    ["ms", "Applied Skills: Get started developing agents in Microsoft Foundry", APPLIED, "Free credential"],
    ["openai", "OpenAI Academy: Agents and Workflows", ACADEMY, OA_NOTE],
    ["openai", "OpenAI Agents SDK docs", "https://openai.github.io/openai-agents-python/", "Free guide"],
    ["aws", "AWS Certified Generative AI Developer – Professional (AIP-C01)", AIP, "$300 exam", true],
  ],
  context: [
    ["aws", "Foundations of Prompt Engineering", SB, "Free course"],
    ["ms", "Build production-grade multi-agent capabilities with Microsoft Foundry", "https://learn.microsoft.com/en-us/training/paths/aaai-2-build-production-grade-multi-agent-capabilities-microsoft-foundry/", "Free path: prompting, MCP, RAG, memory"],
    ["openai", "OpenAI Academy: AI Foundations", ACADEMY, OA_NOTE],
    ["openai", "Docs: Prompt engineering", "https://platform.openai.com/docs/guides/prompt-engineering", "Free guide"],
    ["anthropic", "Anthropic Academy: Introduction to Agent Skills", ANTH, "Free certificate"],
    ["aws", "AWS Certified AI Practitioner (AIF-C01)", AIF, "$100 exam", true],
  ],
  patterns: [
    ["aws", "AWS Agentic AI Demonstrated", AGENTIC, "Free microcredential badge"],
    ["ms", "Applied Skills: Create agentic workflows by using Microsoft Foundry", APPLIED, "Free credential"],
    ["ms", "Module: Orchestrate a multi-agent solution with Microsoft Agent Framework", "https://learn.microsoft.com/en-us/training/paths/develop-ai-agents-azure/", "Free module"],
    ["openai", "OpenAI Academy: Applied AI Foundations", ACADEMY, OA_NOTE],
    ["openai", "OpenAI Cookbook: agent orchestration", "https://cookbook.openai.com/", "Free guide"],
  ],
  scale: [
    ["aws", "AWS MLOps Demonstrated", MLOPS, "Free microcredential badge"],
    ["ms", "Deploy and govern enterprise agentic AI solutions on Azure", "https://learn.microsoft.com/en-us/training/paths/aaai-3-deploy-govern-agentic-ai-solutions-azure/", "Free path"],
    ["openai", "Docs: Production best practices", "https://platform.openai.com/docs/guides/production-best-practices", "Free guide"],
    ["aws", "AWS AIP-C01 (operational efficiency domain)", AIP, "$300 exam", true],
    ["ms", "AI-103: Azure AI Apps and Agents Developer", AI103, "~US$165 exam", true],
  ],
  rag: [
    ["aws", "Building GenAI Apps with Amazon Bedrock (Knowledge Bases lab)", SB, "Free course"],
    ["aws", "AWS Databases for Agentic AI Demonstrated", MICRO2, "Free microcredential badge"],
    ["ms", "Applied Skills: Build a generative AI chat app", APPLIED, "Free credential"],
    ["openai", "Docs: File search", "https://platform.openai.com/docs/guides/tools-file-search", "Free guide"],
    ["aws", "AWS AIP-C01 (RAG, Knowledge Bases, Guardrails)", AIP, "$300 exam", true],
    ["ms", "AI-103 (RAG on Azure AI Search)", AI103, "~US$165 exam", true],
  ],
  evals: [
    ["ms", "AI-103 study guide: evaluate models and apps", "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103", "Free guide"],
    ["openai", "Docs: Evals", "https://platform.openai.com/docs/guides/evals", "Free guide"],
    ["aws", "AWS AIP-C01 (testing & evaluating FM outputs)", AIP, "$300 exam", true],
  ],
  llm: [
    ["aws", "Generative AI Essentials on AWS", SB, "Free course"],
    ["ms", "Fundamentals of Generative AI", "https://learn.microsoft.com/training/", "Free module"],
    ["openai", "OpenAI Academy: AI Foundations", ACADEMY, OA_NOTE],
    ["hf", "Hugging Face LLM Course", "https://huggingface.co/learn/llm-course", "Free certificate"],
    ["aws", "AWS Certified AI Practitioner (AIF-C01)", AIF, "$100 exam", true],
    ["ms", "AI-901: Azure AI Fundamentals", AI901, "~US$99 exam", true],
  ],
  memory: [
    ["aws", "AWS Databases for Agentic AI Demonstrated", MICRO2, "Free microcredential badge"],
    ["ms", "Multi-agent capabilities with Foundry (agent memory with Cosmos DB)", "https://learn.microsoft.com/en-us/training/paths/aaai-2-build-production-grade-multi-agent-capabilities-microsoft-foundry/", "Free path"],
    ["ms", "Agent Framework docs: Memory & Persistence", "https://learn.microsoft.com/en-us/agent-framework/", "Free guide"],
    ["openai", "Agents SDK: Sessions", "https://openai.github.io/openai-agents-python/", "Free guide"],
  ],
  finetune: [
    ["aws", "Skill Builder: Bedrock model customisation courses", SB, "Free course"],
    ["openai", "Docs: Fine-tuning (SFT, DPO, RFT)", "https://platform.openai.com/docs/guides/fine-tuning", "Free guide"],
    ["hf", "Hugging Face smol course", "https://huggingface.co/learn", "Free certificate"],
    ["aws", "AWS Certified ML Engineer – Associate (MLA-C02)", MLA, "$150 exam", true],
    ["ms", "AI-300: MLOps Engineer Associate", CREDS, "Paid exam", true],
  ],
  multiagent: [
    ["aws", "AWS Agentic AI Demonstrated", AGENTIC, "Free microcredential badge"],
    ["ms", "Architect production-grade multi-agent AI solutions in Azure", "https://learn.microsoft.com/en-us/training/paths/aaai-1-architect-production-grade-multi-agent-ai-solutions/", "Free path (includes A2A)"],
    ["openai", "Agents SDK: Handoffs", "https://openai.github.io/openai-agents-python/", "Free guide"],
    ["ms", "AI-500: Multi-Agent AI Solutions Expert (beta)", CREDS, "Paid exam", true],
  ],
  vectordb: [
    ["aws", "AWS Databases for Agentic AI Demonstrated", MICRO2, "Free microcredential badge"],
    ["ms", "Azure AI Search: vector search overview", "https://learn.microsoft.com/azure/search/vector-search-overview", "Free guide"],
    ["openai", "Docs: Embeddings", "https://platform.openai.com/docs/guides/embeddings", "Free guide"],
  ],
  design: [
    ["aws", "AWS Agentic AI Demonstrated", AGENTIC, "Free microcredential badge"],
    ["ms", "Module: Develop an AI agent with Microsoft Agent Framework", "https://learn.microsoft.com/en-us/training/modules/develop-ai-agent-with-semantic-kernel/", "Free module"],
    ["openai", "Docs: Agents guide", "https://platform.openai.com/docs/guides/agents", "Free guide"],
    ["anthropic", "Anthropic Academy: Building with the Claude API", ANTH, "Free certificate"],
    ["aws", "AWS AIP-C01 (Bedrock Agents, action groups)", AIP, "$300 exam", true],
    ["ms", "AI-103: Azure AI Apps and Agents Developer", AI103, "~US$165 exam", true],
  ],
  chat: [
    ["aws", "AWS Cloud Quest: Generative AI Practitioner", "https://aws.amazon.com/blogs/training-and-certification/learn-generative-ai-with-aws-cloud-quest-generative-ai-practitioner/", "Free badge"],
    ["aws", "AWS SimuLearn: AI Practitioner", SB, "Free badge"],
    ["ms", "Applied Skills: Build a generative AI chat app", APPLIED, "Free credential"],
    ["openai", "OpenAI Academy: AI Foundations", ACADEMY, OA_NOTE],
    ["openai", "Docs: Realtime API", "https://platform.openai.com/docs/guides/realtime", "Free guide"],
    ["anthropic", "Anthropic Academy: Claude 101", ANTH, "Free certificate"],
  ],
  rl: [
    ["aws", "AWS DeepRacer / RL courses", "https://skillbuilder.aws/", "Free course"],
    ["openai", "Spinning Up in Deep RL", "https://spinningup.openai.com/", "Free course"],
    ["openai", "Docs: Reinforcement fine-tuning", "https://platform.openai.com/docs/guides/reinforcement-fine-tuning", "Free guide"],
    ["hf", "Hugging Face Deep RL Course", "https://huggingface.co/learn/deep-rl-course", "Free certificate (best badge here)"],
    ["aws", "AWS MLA-C02", MLA, "$150 exam", true],
  ],
  hnsw: [
    ["aws", "AWS Databases for Agentic AI Demonstrated (pgvector)", MICRO2, "Free microcredential badge"],
    ["aws", "Amazon OpenSearch k-NN docs (HNSW parameters)", "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/knn.html", "Free guide"],
    ["ms", "Azure AI Search: vector ranking (HNSW vs KNN)", "https://learn.microsoft.com/azure/search/vector-search-ranking", "Free guide"],
  ],
  a2a: [
    ["aws", "AWS Securing Agent Identities Demonstrated", MICRO2, "Free microcredential badge"],
    ["ms", "Architect multi-agent AI solutions in Azure (A2A integration)", "https://learn.microsoft.com/en-us/training/paths/aaai-1-architect-production-grade-multi-agent-ai-solutions/", "Free path"],
    ["ms", "AI-500 (beta)", CREDS, "Paid exam", true],
  ],
  infra: [
    ["aws", "AWS MLOps Demonstrated", MLOPS, "Free microcredential badge"],
    ["openai", "Docs: Latency optimisation", "https://platform.openai.com/docs/guides/latency-optimization", "Free guide"],
    ["aws", "AWS MLA-C02", MLA, "$150 exam", true],
    ["ms", "AI-200 AI Cloud Developer (beta) / AI-300 MLOps", CREDS, "Paid exams", true],
  ],
  "agentic-eng": [
    ["aws", "AWS SimuLearn: AI Practitioner (Amazon Q Developer, Kiro)", SB, "Free badge"],
    ["ms", "GitHub Copilot learning paths", "https://learn.microsoft.com/training/github/", "Free paths"],
    ["openai", "OpenAI Codex docs", "https://developers.openai.com/codex", "Free guide"],
    ["anthropic", "Anthropic Academy: Claude Code 101 / Claude Code in Action", ANTH, "Free certificate"],
    ["ms", "GH-600 GitHub Certified: Agentic AI Developer (beta)", CREDS, "Paid exam", true],
  ],
  certs: [
    ["aws", "AWS Agentic AI Demonstrated", AGENTIC, "Free microcredential badge"],
    ["aws", "AWS Securing Agent Identities / Databases for Agentic AI Demonstrated", MICRO2, "Free microcredential badges"],
    ["aws", "AWS MLOps Demonstrated", MLOPS, "Free microcredential badge"],
    ["aws", "AWS Cloud Quest: Generative AI Practitioner", "https://aws.amazon.com/blogs/training-and-certification/learn-generative-ai-with-aws-cloud-quest-generative-ai-practitioner/", "Free badge"],
    ["ms", "Microsoft Foundry Applied Skills (agents, MCP tools, workflows, chat app)", APPLIED, "Free credentials"],
    ["openai", "OpenAI Academy (3 courses)", ACADEMY, OA_NOTE],
    ["hf", "Hugging Face Agents, MCP, LLM and Deep RL courses", "https://huggingface.co/learn", "Free certificates"],
    ["anthropic", "Anthropic Academy", ANTH, "Free certificates"],
    ["aws", "AWS Certified AI Practitioner (AIF-C01)", AIF, "$100 exam: beginner pick", true],
    ["aws", "AWS Certified Generative AI Developer – Professional (AIP-C01)", AIP, "$300 exam: capstone for Bedrock", true],
    ["ms", "AI-103: Azure AI Apps and Agents Developer", AI103, "~US$165 exam: capstone for Foundry", true],
  ],
};

export const REPOS: Record<string, Repo[]> = {
  mcp: [["modelcontextprotocol/servers", "https://github.com/modelcontextprotocol/servers", "Reference servers · ~91k★"], ["modelcontextprotocol/python-sdk", "https://github.com/modelcontextprotocol/python-sdk", "Official Python SDK · ~25k★"], ["microsoft/mcp-for-beginners", "https://github.com/microsoft/mcp-for-beginners", "Cross-language curriculum"]],
  agents: [["openai/openai-agents-python", "https://github.com/openai/openai-agents-python", "Agents SDK · ~30k★"], ["huggingface/smolagents", "https://github.com/huggingface/smolagents", "Minimal code agents · ~30k★"], ["microsoft/ai-agents-for-beginners", "https://github.com/microsoft/ai-agents-for-beginners", "Lessons + code"]],
  context: [["stanfordnlp/dspy", "https://github.com/stanfordnlp/dspy", "Programming, not prompting · ~39k★"], ["openai/openai-cookbook", "https://github.com/openai/openai-cookbook", "Recipes · ~77k★"]],
  patterns: [["langchain-ai/langgraph", "https://github.com/langchain-ai/langgraph", "Stateful graph agents · ~43k★"], ["crewAIInc/crewAI", "https://github.com/crewAIInc/crewAI", "Role-based crews · ~60k★"], ["microsoft/agent-framework", "https://github.com/microsoft/agent-framework", "AutoGen + Semantic Kernel successor"]],
  scale: [["BerriAI/litellm", "https://github.com/BerriAI/litellm", "LLM gateway · ~61k★"], ["vllm-project/vllm", "https://github.com/vllm-project/vllm", "High-throughput serving · ~94k★"], ["langfuse/langfuse", "https://github.com/langfuse/langfuse", "Observability · ~36k★"]],
  rag: [["run-llama/llama_index", "https://github.com/run-llama/llama_index", "Data framework · ~53k★"], ["langgenius/dify", "https://github.com/langgenius/dify", "RAG/agent platform · ~158k★"], ["deepset-ai/haystack", "https://github.com/deepset-ai/haystack", "Production pipelines"]],
  evals: [["openai/evals", "https://github.com/openai/evals", "Eval framework · ~20k★"], ["promptfoo/promptfoo", "https://github.com/promptfoo/promptfoo", "Evals & red-teaming"], ["confident-ai/deepeval", "https://github.com/confident-ai/deepeval", "Pytest-style metrics"], ["explodinggradients/ragas", "https://github.com/explodinggradients/ragas", "RAG metrics"]],
  llm: [["karpathy/nanoGPT", "https://github.com/karpathy/nanoGPT", "Minimal GPT training · ~64k★"], ["huggingface/transformers", "https://github.com/huggingface/transformers", "Model library"], ["microsoft/generative-ai-for-beginners", "https://github.com/microsoft/generative-ai-for-beginners", "21 lessons"]],
  memory: [["mem0ai/mem0", "https://github.com/mem0ai/mem0", "Memory layer · ~67k★"], ["letta-ai/letta", "https://github.com/letta-ai/letta", "Stateful agents (ex-MemGPT)"], ["langchain-ai/langgraph", "https://github.com/langchain-ai/langgraph", "Checkpointers"]],
  finetune: [["unslothai/unsloth", "https://github.com/unslothai/unsloth", "Fast LoRA/QLoRA · ~78k★"], ["hiyouga/LLaMA-Factory", "https://github.com/hiyouga/LLaMA-Factory", "Unified UI/CLI · ~75k★"], ["huggingface/trl", "https://github.com/huggingface/trl", "SFT / DPO / GRPO"]],
  multiagent: [["crewAIInc/crewAI", "https://github.com/crewAIInc/crewAI", "Role-based crews · ~60k★"], ["microsoft/agent-framework", "https://github.com/microsoft/agent-framework", "Multi-agent orchestration"], ["google/adk-python", "https://github.com/google/adk-python", "Agent Development Kit"], ["microsoft/autogen", "https://github.com/microsoft/autogen", "Maintenance mode: migrate to Agent Framework"]],
  vectordb: [["facebookresearch/faiss", "https://github.com/facebookresearch/faiss", "Similarity search · ~41k★"], ["milvus-io/milvus", "https://github.com/milvus-io/milvus", "Billion-scale vectors"], ["qdrant/qdrant", "https://github.com/qdrant/qdrant", "Rust vector engine"], ["pgvector/pgvector", "https://github.com/pgvector/pgvector", "Vectors in Postgres"]],
  design: [["pydantic/pydantic-ai", "https://github.com/pydantic/pydantic-ai", "Type-safe agents"], ["strands-agents/sdk-python", "https://github.com/strands-agents/sdk-python", "AWS model-driven agents"], ["openai/openai-agents-python", "https://github.com/openai/openai-agents-python", "Guardrails + tracing"]],
  chat: [["open-webui/open-webui", "https://github.com/open-webui/open-webui", "Self-hosted chat UI"], ["ollama/ollama", "https://github.com/ollama/ollama", "Local models · ~183k★"]],
  rl: [["huggingface/trl", "https://github.com/huggingface/trl", "RLHF, DPO, GRPO"], ["volcengine/verl", "https://github.com/volcengine/verl", "RL for LLMs"]],
  hnsw: [["nmslib/hnswlib", "https://github.com/nmslib/hnswlib", "Header-only HNSW"], ["facebookresearch/faiss", "https://github.com/facebookresearch/faiss", "IndexHNSW"], ["HNSW paper (arXiv)", "https://arxiv.org/abs/1603.09320", "Malkov & Yashunin"]],
  a2a: [["a2aproject/A2A", "https://github.com/a2aproject/A2A", "Spec, v1.0 · ~26k★"], ["a2aproject/a2a-python", "https://github.com/a2aproject/a2a-python", "Python SDK"]],
  infra: [["vllm-project/vllm", "https://github.com/vllm-project/vllm", "Serving · ~94k★"], ["sgl-project/sglang", "https://github.com/sgl-project/sglang", "RadixAttention serving · ~37k★"], ["ggml-org/llama.cpp", "https://github.com/ggml-org/llama.cpp", "Local inference · ~131k★"], ["kserve/kserve", "https://github.com/kserve/kserve", "Kubernetes serving"]],
  "agentic-eng": [["anthropics/claude-code", "https://github.com/anthropics/claude-code", "Claude Code · ~150k★"], ["openai/codex", "https://github.com/openai/codex", "Codex CLI · ~129k★"], ["google-gemini/gemini-cli", "https://github.com/google-gemini/gemini-cli", "Gemini CLI · ~107k★"]],
  certs: [["microsoft/generative-ai-for-beginners", "https://github.com/microsoft/generative-ai-for-beginners", "Free curriculum"], ["microsoft/ai-agents-for-beginners", "https://github.com/microsoft/ai-agents-for-beginners", "Free curriculum"]],
};

export const NOTICES: Record<string, string> = {
  certs: "Retired, so skip these: AWS ML Specialty (MLS-C01), AWS MLA-C01 (now MLA-C02), Microsoft AI-102 (now AI-103), AI-900 (now AI-901), Applied Skills APL-3031 and APL-3022. OpenAI Certified is invite-only (Enterprise/Edu pilots); OpenAI Academy certificates are completion certificates, not certifications.",
  rag: "The Applied Skill “Implement knowledge mining with Azure AI Search” (APL-3022) is retired.",
  multiagent: "AutoGen and Semantic Kernel are in maintenance mode. Microsoft Agent Framework 1.0 (GA April 2026) replaces them.",
  "agentic-eng": "Google moved consumer Gemini CLI users to Antigravity CLI on June 18, 2026.",
};

/* ---------------- AI Tools catalogue ---------------- */
type ToolGroup = { id: string; key: string; post: string; summary: string; tools: Tool[] };

export const TOOL_GROUPS: ToolGroup[] = [
  { id: "t-chat", key: "Chat Assistants", post: "& Model APIs", summary: "General-purpose assistants and the model APIs behind them.", tools: [
    ["Claude", "https://claude.ai", "Free · Pro $20 · Max $100/$200", "freemium", false, "Anthropic assistant; Claude Code on paid plans"],
    ["ChatGPT", "https://chatgpt.com", "Free · Go ~$8 · Plus $20 · Pro $200", "freemium", false, "OpenAI assistant with agent mode and Codex"],
    ["Gemini", "https://gemini.google.com", "Free · AI Pro $19.99", "freemium", false, "Google assistant with Workspace"],
    ["Grok", "https://grok.com", "Freemium", "freemium", false, "xAI assistant with X data"],
    ["Mistral Le Chat", "https://chat.mistral.ai", "Freemium", "freemium", false, "European assistant"],
    ["DeepSeek", "https://chat.deepseek.com", "Free app · low-cost API", "free", true, "Open reasoning models"],
    ["Meta AI", "https://www.meta.ai", "Free", "free", false, "Llama-powered assistant"],
    ["Perplexity", "https://www.perplexity.ai", "Free · Pro $20", "freemium", false, "Cited search answers"],
    ["Microsoft Copilot", "https://copilot.microsoft.com", "Freemium", "freemium", false, "Windows and M365 assistant"],
    ["OpenAI API", "https://platform.openai.com", "Pay per token", "paid", false, "Responses API, Agents SDK, Realtime"],
    ["Anthropic API", "https://www.anthropic.com/api", "Pay per token", "paid", false, "Claude models with tool use"],
    ["Google AI Studio", "https://aistudio.google.com", "Free tier + usage", "freemium", false, "Gemini API prototyping"],
  ]},
  { id: "t-models", key: "Open-Weight Models", post: "& Hubs", summary: "Download and run models yourself.", tools: [
    ["Hugging Face Hub", "https://huggingface.co", "Freemium", "freemium", false, "Models, datasets, Spaces"],
    ["Llama", "https://www.llama.com", "Free (Llama license)", "free", false, "Meta open-weight LLMs"],
    ["Qwen", "https://github.com/QwenLM", "Open (mostly Apache 2.0)", "oss", true, "Alibaba multilingual and coding models"],
    ["DeepSeek", "https://github.com/deepseek-ai", "Open (MIT)", "oss", true, "R1 reasoning, V3 MoE"],
    ["Mistral", "https://mistral.ai", "Open + commercial", "freemium", false, "Efficient open models"],
    ["Gemma", "https://ai.google.dev/gemma", "Free (Gemma terms)", "free", false, "Google lightweight open models"],
    ["gpt-oss", "https://openai.com/open-models", "Open (Apache 2.0)", "oss", true, "OpenAI open-weight reasoning models"],
  ]},
  { id: "t-coding", key: "AI Coding", post: "Tools & Agents", summary: "Editors, CLIs and agents that write and ship code. Most start around $20/month.", tools: [
    ["Claude Code", "https://www.anthropic.com/claude-code", "Pro $20 · Max $100/$200 · API", "paid", true, "Terminal agent with subagents, skills, hooks"],
    ["Cursor", "https://cursor.com", "Free · Pro $20 · Ultra $200", "freemium", false, "AI-native editor with agents"],
    ["GitHub Copilot", "https://github.com/features/copilot", "Free · Pro $10", "freemium", true, "Completions, agent mode, cloud agent"],
    ["Windsurf", "https://windsurf.com", "Freemium", "freemium", false, "Agentic IDE (Cascade)"],
    ["OpenAI Codex", "https://developers.openai.com/codex", "OSS CLI · in ChatGPT Plus", "freemium", true, "Parallel cloud tasks, PR review"],
    ["Antigravity", "https://antigravity.google", "Free tier · AI Pro $19.99", "freemium", true, "Google multi-agent IDE and CLI"],
    ["Kiro", "https://kiro.dev", "50 free credits · Pro $20", "freemium", true, "AWS spec-driven agentic IDE"],
    ["Cline", "https://cline.bot", "Open-source", "oss", false, "Autonomous VS Code agent"],
    ["Aider", "https://aider.chat", "Open-source", "oss", false, "Git-aware pair programmer"],
    ["OpenCode", "https://opencode.ai", "Open-source", "oss", true, "Provider-agnostic terminal agent"],
    ["Zed", "https://zed.dev", "Freemium", "freemium", false, "Rust editor with agent panel"],
    ["Replit", "https://replit.com", "Freemium", "freemium", true, "Prompt to deployed apps"],
    ["Lovable", "https://lovable.dev", "Freemium", "freemium", true, "Prompt to full-stack apps"],
    ["Bolt.new", "https://bolt.new", "Freemium", "freemium", true, "In-browser full-stack generation"],
    ["v0", "https://v0.app", "Freemium", "freemium", false, "React/Next.js UI generation"],
    ["Devin", "https://devin.ai", "Paid (~$20 start)", "paid", false, "Autonomous cloud engineer"],
    ["Jules", "https://jules.google", "Freemium", "freemium", true, "Google async GitHub agent"],
  ]},
  { id: "t-frameworks", key: "Agent Frameworks", post: "& SDKs", summary: "Libraries for building agents and LLM apps.", tools: [
    ["LangChain", "https://github.com/langchain-ai/langchain", "Open-source", "oss", false, "LLM app components"],
    ["LangGraph", "https://github.com/langchain-ai/langgraph", "Open-source", "oss", false, "Stateful graph agents"],
    ["LlamaIndex", "https://github.com/run-llama/llama_index", "Open-source", "oss", false, "Data-centric agents"],
    ["CrewAI", "https://github.com/crewAIInc/crewAI", "Open-source", "oss", false, "Role-based multi-agent crews"],
    ["Microsoft Agent Framework", "https://learn.microsoft.com/en-us/agent-framework/", "Open-source (MIT)", "oss", true, "AutoGen + Semantic Kernel successor"],
    ["OpenAI Agents SDK", "https://github.com/openai/openai-agents-python", "Open-source", "oss", true, "Handoffs, guardrails, tracing"],
    ["Claude Agent SDK", "https://docs.claude.com/en/docs/agent-sdk/overview", "Open-source", "oss", true, "Claude Code harness as a library"],
    ["Google ADK", "https://github.com/google/adk-python", "Open-source", "oss", true, "Agent Development Kit with A2A"],
    ["smolagents", "https://github.com/huggingface/smolagents", "Open-source", "oss", true, "Minimal code agents"],
    ["PydanticAI", "https://github.com/pydantic/pydantic-ai", "Open-source", "oss", true, "Type-safe agents"],
    ["Mastra", "https://github.com/mastra-ai/mastra", "Open-source", "oss", true, "TypeScript agents and workflows"],
    ["Agno", "https://github.com/agno-agi/agno", "Open-source", "oss", true, "Fast multi-agent runtime"],
    ["DSPy", "https://github.com/stanfordnlp/dspy", "Open-source", "oss", false, "Prompt/program optimisation"],
    ["Haystack", "https://github.com/deepset-ai/haystack", "Open-source", "oss", false, "Production pipelines"],
    ["Strands Agents", "https://github.com/strands-agents/sdk-python", "Open-source", "oss", true, "AWS model-driven agents"],
    ["Bedrock AgentCore", "https://aws.amazon.com/bedrock/agentcore/", "Paid (usage)", "paid", true, "Runtime, memory, identity, gateway"],
    ["AutoGen / Semantic Kernel", "https://github.com/microsoft/autogen", "Open-source", "oss", false, "Maintenance mode: migrate"],
  ]},
  { id: "t-protocols", key: "Protocols", post: "& MCP Ecosystem", summary: "Open standards that connect agents to tools, to each other and to UIs. MCP and A2A are governed by the Agentic AI Foundation.", tools: [
    ["MCP", "https://modelcontextprotocol.io", "Open standard", "oss", true, "Agent ↔ tools and data (spec 2026-07-28)"],
    ["Official MCP Registry", "https://registry.modelcontextprotocol.io", "Free", "free", true, "Canonical server directory"],
    ["A2A", "https://a2a-protocol.org", "Open (Apache 2.0)", "oss", true, "Agent ↔ agent, v1.0"],
    ["AG-UI", "https://github.com/ag-ui-protocol/ag-ui", "Open-source", "oss", true, "Agent ↔ frontend events"],
    ["Smithery", "https://smithery.ai", "Freemium", "freemium", true, "Hosted MCP servers"],
    ["Agentic AI Foundation", "https://aaif.io", "Governance body", "free", true, "Hosts MCP and A2A"],
  ]},
  { id: "t-automation", key: "Automation", post: "& No-Code Agents", summary: "Build agents and workflows visually.", tools: [
    ["n8n", "https://n8n.io", "Self-host free · Cloud paid", "freemium", true, "Node workflows with AI agents"],
    ["Zapier", "https://zapier.com", "Freemium", "freemium", true, "App integrations + Zapier Agents"],
    ["Make", "https://www.make.com", "Freemium", "freemium", false, "Visual scenarios"],
    ["Dify", "https://dify.ai", "Open-source + Cloud", "oss", false, "RAG and agent builder"],
    ["Flowise", "https://flowiseai.com", "Open-source", "oss", false, "Drag-and-drop LLM flows"],
    ["Langflow", "https://www.langflow.org", "Open-source", "oss", false, "Visual agent builder"],
    ["Gumloop", "https://www.gumloop.com", "Freemium", "freemium", true, "AI-native workflows"],
    ["Relevance AI", "https://relevanceai.com", "Freemium", "freemium", false, "No-code agent teams"],
    ["Copilot Studio", "https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio", "Paid", "paid", false, "Low-code M365 agents"],
  ]},
  { id: "t-vector", key: "RAG", post: "& Vector Databases", summary: "Stores and search engines for embeddings.", tools: [
    ["Pinecone", "https://www.pinecone.io", "Freemium", "freemium", false, "Serverless vector search"],
    ["Weaviate", "https://weaviate.io", "Open-source + Cloud", "oss", false, "Hybrid search"],
    ["Qdrant", "https://qdrant.tech", "Open-source + Cloud", "oss", false, "Rust vector engine"],
    ["Milvus / Zilliz", "https://milvus.io", "Open-source + Cloud", "oss", false, "Billion-scale vectors"],
    ["Chroma", "https://www.trychroma.com", "Open-source + Cloud", "oss", false, "Developer-friendly store"],
    ["pgvector", "https://github.com/pgvector/pgvector", "Open-source", "oss", false, "Vectors + HNSW in Postgres"],
    ["LanceDB", "https://lancedb.com", "Open-source + Cloud", "oss", false, "Multimodal columnar"],
    ["FAISS", "https://github.com/facebookresearch/faiss", "Open-source", "oss", false, "Meta similarity search"],
    ["Elasticsearch", "https://www.elastic.co/elasticsearch", "Open + Cloud", "freemium", false, "Hybrid lexical + vector"],
    ["Turbopuffer", "https://turbopuffer.com", "Paid", "paid", true, "Object-storage vector search"],
    ["Amazon S3 Vectors", "https://aws.amazon.com/s3/features/vectors/", "Paid (usage)", "paid", true, "Vector buckets in S3"],
  ]},
  { id: "t-evals", key: "Evals", post: "& Observability", summary: "Test, trace and monitor LLM apps.", tools: [
    ["LangSmith", "https://smith.langchain.com", "Freemium", "freemium", false, "LangChain observability"],
    ["Langfuse", "https://langfuse.com", "Open-source + Cloud", "oss", false, "OSS LLM engineering platform"],
    ["Arize Phoenix", "https://phoenix.arize.com", "Open-source", "oss", false, "OTel-native observability"],
    ["Braintrust", "https://www.braintrust.dev", "Freemium", "freemium", false, "Eval-driven development"],
    ["Promptfoo", "https://www.promptfoo.dev", "Open-source", "oss", false, "CLI testing and red-teaming"],
    ["DeepEval", "https://github.com/confident-ai/deepeval", "Open-source", "oss", false, "Pytest-style metrics"],
    ["Ragas", "https://github.com/explodinggradients/ragas", "Open-source", "oss", false, "RAG metrics"],
    ["W&B Weave", "https://wandb.ai/site/weave", "Freemium", "freemium", false, "W&B LLM toolkit"],
    ["Helicone", "https://www.helicone.ai", "Open-source + Cloud", "oss", false, "Proxy logging and caching"],
    ["OpenAI Evals", "https://github.com/openai/evals", "Open-source + API", "oss", false, "Eval framework"],
    ["Inspect", "https://inspect.aisi.org.uk", "Open-source", "oss", true, "UK AISI eval framework"],
  ]},
  { id: "t-finetune", key: "Fine-Tuning", post: "& Training", summary: "Adapt models to your data.", tools: [
    ["Unsloth", "https://unsloth.ai", "Open-source", "oss", false, "Fast low-VRAM LoRA/QLoRA/GRPO"],
    ["Axolotl", "https://github.com/axolotl-ai-cloud/axolotl", "Open-source", "oss", false, "YAML-config training"],
    ["TRL", "https://github.com/huggingface/trl", "Open-source", "oss", false, "SFT / DPO / GRPO"],
    ["LLaMA-Factory", "https://github.com/hiyouga/LLaMA-Factory", "Open-source", "oss", false, "Unified UI/CLI"],
    ["torchtune", "https://github.com/pytorch/torchtune", "Open-source", "oss", false, "PyTorch recipes"],
    ["OpenAI fine-tuning", "https://platform.openai.com/docs/guides/fine-tuning", "Paid (per token)", "paid", true, "SFT, DPO, RFT"],
    ["Together AI", "https://www.together.ai", "Paid (usage)", "paid", false, "Fine-tune and serve open models"],
    ["Fireworks AI", "https://fireworks.ai", "Paid (usage)", "paid", false, "Fast serving + LoRA"],
    ["Modal", "https://modal.com", "Freemium", "freemium", false, "Serverless Python GPUs"],
    ["Tinker", "https://thinkingmachines.ai/tinker", "Paid", "paid", true, "Thinking Machines fine-tuning API"],
  ]},
  { id: "t-inference", key: "Inference", post: "& Local LLMs", summary: "Serve models fast, run them locally, route between providers.", tools: [
    ["vLLM", "https://github.com/vllm-project/vllm", "Open-source", "oss", false, "PagedAttention serving"],
    ["SGLang", "https://github.com/sgl-project/sglang", "Open-source", "oss", true, "RadixAttention serving"],
    ["TGI", "https://github.com/huggingface/text-generation-inference", "Open-source", "oss", false, "Hugging Face serving"],
    ["Ollama", "https://ollama.com", "Free", "free", false, "Run models locally"],
    ["LM Studio", "https://lmstudio.ai", "Free", "free", false, "GUI for local models"],
    ["llama.cpp", "https://github.com/ggml-org/llama.cpp", "Open-source", "oss", false, "C/C++ inference"],
    ["TensorRT-LLM", "https://github.com/NVIDIA/TensorRT-LLM", "Open-source", "oss", false, "NVIDIA-optimised inference"],
    ["Groq", "https://groq.com", "Freemium API", "freemium", false, "LPU low-latency"],
    ["Cerebras", "https://www.cerebras.ai", "Freemium API", "freemium", false, "Wafer-scale inference"],
    ["OpenRouter", "https://openrouter.ai", "Pay per token", "paid", false, "One API, many models"],
    ["LiteLLM", "https://github.com/BerriAI/litellm", "Open-source", "oss", false, "OpenAI-compatible proxy"],
    ["Portkey", "https://portkey.ai", "Freemium", "freemium", false, "Gateway + guardrails"],
  ]},
  { id: "t-cloud", key: "Cloud AI", post: "Platforms", summary: "Managed model platforms from the big clouds.", tools: [
    ["Amazon Bedrock", "https://aws.amazon.com/bedrock/", "Paid (usage)", "paid", true, "Models, Agents, Knowledge Bases, Guardrails"],
    ["Amazon SageMaker AI", "https://aws.amazon.com/sagemaker/", "Paid (usage)", "paid", false, "Train, tune, deploy"],
    ["Microsoft Foundry", "https://ai.azure.com", "Paid (usage)", "paid", true, "Ex-Azure AI Foundry: models, Agent Service, evals"],
    ["Google Vertex AI", "https://cloud.google.com/vertex-ai", "Paid (usage)", "paid", false, "Gemini, Model Garden"],
    ["Databricks Mosaic AI", "https://www.databricks.com/product/artificial-intelligence", "Paid", "paid", true, "Agents and evals on the lakehouse"],
    ["NVIDIA NIM", "https://build.nvidia.com", "Free dev tier", "freemium", false, "Optimised model containers"],
  ]},
  { id: "t-media", key: "Image, Video", post: "& Voice", summary: "Generate images, video, speech and music.", tools: [
    ["Midjourney", "https://www.midjourney.com", "Paid (~$10/mo)", "paid", true, "Aesthetic images, now video"],
    ["GPT Image", "https://platform.openai.com/docs/guides/image-generation", "Freemium / API", "freemium", true, "Native GPT image generation"],
    ["FLUX", "https://bfl.ai", "Open-weight + API", "freemium", false, "Black Forest Labs models"],
    ["Stable Diffusion", "https://stability.ai", "Open-weight", "oss", false, "Open diffusion"],
    ["Ideogram", "https://ideogram.ai", "Freemium", "freemium", false, "Text in images"],
    ["Runway", "https://runwayml.com", "Freemium", "freemium", false, "Video generation and editing"],
    ["Sora", "https://openai.com/sora", "ChatGPT plans / app", "paid", true, "Video with audio (Sora 2)"],
    ["Veo", "https://deepmind.google/models/veo/", "Via Gemini / Vertex", "paid", true, "Video with native audio (Veo 3)"],
    ["Kling", "https://klingai.com", "Freemium", "freemium", false, "Kuaishou video"],
    ["Pika", "https://pika.art", "Freemium", "freemium", false, "Short-form effects"],
    ["ElevenLabs", "https://elevenlabs.io", "Freemium", "freemium", false, "TTS, cloning, voice agents"],
    ["Suno", "https://suno.com", "Freemium", "freemium", false, "Text to song"],
    ["Udio", "https://www.udio.com", "Freemium", "freemium", false, "Text to music"],
  ]},
  { id: "t-productivity", key: "Productivity", post: "& Research", summary: "Notes, research, slides and meetings.", tools: [
    ["NotebookLM", "https://notebooklm.google", "Free (+Plus)", "free", true, "Source-grounded notes, Video Overviews"],
    ["Perplexity", "https://www.perplexity.ai", "Freemium", "freemium", false, "Deep Research"],
    ["Notion AI", "https://www.notion.com/product/ai", "Paid", "paid", false, "AI in docs and meetings"],
    ["Gamma", "https://gamma.app", "Freemium", "freemium", false, "Prompt to deck"],
    ["Otter.ai", "https://otter.ai", "Freemium", "freemium", false, "Transcription"],
    ["Granola", "https://www.granola.ai", "Freemium", "freemium", true, "Bot-free meeting notepad"],
    ["Napkin AI", "https://www.napkin.ai", "Freemium", "freemium", false, "Text to diagram"],
  ]},
  { id: "t-browser", key: "Browser", post: "& Computer-Use Agents", summary: "Agents that click, type and browse for you.", tools: [
    ["Claude in Chrome", "https://claude.ai", "Paid Claude plans", "paid", true, "Claude acting in Chrome"],
    ["ChatGPT Agent", "https://chatgpt.com", "Paid plans", "paid", true, "Tasks on a virtual computer"],
    ["ChatGPT Atlas", "https://chatgpt.com/atlas", "Free (agent paid)", "freemium", true, "OpenAI browser"],
    ["Perplexity Comet", "https://www.perplexity.ai/comet", "Free", "free", true, "Agentic browser"],
    ["Browser Use", "https://github.com/browser-use/browser-use", "Open-source + Cloud", "oss", true, "LLM-driven browsing"],
    ["Playwright MCP", "https://github.com/microsoft/playwright-mcp", "Open-source", "oss", true, "Browser tools for agents"],
    ["AgentCore Browser", "https://aws.amazon.com/bedrock/agentcore/", "Paid (usage)", "paid", true, "Sandboxed agent browser"],
  ]},
];
