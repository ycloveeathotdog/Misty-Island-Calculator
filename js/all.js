///////////// 清單是否為空 /////////////
function isListEmpty(tag) {
    return tag.innerHTML.trim() == "";
}
///////////// 切換顯示製作物品清單 /////////////
let targetClassId = 'tool'; //預設值tool, 該次點擊取得的ID
let readyToClearId; //前一次點擊取得的ID
let proSkillClass = document.querySelector('.pro-skill-class'); //限制判斷點擊範圍
proSkillClass.addEventListener('click', function(e) {
    if(e.target.id){    //id不是空字串就進if
        readyToClearId = targetClassId;
        targetClassId = e.target.id;

        if(readyToClearId != targetClassId){
            //組成DOM看得懂的東西(?)
            let clearListID = 'product-' + readyToClearId;
            let showListID = 'product-' + targetClassId;
    
            document.getElementById(clearListID).style.display = 'none';
            document.getElementById(showListID).style.display = 'block';
        }
    }
})
// 幫所有預設便條紙加上事件監聽
let todoBtn = document.querySelectorAll('.todo-btn-list .todo-btn');
let todoListCurrent = todoBtn[0];
let todoListPrevious;
let todoListIDCurrent = '#product-todo-1'; 
let todoListIDPrevious;
for(let i=0;i<todoBtn.length;i++){
    todoBtn[i].addEventListener('click', function (e) {
        todoListPrevious = todoListCurrent;
        todoListCurrent = e.target;

        //按鈕變黃
        todoListPrevious.classList.remove('focused');
        todoListCurrent.classList.add('focused');

        //對應便條紙focus
        todoListIDPrevious = `#product-todo-${todoListPrevious.innerHTML}`;
        todoListIDCurrent = `#product-todo-${todoListCurrent.innerHTML}`;
        console.log(`前一次：${todoListIDPrevious} 目前：${todoListIDCurrent}`);
        document.querySelector(todoListIDPrevious).classList.remove('focused');
        document.querySelector(todoListIDCurrent).classList.add('focused');
    })
}
///////////// 點擊物品後新增至右側 /////////////
let productListContainer = document.querySelector('.product-list-container'); //限制判斷點擊範圍
//todoListIDCurrent > ul.todo-list
// let todoList = document.querySelector('.product-todo > ul.todo-list'); //要放使用者點擊物品的地方
//li本體
{/* <li class="todo-item">
    <p>test</p>
    <button class="btn-delete"></button>
</li> */}
productListContainer.addEventListener('click', function(e) {
    let todoList = document.querySelector(`${todoListIDCurrent} > ul.todo-list`);
    if(e.target.id && !isNaN(e.target.id)){    //id不是空字串就進if
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.innerHTML = 
        `
            <p>${e.target.innerText}</p>
            <button class="btn-delete"></button>
        `;
        todoList.appendChild(todoItem);
        let productTodoHint = document.querySelector(`${todoListIDCurrent} > .hint`);
        if(productTodoHint){
            productTodoHint.style.display = 'none';
        }
        //在item的刪除按鈕上綁事件監聽
        const buttonDelete = document.querySelectorAll(`${todoListIDCurrent} .btn-delete`);
        const deleteItem = buttonDelete[buttonDelete.length-1];
        deleteItem.addEventListener('click', function (e) {
            deleteItem.parentElement.remove();
            if(isListEmpty(todoList)){
                productTodoHint.style.display = 'block';
            }
        })
    }
})




