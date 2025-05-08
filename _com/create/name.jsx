'use client';
import styles from './create.module.css';

export default function CreateName ({errors, name, setName}) {
    
    return ( 
        <span className={styles.CreateInput}>
            <label htmlFor="name"> Nom de centre </label> 
            
            <input type="text" id="name" name="name" placeholder="Nom de centre"  
                value={name} 
                onChange={(e)=>setName(e.target.value)} />
                {/* style={{border: errors?.name && '1px solid #e74c3c'}}/> */}

            {errors?.name && <p className={styles.PageError}> {errors.name}</p> }
        </span>
    )
}


