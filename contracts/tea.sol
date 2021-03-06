pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
contract Tea {
    mapping(string =>Product) productIdInstores;
    mapping(string =>Plant) plants;
    mapping(string =>Process[]) processs;
    mapping(string =>Storage) storages;
    mapping(string =>Check[]) checks;
    struct Product{
        string id;               //id
        string name;             //茶名
        string typeId;           //类型id
        string batch;            //批次
        string grade;            //等级
        string period;           //保质期
        string store;            //存储条件
        string[] img;            //图片数组
        string qr;               //二维码
        string produce;          //所属产品
        bool processFinish;      //加工阶段是否完成
        bool checkFinish;        //检测阶段是否完成
    }

     struct Plant{
        string place;            //产地
        string planter;         //生产者负责人
        string[] img;            //图片数组
        bool finish;             //是否完成
    }
    mapping(string =>Pesticide[]) pesticides;
    struct Pesticide{
        string name;             //农药名
        uint date;               //施药时间
    }
    struct Process{
        string method;           //加工方法
        uint startDate;          //开始时间
        uint endDate;            //结束时间
        string processer;        //加工者负责人
        string[] img;            //图片数组
        bool finish;             //是否完成
    }
     struct Storage{
        string place;            //存储地点
        uint startDate;          //入库时间
        uint endDate;            //出库时间
        string storageer;        //仓储负责人
        string[] img;            //图片数组
        bool finish;             //是否完成
    }
     struct Check{
        string typeId;           //检测类型
        uint date;               //检测时间
        string result;           //检测结果
        string info;             //检测详情
        string checker;          //检测负责人
        bool finish;             //是否完成
    }
    //获取茶叶基本信息
    function  getProduct(string memory _id ) public view  returns (string memory id,string memory name,string memory typeId,
    string memory batch,string memory grade, string memory period, string memory store, string[] memory img,
    string memory qr,string memory produce,bool processFinish,bool checkFinish){
        Product memory product = productIdInstores[_id];
        id = product.id;
        name = product.name;
        typeId = product.typeId;
        batch = product.batch;
        grade = product.grade;
        period = product.period;
        store = product.store;
        img = product.img;
        qr = product.qr;
        produce = product.produce;
        processFinish = product.processFinish;
        checkFinish = product.checkFinish;
        return(id,name,typeId,batch,grade,period,store,img,qr,produce,processFinish,checkFinish);
    }
    //设置茶叶基本信息
    function  setProduct(string memory id,string memory name,string memory typeId,string memory batch,string memory produce) public{
       Product memory product = Product({
           id:id,
           name:name,
           typeId:typeId,
           batch:batch,
           grade:"",
           period:"",
           store:"",
           img:new string[](0),
           qr:"",
           produce:produce,
           processFinish:false,
           checkFinish:false
       });
       productIdInstores[id] = product;
    }
    //设置茶叶高级信息
    function  setProductSenior(string memory _id,string memory grade, string memory period, string memory store, string[] memory img,
        string memory qr) public{
        Product memory product = productIdInstores[_id];
        product.grade = grade;
        product.period = period;
        product.store = store;
        product.img = img;
        product.qr = qr;
        productIdInstores[_id] = product;
    }
    //茶叶完成加工阶段
    function  setProductProcess(string memory _id,bool processFinish) public{
        Product memory product = productIdInstores[_id];
        product.processFinish = processFinish;
        productIdInstores[_id] = product;
    }
    //茶叶完成检测阶段
    function  setProductCheck(string memory _id,bool checkFinish) public{
        Product memory product = productIdInstores[_id];
        product.checkFinish = checkFinish;
        productIdInstores[_id] = product;
    }
    //获取种植阶段基本信息
    function  getPlant(string memory _id ) public view  returns (string memory place,string memory planter,
    string[] memory img,bool finish){
        Plant memory plant = plants[_id];
        place = plant.place;
        planter = plant.planter;
        img = plant.img;
        finish = plant.finish;
        return(place,planter,img,finish);
    }
    //设置种植阶段基本信息
    function  setPlant(string memory id,string memory place,string memory planter, string[] memory img,bool finish) public{
       Plant memory plant = Plant({
           place:place,
           planter:planter,
           img:img,
           finish:finish
       });
       plants[id] = plant;
    }
    //获取施药信息
    function  getPesticide(string memory _id ) public view  returns (string[] memory name,uint[] memory date){
        Pesticide[] memory pesticide = pesticides[_id];
        name = new string[](pesticide.length);
        date = new uint[](pesticide.length);
        for(uint i = 0;i<pesticide.length;i++){
            name[i] = pesticide[i].name;
            date[i] = pesticide[i].date;
        }
        return(name,date);
    }
    //设置施药信息
    function  setPesticide(string memory id,string memory name,uint date) public{
       Pesticide memory pesticide = Pesticide({
           name:name,
           date:date
       });
       pesticides[id].push(pesticide);
    }
     //获取加工阶段基本信息
    function  getProcess(string memory _id ) public view  returns (string[] memory method,uint[] memory startDate,
     uint[] memory endDate,string[] memory processer,uint[] memory num,string[] memory img,bool[] memory finish){
        Process[] memory process = processs[_id];
        uint z = 0;
        method = new string[](process.length);
        startDate = new uint[](process.length);
        endDate = new uint[](process.length);
        processer = new string[](process.length);
        finish = new bool[](process.length);
        num = new uint[](process.length);
         for(uint i = 0;i<process.length;i++){
            method[i] = process[i].method;
            startDate[i] = process[i].startDate;
            endDate[i] = process[i].endDate;
            processer[i] = process[i].processer;
            finish[i] = process[i].finish;
            num[i] = process[i].img.length;
            z += process[i].img.length;
        }
        img = new string[](z);
        z = 0;
        for(uint i = 0;i<process.length;i++){
            for(uint j = 0; j<process[i].img.length;j++){
                img[z++] = process[i].img[j];
            }
         }
        return(method,startDate,endDate,processer,num,img,finish);
    }
    //设置加工阶段基本信息
    function  setProcess(string memory id,string memory method,uint startDate, uint endDate,
    string memory processer,string[] memory img,bool finish) public{
       Process memory process = Process({
           method:method,
           startDate:startDate,
           endDate:endDate,
           processer:processer,
           img:img,
           finish:finish
       });
       processs[id].push(process);
    }
     //获取仓储阶段基本信息
    function  getStorage(string memory _id ) public view  returns (string memory place,uint startDate,
    uint endDate, string memory storageer,string[] memory img,bool finish){
        Storage memory stor = storages[_id];
        place = stor.place;
        startDate = stor.startDate;
        endDate = stor.endDate;
        storageer = stor.storageer;
        img = stor.img;
        finish = stor.finish;
        return(place,startDate,endDate,storageer,img,finish);
    }
    //设置仓储阶段基本信息
    function  setStorage(string memory id,string memory place,uint startDate,uint endDate,
    string memory storageer,string[] memory img,bool finish) public{
       Storage memory stor = Storage({
           place:place,
           startDate:startDate,
           endDate:endDate,
           storageer:storageer,
           img:img,
           finish:finish
       });
       storages[id] = stor;
    }
     //获取检测阶段基本信息
    function  getCheck(string memory _id ) public view  returns (string[] memory typeId,uint[] memory date,
    string[] memory result,string[] memory info,string[] memory checker,bool[] memory finish){
        Check[] memory check = checks[_id];
        typeId = new string[](check.length);
        date = new uint[](check.length);
        result = new string[](check.length);
        info = new string[](check.length);
        checker = new string[](check.length);
        finish = new bool[](check.length);
        for(uint i = 0;i<check.length;i++){
            typeId[i] = check[i].typeId;
            date[i] = check[i].date;
            result[i] = check[i].result;
            info[i] = check[i].info;
            checker[i] = check[i].checker;
            finish[i] = check[i].finish;
        }
        return(typeId,date,result,info,checker,finish);
    }
    //设置检测阶段基本信息
    function  setCheck(string memory id,string memory typeId,uint date,
    string memory result,string memory info,string memory checker,bool finish) public{
       Check memory check = Check({
           typeId:typeId,
           date:date,
           result:result,
           info:info,
           checker:checker,
           finish:finish
       });
       checks[id].push(check);
    }
}