import * as THREE from "three";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Image as ImageImpl, Scroll, ScrollControls, useCursor, useProgress, useScroll } from "@react-three/drei";


function Image({ c = new THREE.Color(), ...props }) {

    const ref = useRef();
    const [hovered, hover] = useState(false);

    useCursor(hovered);

    useFrame(() => {
        ref.current.material.color.lerp(c.set(hovered ? 'white' : '#ccc'), hovered ? 0.01 : 0.01);
    })



    return <ImageImpl ref={ref} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} {...props}
        onClick={() => {
            props.link === '/' ? window.open(props.link, "_self") : window.open(props.link, "_blank");
        }} />
}

function Images() {
    const { width, height } = useThree((state) => state.viewport);
    const data = useScroll();
    const group = useRef();
    const isMobile = window.innerWidth < 768;
    useFrame(() => {
        group.current.children[0].material.zoom = 1 + (0.5 - data.range(1, 1 / 3)) / 3;
    })
    return (
        <group ref={group}>
            <Image position={[isMobile ? -1.4 : -2, 0, -0.6]} scale={[isMobile ? 3.5 : 6, isMobile ? height / 1.3 : height, 1]} url="/img/img_headshot.png" link={'/'} />

        </group>
    )
}

const Loader = () => {
    return (
        <div className="loading">
            <img src="/img/logo.png" alt="" />
        </div>
    )
}

export default function AboutMe() {
    const isMobile = window.innerWidth < 768;
    return (
        <div id="root">
            <Canvas gl={{ antialias: true }} dpr={[1.1, 5]}>

                <ScrollControls damping={1.5} pages={isMobile ? 1.2 : 1.3}>
                    <Scroll>
                        <Images />
                    </Scroll>
                    <Scroll html>
                        <p className="txt bold" style={{ position: 'absolute', top: isMobile ? '20vh' : '15vh', left: isMobile ? '8em' : '30em' }}>
                            EXPCTR
                        </p>
                        <p className="txt" style={{ position: 'absolute', top: isMobile ? '32vh' : '30vh', left: isMobile ? '8.1em' : '32em' }}>
                            TOKYO, JP<br />SSW / Producer
                        </p>
                        <ul className="aboutSns" style={{ position: 'absolute', top: isMobile ? '60vh' : '53vh', left: isMobile ? '12em' : '62em' }}>
                            <li>
                                <a href="http://instagram.com/expctr" target="_blank"
                                >Instagram</a
                                >
                            </li>
                            <li>
                                <a href="http://twitter.com/expctr__" target="_blank">X</a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/@EXPCTR" target="_blank"
                                >Youtube</a
                                >
                            </li>
                        </ul>
                    </Scroll>

                </ScrollControls>

            </Canvas>
        </div >
    )
}