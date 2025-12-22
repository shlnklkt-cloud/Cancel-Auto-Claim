import { useState, useEffect, useRef, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  BrainCircuit,
  FileSearch,
  WalletCards,
  Plane,
  CloudLightning,
  TriangleAlert,
  ShieldCheck,
  Clock,
  UserCheck,
  Calculator,
  Shield,
  Zap,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const INCOME_LOGO = "https://customer-assets.emergentagent.com/job_claim-helper-7/artifacts/l8b8tkoj_image.png";

// Policy Holder Panel Component
const PolicyHolderPanel = () => (
  <div className="sidebar-panel" data-testid="policy-holder-panel">
    <div className="panel-title">Policy Holder</div>
    <div className="avatar-container">
      <div className="avatar">JC</div>
      <div>
        <div className="font-bold text-black" style={{ fontFamily: 'Manrope' }}>Jolene Chua</div>
        <div className="text-sm text-black font-medium">Premium Member</div>
      </div>
    </div>
  </div>
);

// Policy Details Panel Component
const PolicyDetailsPanel = () => (
  <div className="sidebar-panel" data-testid="policy-details-panel">
    <div className="panel-title">Policy Details</div>
    <div className="space-y-3">
      <div>
        <div className="text-xs text-black font-semibold">Policy Number</div>
        <div className="font-bold text-black" style={{ fontFamily: 'Manrope' }}>TRV-2026-0014879</div>
      </div>
      <div>
        <div className="text-xs text-black font-semibold">Coverage</div>
        <div className="text-sm text-black font-medium">Comprehensive Travel Insurance</div>
      </div>
      <div>
        <div className="text-xs text-black font-semibold">Flight Cancellation Coverage</div>
        <div className="text-sm font-bold text-[#FF7600]">$100 per 6 hours</div>
      </div>
      <div>
        <div className="text-xs text-black font-semibold">Status</div>
        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs border-transparent shadow bg-emerald-50 text-emerald-700 font-bold">
          Active
        </span>
      </div>
    </div>
  </div>
);

// Flight Info Panel Component
const FlightInfoPanel = () => (
  <div className="sidebar-panel" data-testid="flight-info-panel">
    <div className="panel-title flex items-center gap-2">
      <Plane className="w-4 h-4" />
      Flight Information
    </div>
    <div className="flight-route mb-4">
      <div className="flex flex-col items-center z-10">
        <div className="route-dot active"></div>
        <div className="route-label font-bold text-[#FF7600]">SIN</div>
      </div>
      <div className="flex flex-col items-center z-10">
        <div className="route-dot cancelled"></div>
        <div className="route-label font-bold text-[#FF7600]">HAK</div>
      </div>
      <div className="flex flex-col items-center z-10">
        <div className="route-dot pending"></div>
        <div className="route-label font-bold text-black">NRT</div>
      </div>
    </div>
    <div className="space-y-3">
      <div>
        <div className="text-xs text-black font-semibold">Flight</div>
        <div className="font-bold text-black" style={{ fontFamily: 'Manrope' }}>SQ656</div>
      </div>
      <div>
        <div className="text-xs text-black font-semibold">Airline</div>
        <div className="text-sm text-black font-medium">Singapore Airlines</div>
      </div>
      <div>
        <div className="text-xs text-black font-semibold">Status</div>
        <div className="rounded-md border px-2.5 py-0.5 text-xs border-transparent shadow bg-amber-50 text-amber-700 font-bold flex items-center gap-1 w-fit">
          <TriangleAlert className="w-3 h-3" />
          Cancelled
        </div>
      </div>
      <div>
        <div className="text-xs text-black font-semibold">Date & Time</div>
        <div className="text-sm text-black font-medium">22 Dec 2025, 22:17</div>
      </div>
      <div>
        <div className="text-xs text-black font-semibold">Cancellation Reason</div>
        <div className="text-sm text-red-600 font-semibold flex items-center gap-1">
          <CloudLightning className="w-4 h-4" />
          Adverse Weather Conditions - Hurricane Alert
        </div>
      </div>
    </div>
  </div>
);

// Agent Card Component
const AgentCard = ({ agent, isActive, isComplete }) => {
  const icons = {
    orchestrator: BrainCircuit,
    claim: FileSearch,
    payment: WalletCards,
  };
  const Icon = icons[agent.type];

  return (
    <div
      className={`agent-card ${isActive ? 'active' : isComplete ? 'complete' : 'idle'}`}
      data-testid={`agent-card-${agent.type}`}
    >
      <div className={`agent-icon ${agent.type} ${isActive ? 'pulse-ring' : ''}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="font-bold text-black" style={{ fontFamily: 'Manrope' }}>{agent.name}</div>
        <div className="text-sm text-black font-medium">{agent.description}</div>
      </div>
      <div>
        {isActive && <Loader2 className="w-6 h-6 text-[#FF7600] animate-spin" />}
        {isComplete && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
      </div>
    </div>
  );
};

// Validation Step Component
const ValidationStep = ({ step, status }) => {
  const icons = {
    1: ShieldCheck,
    2: Plane,
    3: Clock,
    4: UserCheck,
    5: Calculator,
    6: Shield,
  };
  const Icon = icons[step.number];

  return (
    <div className="validation-step" data-testid={`validation-step-${step.number}`}>
      <div className="step-content">
        <div className={`step-icon ${status}`}>
          {status === 'complete' ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          ) : status === 'processing' ? (
            <Loader2 className="w-3 h-3 text-[#FF7600] animate-spin" />
          ) : (
            <Icon className="w-3 h-3" />
          )}
        </div>
        <span className={`text-sm font-medium ${status === 'complete' ? 'text-emerald-600' : 'text-black'}`}>
          {step.number}. {step.name}
        </span>
      </div>
    </div>
  );
};

// Activity Log Component
const ActivityLog = ({ logs }) => (
  <div className="activity-log-white" data-testid="activity-log">
    <div className="activity-header-white">
      <div className="activity-dots-orange">
        <div className="activity-dot-orange"></div>
        <div className="activity-dot-orange"></div>
        <div className="activity-dot-orange"></div>
      </div>
      <div className="activity-title-black">Agent Activity Log</div>
    </div>
    <div className="activity-content-white custom-scrollbar">
      {logs.map((log, index) => (
        <div key={index} className="log-entry-white slide-in-right" data-testid={`log-entry-${index}`}>
          <div className="log-agent-black">{log.agent}:</div>
          <div className="log-message-black">
            <span className="log-icon-black">
              <Zap className="w-4 h-4" />
            </span>
            <span>{log.message}</span>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 text-black text-sm mt-2 font-semibold">
        <Loader2 className="w-4 h-4 animate-spin text-[#FF7600]" />
        Processing...
      </div>
    </div>
  </div>
);

// Main Insurance Demo App
const InsuranceDemo = () => {
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [validationSteps, setValidationSteps] = useState([
    { number: 1, name: 'Policy Verification', status: 'pending' },
    { number: 2, name: 'Flight Cancellation Confirmation', status: 'pending' },
    { number: 3, name: 'Cancellation Validation', status: 'pending' },
    { number: 4, name: 'Eligibility Assessment', status: 'pending' },
    { number: 5, name: 'Claim Amount Calculation', status: 'pending' },
    { number: 6, name: 'Security Screening', status: 'pending' },
  ]);
  const [logs, setLogs] = useState([
    { agent: 'Orchestrator Agent', message: 'Initiating automated claim workflow...' },
  ]);
  const [isProcessing, setIsProcessing] = useState(true);
  const logContainerRef = useRef(null);

  const agents = [
    { type: 'orchestrator', name: 'Orchestrator Agent', description: 'Workflow Coordination & Routing' },
    { type: 'claim', name: 'Claim Processing Agent', description: '6-Step Validation & Analysis' },
    { type: 'payment', name: 'Payment Agent', description: 'Compensation Processing & Transfer' },
  ];

  const addLog = useCallback((agent, message) => {
    setLogs(prev => [...prev, { agent, message }]);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulation of claim processing workflow
  useEffect(() => {
    if (!isProcessing) return;

    const stepMessages = [
      { agent: 'Orchestrator Agent', message: 'Routing to Claim Processing Agent...', delay: 2000 },
      { agent: 'Claim Processing Agent', message: 'Starting 6-step validation process...', delay: 3000, agentIndex: 1 },
      { agent: 'Claim Processing Agent', message: 'Step 1: Verifying policy TRV-2026-0014879...', delay: 4000, stepIndex: 0 },
      { agent: 'Claim Processing Agent', message: 'Policy verified. Coverage: Comprehensive Travel Insurance', delay: 5500, completeStep: 0 },
      { agent: 'Claim Processing Agent', message: 'Step 2: Confirming flight cancellation for SQ656...', delay: 6500, stepIndex: 1 },
      { agent: 'Claim Processing Agent', message: 'Flight cancellation confirmed via airline API', delay: 8000, completeStep: 1 },
      { agent: 'Claim Processing Agent', message: 'Step 3: Validating cancellation reason...', delay: 9000, stepIndex: 2 },
      { agent: 'Claim Processing Agent', message: 'Hurricane alert verified - eligible for coverage', delay: 10500, completeStep: 2 },
      { agent: 'Claim Processing Agent', message: 'Step 4: Assessing policyholder eligibility...', delay: 11500, stepIndex: 3 },
      { agent: 'Claim Processing Agent', message: 'Premium member status confirmed. Full coverage applies.', delay: 13000, completeStep: 3 },
      { agent: 'Claim Processing Agent', message: 'Step 5: Calculating claim amount...', delay: 14000, stepIndex: 4 },
      { agent: 'Claim Processing Agent', message: 'Delay: 12 hours. Compensation: $200 approved.', delay: 15500, completeStep: 4 },
      { agent: 'Claim Processing Agent', message: 'Step 6: Running security screening...', delay: 16500, stepIndex: 5 },
      { agent: 'Claim Processing Agent', message: 'No fraud indicators detected. Claim approved!', delay: 18000, completeStep: 5 },
      { agent: 'Orchestrator Agent', message: 'Validation complete. Routing to Payment Agent...', delay: 19000 },
      { agent: 'Payment Agent', message: 'Initiating compensation transfer...', delay: 20000, agentIndex: 2 },
      { agent: 'Payment Agent', message: '$200 transferred to registered bank account', delay: 22000 },
      { agent: 'Payment Agent', message: 'Payment confirmation sent via email', delay: 23000 },
      { agent: 'Orchestrator Agent', message: 'Claim workflow completed successfully!', delay: 24000, complete: true },
    ];

    const timers = stepMessages.map((step) => {
      return setTimeout(() => {
        addLog(step.agent, step.message);
        
        if (step.agentIndex !== undefined) {
          setCurrentAgentIndex(step.agentIndex);
        }
        
        if (step.stepIndex !== undefined) {
          setValidationSteps(prev => prev.map((s, i) => 
            i === step.stepIndex ? { ...s, status: 'processing' } : s
          ));
        }
        
        if (step.completeStep !== undefined) {
          setValidationSteps(prev => prev.map((s, i) => 
            i === step.completeStep ? { ...s, status: 'complete' } : s
          ));
        }
        
        if (step.complete) {
          setIsProcessing(false);
        }
      }, step.delay);
    });

    return () => timers.forEach(clearTimeout);
  }, [isProcessing, addLog]);

  return (
    <div className="App" data-testid="insurance-demo-app">
      {/* Income Logo Header */}
      <div className="income-logo-header">
        <img src={INCOME_LOGO} alt="Income" className="income-logo" />
      </div>
      
      <div className="main-grid" data-testid="main-grid">
        {/* Left Column - Policy Info */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          <PolicyHolderPanel />
          <PolicyDetailsPanel />
          <FlightInfoPanel />
        </div>

        {/* Middle Column - Agent Workflow */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="space-y-3" data-testid="agent-workflow">
            {agents.map((agent, index) => (
              <AgentCard
                key={agent.type}
                agent={agent}
                isActive={currentAgentIndex === index && isProcessing}
                isComplete={currentAgentIndex > index || !isProcessing}
              />
            ))}
          </div>

          <div className="sidebar-panel" data-testid="validation-progress">
            <div className="panel-title">Validation Progress</div>
            <div className="space-y-1">
              {validationSteps.map((step) => (
                <ValidationStep key={step.number} step={step} status={step.status} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Activity Log */}
        <ActivityLog logs={logs} />
      </div>

      {/* Made with Emergent Badge */}
      <div className="emergent-badge">
        <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">e</span>
        </div>
        Made with Emergent
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InsuranceDemo />} />
        <Route path="*" element={<InsuranceDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
