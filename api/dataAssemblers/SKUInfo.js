var Q = require('q');
var seminarModel = require('../models/seminar.js');
var SKUDecisionModel = require('../models/SKUDecision.js');
var utility = require('../utility.js');
var consts = require('../consts.js');
var gameParameters = require('../gameParameters.js').parameters;

exports.getSKUInfo = function(seminarId, period, companyId, SKUID){
    return Q.all([
        seminarModel.findOne(seminarId),
        SKUDecisionModel.findOne(seminarId, period, companyId, SKUID.slice(0, 2), SKUID)
    ]).spread(function(seminar, decision){
        var allResults = seminar.allResults;

        var result = {
            currentPeriodInfo: {

            },
            previousPeriodInfo: {

            },
            expectedSales: {

            }
        };

        var lastPeriodResult = allResults[allResults.length-1];
        var companyResult = utility.findCompany(lastPeriodResult, companyId);
        var SKUResult = utility.findSKU(lastPeriodResult, parseInt(SKUID));

        //current period data
        var currentPeriodInfo = {};
        currentPeriodInfo.stocksAtFactory = [
            SKUResult.u_ps_FactoryStocks[consts.StocksMaxTotal].s_ps_Volume,
            SKUResult.u_ps_FactoryStocks[consts.StocksMaxTotal].s_ps_Volume * consts.ActualSize[SKUResult.u_PackSize]
        ];
        currentPeriodInfo.stocksAtWholsalers = [
            SKUResult.u_ps_WholesaleStocks[consts.StocksMaxTotal].s_ps_Volume,
            SKUResult.u_ps_WholesaleStocks[consts.StocksMaxTotal].s_ps_Volume * consts.ActualSize[SKUResult.u_PackSize]
        ];
        currentPeriodInfo.stocksAtRetailers = [
            SKUResult.u_ps_RetailStocks[consts.StocksMaxTotal].s_ps_Volume,
            SKUResult.u_ps_RetailStocks[consts.StocksMaxTotal].s_ps_Volume * consts.ActualSize[SKUResult.u_PackSize]
        ];


        //not sure if the last parameter is decision.d_ProductionVolume 
        return utility.unitCost(
                period,
                SKUResult.u_PackSize,
                decision.d_IngredientsQuality,
                decision.d_Technology,
                companyResult.c_CumulatedProductionVolumes,
                companyResult.c_AcquiredEfficiency,
                decision.d_ProductionVolume)
        .then(function(unitProductionCost){
            currentPeriodInfo.unitProductionCost = [unitProductionCost, unitProductionCost / consts.ActualSize[SKUResult.u_PackSize]]; 
            
            //not sure if currentPeriodInfo.d_ConsumerPrice is the right value for that parameter
            var wholesalePrice = utility.unitPrice('WHOLESALERS', decision.d_ConsumerPrice);
            currentPeriodInfo.wholesalePrice = [wholesalePrice, wholesalePrice/consts.ActualSize[SKUResult.u_PackSize]];

            var recommendedConsumer = decision.d_FactoryPrice[0] * (gameParameters.pgen.wholesale_Markup + 1)
                * (1+ gameParameters.pgen.retail_Markup);
            currentPeriodInfo.recommendedConsumer = [recommendedConsumer, recommendedConsumer / consts.ActualSize[SKUResult.u_PackSize]];

            currentPeriodInfo.period = period;

            result.currentPeriodInfo = currentPeriodInfo;

            //previous period data
            var previousPeriodInfo = {};
            previousPeriodInfo.marketSales = [
                SKUResult.u_MarketSalesVolume[consts.ConsumerSegmentsMaxTotal-1]/consts.ActualSize[SKUResult.u_PackSize],
                SKUResult.u_MarketSalesVolume[consts.ConsumerSegmentsMaxTotal-1]
            ];

            previousPeriodInfo.shipmentsToRetailers = [
                SKUResult.u_WholesalesVolume/consts.ActualSize[SKUResult.u_PackSize],
                SKUResult.u_WholesalesVolume
            ];

            previousPeriodInfo.unitProductionCost = [
                SKUResult.u_ps_UnitCost,
                SKUResult.u_ps_UnitCost / consts.ActualSize[SKUResult.u_PackSize]
            ];

            previousPeriodInfo.averageConsumerPrice = [
                SKUResult.u_AverageNetMarketPrice * consts.ActualSize[SKUResult.u_PackSize],
                SKUResult.u_AverageNetMarketPrice
            ];

            previousPeriodInfo.consumerCommunication = SKUResult.u_Advertising;
            previousPeriodInfo.consumerPromotions = SKUResult.u_ConsumerPromotions;
            previousPeriodInfo.period = period - 1;

            result.previousPeriodInfo = previousPeriodInfo;


            // //expected sales
            var expectedSales = {};

            if(decision.d_RepriceFactoryStocks){
                expectedSales.expectedMaximalSales = (SKUResult.u_ps_FactoryStocks[consts.StocksMaxTotal-1].s_ps_Volume
                + decision.d_ProductionVolume) * decision.d_FactoryPrice[0];
            }else{
                expectedSales.expectedMaximalSales = SKUResult.u_ps_FactoryStocks[consts.StocksMaxTotal-1].s_ps_Volume 
                * SKUResult.u_ps_FactoryStocks[consts.StocksMaxTotal-1].s_ps_UnitPrice 
                + decision.d_ProductionVolume * decision.d_FactoryPrice[0];
            }

            expectedSales.expectedGrossMargin = (expectedSales.expectedMaximalSales 
            - (SKUResult.u_ps_FactoryStocks[consts.StocksMaxTotal-1].s_ps_Volume 
                * SKUResult.u_ps_FactoryStocks[consts.StocksMaxTotal-1].s_ps_UnitCost
                + decision.d_ProductionVolume * decision.d_FactoryPrice[0])) / expectedSales.expectedMaximalSales * 100;

            // var vVolumeWeight = ((SKUResult.u_ps_FactoryStocks[consts.StocksMaxTotal].s_ps_Volume 
            //     * consts.ActualSize[SKUResult.u_PackSize]) 
            //     + (decision.d_ProductionVolume * consts.ActualSize[SKUResult.u_PackSize])) / 
            //     (vBrandFactoryStock + decision.d_ProductionVolume);
            // expected.operatingMargin = (expectedSales.expectedGrossMargin 
            //     - decision.d_Advertising/expectedSales.expectedMaximalSales * 100
            //     - decision.d_PromotionalBudget/expectedSales.expectedMaximalSales * 100
            //     - decision.d_TradeExpenses/expectedSales.expectedMaximalSales * 100)
            result.expectedSales = expectedSales;

            return result;
        })
    });
}

























