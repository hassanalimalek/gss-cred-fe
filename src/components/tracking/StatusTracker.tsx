'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  SparklesIcon, // For "What's Next"
} from '@heroicons/react/24/solid';
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  BuildingLibraryIcon,
  CogIcon,
  CheckBadgeIcon,
  DocumentCheckIcon,
  InformationCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  ArrowPathIcon, // For pending state
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ECreditRepairStatus } from '@/types/creditRepair';

const fadeInItem = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const contentVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: '0.75rem', // mt-3
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }
};
// --- End of self-contained definitions ---

interface StatusTrackerProps {
  currentStatus: number;
  allStatuses: Array<{
    status: number;
    statusText: string;
    description: string;
  }>;
  statusHistory: Array<{
    status: number;
    statusText: string;
    timestamp: string;
    userNotes?: string;
  }>;
}

const getStatusIcon = (status: number, className: string = "w-5 h-5", state: 'pending' | 'current' | 'completed') => {
  if (state === 'pending') return <ArrowPathIcon className={`${className} text-slate-500`} />;

  switch (status) {
    case ECreditRepairStatus.GET_STARTED:
      return <ClipboardDocumentCheckIcon className={className} />;
    case ECreditRepairStatus.AUTHORIZE_CONNECT:
      return <DocumentTextIcon className={className} />;
    case ECreditRepairStatus.PARTNER_PROCESSING:
      return <BuildingLibraryIcon className={className} />;
    case ECreditRepairStatus.REPAIR_IN_PROGRESS:
      return <CogIcon className={className} />;
    case ECreditRepairStatus.CONFIRM_DELIVER:
      return <DocumentCheckIcon className={className} />;
    case ECreditRepairStatus.REQUEST_DENIED:
      return <XMarkIcon className={className} />;
    default:
      return <InformationCircleIcon className={className} />;
  }
};

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  currentStatus,
  allStatuses,
  statusHistory,
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsClient(true);
    setExpandedStep(currentStatus);
  }, [currentStatus]);

  const getStepState = (stepStatusValue: number): 'completed' | 'current' | 'pending' => {
    if (stepStatusValue < currentStatus) return 'completed';
    // If currentStatus is greater than the last status in allStatuses, all are completed
    if (allStatuses.length > 0 && currentStatus > allStatuses[allStatuses.length - 1].status) {
        return 'completed';
    }
    if (stepStatusValue === currentStatus) return 'current';
    return 'pending';
  };

  const isAllStepsCompleted = allStatuses.every(s => getStepState(s.status) === 'completed');

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getOverallProgress = () => {
    if (isAllStepsCompleted) return 100;
    const currentIndex = allStatuses.findIndex(s => s.status === currentStatus);
    if (currentIndex === -1 || allStatuses.length <= 1) {
      return 0; // Or handle single step completion
    }
    return (currentIndex / (allStatuses.length - 1)) * 100;
  };

  const { lastUpdateText, lastUpdateDate } = (() => {
    const relevantHistory = statusHistory.filter(h => {
        const stepState = getStepState(h.status);
        return stepState === 'completed' || stepState === 'current';
    });

    if (relevantHistory.length === 0) return { lastUpdateText: null, lastUpdateDate: null};

    const latestEntry = relevantHistory.reduce((latest, entry) =>
      new Date(entry.timestamp) > new Date(latest.timestamp) ? entry : latest
    );

    const latestStepInAllStatuses = allStatuses.find(s => s.status === latestEntry.status);

    return {
        lastUpdateText: latestStepInAllStatuses ? `Update on: ${latestStepInAllStatuses.statusText}` : "Last updated",
        lastUpdateDate: formatTimestamp(latestEntry.timestamp)
    };
  })();

  const nextPendingStep = allStatuses.find(s => getStepState(s.status) === 'pending');

  if (!isClient || allStatuses.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 md:p-8 text-center text-slate-400">
        {allStatuses.length === 0 ? "No application progress to display." : "Loading progress..."}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInItem} // Apply to the whole container
      className="bg-gradient-to-br from-slate-800 via-slate-800 to-indigo-900/60 rounded-2xl shadow-2xl shadow-indigo-900/30 p-6 md:p-8 text-slate-200 max-w-5xl mx-auto"
      aria-live="polite" // Announce changes
    >
      <div className="mb-8 border border-red-500">
        <motion.h2
          layout
          variants={fadeInItem}
          custom={0.2}
          className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-1"
        >
          {isAllStepsCompleted ? "Application Complete!" : "Application Journey"}
        </motion.h2>
        {lastUpdateText && lastUpdateDate && (
          <motion.p
            variants={fadeInItem}
            custom={0.3}
            className="text-xs text-slate-400"
          >
            {lastUpdateText} – <span className="font-medium text-slate-300">{lastUpdateDate}</span>
          </motion.p>
        )}
      </div>

      <div className="relative">
        {/* Timeline Track - Vertical on mobile, Horizontal on desktop */}
        <div className="md:hidden absolute left-5 top-2.5 bottom-2.5 w-1 bg-slate-700/70 rounded-full transform -translate-x-1/2"></div>
        <div className="hidden md:block absolute left-0 right-0 top-5 h-1 bg-slate-700/70 rounded-full"></div>

        {/* Timeline Progress - Vertical on mobile, Horizontal on desktop */}
        <motion.div
          className="md:hidden absolute left-5 top-2.5 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full transform -translate-x-1/2"
          initial={{ height: 0 }}
          animate={{ height: `${getOverallProgress()}%` }}
          transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
        />
        <motion.div
          className="hidden md:block absolute left-0 top-5 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${getOverallProgress()}%` }}
          transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
        />

        {/* Status items - Stack vertically on mobile, horizontally on desktop */}
        <div className="md:flex md:justify-between md:items-start md:space-x-6 space-y-3 md:space-y-0 md:px-4">
          {allStatuses.map((step, index) => {
            const state = getStepState(step.status);
            const historyEntry = statusHistory.find(h => h.status === step.status);
            const notes = historyEntry?.userNotes;
            const isExpanded = expandedStep === step.status;
            const isClickable = state !== 'pending';

            let nodeStyles = {
              bgColor: 'bg-slate-700',
              borderColor: 'border-slate-600',
              iconColor: 'text-slate-400',
              titleColor: 'text-slate-400',
              numberBadgeColor: 'bg-slate-500 text-white'
            };

            if (state === 'completed') {
              nodeStyles = {
                bgColor: 'bg-emerald-600',
                borderColor: 'border-emerald-500',
                iconColor: 'text-white',
                titleColor: 'text-slate-100',
                numberBadgeColor: 'bg-emerald-700 text-white'
              };
            } else if (state === 'current') {
              nodeStyles = {
                bgColor: 'bg-indigo-500',
                borderColor: 'border-indigo-400',
                iconColor: 'text-white',
                titleColor: 'text-indigo-300 font-semibold',
                numberBadgeColor: 'bg-indigo-600 text-white'
              };
            } else { // Pending
                 nodeStyles = {
                    bgColor: 'bg-slate-800', // Darker bg for pending to make it recede
                    borderColor: 'border-slate-600', // Subtle border
                    iconColor: 'text-slate-500',
                    titleColor: 'text-slate-500',
                    numberBadgeColor: 'bg-slate-600 text-slate-300'
                 };
            }

            return (
              <motion.div
                layout // Animates layout changes smoothly
                key={step.status}
                variants={fadeInItem}
                custom={index + 2} // Stagger delay, after header
                className={`relative md:flex-1 md:flex md:flex-col md:items-center transition-opacity duration-300 status-step
                  ${state === 'pending' && !isExpanded ? 'opacity-70 hover:opacity-100' : 'opacity-100'}
                  ${state === 'current' ? 'bg-slate-700/30 rounded-lg p-3 md:p-4 -ml-3 -mr-3 md:mx-0 md:mt-0 current-step-glow' : 'py-3 md:pt-12 md:pb-3'}
                  pl-12 md:pl-0 group`}
                aria-current={state === 'current' ? "step" : undefined}
              >
                {/* Node - Different positioning for mobile vs desktop */}
                <motion.div
                  layout
                  className={`absolute md:static left-5 top-1/2 md:top-auto md:transform-none -translate-y-1/2 -translate-x-1/2 md:translate-y-0 md:translate-x-0 w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-md transition-all duration-300
                    ${nodeStyles.bgColor} ${nodeStyles.borderColor} md:mb-3
                  `}
                  whileHover={isClickable && !shouldReduceMotion ? { scale: 1.15, transition: { type: 'spring', stiffness: 300 } } : {}}
                  onClick={() => isClickable && setExpandedStep(isExpanded ? null : step.status)}
                  tabIndex={isClickable ? 0 : -1}
                  onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && isClickable && setExpandedStep(isExpanded ? null : step.status)}
                  aria-expanded={isExpanded}
                  aria-controls={`step-content-${step.status}`}
                >
                  {state === 'completed' ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.2 }}>
                      <CheckIcon className="w-5 h-5 text-white" />
                    </motion.div>
                  ) : (
                    getStatusIcon(step.status, `w-5 h-5 ${nodeStyles.iconColor}`, state)
                  )}
                  {/* Step Number Badge */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-slate-800 ${nodeStyles.numberBadgeColor}`}>
                    {step.status}
                  </div>
                  {/* Current step pulse/glow */}
                  {state === 'current' && !shouldReduceMotion && (
                    <motion.div
                      className="absolute inset-[-2px] rounded-full border-2 border-indigo-400/70"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </motion.div>

                {/* Content - Different layout for mobile vs desktop */}
                <motion.div layout className="pl-4 md:pl-0 md:w-full md:text-center">
                  <div
                    className={`flex md:flex-col justify-between md:justify-center items-center ${isClickable ? 'cursor-pointer group-hover:bg-slate-700/50 -mx-2 md:mx-0 px-2 py-1 rounded-md transition-colors' : 'cursor-default'}`}
                    onClick={() => isClickable && setExpandedStep(isExpanded ? null : step.status)}
                    aria-hidden="true" // Redundant with node click, but good for visual grouping
                  >
                    <h3 className={`text-lg ${nodeStyles.titleColor} transition-colors duration-200`}>
                      {step.statusText}
                    </h3>
                    {isClickable && (
                      <ChevronDownIcon
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 md:mt-1 ${isExpanded ? 'transform rotate-180' : ''}`}
                      />
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && isClickable && (
                      <motion.div
                        layout
                        id={`step-content-${step.status}`}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="pr-2 md:pr-0 overflow-hidden md:absolute md:top-full md:left-0 md:right-0 md:mt-2 md:bg-slate-800/90 md:backdrop-blur-sm md:p-4 md:rounded-lg md:shadow-lg md:z-10 md:border md:border-slate-700"
                      >
                        <p className="text-sm text-slate-300 mb-3 leading-relaxed md:text-center">
                          {step.description}
                        </p>
                        {historyEntry?.timestamp && (
                          <div className="flex items-center text-xs text-slate-400 mb-3 md:justify-center">
                            <ClockIcon className="w-4 h-4 mr-2 text-indigo-400 flex-shrink-0" />
                            <span>{state === 'completed' ? 'Completed:' : 'Updated:'} <span className="font-medium text-slate-200">{formatTimestamp(historyEntry.timestamp)}</span></span>
                          </div>
                        )}
                        {notes && (
                          <div className="bg-slate-700/60 p-3 rounded-lg border border-slate-600/80 shadow-inner">
                            <div className="flex items-center text-xs text-indigo-300 mb-1.5 font-medium md:justify-center">
                               <ChatBubbleLeftEllipsisIcon className="w-4 h-4 mr-2 flex-shrink-0"/>
                               A quick note:
                            </div>
                            <p className="text-sm text-slate-300 italic md:text-center">"{notes}"</p>
                          </div>
                        )}
                        {/* "What's Next?" Teaser */}
                        {state === 'current' && nextPendingStep && !isAllStepsCompleted && (
                          <motion.div
                            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{delay:0.3}}
                            className="mt-4 pt-3 border-t border-slate-700"
                          >
                            <div className="flex items-center text-xs text-purple-400 mb-1 font-medium md:justify-center">
                              <SparklesIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                              Next up:
                            </div>
                            <p className="text-sm text-slate-300 font-medium md:text-center">{nextPendingStep.statusText}</p>
                            <p className="text-xs text-slate-400 md:text-center">{nextPendingStep.description}</p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* For pending steps, show description subtly if not expanded */}
                  {!isExpanded && state === 'pending' && (
                     <p className="text-sm text-slate-500 mt-1 leading-relaxed md:text-center">
                       {step.description}
                     </p>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {isAllStepsCompleted && (
         <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="mt-8 text-center bg-emerald-500/20 border border-emerald-500 text-emerald-300 p-4 rounded-lg"
        >
            <CheckBadgeIcon className="w-10 h-10 mx-auto mb-2 text-emerald-400"/>
            <p className="font-semibold text-lg">All steps completed successfully!</p>
            <p className="text-sm">Your application process is finished.</p>
        </motion.div>
      )}
       <style jsx global>{`
        .current-step-glow {
          box-shadow: 0 0 25px -5px rgba(99, 102, 241, 0.2), 0 0 10px -3px rgba(99, 102, 241, 0.1);
        }

        /* Add connector lines between steps on desktop */
        @media (min-width: 768px) {
          .status-step:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 5px;
            right: -50%;
            width: 100%;
            height: 1px;
            background-color: rgba(99, 102, 241, 0.2);
            z-index: 0;
          }
        }
      `}</style>
    </motion.div>
  );
};