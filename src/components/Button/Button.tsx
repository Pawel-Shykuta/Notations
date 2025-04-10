import React from "react";
import styles from './ButtonStyle.module.css'


interface ButtonProps {
    onClick: () => void
    children: React.ReactNode
    type?: 'button' | 'submit'
    disabled?:boolean
}

    const Button: React.FC<ButtonProps> = ({onClick, children, type = "button", disabled}) => {
        return(
            <button 
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`${styles.button} ${disabled ? styles.disabled : ""}`}
            >
                {children}
            </button>
        )
    }


    export default Button
