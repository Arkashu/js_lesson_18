const form = document.getElementById('todoForm');
const STORE_ID = 'todoList';
const TODO_CONTAINER = document.getElementById('todoItems');

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const heading = e.target.querySelector('input[name=title]');
    const content = e.target.querySelector('textarea[name=description]');

    if (!heading.value || !content.value){
       return alert('Заполните все поля ! ! !');
    }

   const template = createTemplate(heading.value, content.value);
    useStorage(heading.value, content.value);
    TODO_CONTAINER.prepend(template)

    e.target.reset();
})
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage[STORE_ID]) return;
    const dataStore = JSON.parse(localStorage[STORE_ID]);
    dataStore.forEach(function (item){
        const template = createTemplate(item.heading, item.content )
        TODO_CONTAINER.prepend(template)
    })


})
function useStorage(heading, content){
   if (localStorage[STORE_ID]){
    const data = JSON.parse(localStorage[STORE_ID])
       data.push({heading, content});
    localStorage.setItem(STORE_ID, JSON.stringify(data))
       return;
   }
   let arr = [{heading, content}];
   localStorage.setItem(STORE_ID, JSON.stringify(arr))

}
function createTemplate(title, taskBody){

    const mainWrp = document.createElement('div');
    mainWrp.className = 'col-4';

    const taskWrap = document.createElement('div');
    taskWrap.className = 'taskWrapper';

    const heading = document.createElement('div');
    heading.className = 'taskHeading'
    heading.innerText = title;

    const description = document.createElement('div');
    description.className = 'taskDescription';
    description.innerText = taskBody;
    

    mainWrp.append(taskWrap);
    taskWrap.append(heading);
    taskWrap.append(description);


    return mainWrp;

}