pragma solidity >=0.4.21 <0.7.0;
contract Test {
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
        uint id;
        string name;
        string category;
        string imageLink;
        string descLink;
        uint auctionStartTime;
        uint auctionEndTime;
        uint startPrice;
        address highestBidder;
        uint highestBid;
        uint secondHighestBid;
        uint totalBids;
        ProductStatus status;
        ProductCondition condition;
    }
    constructor () public{
        productIndex = 0;
    }

    function addProductToStore(string memory _name,string memory _category,string memory _imageLink,
    string memory _descLink,uint _auctionStartTime,uint _auctionEndTime,
    uint _startPrice,uint _productCondition) public{
        require(_auctionStartTime<_auctionEndTime,"非法输入");
        productIndex += 1;
        Product memory product = Product(productIndex,_name,_category,
        _imageLink,_descLink,_auctionStartTime,_auctionEndTime,
        _startPrice,msg.sender,0,0,0,ProductStatus.Open,ProductCondition(_productCondition));
        stores[msg.sender][productIndex] = product;
        productIdInstore[productIndex] = msg.sender;
    }

    function getProduct(uint _productId) public view  returns (uint,string memory,string memory,string memory,
    string memory,uint,uint,uint,ProductStatus,ProductCondition){
        Product memory product = stores[productIdInstore[_productId]][_productId];
        return (product.id,product.name,product.category,product.imageLink,product.descLink,product.auctionStartTime,
        product.auctionEndTime,product.startPrice,product.status,product.condition);
    }
}