"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LevelBrowseMenu = /** @class */ (function (_super) {
    __extends(LevelBrowseMenu, _super);
    function LevelBrowseMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.selectedCloudCode = "";
        _this.levels = [];
        _this.levelPanel = null;
        _this.levelOptionsPanel = null;
        _this.searchButtons = [];
        _this.isDataLoadInProgress = false;
        _this.backgroundColor = "#2171cc";
        _this.backgroundColor2 = "#677327";
        _this.basePanelWidth = 632;
        _this.bigPanelWidth = 900;
        _this.baseX = 264;
        _this.baseY = 40;
        _this.basePanelHeight = 480;
        _this.baseLeftX = -960;
        _this.baseRightX = 30;
        return _this;
    }
    LevelBrowseMenu.prototype.CreateElements = function () {
        var ret = [];
        this.backButton = this.CreateBackButton();
        ret.push(this.backButton);
        // this.levels = [
        //     JSON.parse(`{"level":{"code":"3CF-80-A4","userId":60,"timestamp":"2022-10-28T21:54:44.27","publishTimestamp":"2022-10-28T22:14:29.21","name":"Popple's Trials #2","description":"","levelData":"1.2.2;17;0;0;9|#000000,#041900,0.05,1.00,0.40;Ab,#3c5a3c,0,0,0.4,-4,0,0;AL,#58a010,1,-3.75,0.5,7,0,0;AM,#104c00,-6.25,0,0,0,1,0;AM,#2bb200,-4,-10,0,-1,1,0|AA/AA/AA/AAcAHQAA/AAlAHPAA/AA/AAUAHDAA/AA/AA/AATAHJAA/AA/AA/AA/AA/AA/AA/AA/AA/AAjAHOAA/AA/AA/AAeAHQAA/AA/AA/AA/AA/AA/AA/AAVAFAAAJAFAAAEAFAAAaAFAAAEAFAAAPAFAAA/AA/AA/AA/AA/AA/AA/AAx|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAK|AAQDXFAAKDXHAAiBRAAcKBRAAALAcDBRAAA+DXHAAIAcCBRAAAMDXEAA/AAUEIAChAAAFChABRAAcBAAPChAAAPChAAAPChAAcJBRAAAEChAAAPChAAAQDXHAAFChABRAAcAAAPChADXJAAFChAAAPChAAAPChAAcKBRAAADChAAAPChADXLAADChAAAQDXJAA0ChABRAAcKBRAChAAATChABRAAcBAAQAcFBRAAAPBRAAAJAcFBRAAABEIAAA5AcEBRAEHDChABRBAA2AcJBRAC4AEHEAcJBRAAAUChABRAAAOChABRAAAOChABRAAcIBRAC4ABRAAcEAA7ChABRAAcFAAQAcEBRAChAAAkChABRAAcEAAeChABRAAcAEHKAAPEHAAAFEHKAAkChABRAAcAAAQAcLBRAAA1BRAAAaChGAAKChAAACChABRAAAOChABRAAAKChAAAEChLAA2ChAAAPChAAAOBTADBAAcJBRAEICChABTADBAAAOC4ABRAChOAAABRAAcMBRAChAAAABRAAcMBRAChAAAABRAAALEIAAACBRAAAQDXIAAHDXGAAmChABRAEHBDBAAALChABRAAABDBAAcGBRAC9DChABRAAcCAAQDXLAAEAcLBRAAAaEGDAAACFDAAHEGAAABEGAAAACFAAABCFAAAHEGAAAAEGBAAACFAAAACFBAA/AA/AA/AAiCfBACAAAMCfDACAADAACBAAICfAACAAAAACBADBBrAAAICfAACDADBBrAAAJACAAAAACBADBBrAAALACAAAcDUAAACCdBAAJDUAAAADUAAAAA1ACdAA1CAAHDUAAAADUAA1BCdBA1CCdAAAGDUBA1BCdBA1CAAIDUAA1BCdAA1DCdAAAIA1BCdAA1DAAIDUACdAA1ECdBAAGDUBA1ACdEA1AAAGDUAAAADUACdAA1ECdBAAFDUAAAADUAAAACdEAAIDUAAA/AA/AA/AA/AAu|AA/AAdAHAAAtAHAAA/AA/AA/AA/AA/AA/AA/AA/AAqABFAA/AAbAPDABFAAKABFAAKABFAAsABIAAHABIAAHABIAA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAr|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAoAmAAA/AA/AA/AA/AA/AA/AAvAuAAA/AA/AA/AA/AA/AA/AA/AA/AA/ADHAA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAn|AXAFAI;AYAIAE;AmANAJ;AYARAE;ALAYAN;AYAYAM;A3AlAN;AVAwAO;ALA2AO;ALBBAN;AYBBAM;AUBLAP;AdAnAN;AdAuAP;AiBiAP;ABBkAO;AVAqAI;AdBRAQ;AVBSAP;AYBcAL;AAAEAI","thumbnail":"data:image/png;base64,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","recordFrames":2172,"recordUserId":60,"firstClearUserId":60,"numberOfClears":1,"numberOfAttempts":835,"numberOfUniquePlayers":5,"numberOfLikes":1,"numberOfDislikes":0,"levelState":2,"username":null,"isGlitch":false},"author":{"id":60,"code":"0B4-90-A4","username":"Dr.Popples","originalName":"Dr.Popples","unlocks":"0AA,0AB,0AC,0AD,0AE,0AF,0AG,0AH,1AA,1AB,1AD,1AG,1AI,1AK,1AL,1AM,1AT,1AU,2AA,2AB","avatar":"AH,AM,AA"},"wrHolder":{"id":60,"code":"0B4-90-A4","username":"Dr.Popples","originalName":"Dr.Popples","unlocks":"0AA,0AB,0AC,0AD,0AE,0AF,0AG,0AH,1AA,1AB,1AD,1AG,1AI,1AK,1AL,1AM,1AT,1AU,2AA,2AB","avatar":"AH,AM,AA"},"isStarted":true,"isCleared":false,"isLiked":false,"isDisliked":false,"personalBestFrames":0,"isGlitch":false}`),
        //     JSON.parse(`{"level":{"code":"34A-00-A4","userId":8,"timestamp":"2022-10-28T01:46:25.21","publishTimestamp":"2022-10-28T01:55:49.683","name":"The Crimson Wastes","description":"","levelData":"1.2.1;12;0;0;10|#ff6363,#755656,0.90,0.60,0.30;AB,#666666,0,0,0.1,2,1,0;AT,#8c8c8c,0,0,0.2,2,1,0;AA,#d8d8d8,-0.25,0,0.2,1,0,0;AM,#7e2525,0.25,0,0.2,1,1,0|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAD|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAD|AAGADEAAGADEAAGBQEAAIDWAADBAAIDWAADBAAIDWAADBAAIDWAADBAAIDWAADBAAIDWAADBAAIDWAADBAADDWABQGAAGDWAAAABQCAAGDWAAAAEIAADBAAIDWAADBAAIDWAADBAAIDWABQBAAIDWAADBAAIDWAADBAAFDWABQAAfABQCAAGDWAAfAADCAAGDWAAfAADCAAFDWABQAAfABQCAAIDWAADBAAIDWAADBAAIDWABQBAAIDWAADBAAIDWAADBAAFDWABQAAfABQCAAGDWAAfAADCAAGDWAAfAADCAAFDWABQAAfABQCAAIDWAADBAAIDWAADBAAIDWAADBAAIDWAADBAAIDWAADBAAIDWAADBAAIDWAADBAAIDWAADBAAGBQEAAGADEAAGADEAAGBQEAAGDWAADDAAGDWAAAABQCAAGDWAAAAEIABQBAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAEDWABQCAfADWABQAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWABQAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWABQAAAJDWAADAAAJDWAADAAAEDWABQFAAJDWAADAAAJDWAADAAAJDWAADABQGAACBQBADGAACADGAAAADAAACADBBQEAAAEIAAACBQBAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWABQAAAJDWAADAAAJDWAADAAAEDWABQCAfABQBAAEDWAADCAfAADBAAEDWAADCAfAADBAAEDWAADCAfAADBAACDWAAAAEIAADCAfAADBAACDWAAAABQDAfABQBAADDWAAAABQCAfABQBAADDWAAAAEIAADBAfAADBAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWABQAAAJDWAADAAAJDWAADAAAJDWABQAAAEDWABQCAfABQBAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJBQBAAJBQBAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAEDWABQFAAGDWAADDAAGDWAADDAAGDWAADDAAGDWAADDAAGDWAADDAABDWABQIAABADFAAAADCAAAADEAAAADAAAAADCAAAADCAAAADAAAAADAAAAEIAADBAAAADAAAAADAAAAADAAAAEIAAAAEIAADBAAAADAAAAADAAAAEIAAAAEIAAAAEIAADBAACEIAAAAEIAAAAEIAAAAEIAADBAAJADBBQAEHFAACBQCEHFAACBQBAAJADBAAJADBAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAGDWABQAAfABQBAAJDWAADAAAJDWAADAAAJDWAADAAAGDWABQAAfABQBAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAGDWABQAAfABQBAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAGDWABQAAfABQBAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAIDWABQAADAAAJDWAADAAAJDWAADAAAIDWABQAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJDWAADAAAJBQBAAJADBAAJADBAAJBQB|AA/AA/AAXARAAA/AA/AA/AA/AA/AA/AAKARAAA/AA/AALAPBAA/AA/AA/AA5ARAAA/AA/AANAPAAAjARAAA/AA/AA/AA/AA/AA/AA/AAtARAAAIARAAAIARAAAIARAAA/AA/AA/AA/AA/AA/AA/AA/AA/AAU|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAD|ALAxAJ;AYAxAI;BRAsAI;AYAtAI;ALA7AJ;AYA7AI;ALBEAJ;AYBEAI;A5BMAJ;BRBNAF;AYBOAF;AYBTAI;ALBTAJ;AYBaAE;BRBcAF;AYBdAF;BRBbAE;ALBmAJ;AYBmAI;ALAHAI;AYAHAH;BRALAI;AYAMAI;ALAPAI;AYAPAH;ALAYAI;AYAYAH;A5ApAG;A5B2AJ;BRCFAI;AYCGAI;BRCIAC;AYCJAC;BRCHAE;AYCIAE;BRCGAG;AYCHAG;ALB7AJ;AYB7AI;ALCqAJ;AYCqAI;ALCBAG;AYCBAF;AzCUAJ;ABC5AI;AAAAAG","thumbnail":"data:image/png;base64,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","recordFrames":5935,"recordUserId":8,"firstClearUserId":8,"numberOfClears":7,"numberOfAttempts":673,"numberOfUniquePlayers":6,"numberOfLikes":5,"numberOfDislikes":0,"levelState":2,"username":null,"isGlitch":false},"author":{"id":8,"code":"2AE-90-A4","username":"HillbillyAl","originalName":"HillbillyAl","unlocks":"0AA,0AB,0AC,0AD,0AE,0AF,0AG,0AH,1AA,1AB,1AD,1AG,1AI,1AK,1AL,1AM,1AT,1AU,2AA,2AB","avatar":"AB,AM,AB"},"wrHolder":{"id":8,"code":"2AE-90-A4","username":"HillbillyAl","originalName":"HillbillyAl","unlocks":"0AA,0AB,0AC,0AD,0AE,0AF,0AG,0AH,1AA,1AB,1AD,1AG,1AI,1AK,1AL,1AM,1AT,1AU,2AA,2AB","avatar":"AB,AM,AB"},"isStarted":true,"isCleared":true,"isLiked":true,"isDisliked":false,"personalBestFrames":11524,"isGlitch":false}`),
        //     JSON.parse(`{"level":{"code":"3CB-80-A4","userId":8,"timestamp":"2022-10-28T01:48:20.26","publishTimestamp":"2022-10-28T01:50:08.977","name":"Galvanized Steel","description":"","levelData":"1.2.1;12;0;0;4|#00bee5,#000019,0.85,0.05,0.40;AH,#9c4e16,0,0,0.2,-1,1,0;AF,#7f7f7f,0,0,0.2,-2,1,0;AI,#727c8b,0.25,0,0.2,-10,0,0;AJ,#5ec9ed,-0.25,0,0.2,-5,1,0|AAQACAAAKACAAAKACAAA/AAzACAAAEACAAAEACAAAEACAAAEACAAAEACAAA/AAAACAAAKACAAAKACAAA/AAQACBAAtACBAAtACBAA/AA/AA/AA/AARAIAAAKAIAAAKAIAAAKAIAAAKAIAAAKAIAAAKAIAAAKAIAAAKAIAAAKAIAAAKAIAAAKAIAAA/AA/AA/AA/AA/AA/AA/AAqAIAAAKAIAAAFACAAADAIAAAFACAAADAIAAAFACAAADAIAAAKAIDAAIACBAAJACBAAJACBAAJACBAAJACBAAJACBAAJACBAAJACBAAJAIBAAJACBAAJACBAAJACBAAJAIBAAJACAAAKACAAAKACAAAKACAAAKACAAAKACAAAKACAAAKACAAAKACAAAKAIBAAJACCAAIACCAAIACCAAJAIBAA/AA/AA/AAH|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAX|DULAbDDSAAAADSAAbDDSAAbDDSAAAADSAAbDDSAAbDDSAAAADSAAbDDSADULAAEDFAAADBuADSAAAEDFAAADBuADSAAAEDFAAADBuADSAAAJBuADSAAABDFAAAEDFAAAABuADSAAABDFAAAEDFAAAABuADSAAABDFAAAEDFAAAABuADSABuADUKBuADSAAAADSAAbCDSAAAADSAAbADSABuADSAAAADSAAbCDSAAAADSAAbADSABuADSAAAADSAAbCDSAAAADSAAbADSABuADUKBuADSAAbIDSABuADSAAbIDSABuADSAAbIDSABuADUKBuADSAAAADSAAbGDSABuADSAAAADSAAbGDSABuADSAAAADSAAbGDSABuADUKAAJDFADSAAACAEEAABDFADSAAAJDFADSADUCAADBuADUDAbBDSAAADBuADSAAbBDSAAABC9AAADBuADSAAbBDSAAbBDSAAADBuADSAAbBDSADUCAADBuADUDAbBDSAAAGDFADSAAABC9AAADAEBAAADFADSAAbBDSAAAGDFADSADUCAABBuADUFAbBDSAAABBuADSAAbDDSAAABC9AAABBuADSAAbDDSAAbBDSAAABBuADSAAbDDSADUCAABBuADUFDSAAAIDFADSBAADAEDAAADFADSBAAIDFADSBAABBuADUHDSAAABBuADSAAbFDSBAABBuADSAAbFDSBAABBuADSAAbFDSBAABBuADUHDSAAABBuADSAAbFDSBC9CDSAAbFDSBAABBuADSAAbFDSBAABBuADUHDSAAACC9AAAEDFADSBAACC9AAAEDFADSBAACC9AAAEDFADSADUEAAEDFADSAAbDDSAAAEDFADSAAbDDSAAAEDFADSAAbDDSAAAEDUADSADUEAAEBuADSAAABC9AAAGBuADSAAABC9AAAGBuADSAC9CAAGBuADSAAAJBuADSAAAJBuADSAAAJBuADSAAAJDUADSAAAJDFADSAAAJDFADSAAAJDFADSAAAJDFADSAAAJDFADSADUCAAFDFBDSAAbBDSAAAFDFBDSAAbBDSAAAFDFBDSADUCAAFDFBDSBAAIDFADSBAAIDFADSBAAIDFADSBAAIDFADSBAAIDFADSBAAEBuADUEDSAAAEBuADSAAbCDSBAAEBuADSAAbCDSBAAEBuADSAAbCDSBAAEBuADUEDSAAAHDFBDSBAAIDFADSBAAIDFADSADUDAAFDFADSAAbCDSAAAFDFADSAAbCDSAAAEDFBDSAAbCDSAAAFDFADSADUDAAFDFADSBAAIDFADSBAAIDFADSBAAHDFBDSBAACAECAABDFBDSBAAHDFBDSBAAIDFADSBAAIDFADSADUDAAFDFADSAAbCDSAAAFDFADSAAbCDSAAAEDFBDSAAbCDSAAAFDFADSADUDAAFDFADSBAAIDFADSBAAIDFADSBAAFBuADUDDSAAAFBuADSAAbCDSAAAFBuADSAAbCDSAAAFBuADSAAbCDUAC9DDUGAADBuADSAAbAAAAAbDAADBuADSAAbAAAAAbDAABAEBBuADSAAbAAAAAbDAADBuADUGEHBDBADUAAADDFCDSBAAADBADSAAAEDFBDSBAAADBADSAAAEDFBDSBAAADBADSAAAEDFBDSBAAADBADSAAAEDFBDSBAAADBADSAAADDFCDSBAAADBADSAAAEDFBDSBAAADBADSAAAEDFBDSBAAADBADSAAAEDFBDSADUAAAADBADUAAAEDFBDSAAbAAAADBADSAAADDFCDSAAbAAAADBADSAAADDFCDSAAbAAAADBADSAAADDFCDSADUAAAADBADUAAAEDFBDSBAAADBADSAAAEDFBDSBAAADBADSAAAEDFBDSBAAADBADSAAAEDFBDSBAAADBADSAAADDFCDSBAAADBADSAAAEDFBDSBAAADBADSAAAEDFBDSBAAADBADSAAAEDFBDSBAAADBADSAAAEDFBDSBAAADBADSAAADDFCDSADUAAAADBADUBAADDFBDSBAAADBAAbADSAAADDFBDSBAAADBAAAADSAAADDFBDSBAACDSAAADDFBDSADUBAABDUAAABBuADUDDSAAAFBuADSAAbCDSAAAFBuADSAAbCDSAAAFBuADSAAbCDSAAACBuADUGDSAAACBuADSAAbFDSAAACBuADSAAbFDSAAACBuADSAAbFDSAC9DDUGDSAAACBuADSAAbFDSAAACBuADSAAbFDSAAACBuADSAAbFDSADUKDSAAbDDSAAbFDSAAbDDSAAbFDSAAbDDSAAbFDUL|AAcARAAA/AA/AALAPAAAEAPAAA/AAYARAAAjANAAAKANAAADANAAAFANAAA/AAWANAAA/AAcANAAACANAAA/AA/AA/AAbANAAAKANAAAkANAAAKANAAAKANAAAKANAAACANAAAKANAAAKANAAAKANAAAUANAAAKANAAAKANAAAKANAAAYANAAAKANAAAKANAAAKANAAA/AA/AA6ANAAAKANAAAKANAAA/AA/AA/AABARAAAFANAAAKANAAA/AA/AA/AA/AA/AAOAPBAA/AA/AA/AAH|AA0AEAAAKADAAAKADAAAKADAAATADAAAEADAAAEADAAAEADAAAEADAAAEADAAAEAEAAAEAEAAA/AA/AAIADGAHAADAAACADAAAGADAAACADAAAGADAAACADAAAGADAAACAFAAAGADAAACADAAAGADAAACADAAAGADAAACADAAAGADAAACADAAAGAFAAACADAAAGADAAACADAAAGADAAACADAAAGADAAACADAAAGADAAACADAAAGADAAACADAAAGADAAAKADAAAKAFAAAKADAAAKADAAAKADAAAKADAAAxADCAAIADCAAIADCAAWADCAACADBAADADCAACADBAADADCAACADBAAJADBAAJADBAAJADBAAYADDAAHADDAAHADDAAHADDAA0ADBAAJADBAAJADBAAJADBAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAJADBAAJADBAAJADBAAJADBAA/AAEADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAIADCAAlADDAAHADDAAHADDAAlADAAEAAAGAfBAABAECAAEAfBAABAEAAFBAAEAfBAABAEAADBAAIAEAADBAAIAECAAIAECAAIAEAAFBAAIAEAADBAAIAEAADBAAIAEAADBAAIAECAAIAECAAIAEAAFBAAIAEAADBAAIAEAADBAAIAEBADAAAIAECAAIAECAAIAEAAFBAAIAEAADBAAIAEAADBAAIAECAAIAECAAIAEAAFBAAIAEAADBAAIAEAADBAAIAEAADBAANAfDAAHAfDAAHAfDAArADDAAHADDAAHADDAA/AAa|BRAPAC;AhANAC;BMAOAC;BRAPAI;AhANAI;BMAOAI;BTAeAB;BTAiAB;BTAmAB;BRAVAC;AiAXAC;BMAWAC;BRABAF;BMACAF;AiADAF;A0AqAI;A5AuAD;ARAwAD;A0A9AB;AEAKAK;AEBCAK;AEBKAF;AEBPAH;AEBGAH;AEBbAJ;AEBfAJ;A0BiAC;AEBmAJ;AEBrAJ;BRByAH;BMBzAH;AiB0AH;AEB5AI;AEB+AI;AECFAI;BRCPAD;AzBcAF;AzBiAF;AzBoAF;AzBtAF;AzBlAI;AzBqAI;AzBeAI;AzBZAI;AECKAI;AECPAI;AzAiAI;AzAaAH;AzAmAE;AzAeAG;AzAiAF;AzAuAC;AzAqAD;AzAKAH;AzAGAE;AzAKAB;AzAOAA;AzASAA;AzAWAA;AzAaAC;A0ALAK;A0B2AH;AzB7AH;AzCBAH;AzCHAH;AzCMAH;AzCRAH;AzCPAF;AzCKAF;AzCFAF;AzB+AF;AzB5AF;ABCbAD;AzCVAE;AzA/AH;AzBEAH;AzBGAF;AzBJAF;AzBLAD;AzBEAD;AzBCAB;AzBOAH;AzBQAF;AzBUAG;AzBXAF;AzA7AJ;AAAFAK","thumbnail":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAYCAYAAACIhL/AAAAAAXNSR0IArs4c6QAABKFJREFUWEfFV31MG2Ucfo4WaflqK19SNAqhOE10MMsQo47GjywBIyabiyjBBEMyg5qhRoMSYQmamOEfuqEx/rvNjDmdm9ZNXZxoMGZZ2RyBtCvtGBZ6vWtpt7vycdcz915LUkK5Jjas/7x579e89+R5fs/vuZcaHh6W3G43HmeHwHBAcR6S1iXbMOT6zHwUmfgd6zpNjnn+y5Z1j1tbp+x2u+TxeFAz/iomA8B9JUhaq7vskOtnzo9Dih+ZRVGQN9LqE7Ilv7U17eLCKhCKojCyb4zsd33ycBJAuSYfMtKTXKfSZdDx9xgkfSlYNojafA/CURFihQ0+3xwMKx7wHI/SQg2+P6AlL259W8B8WETHGx8QBYxGIywWC1wuV9IaDAY3rKfN4PGRr5MBLsYgmpvAMAz0N13geQ5moxYnPlS4bO2lML8goP/AV0QBlmXXBWgwGDasp83gxUsOAlAGtK3wGsIEoA1+vx+5UTdebFtGURHAskhaT9mtyNZqsWvsAv68ewoDnyvKtrzWTNbm5mbCYCoPpM/gqZOI6UogS0IkjgNkAgz0nBPde3lotWYIgi9pDd1ogy4nByt9++Go9KAkNwt1TwM9X2yBTqfD4OAgYTCVB9Jm0OGcgqQvIwzWFXgRWRQhmG0gAHkn6cE7DFrcMG0n/6nSujG3IKKj4/W0evD/M3j2DKTcMrAMg9oCb5zBJiJxfnSa9GBxgQb87dtB0wFU53jBRkS81/txWj2oyqCayxwzXsLguU5ljrUOlRIXJySWASoMNhBD3JN1FfNhAR17ujbsscScVWVQzWXHR38nJjnX8R0B+NynZiKxf96P/EU3eJ5HuUGDiKkBtJ9GdY6HSNz/1v4NeywxZ1UZnJqaIi8+/dkPZD30JmCZ3IKj9bXEhfXb/lrXpYMnm1C47EGU51Gcr0G0qAGBQABVt00jEBHx0jPtmWHw4MGDxFW7K8ZR90QMjl+AOycqIb7/DnFhdtbgui796Met0PMu8Dc5lBk04IoaCcBKjSyxiP7u3swwqNqD4TBi+lIE5SQp8CCyGINQbgMdoJHHXwXPcSg3ahEqtCIUDKEq2w1fSMDLO3dnhkHVHrz8jzIHQ4moUwY1SRLOSXpQdvFScSMCTICYRJa4r3NfZhhU+5pxLC0TBmm/H1bTrJLFZhtomkZeVGaQR4VJi2/axhWXH96qZPGOlk2ag06XInE8SRSJmxBgGORyrlWJv91zQXH5MSuReKB9b2bmoCqDVBaZg2yQjX/NKBL75nwwLHvxwv1jtziLZ2YR05esmiQcVQDKjs3lXehuHL21WXxRnwfoS+GnaViN15Usll0c70GO42E2aRAxNMSjbhrXGQGdDz26OT14IszB/FQ7YhJAne2H8GQfLAYd3GwEUrYOj5To8W9UwKWJSbTUPwDrsh2HfzqPnZZnN6cHa3oG1r1DrH2449ejuDc8g4g0hAknD7r+XYxeXlG986hmsdqdhKt5MC2Arxz5GTB4YbzrCCJRCdceO4Q/roiqdx7VLFZLklT1tXeMxN4k/AZ9YRWuzOan1YOpzl/9olZLklT1VAATz9XuHGr1/wBSkobEgbQYOQAAAABJRU5ErkJggg==","recordFrames":1957,"recordUserId":13,"firstClearUserId":8,"numberOfClears":9,"numberOfAttempts":124,"numberOfUniquePlayers":6,"numberOfLikes":5,"numberOfDislikes":0,"levelState":2,"username":null,"isGlitch":false},"author":{"id":8,"code":"2AE-90-A4","username":"HillbillyAl","originalName":"HillbillyAl","unlocks":"0AA,0AB,0AC,0AD,0AE,0AF,0AG,0AH,1AA,1AB,1AD,1AG,1AI,1AK,1AL,1AM,1AT,1AU,2AA,2AB","avatar":"AB,AM,AB"},"wrHolder":{"id":13,"code":"12C-10-A4","username":"germdove","originalName":"germdove","unlocks":"0AA,0AB,0AC,0AD,0AE,0AF,0AG,0AH,1AA,1AB,1AD,1AG,1AI,1AK,1AL,1AM,1AT,1AU,2AA,2AB","avatar":"AC,AK,AA"},"isStarted":true,"isCleared":true,"isLiked":true,"isDisliked":false,"personalBestFrames":5691,"isGlitch":false}`),
        //     JSON.parse(`{"level":{"code":"2CA-80-A4","userId":60,"timestamp":"2022-10-27T22:56:21.587","publishTimestamp":"2022-10-27T23:05:51.903","name":"Popple's Trials #1","description":"","levelData":"1.2.1;12;0;0;11|#160215,#0c0c26,0.00,1.00,0.00;AL,#71037c,0,0,0.1,-4,1,0;AK,#3d00cc,0,0,0.3,8,0,0;AU,#0c3f59,0,0,0.2,-2,1,0;AK,#7e62ff,0,0,0.4,5,1,0|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAP|AA/AA/AA/AAgADAABBAAIADAABBAAIADAABBAAIADAABBAAIADAABBAAIADAABBAAUADAABBAAIADAABBAAIADAABBAA/AA/AA/AA/AA/AA/|AA3A6AADABQBAAsADABQFADAChAAAJADAChAAAAA6AChAADABQFADAChAAAkChEAAGChAADABQCAAGChAADABQCAAEADABQFAAFA6AChAAAVA6AChAAADBQFADAChAAAJADAChAAAJADAChAAADBQFADAChAAABChBBQFADAChAAAJADAChAAAJADAChAAADBQFADAChAAABADABQAAAFA6AChAAABADAAAKADABQEADAAAKChAAAZChAAADChAAABChAADABQGAAXADAChAAAJADAChAAAAADABQBADAC4AADABQCADAChAAAAADAAABADAAACChAADABQCADABQBADAAACChAADAAAKADABQBADAChAAAFA6AADAAABADAChAAAGADABQBADAChAAAGADAAAKADAAAVChBBQAADAChAAAGChAADAAAAADAChAAAGChAADABQAADAChAAAGChAADAAAFA6AChAADABQCAdDAACChAADABQCAdAAABAdAAAHAdAAAAAdBAAOChAAADBQFADAChAAAJADAChAAADBQFADAChAAAD|AA/AAEAFCAAIAFCAAIAFCAAXAFDAA/AA/AALAFFAAFAFFAAdAFFAAFAFFAAcAFAAA/AAjAUAAAWAFBAApAFBAA/AAFAFAAA/AAeAFFAAR|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAP|AZAMAJ;AdAgAI;AdAgAF;AZAkAI;AVAoAC;AYAuAK;ABA2AI;AAAGAI","thumbnail":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAYCAYAAACIhL/AAAAAAXNSR0IArs4c6QAABRNJREFUWEelV1tMHFUY/s7MLMsuCwsLBSyLBVrdPvggkYS0MaG1FFtffPEWb1UfKqIVmmqMTWNriIryoJam9rlNaUubNvHBTQ0xJparGFsKBbbdxhqkXFoodmHZ65jzz87AzM6yWs/L7Plv5z/f+f7zn2VHSkvlTXl5eGFhCepgYGgKL4LLqwZ9mlxGDEdKi5PkuYIdFohk13O9F1VVVbDMS3AgGwHcJ/mBtVbkWSyYi0R03/lolOLtHLpNdp+UZNL8rUVlWeb1eORCqxVPDI5oifAfXk8FuFyfoAyvpyxJni84wCCQf9foJVRXV0Oat+jinXzUhalQCEVWq+5bkJFB8XYMTZL98UfydHNmhiA33BsOJiHF5W2la5LkBaJTlwyfSJAQRVST9/q6CdmBgQHdt9nhoHg7hqfI9uDaDJq/GWT/HUHu8YNnnQ5Bu2CFjWVSMAsyEEFYl6wq6x75hZDt6+vTfdsLCyne04kET2zI1ebc938j6JKc4Jx90HHoIYuC4LVpyJyDxZKOoxoHVa7JiAPgXEvm4EoEOWezRIeGXroEBQiIU2xlzPhuY/aWhP769Qpi12ZI3r7BqeOohuBLC0Acy5WcjoObrt5EtpSdlFf/6CXimBBQjt04DhaJptXcNK6srfqrXNUQ3DwYQwTjiEOp73QI1o3cMU2gZ/hn4pgQsJnqT63PMa3mpvEQ2av+Klc1BBtju3BnyYsYphFHCHtN7kHOtG/cBYTA5s5OQooF7BTYDjsWsYhDRYz0jeP6Ygm6i8muNTpNnHtjSaL528EZmm8fuavbkBpPQ3Bi/3l0fJcDb9d+zEc78b3HmqhWPwRYkSkKyBCtOFORTQhUX7xISLGFLF3g0xUO0jf+FTFF8GR5FsXdPjpLenVeNzoHmcpEPzQEdy1JkCwSXK485DhzUHull3ZWmwhkulpCWOJcTqY+U7nHjH422YYgC6K5iJGer8dHfQJBoz2/GXjCGoK1Y3O6HNrL7LRTVW6swlQJG/2Mdqq+bmyeqjqdPTvsdstmPVLtme9PxFYDL0nXXCgrCI7dM/X7dE3ctIpTrcN+3LhRNuuRas8MvN4AURTx0WffEuTpkDxVZiPk68buI4bkzXWU202reE8KIJjf75fNeqSxZ8rBnFWR/G34J6pqtbdu880n7HntL5P/3X2vQhAEtLUeT3synIfM5/PJZj3S2DPlYPKDQF2BB+obVKpa7a3bfH+bJvBk7WOorKxEW+uJlAmqBcINmKPmZZnvUOzv0TmsNEq3VXd2iPoxp8A7Vok42LN7t6lbvKWFOPjeZPKVstJBAEOcVzFPkN36A8KU8mBMNf5twqcfVt53T11XHqrGcXad8h7cM6lsKN2gBIVfezU7PWNA75T0YZaX+Tw/QghuvREgodHfqE+b4MeHf5flaAhMsmLl9+iBV9L5murPlEqE4NYbCw+kNzqxihevmgLU1LXT9L5qmFKe9go6yjGpfOGyL/LDhOCWFAmq+twLF3Qv62jIZRovZYLHrjxvel81TCt/joxDvR873CIhuMWf+NeTMJRkEVEWg6rPPndO97KOhvPJ8qsP6iGKAj788hh1GlaeAsF93c8QEq9FlGdTQ2CC5jX+4KpH3+Ja0uwYA13ymZYs2DKcEFkWmoTLpO+anTU9IeO/vpQJHr38HCFRc1NJ6GyJoJunqmrV7tlpB9yux+GMViEy48Zi7E/ciw3ha7eX4twNh01PyPiv7x94MLCIrwTC2QAAAABJRU5ErkJggg==","recordFrames":1049,"recordUserId":60,"firstClearUserId":60,"numberOfClears":6,"numberOfAttempts":216,"numberOfUniquePlayers":6,"numberOfLikes":4,"numberOfDislikes":0,"levelState":2,"username":null,"isGlitch":false},"author":{"id":60,"code":"0B4-90-A4","username":"Dr.Popples","originalName":"Dr.Popples","unlocks":"0AA,0AB,0AC,0AD,0AE,0AF,0AG,0AH,1AA,1AB,1AD,1AG,1AI,1AK,1AL,1AM,1AT,1AU,2AA,2AB","avatar":"AH,AM,AA"},"wrHolder":{"id":60,"code":"0B4-90-A4","username":"Dr.Popples","originalName":"Dr.Popples","unlocks":"0AA,0AB,0AC,0AD,0AE,0AF,0AG,0AH,1AA,1AB,1AD,1AG,1AI,1AK,1AL,1AM,1AT,1AU,2AA,2AB","avatar":"AH,AM,AA"},"isStarted":true,"isCleared":true,"isLiked":true,"isDisliked":false,"personalBestFrames":1073,"isGlitch":false}`),
        //     JSON.parse(`{"level":{"code":"1F5-80-A4","userId":13,"timestamp":"2022-10-27T04:16:01.49","publishTimestamp":"2022-10-27T04:16:41.897","name":"The Booly Express","description":"","levelData":"1.2.1;17;0;0;11|#003232,#00004c,0.00,1.00,0.40;AG,#442c07,0,0,0.05,0,1,0;AA,#595959,0,0,0.1,3,0,0;AC,#074407,0,0,0.2,0,1,0;AD,#10a010,0,0,0.3,0,1,0|AA/AAHAKEAALAKEAALAKEAALAKEAALAKEAALAKEAALAKEAALAKEAA/AA2AKBAANAKCAANAKCAANAKCAANAKCAAOAKBAAPAKAAAPAKAAAOAKBAANAKCAAOAKBAAPAKAAAPAKAAAOAKBAANAKCAANAKCAAOAKBAAPAKAAAPAKAAAOAKBAANAKCAANAKCAAOAKBAAPAKAAAPAKAAAOAKBAANAKCAANAKCAANAKCAANAKCAANAKCAAOAKBAAPAKAAA/AA/AAe|AArAEAAAPAEAAAPAEAAAPAEAAAPAEAAAPAEAAAPAEAAAPAEAAAPAEAAAPAEAAAPAEAAAPAEAAAPAEAAAPAEAAA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAx|AAIC9AAAACeAAAECeHC9BAAACeAAANC9AAfACeAAAEBtDAAEEHAAfACeAAAHCeAAAEEHAAfACeAAAHCeAAAEEHAAfACeAAAFCeAAAACeAAAEEHAAfACeAAAFCeAAAACeAAAECeAAfACeAAAFCeAAAACeAAAECeAAfACeAAAFCeAAAACeAAAECeAAfACeAAAFCeCAAECeAAfACeAAAECeDAAECeAAfACeAAAECeDAAEEHAAfACeAAAECeDAAEEHAAfACeAAAECeCCrAAAEEHAAfACeAAAECeCCsAAAEEHACvACeAAAECeBCrAAANCeBCsAAANCeACrAAAHAFACeAAAECeACsAAAHAFACeAAAECeAAAIAFACeAAAECeADXCCiAAAEAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeADXACiAAAEAfBAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeADXBCiAAACBtAAfAAAAAFACeAAAECeAAAFBtAAAAAfAAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeACiAAAEBtAAfBAFACeAAAECeAAAFBtAAfAAAAAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeADXCCiAAABAfCAFACeAAAECeAAAFAfCAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAIAFACeAAAECeAAAJC9AAABABAAABCeAAAICeBAAECeAAAICeBAAECeAAAHDvACeBAAECeLAAECeLAAECeLAAECeLAAECeLAAECeLAAE|AAHAPAASAAAOAPAASAAAXARHAAJAFCAANAFCAANAFAAAAAFAAANAFAAAAAFAAAEAFAAAHAFAAAAAFAAAEAFAAAHAFAAAAAFAAAEAFAAAHAFAAAGAFAAAPAFAAA/AA/AA/AA/AA/AA/AA/AAFAPBAA/AA/AA/AA/AA/AAu|ABAAjAADGAEAA2AAANAEAADAA2AAAOAEAA2AAANAfAAEAA2AAAPA2AAAPA2AAAPA2AAAPA2AAAPA2AAAPA2AAAPA2AAAPA2AAAPA2AAAPA2AAAPA2AAA/AA/AAlA2CAANA2AAA/AACA2AAAAA2AAANA2BAA/AASA2AAAPA2AAAAA2AAA/AARA2CAANA2CAA/AA/AAIAdAADAAAPAdAAAPAdAAAPAdAAAPAdAAAPADAAdAADAAA/AAF|AYADAC;BCAMAA;AYAGAA;BRAHAA;AYAJAA;BRAKAA;BAAFAC;BRAFAB;AYAIAC;BRAJAC;AYAEAB;AnAAAK;AnABAK;AGALAI;ABAzAI;AUAyAN;BAAyAM;AAAAAA;BAAyAL;AgA3AN;AEA3AM","thumbnail":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAYCAYAAACIhL/AAAAAAXNSR0IArs4c6QAABWNJREFUWEfFlktsG0UYx/+zjpONX0n8SPNObSd2TFKgIQpN2iAKlIqCKkQRBw5ISJUQtJceuHBAQiqIExfEAQFqC6LlUPVYQcUJKII2lUjVtAnEzqOOHZM2jmN7H17vDtqZxJXdICU1FXv5vN/O/Ofn//fN7BI8PkgHG1R0yB0wryltApJs4J13P2b37336GUJkkeXiYifLRYRFBFqfYL9jyWuQVIo7cCJvbcCL7S0sb1kusvjjjZ9ZfG5gjMXtXoTsGqQBkkS/+CibO61NIC8bWKzlMJQAYWGR5eJ1nbhcVJDTdZwQBIiiCBkJBngW3rJ8R42PzU8YdzE+Po7Dwwe3y8bGk/bdu6m/oQi31MYB1evIygaOrzv41enT8JEMPA3t7LmQN7a0EJG2Nu7fxO7kVvCrAJDA3jG6P9KK5esZNnZBzKKoAwoR2f2ZdGpTZ7ZE+QCD0vlVxDEPWaFYqusCQe8gDdQmMWDnJV6oy6FoAMfeOsbuT505gzqiwXekC4WQiKn3Z1ArR6EoCittk0OApBoYCPKe3Oi97bLdza9ioqYGnZiFqlGmvVRrAob20JE2FT6pmQPW5piDn6+tMueOuTvgEGQMygB6XfhpQYNYTKJQ0KAUgHPEWpXD6XwGK04LVKEeS1kFnSQGpUghyRQp604Q+IdosD6JfscAB7TmoenA8bdNBykunvpmW2ZstfeWc2ms1iRRMGFUIGXpAqUUfeICVDNnlthiAgZG6UinAp/Md920dAN5hSJhdKPJVou9Nt6L/9Vl9tisehtxYyci9nkoGuX9JvjZEpU5gs5hGrAvYsDFHZzOTSIrGUjAjya7FW25ZFVsk8SLoDiHvEyxRPwI2+ZL+hHHPO83E5CsA1bkCLr20ZFuGT7Vy0D+zE8iZ555xQC77yfL1QFSH3psc5AUAwkjgD7nXEk/4pzjDpobgvL1KnMErXto0BVHf0M/dzA7ibxiIK4FOaDl7+oA9Wb0OGbZQZ/Ugwg7Z0v6Edcs6zfT3RTl61XmCNqeoiMBCb6Chw2YWrvJ/m28sA5oTVUHqO1AwB6DqlIsFoMIuWZL+pGGWbZjWQ/q64AVOYLmUep3LmCXZ93BzE3+WlN7uYNilT2otCLoikI2S1zoRbgxWtKPNEXvlVjj61XmCJqfpqO9eXg1Ny/x6i32qkuoPRywvkpAmQOyTaL1INwYK+lH3LF7m0Tj61XmCNz7aKBxHgPeR0qAzEEpxAEdi9WVONeOnqYZ9jWUUEIIe2a4g1IIEe/MvWNG5etV5gjcz9DRcA5evYkDpqdYEyesHgj2HMJrlqoAp106my/oBgqpboTdMdzRgYzdWqZLKYGe7EDEs+6qubOVEEhNn5+ixoIDvka07vDil/FbiIlWtBsGBKcdtqXCAwF+28gP+CE9v635NsOAQzXQVKxj80hNfw9t39GCAy0uPLZ7CCdOn2UPLIaBI4dewsT5H7a1wMbgT3o92LGcx1BxE0ACoNYC9lWi0031wzleOfLC/iFqOqeqKsQ6KxKpFeZkKhfFvogNBWQhuCxckFIYGQ1Ep7h6pW9L4ENjf0GwEhiKAWICeesgCMSUAiHAySt2GFkNgpOXPPh7tkyXHH39EDWd++Pab3B7vEinV5mTeel7ONrGsJq5WBLbEDWKFOMXurcEOPzawn3zN3TM+OFVe5nOfYCHz71MbUEXpOgazJj7IgqxnkKRyUON3w3cxCtfPolL3StlgB89e7LcwQ9e7aV6oAGWWAZmvOBvwRu5KL52BB9qvHy+m31eXeoqB3xz51G4PT6s3F1mkRwePrh5l26pgNUPutSZLhN5/jY/7jau/x+wowIwXg74D9quPqCJ/MDcAAAAAElFTkSuQmCC","recordFrames":695,"recordUserId":1,"firstClearUserId":13,"numberOfClears":10,"numberOfAttempts":163,"numberOfUniquePlayers":6,"numberOfLikes":5,"numberOfDislikes":0,"levelState":2,"username":null,"isGlitch":false},"author":{"id":13,"code":"12C-10-A4","username":"germdove","originalName":"germdove","unlocks":"0AA,0AB,0AC,0AD,0AE,0AF,0AG,0AH,1AA,1AB,1AD,1AG,1AI,1AK,1AL,1AM,1AT,1AU,2AA,2AB","avatar":"AC,AK,AA"},"wrHolder":{"id":1,"code":"32A-10-A4","username":"Dobbs","originalName":"Dobbs","unlocks":"0AA,0AB,0AC,0AD,0AE,0AF,0AG,0AH,1AA,1AB,1AD,1AG,1AI,1AK,1AL,1AM,1AT,1AU,2AA,2AB","avatar":"AE,AT,AB"},"isStarted":true,"isCleared":true,"isLiked":true,"isDisliked":false,"personalBestFrames":695,"isGlitch":false}`),
        // ];
        // setTimeout(() => { this.PopulateLevelPanel(); }, 100);
        // let getLevelsPromise = DataService.GetRecentLevels();
        // getLevelsPromise.then(levels => {
        //     this.levels = levels;
        //     this.PopulateLevelPanel();
        // }).catch((error) => {
        // });
        this.searchButtons.push(new LevelBrowseSortButton(this, "Newest", DataService.GetRecentLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Top Rated", DataService.GetBestRatedLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Most Liked", DataService.GetMostLikedLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Easiest", DataService.GetEasiestLevels));
        this.searchButtons.push(new LevelBrowseSortButton(this, "Hardest", DataService.GetHardestLevels));
        ret.push.apply(ret, this.searchButtons);
        this.searchButtons[0].Click();
        //this.currentSearchButton
        this.levelPanel = new Panel(this.baseX, this.baseY, this.basePanelWidth, this.basePanelHeight);
        this.levelPanel.backColor = "#1138";
        this.levelPanel.layout = "vertical";
        ret.push(this.levelPanel);
        this.levelOptionsPanel = new Panel(this.baseX + 1000, this.baseY, this.bigPanelWidth, this.basePanelHeight);
        this.levelOptionsPanel.backColor = "#1138";
        this.levelOptionsPanel.layout = "vertical";
        ret.push(this.levelOptionsPanel);
        return ret;
    };
    LevelBrowseMenu.Reset = function () {
        var menu = MenuHandler.MenuStack.find(function (a) { return a instanceof RecentLevelsMenu; });
        if (menu) {
            menu.PopulateLevelPanel();
        }
    };
    LevelBrowseMenu.GetListing = function (levelCode) {
        var menu = MenuHandler.MenuStack.find(function (a) { return a instanceof RecentLevelsMenu; });
        if (menu) {
            return menu.levels.find(function (a) { return a.level.code == levelCode; });
        }
        return undefined;
    };
    LevelBrowseMenu.prototype.PopulateLevelPanel = function () {
        var _this = this;
        if (this.levelPanel) {
            var scrollIndex = this.levelPanel.scrollIndex;
            this.levelPanel.scrollIndex = 0;
            this.levelPanel.children = [];
            this.levelPanel.scrollableChildrenUp = [];
            this.levelPanel.scrollableChildrenDown = [];
            var buttons = this.levels.map(function (a) { return new LevelBrowseButton(a, _this); });
            for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
                var button = buttons_1[_i];
                if (this.levelPanel.children.length >= 4) {
                    this.levelPanel.scrollableChildrenDown.push(button);
                    button.parentElement = this.levelPanel;
                }
                else {
                    this.levelPanel.AddChild(button);
                }
            }
            for (var i = 0; i < Math.abs(scrollIndex); i++) {
                this.levelPanel.Scroll(scrollIndex < 0 ? -1 : 1);
            }
        }
    };
    LevelBrowseMenu.prototype.HideLevelDetails = function () {
        if (this.levelOptionsPanel)
            this.levelOptionsPanel.targetX = 1000;
        if (this.levelPanel)
            this.levelPanel.targetX = this.baseX;
        this.backButton.isHidden = false;
    };
    LevelBrowseMenu.prototype.ShowLevelDetails = function () {
        var _this = this;
        var levelListing = this.levels.find(function (a) { return a.level.code == _this.selectedCloudCode; });
        if (levelListing && this.levelPanel && this.levelOptionsPanel) {
            this.backButton.isHidden = true;
            this.levelPanel.targetX = this.baseLeftX;
            this.levelOptionsPanel.targetX = this.baseRightX;
            this.levelOptionsPanel.children = [];
            var buttons = new Panel(0, 0, this.levelOptionsPanel.width, 50);
            buttons.margin = 0;
            var backButton = new Button(0, 0, 200, 50);
            backButton.onClickEvents.push(function () {
                _this.selectedCloudCode = "";
                _this.HideLevelDetails();
            });
            var backButtonText = new UIText(0, 0, "Back", 20, "white");
            backButton.AddChild(backButtonText);
            backButtonText.xOffset = backButton.width / 2;
            backButtonText.yOffset = 30;
            buttons.AddChild(backButton);
            var codeText = new UIText(0, 0, levelListing.level.code, 20, "#BBB");
            codeText.textAlign = "left";
            codeText.xOffset = -190;
            codeText.yOffset = -10;
            buttons.AddChild(codeText);
            buttons.AddChild(new Spacer(0, 0, 200, 10));
            var editButton = new Button(0, 0, 200, 50);
            editButton.onClickEvents.push(function () {
                if (levelListing) {
                    currentMap = LevelMap.FromImportString(levelListing.level.levelData);
                    editorHandler.isEditorAllowed = true;
                    editorHandler.exportString = "";
                    editorHandler.SwitchToEditMode();
                    MenuHandler.SubMenu(BlankMenu);
                }
            });
            var editButtonText = new UIText(0, 0, "Open in Editor", 20, "white");
            editButton.AddChild(editButtonText);
            editButtonText.xOffset = editButton.width / 2;
            editButtonText.yOffset = 30;
            buttons.AddChild(editButton);
            var playButton = new Button(0, 0, 200, 80);
            playButton.normalBackColor = "#020b";
            playButton.mouseoverBackColor = "#242b";
            playButton.yOffset = -30;
            playButton.onClickEvents.push(function () {
                if (levelListing) {
                    var map = LevelMap.FromImportString(levelListing.level.levelData);
                    var isLevelVersionNewer = Version.IsLevelVersionNewerThanClient(map.mapVersion);
                    if (isLevelVersionNewer) {
                        UIDialog.Confirm("This level was made on a newer version of the game. To update your version, you just need to refresh this page. " +
                            "Do you want me to do that for you real quick? (Level editor contents will be lost)", "Yeah, refresh now", "Not yet", function () { window.location.reload(); });
                    }
                    else {
                        currentMap = map;
                        editorHandler.SwitchToPlayMode();
                        MenuHandler.SubMenu(BlankMenu);
                        DataService.LogLevelPlayStarted(levelListing.level.code);
                        currentLevelCode = levelListing.level.code;
                        levelListing.isStarted = true;
                        _this.PopulateLevelPanel();
                    }
                }
            });
            var playButtonText = new UIText(0, 0, "Play", 40, "white");
            playButton.AddChild(playButtonText);
            playButtonText.xOffset = playButton.width / 2;
            playButtonText.yOffset = 50;
            buttons.AddChild(playButton);
            // MID PANEL
            var midPanel = new Panel(0, 0, this.levelOptionsPanel.width, 250);
            midPanel.margin = 0;
            var thumbnail = new Image;
            thumbnail.src = levelListing.level.thumbnail;
            thumbnail.width = camera.canvas.width / 24;
            thumbnail.height = camera.canvas.height / 24;
            var imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
            // make sure scale of this is good
            var imageFromTile = new ImageFromTile(0, 0, 422, 50 * 5, imageTile);
            imageFromTile.zoom = 10;
            midPanel.AddChild(imageFromTile);
            var CreateStatsRow = function (imageTile, stat1, stat2) {
                var ret = new Panel(0, 0, 275, 50);
                var image = new ImageFromTile(0, 0, 48, 48, imageTile);
                image.zoom = 2;
                ret.AddChild(image);
                var text = new UIText(0, 0, stat1, 20, "#DDD");
                text.textAlign = "left";
                ret.AddChild(text);
                text.yOffset = 30;
                //text.font = "arial";
                if (stat2 == "") {
                    ret.AddChild(new Spacer(0, 0, 10, 10));
                }
                else {
                    var text2 = new UIText(0, 0, stat2, 20, "#DDD");
                    text2.textAlign = "left";
                    //text2.font = "arial";
                    ret.AddChild(text2);
                    text.yOffset = 15;
                    text2.yOffset = 45;
                    text2.xOffset = -16;
                }
                return ret;
            };
            var statsPanel = new Panel(0, 0, 125, 180);
            statsPanel.layout = "vertical";
            statsPanel.xOffset = -75;
            var clearRate = ((levelListing.level.numberOfClears / levelListing.level.numberOfAttempts) * 100).toFixed(1) + "%";
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][0][1], levelListing.level.numberOfClears + " / " + levelListing.level.numberOfAttempts, clearRate));
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][1][1], levelListing.level.numberOfUniquePlayers.toString(), ""));
            statsPanel.AddChild(CreateStatsRow(tiles["menuButtons"][0][0], levelListing.level.numberOfLikes.toString(), ""));
            if (levelListing.level.isGlitch) {
                statsPanel.targetHeight += 60;
                statsPanel.AddChild(CreateStatsRow(tiles["spider"][0][0], "Glitch level", ""));
            }
            midPanel.AddChild(statsPanel);
            var rightPanelWidth_1 = 200;
            var rightPanel = new Panel(0, 0, rightPanelWidth_1 + 10, 220);
            rightPanel.margin = 0;
            midPanel.AddChild(rightPanel);
            rightPanel.layout = "vertical";
            var CreateTimePanel = function (labelText, frames, holder) {
                var panel = new Panel(0, 0, rightPanelWidth_1, frames == 0 ? 50 : 100);
                panel.layout = "vertical";
                panel.backColor = "#0008";
                panel.margin = 0;
                var wrText = new UIText(0, 0, labelText, 14, "white");
                wrText.xOffset = rightPanelWidth_1 / 2;
                wrText.yOffset = 18 + (frames == 0 ? -3 : 0);
                wrText.font = "arial";
                panel.AddChild(wrText);
                if (frames > 0) {
                    var wrTimeText = new UIText(0, 0, Utility.FramesToTimeText(frames), 28, "white");
                    wrTimeText.xOffset = rightPanelWidth_1 / 2;
                    wrTimeText.yOffset = 22;
                    panel.AddChild(wrTimeText);
                }
                var bottomLine = new Panel(0, 0, rightPanelWidth_1, 40);
                var wrHolderText = new UIText(0, 0, holder ? holder.username : "Me", 20, "white");
                if (!holder)
                    wrHolderText.xOffset = rightPanelWidth_1 / 2;
                wrHolderText.yOffset = 28;
                if (holder)
                    bottomLine.AddChild(new AvatarPanel(holder.avatar));
                bottomLine.AddChild(wrHolderText);
                bottomLine.margin = 0;
                if (holder)
                    bottomLine.AddChild(new Spacer(0, 0, 40, 40));
                panel.AddChild(bottomLine);
                return panel;
            };
            //rightPanel.AddChild(new Spacer(0, 0, 10, 5));
            rightPanel.AddChild(new Spacer(0, 0, 10, 5));
            if (levelListing.wrHolder) {
                var timePanel = CreateTimePanel("World Record", levelListing.level.recordFrames, levelListing.wrHolder);
                rightPanel.AddChild(timePanel);
            }
            if (levelListing.personalBestFrames > 0) {
                var timePanel = CreateTimePanel("Personal Best", levelListing.personalBestFrames, null);
                rightPanel.AddChild(timePanel);
            }
            // TOP PANEL
            var topPanel = new Panel(0, 0, this.levelOptionsPanel.width, 30);
            topPanel.margin = 0;
            var titleText = new UIText(0, 0, levelListing.level.name, 30, "white");
            topPanel.AddChild(titleText);
            titleText.textAlign = "left";
            titleText.xOffset = 10;
            titleText.yOffset = 40;
            var authorContainer = new Panel(0, 0, rightPanelWidth_1 + 10, 30);
            authorContainer.margin = 0;
            topPanel.AddChild(authorContainer);
            authorContainer.layout = "vertical";
            var authorPanel = CreateTimePanel("Created by", 0, levelListing.author);
            authorContainer.AddChild(authorPanel);
            this.levelOptionsPanel.AddChild(topPanel);
            this.levelOptionsPanel.AddChild(midPanel);
            this.levelOptionsPanel.AddChild(buttons);
        }
    };
    return LevelBrowseMenu;
}(Menu));
var LevelBrowseButton = /** @class */ (function (_super) {
    __extends(LevelBrowseButton, _super);
    function LevelBrowseButton(levelListing, containingMenu) {
        var _this = _super.call(this, 0, 0, 88 * 2 + 10, 50 * 2 + 10) || this;
        _this.levelListing = levelListing;
        _this.containingMenu = containingMenu;
        _this.isSelected = false;
        if (levelListing.isStarted && !levelListing.isCleared) {
            _this.normalBackColor = "#200b";
            _this.mouseoverBackColor = "#422b";
        }
        if (levelListing.isCleared) {
            _this.normalBackColor = "#020b";
            _this.mouseoverBackColor = "#242b";
        }
        var levelDt = levelListing.level;
        var thumbnail = new Image;
        thumbnail.src = levelDt.thumbnail;
        thumbnail.width = camera.canvas.width / 24;
        thumbnail.height = camera.canvas.height / 24;
        var imageTile = new ImageTile(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
        // make sure scale of this is good
        var imageFromTile = new ImageFromTile(0, 0, 88 * 2, 50 * 2, imageTile);
        imageFromTile.zoom = 4;
        _this.AddChild(imageFromTile);
        var texts = new Panel(0, 0, 370, 80);
        texts.layout = "vertical";
        var titleLine = new Panel(0, 0, 290, 25);
        titleLine.margin = 0;
        var titleLineText = new UIText(0, 0, levelDt.name, 20, "white");
        titleLineText.textAlign = "left";
        titleLineText.yOffset = 20;
        titleLine.AddChild(titleLineText);
        var byLine = new Panel(0, 0, 290, 20);
        byLine.margin = 0;
        byLine.AddChild(new AvatarPanel(levelListing.author.avatar));
        var byLineText = new UIText(0, 0, "by " + levelListing.author.username, 14, "white");
        byLineText.textAlign = "left";
        byLineText.yOffset = 20;
        var byLineTextContainer = new Panel(0, 0, 320, 20);
        byLineTextContainer.AddChild(byLineText);
        byLine.AddChild(byLineTextContainer);
        texts.AddChild(titleLine);
        texts.AddChild(byLine);
        texts.AddChild(new Spacer(0, 0, 0, 0));
        _this.AddChild(texts);
        var iconPanel = new Panel(0, 0, 50, 90);
        iconPanel.layout = "vertical";
        if (levelListing.isLiked || levelListing.isDisliked) {
            var col = levelListing.isLiked ? 0 : 1;
            var likeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][col][0]);
            likeImage.zoom = 1;
            likeImage.xOffset = -25;
            likeImage.yOffset = -30;
            iconPanel.AddChild(likeImage);
        }
        _this.AddChild(iconPanel);
        _this.onClickEvents.push(function () {
            containingMenu.selectedCloudCode = _this.levelListing.level.code;
            _this.isSelected = true;
            containingMenu.ShowLevelDetails();
        });
        _this.Update();
        return _this;
    }
    LevelBrowseButton.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.isSelected = (this.containingMenu.selectedCloudCode == this.levelListing.level.code);
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";
        this.width = this.targetWidth;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.targetWidth)
                child.width = child.targetWidth;
            child.x = child.targetX;
        }
    };
    return LevelBrowseButton;
}(Button));
var LevelBrowseSortButton = /** @class */ (function (_super) {
    __extends(LevelBrowseSortButton, _super);
    function LevelBrowseSortButton(parent, name, searchFunc) {
        var _this = _super.call(this, 0, parent.searchButtons.length * 60 + 50, 210, 50) || this;
        _this.parent = parent;
        _this.cachedListings = [];
        _this.searchTime = null;
        _this.onClickEvents.push(function () {
            if (_this.parent.isDataLoadInProgress) {
                audioHandler.PlaySound("error", false);
            }
            else {
                var secondsSinceLastSearch = 60;
                if (_this.searchTime)
                    secondsSinceLastSearch = (+(new Date()) - +(_this.searchTime || 0)) / 1000;
                if ((_this.parent.currentSearchButton != _this || secondsSinceLastSearch < 10) && _this.cachedListings.length > 0) {
                    // pull from cache
                    _this.parent.levels = _this.cachedListings;
                    _this.parent.PopulateLevelPanel();
                }
                else {
                    // run this search function
                    _this.parent.isDataLoadInProgress = true;
                    _this.parent.levels = [];
                    _this.parent.PopulateLevelPanel();
                    _this.searchTime = new Date();
                    var getLevelsPromise = searchFunc();
                    getLevelsPromise.then(function (levels) {
                        _this.parent.isDataLoadInProgress = false;
                        _this.cachedListings = levels;
                        _this.parent.levels = levels;
                        _this.parent.PopulateLevelPanel();
                    }).catch(function (error) {
                        console.error(error);
                    });
                }
            }
            _this.parent.currentSearchButton = _this;
        });
        _this.margin = 15;
        var label = new UIText(0, 0, name, 24, "white");
        label.textAlign = "right";
        label.yOffset = 22;
        _this.AddChild(new Spacer(0, 0, 0, 0));
        _this.AddChild(label);
        return _this;
    }
    LevelBrowseSortButton.prototype.Update = function () {
        var _a, _b;
        _super.prototype.Update.call(this);
        this.isSelected = this.parent.currentSearchButton == this;
        var baseX = ((_b = (_a = this.parent.levelPanel) === null || _a === void 0 ? void 0 : _a.targetX) !== null && _b !== void 0 ? _b : 0) - this.parent.baseX;
        if (this.isSelected) {
            this.normalBackColor = "#f73738";
            this.mouseoverBackColor = "#fa6162";
            this.targetX = baseX;
        }
        else {
            this.normalBackColor = "#05001e";
            this.mouseoverBackColor = "#18123a";
            this.targetX = baseX - 50;
        }
    };
    return LevelBrowseSortButton;
}(Button));
