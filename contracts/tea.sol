pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
contract Tea {
    mapping(string =>Product) productIdInstore;
    mapping(string =>Plant) plant;
    mapping(string =>Process[]) process;
    mapping(string =>Store) stores;
    mapping(string =>Check[]) check;
    mapping(string =>Sale) sale;
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
    }

     struct Plant{
        string place;            //产地
        string producer;         //生产者负责人
        string[] img;            //图片数组
    }
    mapping(string =>Pesticide[]) pesticide;
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
    }
     struct Store{
        string place;            //存储地点
        uint startDate;          //入库时间
        uint endDate;            //出库时间
        string[] img;            //图片数组
    }
     struct Check{
        string typeId;           //检测类型
        uint date;               //检测时间
        string result;           //检测结果
        string info;             //检测详情
        string checker;          //检测负责人
    }
     struct Sale{
        string place;            //售卖地点
        string method;           //售卖方式
        uint date;               //售卖时间
        string saleer;           //售卖负责人
    }
     struct Staff{
        string id;               //id
        string name;             //用户名
        string password;         //密码
        string real_name;        //真实姓名
        string phone;            //电话
        string card;             //身份证号码
        string work;             //工作
    }

    function  getProduct(string memory _id ) public view  returns (string memory id,string memory name,string memory typeId,
    string memory batch,string memory grade, string memory period, string memory store, string[] memory img,string memory qr){
        Product memory product = productIdInstore[_id];
        return(product.id,product.name,product.typeId,product.batch, product.grade,product.period,product.store,product.img,product.qr);
    }
    function  setProduct(string memory id,string memory name,string memory typeId,
    string memory batch,string memory grade, string memory period, string memory store, string[] memory img,string memory qr) public{
       Product memory product = Product({
           id:id,
           name:name,
           typeId:typeId,
           batch:batch,
           grade:grade,
           period:period,
           store:store,
           img:img,
           qr:qr
       });
       productIdInstore[id] = product;
    }
    struct Dictionary{
        string id;               //id
        string tea;              //茶叶id
        string batch;            //批次
        string method;           //加工方法
        uint startDate;          //开始时间
        uint endDate;            //结束时间
        string processer;        //生产者负责人
        string spare1;
        string spare2;
        string spare3;
    }
}