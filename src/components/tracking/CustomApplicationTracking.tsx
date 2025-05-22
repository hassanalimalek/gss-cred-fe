'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  CalendarDaysIcon,
  TagIcon,
  ArrowPathIcon as HeaderUpdateIcon,
} from '@heroicons/react/24/solid';
import {
  CheckIcon,
  ClockIcon,
  SparklesIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  BuildingLibraryIcon,
  CogIcon,
  CheckBadgeIcon,
  DocumentCheckIcon as StepDocumentCheckIcon,
  InformationCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  ArrowPathIcon as PendingStepIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ECreditRepairStatus } from '@/types/creditRepair';


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
  trackingId?: string; // Add tracking ID field
}

interface CustomApplicationTrackingProps {
  trackingData: CustomTrackingData;
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
  const { customerName, submissionDate, currentStatus, allStatuses, statusHistory, trackingId } = trackingData;
  const [modalStep, setModalStep] = useState<number | null>(null);
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
  }, []);

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
    <motion.div initial="hidden" animate="visible" variants={dashboardFadeInItem} className="bg-slate-800 rounded-2xl shadow-2xl shadow-slate-900/30 p-6 md:p-8 text-slate-200 max-w-7xl lg:max-w-7xl  mx-auto" aria-live="polite">
      <motion.div variants={dashboardFadeInItem} custom={0.2} className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">Hi, {customerName}!</h1>
            <p className="text-slate-300 text-lg mb-4">Here's the latest on your application.</p>
          </div>
          {trackingId && (
            <div className="bg-slate-700/60 px-3 py-2 rounded-lg border border-slate-600/80 text-right">
              <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">Tracking ID</p>
              <p className="text-sm font-mono font-semibold text-indigo-300">{trackingId}</p>
            </div>
          )}
        </div>
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
          {/* Vertical timeline track for mobile */}
          <div className="md:hidden absolute left-5 top-2.5 bottom-2.5 w-1 bg-slate-600 rounded-full transform -translate-x-1/2 z-0"></div>
          <motion.div
            className="md:hidden absolute left-5 top-2.5 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full transform -translate-x-1/2 z-0"
            initial={{ height: 0 }}
            animate={{
              height: `${getOverallProgress()}%`,
              transition: { duration: 1.5, ease: "circOut", delay: 1 }
            }}
            whileInView={{
              opacity: [0.8, 1, 0.8],
              boxShadow: [
                "0 0 3px 0px rgba(99, 102, 241, 0.3)",
                "0 0 10px 2px rgba(99, 102, 241, 0.6)",
                "0 0 3px 0px rgba(99, 102, 241, 0.3)"
              ]
            }}
            transition={{
              opacity: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
              boxShadow: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
            }}
          />

          {/* Horizontal timeline track for desktop */}
          <div className="hidden md:block absolute left-0 right-0 top-5 h-1.5 bg-slate-600 rounded-full z-0"></div>
          <motion.div
            className="hidden md:block absolute left-0 top-5 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full z-0"
            initial={{ width: 0 }}
            animate={{
              width: `${getOverallProgress()}%`,
              transition: { duration: 1.5, ease: "circOut", delay: 1 }
            }}
            whileInView={{
              opacity: [0.8, 1, 0.8],
              boxShadow: [
                "0 0 3px 0px rgba(99, 102, 241, 0.3)",
                "0 0 10px 2px rgba(99, 102, 241, 0.6)",
                "0 0 3px 0px rgba(99, 102, 241, 0.3)"
              ]
            }}
            transition={{
              opacity: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
              boxShadow: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
            }}
          />

          {/* Status items - vertical on mobile, horizontal on desktop */}
          <div className="space-y-3 md:space-y-0 md:flex md:justify-between md:items-start md:space-x-6 md:pt-12 md:px-6">
            {filteredStatuses.map((step, index) => {
            const state = getStepState(step.status);
            const historyEntry = statusHistory.find(h => h.status === step.status && new Date(h.timestamp).toString() !== "Invalid Date");
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
              // Make pending steps more visible with lighter colors
              nodeStyling = { ...nodeStyling, bgColor: 'bg-slate-600', borderColor: 'border-slate-500', titleColor: 'text-slate-300', numberBadgeColor: 'bg-slate-500 text-white' };
            }


            // Base classes for all step items - different for mobile vs desktop
            let itemWrapperClasses = "relative group transition-opacity duration-300 md:flex-1 md:flex md:flex-col md:items-center";

            // Mobile-specific classes
            itemWrapperClasses += " pl-12 py-3";

            // Desktop-specific classes
            itemWrapperClasses += " md:pl-0 md:py-0";

            // Opacity classes
            if (state === 'pending') itemWrapperClasses += ' opacity-60 hover:opacity-100';
            else itemWrapperClasses += ' opacity-100';

            // Additive classes for the current step
            if (isCurrentStep) {
              if (isApplicationCompleted && step.status === ECreditRepairStatus.CONFIRM_DELIVER) {
                // Green glow for completed final step
                itemWrapperClasses += ' bg-emerald-700/20 rounded-lg px-3 md:px-2 md:py-2 current-step-glow-green';
              } else {
                // Regular glow for current step
                itemWrapperClasses += ' bg-slate-700/50 rounded-lg px-3 md:px-2 md:py-2 current-step-glow';
              }
            }

            // Node positioning - different for mobile vs desktop
            const nodeLeftClass = 'left-5 md:static md:left-auto md:transform-none md:mb-3';

            // Content padding - different for mobile vs desktop
            const contentPlClass = isCurrentStep
              ? 'pl-1 md:pl-0 md:w-full md:text-center'
              : 'pl-4 md:pl-0 md:w-full md:text-center';
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
                  className={`absolute md:relative ${nodeLeftClass} top-1/2 md:top-auto -translate-y-1/2 md:translate-y-0 -translate-x-1/2 md:translate-x-0 w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${nodeStyling.bgColor} ${nodeStyling.borderColor} z-10`}
                  whileHover={isClickable && !shouldReduceMotion ? { scale: 1.15, transition: { type: 'spring', stiffness: 300 } } : {}}
                  onClick={() => isClickable && setModalStep(step.status)}
                  tabIndex={isClickable ? 0 : -1}
                  onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && isClickable && setModalStep(step.status)}
                  aria-haspopup="dialog"
                  aria-controls={`modal-content-${step.status}`}
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
                  <div className="flex md:flex-col justify-between md:justify-center items-center -mx-2 px-2 py-1.5">
                    <h3 className={`text-sm md:text-xl ${nodeStyling.titleColor} transition-colors duration-200`}>{step.statusText}</h3>
                    <div className="flex items-center">
                      {(state === 'completed' || isCurrentStep) && historyEntry?.timestamp && (
                        <span className={`text-xs mr-3 md:mr-0 md:mt-1 font-medium flex items-center ${isCurrentStep ? 'text-indigo-300' : 'text-slate-400'}`}>
                          <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />{formatTimestamp(historyEntry.timestamp)}
                        </span>
                      )}
                      {isClickable && (
                        <motion.button
                          className={`flex items-center justify-center w-6 h-6 ml-2  md:mt-2 rounded-full bg-indigo-500/80 hover:bg-indigo-500 transition-colors duration-200 shadow-md`}
                          onClick={() => setModalStep(step.status)}
                          whileHover={!shouldReduceMotion ? { scale: 1.1 } : {}}
                          whileTap={!shouldReduceMotion ? { scale: 0.95 } : {}}
                          aria-haspopup="dialog"
                          aria-controls={`modal-content-${step.status}`}
                        >
                          <InformationCircleIcon className="w-4 h-4 text-white " />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {state === 'pending' && (<p className="text-sm text-slate-300 mt-1 leading-relaxed md:text-center">{step.description}</p>)}
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
      {/* Step Detail Modal */}
      <AnimatePresence>
        {modalStep !== null && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const step = filteredStatuses.find(s => s.status === modalStep);
                if (!step) return null;

                const state = getStepState(step.status);
                const historyEntry = statusHistory.find(h => h.status === step.status && new Date(h.timestamp).toString() !== "Invalid Date");
                const notes = historyEntry?.userNotes;
                const isCurrentStep = state === 'current' || (isApplicationCompleted && step.status === ECreditRepairStatus.CONFIRM_DELIVER);

                return (
                  <>
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-700">
                      <h2 className="text-xl font-semibold text-white">{step.statusText}</h2>
                      <button
                        onClick={() => setModalStep(null)}
                        className="flex items-center text-slate-400 hover:text-white transition-colors"
                        aria-label="Close modal"
                      >
                        <span className="mr-1 text-sm">Close</span>
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-medium text-white mb-2">Description</h3>
                        <p className="text-slate-300">{step.description}</p>
                      </div>

                      {historyEntry?.timestamp && (
                        <div>
                          <h3 className="text-base font-medium text-white mb-2">
                            {state === 'completed' ? 'Completed' : 'Last Updated'}
                          </h3>
                          <p className="text-slate-300 flex items-center">
                            <ClockIcon className="w-4 h-4 mr-2 text-indigo-400 flex-shrink-0" />
                            <span className="font-medium">{formatTimestamp(historyEntry.timestamp)}</span>
                          </p>
                        </div>
                      )}

                      {notes && (
                        <div>
                          <h3 className="text-base font-medium text-white mb-2">Team Notes</h3>
                          <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                            <p className="text-slate-300 italic">"{notes}"</p>
                          </div>
                        </div>
                      )}

                      {isCurrentStep && nextPendingStep && !isAllStepsCompleted && !isApplicationCompleted && (
                        <div className="border-t border-slate-700 pt-4 mt-4">
                          <h3 className="text-base font-medium text-white mb-2">What's Next</h3>
                          <p className="text-slate-300 font-medium">{nextPendingStep.statusText}</p>
                          <p className="text-sm text-slate-400 mt-1">{nextPendingStep.description}</p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .current-step-glow { box-shadow: 0 0 25px -5px rgba(99, 102, 241, 0.2), 0 0 10px -3px rgba(99, 102, 241, 0.1); }
        .current-step-glow-green { box-shadow: 0 0 25px -5px rgba(16, 185, 129, 0.2), 0 0 10px -3px rgba(16, 185, 129, 0.1); }
        .hover\\:border-sky-500\\/60:hover { border-color: rgba(14, 165, 233, 0.6) !important; } .bg-sky-500\\/20 { background-color: rgba(14, 165, 233, 0.2) !important; } .text-sky-400 { color: #38bdf8 !important; }
        .hover\\:border-purple-500\\/60:hover { border-color: rgba(168, 85, 247, 0.6) !important; } .bg-purple-500\\/20 { background-color: rgba(168, 85, 247, 0.2) !important; } .text-purple-400 { color: #c084fc !important; }
        .hover\\:border-amber-500\\/60:hover { border-color: rgba(245, 158, 11, 0.6) !important; } .bg-amber-500\\/20 { background-color: rgba(245, 158, 11, 0.2) !important; } .text-amber-400 { color: #f59e0b !important; }
        .text-emerald-300 { color: #6ee7b7 !important; }

        /* Add connector lines between steps on desktop */
        @media (min-width: 768px) {
          .relative.group.md\\:flex-1:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 5px;
            right: -50%;
            width: 100%;
            height: 1.5px;
            background-color: rgba(99, 102, 241, 0.4);
            z-index: 0;
          }
        }
      `}</style>
    </motion.div>
  );
};