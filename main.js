let ul=document.querySelector('#list')
const form=document.querySelector('#form')



const addRecipe=(recipe,id)=>{
    
    let time=recipe.created_at.toDate()
    let html=`
      <li data-id="${id}"} > 
      <div><h3 class="text-primary"> ${recipe.author}</h3></div>
      <div> ${recipe.title}</div>
      
       <div style="color:blue; margin-top:5px">${time}</div>
         <button class="btn btn-danger my-2"> delete </button>
      </li>
    `
    
    
    ul.innerHTML+=html 
}

function deleteRecipe(id){
    let recipes=document.querySelectorAll('li')
     recipes.forEach(recipe=>{
         if(recipe.getAttribute('data-id')===id){
             recipe.remove()
         }
     })
}
deleteRecipe()
//UI automatically not refreshed 

// async function main(){
//     let res=await db.collection('recipes').get()
//     let datas=await res.docs 
      
//      datas.forEach(item=>{
//         addRecipe(item.data(),item.id)
        
        
//      })

// }
// main()


db.collection('recipes').onSnapshot((snapshot)=>{
    snapshot.docChanges().forEach(change=>{
        const doc=change.doc 
        
        if(change.type==='added'){
            addRecipe(doc.data(), doc.id)
        }
        else if(change.type==='removed'){
           deleteRecipe(doc.id)
        }
    })
})

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const now=new Date()
    const recipe={
        author:form.author.value,
        title:form.recipe.value,
        created_at:firebase.firestore.Timestamp.fromDate(now)
    }
    db.collection('recipes').add(recipe)
    .then(()=>{
        console.log('added new project')
    })
    .catch(e=>console.log(e))

    form.reset()
})

ul.addEventListener('click',(e)=>{
 if(e.target.tagName=='BUTTON'){
     let id=e.target.parentElement.getAttribute('data-id')
     db.collection('recipes').doc(id).delete()
     .then(()=>{
         console.log('deleted')
     })
     .catch(e=>console.log(e))
 }
})