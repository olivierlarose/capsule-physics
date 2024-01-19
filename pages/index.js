import Matter, { Common } from 'matter-js';
import { useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css'

const words = [
  {
    src: "v2/have.png",
    x: 0.2,
    y: 0.1
  },
  {
    src: "v2/a.png",
    x: 0.2,
    y: 0.2
  },
  {
    src: "v2/project.png",
    x: 0.3,
    y: 0.3
  },
  {
    src: "v2/on.png",
    x: 0.4,
    y: 0.4
  },
  {
    src: "v2/your.png",
    x: 0.5,
    y: 0.5
  },
  {
    src: "v2/mind.png",
    x: 0.6,
    y: 0.6
  },
  {
    src: "v2/question_mark.png",
    x: 0.7,
    y: 0.7
  }
]

export default function Home() {

  const container = useRef();
  
  useEffect(() => {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse;

    var engine = Engine.create();
    const width = container.current.getBoundingClientRect().width;
    const height = container.current.getBoundingClientRect().height;
    // create a renderer
    var render = Render.create({
        element: container.current,
        engine: engine,
        options: {
          width,
          height,
          wireframes: false,
          background: "white"
        }
    });
    
    //Add walls
    const wallRight = Bodies.rectangle(width+6, height/2, 10, height, { 
      isStatic: true 
    })
    const wallLeft = Bodies.rectangle(-6, height/2, 10, height, {
        isStatic: true 
    });
    const ground = Bodies.rectangle(width/2, height+6, width, 10, {
        isStatic: true,
    });
    const ceiling = Bodies.rectangle(width/2, -6, width, 10, {
        isStatic: true
    })

    Composite.add(engine.world, [wallRight, wallLeft, ground, ceiling]);

    for(const word of words){
      const { src, x, y } = word;
      const img = new Image();
      img.src = `/medias/${src}`;
      img.onload = () => {
          const imageHeight = img.height;
          const imageWidth = img.width;
          const mass = 1;
          const letter = Bodies.rectangle(width * x, height * y, imageWidth, imageHeight, {
            mass,
            render: {
              sprite: {
                texture: `/medias/${src}`
              }
            }
          })
          Composite.add(engine.world, letter);
      }
    }

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // run the renderer
    Render.run(render);
  
    // create runner
    var runner = Runner.create();
  
    // run the engine
    Runner.run(runner, engine);

    window.addEventListener("mousemove", (e) => {
        const { clientX, clientY } = e;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const gravityX = -0.5 + clientX / width
        const gravityY = -0.5 + clientY / height
        engine.gravity.x = gravityX * 3
        engine.gravity.y = gravityY * 3
    }) 
  }, [])
  
  return (
    <div ref={container} className={styles.container}>
    </div>
  )
}
