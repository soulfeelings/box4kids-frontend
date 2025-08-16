import { useTranslation } from "react-i18next";
import { FAQItem } from "./FAQItem";

export const FAQSection = () => {
  const { t } = useTranslation();

  const faqItems = [
    {
      id: 0,
      question: t("landing.how_subscription_to_toys_works"),
      answer: t("landing.subscription_works_on_regular_delivery_principle"),
    },
    {
      id: 1,
      question: t("landing.what_is_included_in_the_set_and_how_is_it_selected"),
      answer: t(
        "landing.toys_are_selected_individually_based_on_age_interests_and_development_stage_of_the_child"
      ),
    },
    {
      id: 2,
      question: t("landing.what_if_toy_didnt_like_or_broke"),
      answer: t(
        "landing.if_toy_didnt_like_or_broke_just_inform_us_about_it_we_will_replace_it_in_the_next_box_or_offer_an_alternative"
      ),
    },
    {
      id: 3,
      question: t("landing.can_i_buy_the_toy_i_liked"),
      answer: t("landing.yes_of_course"),
    },
  ];

  return (
    <div
      className="px-4 md:px-8 lg:px-12 py-12"
      style={{ backgroundColor: "#F2F2F2" }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center font-bold text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-8 md:mb-12">
          {t("landing.faq_title")}
        </h2>

        <div className="bg-white rounded-2xl shadow-sm">
          {faqItems.map((item, index) => (
            <FAQItem
              key={item.id}
              item={item}
              isLast={index === faqItems.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
