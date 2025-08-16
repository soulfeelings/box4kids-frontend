interface HowItWorksStepProps {
  step: {
    id: number;
    text: string;
  };
}

export const HowItWorksStep = ({ step }: HowItWorksStepProps) => {
  return (
    <div className="flex gap-4 items-center md:flex-col md:items-center md:min-w-[144px]">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-[12px] bg-[#F2F2F2] flex flex-shrink-0 items-center justify-center">
        <span className="text-[40px] md:text-[48px] text-[#747EEC] font-bold">
          {step.id}
        </span>
      </div>
      <div className="pt-1 text-[18px] md:text-[20px] md:text-center">
        {step.text}
      </div>
    </div>
  );
};
