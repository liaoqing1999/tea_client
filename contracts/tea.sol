pragma solidity >=0.4.21 <0.7.0;
contract Tea {
    enum ProductStatus {
        Open,
        Sold,
        Unsold
    }
    enum ProductCondition{
        New,
        Used
    }
    uint public productIndex;
    mapping(address => mapping (uint=>Product)) stores;
    mapping(uint =>address) productIdInstore;
    struct Product{
        string id;               //id
        string name;             //茶名
        string typeId;           //类型id
        string batch;            //批次
        string grade;            //等级
        string period;           //保质期
        string store;            //存储条件
        string spare1;
        string spare2;
        string spare3;
    }

     struct Plant{
        string id;               //id
        string tea;              //茶叶id
        string batch;            //批次
        string place;            //产地
        string pesticide;        //农药
        uint date;               //施药时间
        string producer;         //生产者负责人
        string spare1;
        string spare2;
        string spare3;
    }
    struct Process{
        string id;               //id
        string tea;              //茶叶id
        string batch;            //批次
        string method;           //加工方法
        uint startDate;          //开始时间
        uint endDate;            //结束时间
        string processer;        //加工者负责人
        string spare1;
        string spare2;
        string spare3;
    }
     struct Storage{
        string id;               //id
        string tea;              //茶叶id
        string batch;            //批次
        string place;           //存储地点
        uint startDate;          //入库时间
        uint endDate;            //出库时间
        string processer;        //存储负责人
        string spare1;
        string spare2;
        string spare3;
    }
     struct Check{
        string id;               //id
        string tea;              //茶叶id
        string batch;            //批次
        string typeId;           //检测类型
        uint date;               //检测时间
        string result;           //检测结果
        string info;             //检测详情
        string checker;          //检测负责人
        string spare1;
        string spare2;
        string spare3;
    }
     struct Sale{
        string id;               //id
        string tea;              //茶叶id
        string batch;            //批次
        string place;            //售卖地点
        string method;           //售卖方式
        uint date;               //售卖时间
        string saleer;           //生产者负责人
        string spare1;
        string spare2;
        string spare3;
    }
     struct Staff{
        string id;               //id
        string name;             //姓名
        string phone;            //电话
        string card;             //身份证号码
        string work;             //工作
        string spare1;
        string spare2;
        string spare3;
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
    constructor () public{
        productIndex = 0;
    }
}