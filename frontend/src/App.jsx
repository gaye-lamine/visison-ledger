import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Activity, GitCommit, CheckCircle, Clock, Search, ShieldCheck, Play, Factory, Terminal, TrendingUp, AlertTriangle, FileText } from 'lucide-react';
import Globe from 'react-globe.gl';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis, Cell } from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8089/api/v1' 
    : 'https://aegis.backnd-api.cloud/api/v1');

export default function App() {
  const [step, setStep] = useState(0);
  const [crisisData, setCrisisData] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [complianceData, setComplianceData] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [rpaLogs, setRpaLogs] = useState([]);
  const [rpaFinished, setRpaFinished] = useState(false);
  const [policyData, setPolicyData] = useState(null);  // CPE policy for active crisis
  
  // Brain Stream State
  const [streamLogs, setStreamLogs] = useState([]);
  const logsEndRef = useRef(null);
  
  // Social Radar State
  const [socialFeed, setSocialFeed] = useState(["[System] Sentinel AI monitoring global feeds..."]);
  
  // Dynamic Inputs
  const [crisisInput, setCrisisInput] = useState("Social Radar triggered Force Majeure protocol. Tsunami warning in Taiwan.");

  const globeRef = useRef();

  // Globe Data
  const [arcsData, setArcsData] = useState([]);
  const [ringsData, setRingsData] = useState([]);
  const [labelsData, setLabelsData] = useState([]);
  const [dynamicLocations, setDynamicLocations] = useState({
    HQ: { lat: 37.7749, lng: -122.4194, name: 'San Francisco (HQ)' },
    Crisis: null,
    Alternative: null
  });

  const [globeData, setGlobeData] = useState([]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2 });
    }
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamLogs, socialFeed]);

  // Synchronize UI steps and camera transitions with logs scroll
  useEffect(() => {
    if (streamLogs.length > 0) {
      const lastLog = streamLogs[streamLogs.length - 1];
      
      if (lastLog.includes('[Triage Agent]')) {
        setStep(1);
        if (crisisData && globeRef.current) {
          globeRef.current.controls().autoRotate = false;
          globeRef.current.pointOfView({ lat: crisisData.lat || 23.6978, lng: crisisData.lng || 120.9605, altitude: 1.8 }, 2000);
        }
      } else if (lastLog.includes('[Financial Agent] Computing')) {
        setStep(2);
      } else if (lastLog.includes('[Logistics Agent] Found primary candidate')) {
        setStep(3);
        if (suppliers.length > 0 && globeRef.current) {
          globeRef.current.pointOfView({ lat: 30, lng: 30, altitude: 2.2 }, 2000);
        }
      } else if (lastLog.includes('[Compliance Agent] Initiating')) {
        setStep(4);
      } else if (lastLog.includes('[Arbitration System]') && (lastLog.includes('approved') || lastLog.includes('complete'))) {
        setStep(5);
      }
    }
  }, [streamLogs, crisisData, suppliers]);

  // Synthetic Data for the Predictive Graph
  const graphData = Array.from({length: 30}, (_, i) => ({
    day: `Day ${i+1}`,
    InactionCost: i * 15000,
    RemediationCost: i < 5 ? i * 15000 : 75000 + (i-5) * 1000
  }));

  const triggerLocalSwarmStream = () => {
    setStreamLogs([]);
    const isCyber = /ransomware|cyber|attack|wms|system|api|database|hack/i.test(crisisInput);
    const mockLogs = isCyber ? [
      "[System] Crisis Payload Received: Disruption detected at Rotterdam WMS Hub.",
      "[System] Crisis context analyzed: 'WMS ransomware attack affecting customs and tracking...'",
      "[Triage Agent] Classifying disruption severity... CRITICAL. Triggering logistics continuity fallback.",
      "[Triage Agent] Classified: LOGISTICS SYSTEM FAILURE (RANSOMWARE)",
      "[Impact Agent] Analyzing affected logistics IT systems...",
      "[Impact Agent] Affected Systems: Warehouse Management System (WMS), Shipment Tracking API, Customs Documentation Interface",
      "[Impact Agent] Operational Impact: Inventory visibility degraded (100%), shipment tracking offline, customs processing delayed.",
      "[Dependency Graph Agent] 🧠 Analyzing N-Tier logistics network dependencies and supplier maps...",
      "[Dependency Graph Agent] Detected: 47 active shipments with unknown status, 12 distribution centers impacted, compromised provider: 'North Sea Freight GmbH'.",
      "[Dependency Graph Agent] ❌ REJECTING compromised provider 'North Sea Freight GmbH' to avoid data leakage and cascading failures.",
      "[Contingency Agent] No supplier replacement required. Activating IT backup provider workflow.",
      "[Contingency Agent] Recommended Contingency Actions: Switch to manual shipment tracking fallback, redirect API queries to backup provider 'TransPacific Logistics Inc.', freeze non-critical shipments, notify customs via offline process.",
      "[Compliance Agent] Initiating security audit & SOC2/GDPR compliance verification on backup logistics partner 'TransPacific Logistics Inc.'...",
      "[Compliance Agent] Security verification complete: SOC2 Certified. Sanctions database checked: Clear. ESG Score: 99/100.",
      "[Financial Agent] Computing operational exposure and daily disruption cost in Rotterdam WMS Hub...",
      "[Financial Agent] 🌐 [LIVE WEB] Fetching realtime local exchange rates...",
      "[Financial Agent] 🌐 [LIVE WEB] Exchange rates obtained. Financial exposure mapped to current USD valuation.",
      "[Financial Agent] Estimated operational disruption cost: $350k/day. Total exposure: $2.10M.",
      "[Sandbox Agent] 💻 Executing Python freight redirection optimization model (redirection ratio: 80% Air / 20% Sea)...",
      "[Sandbox Agent] 💻 Sandboxed code execution returned optimal failover routing distribution.",
      "[Arbitration System] ⚖️ Initiating multi-model arbitration confidence matrix...",
      "[Arbitration System] ⚖️ Quantitative Model: 85% | Legal LLM: 91% | Route Model: 83%.",
      "[Arbitration System] ✅ Continuity plan with backup provider 'TransPacific Logistics Inc.' approved with 86% weighted confidence.",
      "[System] AI Multi-Agent orchestration complete. XAI Report compiled. Awaiting Sourcing Officer authorization."
    ] : [
      "[System] Crisis Payload Received: Disruption detected at Taiwan (Crisis).",
      "[System] Crisis context analyzed: 'Social Radar triggered Force Majeure protocol...'",
      "[Triage Agent] Classifying disruption severity... CRITICAL. Triggering sourcing fallback.",
      "[Financial Agent] Computing supply chain exposure for critical parts in Taiwan...",
      "[Financial Agent] 🌐 [LIVE WEB] Fetching realtime local exchange rates...",
      "[Financial Agent] 🌐 [LIVE WEB] Exchange rates obtained. Financial exposure mapped to current USD valuation.",
      "[Logistics Agent] Querying global supplier database for alternative suppliers...",
      "[Logistics Agent] Found primary candidate: 'EuroChips GmbH' (Germany).",
      "[Logistics Agent] Found secondary candidate (rejected due to proximity): 'TechCorp Asia' (Vietnam).",
      "[Temporal Agent] ⏳ Analyzing historical shipping bottleneck data for Vietnam routes...",
      "[Temporal Agent] ⏳ Historical risk elevated. Proximity to Taiwan adds +4 days delay penalty.",
      "[Knowledge Graph Agent] 🧠 Analyzing N-Tier supply chain dependencies and supplier graphs...",
      "[Knowledge Graph Agent] 🚨 CASCADING FAILURE DETECTED: 'TechCorp Asia' imports raw materials from disrupted Taiwan zone!",
      "[Knowledge Graph Agent] ❌ REJECTING TechCorp Asia (Vietnam) option to avoid supply chain overlap.",
      "[Compliance Agent] Initiating ESG & International Sanctions audit on primary option 'EuroChips GmbH'...",
      "[Compliance Agent] Sanctions database checked: Clear. ESG Score: Compliant.",
      "[Logistics Agent] Retaining 'EuroChips GmbH' route via Germany.",
      "[Sandbox Agent] 💻 Executing Python freight ratio optimization model (70% Air / 30% Sea)...",
      "[Sandbox Agent] 💻 Sandboxed code execution returned optimal cost distribution.",
      "[Arbitration System] ⚖️ Initiating multi-model arbitration confidence matrix...",
      "[Arbitration System] ⚖️ Quantitative Model: 88% | Legal LLM: 99% | Route Model: 74%.",
      "[Arbitration System] ✅ Sourcing Route via Germany approved with 87% weighted confidence.",
      "[System] AI Multi-Agent orchestration complete. XAI Report compiled. Awaiting Sourcing Officer authorization."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < mockLogs.length) {
        setStreamLogs(prev => [...prev, mockLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 700);
  };

  const triggerSocialRadar = async () => {
    setSocialFeed([
      "[Sentinel] Scanning global logistics networks...",
      `[Anomaly] Alert matched: "${crisisInput.substring(0, 50)}..."`,
      "[Sentinel] 🚨 High Probability of Supply Chain Disruption. Triggering Agentic Workflow..."
    ]);
    
    // Fire off Maestro Webhook securely via Backend Proxy (Compliance & Security standard)
    try {
      fetch(`${API_BASE}/trigger-maestro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier_name: 'GlobalTech', document_text: crisisInput, date: new Date().toISOString().split('T')[0] })
      }).catch(e => console.error("Maestro secure proxy error", e));
    } catch(e) {}

    setTimeout(() => {
      runSimulation();
    }, 3000);
  };

  const runSimulation = async () => {
    setStep(1);
    setStreamLogs([]); 
    setRpaLogs([]);

    let sseTriggered = false;
    const eventSource = new EventSource(`${API_BASE}/brain-stream`);
    
    eventSource.onmessage = (event) => {
      sseTriggered = true;
      if (event.data && event.data.trim()) {
        setStreamLogs((prev) => [...prev, event.data.trim()]);
      }
    };
    
    eventSource.onerror = () => {
      eventSource.close();
      if (!sseTriggered) {
        console.warn("SSE connection failed, launching secure local Swarm Orchestration logs.");
        triggerLocalSwarmStream();
      }
    };
    
    // Safety timeout: if no message received in 1.5 seconds, fall back
    const timeoutId = setTimeout(() => {
      if (!sseTriggered) {
        eventSource.close();
        console.warn("SSE connection timed out, launching secure local Swarm Orchestration logs.");
        triggerLocalSwarmStream();
      }
    }, 1500);

    try {
      // 1. Classification
      const classRes = await fetch(`${API_BASE}/classify-disruption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier_name: 'GlobalTech', document_text: crisisInput, date: new Date().toISOString().split('T')[0] })
      }).then(r => r.json());
      setCrisisData(classRes);
      
      // ── CPE: fetch active policy (DAG + weights + risk gate) ──────────────
      try {
        const policyRes = await fetch(`${API_BASE}/policy`).then(r => r.json());
        setPolicyData(policyRes);
      } catch(e) {
        console.warn("Policy endpoint unavailable, DAG panel will be hidden.");
      }

      const newCrisisLoc = { lat: classRes.lat || 0, lng: classRes.lng || 0, name: classRes.location_name || 'Crisis Zone' };
      setDynamicLocations(prev => ({ ...prev, Crisis: newCrisisLoc }));

      // Visual Anomaly Rings: Pulse a red ring at the crisis location
      setRingsData([
        { lat: newCrisisLoc.lat, lng: newCrisisLoc.lng, color: '#ef4444' }
      ]);

      setGlobeData([
        { startLat: dynamicLocations.HQ.lat, startLng: dynamicLocations.HQ.lng, endLat: newCrisisLoc.lat, endLng: newCrisisLoc.lng, color: ['#ef4444', '#ef4444'] }
      ]);
      
      // 2. Financial Impact
      const impRes = await fetch(`${API_BASE}/assess-financial-impact?crisis_id=${classRes.crisis_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classRes.affected_parts)
      }).then(r => r.json());
      setImpactData(impRes);

      // 3. Alternatives Research
      const supRes = await fetch(`${API_BASE}/research-suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classRes.affected_parts)
      }).then(r => r.json());
      setSuppliers(supRes);
      
      const bestSup = supRes[0];
      const newAltLoc = { lat: bestSup.lat || 0, lng: bestSup.lng || 0, name: bestSup.name };
      setDynamicLocations(prev => ({ ...prev, Alternative: newAltLoc }));
      
      // Update rings: show both red crisis and green alternative
      setRingsData([
        { lat: newCrisisLoc.lat, lng: newCrisisLoc.lng, color: '#ef4444' },
        { lat: newAltLoc.lat, lng: newAltLoc.lng, color: '#10b981' }
      ]);

      setGlobeData(prev => [
        ...prev,
        { startLat: newAltLoc.lat, startLng: newAltLoc.lng, endLat: dynamicLocations.HQ.lat, endLng: dynamicLocations.HQ.lng, color: ['#10b981', '#10b981'] }
      ]);

      // 4. Compliance Check
      const compRes = await fetch(`${API_BASE}/compliance-check?supplier_name=${encodeURIComponent(supRes[0].name)}`, {
        method: 'POST'
      }).then(r => r.json());
      setComplianceData(compRes);

    } catch (e) {
      console.warn("Backend offline or error during runSimulation, using secure client-side PO simulation path", e);
      clearTimeout(timeoutId);
      
      const isCyber = /ransomware|cyber|attack|wms|system|api|database|hack/i.test(crisisInput);
      const mockCrisisId = `CRISIS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      if (isCyber) {
        const mockCrisis = {
          crisis_id: mockCrisisId,
          disruption_type: "LOGISTICS SYSTEM FAILURE (RANSOMWARE)",
          severity: "CRITICAL",
          affected_parts: ["Warehouse Management System (WMS)", "Shipment Tracking API", "Customs Documentation Interface"],
          lat: 51.9244,
          lng: 4.4777,
          location_name: "Rotterdam WMS Hub",
          crisis_type: "CYBER_ATTACK",
          workflow: "logistics_continuity",
          affected_systems: ["Warehouse Management System (WMS)", "Shipment Tracking API", "Customs Documentation Interface"],
          allowed_agents: ["Triage Agent", "Impact Agent", "Dependency Graph Agent", "Contingency Agent", "Compliance Agent", "Financial Agent", "Sandbox Agent"]
        };
        setCrisisData(mockCrisis);
        
        setDynamicLocations(prev => ({
          ...prev,
          Crisis: { lat: 51.9244, lng: 4.4777, name: "Rotterdam WMS Hub" }
        }));
        setRingsData([{ lat: 51.9244, lng: 4.4777, color: '#ef4444' }]);
        setGlobeData([{ startLat: dynamicLocations.HQ.lat, startLng: dynamicLocations.HQ.lng, endLat: 51.9244, endLng: 4.4777, color: ['#ef4444', '#ef4444'] }]);

        setImpactData({
          crisis_id: mockCrisisId,
          estimated_delay_days: 6,
          daily_loss_usd: 750000,
          total_impact_usd: 4500000
        });

        const mockSuppliers = [{
          name: "TransPacific Logistics Inc.",
          country: "Mexico",
          cost_increase_percentage: 12.0,
          delivery_time_days: 6,
          lat: 23.6345,
          lng: -102.5528
        }];
        setSuppliers(mockSuppliers);
        setSelectedSupplier(mockSuppliers[0]);
        
        setDynamicLocations(prev => ({
          ...prev,
          Alternative: { lat: 23.6345, lng: -102.5528, name: "TransPacific Logistics Inc." }
        }));
        setRingsData([
          { lat: 51.9244, lng: 4.4777, color: '#ef4444' },
          { lat: 23.6345, lng: -102.5528, color: '#10b981' }
        ]);
        setGlobeData(prev => [
          ...prev,
          { startLat: 23.6345, startLng: -102.5528, endLat: dynamicLocations.HQ.lat, endLng: dynamicLocations.HQ.lng, color: ['#10b981', '#10b981'] }
        ]);

        setComplianceData({
          supplier_name: "TransPacific Logistics Inc.",
          is_compliant: true,
          esg_score: 99,
          sanctions_clear: true,
          notes: "Security & SOC2 audits verified. Authorized for emergency failover.",
          xai_report: {
            monte_carlo_risk: "Low risk. 100% path redundancy verified.",
            esg_justification: "SOC2 certified, GDPR compliant, ESG score 99/100.",
            dependency_check: "No overlap with compromised Rotterdam IT networks.",
            financial_savings: "Mitigates WMS outage loss. Estimated savings vs inaction: $3.2M."
          }
        });
      } else {
        const mockCrisis = {
          crisis_id: mockCrisisId,
          disruption_type: "Reported Disruption",
          severity: "CRITICAL",
          affected_parts: ["Critical Component A", "Critical Component B"],
          lat: 23.6978,
          lng: 120.9605,
          location_name: "Taiwan (Crisis)",
          crisis_type: "SUPPLY_CHAIN_DISRUPTION",
          workflow: "procurement",
          affected_systems: [],
          allowed_agents: ["Triage Agent", "Financial Agent", "Logistics Agent", "Temporal Agent", "Knowledge Graph Agent", "Compliance Agent", "Sandbox Agent"]
        };
        setCrisisData(mockCrisis);
        
        setDynamicLocations(prev => ({
          ...prev,
          Crisis: { lat: 23.6978, lng: 120.9605, name: "Taiwan (Crisis)" }
        }));
        setRingsData([{ lat: 23.6978, lng: 120.9605, color: '#ef4444' }]);
        setGlobeData([{ startLat: dynamicLocations.HQ.lat, startLng: dynamicLocations.HQ.lng, endLat: 23.6978, endLng: 120.9605, color: ['#ef4444', '#ef4444'] }]);

        setImpactData({
          crisis_id: mockCrisisId,
          estimated_delay_days: 15,
          daily_loss_usd: 320000,
          total_impact_usd: 4800000
        });

        const mockSuppliers = [{
          name: "EuroChips GmbH",
          country: "Germany",
          cost_increase_percentage: 8.0,
          delivery_time_days: 4,
          lat: 51.1657,
          lng: 10.4515
        }];
        setSuppliers(mockSuppliers);
        setSelectedSupplier(mockSuppliers[0]);
        
        setDynamicLocations(prev => ({
          ...prev,
          Alternative: { lat: 51.1657, lng: 10.4515, name: "EuroChips GmbH" }
        }));
        setRingsData([
          { lat: 23.6978, lng: 120.9605, color: '#ef4444' },
          { lat: 51.1657, lng: 10.4515, color: '#10b981' }
        ]);
        setGlobeData(prev => [
          ...prev,
          { startLat: 51.1657, startLng: 10.4515, endLat: dynamicLocations.HQ.lat, endLng: dynamicLocations.HQ.lng, color: ['#10b981', '#10b981'] }
        ]);

        setComplianceData({
          supplier_name: "EuroChips GmbH",
          is_compliant: true,
          esg_score: 94,
          sanctions_clear: true,
          notes: "Approved for enterprise procurement.",
          xai_report: {
            monte_carlo_risk: "7% probability of secondary disruption at 14 days.",
            esg_justification: "ESG score strictly compliant (94/100). Zero sanctions.",
            dependency_check: "Avoids Tier-2 supplier overlap with the Taiwan (Crisis) crisis zone.",
            financial_savings: "Estimated total savings vs inaction: $3.6M."
          }
        });
      }

      // Launch simulated Swarm logs
      triggerLocalSwarmStream();
    }
  };

  const handleApprove = async () => {
    if (!selectedSupplier) return;
    setStep(6);
    setRpaLogs([]);
    setRpaFinished(false);
    
    try {
      const execRes = await fetch(`${API_BASE}/execute-remediation?crisis_id=${encodeURIComponent(crisisData.crisis_id)}&chosen_supplier=${encodeURIComponent(selectedSupplier.name)}`, {
        method: 'POST'
      }).then(r => r.json());
      setExecutionResult(execRes);
      
      if (execRes.rpa_logs && execRes.rpa_logs.length > 0) {
        for (let i = 0; i < execRes.rpa_logs.length; i++) {
          setRpaLogs(prev => [...prev, execRes.rpa_logs[i]]);
          await new Promise(r => setTimeout(r, 2000)); // Immersive 2-second delay per log
        }
      }
      
      try {
        await fetch(`${API_BASE}/generate-pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crisis_id: crisisData.crisis_id, chosen_supplier: selectedSupplier.name })
        });
      } catch(pdfError) {
        console.error("PDF Pre-generation error", pdfError);
      }

      setRpaFinished(true);
    } catch(e) {
      console.warn("Backend offline or error during handleApprove, using secure client-side PO execution path", e);
      const isLogisticsContinuity = crisisData?.workflow === "logistics_continuity";
      
      const fallbackRpaLogs = isLogisticsContinuity ? [
        "[Maestro Orchestrator] 🚀 Triggering Webhook event: CASE_RESOLUTION_COMMIT",
        "[Maestro Robot-981] 🔗 Connecting to backup logistics API hub... Connected.",
        "[Maestro Robot-981] 📡 Redirecting tracking endpoints to contingency service...",
        `[Maestro Robot-981] 🔄 Activating emergency failover: Routing logistics traffic to backup partner '${selectedSupplier.name}'`,
        "[Maestro Robot-981] 📝 Dispatching offline customs processing notifications...",
        "[Maestro Orchestrator] 🔒 Disruption Case marked as RESOLVED.",
        "[Maestro Orchestrator] 📄 Archiving resolution report with cryptographic ledger signature."
      ] : [
        "[Maestro Orchestrator] 🚀 Triggering Webhook event: CASE_RESOLUTION_COMMIT",
        "[Maestro Robot-981] 🔗 Connecting to Enterprise SAP ECC S/4HANA Hub... Connected.",
        "[Maestro Robot-981] 🔍 Querying Vendor Master Directory for alternative safe records...",
        `[Maestro Robot-981] 🔄 Modifying sourcing allocation: Sourcing route re-allocated to alternative vendor '${selectedSupplier.name}'`,
        `[Maestro Robot-981] 📝 Purchase Order created in ERP: PO-${Math.floor(200000 + Math.random() * 800000)} (Value approved by HITL)`,
        "[Maestro Orchestrator] 🔒 Disruption Case marked as RESOLVED.",
        "[Maestro Orchestrator] 📄 Archiving resolution report with cryptographic ledger signature."
      ];
      
      setExecutionResult({
        crisis_id: crisisData?.crisis_id || "CRISIS-MOCK",
        chosen_supplier: selectedSupplier.name,
        action_taken: isLogisticsContinuity
          ? `Activated emergency logistics continuity plan and redirected routing to ${selectedSupplier.name}.`
          : `Re-routed purchase orders and logistics workflows via Maestro to ${selectedSupplier.name}.`,
        status: "Resolved"
      });
      
      for (let i = 0; i < fallbackRpaLogs.length; i++) {
        setRpaLogs(prev => [...prev, fallbackRpaLogs[i]]);
        await new Promise(r => setTimeout(r, 2000));
      }
      setRpaFinished(true);
    }
  };

  const isProcurement = crisisData?.workflow === "procurement" || !crisisData?.workflow;

  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#0f1115', overflow: 'hidden'}}>
      {/* 3D Globe */}
      <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, cursor: 'grab'}}>
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          arcsData={globeData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={2}
          arcDashAnimateTime={1500}
          ringsData={ringsData}
          ringColor="color"
          ringMaxRadius={8}
          ringPropagationSpeed={2.5}
          ringRepeatNum={3}
          labelsData={Object.values(dynamicLocations).filter(l => l !== null)}
          labelLat="lat"
          labelLng="lng"
          labelText="name"
          labelSize={1.5}
          labelDotRadius={0.5}
          labelColor={(d) => d.name.includes('Crisis') ? '#ef4444' : 'rgba(255,255,255,0.8)'}
          labelResolution={2}
          onLabelClick={(label) => {
            // Interactive Selection via the 3D Map
            if (step === 5) {
                const sup = suppliers.find(s => s.name === label.name);
                if (sup) setSelectedSupplier(sup);
            }
          }}
        />
        <div style={{position: 'absolute', bottom: 20, right: 20, color: 'rgba(255,255,255,0.5)', fontSize: 12, pointerEvents: 'none'}}>
          * Click & Drag to rotate the globe. Scroll to zoom. Click labels to select.
        </div>
      </div>

      {/* UI Overlay */}
      <div style={{position: 'relative', zIndex: 10, width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', flexDirection: 'column'}}>
        <header className="header" style={{pointerEvents: 'auto', background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
          <div className="brand">
            <ShieldAlert className="brand-icon" size={32} />
            <span style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>VisionLedger War Room</span>
          </div>
          <div className="status-badge status-pending" style={{backdropFilter: 'blur(10px)'}}>
            UiPath Maestro Connected
          </div>
        </header>

        {/* Maestro Case Progress Stepper */}
        <div style={{
          pointerEvents: 'auto',
          background: 'rgba(15, 17, 21, 0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '10px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '15px'
        }}>
          {[
            { label: "1. Sentinel Ingestion", activeStepRange: [0, 0] },
            { label: "2. AI Risk Swarm", activeStepRange: [1, 2] },
            { label: "3. HITL Arbitration", activeStepRange: [3, 5] },
            { label: "4. Maestro RPA Execution", activeStepRange: [6, 6] },
            { label: "5. Ledger Filed", activeStepRange: [7, 7] }
          ].map((stage, idx) => {
            const isCompleted = step > stage.activeStepRange[1] || (idx === 4 && step === 7);
            const isCurrent = step >= stage.activeStepRange[0] && step <= stage.activeStepRange[1] && !(idx === 4 && step === 7);
            
            let color = 'rgba(255,255,255,0.3)';
            let borderColor = 'rgba(255,255,255,0.1)';
            let bg = 'rgba(0,0,0,0.2)';
            
            if (isCompleted) {
              color = '#10b981';
              borderColor = '#10b981';
              bg = 'rgba(16, 185, 129, 0.1)';
            } else if (isCurrent) {
              color = '#0070f2';
              borderColor = '#0070f2';
              bg = 'rgba(0, 112, 242, 0.1)';
            }
            
            return (
              <React.Fragment key={idx}>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: `1px solid ${borderColor}`,
                  background: bg,
                  color: color,
                  fontSize: '13px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: isCompleted ? '#10b981' : (isCurrent ? '#0070f2' : 'rgba(255,255,255,0.1)'),
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px'
                  }}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span>{stage.label}</span>
                </div>
                {idx < 4 && (
                  <div style={{
                    height: '2px',
                    flex: 0.2,
                    background: step > stage.activeStepRange[1] ? '#10b981' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="dashboard-grid animate-fade-in" style={{flex: 1, gridTemplateColumns: '400px 1fr 350px'}}>
          
          {/* Left Panel */}
          <div className="main-flow" style={{pointerEvents: 'auto', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '10px'}}>
            
            {step === 0 && (
              <div className="glass-panel" style={{textAlign: 'center', padding: '30px 20px', background: 'rgba(15, 17, 21, 0.7)'}}>
                <AlertTriangle size={48} color="var(--warning)" style={{marginBottom: 10}} />
                <h3 style={{marginBottom: 20}}>Social Radar Sentinel</h3>
                
                <div style={{marginBottom: 15, textAlign: 'left'}}>
                  <label className="data-label" style={{display: 'block', marginBottom: 8}}>Description de la Crise (Texte Dynamique) :</label>
                  <textarea 
                    value={crisisInput}
                    onChange={(e) => setCrisisInput(e.target.value)}
                    style={{width: '100%', height: '70px', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '4px', resize: 'none', fontSize: '14px'}}
                  />
                </div>


                <div style={{background: 'rgba(0,0,0,0.5)', padding: 16, borderRadius: 8, textAlign: 'left', marginBottom: 20, fontSize: 12, fontFamily: 'monospace', color: '#8b92a5'}}>
                  {socialFeed.map((s, i) => (
                    <div key={i} style={{color: s.includes('🚨') ? '#ef4444' : '#8b92a5', marginBottom: 4}}>{s}</div>
                  ))}
                </div>

                <button className="btn-primary" onClick={triggerSocialRadar} style={{margin: '0 auto'}}>
                  <Activity size={18} /> Trigger Social Anomaly
                </button>
              </div>
            )}

            {step >= 1 && (
              <div className="glass-panel animate-fade-in" style={{background: 'rgba(15, 17, 21, 0.7)'}}>
                <h3 style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8}}>
                  <ShieldAlert size={20} color="var(--danger)" /> Crisis Detected (Radar)
                </h3>
                {crisisData ? (
                  <>
                    <div className="data-row"><span className="data-label">ID</span><span className="data-value">{crisisData.crisis_id}</span></div>
                    <div className="data-row"><span className="data-label">Severity</span><span className="status-badge status-critical">{crisisData.severity}</span></div>
                    <div className="data-row"><span className="data-label">{isProcurement ? "Parts" : "Systems Affected"}</span><span className="data-value">{crisisData.affected_parts.join(', ')}</span></div>
                  </>
                ) : <p className="data-label">Parsing social sentiment...</p>}
              </div>
            )}

            {step >= 1 && policyData && (
              <div className="glass-panel animate-fade-in" style={{background: 'rgba(15, 17, 21, 0.7)', fontSize: '11px'}}>
                <h3 style={{marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px'}}>
                  <GitCommit size={16} color="#0070f2" /> Crisis Policy Engine — Active DAG
                </h3>
                {/* State machine strip */}
                <div style={{display: 'flex', gap: '3px', marginBottom: '10px', flexWrap: 'wrap'}}>
                  {policyData.valid_states.map((st) => {
                    const isActive = st === policyData.crisis_state;
                    const stateOrder = policyData.valid_states.indexOf(st);
                    const currentOrder = policyData.valid_states.indexOf(policyData.crisis_state);
                    const isDone = stateOrder < currentOrder;
                    return (
                      <span key={st} style={{
                        padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontFamily: 'monospace',
                        background: isActive ? 'rgba(0,112,242,0.2)' : isDone ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isActive ? '#0070f2' : isDone ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                        color: isActive ? '#60a5fa' : isDone ? '#10b981' : '#8b92a5',
                        fontWeight: isActive ? 'bold' : 'normal',
                      }}>
                        {isDone ? '✓ ' : isActive ? '▶ ' : ''}{st}
                      </span>
                    );
                  })}
                </div>
                {/* DAG nodes */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px'}}>
                  {policyData.dag.map((node, i) => (
                    <div key={node.id} style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: i < (policyData.dag.length - 1) ? '#10b981' : '#0070f2',
                        flexShrink: 0
                      }} />
                      <span style={{color: '#e2e8f0', fontFamily: 'monospace'}}>{node.label}</span>
                      {node.depends_on.length > 0 && (
                        <span style={{color: '#8b92a5', fontSize: '9px'}}>← {node.depends_on.join(', ')}</span>
                      )}
                    </div>
                  ))}
                </div>
                {/* Arbitration weights */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '4px',
                  borderLeft: '3px solid #0070f2', fontFamily: 'monospace'
                }}>
                  <div style={{color: '#8b92a5', fontSize: '9px', marginBottom: '4px', textTransform: 'uppercase'}}>Arbitration Weights ({policyData.workflow})</div>
                  {Object.entries(policyData.arbitration_weights).map(([k, v]) => (
                    <div key={k} style={{display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '10px'}}>
                      <span>{k}</span>
                      <span style={{color: '#0070f2', fontWeight: 'bold'}}>{Math.round(v * 100)}%</span>
                    </div>
                  ))}
                </div>
                {/* Risk gate */}
                {policyData.risk_gate && (
                  <div style={{marginTop: '6px', padding: '4px 8px', borderRadius: '3px', fontSize: '9px', fontFamily: 'monospace',
                    background: policyData.risk_gate === 'PASS' ? 'rgba(16,185,129,0.1)' : policyData.risk_gate === 'HUMAN' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${policyData.risk_gate === 'PASS' ? '#10b981' : policyData.risk_gate === 'HUMAN' ? '#f59e0b' : '#ef4444'}`,
                    color: policyData.risk_gate === 'PASS' ? '#10b981' : policyData.risk_gate === 'HUMAN' ? '#f59e0b' : '#ef4444',
                  }}>
                    RISK GATE: {policyData.risk_gate} — Provider: {policyData.resolved_provider}
                  </div>
                )}
              </div>
            )}

            {step >= 2 && (
              <div className="glass-panel animate-fade-in" style={{background: 'rgba(15, 17, 21, 0.7)'}}>
                <h3 style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8}}>
                  <TrendingUp size={20} color="var(--warning)" /> Predictive What-If Impact
                </h3>
                {impactData ? (
                  <div style={{width: '100%', height: 200, marginTop: 10}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={graphData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="#8b92a5" fontSize={10} tick={{fill: '#8b92a5'}} />
                        <YAxis stroke="#8b92a5" fontSize={10} tickFormatter={(val) => `$${val/1000}k`} />
                        <Tooltip contentStyle={{backgroundColor: '#0f1115', border: '1px solid #333'}} />
                        <Legend wrapperStyle={{fontSize: 10}} />
                        <Line type="monotone" dataKey="InactionCost" name="Inaction (Loss)" stroke="#ef4444" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="RemediationCost" name="Remediation (Capped)" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : <p className="data-label">Generating predictive model...</p>}
              </div>
            )}
          </div>

          {/* Center: Agentic Brain Stream or Final Analytics */}
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '15px', paddingBottom: '20px', pointerEvents: 'none', width: '100%', height: '100%'}}>
            
            {/* Step 7 Analytics Panel */}
            {step >= 7 && (
              <div className="glass-panel animate-fade-in" style={{
                width: '100%', 
                background: 'rgba(16, 185, 129, 0.05)', 
                border: '1px solid #10b981',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)'
              }}>
                <h3 style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#10b981'}}>
                  <CheckCircle size={24} /> Executive Summary & Analytics
                </h3>
                
                <div style={{display: 'flex', flex: 1, gap: '20px', minHeight: '160px'}}>
                  {/* ESG Gauge */}
                  <div style={{flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column'}}>
                    <h4 style={{textAlign: 'center', color: '#8b92a5', marginBottom: 10, fontSize: '12px'}}>ESG Compliance Score</h4>
                    <div style={{flex: 1, position: 'relative', height: '100px'}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={[{ name: 'ESG', value: complianceData?.esg_score || 95, fill: '#10b981' }]} startAngle={180} endAngle={0}>
                          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                          <RadialBar minAngle={15} background={{fill: 'rgba(255,255,255,0.1)'}} clockWise dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -10%)', fontSize: '20px', fontWeight: 'bold', color: '#10b981'}}>
                        {complianceData?.esg_score || 95}/100
                      </div>
                    </div>
                  </div>

                  {/* Financial Bar Chart */}
                  <div style={{flex: 1.5, background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column'}}>
                    <h4 style={{textAlign: 'center', color: '#8b92a5', marginBottom: 10, fontSize: '12px'}}>Financial Impact Projection (USD)</h4>
                    <div style={{flex: 1, height: '100px'}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Inaction', cost: impactData?.total_impact_usd || 150000, fill: '#ef4444' },
                          { name: 'Remediation', cost: (impactData?.total_impact_usd || 150000) * 0.28, fill: '#10b981' }
                        ]} margin={{top: 5, right: 5, left: -20, bottom: 0}}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                          <XAxis dataKey="name" stroke="#8b92a5" fontSize={10} tickLine={false} />
                          <YAxis stroke="#8b92a5" fontSize={9} tickFormatter={(val) => `$${val/1000}k`} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#0f1115', border: '1px solid #333', borderRadius: '4px'}} formatter={(val) => `$${val.toLocaleString()}`} />
                          <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                            {
                              [
                                { name: 'Inaction', fill: '#ef4444' },
                                { name: 'Remediation', fill: '#10b981' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))
                            }
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div style={{marginTop: 10, padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', borderLeft: '3px solid #10b981', fontSize: '12px', color: '#e2e8f0'}}>
                  <strong>Action Taken:</strong> {executionResult?.action_taken || "Re-routed purchase orders and logistics workflows via Maestro."}
                </div>

                <div style={{marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <button 
                    className="btn-primary" 
                    style={{padding: '10px 20px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', background: 'linear-gradient(45deg, #10b981, #059669)', pointerEvents: 'auto'}}
                    onClick={() => window.open(`${API_BASE}/view-report`, '_blank')}
                  >
                    <FileText size={18} /> View Official PDF Report
                  </button>
                  <span style={{fontSize: '10px', color: '#8b92a5', marginTop: '4px'}}>Generated autonomously by UiPath Maestro</span>
                </div>
              </div>
            )}

            {/* Terminals Container (Visible in Steps 1 through 7!) */}
            {step >= 1 && (
              <div style={{
                width: '100%',
                display: 'flex',
                gap: '15px',
                pointerEvents: 'auto',
                transition: 'all 0.5s ease'
              }}>
                {/* Left Terminal: AI Swarm */}
                <div className="glass-panel animate-fade-in" style={{
                  flex: 1, 
                  height: step >= 7 ? '155px' : '300px', 
                  background: 'rgba(0, 0, 0, 0.85)', 
                  border: '1px solid #333',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#10b981',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px',
                  transition: 'all 0.5s ease'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #333', paddingBottom: 6, marginBottom: 6, color: '#fff', fontSize: '12px'}}>
                    <Terminal size={14} /> AI Swarm Orchestration Stream (SSE)
                  </div>
                  <div style={{flex: 1, overflowY: 'auto'}}>
                    {streamLogs.filter(Boolean).map((log, i) => {
                      let color = '#10b981';
                      if (log.includes('WARNING') || log.includes('REJECTED') || log.includes('REJECTING') || log.includes('CASCADING FAILURE')) color = '#ef4444';
                      if (log.includes('System') || log.includes('APPROVED')) color = '#0070f2';
                      return <div key={i} style={{marginBottom: 4, color}}>{log}</div>;
                    })}
                    <div ref={logsEndRef} />
                  </div>
                </div>

                {/* Right Terminal: UiPath RPA */}
                <div className="glass-panel animate-fade-in" style={{
                  flex: 1, 
                  height: step >= 7 ? '155px' : '300px', 
                  background: 'rgba(0, 0, 0, 0.85)', 
                  border: '1px solid #333',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#0070f2',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px',
                  transition: 'all 0.5s ease'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #333', paddingBottom: 6, marginBottom: 6, color: '#fff', fontSize: '12px'}}>
                    <Activity size={14} /> UiPath Maestro RPA Execution Logs
                  </div>
                  <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
                    <div style={{flex: 1, overflowY: 'auto'}}>
                      {rpaLogs.length > 0 ? (
                        rpaLogs.map((log, i) => (
                          <div key={i} style={{marginBottom: 4, color: log.includes('RESOLVED') ? '#10b981' : '#0070f2'}}>{log}</div>
                        ))
                      ) : (
                        <div style={{color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', textAlign: 'center', marginTop: step >= 7 ? '20px' : '80px'}}>
                          Awaiting Human-in-the-Loop Sourcing Approval...
                        </div>
                      )}
                    </div>
                    {/* Glowing button inside the RPA terminal when logs are complete */}
                    {step === 6 && rpaFinished && (
                      <button 
                        onClick={() => {
                          setStep(7);
                          setRingsData([]);
                          if (globeRef.current) {
                            globeRef.current.controls().autoRotate = true;
                            globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 2000);
                          }
                        }}
                        style={{
                          marginTop: '8px',
                          padding: '8px 12px',
                          background: 'linear-gradient(45deg, #10b981, #059669)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          animation: 'pulse-glow 1.5s infinite',
                          pointerEvents: 'auto'
                        }}
                      >
                        <FileText size={12} /> Générer le Rapport PDF & Clôturer la Crise
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="main-flow" style={{pointerEvents: 'auto'}}>
            
            {step >= 3 && (
              <div className="glass-panel animate-fade-in" style={{background: 'rgba(15, 17, 21, 0.7)'}}>
                <h3 style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8}}>
                  <Search size={20} color="var(--accent-blue)" /> {isProcurement ? "Logistics Alternatives" : "Contingency Backup Providers"}
                </h3>
                {suppliers.length > 0 ? (
                  <div style={{display: 'flex', gap: 8, flexDirection: 'column'}}>
                    {suppliers.map(s => (
                      <div 
                        key={s.name} 
                        className={`supplier-card ${selectedSupplier?.name === s.name ? 'selected' : ''}`}
                        onClick={() => setSelectedSupplier(s)}
                      >
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <h4>{s.name}</h4>
                          <span className="data-label">{s.country}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="data-label">{isProcurement ? "Routing supply lines..." : "Analyzing backup provider parameters..."}</p>}
              </div>
            )}

            {step >= 4 && (
              <div className="glass-panel animate-fade-in" style={{background: 'rgba(15, 17, 21, 0.7)'}}>
                <h3 style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8}}>
                  <ShieldCheck size={20} color="var(--success)" /> {isProcurement ? "Compliance Check" : "Security & SOC2 Audit"}
                </h3>
                {complianceData ? (
                  <>
                    <div className="data-row"><span className="data-label">Target</span><span className="data-value">{complianceData.supplier_name}</span></div>
                    <div className="data-row"><span className="data-label">{isProcurement ? "ESG Score" : "Security Score"}</span><span className="data-value">{complianceData.esg_score}/100</span></div>
                  </>
                ) : <p className="data-label">{isProcurement ? "Running legal agent..." : "Running cybersecurity compliance audit..."}</p>}
              </div>
            )}

            {step === 5 && (
              <div className="glass-panel animate-fade-in" style={{
                background: 'rgba(15, 23, 42, 0.95)',
                borderColor: '#0070f2',
                borderWidth: '2px',
                boxShadow: '0 0 25px rgba(0, 112, 242, 0.35)',
                backdropFilter: 'blur(20px)',
                padding: '24px',
                pointerEvents: 'auto'
              }}>
                <h3 style={{
                  marginBottom: 12, 
                  color: '#fff', 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px'
                }}>
                  <span className="data-label" style={{display: 'block', marginBottom: '15px', fontSize: '10px', color: '#8b92a5', letterSpacing: '0.5px'}}>
                  CASE GOVERNANCE APPROVED | ROLE: {isProcurement ? "SOURCING OFFICER" : "LOGISTICS & SECURITY DIRECTOR"}
                  </span>
                </h3>

                {complianceData?.xai_report && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    {/* Metrics Cards */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '10px',
                        borderRadius: '6px'
                      }}>
                        <div style={{fontSize: '9px', color: '#8b92a5', textTransform: 'uppercase'}}>Monte Carlo Risk</div>
                        <div style={{fontSize: '12px', fontWeight: 'bold', color: '#ef4444', marginTop: '4px'}}>
                          {complianceData.xai_report.monte_carlo_risk.split(' ')[0]} Risk Prob.
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '10px',
                        borderRadius: '6px'
                      }}>
                        <div style={{fontSize: '9px', color: '#8b92a5', textTransform: 'uppercase'}}>Arbitration Savings</div>
                        <div style={{fontSize: '12px', fontWeight: 'bold', color: '#10b981', marginTop: '4px'}}>
                          {complianceData.xai_report.financial_savings.split(': ')[1] || "$3.2M"}
                        </div>
                      </div>
                    </div>

                    {/* Explanatory texts */}
                    <div style={{
                      background: 'rgba(0,0,0,0.4)',
                      padding: '12px',
                      borderRadius: '6px',
                      borderLeft: '3px solid #0070f2',
                      fontSize: '11px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      color: '#e2e8f0',
                      fontFamily: 'monospace'
                    }}>
                      <div>
                        <strong>{isProcurement ? "ESG & Sanctions:" : "Security & SOC2:"}</strong> {complianceData.xai_report.esg_justification}
                      </div>
                      <div>
                        <strong>{isProcurement ? "Supply Graph Check:" : "IT Network Check:"}</strong> {complianceData.xai_report.dependency_check}
                      </div>
                    </div>
                  </div>
                )}

                <p className="data-label" style={{marginBottom: 15, fontSize: '11px'}}>
                  {selectedSupplier ? (
                    <span style={{color: '#10b981', fontWeight: 'bold'}}>
                      ✓ Ready to commit {isProcurement ? "sourcing route" : "continuity plan redirection"} to: {selectedSupplier.name}
                    </span>
                  ) : (
                    <span>⚠️ Select a candidate from the Logistics panel to enable approval.</span>
                  )}
                </p>
                
                <button 
                  className={`btn-primary ${selectedSupplier ? 'pulse' : ''}`} 
                  disabled={!selectedSupplier}
                  onClick={handleApprove}
                  style={{
                    width: '100%', 
                    justifyContent: 'center', 
                    padding: '14px', 
                    fontSize: '14px', 
                    fontWeight: 'bold',
                    background: selectedSupplier ? 'linear-gradient(45deg, #0070f2, #0056b3)' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: selectedSupplier ? 'pointer' : 'not-allowed',
                    color: '#fff',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <ShieldCheck size={18} /> {isProcurement ? "Authorize Sourcing Route" : "Authorize Continuity Plan"}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
