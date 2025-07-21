import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null); // All items closed by default
  const [selectedAge, setSelectedAge] = useState<string>('0 - 3 месяцев');
  const [isAgeMenuOpen, setIsAgeMenuOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [showAllToys, setShowAllToys] = useState<boolean>(false);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCreateBoxClick = () => {
    navigate('/login');
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleAgeMenu = () => {
    setIsAgeMenuOpen(!isAgeMenuOpen);
  };

  const selectAge = (age: string) => {
    setSelectedAge(age);
    setIsAgeMenuOpen(false);
  };

  const openBoxModal = (boxNumber: number) => {
    setSelectedBox(boxNumber);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBox(null);
  };

  const handleShowMoreToys = () => {
    setShowAllToys(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFE8C8' }}>
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 lg:px-12 py-4 bg-white">
        <div className="text-xl md:text-2xl font-bold text-gray-800">
          BOX4BABY
        </div>
        <button
          onClick={handleLoginClick}
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Войти
        </button>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center">
        {/* Family illustration */}
        <div className="w-full">
          <img 
            src="/illustrations/family.svg" 
            alt="Семья с детьми"
            className="w-full h-64 md:h-80 lg:h-[534px] object-cover"
          />
        </div>

        {/* Main content */}
        <div className="bg-white p-8 md:p-12 mx-4 md:mx-8 text-center -mt-8 md:-mt-12 max-w-7xl mx-auto" style={{ borderRadius: '24px' }}>
          <h1 className="font-bold mb-4 leading-tight text-[26px] md:text-[32px] lg:text-[36px] text-gray-800">
            Игрушки, которые радуют и развивают
          </h1>
          <p className="mb-8 leading-relaxed text-[16px] md:text-[18px] text-[#686564] max-w-2xl mx-auto">
            Подберите персональную коробку для ребенка и получай новый набор каждые 2 недели
          </p>
          <button
            onClick={handleCreateBoxClick}
            className="w-full max-w-md py-4 text-white font-semibold rounded-3xl text-lg transition-all duration-200"
            style={{ backgroundColor: '#747EEC' }}
          >
            Собрать коробку
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="px-4 py-12 ">
        <div className="max-w-sm mx-auto text-center">
          <h2 className="font-bold leading-tight text-[26px] text-gray-800 mb-4">
            Освобождайте пространство, развивайте ребёнка и экономьте ресурсы
          </h2>
          <p className="mb-0 text-[16px] text-[#686564]">
            90% детей теряют интерес к игрушке меньше чем за 16 дней. Им хочется чего-то нового — и это нормально!
          </p>
        </div>
      </div>

      {/* Карусель карточек */}
      <div className="px-4 mt-1">
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {/* Карточка 1 */}
          <div className="min-w-[246px] max-w-[246px] bg-white rounded-3xl shadow-md flex flex-col overflow-hidden" style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.06)' }}>
            {/* Иллюстрация */}
            <div className="bg-[#E6E6FA] w-full overflow-hidden" style={{ height: 160 }}>
              <img src="/illustrations/bear.png" alt="Меньше хаоса" className="w-full h-full object-contain" />
            </div>
            {/* Контент */}
            <div className="p-5">
              <div className="font-bold text-[18px] mb-2 flex items-center">
                <span className="mr-2">🧸</span> Меньше хаоса
              </div>
              <div className="text-[18px] text-[#222] leading-snug">
                Устали от гор игрушек, которыми никто не играет? Подписка избавляет от беспорядка и делает игру осмысленной и удобной.
              </div>
            </div>
          </div>
          {/* Карточка 2 */}
          <div className="min-w-[246px] max-w-[246px] bg-white rounded-3xl shadow-md flex flex-col overflow-hidden" style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.06)' }}>
            {/* Иллюстрация */}
            <div className="bg-[#E6E6FA] w-full overflow-hidden" style={{ height: 160 }}>
              <img src="/illustrations/toys.png" className="w-full h-full object-contain" />
            </div>
            {/* Контент */}
            <div className="p-5">
              <div className="font-bold text-[18px] mb-2 flex items-center">
                <span className="mr-2">🧠</span>Только акутальное
              </div>
              <div className="text-[18px] text-[#222] leading-snug">
                Игрушки легко менять по мере роста и интересов ребенка. Никакого перегруза — только то, что нужно именно сейчас.
              </div>
            </div>
          </div>
          <div className="min-w-[246px] max-w-[246px] bg-white rounded-3xl shadow-md flex flex-col overflow-hidden" style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.06)' }}>
            {/* Иллюстрация */}
            <div className="bg-[#E6E6FA] w-full overflow-hidden" style={{ height: 160 }}>
              <img src="/illustrations/toys2.png" className="w-full h-full object-contain" />
            </div>
            {/* Контент */}
            <div className="p-5">
              <div className="font-bold text-[18px] mb-2 flex items-center">
                <span className="mr-2">🎓 </span>Развитие без усилий
              </div>
              <div className="text-[18px] text-[#222] leading-snug">
              Каждая игрушка — не случайна. Мы подбираем наборы с учётом возраста, навыков и целей развития.
              </div>
            </div>
          </div>
          <div className="min-w-[246px] max-w-[246px] bg-white rounded-3xl shadow-md flex flex-col overflow-hidden" style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.06)' }}>
            {/* Иллюстрация */}
            <div className="bg-[#E6E6FA] w-full overflow-hidden" style={{ height: 160 }}>
              <img src="/illustrations/toys3.png" className="w-full h-full object-contain" />
            </div>
            {/* Контент */}
            <div className="p-5">
              <div className="font-bold text-[18px] mb-2 flex items-center">
                <span className="mr-2">🕰️</span>Экономия времени
              </div>
              <div className="text-[18px] text-[#222] leading-snug">
              Больше не нужно тратить часы на маркетплейсах. Игрушки приходят автоматически — в нужное время, в одной коробке.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Как это работает */}
      <div className="px-4 md:px-8 lg:px-12 mt-10 max-w-7xl mx-auto">
        <div className="w-full mx-full bg-white rounded-3xl p-6 md:p-8 lg:p-12">
          <h2 className="text-center font-bold text-[26px] md:text-[32px] lg:text-[36px] mb-8 md:mb-12">Как это работает</h2>
          <div className="flex flex-col gap-6 md:gap-8 lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Шаг 1 */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[12px] bg-[#F2F2F2] flex items-center justify-center">
                <span className="text-[40px] md:text-[48px] text-[#747EEC] font-bold">1</span>
              </div>
              <div className="pt-1 text-[18px] md:text-[20px]">Вы выбираете возраст, интересы и цели развития</div>
            </div>
            {/* Шаг 2 */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[12px] bg-[#F2F2F2] flex items-center justify-center">
                <span className="text-[40px] md:text-[48px] text-[#747EEC] font-bold">2</span>
              </div>
              <div className="pt-1 text-[18px] md:text-[20px]">Мы собираем персональный набор игрушек</div>
            </div>
            {/* Шаг 3 */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[12px] bg-[#F2F2F2] flex items-center justify-center">
                <span className="text-[40px] md:text-[48px] text-[#747EEC] font-bold">3</span>
              </div>
              <div className="pt-1 text-[18px] md:text-[20px]">Курьер доставляет коробку прямо к вам домой</div>
            </div>
            {/* Шаг 4 */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[12px] bg-[#F2F2F2] flex items-center justify-center">
                <span className="text-[40px] md:text-[48px] text-[#747EEC] font-bold">4</span>
              </div>
              <div className="pt-1 text-[18px] md:text-[20px]">Через 2 недели — новый набор</div>
            </div>
          </div>
        </div>
      </div>

      {/* Примеры наборов Section */}
      <div className="px-4 md:px-8 lg:px-12 py-12" style={{ backgroundColor: '#FFE8C8' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-4 md:mb-6">Примеры наборов</h2>
            
            {/* Age Filter */}
            <div className="inline-block relative">
              <div 
                className="bg-white rounded-2xl px-4 py-3 flex items-center cursor-pointer"
                onClick={toggleAgeMenu}
              >
                <span className="text-gray-700 mr-2">{selectedAge}</span>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform ${isAgeMenuOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Dropdown Menu */}
              {isAgeMenuOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-lg z-10 min-w-[200px]">
                  <div className="py-2">
                    {[
                      '0 - 3 месяцев',
                      '3 - 6 месяцев', 
                      '6 - 12 месяцев',
                      '1 - 3 года',
                      '3 - 5 лет',
                      '5 - 8 лет'
                    ].map((age) => (
                      <div
                        key={age}
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedAge === age ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => selectAge(age)}
                      >
                        <span className="text-gray-700">{age}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Toy Sets Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Set 1 */}
            <div 
              className="bg-white rounded-2xl p-4 md:p-6 cursor-pointer transition-transform hover:scale-105" 
              style={{ boxShadow: 'none' }}
              onClick={() => openBoxModal(1)}
            >
              <div className="mb-3">
                <img 
                  src="/illustrations/box1.svg" 
                  alt="Коробка 1"
                  className="w-full object-contain"
                />
              </div>
              <h3 className="font-medium text-gray-800 mb-1 md:text-lg">Коробка 1</h3>
              <p className="text-sm text-gray-500">Подробнее</p>
            </div>
            
            {/* Set 2 */}
            <div 
              className="bg-white rounded-2xl p-4 md:p-6 cursor-pointer transition-transform hover:scale-105" 
              style={{ boxShadow: 'none' }}
              onClick={() => openBoxModal(2)}
            >
              <div className="mb-3">
                <img 
                  src="/illustrations/box2.svg" 
                  alt="Коробка 2"
                  className="w-full object-contain"
                />
              </div>
              <h3 className="font-medium text-gray-800 mb-1 md:text-lg">Коробка 2</h3>
              <p className="text-sm text-gray-500">Подробнее</p>
            </div>
            
            {/* Set 3 */}
            <div 
              className="bg-white rounded-2xl p-4 md:p-6 cursor-pointer transition-transform hover:scale-105" 
              style={{ boxShadow: 'none' }}
              onClick={() => openBoxModal(3)}
            >
              <div className="mb-3">
                <img 
                  src="/illustrations/box3.svg" 
                  alt="Коробка 3"
                  className="w-full object-contain"
                />
              </div>
              <h3 className="font-medium text-gray-800 mb-1 md:text-lg">Коробка 3</h3>
              <p className="text-sm text-gray-500">Подробнее</p>
            </div>
            
            {/* Set 4 */}
            <div 
              className="bg-white rounded-2xl p-4 md:p-6 cursor-pointer transition-transform hover:scale-105" 
              style={{ boxShadow: 'none' }}
              onClick={() => openBoxModal(4)}
            >
              <div className="mb-3">
                <img 
                  src="/illustrations/box4.svg" 
                  alt="Коробка 4"
                  className="w-full object-contain"
                />
              </div>
              <h3 className="font-medium text-gray-800 mb-1 md:text-lg">Коробка 4</h3>
              <p className="text-sm text-gray-500">Подробнее</p>
            </div>
          </div>
          
          {/* Call to Action Button */}
          <div className="text-center mb-6 md:mb-8">
            <button
              onClick={handleCreateBoxClick}
              className="w-full max-w-md py-4 text-white font-semibold rounded-3xl text-lg transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #747EEC 0%, #8B80F0 100%)' }}
            >
              Собрать набор для ребенка
            </button>
          </div>
          
          {/* Service Info */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm md:text-base text-gray-600">
              <span>Бесплатная доставка</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>Обновление набора каждые 14 дней</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="px-4 py-12">
        <div className="max-w-sm mx-auto text-center mb-8">
          <h2 className="font-bold leading-tight text-[26px] text-gray-800 mb-4">
            Что говорят наши клиенты
          </h2>
        </div>
        
        {/* Reviews Table */}
        <div className="w-full">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {/* First Review Column */}
            <div className="flex flex-col space-y-4 w-[300px] flex-shrink-0">
              {/* Video Container */}
              <div 
                className="relative overflow-hidden cursor-pointer"
                style={{ borderRadius: '20px', height: '520px' }}
              >
                <img 
                  src="/illustrations/Video.svg" 
                  alt="Видео отзыв Алины"
                  className="w-full h-full object-cover"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-0 h-0 border-l-[12px] border-l-[#747EEC] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              
              {/* Review Container */}
              <div 
                className="p-6"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px'
                }}
              >
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">Алина</h3>
                  <p className="text-sm text-gray-600">мама 2х летней девочки</p>
                </div>
                
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, index) => (
                    <svg 
                      key={index}
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Крутая идея — подписка с игрушками. Ребёнок играет с интересом, экранное время уменьшилось. А я больше не гуглю, что ему купить.
                </p>
              </div>
            </div>

            {/* Second Review Column - Three Reviews */}
            <div className="flex flex-col space-y-4 w-[300px] flex-shrink-0">
              {/* First Review */}
              <div 
                className="p-6"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px'
                }}
              >
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">Мария</h3>
                  <p className="text-sm text-gray-600">мама 3х летнего мальчика</p>
                </div>
                
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, index) => (
                    <svg 
                      key={index}
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Ребёнок в восторге от каждой коробки! Игрушки качественные, развивающие. Теперь не нужно ломать голову над выбором.
                </p>
              </div>

              {/* Second Review */}
              <div 
                className="p-6"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px'
                }}
              >
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">Елена</h3>
                  <p className="text-sm text-gray-600">мама 1.5 летней девочки</p>
                </div>
                
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, index) => (
                    <svg 
                      key={index}
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Отличный сервис! Дочка с нетерпением ждёт каждую коробку. Игрушки подобраны идеально по возрасту и интересам.
                </p>
              </div>

              {/* Third Review */}
              <div 
                className="p-6"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px'
                }}
              >
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">Анна</h3>
                  <p className="text-sm text-gray-600">мама 4х летнего мальчика</p>
                </div>
                
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, index) => (
                    <svg 
                      key={index}
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Экономия времени и нервов! Больше не нужно бегать по магазинам. Сын в восторге от разнообразия игрушек.
                </p>
              </div>
            </div>

            {/* Third Review Column - Review on top, Video on bottom */}
            <div className="flex flex-col space-y-4 w-[300px] flex-shrink-0">
              {/* Review Container */}
              <div 
                className="p-6"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px'
                }}
              >
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">Евгения</h3>
                  <p className="text-sm text-gray-600">бабушка девочки 3 лет</p>
                </div>
                
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, index) => (
                    <svg 
                      key={index}
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Подарила подписку внучке — и не прогадала! Каждый месяц — как праздник. Это не просто игрушки, а настоящее внимание к ребёнку.
                </p>
              </div>

              {/* Video Container */}
              <div 
                className="relative overflow-hidden cursor-pointer"
                style={{ borderRadius: '20px', height: '520px' }}
              >
                <img 
                  src="/illustrations/Video1.svg" 
                  alt="Видео отзыв Евгении"
                  className="w-full h-full object-cover"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-0 h-0 border-l-[12px] border-l-[#747EEC] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fourth Review Column - Three Reviews */}
            <div className="flex flex-col space-y-4 w-[300px] flex-shrink-0">
              {/* First Review */}
              <div 
                className="p-6"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px'
                }}
              >
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">Мария</h3>
                  <p className="text-sm text-gray-600">мама двойняшек 2 лет</p>
                </div>
                
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, index) => (
                    <svg 
                      key={index}
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Ребёнок в восторге от каждого набора! Особенно радует, что всё чистое и готовое к использованию. Чувствуется забота о деталях.
                </p>
              </div>

              {/* Second Review */}
              <div 
                className="p-6"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px'
                }}
              >
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">Тимур</h3>
                  <p className="text-sm text-gray-600">папа мальчика 3 лет</p>
                </div>
                
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, index) => (
                    <svg 
                      key={index}
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Крутая идея — подписка с игрушками. Ребёнок играет с интересом, экранное время уменьшилось. А я больше не гуглю, что ему купить.
                </p>
              </div>

              {/* Third Review */}
              <div 
                className="p-6"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px'
                }}
              >
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">Сабина</h3>
                  <p className="text-sm text-gray-600">мама мальчика 2,5 года</p>
                </div>
                
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, index) => (
                    <svg 
                      key={index}
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Ребёнок в восторге от каждого набора! Особенно радует, что всё чистое и готовое к использованию. Чувствуется забота о деталях.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="px-4 md:px-8 lg:px-12 py-12" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-2xl mx-auto text-center mb-8 md:mb-12">
          <h2 className="font-bold leading-tight text-[26px] md:text-[32px] lg:text-[36px] text-gray-800 mb-4">
            Игрушки по подписке
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#686564]">
            Выберите тариф, который подойдёт вашему ребёнку
          </p>
        </div>
        
        {/* Pricing Carousel */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide md:justify-center md:overflow-visible md:grid md:grid-cols-2 md:gap-8" style={{ paddingTop: '64px' }}>
            {/* Basic Plan Card */}
            <div className="w-[300px] md:w-full flex-shrink-0 bg-gray-50 rounded-3xl pt-12 pb-6 px-6 relative overflow-visible" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
              {/* Toy Box Image */}
              <div className="absolute -top-16 left-6 right-6 overflow-visible">
                <img 
                  src="/illustrations/set.svg" 
                  alt="Базовый набор игрушек"
                  className="w-full h-32 object-contain"
                />
              </div>
              
              {/* Plan Title */}
              <h3 className="font-bold text-2xl text-gray-800 mb-3">Базовый</h3>
              
              {/* Plan Description */}
              <p className="text-[16px] text-[#686564] mb-6 leading-relaxed">
                6 игрушек для регулярной игры и знакомства с сервисом
              </p>
              
              {/* Price */}
              <div className="mb-6">
                <span className="font-bold text-2xl text-gray-800">35 $</span>
                <span className="text-[16px] text-[#686564]"> / месяц</span>
              </div>
              
              {/* Subscribe Button */}
              <button
                onClick={handleCreateBoxClick}
                className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-2xl transition-all duration-200 hover:bg-gray-300"
              >
                Подписаться
              </button>
            </div>

            {/* Premium Plan Card */}
            <div className="w-[300px] md:w-full flex-shrink-0 rounded-3xl pt-12 pb-6 px-6 relative overflow-visible" style={{ backgroundColor: '#747EEC' }}>
              {/* Toy Box Image */}
              <div className="absolute -top-16 left-6 right-6 overflow-visible">
                <img 
                  src="/illustrations/set1.svg" 
                  alt="Премиум набор игрушек"
                  className="w-full h-32 object-contain"
                />
              </div>
              
              {/* Plan Title */}
              <h3 className="font-bold text-2xl text-white mb-3">Премиум</h3>
              
              {/* Plan Description */}
              <p className="text-[16px] text-white mb-6 leading-relaxed opacity-90">
                9 игрушек, редкие и премиальные. Больше «вау» эффекта в коробке
              </p>
              
              {/* Price */}
              <div className="mb-6">
                <span className="font-bold text-2xl text-yellow-300">60 $</span>
                <span className="text-[16px] text-white opacity-90"> / месяц</span>
              </div>
              
              {/* Subscribe Button */}
              <button
                onClick={handleCreateBoxClick}
                className="w-full py-3 bg-white text-[#747EEC] font-semibold rounded-2xl transition-all duration-200 hover:bg-gray-100"
              >
                Подписаться
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features and Special Offer Section */}
      <div className="px-4 md:px-8 lg:px-12 py-12" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Features Card */}
          <div className="rounded-3xl p-6 md:p-8 lg:p-12" style={{ backgroundColor: '#F2F2F2' }}>
            <h3 className="font-bold text-xl md:text-2xl lg:text-3xl text-gray-800 mb-6 md:mb-8">Входит в каждый план</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Feature 1 */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-lg">🚚</span>
                </div>
                <span className="text-gray-700">Бесплатная доставка</span>
              </div>
              
              {/* Feature 2 */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg">🔄</span>
                </div>
                <span className="text-gray-700">Обновление набора каждые 14 дней</span>
              </div>
              
              {/* Feature 3 */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">🎯</span>
                </div>
                <span className="text-gray-700">Подбор по возрасту и интересам</span>
              </div>
              
              {/* Feature 4 */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">🧼</span>
                </div>
                <span className="text-gray-700">Только чистые и проверенные игрушки</span>
              </div>
              
              {/* Feature 5 */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">🧸</span>
                </div>
                <span className="text-gray-700">Возможность выкупить любимую игрушку</span>
              </div>
              
              {/* Feature 6 */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-lg">💬</span>
                </div>
                <span className="text-gray-700">Поддержка по любым вопросам</span>
              </div>
            </div>
          </div>

          {/* Special Offer Card */}
          <div className="rounded-3xl p-6 md:p-8 lg:p-12" style={{ backgroundColor: '#E4E6FC' }}>
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-purple-700 font-medium text-lg md:text-xl lg:text-2xl mb-1">Каждому ребёнку — свой набор</p>
                <p className="text-gray-700 mb-2 md:text-lg">Для второго и следующих — скидка</p>
                <p className="text-purple-700 font-bold text-2xl md:text-3xl lg:text-4xl">20% на каждый набор</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 10 Toys Section */}
      <div className="px-4 md:px-8 lg:px-12 py-12" style={{ backgroundColor: '#F2F2F2' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-gray-800">Топ 10 игрушек</h2>
          </div>
          
          {/* Toys Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {/* Toy Card 1 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="mb-3">
                <img 
                  src="/illustrations/frog.svg" 
                  alt="Весёлая лягушка-мемори"
                  className="w-full object-cover rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-700 text-center">Весёлая лягушка-мемори</p>
            </div>
            
            {/* Toy Card 2 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="mb-3">
                <img 
                  src="/illustrations/football.svg" 
                  alt="Мини-футбол на пальцах"
                  className="w-full  object-cover rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-700 text-center">Мини-футбол на пальцах</p>
            </div>
            
            {/* Toy Card 3 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="mb-3">
                <img 
                  src="/illustrations/sort.svg" 
                  alt="Сортировщик Цвета и форм"
                  className="w-full  object-cover rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-700 text-center">Сортировщик «Цвета и форм»</p>
            </div>
            
            {/* Toy Card 4 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="mb-3">
                <img 
                  src="/illustrations/car.svg" 
                  alt="Городской гараж с машинками"
                  className="w-full  object-cover rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-700 text-center">Городской гараж с машинками</p>
            </div>
            
            {/* Toy Card 5 - Hidden on mobile by default */}
            <div className={`${showAllToys ? 'block' : 'hidden'} md:block bg-white rounded-2xl p-4 shadow-sm`}>
              <div className="mb-3">
                <img 
                  src="/illustrations/brick.svg" 
                  alt="Мозаика для малышей"
                  className="w-full  object-cover rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-700 text-center">Мозаика для малышей</p>
            </div>
            
            {/* Toy Card 6 - Hidden on mobile by default */}
            <div className={`${showAllToys ? 'block' : 'hidden'} md:block bg-white rounded-2xl p-4 shadow-sm`}>
              <div className="mb-3">
                <img 
                  src="/illustrations/dino.svg" 
                  alt="Деревянные кубики"
                  className="w-full  object-cover rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-700 text-center">Деревянные кубики</p>
            </div>
            
            {/* Toy Card 7 - Hidden on mobile by default */}
            <div className={`${showAllToys ? 'block' : 'hidden'} md:block bg-white rounded-2xl p-4 shadow-sm`}>
              <div className="mb-3">
                <img 
                  src="/illustrations/sorter.svg" 
                  alt="Музыкальный ксилофон"
                  className="w-full object-cover rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-700 text-center">Музыкальный ксилофон</p>
            </div>
            
            {/* Toy Card 8 - Hidden on mobile by default */}
            <div className={`${showAllToys ? 'block' : 'hidden'} md:block bg-white rounded-2xl p-4 shadow-sm`}>
              <div className="mb-3">
                <img 
                  src="/illustrations/synt.svg" 
                  alt="Пазл-головоломка"
                  className="w-full  object-cover rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-700 text-center">Пазл-головоломка</p>
            </div>
            
            {/* Toy Card 9 - Hidden on mobile by default */}
            <div className={`${showAllToys ? 'block' : 'hidden'} md:block bg-white rounded-2xl p-4 shadow-sm`}>
              <div className="mb-3">
                <img 
                  src="/illustrations/hero.svg" 
                  alt="Конструктор-трансформер"
                  className="w-full  object-cover rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-700 text-center">Конструктор-трансформер</p>
            </div>
            
            {/* Toy Card 10 - Hidden on mobile by default */}
            <div className={`${showAllToys ? 'block' : 'hidden'} md:block bg-white rounded-2xl p-4 shadow-sm`}>
              <div className="mb-3">
                <img 
                  src="/illustrations/cosmo.svg" 
                  alt="Логическая пирамидка"
                  className="w-full  object-cover rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-700 text-center">Логическая пирамидка</p>
            </div>
          </div>
          
          {/* Show More Button - Mobile Only */}
          <div className="text-center md:hidden">
            {!showAllToys && (
              <button 
                onClick={handleShowMoreToys}
                className="text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors" 
                style={{ backgroundColor: '#E3E3E3' }}
              >
                Показать еще
              </button>
            )}
          </div>
          

        </div>
      </div>

            {/* New Image Block Section */}
      <div className="px-4 md:px-8 lg:px-12 py-12" style={{ backgroundColor: '#F2F2F2' }}>
        <div className="max-w-7xl mx-auto">
        <div className="relative flex justify-center">
          <img 
            src="/illustrations/Background.svg" 
            alt="Добро пожаловать в мир игрушек"
            className="w-full max-w-7xl h-64 md:h-80 object-cover rounded-2xl"
          />
          
          {/* Modal Container - Positioned over the image */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white rounded-3xl p-8 shadow-lg w-80" style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.1)' }}>
              <div className="text-center">
                <h2 className="font-bold text-2xl text-gray-800 mb-6">Начните прямо сейчас!</h2>
                <button
                  onClick={handleCreateBoxClick}
                  className="w-full py-4 text-white font-semibold rounded-3xl text-lg transition-all duration-200"
                  style={{ backgroundColor: '#8B80F0' }}
                >
                  Собрать коробку
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
          
      </div>

      {/* FAQ Section */}
      <div className="px-4 md:px-8 lg:px-12 py-12" style={{ backgroundColor: '#F2F2F2' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center font-bold text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-8 md:mb-12">Часто задаваемые вопросы</h2>
          
          <div className="bg-white rounded-2xl shadow-sm">
            {/* FAQ Item 1 */}
            <div className="p-6 border-b border-gray-100">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => toggleFaq(0)}
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <svg 
                    className={`w-4 h-4 text-gray-600 transition-transform ${openFaq === 0 ? 'rotate-90' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-lg flex-1">Как работает подписка на игрушки?</h3>
              </div>
              {openFaq === 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    Подписка работает по принципу регулярной доставки. Вы выбираете план, указываете возраст и интересы ребёнка, 
                    а мы каждые 2 недели доставляем новый набор игрушек прямо к вам домой.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div className="p-6 border-b border-gray-100">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => toggleFaq(1)}
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <svg 
                    className={`w-4 h-4 text-gray-600 transition-transform ${openFaq === 1 ? 'rotate-90' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-lg flex-1">Что входит в набор и как он подбирается?</h3>
              </div>
              {openFaq === 1 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    Игрушки подбираются индивидуально — по возрасту, интересам и этапу развития ребёнка. 
                    В каждой коробке — тщательно отобранные, проверенные и дезинфицированные игрушки.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 3 */}
            <div className="p-6 border-b border-gray-100">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => toggleFaq(2)}
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <svg 
                    className={`w-4 h-4 text-gray-600 transition-transform ${openFaq === 2 ? 'rotate-90' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-lg flex-1">Что если игрушка не понравилась или сломалась?</h3>
              </div>
              {openFaq === 2 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    Если игрушка не понравилась или сломалась, просто сообщите нам об этом. 
                    Мы заменим её на другую в следующей коробке или предложим альтернативу.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 4 */}
            <div className="p-6">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => toggleFaq(3)}
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <svg 
                    className={`w-4 h-4 text-gray-600 transition-transform ${openFaq === 3 ? 'rotate-90' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 text-lg flex-1">Можно ли выкупить понравившуюся игрушку?</h3>
              </div>
              {openFaq === 3 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    Да, конечно! Если ребёнку очень понравилась какая-то игрушка, вы можете её выкупить. 
                    Просто сообщите нам об этом, и мы предложим выгодную цену.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 md:px-8 lg:px-12 py-12" style={{ backgroundColor: '#2A2D3E' }}>
        <div className="max-w-2xl mx-auto text-center">
          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-gray-400 text-sm mb-2">Контакты для связи</h3>
            <p className="text-white text-lg font-medium">hello@box4baby.com</p>
          </div>

          {/* Telegram Button */}
          <div className="mb-8">
            <button className="bg-gray-600 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:bg-gray-700 transition-colors flex items-center justify-center mx-auto">
              <span className="mr-2">Телеграм</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-600 mb-6"></div>

          {/* Company Info */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm">BOX4BABY 444500104692</p>
          </div>

          {/* Legal Links */}
          <div className="mb-4 space-y-2">
            <a href="#" className="block text-gray-400 text-sm hover:text-white transition-colors">
              Пользовательское соглашение
            </a>
            <a href="#" className="block text-gray-400 text-sm hover:text-white transition-colors">
              Политика конфиденциальности
            </a>
          </div>

          {/* Copyright */}
          <div>
            <p className="text-gray-500 text-xs">(c) 2025 box4baby</p>
          </div>
        </div>
      </div>

      {/* Box Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800">Первые формы</h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg border border-purple-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-500 text-lg">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">🧱</span>
                </div>
                <div className="flex-1">
                  <span className="text-gray-500 text-sm">x2</span>
                  <p className="text-gray-800 font-medium">Конструктор</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🎨</span>
                </div>
                <div className="flex-1">
                  <span className="text-gray-500 text-sm">x2</span>
                  <p className="text-gray-800 font-medium">Творческий набор</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">🧸</span>
                </div>
                <div className="flex-1">
                  <span className="text-gray-500 text-sm">x1</span>
                  <p className="text-gray-800 font-medium">Мягкая игрушка</p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 text-xl">🧠</span>
                </div>
                <div className="flex-1">
                  <span className="text-gray-500 text-sm">x1</span>
                  <p className="text-gray-800 font-medium">Головоломка</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 