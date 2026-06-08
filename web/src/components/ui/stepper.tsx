import React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export interface Step {
  id: string | number
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  className?: string
  onStepClick?: (stepIndex: number) => void
}

export function Stepper({ steps, currentStep, className, onStepClick }: StepperProps) {
  return (
    <div className={cn("flex flex-row items-center w-full", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <React.Fragment key={step.id}>
            {/* Step Item */}
            <div className="flex flex-col items-center relative z-10 group" 
                 onClick={() => onStepClick?.(index)}
                 style={{ cursor: onStepClick ? 'pointer' : 'default' }}>
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200",
                  isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isCurrent
                    ? "bg-white border-blue-600 text-blue-600"
                    : "bg-white border-slate-300 text-slate-500",
                  onStepClick && "group-hover:border-blue-400 group-hover:text-blue-500"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <span className="font-semibold">{index + 1}</span>}
              </div>
              <div className="absolute top-12 flex flex-col items-center w-max">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrent || isCompleted ? "text-slate-900" : "text-slate-500"
                  )}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-xs text-slate-500">{step.description}</span>
                )}
              </div>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-[2px] mt-[-20px]">
                <div
                  className={cn(
                    "h-full transition-colors duration-200",
                    index < currentStep ? "bg-blue-600" : "bg-slate-200"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
