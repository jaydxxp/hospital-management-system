document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    checkAuthStatus();

    // Navigation
    const dashboardLink = document.getElementById('dashboard-link');
    const registrationLink = document.getElementById('registration-link');
    const managementLink = document.getElementById('management-link');
    const logoutLink = document.getElementById('logout-link');

    // Content sections
    const dashboardOverview = document.getElementById('dashboard-overview');
    const patientRegistration = document.getElementById('patient-registration');
    const patientManagement = document.getElementById('patient-management');

    // Modal elements
    const editModal = document.getElementById('edit-modal');
    const closeModal = document.querySelector('.close');
    const editForm = document.getElementById('edit-form');

    // Navigation event listeners
    dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('dashboard-overview');
        loadDashboardStats();
    });

    registrationLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('patient-registration');
    });

    managementLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('patient-management');
        loadPatients();
    });

    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await logout();
    });

    // Patient registration form
    const registrationForm = document.getElementById('registration-form');
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await registerPatient();
    });

    // Modal event listeners
    closeModal.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await updatePatient();
    });

    // Helper functions
    function showSection(sectionId) {
        [dashboardOverview, patientRegistration, patientManagement].forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    }

    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/check-auth');
            const data = await response.json();

            if (!data.isAuthenticated) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            window.location.href = '/';
        }
    }

    async function loadDashboardStats() {
        try {
            const response = await fetch('/api/patients');
            const data = await response.json();

            if (data.success) {
                const totalPatients = data.patients.length;
                const today = new Date().toISOString().split('T')[0];
                const todayRegistrations = data.patients.filter(patient => 
                    patient.created_at.startsWith(today)
                ).length;

                document.getElementById('total-patients').textContent = totalPatients;
                document.getElementById('today-registrations').textContent = todayRegistrations;
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    async function registerPatient() {
        const formData = new FormData(registrationForm);
        const patientData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/patients/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patientData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Patient registered successfully!');
                registrationForm.reset();
                loadDashboardStats();
            } else {
                alert(data.message || 'Error registering patient');
            }
        } catch (error) {
            console.error('Error registering patient:', error);
            alert('Error registering patient. Please try again.');
        }
    }

    async function loadPatients() {
        try {
            const response = await fetch('/api/patients');
            const data = await response.json();

            if (data.success) {
                const patientList = document.getElementById('patient-list');
                patientList.innerHTML = '';

                data.patients.forEach(patient => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${patient.name}</td>
                        <td>${patient.age}</td>
                        <td>${patient.city}</td>
                        <td>${patient.mobile}</td>
                        <td>${patient.email}</td>
                        <td>
                            <button onclick="editPatient(${patient.id})" class="btn-edit">Edit</button>
                            <button onclick="deletePatient(${patient.id})" class="btn-delete">Delete</button>
                        </td>
                    `;
                    patientList.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error loading patients:', error);
        }
    }

    async function logout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    // Global functions for patient management
    window.editPatient = async (id) => {
        try {
            const response = await fetch(`/api/patients/${id}`);
            const data = await response.json();

            if (data.success) {
                const patient = data.patient;
                
                // Populate the edit form with patient data
                document.getElementById('edit-patient-id').value = patient.id;
                document.getElementById('edit-name').value = patient.name;
                document.getElementById('edit-age').value = patient.age;
                document.getElementById('edit-dob').value = patient.dob;
                document.getElementById('edit-city').value = patient.city;
                document.getElementById('edit-mobile').value = patient.mobile;
                document.getElementById('edit-email').value = patient.email;
                
                // Set gender radio button
                if (patient.gender === 'male') {
                    document.getElementById('edit-male').checked = true;
                } else {
                    document.getElementById('edit-female').checked = true;
                }

                // Show the modal
                editModal.style.display = 'block';
            } else {
                alert('Error loading patient data');
            }
        } catch (error) {
            console.error('Error loading patient:', error);
            alert('Error loading patient data. Please try again.');
        }
    };

    async function updatePatient() {
        const formData = new FormData(editForm);
        const patientData = Object.fromEntries(formData.entries());
        const patientId = document.getElementById('edit-patient-id').value;

        try {
            const response = await fetch(`/api/patients/${patientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patientData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Patient updated successfully!');
                editModal.style.display = 'none';
                loadPatients();
                loadDashboardStats();
            } else {
                alert(data.message || 'Error updating patient');
            }
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Error updating patient. Please try again.');
        }
    }

    window.deletePatient = async (id) => {
        if (confirm('Are you sure you want to delete this patient?')) {
            try {
                const response = await fetch(`/api/patients/${id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    loadPatients();
                    loadDashboardStats();
                } else {
                    alert(data.message || 'Error deleting patient');
                }
            } catch (error) {
                console.error('Error deleting patient:', error);
                alert('Error deleting patient. Please try again.');
            }
        }
    };
}); 