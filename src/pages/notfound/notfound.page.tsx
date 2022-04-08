import { FC } from "react";
import { useNavigate } from "react-router-dom";
import './notfound.style.css';

const NotFound: FC = () => {
   let nav = useNavigate();

   return <div className="mt-10 flex gap-4 items-center flex-col">
         <p className="text-2xl text-normal font-bold lg:text-3xl text-center">
            404 page not found :(
         </p>
      <div 
         className='bg-primary px-1 py-2 text-normal font-semibold text-lg rounded-md text-center flex place-items-center justify-center w-20 h-10'
         onClick={() => nav('/feed')}
      >
         go back   
      </div>
   </div>
}

export default NotFound;