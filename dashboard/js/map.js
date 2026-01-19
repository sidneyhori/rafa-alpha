/**
 * Velocity Motors - Interactive USA Map
 * SVG-based regional performance visualization
 */

const USAMap = {
    selectedRegion: 'all',
    tooltip: null,

    // SVG path data for each region (simplified)
    regionPaths: {
        'West': 'M 50 80 L 180 80 L 180 50 L 220 50 L 220 180 L 180 180 L 180 280 L 50 280 Z',
        'Southwest': 'M 180 180 L 220 180 L 320 180 L 320 320 L 180 320 L 180 280 Z',
        'Midwest': 'M 220 50 L 380 50 L 380 180 L 320 180 L 220 180 Z',
        'Southeast': 'M 320 180 L 500 180 L 500 320 L 320 320 Z',
        'Northeast': 'M 380 50 L 520 50 L 520 180 L 500 180 L 380 180 Z'
    },

    // Region center points for labels
    regionCenters: {
        'West': { x: 115, y: 165 },
        'Southwest': { x: 250, y: 250 },
        'Midwest': { x: 300, y: 115 },
        'Southeast': { x: 410, y: 250 },
        'Northeast': { x: 450, y: 115 }
    },

    // Initialize the map
    init: () => {
        USAMap.tooltip = document.getElementById('tooltip');
        USAMap.createMap();
        USAMap.bindEvents();
    },

    // Create SVG map
    createMap: () => {
        const container = document.getElementById('mapContainer');
        if (!container) return;

        const dateRange = document.getElementById('dateRange')?.value || 'ytd';
        const regionalData = SalesData.calculate.getRegionalComparison(dateRange);

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 570 370');
        svg.setAttribute('id', 'usaMap');

        // Add gradient definitions
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        // Create gradient for each performance level
        const gradients = [
            { id: 'high', colors: ['#00d26a', '#00a854'] },
            { id: 'medium', colors: ['#ffc107', '#e5a800'] },
            { id: 'low', colors: ['#e82127', '#c41c21'] }
        ];

        gradients.forEach(g => {
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', `gradient-${g.id}`);
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '100%');
            gradient.setAttribute('y2', '100%');

            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('stop-color', g.colors[0]);

            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '100%');
            stop2.setAttribute('stop-color', g.colors[1]);

            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            defs.appendChild(gradient);
        });

        // Add glow filter
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'glow');
        filter.innerHTML = `
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        `;
        defs.appendChild(filter);

        svg.appendChild(defs);

        // Create region paths
        Object.keys(USAMap.regionPaths).forEach(region => {
            const regionStats = regionalData.find(r => r.region === region);
            const performance = USAMap.getPerformanceLevel(regionStats?.targetPct || 0);

            // Create group for region
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('class', 'region-group');
            group.setAttribute('data-region', region);

            // Create path
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', USAMap.regionPaths[region]);
            path.setAttribute('fill', `url(#gradient-${performance})`);
            path.setAttribute('stroke', '#2a2a2a');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('class', 'region-path');
            path.setAttribute('data-region', region);
            path.style.cursor = 'pointer';
            path.style.transition = 'all 0.3s ease';

            // Create label
            const center = USAMap.regionCenters[region];

            // Region name
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', center.x);
            text.setAttribute('y', center.y - 10);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#ffffff');
            text.setAttribute('font-size', '14');
            text.setAttribute('font-weight', '600');
            text.setAttribute('font-family', 'Inter, sans-serif');
            text.setAttribute('pointer-events', 'none');
            text.textContent = region;

            // Revenue label
            const revenueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            revenueText.setAttribute('x', center.x);
            revenueText.setAttribute('y', center.y + 10);
            revenueText.setAttribute('text-anchor', 'middle');
            revenueText.setAttribute('fill', 'rgba(255,255,255,0.8)');
            revenueText.setAttribute('font-size', '12');
            revenueText.setAttribute('font-weight', '500');
            revenueText.setAttribute('font-family', 'Inter, sans-serif');
            revenueText.setAttribute('pointer-events', 'none');
            revenueText.textContent = SalesData.utils.formatCurrency(regionStats?.revenue || 0);

            // Target percentage
            const targetText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            targetText.setAttribute('x', center.x);
            targetText.setAttribute('y', center.y + 28);
            targetText.setAttribute('text-anchor', 'middle');
            targetText.setAttribute('fill', 'rgba(255,255,255,0.6)');
            targetText.setAttribute('font-size', '11');
            targetText.setAttribute('font-family', 'Inter, sans-serif');
            targetText.setAttribute('pointer-events', 'none');
            targetText.textContent = `${(regionStats?.targetPct || 0).toFixed(0)}% of target`;

            group.appendChild(path);
            group.appendChild(text);
            group.appendChild(revenueText);
            group.appendChild(targetText);
            svg.appendChild(group);
        });

        container.innerHTML = '';
        container.appendChild(svg);
    },

    // Get performance level based on target percentage
    getPerformanceLevel: (targetPct) => {
        if (targetPct >= 100) return 'high';
        if (targetPct >= 85) return 'medium';
        return 'low';
    },

    // Bind event listeners
    bindEvents: () => {
        const container = document.getElementById('mapContainer');
        if (!container) return;

        // Hover events
        container.addEventListener('mouseover', (e) => {
            const regionGroup = e.target.closest('.region-group');
            if (regionGroup) {
                const region = regionGroup.dataset.region;
                USAMap.showTooltip(e, region);
                USAMap.highlightRegion(region);
            }
        });

        container.addEventListener('mouseout', (e) => {
            const regionGroup = e.target.closest('.region-group');
            if (regionGroup) {
                USAMap.hideTooltip();
                USAMap.unhighlightRegion(regionGroup.dataset.region);
            }
        });

        container.addEventListener('mousemove', (e) => {
            if (USAMap.tooltip && !USAMap.tooltip.classList.contains('hidden')) {
                USAMap.tooltip.style.left = (e.pageX + 15) + 'px';
                USAMap.tooltip.style.top = (e.pageY + 15) + 'px';
            }
        });

        // Click events
        container.addEventListener('click', (e) => {
            const regionGroup = e.target.closest('.region-group');
            if (regionGroup) {
                const region = regionGroup.dataset.region;
                USAMap.selectRegion(region);
            }
        });

        // Region selector
        const regionSelect = document.getElementById('regionSelect');
        if (regionSelect) {
            regionSelect.addEventListener('change', (e) => {
                const region = e.target.value;
                if (region === 'all') {
                    USAMap.deselectAll();
                } else {
                    USAMap.selectRegion(region);
                }
            });
        }
    },

    // Show tooltip
    showTooltip: (e, region) => {
        if (!USAMap.tooltip) return;

        const dateRange = document.getElementById('dateRange')?.value || 'ytd';
        const revenue = SalesData.calculate.getRevenueByRegion(region, dateRange);
        const units = SalesData.calculate.getUnitsByRegion(region, dateRange);
        const targetPct = SalesData.calculate.getTargetVsActual(region);
        const topDealer = SalesData.calculate.getTopDealerByRegion(region);

        USAMap.tooltip.innerHTML = `
            <div class="tooltip-title">${region} Region</div>
            <div style="margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #a0a0a0;">Revenue:</span>
                    <span class="tooltip-value">${SalesData.utils.formatCurrency(revenue)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #a0a0a0;">Units Sold:</span>
                    <span style="color: #fff;">${SalesData.utils.formatNumber(units)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #a0a0a0;">Target:</span>
                    <span style="color: ${targetPct >= 100 ? '#00d26a' : targetPct >= 85 ? '#ffc107' : '#e82127'};">${targetPct.toFixed(1)}%</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #a0a0a0;">Top Dealer:</span>
                    <span style="color: #fff;">${topDealer?.name || 'N/A'}</span>
                </div>
            </div>
        `;

        USAMap.tooltip.classList.remove('hidden');
        USAMap.tooltip.style.left = (e.pageX + 15) + 'px';
        USAMap.tooltip.style.top = (e.pageY + 15) + 'px';
    },

    // Hide tooltip
    hideTooltip: () => {
        if (USAMap.tooltip) {
            USAMap.tooltip.classList.add('hidden');
        }
    },

    // Highlight region on hover
    highlightRegion: (region) => {
        const path = document.querySelector(`.region-path[data-region="${region}"]`);
        if (path) {
            path.style.filter = 'url(#glow)';
            path.style.transform = 'scale(1.02)';
            path.style.transformOrigin = 'center';
        }
    },

    // Remove highlight
    unhighlightRegion: (region) => {
        const path = document.querySelector(`.region-path[data-region="${region}"]`);
        if (path && region !== USAMap.selectedRegion) {
            path.style.filter = 'none';
            path.style.transform = 'scale(1)';
        }
    },

    // Select a region
    selectRegion: (region) => {
        USAMap.selectedRegion = region;

        // Update region selector
        const regionSelect = document.getElementById('regionSelect');
        if (regionSelect) {
            regionSelect.value = region.toLowerCase();
        }

        // Update visual state
        document.querySelectorAll('.region-path').forEach(path => {
            if (path.dataset.region === region) {
                path.style.filter = 'url(#glow)';
                path.style.strokeWidth = '3';
            } else {
                path.style.filter = 'none';
                path.style.opacity = '0.5';
                path.style.strokeWidth = '2';
            }
        });

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('regionSelected', { detail: { region } }));
    },

    // Deselect all regions
    deselectAll: () => {
        USAMap.selectedRegion = 'all';

        document.querySelectorAll('.region-path').forEach(path => {
            path.style.filter = 'none';
            path.style.opacity = '1';
            path.style.strokeWidth = '2';
        });

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('regionSelected', { detail: { region: 'all' } }));
    },

    // Update map with new date range
    updateDateRange: (dateRange) => {
        USAMap.createMap();
        if (USAMap.selectedRegion !== 'all') {
            USAMap.selectRegion(USAMap.selectedRegion);
        }
    }
};

// Export for use in other modules
window.USAMap = USAMap;
