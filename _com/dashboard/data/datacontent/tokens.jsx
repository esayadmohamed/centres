'use client';
import styles from "../../dash.module.css";
import { useState } from "react";

import Icon from "@/_lib/utils/Icon";

import { RemoveToken } from "@/_lib/dashboard/editdata";

export default function DataTokens({content, title}){

    const [tokens, setTokens]= useState(content || [])
    const [token, setToken]= useState('')
    const [sort, setSort]= useState('all')
    const [ok, setOk]= useState(false)
    const [loading, setLoading]= useState(false)
    const [error, setError] = useState(null)

    function handleSort(value){
        setSort(value)
        setToken('')
        
        if(value === 'all'){
            setTokens(content)
        } else if(value === 'active'){
            const filteredValues = content.filter(item => (item.expiration_time - (Date.now()/1000))/60 >= 0);
            setTokens(filteredValues);  
        } else if(value === 'expired'){
            const filteredValues = content.filter(item => (item.expiration_time - (Date.now()/1000))/60 < 0);
            setTokens(filteredValues);  
        }
    }

    function handleFilter(e){
        const inputValue = e.target.value;
        sort !== 'all' && setSort('all')
        
        setToken(inputValue)
        const filteredValues = content.filter(value =>
            value.email.toLowerCase().includes(inputValue.toLowerCase()) )
    
        console.log(filteredValues);
        
        setTokens(filteredValues);
    }

    async function handleRemove(id){
        setLoading(true); 
        setError('');
        
        const result = await RemoveToken(id)
        setLoading(false);
        // console.log(result);

        if(result?.error){
            setError(result.error)
        }else{
            setTokens(result);
            setOk(false)
            setSort('all')
        }
    }    

    return(
        <div className={styles.DataTokens}>
        
            <h3> {title.name} <span>({tokens.length})</span> </h3>

            <ul className={styles.DataTokensList}>
                <div className={styles.DataTokensSearch}>
                    <div className={styles.DataTokensSearchBar}>
                        <span> <Icon name={'Send'} color={'#424949'}/> </span>
                        <input type="text" placeholder="email" value={token} onChange={handleFilter}/>
                    </div>
                    <div className={styles.DataTokensSearchSort}>
                        <p className={sort === 'all' ? styles.SearchSortActive : styles.SearchSortInactive}
                            onClick={()=> handleSort('all')}>
                            All
                        </p>
                        <p className={sort === 'active' ? styles.SearchSortActive : styles.SearchSortInactive}
                            onClick={()=> handleSort('active')}>
                            Active
                        </p>
                        <p className={sort === 'expired' ? styles.SearchSortActive : styles.SearchSortInactive}
                            onClick={()=> handleSort('expired')}>
                            Expired
                        </p>
                    </div>
                </div>
                <div className={styles.DataTokensHeader}>
                    <p>Email</p> <p>Expiration</p> <p>Status</p> <p>Action</p>
                </div>
                {tokens?.map((item, id)=> 
                    <li key={id}>
                            <div className={styles.TakenData}>
                                <span>{item.email}</span>
                                <span>{item.token}</span>
                            </div>
                            <p > 
                                { ((item.expiration_time - (Date.now()/1000))/60) > 0 ? 
                                    Math.round(((item.expiration_time - (Date.now()/1000))/60)) : 'Expired'} 
                            </p>
                            <p> 
                                <Icon name={item.send === 1 ? 'Check' : 'X'} color={item.send === 1 ? '#28b463' : '#e74c3c'} /> 
                            </p>
                            
                            <div className={styles.DataTokensActions}> 
                                {!ok? 
                                    <p onClick={()=>setOk(true)}> 
                                        <span> <Icon name={'Minus'} color={'#e74c3c'}/> </span>
                                    </p> 
                                    :
                                    !loading ?
                                        <p>
                                        <span onClick={()=>handleRemove(item.id)}> <Icon name={'Minus'} color={'#e74c3c'}/> </span>
                                        <span onClick={()=>setOk(false)}><Icon name={'X'} color={'#2980b9'}/></span>
                                        </p>
                                        :
                                        <div className="spinner"></div>
                                }
                            </div>
                            
                    </li>)
                }

            </ul>
        </div>
    )
}