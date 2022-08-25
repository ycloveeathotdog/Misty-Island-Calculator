// let element = document.querySelector('.pro-skill-class');
// element.addEventListener('click', function() {
// //     //匿名函式 aka 沒有名字的函式
// //     // 還可以用箭頭函式
// //     //所以我要監聽click 然後按照<a>的id 把對應的li們塞到ul
// //     //我的那些li要塞在哪
// //     //用switch判斷ㄇ  還是有其他判斷方式 switch應該比較乾淨
//     alert(element.innerHTML);
// });


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

///////////// 點擊物品後新增至右側 /////////////
let productListContainer = document.querySelector('.product-list-container'); //限制判斷點擊範圍
let todoList = document.querySelector('.product-todo > ul.todo-list'); //要放使用者點擊物品的地方
productListContainer.addEventListener('click', function(e) {
    if(e.target.id){    //id不是空字串就進if
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.innerHTML = 
        `
            <p>${e.target.innerText}</p>
            <button class="btn-delete"></button>
        `;
        todoList.appendChild(todoItem);
        let productTodoHint = document.querySelector('.product-todo .hint');
        if(productTodoHint){
            productTodoHint.style.display = 'none';
        }

        //在item的刪除按鈕上綁事件監聽
        const buttonDelete = document.querySelectorAll('.btn-delete');
        const deleteItem = buttonDelete[buttonDelete.length-1];
        deleteItem.addEventListener('click', function (e) {
            deleteItem.parentElement.remove();
        })
    }
})



