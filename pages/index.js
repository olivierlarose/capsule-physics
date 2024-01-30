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
    const render = useRef();
    const engine = useRef();

    useEffect(() => {
        var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Composite = Matter.Composite,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse;

        engine.current = Engine.create();
        const width = container.current.clientWidth;
        const height = container.current.clientHeight;
        // create a renderer
        render.current = Render.create({
            element: container.current,
            engine: engine.current,
            options: {
            width,
            height,
            wireframes: false,
            background: "white"
            }
        });

        setObjects(width, height);
        
        // add mouse control
        var mouse = Mouse.create(render.current.canvas),
            mouseConstraint = MouseConstraint.create(engine.current, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        Composite.add(engine.current.world, mouseConstraint);

        // keep the mouse in sync with rendering
        render.current.mouse = mouse;

        // run the renderer
        Render.run(render.current);
    
        // create runner
        var runner = Runner.create();
    
        // run the engine
        Runner.run(runner, engine.current);

        window.addEventListener("mousemove", manageMouseMove) 
        window.addEventListener("resize", manageResize)
        return () => {
            window.removeEventListener("mousemove", manageMouseMove)
            window.removeEventListener("resize", manageResize)
        }
    }, [])

    const setObjects = (width, height) => {
        var Bodies = Matter.Bodies,
            Composite = Matter.Composite

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

        Composite.add(engine.current.world, [wallRight, wallLeft, ground, ceiling]);

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
                Composite.add(engine.current.world, letter);
            }
        }
    }

    const manageMouseMove = (e) => {
        const { clientX, clientY } = e;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const gravityX = -0.5 + clientX / width
        const gravityY = -0.5 + clientY / height
        engine.current.gravity.x = gravityX * 3
        engine.current.gravity.y = gravityY * 3
    }

    const manageResize = () => {
        const { clientWidth, clientHeight } = container.current;
        render.current.options.width = clientWidth;
        render.current.options.height = clientHeight;
        render.current.canvas.width = clientWidth;
        render.current.canvas.height = clientHeight;
        Matter.Composite.clear(engine.current.world);
        setObjects(clientWidth, clientHeight);
    }

    return (
        <div ref={container} className={styles.container}>
        </div>
    )
}
