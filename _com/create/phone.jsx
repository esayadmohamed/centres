'use client';
import styles from './create.module.css';

export default function CreatePhone ({phone, setPhone, errors}) {
    
    return ( 
        <span className={styles.CreateInput}>
            <label htmlFor="phone"> Numero de telephone </label> 
            <input type="text" id="phone" name="phone" placeholder="Numero de telephone" 
            value={phone} 
            onChange={(e)=>setPhone(e.target.value)}
            style={{border: errors?.phone && '1px solid #e74c3c'}}/>
            {errors?.phone && <p className={styles.CreateError}> {errors.phone}</p> }
        </span>
    )
}


