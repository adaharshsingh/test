import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react';

const FONT_WEIGHTS={
    subtitle:{min:100,max:400,default:100},
    title:{min:400,max:900,default:400},
}
const renderText =(text, className,baseWeight =400)=>{
    return [...text].map((char, index) => (
        <span
            key={index}
            className={className}
            style={{fontVariationSettings:`'wght' ${baseWeight}`}}>
            {char === ' ' ? '\u00A0' : char}
            </span>
    )
)}

const setTextHover=(container,type)=>{
    if(!container)return;
    const letters = container.querySelectorAll('span');
    const {min,max,default:base}=FONT_WEIGHTS[type];
    const animatedLetters=(letter, weight ,duration =0.25)=>{
        return gsap.to(letter,{duration,ease:'power2.out',fontVariationSettings:`'wght' ${weight}`})
    }
    const handleMouseMove=(e)=>{
        const{left}=container.getBoundingClientRect();
        const mouseX=e.clientX - left;
        letters.forEach((letter)=>{
            const {left:l, width:w}=letter.getBoundingClientRect();
            const distance=Math.abs(mouseX - (l-left+ w /2));
            const intensity=Math.exp(-(distance**2)/20000)

            animatedLetters(letter, min+(max - min) * intensity)
        })
    }
    const handleMouseLeave=()=>
        letters.forEach((letter)=>
            animatedLetters(letter,base,0.3))

    container.addEventListener('mousemove',handleMouseMove);
    container.addEventListener('mouseleave',handleMouseLeave);
    return ()=> {
        container.removeEventListener('mousemove',handleMouseMove);
        container.removeEventListener('mouseleave',handleMouseLeave);
    }
}

const Welcome = () => {
    
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)
    useGSAP(()=>{
        const titleCleanUp=setTextHover(titleRef.current,'title');
        const subtitleCleanUp =setTextHover(subtitleRef.current,'subtitle');
        return ()=>{
           if(titleCleanUp) titleCleanUp();
           if(subtitleCleanUp) subtitleCleanUp();
        }
    },[])
  return (
    <section id='welcome'>
        <p ref={subtitleRef} style={{fontFamily: 'Georama, sans-serif'}}>
          {renderText("Hey, I'm Adarsh! Welcome to my","text-3xl",100)}
        </p>
        <h1 ref={titleRef} className='mt-7' style={{fontFamily: 'Georama, sans-serif'}}>
          {renderText("MacBook","text-9xl italic",400)}
        </h1>
        <div className='small-screen'>
            <p>For the best experience, please use a larger screen device.</p>
        </div>
        
    </section>
  )
}

export default Welcome