'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  UserCircleIcon as HeaderUserIcon,
  CalendarDaysIcon,
  TagIcon,
  ArrowPathIcon as HeaderUpdateIcon,
} from '@heroicons/react/24/solid';
import {
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  SparklesIcon,
  DocumentTextIcon,
  UserIcon as StepUserIcon,
  ClipboardDocumentCheckIcon,
  BuildingLibraryIcon,
  ComputerDesktopIcon,
  CogIcon,
  CheckBadgeIcon,
  DocumentMagnifyingGlassIcon,
  DocumentCheckIcon as StepDocumentCheckIcon,
  InformationCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  ArrowPathIcon as PendingStepIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';


// --- Type Definitions ---
interface TrackingStep {
  status: number;
  statusText: string;
  description: string;
}

interface StatusHistoryEntry {
  status: number;
  statusText: string;
  timestamp: string;
  userNotes?: string;
}

export interface CustomTrackingData {
  customerName: string;
  submissionDate: string;
  currentStatus: number;
  statusText?: string;
  allStatuses: TrackingStep[];
  statusHistory: StatusHistoryEntry[];
}

interface CustomApplicationTrackingProps {
  trackingData: CustomTrackingData;
}

enum ECreditRepairStatus {
  GET_STARTED = 1,
  AUTHORIZE_CONNECT = 2,
  PARTNER_PROCESSING = 3,
  REPAIR_IN_PROGRESS = 4,
  CONFIRM_DELIVER = 5,
  REQUEST_DENIED = 6,
}
// --- End Type Definitions ---


// --- Animation Variants ---
const dashboardFadeInItem = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const contentVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: '0.75rem',
    scale: 1,
    transition: {
      height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
      opacity: { duration: 0.25, delay: 0.15 },
      scale: { duration: 0.35, ease: "easeOut" }
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    scale: 0.98,
    transition: {
      height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
      opacity: { duration: 0.2 },
      scale: { duration: 0.3 }
    },
  }
};

const staggeredContentVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 + (i * 0.1), duration: 0.35, ease: "easeOut" }
  })
};
// --- End Animation Variants ---


const getStepStatusIconComponent = (status: number, className: string = "w-5 h-5", state: 'pending' | 'current' | 'completed') => {
  const iconColorClass = state === 'pending' ? 'text-slate-500' : 'text-white';
  const effectiveClassName = `${className} ${iconColorClass}`;
  if (state === 'pending') return <PendingStepIcon className={effectiveClassName} />;
  switch (status) {
    case ECreditRepairStatus.GET_STARTED: return <ClipboardDocumentCheckIcon className={effectiveClassName} />;
    case ECreditRepairStatus.AUTHORIZE_CONNECT: return <DocumentTextIcon className={effectiveClassName} />;
    case ECreditRepairStatus.PARTNER_PROCESSING: return <BuildingLibraryIcon className={effectiveClassName} />;
    case ECreditRepairStatus.REPAIR_IN_PROGRESS: return <CogIcon className={effectiveClassName} />;
    case ECreditRepairStatus.CONFIRM_DELIVER: return <StepDocumentCheckIcon className={effectiveClassName} />;
    case ECreditRepairStatus.REQUEST_DENIED: return <XMarkIcon className={effectiveClassName} />;
    default: return <InformationCircleIcon className={effectiveClassName} />;
  }
};

