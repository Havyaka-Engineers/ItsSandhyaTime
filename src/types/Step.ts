export type StepType = 'instruction' | 'chantOnly' | 'chantAndPerform' | 'performOnly';

export type LoopType = 'gayatri' | 'ashtakshari' | 'panchakshari' | 'pranayama';

export interface Step {
  startTime: number;
  stepType: StepType;
  isLoopStart: boolean;
  isLoopEnd: boolean;
  loopName?: LoopType; // Only present if this step is part of a loop
}
