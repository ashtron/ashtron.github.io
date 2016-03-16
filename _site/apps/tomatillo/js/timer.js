angular.module('tomatillo', [])
  .controller('timerCtrl', function timerCtrl($scope) {
    var audio = new Audio('sounds/alert.mp3');

    $scope.popUp = true;
    $scope.sound = false;
    $scope.time = 0;
    $scope.formattedTime = '00:00'
    $scope.running = false;
    $scope.lengths = {
      'session':25, 'shortBreak':5, 'longBreak':15
    };

    $scope.start = function() {
      $scope.running = true;
      $scope.formattedTime = $scope.formatTime($scope.time);

      $scope.interval = setInterval(function() {
        $scope.time--;
        $scope.formattedTime = $scope.formatTime($scope.time);
        $scope.$apply();

        if ($scope.time <= 0) {
          $scope.pause($scope.interval);
          $scope.alert();
        }
      }, 1000);
    };

    $scope.pause = function(interval) {
      clearInterval($scope.interval);
      $scope.running = false;
    };

    $scope.reset = function() {
      $scope.pause();
      $scope.time = 0;
      $scope.formattedTime = '00:00';
    };

    $scope.alert = function() {
      if ($scope.sound) {
        audio.play();
      }

      if ($scope.popUp) {
        alert('Time\'s up!');
      }
    };

    $scope.work = function() {
      if ($scope.running) {
        $scope.reset();
      }

      $scope.time = $scope.lengths['session'] * 60;
      $scope.start();
    };

    $scope.shortBreak = function() {
      if ($scope.running) {
        $scope.reset();
      }

      $scope.time = $scope.lengths['shortBreak'] * 60;
      $scope.start();
    };

    $scope.longBreak = function() {
      if ($scope.running) {
        $scope.reset();
      }

      $scope.time = $scope.lengths['longBreak'] * 60;
      $scope.start();
    };

    $scope.formatTime = function(time) {
      var hours = Math.floor(time / 60);
      if (hours < 10) { hours = "0" + hours }

      var seconds = time % 60
      if (seconds < 10) { seconds = "0" + seconds }

      return hours + ":" + seconds;
    };
  });