export const CustomApplicationTracking: React.FC<CustomApplicationTrackingProps> = ({
  trackingData,
}) => {
  const { customerName, submissionDate, currentStatus, allStatuses, statusHistory } = trackingData;
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Check if the current status is REQUEST_DENIED
  const isRequestDenied = currentStatus === ECreditRepairStatus.REQUEST_DENIED;

  // Check if the application is completed (status is CONFIRM_DELIVER)
  const isApplicationCompleted = currentStatus === ECreditRepairStatus.CONFIRM_DELIVER;

  // Filter out REQUEST_DENIED from allStatuses unless it's the current status
  const filteredStatuses = allStatuses.filter(
    status => status.status !== ECreditRepairStatus.REQUEST_DENIED || isRequestDenied
  );

  useEffect(() => {
    setIsClient(true);
    // Always expand the CONFIRM_DELIVER step when it's the current status
    if (currentStatus === ECreditRepairStatus.CONFIRM_DELIVER) {
      setExpandedStep(ECreditRepairStatus.CONFIRM_DELIVER);
    } else {
      setExpandedStep(currentStatus);
    }
  }, [currentStatus]);

  const getStepState = (stepStatusValue: number): 'completed' | 'current' | 'pending' => {
    // If current status is CONFIRM_DELIVER (5), mark all steps including the current one as completed
    if (isApplicationCompleted) {
      return 'completed';
    }

    if (stepStatusValue < currentStatus) return 'completed';
    if (filteredStatuses.length > 0 && currentStatus > filteredStatuses[filteredStatuses.length - 1].status) {
      if (stepStatusValue <= filteredStatuses[filteredStatuses.length - 1].status) return 'completed';
    }
    if (stepStatusValue === currentStatus) return 'current';
    return 'pending';
  };

  const isAllStepsCompleted = filteredStatuses.every(s => getStepState(s.status) === 'completed');
  const currentStatusObject = filteredStatuses.find(s => s.status === currentStatus);
  const derivedCurrentStatusText = currentStatusObject?.statusText || (isAllStepsCompleted ? "All Steps Completed" : (trackingData.statusText || "Status Unknown"));
  const formatShortDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTimestamp = (timestamp: string) => new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });

  const getOverallProgress = () => {
    // If application is completed or all steps are completed, return 100%
    if (isAllStepsCompleted || isApplicationCompleted) return 100;

    const currentIndex = filteredStatuses.findIndex(s => s.status === currentStatus);
    if (currentIndex === -1 && filteredStatuses.length > 0 && currentStatus > filteredStatuses[filteredStatuses.length-1].status) return 100;
    if (currentIndex === -1 || filteredStatuses.length <= 1) return 0;
    return (currentIndex / (filteredStatuses.length - 1)) * 100;
  };

  const { lastUpdateTitle, lastUpdateValue } = (() => {
    const relevantHistory = statusHistory
      .filter(h =>
        // Filter out REQUEST_DENIED from history unless it's the current status
        (h.status !== ECreditRepairStatus.REQUEST_DENIED || isRequestDenied) &&
        getStepState(h.status) !== 'pending' &&
        new Date(h.timestamp).toString() !== "Invalid Date"
      );
    if (relevantHistory.length === 0) return { lastUpdateTitle: "Last Update", lastUpdateValue: "Awaiting first update" };
    const latestEntry = relevantHistory.reduce((latest, entry) => new Date(entry.timestamp) > new Date(latest.timestamp) ? entry : latest);
    const latestStepDetails = filteredStatuses.find(s => s.status === latestEntry.status);
    return {
        lastUpdateTitle: latestStepDetails ? `Activity: ${latestStepDetails.statusText}` : "Last Updated",
        lastUpdateValue: formatTimestamp(latestEntry.timestamp)
    };
  })();

  const nextPendingStep = filteredStatuses.find(s => getStepState(s.status) === 'pending');

  if (!isClient) return <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 text-center text-slate-400 max-w-3xl mx-auto">Initializing dashboard...</div>;
  if (!allStatuses || allStatuses.length === 0) return <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 text-center text-slate-400 max-w-3xl mx-auto">Application status configuration not available.</div>;

  const headerInfoItems = [
    { icon: CalendarDaysIcon, label: "Submitted", value: formatShortDate(submissionDate), color: "sky" },
    { icon: TagIcon, label: "Current Phase", value: derivedCurrentStatusText, color: "purple" },
    { icon: HeaderUpdateIcon, label: lastUpdateTitle, value: lastUpdateValue, color: "amber" },
  ];

  // Get the request denied status details if applicable
  const requestDeniedStatus = isRequestDenied ? allStatuses.find(s => s.status === ECreditRepairStatus.REQUEST_DENIED) : null;
  const requestDeniedHistory = isRequestDenied ? statusHistory.find(h => h.status === ECreditRepairStatus.REQUEST_DENIED) : null;

  return (
    <motion.div initial="hidden" animate="visible" variants={dashboardFadeInItem} className="bg-gradient-to-br from-slate-800 via-slate-800 to-indigo-900/70 rounded-2xl shadow-2xl shadow-indigo-900/40 p-6 md:p-8 text-slate-200 max-w-4xl mx-auto" aria-live="polite">
      <motion.div variants={dashboardFadeInItem} custom={0.2} className="mb-8">
        <h1 className="text-2xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">Hi, {customerName}!</h1>
        <p className="text-slate-300 text-lg mb-4">Here's the latest on your application.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {headerInfoItems.map((item, idx) => (
            <motion.div key={item.label} variants={dashboardFadeInItem} custom={0.4 + idx * 0.1} className={`bg-slate-700/60 p-4 rounded-xl border border-slate-600/80 flex items-start space-x-3 hover:border-${item.color}-500/60 transition-colors duration-200 shadow-md`}>
              <div className={`flex-shrink-0 bg-${item.color}-500/20 p-0 rounded-full mt-0.5`}><item.icon className={`h-5 w-5 text-${item.color}-400`} /></div>
              <div><h3 className="text-xs font-medium text-slate-400 tracking-wide uppercase">{item.label}</h3><p className="mt-0.5 text-sm font-semibold text-slate-100 leading-tight">{item.value}</p></div>
            </motion.div>
          ))}
        </div>
        <div className="border-b border-slate-700 my-4"></div>
        {isRequestDenied ? (
          <h2 className="text-2xl font-semibold text-red-400 mb-1">Request Denied</h2>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-100 mb-0">{isAllStepsCompleted || isApplicationCompleted ? "Application Process Complete" : "Your Progress Timeline"}</h2>
            {!(isAllStepsCompleted || isApplicationCompleted) && lastUpdateValue !== "Awaiting first update" && (<p className="text-xs text-slate-400">Timeline reflects activity up to: <span className="font-medium text-slate-300">{lastUpdateValue}</span></p>)}
          </>
        )}
      </motion.div>

      {isRequestDenied ? (
        <motion.div
          variants={dashboardFadeInItem}
          custom={0.8}
          className="bg-red-900/30 border border-red-800 rounded-xl p-6 text-center"
        >
          <XMarkIcon className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold text-red-300 mb-3">
            {requestDeniedStatus?.statusText || "Request Denied"}
          </h3>
          <p className="text-slate-300 mb-4">
            {requestDeniedStatus?.description || "Your credit repair request could not be processed. Any payment made will be refunded. Please contact our support team for more information."}
          </p>
          {requestDeniedHistory?.userNotes && (
            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 max-w-xl mx-auto text-left">
              <div className="flex items-center text-xs text-red-400 mb-2 font-medium">
                <ChatBubbleLeftEllipsisIcon className="w-4 h-4 mr-2 flex-shrink-0"/> Additional Information:
              </div>
              <p className="text-sm text-slate-300 italic">"{requestDeniedHistory.userNotes}"</p>
            </div>
          )}
          {requestDeniedHistory?.timestamp && (
            <p className="text-xs text-slate-400 mt-4 flex items-center justify-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              Decision made on: {formatTimestamp(requestDeniedHistory.timestamp)}
            </p>
          )}
        </motion.div>
      ) : (
        <motion.div variants={dashboardFadeInItem} custom={0.8} className="relative">
          <div className="absolute left-5 top-2.5 bottom-2.5 w-1 bg-slate-700/70 rounded-full transform -translate-x-1/2 z-0"></div>
          <motion.div className="absolute left-5 top-2.5 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full transform -translate-x-1/2 z-0" initial={{ height: 0 }} animate={{ height: `${getOverallProgress()}%` }} transition={{ duration: 1.5, ease: "circOut", delay: 1 }}/>

          <div className="space-y-3">
            {filteredStatuses.map((step, index) => {
            const state = getStepState(step.status);
            const historyEntry = statusHistory.find(h => h.status === step.status && new Date(h.timestamp).toString() !== "Invalid Date");
            const notes = historyEntry?.userNotes;
            const isExpanded = expandedStep === step.status;
            const isClickable = state !== 'pending';
            // Special case for CONFIRM_DELIVER when it's the current status
            const isCurrentStep = state === 'current' || (isApplicationCompleted && step.status === ECreditRepairStatus.CONFIRM_DELIVER);

            let nodeStyling = { bgColor: 'bg-slate-700', borderColor: 'border-slate-600', titleColor: 'text-slate-400', numberBadgeColor: 'bg-slate-500 text-white' };

            // Special styling for CONFIRM_DELIVER when it's the current status
            if (isApplicationCompleted && step.status === ECreditRepairStatus.CONFIRM_DELIVER) {
              nodeStyling = { ...nodeStyling, bgColor: 'bg-emerald-600', borderColor: 'border-emerald-500', titleColor: 'text-emerald-300 font-semibold', numberBadgeColor: 'bg-emerald-700 text-white' };
            } else if (state === 'completed') {
              nodeStyling = { ...nodeStyling, bgColor: 'bg-emerald-600', borderColor: 'border-emerald-500', titleColor: 'text-slate-100', numberBadgeColor: 'bg-emerald-700 text-white' };
            } else if (isCurrentStep) {
              nodeStyling = { ...nodeStyling, bgColor: 'bg-indigo-500', borderColor: 'border-indigo-400', titleColor: 'text-indigo-300 font-semibold', numberBadgeColor: 'bg-indigo-600 text-white' };
            } else {
              nodeStyling = { ...nodeStyling, bgColor: 'bg-slate-800', borderColor: 'border-slate-600', titleColor: 'text-slate-500', numberBadgeColor: 'bg-slate-600 text-slate-300' };
            }

           
            // Base classes for all step items
            let itemWrapperClasses = "relative pl-12 py-3 group transition-opacity duration-300";
            if (state === 'pending' && !isExpanded) itemWrapperClasses += ' opacity-60 hover:opacity-100';
            else itemWrapperClasses += ' opacity-100';

            // Additive classes for the current step
            if (isCurrentStep) {
              if (isApplicationCompleted && step.status === ECreditRepairStatus.CONFIRM_DELIVER) {
                itemWrapperClasses += ' bg-emerald-700/20 rounded-lg px-3 current-step-glow-green'; // Green glow for completed final step
              } else {
                itemWrapperClasses += ' bg-slate-700/50 rounded-lg px-3 current-step-glow'; // Use px-3, no -ml- -mr-
              }
            }

            // Node icon's left position is now always left-5
            const nodeLeftClass = 'left-5';

            // Adjust content padding for current step to maintain text alignment
            // Inactive: item pl-12 (3rem) + content pl-4 (1rem) = 4rem total text indent
            // Active: item pl-12 (3rem) + item px-3 (adds 0.75rem pl) + content pl-1 (0.25rem) = 4rem total
            const contentPlClass = isCurrentStep ? 'pl-1' : 'pl-4';
            // --- END MODIFICATION ---

            return (
              <motion.div
                layout
                key={step.status}
                variants={dashboardFadeInItem}
                custom={1 + index * 0.05}
                className={itemWrapperClasses} // Apply dynamically constructed classes
                aria-current={isCurrentStep ? "step" : undefined}
              >
                <motion.div
                  // layout // Removed layout from node wrapper
                  className={`absolute ${nodeLeftClass} top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${nodeStyling.bgColor} ${nodeStyling.borderColor} z-10`}
                  whileHover={isClickable && !shouldReduceMotion ? { scale: 1.15, transition: { type: 'spring', stiffness: 300 } } : {}}
                  onClick={() => isClickable && setExpandedStep(isExpanded ? null : step.status)}
                  tabIndex={isClickable ? 0 : -1}
                  onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && isClickable && setExpandedStep(isExpanded ? null : step.status)}
                  aria-expanded={isExpanded}
                  aria-controls={`step-content-${step.status}`}
                >
                  {state === 'completed' || (isApplicationCompleted && step.status === ECreditRepairStatus.CONFIRM_DELIVER) ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 }}><CheckIcon className="w-5 h-5 text-white" /></motion.div>
                  ) : ( getStepStatusIconComponent(step.status, `w-5 h-5`, state) )}
                  <div className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-slate-800 ${nodeStyling.numberBadgeColor}`}>{step.status}</div>
                  {isCurrentStep && !shouldReduceMotion && (
                    <motion.div
                      className={`absolute inset-[-2px] rounded-full border-2 ${isApplicationCompleted && step.status === ECreditRepairStatus.CONFIRM_DELIVER ? 'border-emerald-400/70' : 'border-indigo-400/70'}`}
                      animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay:0.5 }}
                    />
                  )}
                </motion.div>

                <motion.div layout className={contentPlClass}> {/* Use dynamic content padding class */}
                  <motion.div
                    className={`flex justify-between items-center ${isClickable ? 'cursor-pointer group-hover:bg-slate-700/70 -mx-2 px-2 py-1.5 rounded-md transition-all duration-200' : 'cursor-default -mx-2 px-2 py-1.5'}`}
                    onClick={() => isClickable && setExpandedStep(isExpanded ? null : step.status)}
                    aria-hidden={!isClickable}
                    whileHover={isClickable && !shouldReduceMotion ? { backgroundColor: 'rgba(51, 65, 85, 0.5)' } : {}}
                    animate={isExpanded ? { backgroundColor: 'rgba(51, 65, 85, 0.4)' } : { backgroundColor: 'rgba(0,0,0,0)'}}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className={`text-sm md:text-xl ${nodeStyling.titleColor} transition-colors duration-200`}>{step.statusText}</h3>
                    <div className="flex items-center">
                      {(state === 'completed' || isCurrentStep) && historyEntry?.timestamp && (
                        <span className={`text-xs mr-3 font-medium flex items-center ${isCurrentStep ? 'text-indigo-300' : 'text-slate-400'}`}>
                          <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />{formatTimestamp(historyEntry.timestamp)}
                        </span>
                      )}
                      {isClickable && (<motion.div className="flex items-center justify-center w-5 h-5 ml-2" animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}><ChevronDownIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-200 transition-colors duration-200" /></motion.div>)}
                    </div>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {isExpanded && isClickable && (
                      <motion.div layout id={`step-content-${step.status}`} variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="pr-2 overflow-hidden">
                        <motion.div variants={staggeredContentVariants} custom={0} className="accordion-content-wrapper"><p className="text-sm text-slate-300 mb-3 leading-relaxed">{step.description}</p></motion.div>
                        {historyEntry?.timestamp && (<motion.div variants={staggeredContentVariants} custom={1} className="flex items-center text-xs text-slate-400 mb-3"><ClockIcon className="w-4 h-4 mr-2 text-indigo-400 flex-shrink-0" /><span>{state === 'completed' ? 'Completed:' : 'Updated:'} <span className="font-medium text-slate-200">{formatTimestamp(historyEntry.timestamp)}</span></span></motion.div>)}
                        {notes && (<motion.div variants={staggeredContentVariants} custom={2} className="bg-slate-700/80 p-3 rounded-lg border border-slate-600/90 shadow-inner"><div className="flex items-center text-xs text-indigo-300 mb-1.5 font-medium"><ChatBubbleLeftEllipsisIcon className="w-4 h-4 mr-2 flex-shrink-0"/> Our team's note:</div><p className="text-sm text-slate-300 italic">"{notes}"</p></motion.div>)}
                        {isCurrentStep && nextPendingStep && !isAllStepsCompleted && !isApplicationCompleted && (<motion.div variants={staggeredContentVariants} custom={3} className="mt-4 pt-3 border-t border-slate-700/80"><div className="flex items-center text-xs text-purple-400 mb-1 font-medium"><SparklesIcon className="w-4 h-4 mr-2 flex-shrink-0" /> What's next:</div><p className="text-sm text-slate-300 font-medium">{nextPendingStep.statusText}</p><p className="text-xs text-slate-400">{nextPendingStep.description}</p></motion.div>)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!isExpanded && state === 'pending' && (<p className="text-sm text-slate-500 mt-1 leading-relaxed">{step.description}</p>)}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      )}

      {!isRequestDenied && (isAllStepsCompleted || isApplicationCompleted) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness:150 }}
          className="mt-10 text-center bg-emerald-600/30 border border-emerald-500/70 text-emerald-200 p-6 rounded-lg shadow-lg"
        >
          <CheckBadgeIcon className="w-12 h-12 mx-auto mb-3 text-emerald-400"/>
          <p className="font-semibold text-xl">Application Process Finished!</p>
          <p className="text-sm text-emerald-300">Congratulations, all steps have been successfully completed.</p>
        </motion.div>
      )}
      <style jsx global>{`
        .current-step-glow { box-shadow: 0 0 25px -5px rgba(99, 102, 241, 0.2), 0 0 10px -3px rgba(99, 102, 241, 0.1); }
        .current-step-glow-green { box-shadow: 0 0 25px -5px rgba(16, 185, 129, 0.2), 0 0 10px -3px rgba(16, 185, 129, 0.1); }
        .accordion-content-wrapper { transform-origin: top; will-change: transform, opacity; }
        .hover\\:border-sky-500\\/60:hover { border-color: rgba(14, 165, 233, 0.6) !important; } .bg-sky-500\\/20 { background-color: rgba(14, 165, 233, 0.2) !important; } .text-sky-400 { color: #38bdf8 !important; }
        .hover\\:border-purple-500\\/60:hover { border-color: rgba(168, 85, 247, 0.6) !important; } .bg-purple-500\\/20 { background-color: rgba(168, 85, 247, 0.2) !important; } .text-purple-400 { color: #c084fc !important; }
        .hover\\:border-amber-500\\/60:hover { border-color: rgba(245, 158, 11, 0.6) !important; } .bg-amber-500\\/20 { background-color: rgba(245, 158, 11, 0.2) !important; } .text-amber-400 { color: #f59e0b !important; }
        .text-emerald-300 { color: #6ee7b7 !important; }
      `}</style>
    </motion.div>
  );
};