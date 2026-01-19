/**
 * Velocity Motors - Simulated AI Chat
 * Keyword-based intelligent responses for common queries
 */

const Chat = {
    isOpen: false,
    isTyping: false,
    messages: [],

    // Keyword patterns and responses
    responses: {
        // Best selling model
        bestSelling: {
            patterns: ['best sell', 'top model', 'most popular', 'best model', 'top sell', 'highest sell'],
            getResponse: () => {
                const models = SalesData.calculate.getModelBreakdown('ytd');
                const sorted = [...models].sort((a, b) => b.units - a.units);
                const best = sorted[0];
                const total = models.reduce((sum, m) => sum + m.units, 0);
                const pct = ((best.units / total) * 100).toFixed(1);

                return `Our best-selling model is the <strong>${best.name}</strong> with <strong>${SalesData.utils.formatNumber(best.units)} units</strong> sold this year, representing ${pct}% of total sales. It has generated <strong>${SalesData.utils.formatCurrency(best.revenue)}</strong> in revenue. The Model Pulse leads due to its competitive mid-range pricing at $45,000.`;
            }
        },

        // Region performance
        regionPerformance: {
            patterns: ['region', 'west', 'east', 'midwest', 'southwest', 'southeast', 'northeast', 'area'],
            getResponse: (query) => {
                let region = null;
                const lowerQuery = query.toLowerCase();

                if (lowerQuery.includes('west') && !lowerQuery.includes('south') && !lowerQuery.includes('mid')) {
                    region = 'West';
                } else if (lowerQuery.includes('southwest')) {
                    region = 'Southwest';
                } else if (lowerQuery.includes('midwest')) {
                    region = 'Midwest';
                } else if (lowerQuery.includes('southeast')) {
                    region = 'Southeast';
                } else if (lowerQuery.includes('northeast') || lowerQuery.includes('east')) {
                    region = 'Northeast';
                }

                if (region) {
                    const revenue = SalesData.calculate.getRevenueByRegion(region, 'ytd');
                    const units = SalesData.calculate.getUnitsByRegion(region, 'ytd');
                    const targetPct = SalesData.calculate.getTargetVsActual(region);
                    const rank = SalesData.calculate.getRegionalRank(region);
                    const topDealer = SalesData.calculate.getTopDealerByRegion(region);

                    const status = targetPct >= 100 ? 'exceeding targets' : targetPct >= 85 ? 'on track' : 'below target';

                    return `The <strong>${region}</strong> region is ${status} at <strong>${targetPct.toFixed(1)}%</strong> of annual target.

Key metrics:
• Revenue: <strong>${SalesData.utils.formatCurrency(revenue)}</strong>
• Units Sold: <strong>${SalesData.utils.formatNumber(units)}</strong>
• Regional Rank: <strong>#${rank}</strong> of 5 regions
• Top Dealer: <strong>${topDealer.name}</strong> (${topDealer.city})

${targetPct >= 100 ? 'Great performance! This region is leading our sales efforts.' : 'There may be opportunities to boost performance through targeted marketing campaigns.'}`;
                }

                // General regional overview
                const comparison = SalesData.calculate.getRegionalComparison('ytd');
                const sorted = [...comparison].sort((a, b) => b.revenue - a.revenue);

                return `Here's our regional performance overview:

${sorted.map((r, i) => `${i + 1}. <strong>${r.region}</strong>: ${SalesData.utils.formatCurrency(r.revenue)} (${r.targetPct.toFixed(0)}% of target)`).join('\n')}

The <strong>${sorted[0].region}</strong> region is our top performer, while <strong>${sorted[4].region}</strong> has the most room for improvement.`;
            }
        },

        // Quarterly breakdown
        quarterly: {
            patterns: ['q1', 'q2', 'q3', 'q4', 'quarter', 'breakdown'],
            getResponse: (query) => {
                const lowerQuery = query.toLowerCase();
                let quarter = null;

                if (lowerQuery.includes('q1')) quarter = 'q1';
                else if (lowerQuery.includes('q2')) quarter = 'q2';
                else if (lowerQuery.includes('q3')) quarter = 'q3';
                else if (lowerQuery.includes('q4')) quarter = 'q4';

                if (quarter) {
                    const revenue = SalesData.calculate.getTotalRevenue(quarter);
                    const units = SalesData.calculate.getTotalUnits(quarter);
                    const quarterName = SalesData.getQuarterName(quarter);

                    return `<strong>${quarterName}</strong> Performance:

• Total Revenue: <strong>${SalesData.utils.formatCurrency(revenue)}</strong>
• Total Units: <strong>${SalesData.utils.formatNumber(units)}</strong>
• Average Sale: <strong>${SalesData.utils.formatCurrency(revenue / units)}</strong>

${quarter === 'q3' ? 'Q3 shows our strongest summer performance with increased SUV demand.' : quarter === 'q4' ? 'Q4 includes year-end promotions driving higher sales volumes.' : 'This quarter shows steady performance across all models.'}`;
                }

                // Compare quarters
                const quarters = ['q1', 'q2', 'q3', 'q4'];
                const quarterData = quarters.map(q => ({
                    name: SalesData.getQuarterName(q),
                    revenue: SalesData.calculate.getTotalRevenue(q),
                    units: SalesData.calculate.getTotalUnits(q)
                }));

                return `Quarterly Comparison:

${quarterData.map(q => `• <strong>${q.name}</strong>: ${SalesData.utils.formatCurrency(q.revenue)} (${SalesData.utils.formatNumber(q.units)} units)`).join('\n')}

<strong>Q3</strong> was our strongest quarter driven by summer promotions and new Model Terra inventory.`;
            }
        },

        // YoY Growth
        yoyGrowth: {
            patterns: ['yoy', 'year over year', 'growth', 'compare', 'last year', 'previous'],
            getResponse: () => {
                const growth = SalesData.calculate.getYoYGrowth();
                const currentRevenue = SalesData.calculate.getTotalRevenue('ytd');
                let previousRevenue = 0;
                SalesData.regions.forEach(region => {
                    previousRevenue += SalesData.previousYearSales[region].total;
                });

                const growthStatus = growth > 0 ? 'up' : 'down';
                const growthColor = growth > 0 ? 'positive' : 'negative';

                return `Year-over-Year Performance:

• <strong>2024 Revenue:</strong> ${SalesData.utils.formatCurrency(currentRevenue)}
• <strong>2023 Revenue:</strong> ${SalesData.utils.formatCurrency(previousRevenue)}
• <strong>YoY Growth:</strong> <span class="${growthColor}">${growth > 0 ? '+' : ''}${growth.toFixed(1)}%</span>

We're ${growthStatus} <strong>${Math.abs(growth).toFixed(1)}%</strong> compared to last year! ${growth > 10 ? 'Excellent growth driven by strong Model Venture and Terra demand.' : growth > 0 ? 'Steady growth with room for improvement in Q4.' : 'We need to focus on increasing market penetration.'}`;
            }
        },

        // Dealer rankings
        dealers: {
            patterns: ['dealer', 'top dealer', 'ranking', 'leaderboard', 'best dealer'],
            getResponse: () => {
                const topDealers = SalesData.dealers.slice(0, 5);

                return `Top 5 Dealers by Revenue:

${topDealers.map((d, i) => `${i + 1}. <strong>${d.name}</strong> (${d.region})
   ${SalesData.utils.formatCurrency(d.revenue)} | ${d.units} units`).join('\n\n')}

Our top dealer, <strong>${topDealers[0].name}</strong>, accounts for ${((topDealers[0].revenue / SalesData.calculate.getTotalRevenue('ytd')) * 100).toFixed(1)}% of total revenue.`;
            }
        },

        // Revenue info
        revenue: {
            patterns: ['revenue', 'sales', 'money', 'total', 'how much'],
            getResponse: () => {
                const revenue = SalesData.calculate.getTotalRevenue('ytd');
                const units = SalesData.calculate.getTotalUnits('ytd');
                const asp = SalesData.calculate.getAverageSellingPrice('ytd');

                return `Total Sales Performance (YTD):

• <strong>Total Revenue:</strong> ${SalesData.utils.formatCurrency(revenue)}
• <strong>Total Units:</strong> ${SalesData.utils.formatNumber(units)}
• <strong>Average Selling Price:</strong> ${SalesData.utils.formatCurrency(asp)}

We're on track to exceed $4B in annual revenue for the first time!`;
            }
        },

        // Model info
        modelInfo: {
            patterns: ['apex', 'venture', 'pulse', 'terra', 'bolt', 'model info', 'about model'],
            getResponse: (query) => {
                const lowerQuery = query.toLowerCase();
                let modelId = null;

                if (lowerQuery.includes('apex')) modelId = 'apex';
                else if (lowerQuery.includes('venture')) modelId = 'venture';
                else if (lowerQuery.includes('pulse')) modelId = 'pulse';
                else if (lowerQuery.includes('terra')) modelId = 'terra';
                else if (lowerQuery.includes('bolt')) modelId = 'bolt';

                if (modelId) {
                    const model = SalesData.models.find(m => m.id === modelId);
                    const units = SalesData.calculate.getUnitsByModel(modelId, 'ytd');
                    const revenue = SalesData.calculate.getRevenueByModel(modelId, 'ytd');
                    const margin = SalesData.grossMargins[modelId] * 100;

                    return `<strong>${model.name}</strong> - ${model.category}

• <strong>Price:</strong> ${SalesData.utils.formatCurrency(model.price)}
• <strong>Units Sold (YTD):</strong> ${SalesData.utils.formatNumber(units)}
• <strong>Revenue:</strong> ${SalesData.utils.formatCurrency(revenue)}
• <strong>Gross Margin:</strong> ${margin}%

${modelId === 'bolt' ? 'Our flagship sports car with the highest margin.' : modelId === 'apex' ? 'Premium luxury sedan targeting executive customers.' : modelId === 'venture' ? 'Our most versatile SUV for families.' : modelId === 'pulse' ? 'Best-selling mid-range sedan for everyday drivers.' : 'Compact SUV perfect for urban environments.'}`;
                }

                return `We offer 5 vehicle models:

${SalesData.models.map(m => `• <strong>${m.name}</strong>: ${m.category} - ${SalesData.utils.formatCurrency(m.price)}`).join('\n')}

Ask about any specific model for detailed performance data!`;
            }
        },

        // Market share
        marketShare: {
            patterns: ['market share', 'competition', 'competitor', 'industry'],
            getResponse: () => {
                const share = SalesData.marketShare;

                return `Market Position:

• <strong>Current Share:</strong> ${share.current}%
• <strong>Previous Year:</strong> ${share.previous}%
• <strong>Change:</strong> +${(share.current - share.previous).toFixed(1)}%

Competitive Landscape:
${share.competitors.slice(0, 5).map(c => `• ${c.name}: ${c.share}%`).join('\n')}

We've gained <strong>${(share.current - share.previous).toFixed(1)} percentage points</strong> of market share this year!`;
            }
        },

        // Inventory
        inventory: {
            patterns: ['inventory', 'stock', 'available', 'units available'],
            getResponse: () => {
                const inv = SalesData.inventory;
                const total = Object.values(inv).reduce((sum, v) => sum + v, 0);

                return `Current Inventory Levels:

${SalesData.regions.map(r => `• <strong>${r}:</strong> ${SalesData.utils.formatNumber(inv[r])} units`).join('\n')}

<strong>Total Inventory:</strong> ${SalesData.utils.formatNumber(total)} units

The West region has the highest inventory to support California's strong demand.`;
            }
        },

        // Help
        help: {
            patterns: ['help', 'what can you', 'commands', 'questions'],
            getResponse: () => {
                return `I can help you with:

• <strong>Sales Data:</strong> "What's our total revenue?"
• <strong>Models:</strong> "Tell me about Model Apex"
• <strong>Regions:</strong> "How is the West region performing?"
• <strong>Dealers:</strong> "Show me dealer rankings"
• <strong>Quarterly:</strong> "Show me Q4 breakdown"
• <strong>Growth:</strong> "What's our YoY growth?"
• <strong>Market:</strong> "What's our market share?"
• <strong>Inventory:</strong> "Check inventory levels"

Just type your question naturally!`;
            }
        }
    },

    // Initialize chat
    init: () => {
        Chat.bindEvents();
    },

    // Bind event listeners
    bindEvents: () => {
        const toggle = document.getElementById('chatToggle');
        const close = document.getElementById('chatClose');
        const send = document.getElementById('chatSend');
        const input = document.getElementById('chatInput');
        const messages = document.getElementById('chatMessages');

        if (toggle) {
            toggle.addEventListener('click', Chat.togglePanel);
        }

        if (close) {
            close.addEventListener('click', Chat.closePanel);
        }

        if (send) {
            send.addEventListener('click', Chat.sendMessage);
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !Chat.isTyping) {
                    Chat.sendMessage();
                }
            });
        }

        // Suggestion clicks
        if (messages) {
            messages.addEventListener('click', (e) => {
                const suggestion = e.target.closest('li[data-query]');
                if (suggestion) {
                    const query = suggestion.dataset.query;
                    if (input) input.value = query;
                    Chat.sendMessage();
                }
            });
        }
    },

    // Toggle chat panel
    togglePanel: () => {
        const panel = document.getElementById('chatPanel');
        const badge = document.getElementById('chatBadge');

        if (panel) {
            Chat.isOpen = !Chat.isOpen;
            panel.classList.toggle('hidden', !Chat.isOpen);

            if (Chat.isOpen && badge) {
                badge.classList.add('hidden');
            }
        }
    },

    // Close chat panel
    closePanel: () => {
        const panel = document.getElementById('chatPanel');
        if (panel) {
            Chat.isOpen = false;
            panel.classList.add('hidden');
        }
    },

    // Send message
    sendMessage: () => {
        const input = document.getElementById('chatInput');
        if (!input || Chat.isTyping) return;

        const query = input.value.trim();
        if (!query) return;

        // Add user message
        Chat.addMessage(query, 'user');
        input.value = '';

        // Show typing indicator
        Chat.showTyping();

        // Process and respond after delay
        setTimeout(() => {
            Chat.hideTyping();
            const response = Chat.processQuery(query);
            Chat.addMessage(response, 'bot');
        }, 800 + Math.random() * 700);
    },

    // Add message to chat
    addMessage: (content, type) => {
        const messages = document.getElementById('chatMessages');
        if (!messages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.innerHTML = `<div class="message-content">${content}</div>`;

        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;

        Chat.messages.push({ content, type, timestamp: new Date() });
    },

    // Show typing indicator
    showTyping: () => {
        Chat.isTyping = true;
        const messages = document.getElementById('chatMessages');
        if (!messages) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;
    },

    // Hide typing indicator
    hideTyping: () => {
        Chat.isTyping = false;
        const typing = document.getElementById('typingIndicator');
        if (typing) {
            typing.remove();
        }
    },

    // Process query and generate response
    processQuery: (query) => {
        const lowerQuery = query.toLowerCase();

        // Check each response category
        for (const [key, config] of Object.entries(Chat.responses)) {
            for (const pattern of config.patterns) {
                if (lowerQuery.includes(pattern)) {
                    return config.getResponse(query);
                }
            }
        }

        // Default response
        return `I'm not sure how to answer that specific question. Try asking about:

<ul class="suggestions">
    <li data-query="What's our best selling model?">Best selling model</li>
    <li data-query="How is the West region performing?">Regional performance</li>
    <li data-query="Show me dealer rankings">Dealer rankings</li>
</ul>

Or type "help" to see all available queries.`;
    }
};

// Export for use in other modules
window.Chat = Chat;
