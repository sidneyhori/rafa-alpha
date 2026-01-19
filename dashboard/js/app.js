/**
 * Velocity Motors - Main Application Logic
 * Initializes dashboard and handles user interactions
 */

const App = {
    currentView: 'vp',
    currentRegion: 'all',
    dateRange: 'ytd',

    // Initialize the application
    init: () => {
        console.log('Velocity Motors Dashboard - Initializing...');

        // Load saved preferences
        App.loadPreferences();

        // Initialize components
        Charts.init(App.dateRange);
        USAMap.init();
        Chat.init();

        // Bind event listeners
        App.bindEvents();

        // Update KPIs
        App.updateKPIs();

        // Update model cards
        App.updateModelCards();

        // Update leaderboard
        App.updateLeaderboard();

        // Animate on load
        App.animateOnLoad();

        console.log('Dashboard initialized successfully!');
    },

    // Load user preferences from localStorage
    loadPreferences: () => {
        const savedView = localStorage.getItem('vm-view');
        const savedDateRange = localStorage.getItem('vm-dateRange');

        if (savedView) {
            App.currentView = savedView;
        }

        if (savedDateRange) {
            App.dateRange = savedDateRange;
            const dateSelect = document.getElementById('dateRange');
            if (dateSelect) dateSelect.value = savedDateRange;
        }
    },

    // Save user preferences to localStorage
    savePreferences: () => {
        localStorage.setItem('vm-view', App.currentView);
        localStorage.setItem('vm-dateRange', App.dateRange);
    },

    // Bind event listeners
    bindEvents: () => {
        // View toggle buttons
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                App.switchView(view);
            });
        });

        // Date range selector
        const dateSelect = document.getElementById('dateRange');
        if (dateSelect) {
            dateSelect.addEventListener('change', (e) => {
                App.setDateRange(e.target.value);
            });
        }

        // Chart filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                Charts.setMetric(btn.dataset.filter);
            });
        });

        // Region selection event
        window.addEventListener('regionSelected', (e) => {
            App.currentRegion = e.detail.region;
            if (App.currentView === 'regional') {
                App.updateRegionalKPIs(e.detail.region);
            }
        });

        // Model card clicks
        const modelCards = document.querySelectorAll('.model-card');
        modelCards.forEach(card => {
            card.addEventListener('click', () => {
                const model = card.dataset.model;
                App.showModelDetails(model);
            });
        });

        // View all dealers
        const viewAll = document.querySelector('.view-all');
        if (viewAll) {
            viewAll.addEventListener('click', App.showAllDealers);
        }
    },

    // Switch between VP and Regional views
    switchView: (view) => {
        App.currentView = view;

        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Toggle KPI sections
        const vpKpis = document.querySelector('.vp-kpis');
        const regKpis = document.querySelector('.regional-kpis');

        if (vpKpis && regKpis) {
            vpKpis.classList.toggle('hidden', view === 'regional');
            regKpis.classList.toggle('hidden', view === 'vp');
        }

        // Update appropriate KPIs
        if (view === 'vp') {
            App.updateKPIs();
        } else {
            App.updateRegionalKPIs(App.currentRegion !== 'all' ? App.currentRegion : 'West');
        }

        App.savePreferences();
    },

    // Set date range
    setDateRange: (range) => {
        App.dateRange = range;

        // Update all components
        App.updateKPIs();
        App.updateModelCards();
        Charts.updateDateRange(range);
        USAMap.updateDateRange(range);

        if (App.currentView === 'regional') {
            App.updateRegionalKPIs(App.currentRegion !== 'all' ? App.currentRegion : 'West');
        }

        App.savePreferences();
    },

    // Update VP KPIs
    updateKPIs: () => {
        const range = App.dateRange;

        // Total Revenue
        const revenue = SalesData.calculate.getTotalRevenue(range);
        App.animateValue('kpi-revenue', SalesData.utils.formatCurrency(revenue));

        // Total Units
        const units = SalesData.calculate.getTotalUnits(range);
        App.animateValue('kpi-units', SalesData.utils.formatNumber(units));

        // YoY Growth
        const growth = SalesData.calculate.getYoYGrowth();
        App.animateValue('kpi-growth', growth.toFixed(1) + '%');
        App.updateChangeIndicator('kpi-growth-change', growth, '+' + growth.toFixed(1) + '% vs LY');

        // Average Selling Price
        const asp = SalesData.calculate.getAverageSellingPrice(range);
        App.animateValue('kpi-asp', SalesData.utils.formatCurrency(asp));

        // Gross Margin
        const margin = SalesData.calculate.getGrossMargin(range);
        App.animateValue('kpi-margin', margin.toFixed(1) + '%');

        // Market Share
        const share = SalesData.marketShare.current;
        App.animateValue('kpi-share', share + '%');
        const shareChange = share - SalesData.marketShare.previous;
        App.updateChangeIndicator('kpi-share-change', shareChange, (shareChange > 0 ? '+' : '') + shareChange.toFixed(1) + '% vs LY');

        // Update change indicators
        App.updateChangeIndicator('kpi-revenue-change', 12.5, '+12.5% vs LY');
        App.updateChangeIndicator('kpi-units-change', 8.3, '+8.3% vs LY');
        App.updateChangeIndicator('kpi-asp-change', 3.8, '+3.8% vs LY');
        App.updateChangeIndicator('kpi-margin-change', 0.5, '+0.5% vs LY');
    },

    // Update Regional KPIs
    updateRegionalKPIs: (region) => {
        if (region === 'all') region = 'West'; // Default to West

        const range = App.dateRange;

        // Regional Revenue
        const revenue = SalesData.calculate.getRevenueByRegion(region, range);
        App.animateValue('kpi-reg-revenue', SalesData.utils.formatCurrency(revenue));

        // Regional Units
        const units = SalesData.calculate.getUnitsByRegion(region, range);
        App.animateValue('kpi-reg-units', SalesData.utils.formatNumber(units));

        // Target vs Actual
        const targetPct = SalesData.calculate.getTargetVsActual(region);
        App.animateValue('kpi-reg-target', targetPct.toFixed(1) + '%');
        const targetStatus = targetPct >= 100 ? 'Exceeding' : targetPct >= 85 ? 'On Track' : 'Behind';
        App.updateChangeIndicator('kpi-reg-target-change', targetPct - 100, targetStatus);

        // Top Dealer
        const topDealer = SalesData.calculate.getTopDealerByRegion(region);
        App.animateValue('kpi-reg-dealer', topDealer.name.split(' ').slice(0, 2).join(' '));
        document.getElementById('kpi-reg-dealer-change').textContent = SalesData.utils.formatCurrency(topDealer.revenue);

        // Inventory
        const inventory = SalesData.inventory[region];
        App.animateValue('kpi-reg-inventory', SalesData.utils.formatNumber(inventory));

        // Regional Rank
        const rank = SalesData.calculate.getRegionalRank(region);
        App.animateValue('kpi-reg-rank', '#' + rank);
    },

    // Animate value change
    animateValue: (elementId, newValue) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';

        setTimeout(() => {
            element.textContent = newValue;
            element.style.transition = 'all 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 150);
    },

    // Update change indicator
    updateChangeIndicator: (elementId, value, text) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.textContent = text;
        element.classList.remove('positive', 'negative', 'neutral');

        if (value > 0) {
            element.classList.add('positive');
        } else if (value < 0) {
            element.classList.add('negative');
        } else {
            element.classList.add('neutral');
        }
    },

    // Update model cards
    updateModelCards: () => {
        const range = App.dateRange;

        SalesData.models.forEach(model => {
            const units = SalesData.calculate.getUnitsByModel(model.id, range);
            const revenue = SalesData.calculate.getRevenueByModel(model.id, range);

            const unitsEl = document.getElementById(`${model.id}-units`);
            const revenueEl = document.getElementById(`${model.id}-revenue`);

            if (unitsEl) unitsEl.textContent = SalesData.utils.formatNumber(units);
            if (revenueEl) revenueEl.textContent = SalesData.utils.formatCurrency(revenue);
        });
    },

    // Update dealer leaderboard
    updateLeaderboard: () => {
        const tbody = document.getElementById('leaderboardBody');
        if (!tbody) return;

        const topDealers = SalesData.dealers.slice(0, 10);

        tbody.innerHTML = topDealers.map((dealer, index) => `
            <tr>
                <td class="rank ${index < 3 ? 'rank-' + (index + 1) : ''}">#${dealer.rank}</td>
                <td>${dealer.name}</td>
                <td>${dealer.region}</td>
                <td>${SalesData.utils.formatCurrency(dealer.revenue)}</td>
                <td>${dealer.units}</td>
            </tr>
        `).join('');
    },

    // Show model details (could open a modal)
    showModelDetails: (modelId) => {
        const model = SalesData.models.find(m => m.id === modelId);
        if (!model) return;

        // For now, just log - could be expanded to show a modal
        console.log('Model Details:', model);

        // Trigger chat with model info
        const chatInput = document.getElementById('chatInput');
        const chatPanel = document.getElementById('chatPanel');

        if (chatInput && chatPanel) {
            chatInput.value = `Tell me about ${model.name}`;
            if (chatPanel.classList.contains('hidden')) {
                Chat.togglePanel();
            }
            setTimeout(() => Chat.sendMessage(), 300);
        }
    },

    // Show all dealers (could open a modal)
    showAllDealers: () => {
        console.log('Show all dealers - implement modal');

        // Trigger chat with dealer info
        const chatInput = document.getElementById('chatInput');
        const chatPanel = document.getElementById('chatPanel');

        if (chatInput && chatPanel) {
            chatInput.value = 'Show me dealer rankings';
            if (chatPanel.classList.contains('hidden')) {
                Chat.togglePanel();
            }
            setTimeout(() => Chat.sendMessage(), 300);
        }
    },

    // Animate elements on page load
    animateOnLoad: () => {
        // Animate KPI cards
        const kpiCards = document.querySelectorAll('.kpi-card');
        kpiCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + index * 50);
        });

        // Animate viz cards
        const vizCards = document.querySelectorAll('.viz-card');
        vizCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 400 + index * 100);
        });

        // Animate model cards
        const modelCards = document.querySelectorAll('.model-card');
        modelCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 800 + index * 75);
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);

// Export for use in other modules
window.App = App;
