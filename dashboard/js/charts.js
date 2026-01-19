/**
 * Velocity Motors - Chart Visualizations
 * Using Chart.js for beautiful, interactive charts
 */

const Charts = {
    instances: {},
    currentMetric: 'revenue',

    // Get theme-aware colors from CSS variables
    getThemeColors: () => {
        const style = getComputedStyle(document.documentElement);
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';

        return {
            gridColor: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.05)',
            tickColor: style.getPropertyValue('--text-tertiary').trim() || '#666666',
            tooltipBg: style.getPropertyValue('--bg-card').trim() || '#1f1f1f',
            tooltipTitle: style.getPropertyValue('--text-primary').trim() || '#ffffff',
            tooltipBody: style.getPropertyValue('--text-secondary').trim() || '#a0a0a0',
            borderColor: style.getPropertyValue('--border-color').trim() || '#2a2a2a',
            pointBorder: isLight ? '#ffffff' : '#ffffff'
        };
    },

    // Chart.js default configuration (dynamic)
    getDefaults: () => {
        const colors = Charts.getThemeColors();
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipTitle,
                    bodyColor: colors.tooltipBody,
                    borderColor: colors.borderColor,
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {}
                }
            }
        };
    },

    // Legacy defaults property for compatibility
    defaults: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1f1f1f',
                titleColor: '#ffffff',
                bodyColor: '#a0a0a0',
                borderColor: '#2a2a2a',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {}
            }
        }
    },

    // Initialize all charts
    init: (dateRange = 'ytd') => {
        Charts.createSalesTrendChart(dateRange);
        Charts.createModelChart(dateRange);
        Charts.createRegionalChart(dateRange);
    },

    // Sales Trend Line Chart
    createSalesTrendChart: (dateRange = 'ytd') => {
        const ctx = document.getElementById('salesTrendChart');
        if (!ctx) return;

        // Destroy existing chart
        if (Charts.instances.salesTrend) {
            Charts.instances.salesTrend.destroy();
        }

        const trendData = SalesData.calculate.getMonthlyTrend(Charts.currentMetric, dateRange);
        const colors = Charts.getThemeColors();
        const defaults = Charts.getDefaults();

        Charts.instances.salesTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.map(d => d.month),
                datasets: [{
                    label: Charts.currentMetric === 'revenue' ? 'Revenue' : 'Units Sold',
                    data: trendData.map(d => d.value),
                    borderColor: '#e82127',
                    backgroundColor: 'rgba(232, 33, 39, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#e82127',
                    pointBorderColor: colors.pointBorder,
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                ...defaults,
                scales: {
                    x: {
                        grid: {
                            color: colors.gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: {
                                family: 'Inter',
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: colors.gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            callback: function(value) {
                                if (Charts.currentMetric === 'revenue') {
                                    return SalesData.utils.formatCurrency(value);
                                }
                                return SalesData.utils.formatNumber(value);
                            }
                        }
                    }
                },
                plugins: {
                    ...Charts.defaults.plugins,
                    tooltip: {
                        ...Charts.defaults.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                if (Charts.currentMetric === 'revenue') {
                                    return 'Revenue: ' + SalesData.utils.formatCurrency(value);
                                }
                                return 'Units: ' + SalesData.utils.formatNumber(value);
                            }
                        }
                    }
                }
            }
        });
    },

    // Model Breakdown Donut Chart
    createModelChart: (dateRange = 'ytd') => {
        const ctx = document.getElementById('modelChart');
        if (!ctx) return;

        // Destroy existing chart
        if (Charts.instances.model) {
            Charts.instances.model.destroy();
        }

        const modelData = SalesData.calculate.getModelBreakdown(dateRange);
        const colors = Charts.getThemeColors();
        const defaults = Charts.getDefaults();

        Charts.instances.model = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: modelData.map(d => d.name),
                datasets: [{
                    data: modelData.map(d => d.units),
                    backgroundColor: modelData.map(d => d.color),
                    borderColor: colors.tooltipBg,
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },
            options: {
                ...defaults,
                cutout: '65%',
                plugins: {
                    ...defaults.plugins,
                    tooltip: {
                        ...defaults.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const data = modelData[context.dataIndex];
                                const total = modelData.reduce((sum, d) => sum + d.units, 0);
                                const percentage = ((data.units / total) * 100).toFixed(1);
                                return [
                                    `Units: ${SalesData.utils.formatNumber(data.units)}`,
                                    `Revenue: ${SalesData.utils.formatCurrency(data.revenue)}`,
                                    `Share: ${percentage}%`
                                ];
                            }
                        }
                    }
                }
            }
        });

        // Update legend
        Charts.updateModelLegend(modelData);
    },

    // Update Model Legend
    updateModelLegend: (modelData) => {
        const legendContainer = document.getElementById('modelLegend');
        if (!legendContainer) return;

        const total = modelData.reduce((sum, d) => sum + d.units, 0);

        legendContainer.innerHTML = modelData.map(model => {
            const percentage = ((model.units / total) * 100).toFixed(1);
            return `
                <div class="model-legend-item">
                    <span class="legend-dot" style="background: ${model.color}"></span>
                    <span>${model.name.replace('Model ', '')} (${percentage}%)</span>
                </div>
            `;
        }).join('');
    },

    // Regional Comparison Bar Chart
    createRegionalChart: (dateRange = 'ytd') => {
        const ctx = document.getElementById('regionalChart');
        if (!ctx) return;

        // Destroy existing chart
        if (Charts.instances.regional) {
            Charts.instances.regional.destroy();
        }

        const regionalData = SalesData.calculate.getRegionalComparison(dateRange);
        const colors = Charts.getThemeColors();
        const defaults = Charts.getDefaults();

        Charts.instances.regional = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: regionalData.map(d => d.region),
                datasets: [{
                    label: 'Revenue',
                    data: regionalData.map(d => d.revenue),
                    backgroundColor: regionalData.map(d => {
                        // Color based on target performance
                        if (d.targetPct >= 100) return '#00d26a';
                        if (d.targetPct >= 85) return '#ffc107';
                        return '#e82127';
                    }),
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                ...defaults,
                indexAxis: 'y',
                scales: {
                    x: {
                        grid: {
                            color: colors.gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            callback: function(value) {
                                return SalesData.utils.formatCurrency(value);
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: colors.tooltipBody,
                            font: {
                                family: 'Inter',
                                size: 12,
                                weight: '500'
                            }
                        }
                    }
                },
                plugins: {
                    ...defaults.plugins,
                    tooltip: {
                        ...defaults.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const data = regionalData[context.dataIndex];
                                return [
                                    `Revenue: ${SalesData.utils.formatCurrency(data.revenue)}`,
                                    `Units: ${SalesData.utils.formatNumber(data.units)}`,
                                    `Target: ${data.targetPct.toFixed(1)}%`
                                ];
                            }
                        }
                    }
                }
            }
        });
    },

    // Update chart metric (revenue vs units)
    setMetric: (metric) => {
        Charts.currentMetric = metric;
        const dateRange = document.getElementById('dateRange')?.value || 'ytd';
        Charts.createSalesTrendChart(dateRange);
    },

    // Update all charts with new date range
    updateDateRange: (dateRange) => {
        Charts.createSalesTrendChart(dateRange);
        Charts.createModelChart(dateRange);
        Charts.createRegionalChart(dateRange);
    },

    // Destroy all charts
    destroy: () => {
        Object.values(Charts.instances).forEach(chart => {
            if (chart) chart.destroy();
        });
        Charts.instances = {};
    }
};

// Export for use in other modules
window.Charts = Charts;
