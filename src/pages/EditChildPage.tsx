import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserData } from '../types';

interface EditChildPageProps {
  child: UserData['children'][0];
  onClose: () => void;
  onSave: (updatedChild: UserData['children'][0]) => void;
  BottomNavigation: React.ComponentType;
}

// Конвертация даты из формата YYYY-MM-DD в DD.MM.YYYY
const convertDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  // Если дата уже в формате DD.MM.YYYY, возвращаем как есть
  if (dateString.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
    return dateString;
  }
  
  // Если дата в формате YYYY-MM-DD, конвертируем
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  }
  
  return dateString;
};

// Конвертация даты из формата DD.MM.YYYY в YYYY-MM-DD
const convertDateForStorage = (dateString: string): string => {
  if (!dateString) return '';
  
  // Если дата уже в формате YYYY-MM-DD, возвращаем как есть
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }
  
  // Если дата в формате DD.MM.YYYY, конвертируем
  if (dateString.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
    const [day, month, year] = dateString.split('.');
    return `${year}-${month}-${day}`;
  }
  
  return dateString;
};

export const EditChildPage: React.FC<EditChildPageProps> = ({ 
  child, 
  onClose, 
  onSave, 
  BottomNavigation 
}) => {
  const [formData, setFormData] = useState(() => ({
    name: child.name,
    birthDate: convertDateForDisplay(child.birthDate),
    gender: child.gender,
    limitations: child.limitations,
    comment: child.comment,
    interests: child.interests,
    skills: child.skills
  }));

  const availableInterests = ['Конструкторы', 'Плюшевые', 'Ролевые', 'Развивающие', 'Техника', 'Творчество'];
  const availableSkills = ['Моторика', 'Логика', 'Воображение', 'Творчество', 'Речь'];

  // Mapping для эмодзи интересов
  const interestEmojis: { [key: string]: string } = {
    'Конструкторы': '🧱',
    'Плюшевые': '🧸',
    'Ролевые': '🎭',
    'Развивающие': '🧠',
    'Техника': '⚙️',
    'Творчество': '🎨'
  };

  // Mapping для эмодзи навыков
  const skillEmojis: { [key: string]: string } = {
    'Моторика': '✋',
    'Логика': '🧩',
    'Воображение': '💭',
    'Творчество': '🎨',
    'Речь': '🗣'
  };

  const handleSave = () => {
    if (formData.name.trim() && validateBirthDate(formData.birthDate).isValid) {
      const updatedChild = {
        ...child,
        name: formData.name.trim(),
        birthDate: convertDateForStorage(formData.birthDate),
        gender: formData.gender,
        limitations: formData.limitations,
        comment: formData.comment,
        interests: formData.interests,
        skills: formData.skills
      };
      
      onSave(updatedChild);
      onClose();
    }
  };

  // Форматирование даты для ввода в формате DD.MM.YYYY
  const formatDateInput = (value: string): string => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as DD.MM.YYYY
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
    }
  };

  // Валидация даты рождения
  const validateBirthDate = (dateString: string) => {
    if (!dateString) return { isValid: false, error: "Введите дату рождения" };
    
    // Check if format is correct DD.MM.YYYY
    const datePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = dateString.match(datePattern);
    
    if (!match) {
      return { isValid: false, error: "Формат: ДД.ММ.ГГГГ" };
    }
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Validate day, month ranges
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return { isValid: false, error: "Некорректная дата" };
    }
    
    const birthDate = new Date(year, month - 1, day);
    if (isNaN(birthDate.getTime())) {
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
      return { isValid: false, error: "Возраст не может быть больше 18 лет" };
    }
    
    if (birthDate > sixMonthsAgo) {
      return { isValid: false, error: "Ребенку должно быть больше 6 месяцев" };
    }
    
    return { isValid: true, error: "" };
  };



  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-32" style={{ fontFamily: 'Nunito, sans-serif' }}>
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-center relative">
          <h1 className="text-[20px] font-semibold text-gray-900 text-center">Изменить данные ребенка</h1>
          <button 
            onClick={onClose}
            className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-32">
        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2 px-3">
            Имя ребенка
          </label>
          <div className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
            formData.name ? 'border-[#7782F5]' : 'border-gray-200 focus-within:border-[#7782F5]'
          }`}>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
              placeholder="Введите имя"
              maxLength={32}
            />
          </div>
        </div>

        {/* Birth Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2 px-3">
            Дата рождения
          </label>
          <div className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
            formData.birthDate && !validateBirthDate(formData.birthDate).isValid
              ? 'border-red-400'
              : formData.birthDate && validateBirthDate(formData.birthDate).isValid
              ? 'border-[#7782F5]'
              : formData.birthDate
              ? 'border-[#7782F5]'
              : 'border-gray-200 focus-within:border-[#7782F5]'
          }`}>
            <input
              type="text"
              value={formData.birthDate}
              onChange={(e) => {
                const formatted = formatDateInput(e.target.value);
                setFormData(prev => ({ ...prev, birthDate: formatted }));
              }}
              className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
              placeholder="ДД.ММ.ГГГГ"
              maxLength={10}
            />
          </div>
          {formData.birthDate && !validateBirthDate(formData.birthDate).isValid && (
            <p className="text-sm text-red-400 px-3 mt-1">
              {validateBirthDate(formData.birthDate).error}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2 px-3">
            Пол ребенка
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setFormData(prev => ({ ...prev, gender: 'male' }))}
              className={`flex-1 py-3 px-4 rounded-2xl font-medium text-sm transition-all ${
                formData.gender === 'male'
                  ? 'bg-[#7782F5] text-white'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              Мужской
            </button>
            <button
              onClick={() => setFormData(prev => ({ ...prev, gender: 'female' }))}
              className={`flex-1 py-3 px-4 rounded-2xl font-medium text-sm transition-all ${
                formData.gender === 'female'
                  ? 'bg-[#7782F5] text-white'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              Женский
            </button>
          </div>
        </div>

                 {/* Limitations */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2 px-3">
            Особенности
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setFormData(prev => ({ ...prev, limitations: 'none', comment: '' }))}
              className={`flex-1 py-3 px-4 rounded-2xl font-medium text-sm transition-all ${
                formData.limitations === 'none'
                  ? 'bg-[#7782F5] text-white'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              Нет
            </button>
            <button
              onClick={() => setFormData(prev => ({ ...prev, limitations: 'has_limitations' }))}
              className={`flex-1 py-3 px-4 rounded-2xl font-medium text-sm transition-all ${
                formData.limitations === 'has_limitations'
                  ? 'bg-[#7782F5] text-white'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              Есть ограничения
            </button>
          </div>
        </div>

        {/* Comment for limitations */}
        {formData.limitations === 'has_limitations' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2 px-3">
              Комментарий
            </label>
            <div className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
              formData.comment ? 'border-[#7782F5]' : 'border-gray-200 focus-within:border-[#7782F5]'
            }`}>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 resize-none"
                placeholder="Опишите особенности ребенка"
                rows={3}
                maxLength={200}
              />
            </div>
          </div>
        )}

        {/* Interests */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2 px-3">
            Интересы
          </label>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`py-3 px-4 rounded-2xl font-medium text-sm transition-all flex items-center gap-2 ${
                  formData.interests.includes(interest)
                    ? 'bg-[#7782F5] text-white'
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}
              >
                <span>{interestEmojis[interest] || ''}</span>
                <span>{interest}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2 px-3">
            Навыки для развития
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`py-3 px-4 rounded-2xl font-medium text-sm transition-all flex items-center gap-2 ${
                  formData.skills.includes(skill)
                    ? 'bg-[#7782F5] text-white'
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}
              >
                <span>{skillEmojis[skill] || ''}</span>
                <span>{skill}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-28 left-4 right-4">
        <button
          onClick={handleSave}
          disabled={!formData.name.trim() || !validateBirthDate(formData.birthDate).isValid}
          className={`w-full py-3 px-4 rounded-[32px] font-medium text-base transition-colors ${
            formData.name.trim() && validateBirthDate(formData.birthDate).isValid
              ? 'bg-gray-800 text-white hover:bg-gray-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Сохранить
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}; 