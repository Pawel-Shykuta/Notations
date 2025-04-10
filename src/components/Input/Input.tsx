import React from "react";
import styles from './inputStyle.module.css'



    export interface InputProps  {
        type :'email' | 'password' | 'name'
        value: string
        placeholder:string
        onChangee:(value:string) => void
    }


    const Input: React.FC<InputProps> = ({type,value,placeholder,onChangee}) =>{
        
        const ChangeInput = (e:React.ChangeEvent<HTMLInputElement>) =>{
            onChangee(e.target.value)
        }
        
        
        return(
            <div className={styles.INputWrapper}>
                <input 
                    className={styles.input}
                    type={type}  
                    value={value}
                    placeholder={placeholder}
                    onChange={ChangeInput}
                />
            </div>
        )
    }


    export default Input





