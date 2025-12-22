import { useState, useEffect, useRef, useCallback } from "react";
import "@/App.css";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  BrainCircuit, 
  FileSearch, 
  WalletCards, 
  Plane, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  AlertTriangle,
  RotateCcw,
  Clock,
  CloudLightning,
  DollarSign,
  Search,
  Zap,
  Shield,
  Calculator,
  UserCheck
} from "lucide-react";

// Policy holder data
const POLICY_HOLDER = {
  name: "Jolene Chua",
  membership: "Premium Member",
  initials: "JC"
};

// Policy details
const POLICY_DETAILS = {
  policyNumber: "TRV-2026-0014879",
  coverage: "Comprehensive Travel Insurance",
  flightCancellationCoverage: "$100 per 6 hours",
  status: "Active"
};

// Flight information
const FLIGHT_INFO = {
  flightNumber: "SQ656",
  airline: "Singapore Airlines",
  route: [
    { code: "SIN", name: "Singapore", status: "departed" },
    { code: "HAK", name: "Haikou", status: "cancelled" },
    { code: "NRT", name: "Tokyo Narita", status: "pending" }
  ],
  cancellationReason: "Adverse Weather Conditions - Hurricane Alert",
  status: "Cancelled"
};

// Get dynamic date (current time + 6 hours in Singapore timezone)
const getJourneyDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 6);
  return now.toLocaleString('en-SG', { 
    timeZone: 'Asia/Singapore',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// Agent definitions
const AGENTS = {
  orchestrator: {
    name: "Orchestrator Agent",
    role: "Workflow Coordination & Routing",
    icon: BrainCircuit,
    color: "orchestrator"
  },
  claim: {
    name: "Claim Processing Agent",
    role: "6-Step Validation & Analysis",
    icon: FileSearch,
    color: "claim"
  },
  payment: {
    name: "Payment Agent",
    role: "Compensation Processing & Transfer",
    icon: WalletCards,
    color: "payment"
  }
};

// Validation steps
const VALIDATION_STEPS = [
  { id: 1, name: "Policy Verification", icon: ShieldCheck },
  { id: 2, name: "Flight Cancellation Confirmation", icon: Plane },
  { id: 3, name: "Cancellation Validation", icon: Clock },
  { id: 4, name: "Eligibility Assessment", icon: UserCheck },
  { id: 5, name: "Claim Amount Calculation", icon: Calculator },
  { id: 6, name: "Security Screening", icon: Shield }
];

// Demo workflow messages with timing
const DEMO_WORKFLOW = [
  { 
    delay: 1000, 
    agent: "orchestrator", 
    message: "Initiating automated claim workflow...",
    icon: "zap"
  },
  { 
    delay: 3000, 
    agent: "orchestrator", 
    message: "Flight cancellation detected: SQ656 (SIN → HAK)",
    icon: "alert"
  },
  { 
    delay: 5000, 
    agent: "orchestrator", 
    message: "Calling FlightAware API: /api/external/flight-status/SQ656",
    icon: "api"
  },
  { 
    delay: 7000, 
    agent: "orchestrator", 
    message: "Flight Status Retrieved: CANCELLED - Hurricane Alert",
    icon: "check"
  },
  { 
    delay: 9000, 
    agent: "orchestrator", 
    message: "Handing off to Claim Processing Agent for detailed validation...",
    icon: "handoff",
    activateAgent: "claim"
  },
  { 
    delay: 12000, 
    agent: "claim", 
    message: "Policy Verification - Processing...",
    icon: "search",
    startValidation: 1
  },
  { 
    delay: 14000, 
    agent: "claim", 
    message: "Calling external API: /api/policy-verify/TRV-2026-0014879",
    icon: "api"
  },
  { 
    delay: 16000, 
    agent: "claim", 
    message: "Policy Verification Complete: Validated successfully",
    icon: "check",
    completeValidation: 1
  },
  { 
    delay: 18000, 
    agent: "claim", 
    message: "Flight Cancellation Confirmation - Processing...",
    icon: "search",
    startValidation: 2
  },
  { 
    delay: 20000, 
    agent: "claim", 
    message: "Calling FlightAware API: /api/external/flight-status/SQ656",
    icon: "api"
  },
  { 
    delay: 22000, 
    agent: "claim", 
    message: "Flight Status Retrieved: CANCELLED - Eligible for claim",
    icon: "check",
    completeValidation: 2
  },
  { 
    delay: 24000, 
    agent: "claim", 
    message: "Cancellation Validation - Processing...",
    icon: "search",
    startValidation: 3
  },
  { 
    delay: 26000, 
    agent: "claim", 
    message: "Flight Cancelled: Eligible for compensation",
    icon: "check",
    completeValidation: 3
  },
  { 
    delay: 28000, 
    agent: "claim", 
    message: "Eligibility Assessment - Processing...",
    icon: "search",
    startValidation: 4
  },
  { 
    delay: 30000, 
    agent: "claim", 
    message: "Calling WeatherCheck API: /api/external/weather/HAK",
    icon: "api"
  },
  { 
    delay: 32000, 
    agent: "claim", 
    message: "Weather Alert Confirmed: Hurricane Warning Active",
    icon: "check"
  },
  { 
    delay: 34000, 
    agent: "claim", 
    message: "Eligibility Assessment Complete: ELIGIBLE",
    icon: "check",
    completeValidation: 4
  },
  { 
    delay: 36000, 
    agent: "claim", 
    message: "Claim Amount Calculation - Processing...",
    icon: "search",
    startValidation: 5
  },
  { 
    delay: 38000, 
    agent: "claim", 
    message: "Coverage: $150 (Hurricane factor) = $150",
    icon: "dollar"
  },
  { 
    delay: 40000, 
    agent: "claim", 
    message: "Claim Amount Calculation Complete: $150 approved",
    icon: "check",
    completeValidation: 5
  },
  { 
    delay: 42000, 
    agent: "claim", 
    message: "Security Screening - Processing...",
    icon: "search",
    startValidation: 6
  },
  { 
    delay: 44000, 
    agent: "claim", 
    message: "Calling Fraud Detection API: /api/security/fraud-check",
    icon: "api"
  },
  { 
    delay: 46000, 
    agent: "claim", 
    message: "Security Screening Complete: No fraud indicators detected",
    icon: "check",
    completeValidation: 6
  },
  { 
    delay: 48000, 
    agent: "claim", 
    message: "All validations passed. Generating claim: CLM-TRV-2026-008431-1",
    icon: "check"
  },
  { 
    delay: 50000, 
    agent: "claim", 
    message: "Handing off to Payment Agent for claim payment transfer...",
    icon: "handoff",
    activateAgent: "payment"
  },
  { 
    delay: 52000, 
    agent: "payment", 
    message: "Initiating payment processing...",
    icon: "zap"
  },
  { 
    delay: 54000, 
    agent: "payment", 
    message: "Calling Bank API: /api/payment/transfer",
    icon: "api"
  },
  { 
    delay: 56000, 
    agent: "payment", 
    message: "Payment Reference: PAY-2026-SG-78432",
    icon: "check"
  },
  { 
    delay: 58000, 
    agent: "payment", 
    message: "Claim payment of $150 transferred successfully!",
    icon: "check",
    showCompletion: true
  }
];

// Icon component for log messages
const LogIcon = ({ type }) => {
  const iconClass = "w-4 h-4";
  switch(type) {
    case "zap": return <Zap className={iconClass} />;
    case "alert": return <AlertTriangle className={iconClass} />;
    case "api": return <Zap className={iconClass} />;
    case "check": return <CheckCircle2 className={iconClass} />;
    case "handoff": return <CheckCircle2 className={iconClass} />;
    case "search": return <Search className={iconClass} />;
    case "dollar": return <DollarSign className={iconClass} />;
    default: return <Zap className={iconClass} />;
  }
};

function App() {
  const [activeAgent, setActiveAgent] = useState("orchestrator");
  const [completedAgents, setCompletedAgents] = useState([]);
  const [validationStatus, setValidationStatus] = useState({});
  const [logs, setLogs] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [journeyDateTime, setJourneyDateTime] = useState(getJourneyDateTime());
  const scrollRef = useRef(null);
  const timeoutsRef = useRef([]);

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  // Reset demo
  const resetDemo = useCallback(() => {
    clearAllTimeouts();
    setActiveAgent("orchestrator");
    setCompletedAgents([]);
    setValidationStatus({});
    setLogs([]);
    setShowCompletion(false);
    setIsRunning(false);
    setJourneyDateTime(getJourneyDateTime());
  }, [clearAllTimeouts]);

  // Start demo
  const startDemo = useCallback(() => {
    resetDemo();
    setIsRunning(true);
    
    DEMO_WORKFLOW.forEach((step) => {
      const timeout = setTimeout(() => {
        // Add log entry
        setLogs(prev => [...prev, {
          agent: step.agent,
          message: step.message,
          icon: step.icon,
          timestamp: new Date().toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore' })
        }]);

        // Handle agent activation
        if (step.activateAgent) {
          setCompletedAgents(prev => [...prev, activeAgent]);
          setActiveAgent(step.activateAgent);
        }

        // Handle validation status
        if (step.startValidation) {
          setValidationStatus(prev => ({ ...prev, [step.startValidation]: 'processing' }));
        }
        if (step.completeValidation) {
          setValidationStatus(prev => ({ ...prev, [step.completeValidation]: 'completed' }));
        }

        // Handle completion
        if (step.showCompletion) {
          setCompletedAgents(prev => [...prev, "payment"]);
          setShowCompletion(true);
          setIsRunning(false);
        }
      }, step.delay);
      
      timeoutsRef.current.push(timeout);
    });
  }, [resetDemo, activeAgent]);

  // Auto-scroll log
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Auto-start demo on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startDemo();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  const getAgentStatus = (agentKey) => {
    if (completedAgents.includes(agentKey)) return "completed";
    if (activeAgent === agentKey) return "active";
    return "idle";
  };

  const getValidationStepStatus = (stepId) => {
    return validationStatus[stepId] || "pending";
  };

  return (
    <div className="App" data-testid="insurance-demo-app">
      {/* Header */}
      <header className="header-container" data-testid="header">
        <div className="logo-container">
          <img 
            src="https://customer-assets.emergentagent.com/job_claim-helper-7/artifacts/wmoz4tgw_image.png" 
            alt="uincome Insurance" 
            className="logo-image"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            resetDemo();
            setTimeout(startDemo, 500);
          }}
          className="flex items-center gap-2"
          data-testid="reset-demo-btn"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo
        </Button>
      </header>

      {/* Main Content Grid */}
      <div className="main-grid" data-testid="main-grid">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* Policy Holder */}
          <Card className="sidebar-panel" data-testid="policy-holder-panel">
            <div className="panel-title">Policy Holder</div>
            <div className="avatar-container">
              <div className="avatar">{POLICY_HOLDER.initials}</div>
              <div>
                <div className="font-bold text-black" style={{ fontFamily: 'Manrope' }}>
                  {POLICY_HOLDER.name}
                </div>
                <div className="text-sm text-black font-medium">{POLICY_HOLDER.membership}</div>
              </div>
            </div>
          </Card>

          {/* Policy Details */}
          <Card className="sidebar-panel" data-testid="policy-details-panel">
            <div className="panel-title">Policy Details</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-black font-semibold">Policy Number</div>
                <div className="font-bold text-black" style={{ fontFamily: 'Manrope' }}>
                  {POLICY_DETAILS.policyNumber}
                </div>
              </div>
              <div>
                <div className="text-xs text-black font-semibold">Coverage</div>
                <div className="text-sm text-black font-medium">{POLICY_DETAILS.coverage}</div>
              </div>
              <div>
                <div className="text-xs text-black font-semibold">Status</div>
                <Badge className="bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-50">
                  {POLICY_DETAILS.status}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Flight Information */}
          <Card className="sidebar-panel" data-testid="flight-info-panel">
            <div className="panel-title flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Flight Information
            </div>
            
            {/* Route Visualization */}
            <div className="flight-route mb-4">
              {FLIGHT_INFO.route.map((stop, index) => (
                <div key={stop.code} className="flex flex-col items-center z-10">
                  <div className={`route-dot ${
                    stop.status === 'cancelled' ? 'cancelled' : 
                    stop.status === 'departed' ? 'active' : 'pending'
                  }`} />
                  <div className={`route-label font-bold ${
                    stop.status === 'cancelled' ? 'text-[#FF7600]' : 
                    stop.status === 'departed' ? 'text-[#FF7600]' : 'text-black'
                  }`}>
                    {stop.code}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-black font-semibold">Flight</div>
                <div className="font-bold text-black" style={{ fontFamily: 'Manrope' }}>
                  {FLIGHT_INFO.flightNumber}
                </div>
              </div>
              <div>
                <div className="text-xs text-black font-semibold">Airline</div>
                <div className="text-sm text-black font-medium">{FLIGHT_INFO.airline}</div>
              </div>
              <div>
                <div className="text-xs text-black font-semibold">Status</div>
                <Badge className="bg-amber-50 text-amber-700 font-bold hover:bg-amber-50 flex items-center gap-1 w-fit">
                  <AlertTriangle className="w-3 h-3" />
                  {FLIGHT_INFO.status}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-black font-semibold">Date & Time</div>
                <div className="text-sm text-black font-medium">{journeyDateTime}</div>
              </div>
              <div>
                <div className="text-xs text-black font-semibold">Cancellation Reason</div>
                <div className="text-sm text-red-600 font-semibold flex items-center gap-1">
                  <CloudLightning className="w-4 h-4" />
                  {FLIGHT_INFO.cancellationReason}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Center Content */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* Agent Workflow */}
          <div className="space-y-3" data-testid="agent-workflow">
            {Object.entries(AGENTS).map(([key, agent]) => {
              const status = getAgentStatus(key);
              const Icon = agent.icon;
              return (
                <div 
                  key={key}
                  className={`agent-card ${status}`}
                  data-testid={`agent-card-${key}`}
                >
                  <div className={`agent-icon ${status === 'active' ? 'active' : agent.color} ${
                    status === 'active' ? 'pulse-ring' : ''
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-black" style={{ fontFamily: 'Manrope' }}>
                      {agent.name}
                    </div>
                    <div className="text-sm text-black font-medium">{agent.role}</div>
                  </div>
                  <div>
                    {status === 'completed' && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    )}
                    {status === 'active' && (
                      <Loader2 className="w-6 h-6 text-[#FF7600] animate-spin" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Validation Progress */}
          <Card className="sidebar-panel" data-testid="validation-progress">
            <div className="panel-title">Validation Progress</div>
            <div className="space-y-1">
              {VALIDATION_STEPS.map((step) => {
                const status = getValidationStepStatus(step.id);
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className="validation-step" data-testid={`validation-step-${step.id}`}>
                    <div className="step-content">
                      <div className={`step-icon ${status}`}>
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : status === 'processing' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <StepIcon className="w-3 h-3" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        status === 'completed' ? 'text-black font-semibold' : 
                        status === 'processing' ? 'text-amber-700 font-bold' : 
                        'text-black font-medium'
                      }`}>
                        {step.id}. {step.name}
                      </span>
                    </div>
                    {status === 'completed' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Claim Approved Card */}
          {showCompletion && (
            <div className="claim-approved-card fade-in" data-testid="claim-approved-card">
              <div className="claim-approved-header">
                <div className="claim-approved-icon">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-emerald-800" style={{ fontFamily: 'Manrope' }}>
                    Claim Approved & Paid
                  </div>
                  <div className="text-sm text-emerald-600">Auto-processed by AI Agents</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-black font-semibold">Claim Number</div>
                  <div className="font-bold text-black" style={{ fontFamily: 'Manrope' }}>
                    CLM-TRV-2026-008431-1
                  </div>
                </div>
                <div>
                  <div className="text-xs text-black font-semibold">Claim Paid Amount</div>
                  <div className="font-bold text-2xl text-emerald-600" style={{ fontFamily: 'Manrope' }}>
                    $150
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Activity Log */}
        <div className="activity-log-white" data-testid="activity-log">
          <div className="activity-header-white">
            <div className="activity-dots-orange">
              <div className="activity-dot-orange" />
              <div className="activity-dot-orange" />
              <div className="activity-dot-orange" />
            </div>
            <div className="activity-title-black">Agent Activity Log</div>
          </div>
          <div className="activity-content-white custom-scrollbar" ref={scrollRef}>
            {logs.map((log, index) => (
              <div key={index} className="log-entry-white slide-in-right" data-testid={`log-entry-${index}`}>
                <div className="log-agent-black">
                  {AGENTS[log.agent]?.name || log.agent}:
                </div>
                <div className="log-message-black">
                  <span className="log-icon-black">
                    <LogIcon type={log.icon} />
                  </span>
                  <span>{log.message}</span>
                </div>
              </div>
            ))}
            {isRunning && logs.length > 0 && (
              <div className="flex items-center gap-2 text-black text-sm mt-2 font-semibold">
                <Loader2 className="w-4 h-4 animate-spin text-[#FF7600]" />
                Processing...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Made with Emergent watermark */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm text-gray-600">
        <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">e</span>
        </div>
        Made with Emergent
      </div>
    </div>
  );
}

export default App;
