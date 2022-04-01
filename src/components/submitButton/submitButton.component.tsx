import { FC } from 'react';
import { IconType } from 'react-icons';
import { CgSpinner } from 'react-icons/cg';
import './submitButton.style.css';

interface ButtonProps {
   label: string
   Icon: IconType
   extra?: string
   load?: boolean
   callback?: () => void
}

const SubmitButton: FC<ButtonProps> = ({
      label = "submit",
      Icon,
      extra = '',
      load = false,
      callback = () => {console.log(`Clicked Submit Button!`)}
   }) => {
   return <div 
      onClick={callback}
      className={`submit-btn-ctn ${extra}`}
   >
      <div className="submit-btn-label"> {label} </div>
      <div className="submit-btn-icon-ctn"> 
         {
            load ? <CgSpinner className="submit-btn-icon-loading"/> :
            <Icon className="submit-btn-icon-not-loading"/>
         }
      </div>
   </div>
}

export default SubmitButton;