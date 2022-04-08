import { FC, useState } from "react";
import { AiFillGithub, AiFillTwitterCircle } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { BsLinkedin, BsReddit } from "react-icons/bs";
import { FaReact } from "react-icons/fa";
import { SiFirebase, SiTailwindcss, SiTypescript } from "react-icons/si"
import Switch from "react-switch";
import './about.style.css';

const whatEN = <div className="about-p">
   A <p className="italic inline">very</p> primitive clone of the popular social media website <a href="http://reddit.com" target="_blank" rel="noreferrer">reddit<BsReddit className="about-icon"/></a> and my first attempt at a responsive full stack <a href="http://en.wikipedia.org/wiki/Web_application" target="_blank" rel="noreferrer">web application<BiLinkExternal className='about-icon'/></a>! You can create your own account, publish interesting posts, vote on posts and even read what other users think via the comments!
</div>
const whatES = <div className="about-p">
   Un clon <p className="italic inline">muy</p> primitivo del sitio web de redes sociales <a href="http://reddit.com" target="_blank" rel="noreferrer">reddit<BsReddit className="about-icon"/></a> y mi primer intento haciendo una <a href="https://es.wikipedia.org/wiki/Aplicaci%C3%B3n_web" target="_blank" rel="noreferrer">aplicación web<BiLinkExternal className='about-icon'/></a> full stack! Puedes crear tu propia cuenta, publicar sobre temas interesantes, votar  en publicaciones e incluso leer los comentarios de otros usuarios.
</div>

const whyEN = <div className="about-p">
   I mainly wanted to familiarize myself with modern React and its many features, quirks and capabilities. I also had no previous experience creating a social media style application so I thought it’d be a good challenge for a personal project.
</div>
const whyES = <div className="about-p">
   Quería familiarizarme con React moderno y sus muchas características, peculiaridades y capacidades. No tenía experiencia previa desarrollando una aplicación tipo red social y por ello pensé que era un buen reto como proyecto personal.
</div>

const howEN = <div className="about-p">
   Vanilla <a href="https://reactjs.org/" target="_blank" rel="noreferrer">React<FaReact className='about-icon'/></a> + <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">Typescript<SiTypescript className='about-icon'/></a>! I also used (and tested) a few 3rd party libraries like <a href="https://reactrouter.com/" target="_blank" rel="noreferrer">React Router</a>. For styling I used <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">tailwindcss<SiTailwindcss className='about-icon'/></a> and for my database and user authentication provider I went with <a href="https://firebase.google.com/" target="_blank" rel="noreferrer">Firebase<SiFirebase className='about-icon'/></a>. I followed no step by step guides!
</div>
const howES = <div className="about-p">
   Vanilla <a href="https://reactjs.org/" target="_blank" rel="noreferrer">React<FaReact className='about-icon'/></a> + <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">Typescript<SiTypescript className='about-icon'/></a>! También utilice varias librerías de terceros como <a href="https://reactrouter.com/" target="_blank" rel="noreferrer">React Router</a>. Para mis estilos use <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">tailwindcss<SiTailwindcss className='about-icon'/></a> y para mi base de datos y proveedor de autenticación de usuarios utilice <a href="https://firebase.google.com/" target="_blank" rel="noreferrer">Firebase<SiFirebase className='about-icon'/></a>. No seguí ninguna guía paso a paso.
</div>

const whenEN = <div className="about-p">
   I started around December 2021 and worked on it sparingly during my free time until April 2022.
</div>
const whenES = <div className="about-p">
   Comencé alrededor de diciembre 2021 y trabajé en él durante mi tiempo libre hasta ahora, abril 2022.
</div>

const whoEN = <div className="about-p">
   My name is Daniel Montilla, a full-time systems engineering student in Caracas, Venezuela. Looking for a software development job!
</div>
const whoES = <div className="about-p">
   Mi nombre es Daniel Montilla, estudiante de ingeniería de sistemas a tiempo completo en Caracas, Venezuela. Buscando un trabajo de desarrollo de software!</div>

const improvementEN = <div className="text-regular">
   At this point I feel I’ve learned quite a lot and want to move to other projects. The following list contains many improvements that I believe myself capable of doing but have either already done previously or would not contribute significantly to my knowledge: 
</div>
const improvementES = <div className="text-regular">
   A estas alturas siento que he aprendido mucho y quisiera trabajar en otros proyectos. La lista a continuación contiene muchas mejoras que creo ser capaz de hacer pero que ya las he hecho anteriormente o simplemente no aportarían significativamente a mi conocimiento.
</div>

