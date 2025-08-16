import { useTranslation } from "react-i18next";
import { HowItWorksStep } from "./HowItWorksStep";

export const HowItWorksSection = () => {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      text: t("landing.choose_age_interests_development_goals"),
    },
    {
      id: 2,
      text: t("landing.we_collect_personal_toy_set"),
    },
    {
      id: 3,
      text: t("landing.courier_delivers_the_box_to_your_home"),
    },
    {
      id: 4,
      text: t("landing.new_set_after_2_weeks"),
    },
  ];

  return (
    // <div className="px-4 md:px-8 lg:px-12 mt-10 max-w-7xl mx-auto">
    <div className="w-full mx-full bg-white px-10 py-10 pb-16 max-md:px-4">
      <h2 className="text-center font-bold text-[26px] md:text-[32px] lg:text-[36px] mb-8 md:mb-12">
        {t("landing.how_it_works")}
      </h2>
      <div className="flex flex-col justify-between gap-6 md:gap-8 md:flex-row lg:gap-8">
        {steps.map((step) => (
          <HowItWorksStep key={step.id} step={step} />
        ))}
      </div>
    </div>
    // </div>
  );
};
