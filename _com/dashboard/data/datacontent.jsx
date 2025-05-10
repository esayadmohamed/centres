'use client';

import DataSelects from "./datacontent/selects";
import DataInputs from "./datacontent/Inputs";
import DataHoods from "./datacontent/hood";


export default function DashContent({content, setContent, title}){
    
    if(['Offers', 'Services', 'Subjects', 'Levels'].includes(title.name))
        return <DataSelects content={content} setContent={setContent} title={title} />

    else if (['Locations'].includes(title.name))
        return <DataInputs content={content} setContent={setContent} title={title} />

    else if (['Suggested Hoods'].includes(title.name))
        return <DataHoods content={content} setContent={setContent} title={title} />

} 







// import styles from "../dash.module.css";
// import { useState } from "react";
// import Icon from "@/lib/utils/Icon";

// import { EditSpecsData, AddSpecsData, RemoveSpecsData } from "@/lib/dashboard/editdata";
// import Loading from "@/app/loading";?

// const [index, setIndex] = useState(null) 
// const [toggle, setToggle] = useState(false) 
// const [add, setAdd] = useState(false) 
// const [ok, setOk] = useState(false) 

// function handleToggle(id){
//     setToggle(!toggle)
//     setIndex(id)
// }

// const [error, setError] = useState(null)
// const [loading, setLoading] = useState(false)
// const [name, setName] = useState('') 
// const [icon, setIcon] = useState('') 

// async function handleSpecs(id){
//     setLoading(true); setError('');

//     const obj = { id: id, name: name, icon: icon}

//     const result = await EditSpecsData(obj, title.table)
//     setLoading(false);
//     if(result?.error){
//         setError(result.error)
//     }else{
//         handleRefresh(title.table);
//         setToggle(false)
//     }
//     setName(''); setIcon('');
// }

// async function AddSpecs(){
//     setLoading(true); setError('');

//     const obj = {name: name, icon: icon}

//     const result = await AddSpecsData(obj, title.table)
//     setLoading(false);
//     if(result?.error){
//         setError(result.error)
//     }else{
//         handleRefresh(title.table);
//         setAdd(false)
//     }

//     setName(''); setIcon('');
// }

// async function RemoveSpecs(id){
//     setLoading(true); setError('');

//     const result = await RemoveSpecsData(id, title.table)
//     setLoading(false);
//     if(result?.error){
//         setError(result.error)
//     }else{
//         handleRefresh(title.table);
//         setToggle(false)
//     }
//     setName(''); setIcon('');
// }

// <div className={styles.DevContent}>
// <h3> {title.name} ({content.length})
//     <span onClick={()=>setAdd(true)}> <Icon name={'CirclePlus'}/> </span>
// </h3>
// <ul>
//     {add &&
//         <li> 
//             {loading? 
//                 <div className={styles.DevContentInfo}>
//                     <div className={styles.loader}></div>
//                 </div>
//                 :
//                 <div className={styles.DevContentActions}>
//                     <span>
//                         <input type="text" placeholder="Icon" onChange={(e)=>setIcon(e.target.value)}/>
//                         <input type="text" placeholder="Value" onChange={(e)=>setName(e.target.value)}/>
//                     </span>
//                     {error && <p className={styles.DevContentError}> {error} </p>}
//                     <div className={styles.DevContentActionsBtn}>
//                         <button onClick={AddSpecs}> <Icon name={'Check'}/> Submit </button>                                
//                         <button onClick={()=>setAdd(false)}> <Icon name={'ChevronUp'}/> Cancel  </button>
//                     </div>
//                 </div>
//             }
//         </li>
//     }
//     {content.map((item, id)=> 
//         <li key={id}> 
//             {toggle && index === id?
//                 loading?
//                     <div className={styles.DevContentInfo}>
//                         <div className={styles.loader}></div>
//                     </div>
//                     :
//                     <div className={styles.DevContentActions}>
//                         <p>
//                             <Icon name={item.icon} /> {item.name}  
//                         </p>
//                         <span>
//                             <input type="text" placeholder="Icon" onChange={(e)=>setIcon(e.target.value)}/>
//                             <input type="text" placeholder="New value" onChange={(e)=>setName(e.target.value)}/>
//                         </span>
//                         {error && <p className={styles.DevContentError}> {error} </p>}
//                         <div className={styles.DevContentActionsBtn}>
//                             {!ok? <>
//                                 <button onClick={()=>handleSpecs(item.id)}> <Icon name={'Check'}/> Submit </button>
//                                 <button onClick={()=>setOk(true)}> <Icon name={'X'}/> Remove </button>
//                                 <button onClick={()=>setToggle(false)}> <Icon name={'ChevronUp'}/> Cancel </button>
//                             </> :
//                             <>
//                                 <button onClick={()=>RemoveSpecs(item.id)}> <Icon name={'X'}/> Yes, Remove </button>
//                                 <button onClick={()=>{setToggle(false); setOk(false)}}> <Icon name={'ChevronUp'}/> No, Cancel </button>
//                             </> }
//                         </div>
//                     </div>
//                 :
//                 <div className={styles.DevContentInfo}  onClick={()=>handleToggle(id)}>
//                         <Icon name={item.icon} /> {item.name}  
//                 </div>
//             }
//         </li>
//     )}
// </ul>
// </div>