// Переменные
var latitude = document.getElementById('latitude'),
      longitude = document.getElementById('longitude'),
      button = document.getElementById('btn'),
      result = document.getElementById('result');

// выводим результат на экран
function showHeight(msg, err) {
  var text = new String; // переменная для сообщения
  if(err == 0){ // проверяем на ошибки
    text = msg;
    result.style.backgroundColor = "#ff5555"; // применяем стиль в случае ошибки
  }else{
    result.style.backgroundColor = "#fff";
    var meters = Math.round(msg); // округляем метры до ближайшего
    var val = pluralize(meters, 'метр', 'а', 'ов'); // добавляем окончание
    text = "Высота: " + meters + " " + val; // формируем сообщение
  }
  result.innerHTML = text;
}

// добавляем окончание
function pluralize(count, base, ending1, ending2) {
  count = count % 100; // если больше 100
  count = count > 20 ? count % 10 : count; // если больше 20 метров
  // возвращаем слово с окончанием
  return base + ( count == 0 || count > 4 ? ending2 : count > 1 ? ending1 : '' );
}

// вставляем наши координаты в инпут по клику на карту
function setInput(lat, lng) {
  latitude.value = lat; // широта
  longitude.value = lng; // долгота
}
// инициализируем карту
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: 48.45, lng: 35.07},  // Denali.
    mapTypeId: 'terrain'
  });
  var elevator = new google.maps.ElevationService;

  // добавляем обрабочик событий по клику на карту
  map.addListener('click', function(event) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    var coord = {lat,lng};
    setInput(lat, lng); // добавляем наши координаты в инпуты
    displayLocationElevation(coord, elevator);
  });
}
// слушаем событие клик по кнопке
button.addEventListener('click', function (event) {
  // проверка ввода на число
  if( isNaN(latitude.value) || isNaN(longitude.value) || longitude.value == '' || latitude.value == '' ){
    var msg = "введите число", err = 0;
    return showHeight(msg, err); // в случае не число возвращаем ошибку
  }
  var lat = +(latitude.value);
  var lng = +(longitude.value);
  var coord = {lat,lng};
  var elevator = new google.maps.ElevationService;
  displayLocationElevation(coord, elevator);
});

function displayLocationElevation(location, elevator) {
  // инициализируем запрос
  elevator.getElevationForLocations({
    'locations': [location]
  }, function(results, status) {
    if (status === 'OK') {
      // получаем данные
      if (results[0]) {
        // в случае если запрос прошел успешно
        showHeight(results[0].elevation);
      } else {
        var err = 0;
        var msg = 'результат не найден';
        showHeight(msg, err);
      }
    } else {
      var err = 1;
      var msg = 'сбой сервиса из-за: ' + status;
      showHeight(msg, err);
    }
  });
}