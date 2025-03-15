# Портфель 📊💰

## О проекте ℹ️

Portfolio Overview - это React-компонент, котороый позволяет пользователям:
- Добавлять криптовалютные активы в свой портфель 📝
- Отслеживать текущие цены в реальном времени 📈
- Просматривать общую стоимость портфеля и распределение активов 📊
- Удалять активы из портфеля 🗑️

Все данные сохраняются локально в localStorage браузера, а обновление цен происходит через WebSocket API Binance

## Время разработки ⏱️

На реализацию данного компонента было потрачено 5 часов без перерывов, включая время на изучение некоторых аспектов Chart.js и WebSocket API. Для ускорения создания скелета компонентов использовалась нейросеть, что позволило сфокусироваться на бизнес-логике и работе с API, а так же стилизации.

## СТэк проекта 🛠️

- React 19
- TypeScript
- Redux Toolkit для управления состоянием
- Chart.js и react-chartjs-2 для визуализации данных
- WebSocket API для получения данных в реальном времени
- react-window для виртуализации списка активов
- SCSS для стилизации

## Подготовка среды 🚀

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/portfolio-overview.git
cd portfolio-overview
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите приложение в режиме разработки:
```bash
npm run dev
```

4. Откройте [http://localhost:5173](http://localhost:5173) в вашем браузере.

## Сборка проекта 🏗️

Для создания production-сборки выполните:
```bash
npm run build
```

Собранные файлы будут находиться в директории `dist/`.

## Структура проекта 📁

```
src/
├── components/            # UI компоненты
│   ├── AddAssetForm/      # Форма добавления актива
│   ├── AssetList/         # Список активов
│   ├── Chart/             # Компонент графика цен
│   └── PortfolioSummary/  # Сводка портфеля
├── pages/                 # Страницы приложения
│   └── Portfolio.tsx      # Главная страница
├── services/              # Сервисы для работы с API
│   ├── binanceService.ts  # Работа с WebSocket API Binance
│   └── priceService.ts    # Получение текущих цен
├── store/                 # Redux хранилище
│   └── slices/            # Redux слайсы
│       └── assetsSlice.ts # Слайс для управления активами
├── types/                 # TypeScript типы
├── utils/                 # Вспомогательные функции
└── styles/                # Глобальные стили
```

## Интеграция компонента в ваш проект 🔄

Если вы хотите интегрировать Portfolio Overview в существующий проект, следуйте этим шагам:

### Шаг 1: Установите необходимые зависимости 📦

```bash
npm install react-chartjs-2 chart.js react-window @reduxjs/toolkit react-redux socket.io-client uuid axios
```

### Шаг 2: Скопируйте компоненты и сервисы 📋

1. Скопируйте папки `components`, `services`, `store`, `utils` и `types` в ваш проект
2. Импортируйте глобальные стили или адаптируйте их под ваш дизайн

### Шаг 3: Добавьте Redux store 🧩

```tsx
// В вашем файле store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import assetsReducer from './slices/assetsSlice';

export const store = configureStore({
  reducer: {
    assets: assetsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Шаг 4: Подключите Portfolio компонент в вашем приложении 🔌

```tsx
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <div className="app">
      {/* Ваши другие компоненты */}
      <Portfolio />
    </div>
  );
}
```

### Шаг 5: Оберните ваше приложение в Provider 🎁

```tsx
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
```

## Как это работает 🔍

1. **Добавление актива**: 
   - Пользователь выбирает криптовалюту и количество в форме AddAssetForm
   - При отправке формы вызывается API для получения текущей цены
   - Новый актив добавляется в Redux store и localStorage

2. **Обновление цен**:
   - При добавлении первого актива устанавливается WebSocket соединение с Binance
   - При получении обновления цены через WebSocket, данные обновляются в Redux
   - Пересчитывается общая стоимость портфеля и доли каждого актива

3. **Удаление актива**:
   - При клике на актив в списке он удаляется из портфеля
   - Если это был последний актив с данным символом, отписка от WebSocket

4. **Визуализация данных**:
   - Круговая диаграмма показывает распределение активов в портфеле
   - Линейный график показывает историю цен выбранного актива (демо-данные)

## Советы по доработке 💡

- Добавьте аутентификацию для сохранения данных на сервере 🔐
- Реализуйте загрузку реальной истории цен из API 📅
- Добавьте больше типов активов (акции, облигации) 📈
- Создайте мобильную версию приложения 📱

## Вопросы? 🤔

Если у вас возникли вопросы по интеграции или работе компонента, не стесняйтесь обращаться! Буду рад помочь! 😊

### Тестовое задание с энтузиазмом выполнил ваш возможный покорный слуга Иван 😄

---

Создано с ❤️ и ☕