const improvementListEN = [
   <li>comment votes</li>,
   <li>nested comment threads</li>,
   <li>more responsive feed preview cards</li>,
   <li>better loading indicators (skeleton loading)</li>,
   <li>post & comment editing/deleting</li>,
   <li>options menu</li>,
   <li>better user account validation</li>
]
const improvementListES = [
   <li>votos en comentarios</li>,
   <li>threads de comentarios</li>,
   <li>más responsive preview cards para el feed</li>,
   <li>mejores indicadores de carga (skeleton loading)</li>,
   <li>habilidad de editar o eliminar publicación y comentarios</li>,
   <li>menú de configuración</li>,
   <li>mejora validación de cuentas</li>
   
]

const links = [
   <a href="https://github.com/DanielMontilla/simple-forum" target="_blank" rel="noreferrer">code<AiFillGithub className='about-icon'/></a>,
   <a href="https://twitter.com/DanieIMontilla" target="_blank" rel="noreferrer">twitter<AiFillTwitterCircle className='about-icon'/></a>,
   <a href="https://www.linkedin.com/in/daniel-montilla-352457229/" target="_blank" rel="noreferrer">linkedin<BsLinkedin className='about-icon'/></a>
]

const isEn = (lang: 'en' | 'es') => lang === 'en';

const About: FC = () => {
   let [ lang, setLang ] = useState<'en' | 'es'>('en');

   return <div
      className="
         h-screen select-none w-full p-1 max-w-4xl relative
         flex flex-col content-center
         md:px-4
      "
   >
      <div 
         className="
            font-medium text-normal text-center
            text-3xl
            md:text-4xl
            lg:text-5xl
         "
      > {isEn(lang) ? 'Welcome to' : 'Bienvenido a'} </div>
      <div 
         className="
            font-bold text-primary text-center
            text-4xl
            md:text-6xl
            lg:text-7xl
         "
      > simple-forum </div>
      <div 
         className="
            font-medium text-normal text-center inline
            text-xl mt-1
            md:text-2xl md:mt-2
            lg:text-3xl lg:mt-3
         "
      > { isEn(lang) ? 'by' : 'por' } <p className='italic inline'> Daniel Montilla </p> </div>

      <div className="lg:absolute lg:top-2 lg:right-2 self-center my-2">
         <Switch
            checked={lang === 'en'}
            onChange={ () => setLang(lang === 'en' ? 'es' : 'en') }
            checkedIcon={ <div className="about-si">EN</div>}
            uncheckedIcon={ <div className="about-si">ES</div>}
            height={16*2.2} width={16*4.5}
            onColor={'#45A29E'} offColor={'#45A29E'}
         />
      </div>

      <div
         className="
            lg:mt-2
         "
      >
         <div className="about-t"> { isEn(lang) ? 'What is' : '¿Que es'} <p className="inline text-primary font-semibold not-italic">simple-forum</p>?</div>
         { isEn(lang) ? whatEN : whatES }
         <div className="about-t"> { isEn(lang) ? 'Why did I make' : '¿Por qué hice' } <p className="inline text-primary font-semibold not-italic">simple-forum</p>?</div>
         { isEn(lang) ? whyEN : whyES }
         <div className="about-t"> { isEn(lang) ? 'How did I create' : '¿Cómo cree'} <p className="inline text-primary font-semibold not-italic">simple-forum</p>?</div>
         { isEn(lang) ? howEN : howES }
         <div className="about-t"> { isEn(lang) ? 'Who created' : '¿Quien desarrolló'} <p className="inline text-primary font-semibold not-italic">simple-forum</p>?</div>
         { isEn(lang) ? whoEN : whoES }
         <div className="about-t"> { isEn(lang) ? 'When did I make' : '¿Cuando hice'} <p className="inline text-primary font-semibold not-italic">simple-forum</p>?</div>
         { isEn(lang) ? whenEN : whenES }
         <div className="about-t"> { isEn(lang) ? 'Improvements' : 'Mejoras'} </div>
         { isEn(lang) ? improvementEN : improvementES }
         <div className="mb-4">
            {
               isEn(lang) ? 
                  improvementListEN.map((i, j) => <div className="about-li" key={j}>{i}</div>) :
                  improvementListES.map((i, j) => <div className="about-li" key={j}>{i}</div>)
            }
         </div>

         <div className="about-t"> Links </div>
         <div
            className="
               flex gap-6
            "
         >
            {
            links.map((i, j) => <div className="about-l" key={j}>{i}</div>)
         }
         </div>
         <div className=" h-16"/>
      </div>
   </div>
}

// interface AboutSectionProps { title: string, content: string }

// const AboutSection: FC<AboutSectionProps> = () => {

// }

export default About;