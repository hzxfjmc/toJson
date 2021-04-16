var fs = require('fs');
var path1 = require('path');
var readline = require('readline');
// 配置文件顺序
const config = ['AccX','AccY','AccZ','GyroX','GyroY','GyroZ']
//读取文件
var readDirList = fs.readdirSync("./model");
for(let i = 0;i<readDirList.length;i++){
    readLine(readDirList[i])
}

// 读取json文件中的每一行
function readLine(k){
    var arr = new Array();
    read_file(k,function (data) {
        console.log(data);
    });
    
    //定义读取方法
    function read_file(path,callback){
        let dirPwd = `./model/${path}`
        var fRead = fs.createReadStream(dirPwd);
        var objReadline = readline.createInterface({
            input:fRead
        });
        let dirName = path.split('.')[0]
        objReadline.on('line',function (line) {
            arr.push(line);
            
        });
        //监听读取完文件
        objReadline.on('close', ()=>{ 
            hanlderJson(dirName,arr)
        });
       
    }

}

// 调用循环生成json
function hanlderJson(path,list){
    let arr1 = new Array()
    let obj = new Object()
    obj.name = path
    for(let i= 0;i<list.length;i++){
        arr1.push(list[i].split(','))
    }
    for(let item of config){
        obj[item] = []
    }
    let index_ = {}
    let labelList = arr1[0]
    for(let i = 0;i<labelList.length;i++){
        for(let j = 0;j<config.length;j++){
            if(labelList[i] === config[j]){
                index_[config[j]] = i
            }
        }
    }

    for(let j=0;j<arr1.length;j++){
        if(j!=0){
            for(let item of config){
                obj[item].push(arr1[j][index_[item]])
            }
        }
    }
    let content = JSON.stringify(obj)
    let len = arr1.length-1
    if(obj.AccX.length != len&&obj.AccY.length != len&&obj.AccZ.length != len&&obj.GyroX.length != len&&obj.GyroY.length != len&&obj.GyroZ.length != len){
        new Error('出错了!数据不对')
    }
    var file = path1.join(__dirname, `json/${path}.json`); 
    fs.writeFile(file, content, function(err) {
        if (err) {
            return console.log(err);
        }
        arr1 = [];
        obj = {}
        index_={}
        content=''
        console.log('文件创建成功，地址：' + file);
    });
}
