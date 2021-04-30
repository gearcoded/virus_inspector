
params = params || {};



// Crypto messages

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomText(number, random) {
  // var letters = 'ϏϐϑϖϗϘϙϚϛϜϝϞϟϠϡϰϱϴϵ϶ϷϸϻϼϽϾϿἇᾯᾚᾈᾠ𐆂𐅊𐅋𐅌𐅍𐅎𐅏𐅐𐅑𐅒𐅓𐅔𐅕𐅖𐅗𐅘𐅙𐅚𐅛𐅜𐅝𐅞𐅟𐅠𐅡𐅢𐅣𐅤𐅥𐅦𐅧𐅨𐅩𐅪𐅫𐅬𐅭𐅮𐅯𐅰𐅱𐅲𐅳𐅴𐅵𐅶𐅷𐅸𐅹𐅺𐅻𐅼𐅽𐅾𐅿𐆀𐆁𐆃𐆄𐆅𐆆𐆇𐆈𐆉𐆊𐆋𐆌𐆍𐆎𐆠𝈀𝈁𝈂𝈃𝈄𝈅𝈆𝈇𝈈𝈉𝈊𝈋𝈌𝈍𝈎𝈏𝈐𝈑𝈒𝈓𝈔𝈕𝈖𝈗𝈘𝈙𝈚𝈛𝈜𝈝𝈞𝈟𝈠𝈡𝈢𝈣𝈤𝈥𝈦𝈧𝈨𝈩';
  var letters = 'repoakrgeorkghoesrkrgoerger';
  var text = '0x';
  number = number || 64;
  if (random) number = Math.floor(Math.random() * number)
  for (var i = 0; i < number; i++) {
    text += letters[Math.floor(Math.random() * letters.length)];
  }
  return text;
}

AFRAME.registerComponent('text_animation', {

  init: function () {
    
    var color = params.color || getRandomColor();

    this.entities = document.querySelectorAll('a-text');
    for (let i = 0; i < this.entities.length; i++) {
      var el = this.entities[i]
      el.setAttribute('rotation', { x: 0, y: 0, z: 90 });
      el.setAttribute('color', color);
      var new_value = params.letters_text || getRandomText(params.letter_number, params.letters_random)
      console.log(new_value)
      el.setAttribute('value', new_value);
      var position = el.getAttribute('position')
      var new_position = params.letter_position || 100;
      position.x = Math.floor(Math.random() * new_position)
      el.setAttribute('position', position);

      // el.setAttribute('font', "DejaVuSans-msdf.json");
    }



    //console.log("init")
  },

  tick: function () {
    //console.log("tick")
    // Don't call query selector in here, query beforehand.
    for (let i = 0; i < this.entities.length; i++) {
      var el = this.entities[i]

      /*
      el.opacity = el.opacity || 1
      el.setAttribute('opacity', Math.round(Math.random() * 20));
*/

      function random_direction() {
        return !!((Math.abs(+new Date() % 4 * -1) % 2) * -1)
      }

      var direction = el.getAttribute('direction')
      // console.log("direction",direction)
      if (!direction) {
        direction = 1
        if (random_direction()) direction = -1;
      }

      el.setAttribute('direction', direction);

      var value = Math.random() * 10;
      // console.log(value, !(Math.round(value * 100) % 3))
      // if (/*position.y > 10 &&*/ !(Math.round(value * 1000) % 99) /*&& +new Date() % 20*/) direction *= -1;
      // el.setAttribute('direction', direction);
      var speed = el.getAttribute('speed')
      if (!speed) speed = Math.random() / 10 + 0.1;
      el.setAttribute('speed', speed);

      var position = el.getAttribute('position')
      if (Math.abs(position.y) > 30) {
        position.y *= -1;
        if (random_direction()) {
          // direction = 1;
          // position.y = 20;
          // console.log(direction, speed, position.y, )
          // el.setAttribute('direction', direction);
          speed = Math.random() / 10 + 0.1;
          el.setAttribute('speed', speed);
        }
      }
      position.y += speed * direction;

      el.setAttribute('position', position);

      var rotation = el.getAttribute('rotation');
      rotation.y += 1;
      el.setAttribute('rotation', rotation);


      //el.opacity -= 0.1
    }
  }
});




// Physics

var jumpHappens = false;
var fall_down = false;

function jump(){
  if (fall_down) return
  jumpHappens = true;
  setTimeout(function () {
    jumpHappens = false;
    fall_down = true
  }, 300)
  var position = player.getAttribute('position');
  position.y += 0.2;
  // console.log(position.y)
  player.setAttribute('position', position);
}

