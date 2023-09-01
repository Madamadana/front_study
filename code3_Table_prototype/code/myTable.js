//增加表格类方法：修改单元格内容
//新添加的行也需要绑定事件监听函数
function Table(rows, cols, name) {
  this.rowNum = rows;
  this.colNum = cols;
  this.table = document.getElementById(name);
  this.timer;
  this.preventClick = false;
}

function isEmptyStr(s) {
  if (s == null || s === "") {
    return true;
  }
  return false;
}

Table.prototype.onClick = function (event) {
  clearTimeout(this.timer);
  this.timer = setTimeout(() => {
    console.log("单击事件");
    // fun(target);
    this.showInfo(event.target);
    // alert(event.target.innerHTML);
  }, 300);
};

Table.prototype.onDBclick = function (target, fun) {
  clearTimeout(this.timer);
  console.log("双击事件");
  fun(target);
};

Table.prototype.initTable = function () {
  console.log(`init a ${this.rowNum}*${this.colNum} table`);
  this.table.insertRow(0);
  for (let j = 1; j <= this.colNum; j++) {
    let colHead = document.createElement("th");
    colHead.innerHTML = `column${j}`;
    this.table.rows[0].appendChild(colHead);
  }
  this.table.rows[0].appendChild(document.createElement("th"));
  // delete button
  let delBtn = document.createElement("td");
  delBtn.innerHTML = "<td>删除</td>";

  let that = this;
  for (let i = 1; i <= this.rowNum; i++) {
    this.table.insertRow(i);
    for (let j = 1; j <= this.colNum; j++) {
      let newCell = this.table.rows[i].insertCell(-1);
      newCell.innerHTML = `row=${this.table.rows[i].rowIndex};col=${j}`;
      // newCell.addEventListener("click", function () {
      //   that.onClick(newCell, that.showInfo);
      // });
      newCell.addEventListener("click", that.onClick.bind(that));
      newCell.addEventListener("dblclick", function () {
        that.onDBclick(newCell, that.updateCell.bind(that));
      });
    }
    let btn = delBtn.cloneNode(true);
    this.table.rows[i].appendChild(btn);
    btn.addEventListener("click", function () {
      that.delRow.call(that, btn.parentNode); //确定delRow函数中this的指向
    });
  }
  //增加按钮与<table>同级
  // <button onclick="addLast()" style="width: fit-content;margin: 1em;">末尾添加一行，内容自动填充</button>
  let addBtnHtml = `<button style="width: fit-content;margin: 1em;">末尾添加一行，内容自动填充</button>`;
  this.table.insertAdjacentHTML("afterend", addBtnHtml);
  this.table.nextElementSibling.addEventListener(
    "click",
    this.addLast.bind(this)
  );

  //增加搜索框
  // <caption>
  //         <h3>custom table</h3>
  //         <input type="text" id="myInput" onkeyup="searchInput()" onchange="searchInputEnd()"  placeholder="搜索...">
  //       </caption>
  let searchBox = document.createElement("caption");
  let tableName = document.createElement("h3");
  tableName.textContent = "custom table";
  searchBox.appendChild(tableName);
  let inputBox = document.createElement("input");
  inputBox.setAttribute("type", "text");
  inputBox.setAttribute("id", `${this.table.id}Input`);
  inputBox.setAttribute("placeholder", "搜索...");
  inputBox.addEventListener("keyup", this.searchInput.bind(this));
  inputBox.addEventListener("change", this.searchInputEnd.bind(this));
  searchBox.appendChild(inputBox);
  this.table.insertAdjacentElement("afterbegin", searchBox);
};

//改方法
//监听单击事件+显示表格内容
Table.prototype.showInfo = function (cell) {
  alert(cell.innerHTML);
};

Table.prototype.updateCell = function (cell) {
  //使用contentEditable实现双击单元格，弹出修改框，修改表格内容
  // console.log(`[updateCell]test this ${this.colNum}`);
  //暴力忽略单击事件:使用.cloneNode（）方法，将不会传递通过.addEventListener（）连接的监听函数
  let newCell = cell.cloneNode(true);
  newCell.contentEditable = "true";
  cell.parentNode.replaceChild(newCell, cell);
  let that = this;
  newCell.addEventListener("focus", function () {
    newCell.addEventListener("blur", function () {
      newCell.contentEditable = "false";
      newCell.addEventListener("click", that.onClick.bind(that));
      newCell.addEventListener("dblclick", function () {
        that.onDBclick(newCell, that.updateCell.bind(that));
      });
    });
  });
};

//增方法
Table.prototype.addLast = function () {
  let newRow = this.table.insertRow();
  for (let j = 1; j <= this.colNum; j++) {
    let newCell = newRow.insertCell(-1);
    newCell.innerHTML = `row=${newRow.rowIndex};col=${j}`; //-1表示插入到最后
    newCell.addEventListener("click", this.onClick.bind(this));
    let that = this;
    newCell.addEventListener("dblclick", function () {
      that.onDBclick(newCell, that.updateCell.bind(that));
    });
  }
  let delBtn = document.createElement("td");
  delBtn.innerHTML = "<td>删除</td>";
  let that = this;
  delBtn.onclick = () => {
    that.delRow(newRow);
  };
  newRow.appendChild(delBtn);
};

//删方法
Table.prototype.delRow = function (row) {
  let i = row.rowIndex; //动态变化
  console.log(`delete row[${i}]`);
  if (confirm("确定删除吗？")) {
    this.table.deleteRow(i);
    this.updateRowIdx(i);
  } else alert("撤销删除");
};
Table.prototype.updateRowIdx = function (startIdx) {
  let newRows = this.table.rows;
  for (let i = startIdx; i < newRows.length; i++) {
    for (let j = 0; j < this.colNum; j++) {
      let oldText = newRows[i].cells[j].innerHTML;
      newRows[i].cells[j].innerHTML = oldText.replace(`${i + 1}`, i);
    }
  }
};

/* 表格检索 */
Table.prototype.searchInput = function () {
  let inputStr = document.getElementById(`${this.table.id}Input`).value;
  inputStr.replace(/\\/g, "\\\\");
  let cells = this.table.getElementsByTagName("td");
  for (let item of cells) {
    if (item.innerText.indexOf(inputStr) === -1 || isEmptyStr(inputStr))
      item.style.backgroundColor = "";
    else item.style.backgroundColor = "orange";
  }
};

Table.prototype.searchInputEnd = function () {
  let key = document.getElementById(`${this.table.id}Input`).value;
  key.replace(/\\/g, "\\\\");
  console.log("searchInputEnd " + key);
  if (isEmptyStr(key)) return;
  let cells = this.table.getElementsByTagName("td");
  let results = [];
  for (let item of cells) {
    if (item.innerText.match(key)) {
      results.push(
        `[第${item.parentNode.rowIndex + 1}行，第${item.cellIndex + 1}列]${
          item.innerText
        }`
      );
    }
  }
  alert(
    `${
      results.length == 0
        ? "无匹配结果"
        : "有" + results.length + "条结果" + "\n" + results.join("\n")
    }`
  );
};

window.onload = function () {
  new Table(5, 8, "table1").initTable();
  new Table(3, 3, "table2").initTable();
};
