import React from 'react';
import { useIncident } from '../../context/IncidentContext';
import { SelectWhatHappened } from './SelectWhatHappened';
import { DescribeProblem } from './DescribeProblem';
import { TransactionDetails } from './TransactionDetails';
import { EvidenceUpload } from './EvidenceUpload';
import { ReviewSubmission } from './ReviewSubmission';
import { SubmissionSuccess } from './SubmissionSuccess';
import { Check } from 'lucide-react';

export const AssessmentWizard: React.FC = () => {
  const { intakeStep, setIntakeStep } = useIncident();

  const stepLabels = [
    { number: 1, label: 'Incident Category' },
    { number: 2, label: 'Describe What Happened' },
    { number: 3, label: 'Payment Evidence & Extraction' },
    { number: 4, label: 'Additional Evidence & Complainant' },
    { number: 5, label: 'Review & Submit' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Top Progress Step Bar (Hidden on Success Step 6) */}
      {intakeStep <= 5 && (
        <div className="mb-8 p-4 rounded-card bg-surface border border-surface-border shadow-subtle">
          <div className="flex items-center justify-between overflow-x-auto pb-1 gap-2">
            {stepLabels.map((step) => {
              const isCompleted = intakeStep > step.number;
              const isCurrent = intakeStep === step.number;

              return (
                <button
                  key={step.number}
                  onClick={() => {
                    // Only allow jumping back or to current step
                    if (step.number < intakeStep) {
                      setIntakeStep(step.number);
                    }
                  }}
                  disabled={step.number > intakeStep}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all shrink-0 font-medium ${
                    isCurrent
                      ? 'bg-brand-soft text-brand-primary border border-brand-primary/30 font-bold shadow-subtle'
                      : isCompleted
                      ? 'text-text-primary hover:bg-surface-subtle cursor-pointer'
                      : 'text-text-muted opacity-60 cursor-not-allowed'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${step.number}: ${step.label}`}
                >
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-brand-primary text-white'
                        : isCompleted
                        ? 'bg-brand-green-soft text-brand-green border border-brand-green/30'
                        : 'bg-surface-subtle text-text-muted border border-surface-border'
                    }`}
                  >
                    {isCompleted ? <Check size={11} /> : step.number}
                  </div>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic View */}
      <div className="animate-in fade-in duration-150">
        {intakeStep === 1 && <SelectWhatHappened />}
        {intakeStep === 2 && <DescribeProblem />}
        {intakeStep === 3 && <TransactionDetails />}
        {intakeStep === 4 && <EvidenceUpload />}
        {intakeStep === 5 && <ReviewSubmission />}
        {intakeStep === 6 && <SubmissionSuccess />}
      </div>
    </div>
  );
};
