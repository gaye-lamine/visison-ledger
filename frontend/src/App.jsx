import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Activity, GitCommit, CheckCircle, Clock, Search, ShieldCheck, Play, Factory, Terminal, TrendingUp, AlertTriangle, FileText } from 'lucide-react';
import Globe from 'react-globe.gl';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis, Cell } from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://aegis.backnd-api.cloud/api/v1';

export default function App() {
  const [step, setStep] = useState(0);
  const [crisisData, setCrisisData] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [complianceData, setComplianceData] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [rpaLogs, setRpaLogs] = useState([]);
  
  // Brain Stream State
  const [streamLogs, setStreamLogs] = useState([]);
  const logsEndRef = useRef(null);
  
  // Social Radar State
  const [socialFeed, setSocialFeed] = useState(["[System] Sentinel AI monitoring global feeds..."]);
  
  // Dynamic Inputs
  const [crisisInput, setCrisisInput] = useState("Social Radar triggered Force Majeure protocol. Tsunami warning in Taiwan.");
  const [maestroUrl, setMaestroUrl] = useState("https://staging.uipath.com/hackathon26_269/39051d92-8f24-48ec-8f02-789fa3bcc72e/elements_/v1/webhooks/events/Z35DgvbF_xfMXXKYOPg79aGVzLncQiijWgvpgTkVismibg5aIrmTIX6bHiUMio2ylVjMAxZbK1feEeln6FPPaw");

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

  // Synthetic Data for the Predictive Graph
  const graphData = Array.from({length: 30}, (_, i) => ({
    day: `Day ${i+1}`,
    InactionCost: i * 15000,
    RemediationCost: i < 5 ? i * 15000 : 75000 + (i-5) * 1000
  }));

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

    const eventSource = new EventSource(`${API_BASE}/brain-stream`);
    eventSource.onmessage = (event) => {
      setStreamLogs((prev) => [...prev, event.data]);
    };
    eventSource.onerror = () => eventSource.close();

    try {
      const classRes = await fetch(`${API_BASE}/classify-disruption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier_name: 'GlobalTech', document_text: crisisInput, date: new Date().toISOString().split('T')[0] })
      }).then(r => r.json());
      setCrisisData(classRes);
      
      const newCrisisLoc = { lat: classRes.lat || 0, lng: classRes.lng || 0, name: classRes.location_name || 'Crisis Zone' };
      setDynamicLocations(prev => ({ ...prev, Crisis: newCrisisLoc }));

      // Visual Anomaly Rings: Pulse a red ring at the crisis location
      setRingsData([
        { lat: newCrisisLoc.lat, lng: newCrisisLoc.lng, color: '#ef4444' }
      ]);

      setGlobeData([
        { startLat: dynamicLocations.HQ.lat, startLng: dynamicLocations.HQ.lng, endLat: newCrisisLoc.lat, endLng: newCrisisLoc.lng, color: ['#ef4444', '#ef4444'] }
      ]);
      
      await new Promise(r => setTimeout(r, 1500));
      setStep(2);
      
      const impRes = await fetch(`${API_BASE}/assess-financial-impact?crisis_id=${classRes.crisis_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classRes.affected_parts)
      }).then(r => r.json());
      setImpactData(impRes);

      await new Promise(r => setTimeout(r, 5000));
      setStep(3);

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

      await new Promise(r => setTimeout(r, 1500));
      setStep(4);

      const compRes = await fetch(`${API_BASE}/compliance-check?supplier_name=${supRes[0].name}`, {
        method: 'POST'
      }).then(r => r.json());
      setComplianceData(compRes);

      setStep(5);

    } catch (e) {
      console.error("Simulation error", e);
    }
  };

  const handleApprove = async () => {
    if (!selectedSupplier) return;
    setStep(6);
    setRpaLogs([]);
    
    try {
      const execRes = await fetch(`${API_BASE}/execute-remediation?crisis_id=${encodeURIComponent(crisisData.crisis_id)}&chosen_supplier=${encodeURIComponent(selectedSupplier.name)}`, {
        method: 'POST'
      }).then(r => r.json());
      setExecutionResult(execRes);
      
      // Simulate logs rolling in one-by-one with setTimeouts for a gorgeous live terminal effect
      if (execRes.rpa_logs && execRes.rpa_logs.length > 0) {
        for (let i = 0; i < execRes.rpa_logs.length; i++) {
          setRpaLogs(prev => [...prev, execRes.rpa_logs[i]]);
          await new Promise(r => setTimeout(r, 1500));
        }
      }
      
      // Generate the official PDF on the server right after approval so it reflects the correct selected vendor and has the dynamic QR hash!
      try {
        await fetch(`${API_BASE}/generate-pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crisis_id: crisisData.crisis_id, chosen_supplier: selectedSupplier.name })
        });
      } catch(pdfError) {
        console.error("PDF Pre-generation error", pdfError);
      }

      await new Promise(r => setTimeout(r, 1000));
      setStep(7);
      
      // Clear rings to mark complete resolution
      setRingsData([]);
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
      }
    } catch(e) {
      console.error(e);
    }
  };

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
                    <div className="data-row"><span className="data-label">Parts</span><span className="data-value">{crisisData.affected_parts.join(', ')}</span></div>
                  </>
                ) : <p className="data-label">Parsing social sentiment...</p>}
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
          <div style={{display: 'flex', alignItems: 'flex-end', paddingBottom: '20px', pointerEvents: 'none', width: '100%'}}>
            {step >= 1 && step < 7 && (
              <div style={{
                width: '100%',
                display: 'flex',
                gap: '15px',
                pointerEvents: 'auto'
              }}>
                {/* Left Terminal: AI Swarm */}
                <div className="glass-panel animate-fade-in" style={{
                  flex: 1, 
                  height: '300px', 
                  background: 'rgba(0, 0, 0, 0.85)', 
                  border: '1px solid #333',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#10b981',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '15px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #333', paddingBottom: 8, marginBottom: 8, color: '#fff'}}>
                    <Terminal size={16} /> AI Swarm Orchestration Stream (SSE)
                  </div>
                  <div style={{flex: 1, overflowY: 'auto'}}>
                    {streamLogs.map((log, i) => {
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
                  height: '300px', 
                  background: 'rgba(0, 0, 0, 0.85)', 
                  border: '1px solid #333',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#0070f2',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '15px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #333', paddingBottom: 8, marginBottom: 8, color: '#fff'}}>
                    <Activity size={16} /> UiPath Maestro RPA Execution Logs
                  </div>
                  <div style={{flex: 1, overflowY: 'auto'}}>
                    {rpaLogs.length > 0 ? (
                      rpaLogs.map((log, i) => (
                        <div key={i} style={{marginBottom: 4, color: log.includes('RESOLVED') ? '#10b981' : '#0070f2'}}>{log}</div>
                      ))
                    ) : (
                      <div style={{color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', textAlign: 'center', marginTop: '80px'}}>
                        Awaiting Human-in-the-Loop Sourcing Approval...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step >= 7 && (
              <div className="glass-panel animate-fade-in" style={{
                width: '100%', 
                height: '350px', 
                background: 'rgba(16, 185, 129, 0.05)', 
                border: '1px solid #10b981',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto'
              }}>
                <h3 style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#10b981'}}>
                  <CheckCircle size={24} /> Executive Summary & Analytics
                </h3>
                
                <div style={{display: 'flex', flex: 1, gap: '20px'}}>
                  {/* ESG Gauge */}
                  <div style={{flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column'}}>
                    <h4 style={{textAlign: 'center', color: '#8b92a5', marginBottom: 10}}>ESG Compliance Score</h4>
                    <div style={{flex: 1, position: 'relative'}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={[{ name: 'ESG', value: complianceData?.esg_score || 95, fill: '#10b981' }]} startAngle={180} endAngle={0}>
                          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                          <RadialBar minAngle={15} background={{fill: 'rgba(255,255,255,0.1)'}} clockWise dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -10%)', fontSize: '24px', fontWeight: 'bold', color: '#10b981'}}>
                        {complianceData?.esg_score || 95}/100
                      </div>
                    </div>
                  </div>

                  {/* Financial Bar Chart */}
                  <div style={{flex: 1.5, background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column'}}>
                    <h4 style={{textAlign: 'center', color: '#8b92a5', marginBottom: 10}}>Financial Impact Projection (USD)</h4>
                    <div style={{flex: 1}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Inaction', cost: impactData?.total_impact_usd || 150000, fill: '#ef4444' },
                          { name: 'Remediation', cost: (impactData?.total_impact_usd || 150000) * 0.28, fill: '#10b981' }
                        ]} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                          <XAxis dataKey="name" stroke="#8b92a5" fontSize={12} tickLine={false} />
                          <YAxis stroke="#8b92a5" fontSize={10} tickFormatter={(val) => `$${val/1000}k`} tickLine={false} axisLine={false} />
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

                <div style={{marginTop: 15, padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', borderLeft: '3px solid #10b981', fontSize: '13px', color: '#e2e8f0'}}>
                  <strong>Action Taken:</strong> {executionResult?.action_taken || "Re-routed purchase orders and logistics workflows via Maestro."}
                </div>

                <div style={{marginTop: 20, textAlign: 'center'}}>
                  <button 
                    className="btn-primary" 
                    style={{padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', background: 'linear-gradient(45deg, #10b981, #059669)'}}
                    onClick={() => window.open('https://aegis.backnd-api.cloud/api/v1/view-report', '_blank')}
                  >
                    <FileText size={20} /> View Official PDF Report
                  </button>
                  <span style={{fontSize: '11px', color: '#8b92a5', marginTop: '8px', display: 'block'}}>Generated autonomously by UiPath Maestro</span>
                </div>

              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="main-flow" style={{pointerEvents: 'auto'}}>
            
            {step >= 3 && (
              <div className="glass-panel animate-fade-in" style={{background: 'rgba(15, 17, 21, 0.7)'}}>
                <h3 style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8}}>
                  <Search size={20} color="var(--accent-blue)" /> Logistics Alternatives
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
                ) : <p className="data-label">Routing supply lines...</p>}
              </div>
            )}

            {step >= 4 && (
              <div className="glass-panel animate-fade-in" style={{background: 'rgba(15, 17, 21, 0.7)'}}>
                <h3 style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8}}>
                  <ShieldCheck size={20} color="var(--success)" /> Compliance Check
                </h3>
                {complianceData ? (
                  <>
                    <div className="data-row"><span className="data-label">Target</span><span className="data-value">{complianceData.supplier_name}</span></div>
                    <div className="data-row"><span className="data-label">ESG Score</span><span className="data-value">{complianceData.esg_score}/100</span></div>
                  </>
                ) : <p className="data-label">Running legal agent...</p>}
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
                  <ShieldCheck size={22} color="#0070f2" /> Decision Intelligence Sheet
                </h3>
                <span className="data-label" style={{display: 'block', marginBottom: '15px', fontSize: '10px', color: '#8b92a5', letterSpacing: '0.5px'}}>
                  CASE GOVERNANCE APPROVED | ROLE: SOURCING OFFICER
                </span>

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
                        <strong>ESG & Sanctions:</strong> {complianceData.xai_report.esg_justification}
                      </div>
                      <div>
                        <strong>Supply Graph Check:</strong> {complianceData.xai_report.dependency_check}
                      </div>
                    </div>
                  </div>
                )}

                <p className="data-label" style={{marginBottom: 15, fontSize: '11px'}}>
                  {selectedSupplier ? (
                    <span style={{color: '#10b981', fontWeight: 'bold'}}>
                      ✓ Ready to commit sourcing route to: {selectedSupplier.name}
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
                  <ShieldCheck size={18} /> Authorize Sourcing Route
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
