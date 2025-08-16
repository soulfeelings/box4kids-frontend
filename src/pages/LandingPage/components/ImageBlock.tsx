import { useLandingBreakpoints } from "@/hooks/useBreakpoints";
import { useTranslation } from "react-i18next";

export const ImageBlock = () => {
  const { t } = useTranslation();
  const { isDesktop, isMobile, isTablet } = useLandingBreakpoints();

  return (
    <div className="w-full flex gap-2">
      {isMobile && (
        <img
          src="/illustrations/family.svg"
          alt={t("family_with_children")}
          className="object-cover w-full h-auto"
          style={{ height: 250 }}
        />
      )}
      {isTablet && (
        <img
          src="/illustrations/family.svg"
          alt={t("family_with_children")}
          className="object-cover w-full h-auto"
        />
      )}
      {isDesktop && (
        <img
          src="/illustrations/family.svg"
          alt={t("family_with_children")}
          className="object-cover w-full h-auto"
        />
      )}
    </div>
  );
};
