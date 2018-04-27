(function() {

  function setupUI() {

    drone = ParrotDrone();
    let  connectButton = document.getElementById('connectBtn'),
      takeOffButton = document.getElementById('takeOffBtn'),
      forwardButton = document.getElementById('forwardBtn'),
      backwardButton = document.getElementById('backwardBtn'),
      leftButton = document.getElementById('leftBtn'),
      rightButton = document.getElementById('rightBtn'),
      hoverButton = document.getElementById('hoverBtn'),
      flipButton = document.getElementById('flipBtn'),
      landButton = document.getElementById('landBtn'),
      emergencyButton = document.getElementById('emergencyBtn');

    connectButton.addEventListener('click', () => {
      connectButton.innerHTML = 'CONNECTING...';
      drone.connect()
        .then(() => {
          connectButton.innerHTML = 'CONNECTED';
        })
        .catch(() => {
          connectButton.innerHTML = 'CONNECT';
        });
    });


  }

  setupUI();

})();