function stopJumping(){
  jumpHappens = false;
  fall_down = false
}

document.addEventListener('keydown', function (e) {
  var player = document.querySelector('#player')
  console.log(e)

  var key = e.code;
  // alert("Key:'"+e.keyCode+"'")
  // alert("Keys:'"+JSON.stringify(navigator.getGamepads() )+"'")
  if (key == "Space" || e.keyCode == 13) {
    console.log(44)
    jump()
  }
})

document.addEventListener('keyup', function (e) {
  if (e.code == "Space" || e.keyCode == 13) {
    stopJumping()
  }

})



AFRAME.registerComponent('player', {
  init: function () {
    console.log("reg", this.el)
    this.el.addEventListener('physicscollided', function (e) {
      console.log('Player has collided with ', e.detail.body.el);
      e.detail.target.el; // Original entity (playerEl).
      e.detail.body.el; // Other entity, which playerEl touched.
      e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
      e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
    });
    // this.el.addEventListener('keydown', function(e) {
    //   console.log('key ', e);
    // });
    // document.querySelector('#player').addEventListener('keydown', function(e) {
    //   console.log('key ', e);
    // });
  },
  tick: function () {
    var player = document.querySelector('#player')
    var position = player.getAttribute('position');

    if (jumpHappens) {
      position.y += 0.2;

    }

    if (position.y > 1.6 && !jumpHappens) {
      position.y -= 0.35
      // position.y += position.y *3;
      console.log("fall down", position.y)
    }
    if (position.y < 1.6 && !jumpHappens) {
      position.y = 1.6
      // position.y += position.y *3;
    }

    //movement via gamepad
    var direction = new THREE.Vector3();
    this.el.sceneEl.camera.getWorldDirection(direction);
    // console.log(direction, position)

    if (forward) {
      direction.multiplyScalar(forward)
      position.add(direction)
    }
    if (backward) {
      direction.multiplyScalar(backward)
      position.add(direction)
    }
    if (backward) {
      direction.multiplyScalar(backward)
      position.add(direction)
    }
    // position.add(direction)
    // console.log(position.y)
    player.setAttribute('position', position);

  }
})


var gamepadPressed = [];
// gamepad control
function gamepadState(){
  var gamepads = navigator.getGamepads();
  var gamepad = gamepads[0];
  if (gamepad){
    var ga = gamepad.axes.map(function(value){
      return parseInt(value)
    });
    var gb = gamepad.buttons.map(function(value){
      return value.pressed;
    });

    gamepadPressed = [];
    forward = 0;

    ga.forEach(function(value, index){
      if (!!value) {
        // console.log("Axes: ", index)
        // alert("Axes: "+ index)
        gamepadPressed.push("axes" + index);
      }
    })
    gb.forEach(function(value, index){
      if (!!value) {
        // console.log("Button: ", index)
        // alert("Button: "+ index)
        gamepadPressed.push("button" + index);
      }
      controlGamepad ("button" + index,value)

    })

    controlGamepad
  }

  // setTimeout(gamepadState,0)

  window.requestAnimationFrame(gamepadState)
}

function controlGamepad (el,value){
  // console.log(el,value)
    switch (el) {
      case "button0":
      case "button7":
        if (value){
          jump();
        }
        else {
          stopJumping()
        }
        break;
      case "button12":
        if (value) {
          forward = 0.2;
        }
        else {
          forward = 0;
        }
        break;
      case "button13":
        if (value) {
          backward = -0.2;
        }
        else {
          backward = 0;
        }
        break;
      case "button14":
        if (value) {
          left = -0.2;
        }
        else {
          left = 0;
        }
        break;
      case "button15":
        if (value) {
          right = -0.2;
        }
        else {
          right = 0;
        }
        break;


      default:
        // forward = 0
        break;
    }
  // window.requestAnimationFrame(controlGamepad)
}


function simulateKeyPress(code) {
  var evt = document.createEvent("KeyboardEvent");
  evt.initKeyboardEvent("keypress", true, true, window,
                    0, 0, 0, 0,
                    0, "e".charCodeAt(code))
  var body = document.body;
  var canceled = !body.dispatchEvent(evt);
  if(canceled) {
    console.log("canceled");
    // A handler called preventDefault
  } else {
    console.log("ok");
    // None of the handlers called preventDefault
  }
}

var forward = 0;
var backward = 0;
var left = 0;
var right = 0;

// setTimeout(gamepadState,20)
window.requestAnimationFrame(gamepadState)
// window.requestAnimationFrame(controlGamepad)


