import React, { useState, useContext,useEffect} from 'react'
import './FoodItems.css'
import {DataTable } from 'primereact/datatable'
import {Column} from 'primereact/column'

function FoodItems(){

  const [produs, setProdus] = useState([])


  async function preluareProduse() {
    let url = 'http://localhost:8080/products';

    let vect=[]
    let response = await fetch(url, {
      method: 'GET',
    })

    vect = await response.json()
    setProdus(vect)
  }

  useEffect(() => {

    preluareProduse();
  
  }, []);


  return(
    <div>
      <h1>Produse disponibile</h1>
      <DataTable value={produs} header='Products'>
            <Column field='userId' header='Id user' />
            <Column field='denumire' header='Denumire' />
            <Column field='data_expirare' header='Data_expirare' />
            <Column field='pret' header='Pret' />
            <Column field='calorii' header='Calorii' />
           
      </DataTable>
    </div>
  )
}

export default FoodItems