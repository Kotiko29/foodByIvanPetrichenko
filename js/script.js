window.addEventListener('DOMContentLoaded', () => {

const tabs = document.querySelectorAll('.tabheader__item'),
      tabsContent = document.querySelectorAll('.tabcontent'),
      tabParent = document.querySelector('.tabheader__items');

/////////////////////Создаем табы на странице/////////////////////

// Функция скрытия табов
  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    });
  }
  
// Функция, которая показывает табы

function showTabContent(i = 0) {
  tabsContent[i].classList.add('show', 'fade');
  tabsContent[i].classList.remove('hide');
  tabs[i].classList.add('tabheader__item_active');
}

  hideTabContent();
  showTabContent();

  // Обработчик события клика

  tabParent.addEventListener('click', (event) => {
    const target = event.target;
    if(target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if(target === item) {
          hideTabContent();
          showTabContent(i);          
        }
      });
    }
  });

/////////////////////////////////////////////////////////////////////////////////
  /////////////////////////Создаем таймер на странице////////////////////////////

  const deadLine = '2020-08-05';

  // определяем разницу между дедлайном и текущим временем

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
        days = Math.floor(t / (1000*60*60*24)),
        hours = Math.floor((t / (1000*60 * 60) % 24)),
        minutes = Math.floor((t / 1000 / 60) % 60),
        seconds = Math.floor((t / 1000) % 60);

    return {
      'total': t,
      days,
      hours,
      minutes,
      seconds,
    };
  }
// функция для добавления нуля к часам, минутам...
  function getZero(num) {
    if(num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  /// устанавливаем таймер на страницу
  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);

    updateClock();
    // функция, которая обновляет таймер на странице
    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.textContent = getZero(t.days);
      hours.textContent = getZero(t.hours);
      minutes.textContent = getZero(t.minutes);
      seconds.textContent = getZero(t.seconds);

      if(t.total <= 0) {
        clearInterval(timeInterval);
        days.textContent = 0;
        hours.textContent = 0;
        minutes.textContent = 0;
        seconds.textContent = 0;
      }
    }
  }  
  setClock('.timer', deadLine);

  /// Модальное окно

  const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');
  
  modalTrigger.forEach(btn => {
    btn.addEventListener('click', () => {
      // modal.classList.add('show');
      // modal.classList.remove('hide');
      openModal();
    });
  });
    
  function openModal() {
    // modal.classList.toggle('show');
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  }

  function closeModal() {
    // modal.classList.toggle('show');
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }


modal.addEventListener('click', (event) => {
      if(event.target === modal || event.target.getAttribute('data-close') == "") {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if(event.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 50000);

  function showModalByScroll() {
    if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }
  window.addEventListener('scroll', showModalByScroll);


  /// Список меню на классах

  const menu = document.querySelector('.menu__field .container');

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = +price;
      this.transfer = 78;
      this.changeToUAH();
      this.parent = document.querySelector(parentSelector);
      this.classes = classes;
    }

    changeToUAH() {
      this.price *= this.transfer;
    }

    render() {
      const element = document.createElement('div');
      if(this.classes.length === 0) {
        // this.classes.push('menu__item');
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach(item => element.classList.add(item));
      }     

      element.innerHTML = `
        <img src="${this.src}" alt="${this.alt}">
        <h3 class="menu__item-subtitle">${this.title}"</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      `;
      this.parent.append(element);      
    }
  }

  // Функция обработки GET запроса
  const getResource = async (url) => {
    let res = await fetch(url);

    // Обработка ошибки по статусу ответа
    if(!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }

    return await res.json();
  };

  // Формирование карточек товара
  // getResource('http://localhost:3000/menu')
  // .then(data => {
  //   data.forEach(({img, altimg, title, descr, price}) => {
  //     new MenuCard(img, altimg, title, descr, price, '.menu .container', 'menu__item').render();
  //   });
  // });

  // Используем библиотеку axios
  axios.get('http://localhost:3000/menu')
    .then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => {
          new MenuCard(img, altimg, title, descr, price, '.menu .container', 'menu__item').render();
      });
    });

  // Forms
  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро свяжемся',
    failure: 'Ошибка отправки данных'
  };

  forms.forEach(item => {
    bindPostData(item);
  });

  // Функция обработки post запроса
  const postData = async (url, data) => {
    let res = await fetch(url, {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: data,
    });

    return await res.json();
  };


  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);
      console.log(formData);
      // переводим нашу formData в json:
      // 1) formData.entries() — превращаем в массив массивов
      // 2) Object.fromEntries(formData.entries()) — переводим в объект
      // 3) JSON.stringify(Object.fromEntries(formData.entries())) — переводим в формат json для отправки на сервер
      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
      .then(data => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
      })
      .catch(() => {
        showThanksModal(message.failure);
      })
      .finally(() => {
        form.reset();
      });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
    <div class="modal__content">
      <div class="modal__close" data-close>&times;</div>
      <div class="modal__title">${message}</div>
      </div>
    `;
    document.querySelector('.modal').append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 6000);
  }

  // Делаем слайд на странице

  let slideIndex = 0;
  const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

///////////////////////////////////////////////////////////////////////////

// Второй слайдер с перемещением картинок по оси x
let offset = 0; // вычисляем на сколько передвинуля слайдер

  // Добавляем/убираем 0 к общему числу слайдов
  if(slides.length < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex+1}`;
  } else {
    total.textContent = slides.length;
    current.textContent = slideIndex+1;
  }

