import Matter, { Common } from 'matter-js';
import { useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css'

const words = [
  {
    src: "have.png",
    x: 0.2,
    y: -0.9
  },
  {
    src: "a.png",
    x: 0.2,
    y: -0.8
  },
  {
    src: "project.png",
    x: 0.3,
    y: -0.7
  },
  {
    src: "on.png",
    x: 0.4,
    y: -0.6
  },
  {
    src: "your.png",
    x: 0.5,
    y: -0.5
  },
  {
    src: "mind.png",
    x: 0.6,
    y: -0.4
  },
  {
    src: "question_mark.png",
    x: 0.7,
    y: -0.3
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
        }
    });
    
    //Add walls and ground
    const wallRight = Bodies.rectangle(width+6, height/2, 10, height, { 
      isStatic: true 
    })
    const wallLeft = Bodies.rectangle(-6, height/2, 10, height, {
        isStatic: true 
    });
    const ground = Bodies.rectangle(width/2, height+6, width, 10, {
        isStatic: true,
    });
    Composite.add(engine.world, [wallRight, wallLeft, ground]);

    for(const word of words){
      const { src, x, y } = word;
      const img = new Image();
      img.src = `/medias/${src}`;
      img.onload = () => {
        console.log("load", `/medias/${src}`)
          const imageHeight = img.height;
          const imageWidth = img.width;
          const mass = img.width / 100;
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

    // Composite.add(engine.world, [
    //   Bodies.rectangle(300, 200, 400, 170, { 
    //       chamfer: { radius: [85, 85, 85, 85] },
    //       render: {
    //         sprite: {
    //           texture: '/medias/have.png'
    //         },
    //       }
    //   }),
    // ]);
    
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
  }, [])
  
  return (
    <div ref={container} className={styles.container}>
    </div>
  )
}
