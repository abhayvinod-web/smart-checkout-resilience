import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  FileText,
  Clock,
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

type PaymentMethod = 'upi' | 'card' | 'netbanking';
type Step = 'select' | 'processing' | 'failed' | 'otp' | 'success';

export default function App() {
  // Simulator Controls
  const [simulateOutage, setSimulateOutage] = useState<boolean>(true);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [upiApp, setUpiApp] = useState<string>('gpay');
  const [customUpi, setCustomUpi] = useState<string>('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8891');
  const [cardExpiry, setCardExpiry] = useState<string>('09/28');
  const [cardCvv, setCardCvv] = useState<string>('432');
  
  // State Machine
  const [step, setStep] = useState<Step>('select');
  const [otpVal, setOtpVal] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(30);
  const [failureReason, setFailureReason] = useState<string>('');
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    'System initialized with Gateway Health Telemetry API v2.4',
    'Bank Health Monitor: HDFC UPI degraded (38% latency), ICICI UPI operational (99.8%)'
  ]);
  const [recoveredWithFallback, setRecoveredWithFallback] = useState<boolean>(false);

  const orderAmount = 2499;

  const addLog = (msg: string) => {
    setTelemetryLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 7)]);
  };

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const handleInitiatePayment = () => {
    setStep('processing');
    addLog(`Initiating ₹${orderAmount} transaction via ${selectedMethod.toUpperCase()} (${selectedMethod === 'upi' ? upiApp : selectedBank})...`);
    
    setTimeout(() => {
      if (simulateOutage && selectedMethod === 'upi' && (selectedBank.includes('HDFC') || upiApp === 'gpay')) {
        setStep('failed');
        setFailureReason('Bank Gateway Timed Out: High latency detected on primary UPI routing switch.');
        addLog('ALERT: Bank Gateway timeout (HTTP 504) on primary routing switch. Preserving session state & idempotency token.');
      } else {
        setStep('otp');
        setOtpTimer(30);
        addLog('Payment routing active. Simulated 2FA OTP dispatched to registered mobile.');
      }
    }, 1500);
  };

  const handleOtpVerify = () => {
    setStep('processing');
    addLog('Verifying 2FA authorization token with banking network...');
    setTimeout(() => {
      setStep('success');
      addLog('Transaction authorized successfully (TxnID: TXN_88492048). Order placed!');
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }, 1000);
  };

  const handleInstantFallback = (fallbackMethod: PaymentMethod, fallbackBankOrApp: string) => {
    setSelectedMethod(fallbackMethod);
    if (fallbackMethod === 'card') {
      setSelectedBank('Visa Platinum');
    } else {
      setSelectedBank(fallbackBankOrApp);
      setUpiApp('phonepe');
    }
    setRecoveredWithFallback(true);
    setStep('processing');
    addLog(`Intelligent Fallback triggered -> Switched payment rail to ${fallbackMethod.toUpperCase()} with 0 session loss.`);

    setTimeout(() => {
      setStep('otp');
      setOtpTimer(25);
      addLog('Fallback rail secured. Dispatched auto-verifiable OTP code: 8942');
    }, 1200);
  };

  const resetSimulation = () => {
    setStep('select');
    setOtpVal('');
    setOtpTimer(30);
    setFailureReason('');
    setRecoveredWithFallback(false);
    addLog('Simulation state reset to default.');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              ⚡
            </div>
            <div>
              <h1 className="font-bold text-sm md:text-base text-white tracking-tight">Smart Checkout Resilience Engine</h1>
              <p className="text-xs text-slate-400">Razorpay Fix My Itch Prototype • Zero-Drop Payment Recovery</p>
            </div>
          </div>
          <a 
            href="https://github.com/abhayvinod-web/smart-checkout-resilience" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
        <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl text-slate-900">
          
          {/* Top Banner / Simulator Header */}
          <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-900">Interactive Simulation:</span>
              <span className="text-slate-600">Checkout Downtime Resilience & One-Click Auto-Retry</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-slate-500 font-medium">Simulate Outage:</span>
                <button
                  onClick={() => setSimulateOutage(!simulateOutage)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    simulateOutage ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {simulateOutage ? 'ON (Flaky HDFC)' : 'OFF (All 100%)'}
                </button>
              </div>
              
              <button
                onClick={resetSimulation}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-sm cursor-pointer"
                title="Reset simulation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="font-medium">Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            {/* Left Column: Checkout Interface */}
            <div className="lg:col-span-7 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
              <div>
                {/* Merchant / Order Summary */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-sm">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Acme Merchant Checkout</h4>
                      <p className="text-xs text-slate-500 font-mono">ORD-772910 • 1 item</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium">Amount Due</p>
                    <p className="text-xl font-bold text-slate-900 font-mono">₹{orderAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Gateway Outage Warning Banner if enabled */}
                {simulateOutage && step === 'select' && (
                  <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Live Gateway Telemetry Notice:</p>
                      <p className="text-amber-800 mt-0.5">
                        HDFC UPI nodes are experiencing 38% network dropouts. 
                        <span className="font-semibold"> We recommend Cards or PhonePe for uninterrupted checkout.</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP: SELECT PAYMENT METHOD */}
                {step === 'select' && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedMethod('upi')}
                        className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                          selectedMethod === 'upi'
                            ? 'bg-slate-900 text-white border-slate-900 shadow'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>UPI / QR</span>
                      </button>

                      <button
                        onClick={() => setSelectedMethod('card')}
                        className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                          selectedMethod === 'card'
                            ? 'bg-slate-900 text-white border-slate-900 shadow'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Cards (Debit/Credit)</span>
                      </button>

                      <button
                        onClick={() => setSelectedMethod('netbanking')}
                        className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                          selectedMethod === 'netbanking'
                            ? 'bg-slate-900 text-white border-slate-900 shadow'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Net Banking</span>
                      </button>
                    </div>

                    {/* Sub-form based on method */}
                    {selectedMethod === 'upi' && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <p className="text-xs font-bold text-slate-700">Choose UPI Application:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'gpay', name: 'Google Pay', status: simulateOutage ? '⚠️ 38% Drop' : '⚡ 99.8%' },
                            { id: 'phonepe', name: 'PhonePe', status: '⚡ 99.8% OK' },
                            { id: 'paytm', name: 'Paytm UPI', status: '⚡ 99.4% OK' }
                          ].map(app => (
                            <button
                              key={app.id}
                              onClick={() => setUpiApp(app.id)}
                              className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                                upiApp === app.id
                                  ? 'bg-white border-slate-900 text-slate-900 shadow-sm font-semibold'
                                  : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                              }`}
                            >
                              <div className="text-xs font-bold">{app.name}</div>
                              <div className={`text-[10px] mt-0.5 font-mono ${app.status.includes('⚠️') ? 'text-amber-700' : 'text-emerald-600'}`}>
                                {app.status}
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="pt-2">
                          <label className="text-xs text-slate-600 block mb-1 font-medium">Or enter custom UPI VPA ID:</label>
                          <input
                            type="text"
                            value={customUpi}
                            onChange={e => setCustomUpi(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                            placeholder="username@bank"
                          />
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'card' && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">Saved Card (Encrypted Token)</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-medium">
                            100% Gateway Health
                          </span>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1 font-medium">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-900"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-600 block mb-1 font-medium">Expiry Date</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={e => setCardExpiry(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-900"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-600 block mb-1 font-medium">CVV</label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={e => setCardCvv(e.target.value)}
                              maxLength={4}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'netbanking' && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <p className="text-xs font-bold text-slate-800">Select Bank:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {['HDFC Bank (⚠️ Degraded)', 'ICICI Bank (⚡ 99.8%)', 'SBI Banking (⚡ Normal)', 'Axis Bank (⚡ Normal)'].map(b => (
                            <button
                              key={b}
                              onClick={() => setSelectedBank(b)}
                              className={`p-2.5 rounded-lg border text-left text-xs cursor-pointer ${
                                selectedBank === b
                                  ? 'bg-white border-slate-900 font-bold text-slate-900 shadow-sm'
                                  : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleInitiatePayment}
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay ₹{orderAmount.toLocaleString('en-IN')} via {selectedMethod.toUpperCase()}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* STEP: PROCESSING */}
                {step === 'processing' && (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-12 h-12 mx-auto border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Processing with Banking Rail...</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Preserving transaction state and establishing idempotent token connection.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP: FAILED WITH 1-CLICK SMART FALLBACK */}
                {step === 'failed' && (
                  <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 font-bold">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-rose-900 text-xs">Payment Incomplete on Primary Gateway</h4>
                        <p className="text-xs text-rose-700 mt-0.5">{failureReason}</p>
                      </div>
                    </div>

                    {/* HERO FEATURE: Instant Fallback */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          Smart Checkout Auto-Recovery
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono font-semibold">
                          Session Preserved
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Your cart of <strong className="text-slate-900 font-mono">₹{orderAmount}</strong> is saved. Select an instant fallback channel to complete the payment immediately:
                      </p>

                      <div className="space-y-2">
                        <button
                          onClick={() => handleInstantFallback('card', 'Visa Platinum')}
                          className="w-full p-3 bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-left transition cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <CreditCard className="w-4 h-4 text-indigo-600" />
                            <div>
                              <p className="font-bold text-slate-900">Switch to Saved Visa Card (••• 8891)</p>
                              <p className="text-[10px] text-emerald-700">100% gateway uptime • No re-filling needed</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-indigo-600 underline underline-offset-2">
                            1-Click Retry →
                          </span>
                        </button>

                        <button
                          onClick={() => handleInstantFallback('upi', 'PhonePe (Direct)')}
                          className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-left transition cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Smartphone className="w-4 h-4 text-slate-700" />
                            <div>
                              <p className="font-bold text-slate-800">Switch to PhonePe UPI Rail</p>
                              <p className="text-[10px] text-emerald-700">99.8% Gateway Health Rate</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-700 group-hover:underline">
                            Retry via PhonePe →
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[11px] text-slate-500">
                      <span>Idempotency Key: <code className="text-slate-700 font-mono">idmp_9921_x3</code></span>
                      <button onClick={resetSimulation} className="text-slate-600 hover:text-slate-900 underline cursor-pointer">
                        Cancel & Back
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP: OTP SCREEN */}
                {step === 'otp' && (
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-900">Bank 2FA Verification</span>
                      </div>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-amber-600" /> {otpTimer}s remaining
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Enter the 4-digit code dispatched to your registered number (+91 98••••••42)
                    </p>

                    <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs shadow-sm">
                      <span className="text-slate-700 text-xs">Simulated SMS code: <strong>8942</strong></span>
                      <button
                        onClick={() => setOtpVal('8942')}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Auto-Fill (8942)
                      </button>
                    </div>

                    <div className="flex gap-2 justify-center py-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={otpVal}
                        onChange={e => setOtpVal(e.target.value)}
                        className="w-40 text-center tracking-[0.5em] text-lg font-mono bg-white border border-slate-300 rounded-xl py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                        placeholder="••••"
                      />
                    </div>

                    <button
                      onClick={handleOtpVerify}
                      disabled={otpVal.length < 4}
                      className={`w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                        otpVal.length >= 4
                          ? 'bg-slate-900 hover:bg-slate-800 text-white shadow'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify & Pay ₹{orderAmount.toLocaleString('en-IN')}</span>
                    </button>
                  </div>
                )}

                {/* STEP: SUCCESS */}
                {step === 'success' && (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-700 mx-auto font-bold">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-emerald-900">Payment Verified & Settled!</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {recoveredWithFallback ? (
                          <span className="text-indigo-700 font-semibold">✨ Recovered via Smart Fallback routing with zero drop-off.</span>
                        ) : (
                          'Processed seamlessly on primary gateway.'
                        )}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 font-mono shadow-sm">
                      <div className="flex justify-between text-slate-500">
                        <span>Transaction ID:</span>
                        <span className="text-slate-900 font-bold">TXN_88492048</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Payment Method:</span>
                        <span className="text-slate-900 uppercase">{selectedMethod} ({selectedMethod === 'card' ? 'Visa' : upiApp})</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Amount Paid:</span>
                        <span className="text-emerald-700 font-bold">₹{orderAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={resetSimulation}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs rounded-xl transition font-medium border border-slate-200 cursor-pointer"
                      >
                        Test Another Scenario
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Badges */}
              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> 256-Bit SSL Encrypted
                </span>
                <span className="flex items-center gap-1 font-mono">
                  Idempotent Token Engine
                </span>
              </div>
            </div>

            {/* Right Column: Telemetry & Logs */}
            <div className="lg:col-span-5 p-6 md:p-8 bg-slate-50 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <h5 className="font-bold text-xs text-slate-800 uppercase tracking-widest">
                    Gateway Telemetry & Logs
                  </h5>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 mb-4 text-xs shadow-sm">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Gateway Health Scorecard:</div>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between items-center text-[11px] mb-1">
                        <span className="text-slate-700 font-medium">Cards (Visa/Mastercard)</span>
                        <span className="text-emerald-700 font-mono font-bold">99.9% • 120ms</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[99.9%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[11px] mb-1">
                        <span className="text-slate-700 font-medium">HDFC UPI Rail</span>
                        <span className={`font-mono font-bold ${simulateOutage ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {simulateOutage ? '62.0% • 3200ms (Degraded)' : '99.4% • 180ms'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${simulateOutage ? 'bg-amber-500 w-[62%]' : 'bg-emerald-500 w-[99%]'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
                    <span>Event Bus Logs:</span>
                    <span>state: {step}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300 space-y-1.5 min-h-[140px] max-h-[180px] overflow-y-auto">
                    {telemetryLogs.map((log, i) => (
                      <div key={i} className="leading-tight border-b border-slate-800 pb-1 last:border-0">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs space-y-1">
                <span className="font-bold text-indigo-900 text-[11px] block">Problem Solved:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Preserves transaction state during gateway timeouts and enables instant rail substitution without cart abandonment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