slidesField.style.width = 100 * slides.length + '%';
slidesField.style.display = 'flex';
slidesField.style.transition = '0.5s all';

slidesWrapper.style.overflow = 'hidden';

slides.forEach(slide => {
  slide.style.width = width;
});

slider.style.position = 'relative';

const indicators = document.createElement('ol'),
      dots = [];
indicators.classList.add('carousel-indicators');
indicators.style.cssText = `
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 15;
  display: flex;
  justify-content: center;
  margin-right: 15%;
  margin-left: 15%;
  list-style: none;
`;
slider.append(indicators);

for(let i =0; i < slides.length; i++) {
  const dot = document.createElement('li');
  dot.setAttribute('data-slide-to', i+1 );
  dot.style.cssText = `
    box-sizing: content-box;
    flex: 0 1 auto;
    width: 30px;
    height: 6px;
    margin-right: 3px;
    margin-left: 3px;
    cursor: pointer;
    background-color: #fff;
    background-clip: padding-box;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: .5;
    transition: opacity .6s ease;
  `;
  if(i == 0) {
    dot.style.opacity = 1;
  }
  indicators.append(dot);
  dots.push(dot);
}

next.addEventListener('click', () => {
  if(offset == +width.replace(/\D/g, '') * (slides.length-1)) {
    offset = 0;
  } else {
    offset += +width.replace(/\D/g, '');
  }
  // сдвигаем слайт при клике по кнопке
  slidesField.style.transform = `translateX(-${offset}px)`;

  if(slideIndex == slides.length-1) {
    slideIndex = 0;
  } else {
    slideIndex++;
  }

  if (slides.length < 10) {
    current.textContent = `0${slideIndex+1}`;
  } else {
    current.textContent = slideIndex+1;
  }

  dots.forEach(dot => dot.style.opacity = '0.5');
  dots[slideIndex].style.opacity = '1'
});

prev.addEventListener('click', () => {
  if(offset == 0) {
    offset = +width.replace(/\D/g, '') * (slides.length-1);
  } else {
    offset -= width.replace(/\D/g, '');
  }
  // сдвигаем слайт при клике по кнопке
  slidesField.style.transform = `translateX(-${offset}px)`;

  if(slideIndex == 0) {
    slideIndex = slides.length-1;
  } else {
    slideIndex--;
  }

  if (slides.length < 10) {
    current.textContent = `0${slideIndex+1}`;
  } else {
    current.textContent = slideIndex+1;
  }

  dots.forEach(dot => dot.style.opacity = '0.5');
  dots[slideIndex].style.opacity = '1'
});

dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    const slideTo = e.target.getAttribute('data-slide-to');
    slideIndex = slideTo;

    offset = +width.replace(/\D/g, '') * (slideTo - 1);
    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
  
    dots.forEach(dot => dot.style.opacity = '0.5');
    dots[slideIndex-1].style.opacity = '1';    
  });
});

///////////////////////////////////////////////////////////////////////////
// Добавляем точки под слайдер


///////////////////////////////////////////////////////////////////////////

// Первый слайдер со сменой картинок

