import { useRef, useCallback, useEffect } from "react";

interface UseFocusManagementOptions {
  autoBlurDelay?: number;
}

export const useFocusManagement = ({ autoBlurDelay = 1500 }: UseFocusManagementOptions = {}) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFocus = useCallback(() => {
    // При фокусе сбрасываем предыдущий таймер и запускаем новый
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    blurTimeoutRef.current = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
      blurTimeoutRef.current = null;
    }, autoBlurDelay);
  }, [autoBlurDelay]);

  const handleBlur = useCallback(() => {
    // Очищаем таймер при ручном снятии фокуса
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  }, []);

  const handleChange = useCallback(() => {
    // При изменении значения устанавливаем таймер для автоматического снятия фокуса
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    
    blurTimeoutRef.current = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
      blurTimeoutRef.current = null;
    }, autoBlurDelay);
  }, [autoBlurDelay]);

  // Очищаем таймер при размонтировании компонента
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return {
    inputRef,
    handleFocus,
    handleBlur,
    handleChange,
  };
}; 