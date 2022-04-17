import React from 'react'
import './table.css'


const TableReport2=({records})=>{




return(
    <>
  
    <br/>
   <div  >
      <h2>Report #2: Total Annualized by DBA & Month</h2>
   
     <br/>
    <h4>MID:{records.MID}</h4>
    <h4>DBA:{records.DBA}</h4>
    <h4>Competitor_Rate:{records.Competitor_Rate}</h4>
    <br/>
    </div>
   
   {/* aqui va la tabla*/}
   <table >
            <thead>
                <tr>
                    <th >Month</th>
                    <th  >NET SALES($)</th>
                    <th >FEES($)</th>
                    <th >Effective_Rate(%)</th>
                    <th >Monthly_Saving($)</th>                    
                </tr>
            </thead>
            <tbody>
             
             {
             
             records.Values.length > 0 ? (
               
               records.Values.map((rec, index) => (
                  <tr key={index}>
                   <td>{rec.x}</td>                               
                   <td>{rec.y}</td>
                   <td>{rec.Fees}</td>                  
                   <td>{rec.Effective_Rate}</td>
                   <td>{rec.Monthly_Saving}</td>   
           </tr>
         ))
                ) : (
          <tr>
           <td colSpan={5}>No Records</td>
         </tr>
       )}
             
             </tbody>
            
        </table>

     
    </> 
);

           }

export default TableReport2;