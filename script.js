// --- СКРИПТ ДЛЯ КВЕСТА (ИСПРАВЛЕННЫЙ) ---
let selected = '';

// 1. Обработка первого шага (кнопка "IT-проект")
document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', () => {
        selected = button.textContent;
        const category = button.dataset.category;
        const current = document.querySelector('.step.active');
        if (current) current.classList.remove('active');
        const step2 = document.querySelector(`.step[data-step="2"][data-category="${category}"]`);
        if (step2) {
            step2.classList.add('active');
            step2.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

// 2. ОБРАБОТКА ВТОРОГО ШАГА (мультивыбор)
const stepPrevBtn = document.querySelector('.step-controls .step-prev');
const stepNextBtn = document.querySelector('.step-controls .step-next');

// Множество для хранения выбранных значений (чтобы не было дублей)
const selectedRequirements = new Set();

// Навешиваем обработчики на кнопки выбора
document.querySelectorAll('.multichoice-options .choice-btn').forEach(button => {
    button.addEventListener('click', function () {
        const value = this.getAttribute('data-value');
        const wasSelected = selectedRequirements.has(value);

        // Переключаем состояние (выбрано/не выбрано)
        if (wasSelected) {
            // Убираем выбор
            selectedRequirements.delete(value);
            this.classList.remove('selected'); // Снимаем визуальный класс
        } else {
            // Добавляем выбор
            selectedRequirements.add(value);
            this.classList.add('selected'); // Добавляем визуальный класс
        }

        // Разблокируем кнопку "Далее", если выбран хотя бы один пункт
        stepNextBtn.disabled = selectedRequirements.size === 0;
    });
});

// Обработчик кнопки "Далее" (переход на шаг 3)
if (stepNextBtn) {
    stepNextBtn.addEventListener('click', function () {
        // Формируем текстовое описание выбранных требований
        const requirementsText = Array.from(selectedRequirements).map(value => {
            // Можно добавить более красивые названия
            const labels = {
                'pixel-perfect': 'Pixel Perfect',
                'speed': 'Максимальная скорость',
                'interactive': 'Сложная интерактивность',
                'adaptive': 'Адаптивность',
                'clean-code': 'Чистый код'
            };
            return labels[value] || value;
        }).join(', ');

        // Обновляем общий список выбора для сводки
        // (selected - это переменная из первой части скрипта, где выбран тип сайта)
        const updatedSelection = selected + ' → Важные требования: ' + requirementsText;
        document.getElementById('project-summary-display').textContent = updatedSelection;
        document.getElementById('project-summary-hidden').value = updatedSelection;

        // Переключаем шаги
        document.querySelector('.step[data-step="2"]').classList.remove('active');
        const step3 = document.querySelector('.step[data-step="3"]');
        if (step3) {
            step3.classList.add('active');
            step3.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Обработчик кнопки "Назад" (возврат на шаг 1)
if (stepPrevBtn) {
    stepPrevBtn.addEventListener('click', function () {
        document.querySelector('.step[data-step="2"]').classList.remove('active');
        const step1 = document.querySelector('.step[data-step="1"]');
        if (step1) {
            step1.classList.add('active');
            step1.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// ===== ФУНКЦИОНАЛ КНОПКИ МЕССЕНДЖЕРА (ВЫПАДАЮЩЕЕ МЕНЮ) =====
document.addEventListener('DOMContentLoaded', function() {
    const messengerToggle = document.getElementById('messenger-toggle');
    const selectedMessengerInput = document.getElementById('selected-messenger');
    
    // Проверяем, есть ли уже меню
    if (!document.getElementById('messenger-dropdown') && messengerToggle) {
        const dropdown = document.createElement('div');
        dropdown.id = 'messenger-dropdown';
        dropdown.className = 'messenger-dropdown';
        dropdown.innerHTML = `
            <button type="button" class="messenger-option" data-messenger="whatsapp">
                <span class="option-icon whatsapp">
                    <img src="img/icons/whatsapp.svg" alt="WhatsApp" width="24" height="24">
                </span>
                <span class="option-name">WhatsApp</span>
            </button>
            <button type="button" class="messenger-option" data-messenger="telegram">
                <span class="option-icon telegram">
                    <img src="img/icons/telegram.svg" alt="Telegram" width="24" height="24">
                </span>
                <span class="option-name">Telegram</span>
            </button>
            <button type="button" class="messenger-option" data-messenger="viber">
                <span class="option-icon viber">
                    <img src="img/icons/viber.svg" alt="Viber" width="24" height="24">
                </span>
                <span class="option-name">Viber</span>
            </button>
            <button type="button" class="messenger-option" data-messenger="facebook">
                <span class="option-icon facebook">
                    <img src="img/icons/facebook.svg" alt="Facebook" width="24" height="24">
                </span>
                <span class="option-name">Facebook Messenger</span>
            </button>
        `;
        
        messengerToggle.parentNode.insertBefore(dropdown, messengerToggle.nextSibling);
    }

    const dropdown = document.getElementById('messenger-dropdown');
    const options = document.querySelectorAll('.messenger-option');

    if (!messengerToggle || !dropdown) return;

    // Открытие/закрытие меню
    messengerToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        dropdown.classList.toggle('show');
    });

    // Выбор мессенджера
    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            const messenger = this.dataset.messenger;
            const messengerName = this.querySelector('.option-name').textContent;
            
            // ✅ КЛЮЧЕВОЙ МОМЕНТ: сохраняем в скрытое поле
            if (selectedMessengerInput) {
                selectedMessengerInput.value = messenger;
                console.log('✅ Выбран мессенджер:', messenger, 'значение сохранено в hidden поле');
            } else {
                console.error('❌ Поле selected-messenger не найдено!');
            }
            
            // Показываем уведомление
            showNotification('Мы бесплатно отправим расчёт на ' + messengerName + ', звонить не будем!');
            
            // Закрываем меню
            dropdown.classList.remove('show');
        });
    });

    // Закрытие при клике вне меню
    document.addEventListener('click', function(e) {
        if (dropdown && !messengerToggle.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
});

// Функция для красивого уведомления
function showNotification(message) {
    // Удаляем предыдущее уведомление, если есть
    const oldToast = document.querySelector('.messenger-toast');
    if (oldToast) oldToast.remove();
    
    // Создаём новое
    const toast = document.createElement('div');
    toast.className = 'messenger-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Автоматически удаляем через 3 секунды
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== ОБРАБОТКА ТРЕТЬЕГО ШАГА (ОТПРАВКА ФОРМЫ) =====
document.getElementById('order-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Отменяем стандартную отправку формы

    // Получаем данные из формы с проверкой на null
    const userNameInput = document.getElementById('user-name');
    const phoneInput = document.getElementById('phone');
    const messengerInput = document.getElementById('selected-messenger');
    const summaryInput = document.getElementById('project-summary-hidden');

    // Проверяем все обязательные поля
    if (!userNameInput) {
        alert('Ошибка: поле имени не найдено. Обновите страницу.');
        return;
    }
    
    if (!phoneInput) {
        alert('Ошибка: поле телефона не найдено. Обновите страницу.');
        return;
    }
    
    if (!summaryInput) {
        alert('Ошибка: данные заказа не найдены. Пройдите квиз заново.');
        return;
    }

    // Получаем значения
    const userName = userNameInput.value.trim();
    const phoneValue = phoneInput.value.trim();
    
    // Получаем выбранный мессенджер (если поля нет, используем WhatsApp)
    let selectedMessenger = 'whatsapp';
    if (messengerInput) {
        selectedMessenger = messengerInput.value;
    }
    
    const orderSummary = summaryInput.value;

    // Валидация
    if (!userName) {
        alert('Пожалуйста, введите ваше имя.');
        userNameInput.focus();
        return;
    }

    const phoneDigits = phoneValue.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        alert('Пожалуйста, введите корректный номер телефона (минимум 10 цифр).');
        phoneInput.focus();
        return;
    }

    // Формируем сообщение для Telegram
    const message = `📋 Новая заявка с лендинга!\n\n` +
        `👤 Имя: ${userName}\n` +
        `📞 Телефон: ${phoneDigits}\n` +
        `💬 Предпочтительный мессенджер: ${selectedMessenger}\n` +
        `---\n` +
        `📦 Детали заказа: ${orderSummary}`;

    // URL вашей функции в Яндекс.Облаке
    const YANDEX_FUNCTION_URL = 'https://functions.yandexcloud.net/d4e0jgoq4npo6bkceckk';

    // Отправляем данные
    fetch(YANDEX_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message, type: 'order' })
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Перенаправляем на страницу благодарности
                window.location.href = "thankyou.html";
            } else {
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');
            }
        })
        .catch(error => {
            console.error('Ошибка сети:', error);
            alert('Ошибка соединения с сервером.');
        });
});

// <!-- JavaScript для чата (изменено 26.06.2025)-->
// 1. Получаем элементы DOM
const chatbox = document.getElementById('chatbox');// Окно чата
const chatMessages = document.getElementById('chat-messages');// Контейнер сообщений
const chatInput = document.getElementById('chat-input');// Поле ввода
const sendButton = document.getElementById('send-button');// Кнопка отправки

// Авторасширение поля ВВЕРХ
chatInput.addEventListener('input', function() {
  // 1. Сброс высоты
  this.style.height = 'auto';
  
  // 2. Рассчитываем новую высоту (не более 5 строк = 100px)
  const newHeight = Math.min(this.scrollHeight, 100);
  this.style.height = newHeight + 'px';

  // Включаем прокрутку только если содержимое превышает 5 строк
  this.style.overflowY = this.scrollHeight > 100 ? 'auto' : 'hidden';
  
  // 3. Прокручиваем сообщения вниз
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Функция приветственного сообщения бота(изменено 25.06.2025)
function showWelcomeMessage() {
  // Создаём элемент сообщения
  const welcomeMessage = document.createElement('div');
  welcomeMessage.className = 'bot-message'; // Класс для стилей бота
  welcomeMessage.textContent = "👋 Здравствуйте! Чем могу помочь?\n\n• Ответим на вопросы\n• Подберём решение\n• Проконсультируем!\n\nОпишите задачу:"; // Устанавливаем текст

  // Добавляем в контейнер сообщений
  chatMessages.appendChild(welcomeMessage);
  
  chatMessages.scrollTop = chatMessages.scrollHeight;// Прокрутка вниз

  // Прокручиваем вниз
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

//Универсальная функция для обработки кнопок чата(изменено 25.06.2025)
function handleChatButtons() {
  const isOpening = !chatbox.classList.contains('show');// Проверяем, открывается ли чат
  chatbox.classList.toggle('show');// Переключаем видимость
  
  if (isOpening) {//Если чат открывается(изменено 25.06.2025)
    setTimeout(showWelcomeMessage, 300);// Показываем приветствие с задержкой
  }
}

// Назначаем обработчик на все кнопки открытия чата
document.querySelectorAll('.cta-button, .consult-button').forEach(btn => {
  btn.addEventListener('click', handleChatButtons);//При "клике" по кнопке, открывается чат и показывается приветствоие(изменено 26.06.2025)
});

// Обработчик для кнопки закрытия
document.getElementById('close-chat').addEventListener('click', () => {
  chatbox.classList.remove('show');// Просто скрываем чат
});

// 3. Функция отправки сообщения(изменено 23.06.2025)
let isFirstMessage = true; // Флаг для отслеживания первого сообщения

function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  // 1. Добавляем сообщение пользователя в чат
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);

   // 2. Безопасная отправка через Yandex Cloud Function
const YANDEX_FUNCTION_URL = 'https://functions.yandexcloud.net/d4e0jgoq4npo6bkceckk'; // URL вашей функции в Яндекс Облаке

fetch(YANDEX_FUNCTION_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Новый лид! ' + message + ' #ЛИД', // Формируем текст сообщения
    type: 'chat' // Указываем тип - сообщение из чата
  })
})
.catch(error => console.error('Ошибка:', error));

  // 3. Ответ бота зависит от порядка сообщений
  const botResponse = document.createElement('div');
  botResponse.className = 'bot-message';

  if (isFirstMessage) {
    botResponse.textContent = "Спасибо за сообщение! Отвечу вам сегодня. 📝 Напишите прямо здесь телефон, email или мессенджер для связи:";
    isFirstMessage = false; // Следующее сообщение будет считаться контактом
  } else {
    botResponse.textContent = "✅ Спасибо! Ваши данные получены. Свяжусь с вами в ближайшее время.";
    // Можно добавить задержку и закрытие чата
    setTimeout(() => {
      chatbox.classList.remove('show');
      isFirstMessage = true; // Сброс для нового диалога
    }, 3000);
  }

  chatMessages.appendChild(botResponse);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Прокрутка вниз
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 5. Обработчики событий
sendButton.addEventListener('click', sendMessage);// Клик на кнопку
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
    e.preventDefault();
    sendMessage();
    
    // Сброс высоты после отправки
    setTimeout(() => {
      chatInput.style.height = 'auto';
      chatInput.style.overflowY = 'hidden';
    }, 0);
  }
});

  // Функционал гамбургер-меню
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mainMenu = document.querySelector('.main-menu');

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    mainMenu.classList.toggle('mobile-active');
    
    // Меняем иконку гамбургера на крестик при открытии и обратно
    if (mainMenu.classList.contains('mobile-active')) {
      hamburgerBtn.textContent = '✕'; // Крестик
    } else {
      hamburgerBtn.textContent = '☰'; // Гамбургер
    }
  });

  // Закрываем меню при клике вне его
  document.addEventListener('click', (e) => {
    if (!mainMenu.contains(e.target) && e.target !== hamburgerBtn) {
      mainMenu.classList.remove('mobile-active');
      hamburgerBtn.textContent = '☰'; // Возвращаем иконку гамбургера
    }
  });

  // Закрываем меню при клике на ссылку в нем
  mainMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      mainMenu.classList.remove('mobile-active');
      hamburgerBtn.textContent = '☰'; // Возвращаем иконку гамбургера
    }
  });

  // Закрываем меню при изменении ориентации экрана или resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      mainMenu.classList.remove('mobile-active');
      hamburgerBtn.textContent = '☰';
    }
  });
