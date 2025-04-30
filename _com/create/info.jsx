'use client';
import styles from './create.module.css';

export default function CreateInfo ({info, setInfo, errors}) {
    
    return ( 
        <span className={styles.CreateInfo} >
            <label htmlFor="description"> Description </label> 
            <textarea id="description" name="description" placeholder="Description" 
                value={info} 
                onChange={(e)=>setInfo(e.target.value)} 
                style={{border: errors?.info && '1px solid #e74c3c'}}>
                </textarea>
            <div> 
                <p>{500 - info?.length} / 500</p>
            </div> 
            {errors?.info &&  <p className={styles.CreateError}> {errors.info}</p> }
        </span>
    )
}


