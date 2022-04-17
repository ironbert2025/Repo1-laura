import React,{useState,useMemo} from 'react';
import {useTable,useGlobalFilter,useFilters, usePagination} from 'react-table'
import MOCK_DATA from './cias.json'
import CIAS from './cias.json'
import PAYMENTS from './pagostodos2.json'
import {COLUMNS} from './columns.js'
import './table.css'
import { GlobalFilter } from './GlobalFilter'
import {Record,Calcular_Net_Sales,Calcular_EffectiveRate,Calcular_Fees,GetMonthIndex,Year,Get_MonthFees} from './Utility.js'





 const BasicTable=(props)=>{

    const [records,setRecords]=useState([]);

  const columns=useMemo(()=>COLUMNS,[])  //<=arreglar este array con los headers del reporte 1 del 
 // const data=useMemo(()=>MOCK_DATA,[]) //<==Array de elementos de table1 report1

 // const tableInstance=  useTable({
   //    columns,
   //    data
   // })

  





//se procesa la data traida de los files
var registros=[];
for(var i=0;i<CIAS.length;i++)
      {   
        //  console.log(CIAS[i].DBA)  
        var Fees=Math.round(Calcular_Fees(PAYMENTS,CIAS[i].MID)*100)/100;  //<= estos fees de aqui hay que verificar la formula con laura!!!!
        var NetSales=Math.round(Calcular_Net_Sales(PAYMENTS,CIAS[i].MID)*100)/100;
        var EffectiveRate=Math.round(Calcular_EffectiveRate(Fees,NetSales));
        var MonthlySaving= Math.round(NetSales*(CIAS[i].Competitor_Rate-EffectiveRate));
        // console.log("desde el for: " +registros[i])
            registros[i]=new Record(CIAS[i].MID, CIAS[i].DBA, CIAS[i].ContactName, CIAS[i].Email, NetSales, Fees, CIAS[i].Competitor_Rate, EffectiveRate,MonthlySaving);
      }
     // console.log(registros)
     // setRecords(registros)

     
     const datax=useMemo(()=>registros,[])

     const tableInstance=  useTable({
        columns,
        data: datax
     },
     useFilters,
     useGlobalFilter,usePagination)


     const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        state,
        prepareRow,        
        setGlobalFilter
     }=tableInstance

     const{globalFilter,pageIndex}=state
    return(   
        <>  
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>  
           <table  {...getTableProps()}>
               <thead>
                   {headerGroups.map((headerGroup)=>(
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column)=>(
                                    <th {...column.getHeaderProps()}>{column.render('Header')}
                                     <div>{column.canFilter ? column.render('Filter'): null}</div>
                                    </th>
                                ))                               
                            }  
                             <th >Select</th>                        
                        </tr>
                         ))
                   }                 
               </thead>
               <tbody {...getTableBodyProps()}>
                     { page.map((row)=>{
                         prepareRow(row)
                         return(
                            <tr {...row.getRowProps()}>
                                { row.cells.map((cell)=>{
                                    {  
                                      return  <td {... cell.getCellProps()}>{cell.render('Cell')}</td>
                                    }                                  
                                })
                                }  
                                <td> <button onClick={()=>{
               

               //procesar la data para crear un array de object {x:mes, y: valor, Fees: fees del mes, efe}
            
                const DataFiltrada=PAYMENTS.filter(item=>item.MID===row.cells[0].value)
                  console.log(DataFiltrada)

                //en datafiltrada tengo los REgistros asociados  a ese MID
                //sacar los meses unicos para iterar sobre ellos y obtener los valores de las filas del reporte 2
                let meses=[];
                const anio=Year.substring(2,4); //21

                DataFiltrada.forEach((item)=>{

                  //si en Month viene el 21 es del ano en analisis   
                  //se descartan los registros del anio 22              
                  if(item.Month3.includes(anio))
                  {
                      if (!meses.includes(item.Month3)) meses.push(item.Month3)
                  }
                  
                })
                  let Month_NS=0;
               //   let Month_Fees=0;
                  let Month_ER=0;
                  let Month_MS=0;

                  let Month_Fee_corregido=0;

                  const valores=[];
                  //recorremos los meses del anio en analisis
                  meses.forEach((mes)=>{
                     Month_NS=0;
                   //  Month_Fees=0;
                     Month_ER=0;
                     Month_MS=0;

                     Month_Fee_corregido=0;

                     

                       const DataFiltrada_Month=DataFiltrada.filter(item=>item.Month3===mes)

                      DataFiltrada_Month.forEach((item)=>{
                        
                 // let Month_CR=data[item.MID].Competitor_Rate;
                //  console.log(records['496326602885'][0].Competitor_Rate);   

                        Month_NS+=parseFloat(item.NetSales); //este calculo esta ok!!!

                        //este calculo es de otra forma, hacerlo ahora
                       // Month_Fees+= parseFloat(item.Fees)+parseFloat(item.InterchangeFee)+parseFloat(item.ServiceCharges);

                        
                    })

                    //esta fx busca en los pagos del MID para Jan-21 busca los totoales de fee+interchangefee +servicefee del mes proximo en cuestion
                   // console.log('mes:'+mes)
                    Month_Fee_corregido=Get_MonthFees(DataFiltrada,mes,21)

                    Month_Fee_corregido=Math.round(Month_Fee_corregido*100)/100

                   // console.log('mes:'+mes+ "      Fees: "+Month_Fee_corregido)

                   //se crea el record para tabla 2
                  // console.log(mes);
                  Month_NS=Math.round(Month_NS*100)/100
                //  Month_Fees=Math.round(Month_Fees*100)/100
                 //para evitar el infinity en ER y el NaN en MS
                  if(Month_NS===0)
                  {
                   Month_ER=0;
                   Month_MS=0;
                  }else
                   {
                    Month_ER=Math.round(Math.abs(Month_Fee_corregido/Month_NS)*10000)/10000;
                      console.log(row.cells[6].value)
                    Month_MS= Math.round(Month_NS*(parseFloat(row.cells[6].value)/100-Month_ER)*100)/100;
                   }







                   //esto es una manera de crear una funcion, no es una variable que se le asigna el retorno de una arrow fx
                   //por ahorea la de3jo aqui pero hay que sacarlo, ya no tiene sentido, esta una equivalente en el itutility.js
                   const CalculoMonthIndex=(mes)=>{
                   //return 4;  
                   const letters=mes.substring(0,3); 
                   switch(letters)
                   {
                     case "Jan":
                       return 0;
                       case "Feb":
                       return 1;
                       case "Mar":
                       return 2;
                       case "Apr":
                       return 3;
                       case "May":
                        return 4;
                       case "Jun":
                       return 5;
                       case "Jul":
                       return 6;
                       case "Aug":
                       return 7;
                       case "Sep":
                       return 8;
                       case "Oct":
                       return 9;
                       case "Nov":
                       return 10;
                       case "Dec":
                       return 11;
                       
                   }
                   }

                  // console.log("indice: "+ CalculoMonthIndex(mes));
                  // console.log(indice)
                   const Record2={"x": mes, "y": Month_NS, "Fees": Month_Fee_corregido, "Effective_Rate": Month_ER, "Monthly_Saving": Month_MS, "Month_Index": GetMonthIndex(mes)}
                  // console.log(Record2);
                   valores.push(Record2);
                 })
               //aqui se reordena los registros de los meses para que se vean los de enero primero hasta diciembre
                  valores.sort((a,b)=>{
                    return a.Month_Index-b.Month_Index;
                  })
                 //console.log("Valores: "+Array.prototype.values(valores)); 
              
                 
               

              //  console.log("Meses: "+meses); 
                const pepe={
                  "MID": row.cells[0].value, 
                  "DBA":row.cells[1].value,
                  "Competitor_Rate":row.cells[6].value,
                  "Values":valores
                }
                   //"Values":[{"x":"21-01", "y":1000},{"x":"21-02", "y":1500},{"x":"21-03", "y":1250}]
                 //  console.log("rec desde hijo: "+pepe.DBA) 
                props.handler(pepe) 
               
                }}
                                
                                
                                className="btn btn-primary">Select</button></td>                            
                            </tr>
                         )
                     })
                     }     
               </tbody>
           </table>
           <div>
           <br/>
               <span>
                   Page{' '}
                   <strong>
                       {pageIndex+1} of {pageOptions.length}
                   </strong>
                   {' '}
               </span>
               <button   onClick={()=>gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>    
                <button onClick={()=>previousPage()} disabled={!canPreviousPage}>Previous</button>    
                <button onClick={()=>nextPage()} disabled={!canNextPage}>Next</button>   
                <button onClick={()=>gotoPage(pageCount-1)} disabled={!canNextPage}>{'>>'}</button>     
           </div> 
           </>        
    )
}
export default BasicTable;