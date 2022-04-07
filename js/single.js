const form = document.getElementById('todoForm');
let ID_counter = localStorage.ID_counter ? +localStorage.getItem('ID_counter') : 1;
const STORE_ID = 'todoList';
const TODO_CONTAINER = document.getElementById('todoItems');



//Helper func

function findId(el){
    if (el.getAttribute('data-id')){
        return +el.getAttribute('data-id');
    }
   return  findId(el.parentElement);
}

function deleteParent(element){
    if (element.getAttribute('data-id')){
        return element.parentElement;
    }
    return deleteParent(element.parentElement);
}



function findElement(todoItemsArr,id){
    return todoItemsArr.find(function (singleTodoItem){
        if (singleTodoItem.id === id) return singleTodoItem;
    })
}

//**************Submit************************************
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const heading = e.target.querySelector('input[name=title]');
    const content = e.target.querySelector('textarea[name=description]');

    if (!heading.value || !content.value){
       return alert('Заполните все поля ! ! !');
    }

   const template = createTemplate(heading.value, content.value, ID_counter);
    useStorage(heading.value, content.value);
    TODO_CONTAINER.prepend(template)

    e.target.reset();
})

//*****************Page Download********************************
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage[STORE_ID]) return;
    const dataStore = JSON.parse(localStorage[STORE_ID]);
    dataStore.forEach(function (item){
        const template = createTemplate(item.heading, item.content, item.id, item.status )
        TODO_CONTAINER.prepend(template)
    })


})

//*********************Deleting*******************************

TODO_CONTAINER.addEventListener('click', (e) => {
    if (!e.target.classList.contains('delete-btn')) return;
    const todoItemId = findId(e.target);
    const todoItemsArr = JSON.parse(localStorage[STORE_ID]);
    deleteParent(e.target).remove();

   let updateItems =  todoItemsArr.filter(function (item){
        if (item.id !== todoItemId){
            return item;
        }
    })
    localStorage.setItem(STORE_ID, JSON.stringify(updateItems))


})

//*********************Clear All*************************
form.addEventListener('click', function (e){
    if (!e.target.classList.contains('btn-danger')) return;
    TODO_CONTAINER.innerHTML = '';
    const a = [];
    localStorage.setItem(STORE_ID, JSON.stringify([]));

})

//******************Change status**************************
TODO_CONTAINER.addEventListener('change' ,(e) => {

    const todoItemId = findId(e.target);

    const status = e.target.checked;
    const todoItemsArr = JSON.parse(localStorage[STORE_ID]);

    let currentTodoItems = findElement(todoItemsArr, todoItemId);
    currentTodoItems.status = status;

    localStorage.setItem(STORE_ID, JSON.stringify(todoItemsArr))

})

function useStorage(heading, content, status = false){

    const todoItem = {
        id: ID_counter,
        heading,
        content,
        status
    }
    ++ID_counter;
    localStorage.setItem('ID_counter' ,ID_counter);

   if (localStorage[STORE_ID]){
    const data = JSON.parse(localStorage[STORE_ID])
       data.push(todoItem);

    localStorage.setItem(STORE_ID, JSON.stringify(data))
       return todoItem;
   }
   let arr = [todoItem];
   localStorage.setItem(STORE_ID, JSON.stringify(arr))
    return todoItem;

}
function createTemplate(title, taskBody, id, status = false){

    const mainWrp = document.createElement('div');
    mainWrp.className = 'col-4';

    const taskWrap = document.createElement('div');
    taskWrap.className = 'taskWrapper';
    taskWrap.setAttribute('data-id', id);

    const heading = document.createElement('div');
    heading.className = 'taskHeading'
    heading.innerText = title;

    const description = document.createElement('div');
    description.className = 'taskDescription';
    description.innerText = taskBody;

    const label = document.createElement('label');
    label.innerText = 'Completed ?';

    const checkbox = document.createElement('input');
    checkbox.className = 'form-check-input';
    checkbox.type = 'checkbox';


    if (status){
        checkbox.checked = true;
        checkbox.setAttribute('checked', 'checked');
    }

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-close delete-btn';


    label.prepend(checkbox);


    mainWrp.append(taskWrap);
    taskWrap.append(heading);
    taskWrap.append(description);
    taskWrap.append(closeBtn)
    taskWrap.append(label)


    return mainWrp;

}