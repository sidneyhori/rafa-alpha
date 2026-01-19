/**
 * Velocity Motors - Mock Sales Data
 * Comprehensive data for 12 months, 5 regions, 5 models
 */

const SalesData = {
    // Company Info
    company: {
        name: 'Velocity Motors',
        year: 2024,
        previousYear: 2023
    },

    // Regions
    regions: ['West', 'Southwest', 'Midwest', 'Southeast', 'Northeast'],

    // Region States Mapping
    regionStates: {
        'West': ['CA', 'OR', 'WA', 'NV', 'AZ', 'UT', 'CO', 'NM', 'MT', 'ID', 'WY', 'AK', 'HI'],
        'Southwest': ['TX', 'OK', 'AR', 'LA'],
        'Midwest': ['IL', 'OH', 'MI', 'IN', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'],
        'Southeast': ['FL', 'GA', 'NC', 'SC', 'VA', 'WV', 'KY', 'TN', 'AL', 'MS'],
        'Northeast': ['NY', 'PA', 'NJ', 'MA', 'CT', 'NH', 'VT', 'ME', 'RI', 'MD', 'DE', 'DC']
    },

    // Car Models
    models: [
        { id: 'apex', name: 'Model Apex', price: 85000, category: 'Luxury Sedan', color: '#e82127' },
        { id: 'venture', name: 'Model Venture', price: 75000, category: 'Premium SUV', color: '#ff6b6b' },
        { id: 'pulse', name: 'Model Pulse', price: 45000, category: 'Mid-Range Sedan', color: '#ffa500' },
        { id: 'terra', name: 'Model Terra', price: 52000, category: 'Compact SUV', color: '#00d26a' },
        { id: 'bolt', name: 'Model Bolt', price: 120000, category: 'Sports Car', color: '#00a8ff' }
    ],

    // Months
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    // Monthly Sales Data by Region and Model (Units Sold)
    monthlySales: {
        'West': {
            apex: [145, 152, 168, 175, 188, 195, 210, 225, 198, 185, 172, 165],
            venture: [210, 225, 245, 268, 285, 295, 315, 340, 298, 275, 255, 240],
            pulse: [320, 345, 380, 410, 435, 450, 485, 520, 465, 425, 395, 375],
            terra: [185, 198, 215, 235, 250, 265, 285, 305, 275, 255, 235, 220],
            bolt: [45, 52, 58, 65, 72, 78, 85, 92, 80, 72, 65, 58]
        },
        'Southwest': {
            apex: [125, 135, 148, 155, 165, 175, 188, 198, 175, 162, 152, 145],
            venture: [195, 208, 225, 245, 260, 275, 295, 315, 278, 258, 240, 225],
            pulse: [285, 305, 335, 365, 385, 400, 430, 458, 412, 378, 352, 335],
            terra: [165, 178, 195, 212, 225, 240, 258, 275, 248, 230, 215, 202],
            bolt: [38, 44, 50, 56, 62, 68, 74, 80, 70, 62, 55, 48]
        },
        'Midwest': {
            apex: [118, 128, 140, 148, 158, 168, 180, 192, 170, 158, 148, 140],
            venture: [175, 188, 205, 225, 240, 255, 275, 295, 262, 245, 228, 215],
            pulse: [265, 285, 312, 340, 360, 375, 405, 432, 390, 358, 335, 320],
            terra: [155, 168, 185, 202, 215, 230, 248, 265, 240, 225, 210, 198],
            bolt: [32, 38, 44, 50, 55, 60, 66, 72, 64, 56, 50, 44]
        },
        'Southeast': {
            apex: [135, 145, 158, 168, 178, 188, 202, 215, 190, 175, 165, 155],
            venture: [198, 212, 230, 250, 268, 285, 305, 328, 290, 270, 252, 238],
            pulse: [298, 320, 350, 382, 405, 420, 452, 485, 438, 402, 375, 358],
            terra: [172, 185, 202, 220, 235, 252, 270, 290, 262, 245, 228, 215],
            bolt: [42, 48, 55, 62, 68, 75, 82, 88, 78, 70, 62, 55]
        },
        'Northeast': {
            apex: [155, 168, 185, 195, 208, 220, 238, 255, 225, 210, 195, 182],
            venture: [225, 242, 265, 290, 310, 328, 352, 380, 338, 315, 295, 278],
            pulse: [345, 372, 408, 445, 472, 490, 528, 568, 512, 470, 440, 420],
            terra: [198, 215, 235, 258, 275, 295, 318, 342, 310, 288, 270, 255],
            bolt: [52, 60, 68, 76, 85, 92, 100, 108, 96, 86, 78, 70]
        }
    },

    // Previous Year Sales (for YoY comparison) - in dollars
    previousYearSales: {
        'West': { total: 225000000, units: 8950 },
        'Southwest': { total: 195000000, units: 7820 },
        'Midwest': { total: 180000000, units: 7450 },
        'Southeast': { total: 200000000, units: 8250 },
        'Northeast': { total: 240000000, units: 9450 }
    },

    // Regional Targets (Units)
    targets: {
        'West': 10500,
        'Southwest': 9200,
        'Midwest': 8800,
        'Southeast': 9600,
        'Northeast': 11000
    },

    // Inventory Levels by Region
    inventory: {
        'West': 1250,
        'Southwest': 980,
        'Midwest': 875,
        'Southeast': 1120,
        'Northeast': 1380
    },

    // Dealers Data
    dealers: [
        { id: 1, name: 'Pacific Auto Group', region: 'West', city: 'Los Angeles, CA', revenue: 28500000, units: 425, rank: 1 },
        { id: 2, name: 'Empire Motors', region: 'Northeast', city: 'New York, NY', revenue: 26800000, units: 398, rank: 2 },
        { id: 3, name: 'Sunrise Automotive', region: 'Southeast', city: 'Miami, FL', revenue: 24200000, units: 372, rank: 3 },
        { id: 4, name: 'Lone Star Cars', region: 'Southwest', city: 'Houston, TX', revenue: 23500000, units: 358, rank: 4 },
        { id: 5, name: 'Golden Gate Motors', region: 'West', city: 'San Francisco, CA', revenue: 22800000, units: 342, rank: 5 },
        { id: 6, name: 'Liberty Auto Sales', region: 'Northeast', city: 'Philadelphia, PA', revenue: 21500000, units: 328, rank: 6 },
        { id: 7, name: 'Windy City Vehicles', region: 'Midwest', city: 'Chicago, IL', revenue: 20800000, units: 315, rank: 7 },
        { id: 8, name: 'Peach State Motors', region: 'Southeast', city: 'Atlanta, GA', revenue: 19500000, units: 298, rank: 8 },
        { id: 9, name: 'Desert Sun Auto', region: 'Southwest', city: 'Phoenix, AZ', revenue: 18900000, units: 285, rank: 9 },
        { id: 10, name: 'Bay Area Automotive', region: 'West', city: 'Oakland, CA', revenue: 18200000, units: 275, rank: 10 },
        { id: 11, name: 'Motor City Dealers', region: 'Midwest', city: 'Detroit, MI', revenue: 17800000, units: 268, rank: 11 },
        { id: 12, name: 'Coastal Motors', region: 'Southeast', city: 'Charlotte, NC', revenue: 17200000, units: 258, rank: 12 },
        { id: 13, name: 'Garden State Auto', region: 'Northeast', city: 'Newark, NJ', revenue: 16800000, units: 252, rank: 13 },
        { id: 14, name: 'Heartland Cars', region: 'Midwest', city: 'Columbus, OH', revenue: 16200000, units: 245, rank: 14 },
        { id: 15, name: 'Alamo Auto Group', region: 'Southwest', city: 'San Antonio, TX', revenue: 15800000, units: 238, rank: 15 },
        { id: 16, name: 'Seattle Premium', region: 'West', city: 'Seattle, WA', revenue: 15500000, units: 232, rank: 16 },
        { id: 17, name: 'Boston Automotive', region: 'Northeast', city: 'Boston, MA', revenue: 15200000, units: 228, rank: 17 },
        { id: 18, name: 'Music City Motors', region: 'Southeast', city: 'Nashville, TN', revenue: 14800000, units: 222, rank: 18 },
        { id: 19, name: 'Twin Cities Auto', region: 'Midwest', city: 'Minneapolis, MN', revenue: 14500000, units: 218, rank: 19 },
        { id: 20, name: 'Rocky Mountain Cars', region: 'West', city: 'Denver, CO', revenue: 14200000, units: 215, rank: 20 },
        { id: 21, name: 'Gulf Coast Motors', region: 'Southwest', city: 'New Orleans, LA', revenue: 13800000, units: 208, rank: 21 },
        { id: 22, name: 'Tampa Bay Auto', region: 'Southeast', city: 'Tampa, FL', revenue: 13500000, units: 205, rank: 22 },
        { id: 23, name: 'Buckeye Motors', region: 'Midwest', city: 'Cleveland, OH', revenue: 13200000, units: 198, rank: 23 },
        { id: 24, name: 'Capital Region Cars', region: 'Northeast', city: 'Washington, DC', revenue: 12900000, units: 195, rank: 24 },
        { id: 25, name: 'Desert Motors', region: 'West', city: 'Las Vegas, NV', revenue: 12600000, units: 190, rank: 25 },
        { id: 26, name: 'Magnolia Auto', region: 'Southeast', city: 'Birmingham, AL', revenue: 12300000, units: 185, rank: 26 },
        { id: 27, name: 'Bluegrass Motors', region: 'Southeast', city: 'Louisville, KY', revenue: 12000000, units: 182, rank: 27 },
        { id: 28, name: 'Badger State Auto', region: 'Midwest', city: 'Milwaukee, WI', revenue: 11800000, units: 178, rank: 28 },
        { id: 29, name: 'Red River Cars', region: 'Southwest', city: 'Dallas, TX', revenue: 11500000, units: 175, rank: 29 },
        { id: 30, name: 'Empire State Motors', region: 'Northeast', city: 'Buffalo, NY', revenue: 11200000, units: 172, rank: 30 },
        { id: 31, name: 'Hoosier Auto Group', region: 'Midwest', city: 'Indianapolis, IN', revenue: 10900000, units: 168, rank: 31 },
        { id: 32, name: 'Valley Motors', region: 'West', city: 'San Diego, CA', revenue: 10600000, units: 162, rank: 32 },
        { id: 33, name: 'Carolina Auto', region: 'Southeast', city: 'Raleigh, NC', revenue: 10400000, units: 158, rank: 33 },
        { id: 34, name: 'Sooner State Cars', region: 'Southwest', city: 'Oklahoma City, OK', revenue: 10100000, units: 155, rank: 34 },
        { id: 35, name: 'Pine Tree Motors', region: 'Northeast', city: 'Portland, ME', revenue: 9800000, units: 150, rank: 35 },
        { id: 36, name: 'Show Me Auto', region: 'Midwest', city: 'Kansas City, MO', revenue: 9500000, units: 145, rank: 36 },
        { id: 37, name: 'Palmetto Motors', region: 'Southeast', city: 'Charleston, SC', revenue: 9200000, units: 142, rank: 37 },
        { id: 38, name: 'Prairie Auto Group', region: 'Midwest', city: 'Omaha, NE', revenue: 8900000, units: 138, rank: 38 },
        { id: 39, name: 'Old Dominion Cars', region: 'Southeast', city: 'Richmond, VA', revenue: 8600000, units: 135, rank: 39 },
        { id: 40, name: 'Nutmeg Motors', region: 'Northeast', city: 'Hartford, CT', revenue: 8400000, units: 132, rank: 40 },
        { id: 41, name: 'Cascade Auto', region: 'West', city: 'Portland, OR', revenue: 8200000, units: 128, rank: 41 },
        { id: 42, name: 'Razorback Motors', region: 'Southwest', city: 'Little Rock, AR', revenue: 7900000, units: 125, rank: 42 },
        { id: 43, name: 'Gateway Auto', region: 'Midwest', city: 'St. Louis, MO', revenue: 7600000, units: 122, rank: 43 },
        { id: 44, name: 'Ocean State Cars', region: 'Northeast', city: 'Providence, RI', revenue: 7400000, units: 118, rank: 44 },
        { id: 45, name: 'Volunteer Motors', region: 'Southeast', city: 'Memphis, TN', revenue: 7200000, units: 115, rank: 45 },
        { id: 46, name: 'Cornhusker Auto', region: 'Midwest', city: 'Lincoln, NE', revenue: 6900000, units: 112, rank: 46 },
        { id: 47, name: 'Granite State Motors', region: 'Northeast', city: 'Manchester, NH', revenue: 6700000, units: 108, rank: 47 },
        { id: 48, name: 'Bayou Auto Group', region: 'Southwest', city: 'Baton Rouge, LA', revenue: 6500000, units: 105, rank: 48 },
        { id: 49, name: 'Mountain State Cars', region: 'Southeast', city: 'Charleston, WV', revenue: 6200000, units: 102, rank: 49 },
        { id: 50, name: 'Green Mountain Auto', region: 'Northeast', city: 'Burlington, VT', revenue: 5900000, units: 98, rank: 50 }
    ],

    // Gross Margin by Model
    grossMargins: {
        apex: 0.24,
        venture: 0.22,
        pulse: 0.18,
        terra: 0.20,
        bolt: 0.28
    },

    // Market Share Data
    marketShare: {
        current: 8.5,
        previous: 7.2,
        competitors: [
            { name: 'Tesla', share: 18.5 },
            { name: 'BMW', share: 12.2 },
            { name: 'Mercedes', share: 11.8 },
            { name: 'Audi', share: 9.5 },
            { name: 'Velocity', share: 8.5 },
            { name: 'Others', share: 39.5 }
        ]
    },

    // Utility Functions
    utils: {
        formatCurrency: (value) => {
            if (value >= 1000000000) {
                return '$' + (value / 1000000000).toFixed(2) + 'B';
            } else if (value >= 1000000) {
                return '$' + (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
                return '$' + (value / 1000).toFixed(0) + 'K';
            }
            return '$' + value.toLocaleString();
        },

        formatNumber: (value) => {
            if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'K';
            }
            return value.toLocaleString();
        },

        formatPercent: (value) => {
            return value.toFixed(1) + '%';
        },

        getRandomVariation: (base, variance) => {
            return base + (Math.random() - 0.5) * variance;
        }
    },

    // Calculate aggregated data
    calculate: {
        // Total revenue for a period
        getTotalRevenue: (dateRange = 'ytd') => {
            let totalRevenue = 0;
            const months = SalesData.getMonthsForRange(dateRange);

            SalesData.regions.forEach(region => {
                SalesData.models.forEach(model => {
                    const sales = SalesData.monthlySales[region][model.id];
                    months.forEach(monthIndex => {
                        totalRevenue += sales[monthIndex] * model.price;
                    });
                });
            });

            return totalRevenue;
        },

        // Total units sold
        getTotalUnits: (dateRange = 'ytd') => {
            let totalUnits = 0;
            const months = SalesData.getMonthsForRange(dateRange);

            SalesData.regions.forEach(region => {
                SalesData.models.forEach(model => {
                    const sales = SalesData.monthlySales[region][model.id];
                    months.forEach(monthIndex => {
                        totalUnits += sales[monthIndex];
                    });
                });
            });

            return totalUnits;
        },

        // Revenue by region
        getRevenueByRegion: (region, dateRange = 'ytd') => {
            let revenue = 0;
            const months = SalesData.getMonthsForRange(dateRange);

            SalesData.models.forEach(model => {
                const sales = SalesData.monthlySales[region][model.id];
                months.forEach(monthIndex => {
                    revenue += sales[monthIndex] * model.price;
                });
            });

            return revenue;
        },

        // Units by region
        getUnitsByRegion: (region, dateRange = 'ytd') => {
            let units = 0;
            const months = SalesData.getMonthsForRange(dateRange);

            SalesData.models.forEach(model => {
                const sales = SalesData.monthlySales[region][model.id];
                months.forEach(monthIndex => {
                    units += sales[monthIndex];
                });
            });

            return units;
        },

        // Revenue by model
        getRevenueByModel: (modelId, dateRange = 'ytd') => {
            let revenue = 0;
            const months = SalesData.getMonthsForRange(dateRange);
            const model = SalesData.models.find(m => m.id === modelId);

            SalesData.regions.forEach(region => {
                const sales = SalesData.monthlySales[region][modelId];
                months.forEach(monthIndex => {
                    revenue += sales[monthIndex] * model.price;
                });
            });

            return revenue;
        },

        // Units by model
        getUnitsByModel: (modelId, dateRange = 'ytd') => {
            let units = 0;
            const months = SalesData.getMonthsForRange(dateRange);

            SalesData.regions.forEach(region => {
                const sales = SalesData.monthlySales[region][modelId];
                months.forEach(monthIndex => {
                    units += sales[monthIndex];
                });
            });

            return units;
        },

        // Monthly trend data
        getMonthlyTrend: (metric = 'revenue', dateRange = 'ytd') => {
            const months = SalesData.getMonthsForRange(dateRange);
            const data = [];

            months.forEach(monthIndex => {
                let value = 0;
                SalesData.regions.forEach(region => {
                    SalesData.models.forEach(model => {
                        const sales = SalesData.monthlySales[region][model.id][monthIndex];
                        if (metric === 'revenue') {
                            value += sales * model.price;
                        } else {
                            value += sales;
                        }
                    });
                });
                data.push({
                    month: SalesData.months[monthIndex],
                    value: value
                });
            });

            return data;
        },

        // Average selling price
        getAverageSellingPrice: (dateRange = 'ytd') => {
            const totalRevenue = SalesData.calculate.getTotalRevenue(dateRange);
            const totalUnits = SalesData.calculate.getTotalUnits(dateRange);
            return totalRevenue / totalUnits;
        },

        // Gross margin
        getGrossMargin: (dateRange = 'ytd') => {
            let totalMargin = 0;
            let totalRevenue = 0;
            const months = SalesData.getMonthsForRange(dateRange);

            SalesData.regions.forEach(region => {
                SalesData.models.forEach(model => {
                    const sales = SalesData.monthlySales[region][model.id];
                    months.forEach(monthIndex => {
                        const revenue = sales[monthIndex] * model.price;
                        totalRevenue += revenue;
                        totalMargin += revenue * SalesData.grossMargins[model.id];
                    });
                });
            });

            return (totalMargin / totalRevenue) * 100;
        },

        // YoY Growth
        getYoYGrowth: () => {
            const currentRevenue = SalesData.calculate.getTotalRevenue('ytd');
            let previousRevenue = 0;
            SalesData.regions.forEach(region => {
                previousRevenue += SalesData.previousYearSales[region].total;
            });
            return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
        },

        // Target vs Actual
        getTargetVsActual: (region) => {
            const actual = SalesData.calculate.getUnitsByRegion(region, 'ytd');
            const target = SalesData.targets[region];
            return (actual / target) * 100;
        },

        // Top dealer by region
        getTopDealerByRegion: (region) => {
            return SalesData.dealers
                .filter(d => d.region === region)
                .sort((a, b) => b.revenue - a.revenue)[0];
        },

        // Regional rank
        getRegionalRank: (region) => {
            const regionRevenues = SalesData.regions.map(r => ({
                region: r,
                revenue: SalesData.calculate.getRevenueByRegion(r, 'ytd')
            }));
            regionRevenues.sort((a, b) => b.revenue - a.revenue);
            return regionRevenues.findIndex(r => r.region === region) + 1;
        },

        // Model breakdown for pie chart
        getModelBreakdown: (dateRange = 'ytd') => {
            return SalesData.models.map(model => ({
                id: model.id,
                name: model.name,
                units: SalesData.calculate.getUnitsByModel(model.id, dateRange),
                revenue: SalesData.calculate.getRevenueByModel(model.id, dateRange),
                color: model.color
            }));
        },

        // Regional comparison
        getRegionalComparison: (dateRange = 'ytd') => {
            return SalesData.regions.map(region => ({
                region: region,
                revenue: SalesData.calculate.getRevenueByRegion(region, dateRange),
                units: SalesData.calculate.getUnitsByRegion(region, dateRange),
                targetPct: SalesData.calculate.getTargetVsActual(region)
            }));
        }
    },

    // Get months array for date range
    getMonthsForRange: (dateRange) => {
        switch (dateRange) {
            case 'q1': return [0, 1, 2];
            case 'q2': return [3, 4, 5];
            case 'q3': return [6, 7, 8];
            case 'q4': return [9, 10, 11];
            case 'ytd':
            default: return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        }
    },

    // Get quarter name
    getQuarterName: (dateRange) => {
        const names = {
            'q1': 'Q1 2024',
            'q2': 'Q2 2024',
            'q3': 'Q3 2024',
            'q4': 'Q4 2024',
            'ytd': 'Year to Date'
        };
        return names[dateRange] || 'Year to Date';
    }
};

// Export for use in other modules
window.SalesData = SalesData;
