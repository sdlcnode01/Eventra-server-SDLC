// Initialize the proportion chart
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('proportionChart').getContext('2d');
    
    // Data from the dashboard
    const attendees = 2000;
    const organizers = 500;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Attendees', 'Organizers'],
            datasets: [{
                data: [attendees, organizers],
                backgroundColor: [
                    '#FFD93D', // Yellow for Attendees
                    '#95CD41'  // Green for Organizers
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Poppins',
                            size: 14
                        },
                        color: '#333A02'
                    }
                }
            }
        }
    });
}); 