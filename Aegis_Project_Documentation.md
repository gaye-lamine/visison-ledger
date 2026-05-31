# Aegis Command Center
**Enterprise Supply Chain AI Orchestration Platform**

## 1. Project Overview
Aegis is an advanced Supply Chain Command Center designed to integrate seamlessly with the UiPath Maestro ecosystem. It addresses critical supply chain disruptions (e.g., Force Majeure events, logistical bottlenecks, and geopolitical crises) by leveraging a multi-agent artificial intelligence architecture.

The platform monitors global events, predicts supply chain cascading failures, and autonomously formulates remediation strategies while keeping the human in the loop for final approval.

## 2. Core Architecture
The system is built upon a decoupled architecture ensuring scalability and ease of integration.

### 2.1 Backend (Python / FastAPI)
The backend operates as a headless orchestration engine, exposing five dedicated micro-services designed to be invoked by UiPath Coded Agents:
- `/api/v1/classify-disruption`: Ingests initial anomaly signals (e.g., NLP extraction from supplier documents or social sentiment triggers) and categorizes the severity and affected inventory.
- `/api/v1/assess-financial-impact`: Computes real-time financial exposure, utilizing external data feeds to dynamically adjust cost modeling.
- `/api/v1/research-suppliers`: Queries global databases for alternative supply routes.
- `/api/v1/compliance-check`: Validates candidates against Enterprise ESG (Environmental, Social, and Governance) metrics and international sanctions, and generates an XAI report.
- `/api/v1/execute-remediation`: Interfaces with the ERP system to commit the new purchase orders upon human approval.

### 2.2 Frontend (React / WebGL)
The client application provides a 3D geospatial visualization of the global supply chain network. It features:
- **Real-Time Data Streaming:** Server-Sent Events (SSE) provide a transparent view into the multi-agent decision-making process.
- **Predictive Analytics Dashboard:** Generates dynamic financial modeling charts comparing the cost of inaction versus strategic remediation.
- **Interactive Routing:** Visualizes alternative logistical routes via animated geographic arcs.

## 3. Advanced AI Capabilities

### 3.1 Autonomous Multi-Agent Debate
The system moves beyond sequential task execution by introducing inter-agent debate. For instance, if the Logistics Agent proposes a cost-effective supplier that violates ESG compliance, the Compliance Agent autonomously rejects the proposal and mandates the Logistics Agent to recalculate the route.

### 3.2 Real-Time Web Grounding
Financial and logistical agents are not restricted to static datasets. The architecture supports real-time API integrations (e.g., live currency exchange rates) to ensure that cost-benefit analyses reflect current market conditions.

### 3.3 Cascading Failure Analysis via Knowledge Graphs
The platform implements second-degree dependency analysis. The agents utilize supply chain knowledge graphs to identify hidden vulnerabilities, preventing the system from proposing alternative suppliers that rely on the same disrupted Tier-2 or Tier-3 vendors.

### 3.4 Agentic Code Execution
For complex logistical optimization (e.g., calculating the precise ratio of air freight to sea freight to minimize premium costs), the AI agents dynamically generate, compile, and execute optimization scripts within a secure sandbox, returning mathematically validated results rather than probabilistic estimations.

## 4. Enterprise-Grade Resilience (Phase 5 Additions)
To meet the stringent requirements of Fortune 500 supply chain operations, Aegis incorporates four advanced enterprise pillars:

### 4.1 Digital Twin Simulation (Monte Carlo Forecasting)
Prior to execution, the system runs a simulated Monte Carlo analysis across thousands of scenarios. It projects probabilistic disruption risks and median financial impacts, allowing human operators to validate decisions against mathematically rigorous risk models.

### 4.2 Temporal Knowledge Graph
The AI anticipates crises by correlating current events with historical geopolitical and meteorological data. For example, the system autonomously applies a temporal delay penalty to Southeast Asian routes during the monsoon season based on historical shipping delays.

### 4.3 Multi-Model Arbitration
Instead of relying on a single monolithic LLM, Aegis orchestrates a committee of specialized models (e.g., Quantitative Pricing Model, Legal/Compliance LLM, Logistics Route Model). The Arbitration System evaluates the confidence scores of each model to produce a final, weighted confidence metric, ensuring highly robust decision-making.

### 4.4 Explainable AI Layer (XAI)
To satisfy corporate audit and compliance requirements, Aegis replaces "black-box" decisions with an Explainable AI layer. Before final human approval, the system presents a strict justification report detailing:
- Risk simulation metrics.
- ESG and sanctions compliance status.
- N-tier dependency overlap verification.
- Verified estimated financial savings.

## 5. UiPath Integration Strategy
Aegis follows a strict API-first, "Zero-Code-Change" methodology regarding its integration with UiPath. 

Once deployed, UiPath Maestro will act as the master orchestrator. By creating customized Coded Agents that map directly to the five REST endpoints, UiPath Maestro can trigger the Aegis reasoning engine, ingest the structured JSON responses, and drive the UI state changes automatically.

## 6. Deployment Instructions
The application requires Node.js and Python 3.10+.

**Backend:**
```bash
cd agents
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
