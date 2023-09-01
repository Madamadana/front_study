let table = document.getElementsByTagName("table")[0];

/* 表格检索 */
function searchInput() {
  // console.log("searchInput");
  let inputStr = document.getElementById("myInput").value;
  // if (isEmptyStr(inputStr)) return;
  inputStr.replace(/\\/g, "\\\\");
  console.log(inputStr);
  let cells = table.getElementsByTagName("td");
  for (let item of cells) {
    //console.log(item.innerText);
    if (item.innerText.indexOf(inputStr) === -1 || isEmptyStr(inputStr))
      item.style.backgroundColor = "";
    else item.style.backgroundColor = "orange";
  }
}

function searchInputEnd() {
  let key = document.getElementById("myInput").value;
  key.replace(/\\/g, "\\\\");
  console.log("searchInputEnd " + key);
  if (isEmptyStr(key)) return;
  let cells = table.getElementsByTagName("td");
  let results = [];
  for (let item of cells) {
    // console.log(item.innerHTML);
    if (item.innerText.match(key)) {
      results.push(item.innerText);
    }
  }
  alert(
    `${
      results.length == 0
        ? "无匹配结果"
        : "有" + results.length + "条结果" + "\n" + JSON.stringify(results)
    }`
  );
}

function updateType() {
  let type = document.getElementsByName("type")[0].value;
  let typeLine = document
    .getElementsByClassName("section1")[0]
    .getElementsByTagName("h1")[0];
  typeLine.innerHTML = type;
}

let timer;

const myclick = function (event) {
  console.log(`timerId1=${timer}`);
  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log("单击事件");
    alert(event.target.innerHTML);
  }, 300);
  console.log(`timerId2=${timer}`);
};

function mydblclick(cell) {
  console.log(`timerId3=${timer}`);
  clearTimeout(timer);
  //使用contentEditable实现双击单元格，弹出修改框，修改表格内容
  cell.contentEditable = "true";
  cell.removeEventListener("click", myclick); //忽略单击事件

  cell.addEventListener("focus", function () {
    cell.addEventListener("blur", function () {
      cell.contentEditable = "false";
      cell.addEventListener("click", myclick);
    });
  });
  // updateCellStart(cell); //使用input实现双击单元格，弹出修改框，修改表格内容;问题：input在<td>中无法换行并撑开行高
  console.log("双击事件");
}

function onlyMe(event) {
  event.stopPropagation();
}

function isEmptyStr(s) {
  if (s == null || s === "") {
    return true;
  }
  return false;
}

function updateCellStart(cell) {
  /*修改单元格内容*/
  //判断是否是数字，避免连续点击两次，单元格内容变成input标签源码
  if (!isEmptyStr(cell.innerHTML)) {
    cell.innerHTML = `<input type="text" value="${cell.innerHTML}" onblur="updateCellEnd(this,this.parentNode)" onclick="onlyMe(event)"></input>`;
  }
}

function updateCellEnd(input, cell) {
  console.log("onBlur");
  cell.innerHTML = input.value;
}

function initTable(rowNum, colNum) {
  console.log(`init a ${rowNum}*${colNum} table`);
  table.insertRow(0);
  for (let j = 1; j <= colNum; j++) {
    let colHead = document.createElement("th");
    colHead.innerHTML = `column${j}`;
    table.rows[0].appendChild(colHead);
  }
  table.rows[0].appendChild(document.createElement("th"));
  for (let i = 1; i <= rowNum; i++) {
    table.insertRow(i);
    for (let j = 1; j <= colNum; j++) {
      let newCell = table.rows[i].insertCell(-1);
      newCell.innerHTML = `row=${table.rows[i].rowIndex};col=${j}`; //-1表示插入到最后
      newCell.addEventListener("click", myclick);
      /* 必须要包一层function(){}否则会被识别成调用函数而不是绑定回调函数，如果没有参数就可以不要 */
      /* 而且不能写成()=>{}否则this改变了 */
      newCell.addEventListener("dblclick", function () {
        mydblclick(this);
      });
    }

    // delete button
    let delBtn = document.createElement("td");
    delBtn.innerHTML =
      '<td><input type="button" value="x" onclick="deleteRow(this)" /></td>';
    table.rows[i].appendChild(delBtn);
  }
}

function deleteRow(r) {
  let i = r.parentNode.parentNode.rowIndex;
  // let a = confirm("确定删除吗？");
  if (confirm("确定删除吗？")) {
    table.deleteRow(i);
    console.log(`delete row[${i}]`);
    updateRowIdx(i);
  } else alert("撤销删除");
}

function updateRowIdx(startIdx) {
  let newRows = table.rows;
  for (let i = startIdx; i < newRows.length; i++) {
    for (let j = 0; j < 8; j++) {
      let oldText = newRows[i].cells[j].innerHTML;
      newRows[i].cells[j].innerHTML = oldText.replace(`${i + 1}`, i);
    }
  }
}

function addLast() {
  let newRow = table.insertRow();
  for (let j = 1; j <= 8; j++) {
    let newCell = newRow.insertCell(-1);
    newCell.innerHTML = `row=${newRow.rowIndex};col=${j}`; //-1表示插入到最后
    newCell.addEventListener("click", myclick);
    newCell.addEventListener("dblclick", function () {
      mydblclick(this);
    });
  }
  let delBtn = document.createElement("td");
  delBtn.innerHTML =
    '<td><input type="button" value="x" onclick="deleteRow(this)" /></td>';
  newRow.appendChild(delBtn);
}

window.onload = function () {
  // setTimeout(() => {
  //   initTable(5, 8);
  // }, 500);
  initTable(5, 8);
};
