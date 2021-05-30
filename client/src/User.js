import React, {useState, useContext,useEffect} from 'react'
import './User.css'
import { UserContext } from './context';
import Select from 'react-select';


import {DataTable } from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import {InputText} from 'primereact/inputtext'
import {FacebookShareButton, FacebookIcon} from "react-share";

import '../node_modules/primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
<link rel="stylesheet" type="text/css" href="path/to/notifications.css"></link>


const SERVER = 'http://localhost:8080'

function User(){
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState([]);
  const[isAddDialogShown, setIsAddDialogShown] = useState(false);
  const[isNewRecord, setIsNewRecord] = useState(true);
  const [produs, setProdus] = React.useState({
    denumire: "",
    data_expirare: "",
    pret:"",
    calorii:""
  })
  

  function handleChange(evt) {
    const value = evt.target.value;
    setProdus({
      ...produs,
      [evt.target.name]: value
    });
  }

  const showAddDialog = () => {
    setIsAddDialogShown(true);
    setIsNewRecord(true);
  }

  const hideAddDialog = () => {
    setIsAddDialogShown(false);
  }

  async function getAll(){
    try{
        const response = await fetch(`${SERVER}/products`)
        const data = await response.json()
        this.data = data
    }catch(err){
        console.warn(err)
    }
}

async function addOne(product, id) {
    try {
      await fetch(`${SERVER}/user/${user}/products`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      })
     preluareProduse()
    } catch (err) {
      console.warn(err)
    }
}

async function saveOne(product, uid, pid) {
    try {
      await fetch(`${SERVER}/user/${uid}/products/${pid}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      })
    preluareProduse()
    } catch (err) {
      console.warn(err)
    }
}

async function deleteOne(uid, pid) {
    try {
      await fetch(`${SERVER}/user/${uid}/products/${pid}`, {
        method: 'delete',
      })
      getAll()
    } catch (err) {
      console.warn(err)
    }
}

  const dilit = (uid,pid) => {
    deleteOne(uid,pid);
  }

  const edit = (rowData) => {
    setIsAddDialogShown(true);
    setIsNewRecord(false);
    setProdus(Object.assign({},rowData));
  }

  const save = () => {
    if(isNewRecord){
      addOne(produs);
    } else {
      saveOne(produs,user,produs.id);
    }
    hideAddDialog();
  }

  
  const tableFooter = (
    <div className='centered'>
      <Button icon='pi pi-plus' className='p-button-rounded p-button-outlined' onClick={showAddDialog} ></Button>
    </div>
  )

  const addDialogFooter = (
    <div className='centered'>
      <Button label='save' icon='pi pi-save' className='p-button-rounded p-button-outlined' onClick={save} ></Button>
    </div>
  )

  const opsTemplate = (rowData) => {
    return (
      <div className='ops'>
        <span className='spaced'>
          <Button icon='pi pi-trash' className='p-button-rounded p-button-outlined p-button-danger' onClick={() => dilit(user,rowData.id)} ></Button>
        </span>
        <span className='spaced'>
          <Button icon='pi pi-pencil' className='p-button-rounded p-button-outlined p-button-info' onClick={() => edit(rowData)} ></Button>
        </span>
      </div>
    )
  }

  //Preferinte
  const [selectedValue, setSelectedValue] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState([]);

  //Preferinte
  const handleChangeValue = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map(x => x.value) : []);
  }

  const handleChangeLabel = (e) => {
    setSelectedLabel(Array.isArray(e) ? e.map(x => x.label) : []);
  }


  const selectData = [{
    label: 'Meat',
    value: 1
  }, {
    label: 'Vegetarian',
    value: 2
  }, {
    label: 'Vegan',
    value: 6
  }, {
    label:'Sweets',
    value: 4
  },
  {
    label:'Fast Food',
    value: 5
  }

]


  const id=user;
  console.log(id);

  async function preluareProduse() {
    //id = user;
    let url = 'http://localhost:8080/user' + `/${id}`+ '/products';

    let vect=[]
    let response = await fetch(url, {
      method: 'GET',
    })

    vect = await response.json()
    setData(vect)
  }

  useEffect(() => {
    preluareProduse();
    prodExp();
   }, [data]);
 
   useEffect(()=>{
     showNotification();
   },[])

  function showPref(){
    console.log(selectedValue);
  }


  async function addPreference() {
    const newPref = {
     denumire:""
    }
    
    selectedValue.forEach(e=>{
      fetch('http://localhost:8080/user/'+`${id}`+'/group/'+`${e}`+'/preferences', {
        method: 'POST',
        body: JSON.stringify(newPref),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    })
  })
    
}

function formatDate(string){
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(string).toLocaleDateString([],options);
}

function toText(){
  var text="";
  data.forEach(e=>text+="Produs "+e.denumire+", "+formatDate(e.data_expirare)+", "+e.pret+", "+e.calorii+"\n")
  return text;
}

var textProd=toText();

var today=new Date();
var produseExpirate=[]

async function prodExp(){
  for(const produse of data) 
  {
    var dataCal=new Date(produse.data_expirare)
     if(today.getTime()>dataCal.getTime())
       produseExpirate.push(produse)
  }
}

function showNotification(){
   produseExpirate.forEach(e=>NotificationManager.warning('Produsul '+e.denumire+' a expirat', 'Warning', 5000))
}
 
return(
  <div>
    <div className='product-editor'>
  
        <div>
          <DataTable value={data} header='Products' footer={tableFooter}>
            <Column field='denumire' header='Denumire' />
            <Column field='data_expirare' header='data_expirare' />
            <Column field='pret' header='Pret' />
            <Column field='calorii' header='Calorii' />
            <Column body={opsTemplate} />
          </DataTable>
          <div>{produseExpirate.map(e=><div key={e.id}>{e.denumire} {e.data_expirare} {e.pret} {e.calorii}</div>)}</div>
          <Dialog   header='Add a product' 
                  visible={isAddDialogShown}
                  className='p-fluid'
                  footer={addDialogFooter}
                  onHide={hideAddDialog}>
            <div className='p-field'>
              <label htmlFor="denumire">Denumire</label>
              <InputText type="text" id="denumire" name="denumire" value={produs.denumire} onChange={handleChange} />
            </div>
            <div className='p-field'>
              <label htmlFor="data_expirare">Data expirare</label>
              <InputText type="date" id="data_expirare" name="data_expirare" value={produs.data_expirare} onChange={handleChange} />
            </div>
            <div className='p-field'>
              <label htmlFor="pret">Pret</label>
              <InputText type="number" id="pret" name="pret" value={produs.pret} onChange={handleChange} />
            </div>
            <div className='p-field'>
              <label htmlFor="calorii">Calorii</label>
              <InputText type="number" id="calorii" name="calorii" value={produs.calorii} onChange={handleChange} />
            </div>
          </Dialog>
        </div>
      </div>
      <FacebookShareButton id="fbBt" url="https://github.com/bigbraintime25/web_bolt" quote={textProd} hashtag="#myproducts">
        <FacebookIcon size={50} />
    </FacebookShareButton>
    <div class="dropDown">
    <Select
      className="dropdown"
      placeholder="Select Preferences"
      value={selectData.filter(obj => selectedValue.includes(obj.value))} // set selected values
      options={selectData} // set list of the data
      onChange={handleChangeLabel,handleChangeValue} // assign onChange function
      isMulti
      isClearable
    />
    </div>

   <button id="submitBt"
      type="submit" 
      className="btn btn-primary"
      onClick={function() { showPref(); addPreference(); }}
    >Submit
   </button>
   <NotificationContainer/>
  </div>
  )
  
}

export default User
