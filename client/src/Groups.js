import React, { useState,useEffect} from 'react'
import './Groups.css'

const SERVER = 'http://localhost:8080'

function Groups(){
  const [user, setUser] = useState([])
  const [user1, setUser1] = useState([])
  const [user2, setUser2] = useState([])
  const [user3, setUser3] = useState([])
  const [user4, setUser4] = useState([])
  const [user5, setUser5] = useState([])
  const [preference, setPreference] = useState([])
  const [group, setGroup] = useState([])
 
  async function getAllGroups(){
    try{
        const response = await fetch(`${SERVER}/groups`)
        const grup = await response.json()
        await setGroup(grup)
    }catch(err){
        console.warn(err)
    }
}


async function getAllUsers(){
  try{
      const response = await fetch(`${SERVER}/user`)
      const useri = await response.json()
      await setUser(useri)
  }catch(err){
      console.warn(err)
  }
}

 useEffect(async() => {
    getAllGroups();
    getAllUsers();
    getAllPreferences();
    await getAll();
}, [user]);

async function getAllPreferences()
{
  try{
     const response = await fetch(`${SERVER}/preferences`)
      const preferinte=await response.json()
      await setPreference(preferinte)
  }catch(err)
  {console.warn(err)}
}

 async function getAll(){
  var user1=[], user2=[], user3=[], user4=[], user5=[]

   for(const e of group){
      var x = [] //vector cu id useri
      for(const pref of preference){
        if(pref.groupId===e.id)
        {
           x.push(pref.userId) 
        }
      }
        
    if(x.length!==0)
    {
      if(e.nume_grup==="Meat")
      {
        x.forEach(i=>{user.forEach(u=>{
          if(u.id===i){
            user1.push(u)
          }
        })})
      }
      
      if(e.nume_grup==="Vegetarian")
      {
        x.forEach(i=>{user.forEach(u=>{
          if(u.id===i){
            user2.push(u)
          }
        })})
      }
      
      if(e.nume_grup==="Vegan")
      {
        x.forEach(i=>{user.forEach(u=>{
          if(u.id===i){
            user3.push(u)
          }
        })})
      }
      
      if(e.nume_grup==="Sweets")
      {
        x.forEach(i=>{user.forEach(u=>{
          if(u.id===i){
            user4.push(u)
          }
        })})
      }
      if(e.nume_grup==="Fast Food")
      {
        x.forEach(i=>{user.forEach(u=>{
          if(u.id===i){
            user5.push(u)
          }
        })})
      }

      setUser1(user1);
       setUser2(user2);
       setUser3(user3);
       setUser4(user4);
       setUser5(user5);
    }
    
  }
  
}

return(
  <div style={{backgroundImage: "url(/free-refrigerator-vector.png)",backgroundRepeat:"no-repeat",backgroundPosition:"center"}}>
    <div className="grup" ><span>Meat</span><ul><li>{user1.map(e=><div key={e.id}> {e.nume} </div>)}</li></ul></div>
    <div  className="grup"><span>Vegetarian</span><ul><li> {user2.map(e=><div key={e.id}> {e.nume} </div>)}</li></ul></div>
    <div className="grup"><span>Vegan </span><ul><li>{user3.map(e=><div key={e.id}> {e.nume} </div>)}</li></ul></div>
    <div className="grup"><span>Sweets</span> <ul><li>{user4.map(e=><div key={e.id}> {e.nume} </div>)}</li></ul></div>
    <div className="grup"><span>FastFood</span><ul><li> {user5.map(e=><div key={e.id}> {e.nume} </div>)}</li></ul></div>

  </div>
)

}

export default Groups