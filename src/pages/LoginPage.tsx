import React, { useState, useEffect } from "react";

// Step enums for clarity
enum Step {
  Phone = 0,
  Code = 1,
  Welcome = 2,
  Register = 3,
  Child = 4,
  Categories = 5,
  Subscription = 6,
  Delivery = 7,
  Payment = 8,
  Success = 9,
}

export const LoginPage: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.Phone);

  // Helper function to calculate age from birth date
  const calculateAge = (birthDate: string): string => {
    const birth = parseDateFromFormat(birthDate);
    if (!birth) return '';
    
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const years = Math.floor(months / 12);
    
    if (years > 0) {
      const remainingMonths = months % 12;
      return remainingMonths > 0 ? `${years} г. ${remainingMonths} мес.` : `${years} г.`;
    } else {
      return `${months} мес.`;
    }
  };

  // Helper functions for date formatting
  const formatDateForDelivery = (date: string): string => {
    // Convert from DD/MM to display format
    return date;
  };

  const formatDateForBirth = (date: string): string => {
    // Convert from DD/MM/YYYY to display format
    return date;
  };

  const parseDateFromFormat = (dateString: string): Date | null => {
    if (!dateString) return null;
    
    // Handle DD/MM/YYYY format
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
    
    // Handle YYYY-MM-DD format (fallback for existing data)
    if (dateString.includes('-')) {
      return new Date(dateString);
    }
    
    return null;
  };

  const formatDateInput = (value: string, isFullDate: boolean = true): string => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    if (isFullDate) {
      // Format as DD/MM/YYYY
      if (digits.length <= 2) {
        return digits;
      } else if (digits.length <= 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
      }
    } else {
      // Format as DD/MM
      if (digits.length <= 2) {
        return digits;
      } else {
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
      }
    }
  };

  // Tag component for interests and skills
  const Tag: React.FC<{ children: React.ReactNode; selected?: boolean }> = ({ children, selected = false }) => (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
      selected 
        ? 'bg-orange-100 text-orange-800' 
        : 'bg-gray-100 text-gray-700'
    }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
      {children}
    </span>
  );

  // Get plan items based on subscription type
  const getPlanItems = (subscription: "base" | "premium" | "") => {
    if (subscription === 'premium') {
      return [
        { icon: '🔧', count: 3, name: 'Конструктор', color: 'bg-blue-100' },
        { icon: '🎨', count: 2, name: 'Творческий набор', color: 'bg-green-100' },
        { icon: '🧸', count: 2, name: 'Мягкая игрушка', color: 'bg-orange-100' },
        { icon: '🧩', count: 1, name: 'Головоломка', color: 'bg-pink-100' },
        { icon: '💎', count: 1, name: 'Премиум-игрушка', color: 'bg-purple-100' }
      ];
    }
    return [
      { icon: '🔧', count: 2, name: 'Конструктор', color: 'bg-blue-100' },
      { icon: '🎨', count: 2, name: 'Творческий набор', color: 'bg-green-100' },
      { icon: '🧸', count: 1, name: 'Мягкая игрушка', color: 'bg-orange-100' },
      { icon: '🧩', count: 1, name: 'Головоломка', color: 'bg-pink-100' }
    ];
  };

  // Interest icons mapping
  const interestIcons: Record<string, string> = {
    'Конструкторы': '🔧',
    'Творчество': '🎨',
    'Музыка': '🎵',
    'Спорт': '⚽',
    'Книги': '📚',
    'Логика': '🧠'
  };

  // Skills icons mapping
  const skillIcons: Record<string, string> = {
    'Логическое мышление': '🧠',
    'Креативность': '🎨',
    'Моторика': '✋',
    'Воображение': '✨',
    'Внимание': '👁️',
    'Социальные навыки': '👥'
  };

  // Calculate price for child based on position
  const calculateChildPrice = (subscription: "base" | "premium" | "", childIndex: number) => {
    const basePrice = subscription === 'premium' ? 60 : 35;
    const isFirstChild = childIndex === 0;
    return isFirstChild ? basePrice : Math.round(basePrice * 0.8); // 20% discount for non-first children
  };
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false); // Mock: true if phone ends with odd digit
  const [resendTimer, setResendTimer] = useState(0);
  const [welcomeIndex, setWelcomeIndex] = useState(0); // 0, 1, 2
  
  // Child data states
  const [childName, setChildName] = useState("");
  const [childBirthDate, setChildBirthDate] = useState("");
  const [childGender, setChildGender] = useState<"male" | "female" | "">("");
  const [childLimitations, setChildLimitations] = useState<"none" | "has_limitations" | "">("");
  const [childComment, setChildComment] = useState("");
  
  // Categories data states
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // Subscription data states  
  const [selectedSubscription, setSelectedSubscription] = useState<"base" | "premium" | "">("");
  
  // Delivery data states
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryComments, setDeliveryComments] = useState("");
  
  // Children management
  const [children, setChildren] = useState<Array<{
    id: string;
    name: string;
    birthDate: string;
    gender: "male" | "female";
    limitations: "none" | "has_limitations";
    comment: string;
    interests: string[];
    skills: string[];
    subscription: "base" | "premium" | "";
  }>>([]);

  // Edit mode states
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<'data' | 'subscription' | null>(null);

  // Birth date validation helper
  const validateBirthDate = (dateString: string) => {
    if (!dateString) return { isValid: false, error: "Введите дату рождения" };
    
    // Check if format is correct DD/MM/YYYY
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(datePattern);
    
    if (!match) {
      return { isValid: false, error: "Формат: ДД/ММ/ГГГГ" };
    }
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Validate day, month ranges
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return { isValid: false, error: "Некорректная дата" };
    }
    
    const birthDate = parseDateFromFormat(dateString);
    if (!birthDate || isNaN(birthDate.getTime())) {
      return { isValid: false, error: "Введите корректную дату" };
    }
    
    const today = new Date();
    const sixMonthsAgo = new Date();
    const eighteenYearsAgo = new Date();
    
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
    
    if (birthDate > today) {
      return { isValid: false, error: "Дата рождения не может быть в будущем" };
    }
    
    if (birthDate < eighteenYearsAgo) {
      return { isValid: false, error: "Ребенок не может быть старше 18 лет" };
    }
    
    if (birthDate > sixMonthsAgo) {
      return { isValid: false, error: "Ребенок должен быть старше 6 месяцев" };
    }
    
    return { isValid: true, error: "" };
  };

  // Сброс таймера при переходе на шаг кода
  useEffect(() => {
    if (step === Step.Code) {
      setResendTimer(60);
    }
  }, [step]);

  // Тикание таймера
  useEffect(() => {
    if (step === Step.Code && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, resendTimer]);

  // Mocked send code
  const handleSendCode = () => {
    setError(null);
    if (phone.length < 7) {
      setError("Введите корректный номер телефона");
      return;
    }
    // Mock: odd last digit = new user
    setIsNewUser(Number(phone[phone.length - 1]) % 2 === 1);
    setStep(Step.Code);
  };

  // Mocked code check
  const handleCheckCode = () => {
    setError(null);
    if (code.length !== 4) {
      setError("Введите 4-значный код");
      return;
    }
    if (code !== "1234") {
      setError("Неверный код");
      return;
    }
    if (isNewUser) {
      setWelcomeIndex(0);
      setStep(Step.Welcome);
    } else {
      setStep(Step.Success);
    }
  };

  // Handle resend code
  const handleResendCode = () => {
    setError(null);
    setCode("");
    setResendTimer(60);
  };

  // Auto-verify code when it's 4 digits
  React.useEffect(() => {
    if (code.length === 4 && code === "1234") {
      handleCheckCode();
    }
  }, [code]);

  // Mocked registration
  const handleRegister = () => {
    setError(null);
    if (!name.trim()) {
      setError("Введите имя");
      return;
    }
    setStep(Step.Child);
  };

  // Handle child data submission
  const handleChildSubmit = () => {
    setError(null);
    if (!childName.trim()) {
      setError("Введите имя ребенка");
      return;
    }
    
    const birthDateValidation = validateBirthDate(childBirthDate);
    if (!birthDateValidation.isValid) {
      setError(birthDateValidation.error);
      return;
    }
    
    if (!childGender) {
      setError("Выберите пол ребенка");
      return;
    }
    if (!childLimitations) {
      setError("Выберите особенности ребенка");
      return;
    }
    if (childLimitations === "has_limitations" && !childComment.trim()) {
      setError("Напишите ограничения ребенка");
      return;
    }

    // If editing, go to categories to edit interests and skills
    if (editingChildId && editMode === 'data') {
      setStep(Step.Categories);
      return;
    }

    setStep(Step.Categories);
  };

  // Handle categories submission
  const handleCategoriesSubmit = () => {
    setError(null);
    if (selectedInterests.length === 0) {
      setError("Выберите хотя бы один интерес");
      return;
    }
    if (selectedSkills.length === 0) {
      setError("Выберите хотя бы один навык для развития");
      return;
    }
    
    // If editing, update existing child and return to subscription view
    if (editingChildId && editMode === 'data') {
      setChildren(prev => prev.map(child => 
        child.id === editingChildId 
          ? {
              ...child,
              name: childName,
              birthDate: childBirthDate,
              gender: childGender as "male" | "female",
              limitations: childLimitations as "none" | "has_limitations",
              comment: childComment,
              interests: selectedInterests,
              skills: selectedSkills
            }
          : child
      ));
      
      // Reset edit mode and return to subscription view
      setEditingChildId(null);
      setEditMode(null);
      setStep(Step.Subscription);
      return;
    }
    
    // Save current child data (for new child)
    const currentChild = {
      id: Date.now().toString(),
      name: childName,
      birthDate: childBirthDate,
      gender: childGender as "male" | "female",
      limitations: childLimitations as "none" | "has_limitations",
      comment: childComment,
      interests: selectedInterests,
      skills: selectedSkills,
      subscription: "" as "base" | "premium" | ""
    };
    
    setChildren(prev => [...prev, currentChild]);
    setStep(Step.Subscription);
  };

  // Handle subscription submission
  const handleSubscriptionSubmit = () => {
    setError(null);
    if (!selectedSubscription) {
      setError("Выберите тариф");
      return;
    }
    
    // If editing subscription, update specific child
    if (editingChildId && editMode === 'subscription') {
      setChildren(prev => prev.map(child => 
        child.id === editingChildId 
          ? { ...child, subscription: selectedSubscription }
          : child
      ));
      
      // Reset edit mode and stay on subscription view
      setEditingChildId(null);
      setEditMode(null);
      return;
    }
    
    // Update current child with subscription (for new child creation)
    setChildren(prev => {
      const lastChild = prev[prev.length - 1];
      return prev.map(child => 
        child.id === lastChild?.id 
          ? { ...child, subscription: selectedSubscription }
          : child
      );
    });
    
    setStep(Step.Delivery);
  };

  // Handle delivery submission
  const handleDeliverySubmit = () => {
    setError(null);
    if (!deliveryAddress.trim()) {
      setError("Введите адрес доставки");
      return;
    }
    if (!deliveryDate) {
      setError("Выберите дату доставки");
      return;
    }
    if (!deliveryTime) {
      setError("Выберите время доставки");
      return;
    }
    
    setStep(Step.Payment);
  };

  // Handle payment submission
  const handlePaymentSubmit = () => {
    setError(null);
    setStep(Step.Success);
  };

  // Handle adding another child
  const handleAddChild = () => {
    // Reset form for new child
    setChildName("");
    setChildBirthDate("");
    setChildGender("");
    setChildLimitations("");
    setChildComment("");
    setSelectedInterests([]);
    setSelectedSkills([]);
    setSelectedSubscription("");
    setEditingChildId(null);
    setEditMode(null);
    setStep(Step.Child);
  };

  // Handle editing child data
  const handleEditChildData = (childId: string) => {
    const child = children.find(c => c.id === childId);
    if (child) {
      // Pre-fill form with child data
      setChildName(child.name);
      setChildBirthDate(child.birthDate);
      setChildGender(child.gender);
      setChildLimitations(child.limitations);
      setChildComment(child.comment);
      setSelectedInterests(child.interests);
      setSelectedSkills(child.skills);
      setSelectedSubscription(child.subscription);
      
      // Set edit mode
      setEditingChildId(childId);
      setEditMode('data');
      setStep(Step.Child);
    }
  };

  // Handle editing child subscription
  const handleEditChildSubscription = (childId: string) => {
    const child = children.find(c => c.id === childId);
    if (child) {
      // Set current subscription selection
      setSelectedSubscription(child.subscription);
      
      // Set edit mode
      setEditingChildId(childId);
      setEditMode('subscription');
      setStep(Step.Subscription);
    }
  };

  // Step navigation
  const handleBack = () => {
    setError(null);
    
    // If in edit mode, return to subscription view and reset edit mode
    if (editingChildId && (editMode === 'data' || editMode === 'subscription')) {
      setEditingChildId(null);
      setEditMode(null);
      setStep(Step.Subscription);
      return;
    }
    
    if (step === Step.Code) setStep(Step.Phone);
    else if (step === Step.Register) setStep(Step.Code);
    else if (step === Step.Child) setStep(Step.Register);
    else if (step === Step.Categories) setStep(Step.Child);
    else if (step === Step.Subscription) setStep(Step.Categories);
    else if (step === Step.Delivery) setStep(Step.Subscription);
    else if (step === Step.Payment) setStep(Step.Delivery);
    else if (step === Step.Success) setStep(Step.Phone);
  };

  const welcomeScreens = [
    {
      img: "/illustrations/welcome1.png",
      title: "Игрушки, которые радуют!",
      desc: "Настройте персональную коробку с игрушками для вашего ребенка.",
    },
    {
      img: "/illustrations/welcome2.png",
      title: "Чисто и безопасно!",
      desc: "Каждая игрушка проходит полную дезинфекцию перед доставкой. Всё безопасно даже для малышей.",
    },
    {
      img: "/illustrations/welcome3.png",
      title: "Всё просто и без стресса!",
      desc: "Новый набор — каждые 2 недели. Любимые игрушки можно оставить.",
    },
  ];

  // UI for each step
  const renderStep = () => {
    switch (step) {
      case Step.Phone:
        const isPhoneValid = phone.length >= 10;
        return (
          <div className="flex flex-col gap-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {/* Title and Description */}
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-xl font-medium text-gray-900">
                Войдите или зарегистрируйтесь
              </h1>
              <p className="text-base font-medium text-gray-600">
                Введите номер телефона и мы отправим код подтверждения
              </p>
            </div>
            
            {/* Spacer */}
            <div className="h-4"></div>
            
            {/* Phone Input */}
            <div className="flex flex-col gap-1">
              <div className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                phone ? 'border-indigo-400' : 'border-gray-200 focus-within:border-indigo-400'
              }`}>
            <input
                  type="tel"
                  className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
                  placeholder="+998"
              value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
                  maxLength={17}
              inputMode="tel"
                  autoFocus
                  style={{ fontFamily: 'Nunito, sans-serif' }}
            />
              </div>
            </div>
            
            {/* Send Code Button */}
            <button
              onClick={handleSendCode}
              disabled={!isPhoneValid}
              className={`w-full py-4 rounded-full font-medium text-base transition-all ${
                isPhoneValid
                  ? "bg-indigo-400 text-white hover:bg-indigo-500" 
                  : "bg-gray-200 text-gray-500"
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Получить код
            </button>
            
            {/* Spacer */}
            <div className="h-8"></div>
            
            {/* Legal Text */}
            <p className="text-sm font-medium text-gray-500 text-center leading-relaxed">
              Нажимая кнопку «Получить код», вы принимаете условия Политики конфиденциальности и Пользовательского соглашения.
            </p>
          </div>
        );
      case Step.Code:
        const isCodeValid = code.length === 4;
        return (
          <div className="flex flex-col gap-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {/* Title and Description */}
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-xl font-medium text-gray-900">
                Подтвердите номер
              </h1>
              <p className="text-base font-medium text-gray-500">
                Мы отправили код подтверждения на номер {phone}
              </p>
              <button 
                onClick={handleBack}
                className="text-base font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Изменить номер
            </button>
            </div>
            
            {/* Spacer */}
            <div className="h-4"></div>
            
            {/* Code Input */}
            <div className="flex flex-col gap-1">
              <div className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                error 
                  ? 'border-red-400' 
                  : code ? 'border-indigo-400' : 'border-gray-200 focus-within:border-indigo-400'
              }`}>
            <input
                  type="text"
                  className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 text-center tracking-widest"
                  placeholder="••••"
              value={code}
                  onChange={(e) => {
                    setError(null);
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
                  }}
              maxLength={4}
              inputMode="numeric"
                  autoFocus
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm font-medium px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {error}
                </p>
              )}
            </div>
            
            {/* Verify Button / Resend Timer */}
            <button
              onClick={resendTimer > 0 ? undefined : handleResendCode}
              disabled={resendTimer > 0}
              className={`w-full py-4 rounded-full font-medium text-base transition-all ${
                resendTimer > 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-400 text-white hover:bg-indigo-500"
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {resendTimer > 0 
                ? `Получить новый код через ${resendTimer} ${resendTimer === 1 ? 'секунду' : resendTimer < 5 ? 'секунды' : 'секунд'}`
                : "Отправить код повторно"
              }
            </button>
          </div>
        );
      case Step.Welcome:
        const w = welcomeScreens[welcomeIndex];
        return (
          <div className="fixed inset-0 w-full h-full flex flex-col" style={{
            background: 'linear-gradient(180deg, #747EEC 0%, #9098F0 100%)'
          }}>
            {/* Header with company name and close button */}
            <div className="flex justify-center items-center px-4 py-4 relative">
              <h1 className="text-white font-semibold text-base" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                BOX4BABY
              </h1>
              <button
                onClick={() => setStep(Step.Phone)}
                className="absolute right-4 w-6 h-6 rounded-lg bg-white flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
                style={{ color: '#6667C4' }}
              >
                ×
              </button>
            </div>
            
            {/* Illustration area */}
            <div className="flex-1 flex items-center justify-center px-6">
              <img src={w.img} alt="welcome" className="w-full max-w-xs" />
            </div>
            
            {/* Bottom container with text and button */}
            <div className="bg-[#747EEC] px-4 py-6">
              <h2 className="font-bold text-2xl mb-4 text-white text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {w.title}
              </h2>
              <p className="text-base text-white/90 text-center mb-6 max-w-sm mx-auto" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {w.desc}
              </p>
              
              <div className="px-4">
                <button
                  onClick={() => {
                    if (welcomeIndex < welcomeScreens.length - 1) {
                      setWelcomeIndex(welcomeIndex + 1);
                    } else {
                      setStep(Step.Register);
                    }
                  }}
                  className="w-full bg-white text-[#747EEC] py-4 rounded-[32px] font-semibold text-base"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  {welcomeIndex < welcomeScreens.length - 1 ? 'Далее' : 'Начать'}
                </button>
              </div>
            </div>
          </div>
        );
      case Step.Register:
        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16">
              <button 
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
              <span className="text-gray-700 font-semibold text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Шаг 1/8
              </span>
              
              <button 
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-4">
              {/* Title */}
              <div className="text-center mt-4 mb-6">
                <h1 className="text-xl font-medium text-gray-900 mb-0" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Давайте познакомимся!
                </h1>
              </div>

              {/* Input section */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Как к вам обращаться?
                </label>
            <input
                  className="w-full rounded-2xl border-2 border-indigo-400 bg-gray-50 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                  placeholder=""
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={32}
                  autoFocus
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                />
              </div>
              
              <div className="flex-1"></div>
            </div>

            {/* Bottom action button */}
            <div className="px-4 pb-6">
            <button
                className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
                  name.trim() 
                    ? 'bg-indigo-400 text-white shadow-sm' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!name.trim()}
              onClick={handleRegister}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Продолжить
              </button>
            </div>
          </div>
        );
      case Step.Child:
        const birthDateValidation = validateBirthDate(childBirthDate);
        const isFormValid = childName.trim() && birthDateValidation.isValid && childGender && childLimitations && 
                           (childLimitations === "none" || (childLimitations === "has_limitations" && childComment.trim()));

        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16">
              <button 
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
              <span className="text-gray-700 font-semibold text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Шаг 2/8
              </span>
              
              <button 
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
              {/* Title */}
              <div className="text-center mt-4 mb-6">
                <h1 className="text-xl font-medium text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {editingChildId && editMode === 'data' ? 'Редактирование данных ребёнка' : 'Кому собираем набор?'}
                </h1>
              </div>

              <div className="space-y-6">
                {/* Child Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Имя ребенка
                  </label>
                  <input
                    className="w-full rounded-2xl border-2 border-indigo-400 bg-gray-50 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                    placeholder=""
                    value={childName}
                    onChange={e => setChildName(e.target.value)}
                    maxLength={32}
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  />
                </div>

                {/* Birth Date */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Дата рождения
                  </label>
                  <input
                    type="text"
                    placeholder="ДД/ММ/ГГГГ"
                    className={`w-full rounded-2xl border bg-gray-50 px-3 py-3 text-base focus:outline-none transition-all ${
                      childBirthDate && !birthDateValidation.isValid
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400'
                        : childBirthDate && birthDateValidation.isValid
                        ? 'border-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                        : 'border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400'
                    }`}
                    value={childBirthDate}
                    onChange={e => {
                      const formatted = formatDateInput(e.target.value, true);
                      setChildBirthDate(formatted);
                    }}
                    maxLength={10}
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  />
                  {childBirthDate && !birthDateValidation.isValid && (
                    <p className="text-sm text-red-400 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {birthDateValidation.error}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Пол ребенка
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setChildGender("male")}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        childGender === "male"
                          ? 'bg-indigo-400 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      Мальчик
                    </button>
                    <button
                      onClick={() => setChildGender("female")}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        childGender === "female"
                          ? 'bg-indigo-400 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      Девочка
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Особенности
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setChildLimitations("none")}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        childLimitations === "none"
                          ? 'bg-indigo-400 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      Нет
                    </button>
                    <button
                      onClick={() => setChildLimitations("has_limitations")}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        childLimitations === "has_limitations"
                          ? 'bg-indigo-400 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      Есть ограничения
                    </button>
                  </div>
                </div>

                {/* Comment */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Комментарий
                  </label>
                  <textarea
                    className={`w-full rounded-2xl border bg-gray-50 px-3 py-3 text-base focus:outline-none transition-all resize-none ${
                      childLimitations === "has_limitations" && !childComment.trim()
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400'
                        : 'border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400'
                    }`}
                    placeholder={childLimitations === "has_limitations" ? "Опишите ограничения ребенка..." : "Дополнительная информация о ребенке..."}
                    value={childComment}
                    onChange={e => setChildComment(e.target.value)}
                    rows={3}
                    maxLength={200}
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  />
                  {childLimitations === "has_limitations" && !childComment.trim() && (
                    <p className="text-sm text-red-400 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Напишите ограничения ребенка
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
              <button
                className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
                  isFormValid
                    ? 'bg-indigo-400 text-white shadow-sm' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isFormValid}
                onClick={handleChildSubmit}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {editingChildId && editMode === 'data' ? 'Сохранить изменения' : 'Продолжить'}
              </button>
            </div>
          </div>
        );
      case Step.Categories:
        const availableInterests = [
          { emoji: "🧱", label: "Конструкторы" },
          { emoji: "🧸", label: "Плюшевые" },
          { emoji: "🎭", label: "Ролевые" },
          { emoji: "🧠", label: "Развивающие" },
          { emoji: "⚙️", label: "Техника" },
          { emoji: "🎨", label: "Творчество" }
        ];

        const availableSkills = [
          { emoji: "✋", label: "Моторика" },
          { emoji: "🧩", label: "Логика" },
          { emoji: "💭", label: "Воображение" },
          { emoji: "🎨", label: "Творчество" },
          { emoji: "🗣", label: "Речь" }
        ];

        const toggleInterest = (interest: string) => {
          setSelectedInterests(prev => 
            prev.includes(interest) 
              ? prev.filter(i => i !== interest)
              : [...prev, interest]
          );
        };

        const toggleSkill = (skill: string) => {
          setSelectedSkills(prev => 
            prev.includes(skill) 
              ? prev.filter(s => s !== skill)
              : [...prev, skill]
          );
        };

        const isCategoriesFormValid = selectedInterests.length > 0 && selectedSkills.length > 0;

        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16">
              <button 
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
              <span className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Шаг 3/8
              </span>
              
              <button 
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
              {/* Title */}
              <div className="text-center mt-4 mb-6">
                <h1 className="text-xl font-medium text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {editingChildId && editMode === 'data' 
                    ? `Редактирование интересов и навыков` 
                    : 'Что интересно вашему ребёнку?'
                  }
                </h1>
              </div>

              <div className="space-y-8">
                {/* Interests */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Интересы
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {availableInterests.map(interest => (
                      <button
                        key={interest.label}
                        onClick={() => toggleInterest(interest.label)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                          selectedInterests.includes(interest.label)
                            ? 'bg-indigo-400 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                      >
                        <span className="text-base">{interest.emoji}</span>
                        <span>{interest.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Навыки для развития
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {availableSkills.map(skill => (
                      <button
                        key={skill.label}
                        onClick={() => toggleSkill(skill.label)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                          selectedSkills.includes(skill.label)
                            ? 'bg-indigo-400 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                      >
                        <span className="text-base">{skill.emoji}</span>
                        <span>{skill.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
              <button
                className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
                  isCategoriesFormValid
                    ? 'bg-indigo-400 text-white shadow-sm' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isCategoriesFormValid}
                onClick={handleCategoriesSubmit}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {editingChildId && editMode === 'data' ? 'Сохранить изменения' : 'Продолжить'}
              </button>
            </div>
          </div>
        );
      case Step.Subscription:
        const currentChild = children[children.length - 1];
        const hasMultipleChildren = children.length > 1;
        const isSubscriptionValid = selectedSubscription !== "";
        

        return (
          <div className="flex flex-col min-h-screen" style={{ backgroundColor: hasMultipleChildren && !editingChildId ? '#F2F2F2' : 'white' }}>
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16 bg-white">
              <button 
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
              <span className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Шаг 4/8
              </span>
              
              <button 
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
              {/* Title */}
              <div className="text-center mt-4 mb-6">
                <h1 className="text-xl font-medium text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {editingChildId && editMode === 'subscription' 
                    ? `Изменение тарифа для ${children.find(c => c.id === editingChildId)?.name}`
                    : hasMultipleChildren 
                      ? `Какой набор подойдет ${children.map(child => child.name).join(' и ')}?`
                      : `Какой набор подойдёт ${currentChild?.name || 'ребёнку'}?`
                  }
                </h1>
                {hasMultipleChildren && !editingChildId && (
                  <p className="text-sm font-medium text-green-600 mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    🎉 Скидка 20% для второго и последующих детей!
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {/* Info Alert */}
                <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                  <p className="text-sm font-medium text-indigo-700 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Мы подбираем игрушки вручную, с учётом интересов. Хотите поменять состав набора? Просто обновите интересы ребёнка
                  </p>
                </div>

                {(hasMultipleChildren && !editingChildId) ? (
                  // Multiple children view
                  <div className="space-y-6">
                    {children.map((child, index) => {
                      const planItems = getPlanItems(child.subscription);
                      return (
                        <div key={child.id} className="bg-white rounded-xl border border-gray-100 shadow-sm">
                          {/* Header */}
                          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-semibold">
                                {child.gender === 'male' ? '👦' : '👧'}
                              </span>
                            </div>
                            <div>
                              <h1 className="font-semibold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                {child.name}, {calculateAge(child.birthDate)}
                              </h1>
                            </div>
                          </div>

                          <div className="p-6 space-y-6">
                            {/* Интересы */}
                            <div>
                              <h2 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                Интересы
                              </h2>
                              <div className="flex flex-wrap gap-2">
                                {child.interests.map((interest, idx) => (
                                  <Tag key={idx} selected={true}>
                                    <span className="mr-1">{interestIcons[interest] || '🎯'}</span>
                                    {interest}
                                  </Tag>
                                ))}
                              </div>
                            </div>

                            {/* Навыки для развития */}
                            <div>
                              <h2 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                Навыки для развития
                              </h2>
                              <div className="flex flex-wrap gap-2">
                                {child.skills.map((skill, idx) => (
                                  <Tag key={idx} selected={true}>
                                    <span className="mr-1">{skillIcons[skill] || '⭐'}</span>
                                    {skill}
                                  </Tag>
                                ))}
                              </div>
                            </div>

                            {/* Тариф */}
                            <div>
                              <h2 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                Тариф
                              </h2>
                              <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="font-medium text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                    {child.subscription === 'premium' ? 'Премиум' : 'Базовый'}
                                  </span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                    {child.subscription === 'premium' ? '9' : '6'} игрушек
                                  </span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                    ${calculateChildPrice(child.subscription, index)}/мес.
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Состав набора игрушек */}
                            <div>
                              <h3 className="text-gray-600 text-sm mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                Состав набора игрушек
                              </h3>
                              <div className="space-y-3">
                                {planItems.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-lg`}>
                                      {item.icon}
                                    </div>
                                    <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                      x{item.count}
                                    </span>
                                    <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                      {item.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Кнопки действий */}
                            <div className="space-y-3 pt-4">
                              <button 
                                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                                onClick={() => handleEditChildData(child.id)}
                              >
                                Изменить данные ребёнка
                              </button>
                              <button 
                                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                                onClick={() => handleEditChildSubscription(child.id)}
                              >
                                Изменить тариф
                              </button>
                              <button 
                                className="w-full py-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                                onClick={() => {
                                  // TODO: Implement delete child
                                  if (window.confirm(`Удалить данные ребёнка ${child.name}?`)) {
                                    setChildren(prev => prev.filter(c => c.id !== child.id));
                                  }
                                }}
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Single child subscription selection or edit mode
                  <div className="space-y-4">
                    {/* Base Subscription */}
                    <div className={`bg-white rounded-xl p-6 shadow-sm border transition-all cursor-pointer ${
                      selectedSubscription === 'base' 
                        ? 'border-indigo-400 bg-indigo-50' 
                        : 'border-gray-100 hover:border-gray-300'
                    }`} onClick={() => setSelectedSubscription('base')}>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          Базовый
                        </h3>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          6 игрушек
                        </span>
                        <span className="text-gray-500">•</span>
                        <div className="text-right">
                          <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                            ${calculateChildPrice('base', children.length)}/мес.
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-gray-600 text-sm mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          Состав набора игрушек
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                              🔧
                            </div>
                            <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              x2
                            </span>
                            <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              Конструктор
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
                              🎨
                            </div>
                            <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              x2
                            </span>
                            <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              Творческий набор
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg">
                              🧸
                            </div>
                            <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              x1
                            </span>
                            <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              Мягкая игрушка
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg">
                              🧩
                            </div>
                            <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              x1
                            </span>
                            <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              Головоломка
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button className={`w-full py-3 rounded-xl font-medium transition-colors ${
                        selectedSubscription === 'base' 
                          ? 'bg-indigo-400 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                        {selectedSubscription === 'base' ? 'Выбрано' : 'Выбрать'}
                      </button>
                    </div>

                    {/* Premium Subscription */}
                    <div className={`bg-white rounded-xl p-6 shadow-sm border transition-all cursor-pointer ${
                      selectedSubscription === 'premium' 
                        ? 'border-indigo-400 bg-indigo-50' 
                        : 'border-gray-100 hover:border-gray-300'
                    }`} onClick={() => setSelectedSubscription('premium')}>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          Премиум
                        </h3>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          9 игрушек
                        </span>
                        <span className="text-gray-500">•</span>
                        <div className="text-right">
                          <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                            ${calculateChildPrice('premium', children.length)}/мес.
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-gray-600 text-sm mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          Состав набора игрушек
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                              🔧
                            </div>
                            <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              x3
                            </span>
                            <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              Конструктор
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
                              🎨
                            </div>
                            <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              x2
                            </span>
                            <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              Творческий набор
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg">
                              🧸
                            </div>
                            <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              x2
                            </span>
                            <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              Мягкая игрушка
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg">
                              🧩
                            </div>
                            <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              x1
                            </span>
                            <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              Головоломка
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">
                              💎
                            </div>
                            <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              x1
                            </span>
                            <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                              Премиум-игрушка
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button className={`w-full py-3 rounded-xl font-medium transition-colors ${
                        selectedSubscription === 'premium' 
                          ? 'bg-indigo-400 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                        {selectedSubscription === 'premium' ? 'Выбрано' : 'Выбрать'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Add Child Banner */}
                {!hasMultipleChildren && !editingChildId && (
                  <div className="bg-indigo-400 rounded-3xl p-6 text-center">
                    <p className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Добавьте ещё одного ребёнка и получите скидку 20% на его набор
                    </p>
                    <button
                      onClick={handleAddChild}
                      className="bg-white bg-opacity-30 text-white py-3 px-6 rounded-full text-sm font-medium hover:bg-opacity-40 transition-all"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      Добавить ребёнка
                    </button>
                  </div>
                )}
                
                {hasMultipleChildren && !editingChildId && (
                  <div className="bg-green-500 rounded-3xl p-6 text-center">
                    <p className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      🎉 Скидка активна!
                    </p>
                    <p className="text-sm text-white mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Все дети кроме первого получают скидку 20% на свой набор
                    </p>
                    <button
                      onClick={handleAddChild}
                      className="bg-white bg-opacity-30 text-white py-3 px-6 rounded-full text-sm font-medium hover:bg-opacity-40 transition-all"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      Добавить ещё ребёнка
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom action button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
              <button
                className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
                  (isSubscriptionValid || hasMultipleChildren) && !(editingChildId && editMode === 'subscription' && !selectedSubscription)
                    ? 'bg-indigo-400 text-white shadow-sm' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isSubscriptionValid && !hasMultipleChildren}
                onClick={handleSubscriptionSubmit}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {editingChildId && editMode === 'subscription' 
                  ? 'Сохранить изменения' 
                  : 'Перейти к оформлению'
                }
            </button>
            </div>
          </div>
        );
      case Step.Delivery:
        const timeOptions = [
          { value: '', label: 'Выберите время' },
          { value: '9-12', label: '9:00 - 12:00' },
          { value: '12-15', label: '12:00 - 15:00' },
          { value: '15-18', label: '15:00 - 18:00' },
          { value: '18-21', label: '18:00 - 21:00' }
        ];

        // Get current date info for validation
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1;
        
        // Validate delivery date format DD/MM
        const validateDeliveryDate = (dateString: string) => {
          if (!dateString) return { isValid: false, error: "Выберите дату" };
          
          const datePattern = /^(\d{2})\/(\d{2})$/;
          const match = dateString.match(datePattern);
          
          if (!match) {
            return { isValid: false, error: "Формат: ДД/ММ" };
          }
          
          const day = parseInt(match[1], 10);
          const month = parseInt(match[2], 10);
          
          if (day < 1 || day > 31 || month < 1 || month > 12) {
            return { isValid: false, error: "Некорректная дата" };
          }
          
          // Check if date is not in the past (same month comparison)
          if (month < currentMonth || (month === currentMonth && day < currentDay)) {
            return { isValid: false, error: "Дата не может быть в прошлом" };
          }
          
          return { isValid: true, error: "" };
        };
        
        const deliveryDateValidation = validateDeliveryDate(deliveryDate);

        const isDeliveryFormValid = deliveryAddress.trim() && deliveryDate && deliveryDateValidation.isValid && deliveryTime;

        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16 bg-white">
              <button 
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
                             <span className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                 Шаг 5/8
               </span>
              
              <button 
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
              {/* Title */}
              <div className="text-center mt-4 mb-6">
                <h1 className="text-xl font-medium text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Куда доставить набор?
                </h1>
              </div>

              <div className="space-y-6">
                {/* Адрес */}
                <div>
                  <label className="block text-gray-600 text-sm mb-3 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Адрес
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-indigo-400 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 pr-12"
                      placeholder="Введите адрес доставки"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    />
                    <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                </div>

                                 {/* Дата доставки */}
                 <div>
                   <label className="block text-gray-600 text-sm mb-3 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                     Дата доставки
                   </label>
                   <div className="relative">
                     <input
                       type="text"
                       placeholder="ДД/ММ"
                       value={deliveryDate}
                       onChange={(e) => {
                         const formatted = formatDateInput(e.target.value, false);
                         setDeliveryDate(formatted);
                       }}
                       maxLength={5}
                       className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 focus:outline-none ${
                         deliveryDate && !deliveryDateValidation.isValid
                           ? 'border-red-400 focus:border-red-400'
                           : deliveryDate && deliveryDateValidation.isValid
                           ? 'border-green-400 focus:border-green-400'
                           : 'border-gray-200 focus:border-indigo-400'
                       }`}
                       style={{ fontFamily: 'Nunito, sans-serif' }}
                     />
                   </div>
                   {deliveryDate && !deliveryDateValidation.isValid && (
                     <p className="text-sm text-red-400 px-3 mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                       {deliveryDateValidation.error}
                     </p>
                   )}
                 </div>

                {/* Время доставки */}
                <div>
                  <label className="block text-gray-600 text-sm mb-3 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Время доставки
                  </label>
                  <div className="relative">
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 appearance-none focus:outline-none focus:border-indigo-400 pr-12"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      {timeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>

                {/* Комментарий для курьера */}
                <div>
                  <label className="block text-gray-600 text-sm mb-3 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Комментарий для курьера
                  </label>
                  <textarea
                    value={deliveryComments}
                    onChange={(e) => setDeliveryComments(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-400 resize-none"
                    placeholder="Дополнительная информация для курьера"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
              <button
                className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
                  isDeliveryFormValid
                    ? 'bg-indigo-400 text-white shadow-sm' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isDeliveryFormValid}
                onClick={handleDeliverySubmit}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Продолжить
              </button>
            </div>

            {/* Синий элемент справа */}
            <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-1 h-24 bg-indigo-400 rounded-l-full"></div>
          </div>
        );
      case Step.Payment:
        // Calculate total for all children
        const totalPrice = children.reduce((sum, child, index) => {
          return sum + calculateChildPrice(child.subscription, index);
        }, 0);

        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16 bg-white">
              <button 
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
              <span className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Шаг 6/8
              </span>
              
              <button 
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-6 pb-24 overflow-y-auto">
              {/* Title */}
              <div className="pt-6 pb-8">
                <h1 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Подтвердите и оплатите подписку
                </h1>
              </div>

              <div className="space-y-6">
                {/* Наборы для детей */}
                {children.map((child, index) => {
                  const planItems = getPlanItems(child.subscription);
                  const price = calculateChildPrice(child.subscription, index);
                  
                  return (
                    <div key={child.id} className="bg-gray-100 rounded-xl p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Набор для {child.name}
                      </h2>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                            Игрушек в наборе
                          </span>
                          <span className="text-gray-900 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                            {planItems.reduce((sum, item) => sum + item.count, 0)} шт
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                            Стоимость
                          </span>
                          <span className="text-gray-900 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                            ${price} / мес.
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Общая сумма */}
                <div className="mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Общая сумма
                    </span>
                    <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      ${totalPrice} / мес.
                    </span>
                  </div>
                </div>

                {/* Информация об отмене */}
                <div className="mb-8">
                  <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Можно отменить или поставить подписку на паузу в любое время через приложение
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="px-6 pb-6">
              <button 
                className="w-full py-4 bg-indigo-400 text-white rounded-full font-medium text-lg hover:bg-indigo-500 transition-colors mb-3"
                onClick={handlePaymentSubmit}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Оплатить и активировать
              </button>
              
              <p className="text-center text-gray-500 text-xs leading-relaxed" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Вы будете перенаправлены в платёжный сервис для безопасной оплаты
              </p>
            </div>

            {/* Синий элемент справа */}
            <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-1 h-24 bg-indigo-400 rounded-l-full"></div>
          </div>
        );
      case Step.Success:
        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <div className="flex justify-between items-center p-4">
              <span className="text-lg font-bold text-gray-900 tracking-wider" style={{ fontFamily: 'Nunito, sans-serif' }}>
                BOX4BABY
              </span>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setStep(Step.Phone)}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Success Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              {/* Success Icon */}
              <div className="mb-8">
                <img 
                  src="/illustrations/ok.png" 
                  alt="Success" 
                  className="w-24 h-24 mx-auto"
                />
              </div>

              {/* Success Message */}
              <h1 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Подписка активирована!
              </h1>

              <p className="text-gray-600 leading-relaxed max-w-xs" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Мы уже начали собирать коробку для вашего ребёнка. Вы получите уведомление, когда она будет готова к доставке.
              </p>
            </div>

            {/* Bottom Button */}
            <div className="px-6 pb-6">
              <button 
                className="w-full py-4 bg-indigo-400 text-white rounded-full font-medium text-lg hover:bg-indigo-500 transition-colors"
                onClick={() => setStep(Step.Phone)}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Перейти на главную
              </button>
            </div>

            {/* Синий элемент справа */}
            <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-1 h-24 bg-indigo-400 rounded-l-full"></div>
          </div>
        );
      default:
        return null;
    }
  };

  // Full screen steps that handle their own layout
  if (step === Step.Welcome || step === Step.Register || step === Step.Child || step === Step.Categories || step === Step.Subscription || step === Step.Delivery || step === Step.Payment || step === Step.Success) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        {error && <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm mb-2 text-center fixed top-0 left-0 right-0 z-50">{error}</div>}
        {renderStep()}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - скрывать на welcome экранах */}
        <div className="flex items-center justify-between px-4 py-3 h-16">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-800">BOX4BABY</span>
          </div>
          <button className="bg-gray-100 rounded-lg p-1" onClick={() => setStep(Step.Phone)}>
            <span className="sr-only">Закрыть</span>
            <svg width="24" height="24" fill="none" stroke="#30313D" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6"/></svg>
          </button>
        </div>
      {/* Content */}
      <div className="flex flex-col flex-1 px-4 py-8 gap-4 max-w-md w-full mx-auto">
        {error && <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm mb-2 text-center">{error}</div>}
        {renderStep()}
      </div>
    </div>
  );
}; 