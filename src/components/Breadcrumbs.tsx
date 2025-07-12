import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { scenarioConfigs } from '../hooks/useScenarioNavigation';

interface BreadcrumbsProps {
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = '' }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbName = (segment: string, index: number) => {
    if (index === 0) {
      switch (segment) {
        case 'demo':
          return 'Демо';
        case 'login':
          return 'Логин';
        default:
          return segment;
      }
    }
    
    if (index === 1 && pathSegments[0] === 'demo') {
      const config = scenarioConfigs[segment as keyof typeof scenarioConfigs];
      return config ? config.title : segment;
    }
    
    return segment;
  };

  const getBreadcrumbPath = (index: number) => {
    return '/' + pathSegments.slice(0, index + 1).join('/');
  };

  if (pathSegments.length === 0) {
    return (
      <div className={`flex items-center text-sm text-gray-600 ${className}`}>
        <span>🏠 Главная</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center text-sm text-gray-600 ${className}`}>
      <Link 
        to="/" 
        className="hover:text-gray-900 transition-colors"
      >
        🏠 Главная
      </Link>
      
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <span className="mx-2">/</span>
          {index === pathSegments.length - 1 ? (
            <span className="text-gray-900 font-medium">
              {getBreadcrumbName(segment, index)}
            </span>
          ) : (
            <Link 
              to={getBreadcrumbPath(index)}
              className="hover:text-gray-900 transition-colors"
            >
              {getBreadcrumbName(segment, index)}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}; 