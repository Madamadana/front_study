##### 表格 CRUD

**myTable: 封装表格类（Prototype） 进行增删改查**

**demo: 单个函数实现增删改查**

- 5\*8 表格内容是 row=x;col=y
- 末尾添加一行，内容自动填充
- 删除任意一行
- 单击单元格，弹出表格内容；双击单元格，弹出修改框，修改表格内容
  - 想拆分同时监听单击，双击和实际功能（显示信息，修改信息）；
  - planA:像截流和同时监听单击，双击这种应该是公共方法不需要封装起来，但是封装类可以调用公共方法吗？给监听手势的函数加回调！timer，回调，参数(表格内容))是私有的；同时监听单击双击事件的方法是公共的。不可行：timer 只是个形参,也不能把 timer 设为公共变量，每个实例需要自己的定时器但是事件响应需要读写这个定时器
  - planB 是把监听单击，双击也做成类方法
  - 忽略单击事件除了 removeEventListener 再找找其它办法
    - 同时设置 EventListener 和 onClick?哪个优先级比较高？
- 查找表格内容。即表格包含搜索功能，输入文字，程序能够扫描整个表格，告诉用户对应单元格的行和列。
  - style.backgroundColor 高亮
- 封装
  - 封装为闭包函数
  - 封装为一个类
  - 测试在同一个页面中创建两个表格

> 闭包很有用，因为它允许将函数与其所操作的某些数据（环境）关联起来。这显然类似于面向对象编程。在面向对象编程中，对象允许我们将某些数据（对象的属性）与一个或者多个方法相关联。因此，通常你使用只有一个方法的对象的地方，都可以使用闭包。

> 如果在函数内部定义了一个函数，并且这个函数访问了父级函数的变量或参数，那么这个内部函数就会形成一个闭包，因为它需要在父级函数执行完毕后，仍然能够访问到父级函数中的变量或参数。
>
> 闭包可以导致内存泄漏，并影响垃圾回收机制的表现。这是因为闭包可以继续引用从其父级作用域中捕获的变量和对象，即使该函数已经退出。避免内存泄漏的方法是在使用完成引用后取消引用，赋值 null。

##### 使用 15 种不同的 html5 标签

- datalist
- input
- aside
- nav

##### 使用 20 种 css 样式（css3 的 5 种）
