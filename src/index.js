import Matter, { Body } from 'matter-js';
import foo from "./img/*.jpg"

console.log(foo);

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;


// create an engine
var engine = Engine.create(),
  world = engine.world;


// create a renderer
var render = Render.create({
    element: document.body,
    canvas: document.getElementById('canvas'),
    engine: engine,
    options: {
      width: 800,
      height: 600,
      showAngleIndicator: true,
      wireframes: false
    }

});

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// create two boxes and a ground
var cieling = Bodies.rectangle(400, 5, 810, 60, { isStatic: true, render: { fillStyle: '#060a19' }});
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, render: { fillStyle: '#060a19' }});
var wallL = Bodies.rectangle(800, 175, 60, 810, { isStatic: true });
var wallR = Bodies.rectangle(0, 175, 60, -810, { isStatic: true });

var groundOptions = {density: 0.004, render: { fillStyle: '#060a19' }}
var ground2 = Bodies.rectangle(610, 250, 200, 20, groundOptions);
var anchor2 = {x : 610, y: 250};
var elastic2 = Constraint.create({ 
  pointA: anchor2, 
  bodyB: ground2, 
  stiffness: 0.2
});

const img = new Image
img.onload = () => {
  _img.src = foo
}
let imageDoc = document.createElement('img');
imageDoc.id = 'player'
imageDoc.src = foo.head

document.querySelector('body').append(imageDoc)
console.log(imageDoc)
console.log(document.querySelector('body'))


var playerOptions = {density: 0.004, render: {
  fillStyle: 'red'
}},
player = Bodies.polygon(170, 450, 8, 20, playerOptions),
anchor = {x : player.position.x, y: player.position.y},
elastic = Constraint.create({ 
  pointA: anchor, 
  bodyB: player, 
  stiffness: 0.05
});

var lumber = Bodies.polygon(80, 80, 30, 30, {isStatic: false, render: {fillStyle: '#FFCC08'}});


var pyramid = Composites.pyramid(500, 300, 9, 10, 0, 0, function(x, y) {
  return Bodies.rectangle(x, y, 25, 40);
});


// add all of the bodies to the world
Composite.add(engine.world, [ pyramid, ground, ground2, player, elastic, elastic2, wallL, wallR, cieling, lumber]);


var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: true
      }
    }
  })

  var canvas = document.getElementById('canvas')
  console.log(canvas);
  console.log(pyramid)
  //var center = {x: canvas.width / 2, y: canvas.height / 2}

const normalize = (num, min, max) => {
  // convert to 0 - 1
  return ((num - min) / (max - min)) * (1 - -1) + -1
}

var mousePos = {x: 0, y: 0}
canvas.addEventListener('mousemove', e => {
 //var recalculated = {x: e.offsetX - center.x * 1, y: e.offsetY - center.y * 1}
 var normal = {x: normalize(e.offsetX, 800, 0), y: normalize(e.offsetY, 600, 0)}
 // 300, 400
 
 engine.gravity = normal

})
Matter.Events.on(mouseConstraint, 'mousedown', function (event) {
  //For Matter.Query.point pass "array of bodies" and "mouse position"
  var found = Matter.Query.point(world.bodies, event.mouse.position);
  if (found.length > 0 && found[0].id === 7) {
    document.getElementById('player').classList.add('drag');
  }
 //Your custom code here
 console.log(found); //returns a shape corrisponding to the mouse position

});

Matter.Events.on(mouseConstraint, 'mouseup', function (event) {
  //For Matter.Query.point pass "array of bodies" and "mouse position"
  document.getElementById('player').classList.remove('drag');
});


var score = 0

Events.on(engine, 'collisionEnd', function() {
  engine.pairs.list.filter(obj => {
    if (obj.bodyA.id === 7) {
      if (obj.bodyB === lumber) {
        Matter.Composite.remove(world, lumber)
        var prevPos = lumber.position
        
        if (document.getElementById('goal') == undefined) {
          let goal = document.createElement('div');
          goal.id = 'goal'
          document.body.append(goal);

          goal.style.transform = "translate(" + (prevPos.x - 30) + "px, " + (prevPos.y - 30) + "px)";
        }

        window.setTimeout(() => {
          goal.remove();
        }, 700)

        lumber = Bodies.polygon( Math.random() * (700 - 100) + 100, Math.random() * (500 - 100) + 100, 30, 30, {isStatic: true, render: {fillStyle: '#FFCC08'}});
    
       
        Matter.Composite.add(world, lumber)
        console.log(lumber)
        score = score + 1;
        document.getElementById('score').innerText = score;
       
      }
    }
  })
  if (player.speed < .2 && Matter.Composite.get(world, 8, 'constraint') === null) {
    // console.log(elastic)
    // console.log(player)
    
   elastic.pointA = {x: player.position.x, y: player.position.y}
   elastic.bodyB = player;
   Matter.Composite.add(world, elastic, true);
  }
})

lumber.ignoreGravity = true;

Events.on(engine, 'afterUpdate', function() {
    engine.gravity = mousePos;


    if (mouseConstraint.mouse.button === -1 && player.speed > 3) {
      //player = Bodies.polygon(170, 450, 7, 20, playerOptions);
      
      Matter.Composite.remove(world, elastic, true);
    }

    let pos = player.position;
    let angle = player.angle;
    let degrees = angle * (180 / Math.PI);

imageDoc.style.transform = "translate(" + (pos.x - 30) + "px, " + (pos.y - 30) + "px) rotate(" + degrees + "deg)";


  let coin = document.getElementById('lumber');
    let posCoin = lumber.position;
    let angleCoin = lumber.angle;
    let degreesCoin = angleCoin * (180 / Math.PI);

  coin.style.transform = "translate(" + (posCoin.x + 30) + "px, " + (posCoin.y + 3) + "px) rotate(" + degreesCoin + "deg)";

});



  Composite.add(world, mouseConstraint)

  render.mouse = mouse;

  Render.lookAt(render, {
    min: {x: 0, y: 0},
    max: {x: 800, y: 600}
  })

  return {
    engine: engine,
    runner: runner,
    render: render.canvas,
    stop: function() {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    }
  }