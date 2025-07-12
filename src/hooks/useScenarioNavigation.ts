import { useNavigate, useParams } from 'react-router-dom';

// Scenario configurations
export const scenarioConfigs = {
  notSubscribed: {
    title: "Не подписан",
    description: "Пользователь не оформил подписку",
    color: "red",
    emoji: ""
  },
  justSubscribed: {
    title: "Только подписался",
    description: "Первые 2 часа после подписки",
    color: "green",
    emoji: ""
  },
  nextSetNotDetermined: {
    title: "Набор не определен",
    description: "Состав следующего набора еще не определен",
    color: "yellow",
    emoji: ""
  },
  nextSetDetermined: {
    title: "Набор определен",
    description: "Обычное состояние - состав следующего набора определен",
    color: "blue",
    emoji: ""
  },
  multipleChildren: {
    title: "Несколько детей",
    description: "Семья с тремя детьми и их особенностями",
    color: "purple",
    emoji: ""
  }
};

export type ScenarioKey = keyof typeof scenarioConfigs;

export function useScenarioNavigation() {
  const navigate = useNavigate();
  const { scenario } = useParams<{ scenario: string }>();

  const currentScenario = scenario as ScenarioKey;
  const scenarios = Object.keys(scenarioConfigs) as ScenarioKey[];

  const getCurrentIndex = () => {
    return scenarios.indexOf(currentScenario || 'nextSetDetermined');
  };

  const getNextScenario = (): ScenarioKey => {
    const currentIndex = getCurrentIndex();
    return scenarios[(currentIndex + 1) % scenarios.length];
  };

  const getPrevScenario = (): ScenarioKey => {
    const currentIndex = getCurrentIndex();
    return scenarios[(currentIndex - 1 + scenarios.length) % scenarios.length];
  };

  const getCurrentConfig = () => {
    return scenarioConfigs[currentScenario] || scenarioConfigs.nextSetDetermined;
  };

  const navigateToScenario = (scenarioKey: ScenarioKey) => {
    navigate(`/demo/${scenarioKey}`);
  };

  const navigateToNext = () => {
    navigateToScenario(getNextScenario());
  };

  const navigateToPrev = () => {
    navigateToScenario(getPrevScenario());
  };

  const navigateToDemo = () => {
    navigate('/');
  };

  const copyCurrentLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // Можно заменить на toast notification
    alert('Ссылка скопирована в буфер обмена!');
  };

  return {
    currentScenario,
    scenarios,
    scenarioConfigs,
    getCurrentConfig,
    navigateToScenario,
    navigateToNext,
    navigateToPrev,
    navigateToDemo,
    copyCurrentLink,
    getNextScenario,
    getPrevScenario
  };
} 