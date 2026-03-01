const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('admin-theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('admin-theme', newTheme);
    updateChartsTheme();
});

let userStatusChart, growthChart;

function calculatePercentages(loggedIn, guest) {
    const total = loggedIn + guest;
    if (total === 0) return { loggedInPercent: 0, guestPercent: 0 };
    return {
        loggedInPercent: ((loggedIn / total) * 100).toFixed(1),
        guestPercent: ((guest / total) * 100).toFixed(1)
    };
}

function initDashboard() {
    const apiData = {
        totalUsers: 12847,
        newUsersToday: 156,
        loggedInUsers: 8783,
        guestUsers: 4064,
        growthData: [120, 135, 128, 156, 142, 168, 156]
    };

    const { loggedInPercent, guestPercent } = calculatePercentages(
        apiData.loggedInUsers,
        apiData.guestUsers
    );

    animateNumber(document.getElementById('totalUsers'), apiData.totalUsers);
    animateNumber(document.getElementById('newUsersToday'), apiData.newUsersToday);
    animateNumber(document.getElementById('loggedInUsers'), apiData.loggedInUsers);
    animateNumber(document.getElementById('guestUsers'), apiData.guestUsers);

    document.getElementById('loggedInPercent').innerHTML = `<span>占比 ${loggedInPercent}%</span>`;
    document.getElementById('guestPercent').innerHTML = `<span>占比 ${guestPercent}%</span>`;

    initCharts(apiData.loggedInUsers, apiData.guestUsers, apiData.growthData);
}

function initCharts(loggedIn, guest, growthData) {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#a0a0a8' : '#666666';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

    const userStatusCtx = document.getElementById('userStatusChart').getContext('2d');
    userStatusChart = new Chart(userStatusCtx, {
        type: 'doughnut',
        data: {
            labels: ['已登录用户', '未登录用户'],
            datasets: [{
                data: [loggedIn, guest],
                backgroundColor: isDark ? ['#818cf8', '#374151'] : ['#6366f1', '#e5e7eb'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        color: textColor,
                        font: {
                            family: "'HarmonyOS Sans SC', sans-serif",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: isDark ? '#1a1a1f' : '#ffffff',
                    titleColor: isDark ? '#f1f1f3' : '#1a1a1a',
                    bodyColor: isDark ? '#a0a0a8' : '#666666',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percent = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed.toLocaleString() + ' (' + percent + '%)';
                        }
                    }
                }
            }
        }
    });

    const growthCtx = document.getElementById('growthChart').getContext('2d');
    growthChart = new Chart(growthCtx, {
        type: 'bar',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '新增用户',
                data: growthData,
                backgroundColor: isDark ? '#818cf8' : '#6366f1',
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: isDark ? '#1a1a1f' : '#ffffff',
                    titleColor: isDark ? '#f1f1f3' : '#1a1a1a',
                    bodyColor: isDark ? '#a0a0a8' : '#666666',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: "'HarmonyOS Sans SC', sans-serif",
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: "'HarmonyOS Sans SC', sans-serif",
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function updateChartsTheme() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#a0a0a8' : '#666666';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

    userStatusChart.data.datasets[0].backgroundColor = isDark ? ['#818cf8', '#374151'] : ['#6366f1', '#e5e7eb'];
    userStatusChart.options.plugins.legend.labels.color = textColor;
    userStatusChart.options.plugins.tooltip.backgroundColor = isDark ? '#1a1a1f' : '#ffffff';
    userStatusChart.options.plugins.tooltip.titleColor = isDark ? '#f1f1f3' : '#1a1a1a';
    userStatusChart.options.plugins.tooltip.bodyColor = isDark ? '#a0a0a8' : '#666666';
    userStatusChart.options.plugins.tooltip.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    userStatusChart.update();

    growthChart.data.datasets[0].backgroundColor = isDark ? '#818cf8' : '#6366f1';
    growthChart.options.scales.x.ticks.color = textColor;
    growthChart.options.scales.y.ticks.color = textColor;
    growthChart.options.scales.y.grid.color = gridColor;
    growthChart.options.plugins.tooltip.backgroundColor = isDark ? '#1a1a1f' : '#ffffff';
    growthChart.options.plugins.tooltip.titleColor = isDark ? '#f1f1f3' : '#1a1a1a';
    growthChart.options.plugins.tooltip.bodyColor = isDark ? '#a0a0a8' : '#666666';
    growthChart.options.plugins.tooltip.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    growthChart.update();
}

function animateNumber(element, target, duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});