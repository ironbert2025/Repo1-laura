import logo from './logo.svg';
import './App.css';
import React, { useState} from 'react'
import  BasicTable  from './components/BasicTable';
import TableReport2 from './components/TableReport2';
import Chart from './components/Chart'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

//variable para componente Line
var optionsInitial = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
    
  },
  scales: {
    y: {
        max: 100
    }
  },    
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

//variable para componente Line
 const dataInitial = {
  labels,
  datasets: [
    {
      label: '',
      data: [23,84,34,250,56,30,78],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
};

//object principal
const ObjectInitial={
  record:[],
  data:dataInitial,
  options: optionsInitial,
  boolR: false,
}


function App() {

  const [report,setReport]=useState(ObjectInitial);

  const handler=(rec)=>{

    const labels3= rec.Values.map((item)=> item.x)
  const data3=rec.Values.map((item)=>item.y)
   
    optionsInitial.scales.y.max=Math.max(...data3)

    const obj={
      record: rec,
      data:{
        labels: labels3,
        datasets: [
          {
            label: '',
            data: data3,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ],
      },
      options: optionsInitial,
      boolR: true
    }
    
    setReport(obj);
  }
  return (
    <div className="App">
     <BasicTable handler={handler}/>

     {report.boolR ? (
             <div className='flex-row'>

               {/* testing for git 
               aqui hay mas codigo de ejemplo
            
               
               
               */}

                {/*console.log("se pinta la table Reporte2 ")*/}
               
               <TableReport2 records={report.record}/>            
              
                   <Line options={report.options} data={report.data}  />
             
               
             </div>
           )  : <Chart/>}
    </div>
  );
}



export default App;
