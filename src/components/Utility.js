
//fx constructora del objeto Record del reporte 1
export function Record(MID, DBA,ContactName,Email,NetSales,Fees,Competitor_Rate,Effective_Rate,Monthly_Saving)
{
	//costructor de objeto clase Record para la tabla
 this.MID=MID;
	this.DBA=DBA;	
	this.ContactName=ContactName;	
	this.Email=Email;	
	this.NetSales=NetSales;	
  this.Fees=Fees;
	this.Competitor_Rate=Competitor_Rate;
  this.Effective_Rate=Effective_Rate;
  this.Monthly_Saving=Monthly_Saving;

	return this;
}

//fx intermedias de calculo
export function Calcular_Net_Sales(registro, mid)
    {     
      let Net_Sales=0;
       for(var i=0;i<registro.length-1;i++)
       {
           if(registro[i].MID===mid)
           {   

            //esto es un parche para descartar los registros del 2022
            const anio=Year.substring(2,4); 
               if(registro[i].Month3.includes(anio))
                {
                Net_Sales+=parseFloat(registro[i].NetSales);
               }  

              // if(mid==='496400037883')
              // {
               // console.log(anio)
                //   console.log(registro[i].Month3)                  
              // }
            }
       }          
       return Net_Sales;
    }

export function Calcular_EffectiveRate(Fees, NetSales)
{    
  var EffectiveRate=0;    
       EffectiveRate=Math.round(Math.abs(10000*Fees/NetSales))/100;  
   return EffectiveRate;
    }

export function Calcular_Fees(registro, mid)
{    
  var Fees=0;
   for(var i=0;i<registro.length-1;i++)
   {
       if(registro[i].MID==mid)
       {          
         Fees+=parseFloat(registro[i].Fees)+parseFloat(registro[i].InterchangeFee)+parseFloat(registro[i].ServiceCharges);
       }
   }       
   return Fees;
    }

    export function  GetMonthIndex(mes)
    {       
        const letters=mes.substring(0,3)
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
    export const Year='2021'
                                                //Jan            21
    export function Get_MonthFees(datafiltrada, mes_analisis, anio){
      let mes=''
      const m=mes_analisis+"-"+anio
 let Fee_value=0;
     

        switch(mes_analisis.substring(0,3))
        {
            case "Jan":
                mes="Feb-"+anio
                break;
                case "Feb":
                mes='Mar-'+anio
                break;
                case "Mar":
                mes='Apr-'+anio
                break;
                case "Apr":
                mes='May-'+anio
                break;
                case "May":
                mes='Jun-'+anio
                break;
                case "Jun":
                mes='Jul-'+anio
                break;
                case "Jul":
                mes='Aug-'+anio
                break;
                case "Aug":
                mes='Sep-'+anio
                break;
                case "Sep":
                mes='Oct-'+anio
                break;
                case "Oct":
                mes='Nov-'+anio
                break;
                case "Nov":
                mes='Dec-'+anio
                break;
                case "Dec":
                mes='Jan-'+(anio+1)  //devuelve Jan-22
                break;
        }
      //  console.log('mes_analisis: '+mes_analisis+ "     mes: "+mes)

        datafiltrada.forEach(element => {
            if(element.Month3===mes){

                //si el dia es mayor a 1 del deposite date
                //se suman los valores
               //  if(element.MID==='496302837885')
             //  {
//para tener en ceunta aqui lo de la fecha a partir del dia 2 ,m hay que cambiar el formato del string den deposite date para mm-dd-yyyy para que la funcion date la acepte como valida
//por ahora un parchesito hasta que se arregle eso
             if(element.DepositDate.includes('/02/'))
            {
                  Fee_value+=parseFloat(element.InterchangeFee)+parseFloat(element.Fees)+parseFloat(element.ServiceCharges)
                 // console.log('deposite date:'+element.DepositDate)
            }

                
                //   console.log(element.Month3+ "    "+element.InterchangeFee+ "  "+element.Fees+"   "+element.ServiceCharges)                  
             //  }
            }
        });


        return  Fee_value*100/100;
    }
    