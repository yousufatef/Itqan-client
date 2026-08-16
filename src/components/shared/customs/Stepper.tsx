import React from 'react';
import { cn } from '@/lib/utils';

interface StepObject {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface StepperProps {
  steps: StepObject[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  /**
   * If true, allows clicking on the step indicators to jump between steps.
   * Default is false to enforce sequential navigation.
   */
  allowStepClick?: boolean;
  indicatorsClassName?: string;
  contentClassName?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepChange,
  allowStepClick = false,
  indicatorsClassName,
  contentClassName,
}: StepperProps) {
  const goToStep = (step: number) => {
    if (allowStepClick && onStepChange) {
      onStepChange(step);
    }
  };

  return (
    <div className='w-full bg-white'>
      {/* Step Indicators */}
      <div className={cn('px-8 pt-8 pb-12', indicatorsClassName)}>
        {/* Icons and Titles Row */}
        <div className='mb-4 flex items-center justify-between'>
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={index}
                className='flex flex-1 flex-col items-center'
              >
                {/* Icon */}
                <div className='mb-2'>
                  <StepIcon
                    className={`h-6 w-6 transition-colors duration-500 ${
                      isCompleted || isCurrent ? 'text-primary' : 'text-neutral-300'
                    }`}
                  />
                </div>

                {/* Step Title */}
                <p
                  className={`text-center text-xs font-medium transition-colors duration-500 ${
                    isCompleted || isCurrent ? 'text-primary' : 'text-neutral-300'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Progress Line and Dots */}
        <div className='relative flex items-center justify-between'>
          {/* Background line */}
          <div
            className='absolute top-1/2 h-px -translate-y-1/2 rounded-full bg-neutral-300'
            style={{
              left: 'calc(50% / ' + steps.length + ')',
              right: 'calc(50% / ' + steps.length + ')',
            }}
          ></div>

          {/* Filled progress line */}
          <div
            className='bg-primary absolute top-1/2 h-px -translate-y-1/2 rounded-full transition-all duration-500'
            style={{
              left: 'calc(50% / ' + steps.length + ')',
              width:
                currentStep === 0
                  ? 0
                  : `calc((${currentStep} / ${steps.length - 1}) * (100% - 100% / ${steps.length}))`,
            }}
          ></div>

          {/* Step Dots */}
          {steps.map((_, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <button
                key={index}
                type='button'
                onClick={() => goToStep(index)}
                disabled={!allowStepClick}
                className={`relative z-10 h-4 w-4 rounded-full border-2 transition-colors duration-500 ${
                  allowStepClick ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isCompleted || isCurrent
                    ? 'border-primary bg-primary'
                    : 'border-neutral-300 bg-white'
                }`}
                style={{
                  margin: '0 auto',
                }}
              ></button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className={cn('min-h-96 px-8 pb-8', contentClassName)}>
        <div className='animate-fadeIn pt-8'>{steps[currentStep]?.content}</div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
