class ShopHandler {
    
    constructor() {
        this.displayCanvas = document.createElement("canvas");
        this.displayCanvas.width = 47;
        this.displayCanvas.height = 36;
        this.displayCanvas.style.display = "none";
        this.displayCtx = this.displayCanvas.getContext('2d');
        setTimeout(() => {
            document.body.appendChild(this.displayCanvas);
        },100);

        setTimeout(() => {
            //shopHandler.EnterShop()
        },200);
    }

    displayCanvas = null;
    displayCtx = null;
    isInShop = false;

    EnterShop() {
        this.isInShop = true;
        uiHandler.buttons = [
            new Button(25,50, "Item 1"),
            new Button(25,175, "Item 2"),
            new Button(25,300, "Item 3"),
            new Button(200,50, "Item 4"),
            new Button(200,175, "Item 5"),
            new Button(200,300, "Item 6"),
            new Button(550,450, "Exit Shop")
        ];
    }

    ExitShop() {
        this.isInShop = false;
        uiHandler.buttons = [];
    }


    DrawShop() {
        if (!this.isInShop) return;

        let mogShopImage = document.getElementById("image-mogshop");
        if (mogShopImage && mogShopImage.width) {
            ctx.drawImage(mogShopImage, 395,65);
        }

        ctx.imageSmoothingEnabled = false;


        this.displayCtx.clearRect(0,0,this.displayCanvas.width,this.displayCanvas.height);
        // this.displayCtx.font = "900 8px Verdana";
        // this.displayCtx.fillStyle = "#141414";
        // this.displayCtx.fillText("TEST",4,12);
        let mogHappyImage = document.getElementById("image-mog-happy");
        if (mogHappyImage && mogHappyImage.width) {
            this.displayCtx.drawImage(mogHappyImage, 0, -2 +
                Math.floor(Math.sin((new Date())/1000*3)*2)
            );
        }

        ctx.drawImage(this.displayCanvas,441,124,this.displayCanvas.width*5, this.displayCanvas.height*5)

        let mogShopGridImage = document.getElementById("image-mogshop-grid");
        if (mogShopGridImage && mogShopGridImage.width) {
            ctx.drawImage(mogShopGridImage, 441,124);
        }

    }


}