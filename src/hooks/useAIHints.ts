import { useState, useCallback } from 'react';

interface AIHint {
  id: string;
  type: 'warning' | 'suggestion' | 'info';
  title: string;
  message: string;
  action?: string;
}

interface TaskAnalysis {
  score: number; // 0-100, качество описания
  hints: AIHint[];
  isReady: boolean; // готово ли для генерации ТЗ
}

const useAIHints = () => {
  const [analysis, setAnalysis] = useState<TaskAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeTask = useCallback(async (
    title: string,
    description: string,
    category: any
  ) => {
    if (!title.trim() && !description.trim()) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);

    // Имитируем анализ AI
    setTimeout(() => {
      const hints: AIHint[] = [];
      let score = 0;

      // Анализ заголовка
      if (!title.trim()) {
        hints.push({
          id: 'title-missing',
          type: 'warning',
          title: 'Отсутствует заголовок',
          message: 'Добавьте краткое название вашего проекта',
          action: 'Заполнить заголовок'
        });
      } else if (title.length < 10) {
        hints.push({
          id: 'title-short',
          type: 'suggestion',
          title: 'Заголовок слишком короткий',
          message: 'Сделайте заголовок более описательным (минимум 10 символов)',
          action: 'Дополнить заголовок'
        });
        score += 20;
      } else {
        score += 40;
      }

      // Анализ описания
      if (!description.trim()) {
        hints.push({
          id: 'description-missing',
          type: 'warning',
          title: 'Отсутствует описание',
          message: 'Опишите что именно нужно сделать',
          action: 'Добавить описание'
        });
      } else if (description.length < 50) {
        hints.push({
          id: 'description-short',
          type: 'suggestion',
          title: 'Слишком краткое описание',
          message: 'Добавьте больше деталей для лучшего результата ИИ',
          action: 'Дополнить описание'
        });
        score += 20;
      } else if (description.length < 100) {
        hints.push({
          id: 'description-medium',
          type: 'info',
          title: 'Хорошее начало!',
          message: 'Для еще более точного ТЗ укажите: целевую аудиторию, платформы, особые требования',
          action: 'Добавить детали'
        });
        score += 30;
      } else {
        score += 40;
      }

      // Анализ категории
      if (!category) {
        hints.push({
          id: 'category-missing',
          type: 'warning',
          title: 'Выберите категорию',
          message: 'Категория поможет ИИ лучше понять специфику проекта',
          action: 'Выбрать категорию'
        });
      } else {
        score += 20;
      }

      // Дополнительные подсказки на основе контента
      if (description.toLowerCase().includes('сайт') || description.toLowerCase().includes('веб')) {
        if (!description.toLowerCase().includes('дизайн') && !description.toLowerCase().includes('функционал')) {
          hints.push({
            id: 'web-details',
            type: 'suggestion',
            title: 'Уточните детали веб-проекта',
            message: 'Укажите нужен ли дизайн, какой функционал, количество страниц',
            action: 'Добавить детали'
          });
        }
      }

      if (description.toLowerCase().includes('приложение') || description.toLowerCase().includes('мобильн')) {
        if (!description.toLowerCase().includes('ios') && !description.toLowerCase().includes('android')) {
          hints.push({
            id: 'mobile-platform',
            type: 'suggestion',
            title: 'Укажите платформы',
            message: 'Для какой платформы: iOS, Android или обе?',
            action: 'Указать платформы'
          });
        }
      }

      const isReady = score >= 60 && hints.filter(h => h.type === 'warning').length === 0;

      setAnalysis({
        score,
        hints,
        isReady
      });

      setIsAnalyzing(false);
    }, 500);
  }, []);

  return {
    analysis,
    isAnalyzing,
    analyzeTask
  };
};

export default useAIHints;