//   // Добавляем/убираем 0 к общему числу слайдов
//   if(slides.length < 10) {
//     total.textContent = `0${slides.length}`;
//   } else {
//     total.textContent = slides.length;
//   }

// const activeSlide = n => {
//   // Удаляем у всех слайдов класс шоу
//   slides.forEach(slide => {
//     slide.classList.add('hide');
//     slide.classList.remove('show');
//   });
//   // добавляем текущему слайду класс шоу
//   // добавляем текущему слайду класс шоу
//   slides[n].classList.add('show');
//   slides[n].classList.remove('hide');

//   // Добавляем/убираем 0 к текущему номеру слайда
//   if(slideIndex+1 < 10) {
//     current.textContent = `0${slideIndex+1}`;
//   } else {
//     current.textContent = slideIndex+1;
//   }
// }

// // Устанавливаем изначальное состояние слайдера
// activeSlide(slideIndex);

// // Функции, которые отвечают за логику переключения слайдов
// const nextSlide = () => {
//   // когда доходим до конца всех слайдов, мы должны переключиться на первый:
//   // 1) если индекс последний, делаем активным первый слайд
//   // 2) если не последний, то просто переключаемся на следующий слайд
//   if(slideIndex == slides.length-1) {
//     slideIndex = 0;
//     activeSlide(slideIndex);
//   } else {
//     slideIndex++;
//     activeSlide(slideIndex);
//   }
// }
// const prevSlide = () => {
//   // когда доходим до конца всех слайдов, мы должны переключиться на первый:
//   // 1) если индекс первый, делаем активным последний слайд
//   // 2) если не первый, то просто переключаемся на предыдущий слайд
//   if(slideIndex == 0) {
//     slideIndex = slides.length-1;
//     activeSlide(slideIndex);
//   } else {
//     slideIndex--;
//     activeSlide(slideIndex);
//   }
// }
// // Events
// prev.addEventListener('click', prevSlide);
// next.addEventListener('click', nextSlide);


///////////////////////////////////////////////////////////////////////////
// Калькулятор
const result = document.querySelector('.calculating__result span');

let sex, height, weight, age, ratio;

if(localStorage.getItem('sex')) {
  sex = localStorage.getItem('sex');
} else {
  sex = 'female';
  localStorage.setItem('sex', 'female');
}

if(localStorage.getItem('ratio')) {
  ratio = localStorage.getItem('ratio');
} else {
  ratio = 1.375;
  localStorage.setItem('ratio', 1.375);
}

function initLocalSettings(selector, activeClass) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(elem => {
    elem.classList.remove(activeClass);

    if(elem.getAttribute('id') === localStorage.getItem('sex')) {
      elem.classList.add(activeClass);
    }
    if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
      elem.classList.add(activeClass);
  }
  });
}

initLocalSettings('#gender div', 'calculating__choose-item_active');
initLocalSettings('.calculating__choose_big', 'calculating__choose-item_active');

function calcTotal() {
  if(!sex || !height || !weight || !age || !ratio) {
    result.textContent = '____';
    return;
  }

  if(sex === 'female') {
    result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
  } else {
    result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
  }
}

calcTotal();

function getStaticInformation(selector, activeClass) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(elem => {
    elem.addEventListener('click', (e) => {
      if(e.target.getAttribute('data-ratio')) {
        ratio = +e.target.getAttribute('data-ratio');
        localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
      } else {
        sex = e.target.getAttribute('id');
        localStorage.setItem('sex', e.target.getAttribute('id'));
      }
  
      elements.forEach(elem => {
        elem.classList.remove(activeClass);
      });

      e.target.classList.add(activeClass);
  
      calcTotal();
    });
  });

}

getStaticInformation('#gender div', 'calculating__choose-item_active');
getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

function getDinamicInformation(selector) {
  const input = document.querySelector(selector);

  input.addEventListener('input', () => {

    // Проверка на ввод букв вместо цифр
    if(input.value.match(/\D/g)) {
      input.style.border = '2px solid red'
    } else {
      input.style.border = 'none';
    }


    switch(input.getAttribute('id')) {
      case 'height': 
        height = +input.value;
        break;
      case 'weight':
        weight = +input.value;
        break;
      case 'age': 
        age = +input.value;
        break;
    }
    calcTotal();
  });
}

getDinamicInformation('#height');
getDinamicInformation('#weight');
getDinamicInformation('#age');
}); 