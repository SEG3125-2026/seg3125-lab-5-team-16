// Lab 5 - Hair Salon Booking System (based on Lab 4)
// One-pager with navbar, payment section, regex validation, calendar constraints

// Store the current booking state
const bookingState = {
    selectedService: null,
    selectedStaff: null,
    selectedDate: null,
    selectedTime: null,
    customerInfo: {}
};

// Services data with descriptions and images
const services = [
    {
        id: 1,
        name: "Men's Haircut",
        price: 35,
        duration: "30 min",
        description: "Professional men's haircut with styling",
        tooltip: "Includes consultation, cut, wash, and styling. Perfect for all hair types and lengths.",
        image: "./img/menHaircut.png",
        category: "cut"
    },
    {
        id: 2,
        name: "Women's Haircut",
        price: 55,
        duration: "45 min",
        description: "Stylish women's haircut with consultation",
        tooltip: "Includes style consultation, precision cut, wash, and professional styling. Suitable for all hair lengths.",
        image: "./img/womenHaircut.png",
        category: "cut"
    },
    {
        id: 3,
        name: "Beard Trim",
        price: 25,
        duration: "20 min",
        description: "Precise beard trimming and shaping",
        tooltip: "Professional beard trimming, shaping, and styling. Includes hot towel treatment.",
        image: "./img/beardTrim.png",
        category: "trim"
    },
    {
        id: 4,
        name: "Hair Color",
        price: 85,
        duration: "90 min",
        description: "Full hair coloring service with consultation",
        tooltip: "Complete hair coloring service includes: color consultation, full color application, processing time, wash, and styling. Perfect for full coverage, highlights, or color correction.",
        image: "./img/hairColor.png",
        category: "color"
    },
    {
        id: 5,
        name: "Wash & Style",
        price: 40,
        duration: "30 min",
        description: "Hair wash with professional styling",
        tooltip: "Professional shampoo, conditioning treatment, blow-dry, and styling. Great for special occasions or regular maintenance.",
        image: "./img/washStyle.png",
        category: "style"
    },
    {
        id: 6,
        name: "Haircut + Beard",
        price: 50,
        duration: "45 min",
        description: "Complete grooming package for men",
        tooltip: "Complete grooming package includes: men's haircut, beard trim, hot towel treatment, and styling. Best value for full grooming service.",
        image: "./img/haircutBeard.png",
        category: "package"
    }
];

// Staff member information (Lab 5: offDays = 0 Sunday, 6 Saturday)
const staff = [
    { id: 1, name: "Sarah Johnson", role: "Senior Stylist", specialty: "Women's Cuts & Color", experience: "10 years", image: "./img/sarahJohnson.png", bio: "Specializes in modern cuts and vibrant color techniques", offDays: [0, 6] },
    { id: 2, name: "Michael Chen", role: "Master Barber", specialty: "Men's Grooming", experience: "8 years", image: "./img/michaelChen.png", bio: "Expert in classic and contemporary men's styles", offDays: [0] },
    { id: 3, name: "Emma Rodriguez", role: "Color Specialist", specialty: "Hair Coloring", experience: "6 years", image: "./img/emmaRodriguez.png", bio: "Creative colorist with expertise in balayage and highlights", offDays: [0, 6] },
    { id: 4, name: "James Wilson", role: "Stylist", specialty: "All Services", experience: "5 years", image: "./img/jamesWilson.png", bio: "Versatile stylist ready to help with any service", offDays: [6] }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure DOM is fully ready
    setTimeout(function() {
        renderServices();
        renderStaff();
        setupEventListeners();
        initializeDatePicker();
    }, 100);
});

// Set up tooltips to help users understand services
function initializeTooltips() {
    try {
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        }
    } catch (error) {
        console.log('Tooltips not available:', error);
    }
}

// Display all available services
function renderServices() {
    const container = document.getElementById('services-container');
    if (!container) {
        console.error('Services container not found!');
        return;
    }
    container.innerHTML = '';

    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'col-md-6 col-lg-4';
        serviceCard.innerHTML = `
            <div class="card service-card h-100 shadow-sm" data-service-id="${service.id}">
                <img src="${service.image}" class="card-img-top" alt="${service.name}" style="height: 200px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/400x300/6c5ce7/ffffff?text=${encodeURIComponent(service.name)}';">
                <div class="card-body">
                    <h5 class="card-title">
                        ${service.name}
                        <i class="bi bi-info-circle text-primary ms-2" 
                           data-bs-toggle="tooltip" 
                           data-bs-placement="top" 
                           data-bs-title="${service.tooltip}"
                           style="cursor: help;"></i>
                    </h5>
                    <p class="card-text text-muted">${service.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <span class="badge bg-primary">$${service.price}</span>
                            <span class="badge bg-secondary ms-2">
                                <i class="bi bi-clock me-1"></i>${service.duration}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-transparent border-0">
                    <button class="btn btn-outline-primary w-100 select-service-btn" data-service-id="${service.id}">
                        <i class="bi bi-check-circle me-2"></i>Select Service
                    </button>
                </div>
            </div>
        `;
        container.appendChild(serviceCard);
    });

    // Use event delegation for more reliable click handling
    container.addEventListener('click', function(e) {
        // Handle button clicks
        const button = e.target.closest('.select-service-btn');
        if (button) {
            e.stopPropagation();
            e.preventDefault();
            const serviceId = parseInt(button.getAttribute('data-service-id'));
            if (serviceId) {
                selectService(serviceId);
            }
            return;
        }
        
        // Handle card clicks (but not on buttons or tooltips)
        const card = e.target.closest('.service-card');
        if (card && !e.target.closest('.select-service-btn') && !e.target.closest('[data-bs-toggle="tooltip"]')) {
            const serviceId = parseInt(card.getAttribute('data-service-id'));
            if (serviceId) {
                selectService(serviceId);
            }
        }
    });

    // Set cursor for all cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.cursor = 'pointer';
    });

    // Initialize tooltips after rendering
    initializeTooltips();
}

// Handle service selection
function selectService(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    bookingState.selectedService = service;

    // Clear previous selections
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Highlight the selected service
    const selectedCard = document.querySelector(`[data-service-id="${serviceId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Show what was selected
    showServiceSummary(service);

    // Enable the next button
    const nextBtn = document.getElementById('next-to-staff');
    nextBtn.classList.remove('d-none');
    nextBtn.disabled = false;

    // Update progress
    updateProgress('step-service', true);
}

// Display the selected service summary
function showServiceSummary(service) {
    document.getElementById('selected-service-name').textContent = service.name;
    document.getElementById('selected-service-price').textContent = `$${service.price}`;
    document.getElementById('selected-service-duration').textContent = service.duration;
    document.getElementById('service-summary').classList.remove('d-none');
}

// Display all staff members
function renderStaff() {
    const container = document.getElementById('staff-container');
    container.innerHTML = '';

    // Add "Any Stylist" option
    const anyStylistCard = document.createElement('div');
    anyStylistCard.className = 'col-md-6 col-lg-3';
    anyStylistCard.innerHTML = `
        <div class="card staff-card h-100 shadow-sm" data-staff-id="0">
            <div class="card-body text-center">
                <div class="staff-avatar mb-3" style="width: 120px; height: 120px; margin: 0 auto; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-people-fill text-white" style="font-size: 3rem;"></i>
                </div>
                <h5 class="card-title">Any Stylist</h5>
                <p class="card-text text-muted">We'll assign the best available stylist</p>
            </div>
        </div>
    `;
    container.appendChild(anyStylistCard);

    staff.forEach(member => {
        const staffCard = document.createElement('div');
        staffCard.className = 'col-md-6 col-lg-3';
        staffCard.innerHTML = `
            <div class="card staff-card h-100 shadow-sm" data-staff-id="${member.id}">
                <img src="${member.image}" class="card-img-top" alt="${member.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body text-center">
                    <h5 class="card-title">${member.name}</h5>
                    <p class="card-text">
                        <span class="badge bg-primary">${member.role}</span>
                    </p>
                    <p class="card-text text-muted small">${member.specialty}</p>
                    <p class="card-text text-muted small">${member.experience} experience</p>
                    <button class="btn btn-sm btn-outline-primary mt-2 select-staff-btn" data-staff-id="${member.id}">
                        <i class="bi bi-check-circle me-1"></i>Select
                    </button>
                </div>
            </div>
        `;
        container.appendChild(staffCard);
    });

    // Add click handlers
    document.querySelectorAll('.select-staff-btn, .staff-card').forEach(element => {
        element.addEventListener('click', function(e) {
            if (e.target.closest('.select-staff-btn')) {
                const staffId = parseInt(e.target.closest('.select-staff-btn').dataset.staffId);
                selectStaff(staffId);
            } else if (this.classList.contains('staff-card')) {
                const staffId = parseInt(this.dataset.staffId);
                selectStaff(staffId);
            }
        });
    });

    // Add hover effect
    document.querySelectorAll('.staff-card').forEach(card => {
        card.style.cursor = 'pointer';
    });
}

// Select Staff
function selectStaff(staffId) {
    let selectedStaffData = null;
    if (staffId === 0) {
        selectedStaffData = { id: 0, name: "Any Stylist", specialty: "Best Available", offDays: [] };
    } else {
        selectedStaffData = staff.find(s => s.id === staffId);
    }

    if (!selectedStaffData) return;

    bookingState.selectedStaff = selectedStaffData;

    // Remove previous selections
    document.querySelectorAll('.staff-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Highlight selected
    const selectedCard = document.querySelector(`[data-staff-id="${staffId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Show summary
    showStaffSummary(selectedStaffData);

    // Enable next button
    document.getElementById('next-to-datetime').disabled = false;
    updateProgress('step-staff', true);
}

// Show Staff Summary
function showStaffSummary(staffData) {
    document.getElementById('selected-staff-name').textContent = staffData.name;
    document.getElementById('selected-staff-specialty').textContent = staffData.specialty;
    document.getElementById('staff-summary').classList.remove('d-none');
}

// Set up date picker with constraints (Lab 5: weekends disabled, staff off-days)
function initializeDatePicker() {
    const dateInput = document.getElementById('appointment-date');
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    dateInput.min = today.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];

    dateInput.addEventListener('change', function() {
        const dateStr = this.value;
        if (!dateStr) return;
        const date = new Date(dateStr + 'T12:00:00');
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

        // Constraint: weekends not available
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            this.value = '';
            bookingState.selectedDate = null;
            document.getElementById('appointment-time').innerHTML = '<option value="">Choose a time...</option>';
            alert('Weekends are not available for booking. Please select a weekday.');
            return;
        }

        // Constraint: staff off-days (if a specific stylist is selected)
        if (bookingState.selectedStaff && bookingState.selectedStaff.id !== 0 && bookingState.selectedStaff.offDays && bookingState.selectedStaff.offDays.includes(dayOfWeek)) {
            this.value = '';
            bookingState.selectedDate = null;
            document.getElementById('appointment-time').innerHTML = '<option value="">Choose a time...</option>';
            alert(bookingState.selectedStaff.name + ' is not available on this day. Please choose another date or "Any Stylist".');
            return;
        }

        bookingState.selectedDate = dateStr;
        populateTimeSlots();
        checkDateTimeComplete();
    });
}

// Generate available time slots
function populateTimeSlots() {
    const timeSelect = document.getElementById('appointment-time');
    const selectedDate = bookingState.selectedDate;
    
    if (!selectedDate) return;

    timeSelect.innerHTML = '<option value="">Choose a time...</option>';

    // Create time slots from 9 AM to 7 PM, every 30 minutes
    const slots = [];
    for (let hour = 9; hour < 19; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const displayTime = formatTime(hour, minute);
            slots.push({ value: timeString, display: displayTime });
        }
    }

    slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.value;
        option.textContent = slot.display;
        timeSelect.appendChild(option);
    });

    timeSelect.addEventListener('change', function() {
        bookingState.selectedTime = this.value;
        checkDateTimeComplete();
    });
}

// Format time for display
function formatTime(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

// Check if Date/Time is Complete
function checkDateTimeComplete() {
    if (bookingState.selectedDate && bookingState.selectedTime) {
        showDateTimeSummary();
        document.getElementById('next-to-contact').disabled = false;
        updateProgress('step-datetime', true);
    }
}

// Show Date/Time Summary
function showDateTimeSummary() {
    const date = new Date(bookingState.selectedDate);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = formatTimeFromString(bookingState.selectedTime);
    
    document.getElementById('selected-datetime').textContent = `${dateStr} at ${timeStr}`;
    document.getElementById('datetime-summary').classList.remove('d-none');
}

// Format Time from String
function formatTimeFromString(timeString) {
    const [hour, minute] = timeString.split(':').map(Number);
    return formatTime(hour, minute);
}

// Scroll to section (one-pager navigation)
function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation: scroll to section (one-pager)
    document.getElementById('next-to-staff').addEventListener('click', () => scrollToSection('staff-section'));
    document.getElementById('back-to-service').addEventListener('click', () => scrollToSection('services-section'));
    document.getElementById('next-to-datetime').addEventListener('click', () => scrollToSection('datetime-section'));
    document.getElementById('back-to-staff').addEventListener('click', () => scrollToSection('staff-section'));
    document.getElementById('next-to-contact').addEventListener('click', () => scrollToSection('contact-section'));
    document.getElementById('back-to-datetime').addEventListener('click', () => scrollToSection('datetime-section'));
    document.getElementById('next-to-payment').addEventListener('click', () => scrollToSection('payment-section'));
    document.getElementById('back-to-contact').addEventListener('click', () => scrollToSection('contact-section'));
    document.getElementById('submit-booking').addEventListener('click', submitBooking);
    document.getElementById('new-booking').addEventListener('click', resetBooking);

    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    contactForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', validateContactForm);
    });

    // Payment form: card number auto-format (16 digits with spaces)
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '');
            if (v.length > 16) v = v.slice(0, 16);
            this.value = v.replace(/(.{4})/g, '$1 ').trim();
            validatePaymentForm();
        });
    }
    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '');
            if (v.length >= 2) this.value = v.slice(0, 2) + '/' + v.slice(2, 4);
            else this.value = v;
            validatePaymentForm();
        });
    }
    document.querySelectorAll('#card-cvv, #card-name').forEach(el => {
        if (el) el.addEventListener('input', validatePaymentForm);
    });

    initializeTooltips();
}

// Lab 5 regex: name = letters and spaces only; phone = (XXX) XXX-XXXX or XXX-XXX-XXXX
const NAME_REGEX = /^[a-zA-Z\s]+$/;
const PHONE_REGEX = /^\(\d{3}\)\s?\d{3}[-]?\d{4}$|^\d{3}[-]\d{3}[-]\d{4}$/;

// Validate the contact form
function validateContactForm() {
    const nameInput = document.getElementById('customer-name');
    const emailInput = document.getElementById('customer-email');
    const phoneInput = document.getElementById('customer-phone');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;
    const errors = [];

    clearValidationErrors();

    // Name: letters and spaces only (Lab 5 constraint)
    if (name.length === 0) {
        showFieldError('customer-name', 'name-error', 'Please enter your full name');
        errors.push('Full name is required');
        isValid = false;
    } else if (!NAME_REGEX.test(name)) {
        showFieldError('customer-name', 'name-error', 'Name must contain letters and spaces only (no numbers)');
        errors.push('Name must be letters and spaces only');
        isValid = false;
    } else if (name.length < 2) {
        showFieldError('customer-name', 'name-error', 'Name must be at least 2 characters');
        errors.push('Name is too short');
        isValid = false;
    } else {
        showFieldSuccess('customer-name');
    }

    // Email
    if (email.length === 0) {
        showFieldError('customer-email', 'email-error', 'Please enter your email address');
        errors.push('Email address is required');
        isValid = false;
    } else if (!emailPattern.test(email)) {
        showFieldError('customer-email', 'email-error', 'Please enter a valid email address');
        errors.push('Email address is invalid');
        isValid = false;
    } else {
        showFieldSuccess('customer-email');
    }

    // Phone: (XXX) XXX-XXXX or XXX-XXX-XXXX (Lab 5 constraint)
    if (phone.length === 0) {
        showFieldError('customer-phone', 'phone-error', 'Please enter your phone number');
        errors.push('Phone number is required');
        isValid = false;
    } else if (!PHONE_REGEX.test(phone.replace(/\s+/g, ' ').trim())) {
        showFieldError('customer-phone', 'phone-error', 'Use format (XXX) XXX-XXXX or XXX-XXX-XXXX');
        errors.push('Phone format: (XXX) XXX-XXXX or XXX-XXX-XXXX');
        isValid = false;
    } else {
        showFieldSuccess('customer-phone');
    }

    if (!isValid) {
        showErrorAlert(errors);
    } else {
        hideErrorAlert();
    }

    const nextPaymentBtn = document.getElementById('next-to-payment');
    if (nextPaymentBtn) nextPaymentBtn.disabled = !isValid;
    updateSubmitButton();

    if (isValid) updateProgress('step-contact', true);
}

// Show error message for a form field
function showFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(errorId);
    
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    errorDiv.textContent = message;
    errorDiv.classList.remove('d-none');
}

// Show field success
function showFieldSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

// Clear all validation errors
function clearValidationErrors() {
    document.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
    });
    document.querySelectorAll('.invalid-feedback').forEach(el => {
        el.classList.add('d-none');
    });
}

// Display error alert at top of form
function showErrorAlert(errors) {
    const alertDiv = document.getElementById('form-error-alert');
    const errorList = document.getElementById('error-list');
    
    errorList.innerHTML = '';
    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        errorList.appendChild(li);
    });
    
    alertDiv.classList.remove('d-none');
}

// Hide error alert
function hideErrorAlert() {
    document.getElementById('form-error-alert').classList.add('d-none');
}

// Lab 5 Payment regex: 16 digits, MM/YY, CVV 3-4 digits, name letters/spaces
const CARD_NUMBER_REGEX = /^\d{16}$/;
const EXPIRY_REGEX = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
const CVV_REGEX = /^\d{3,4}$/;

function validatePaymentForm() {
    const cardNumberEl = document.getElementById('card-number');
    const cardExpiryEl = document.getElementById('card-expiry');
    const cardCvvEl = document.getElementById('card-cvv');
    const cardNameEl = document.getElementById('card-name');
    if (!cardNumberEl || !cardExpiryEl || !cardCvvEl || !cardNameEl) return false;

    const cardNumberRaw = cardNumberEl.value.replace(/\s/g, '');
    const expiry = cardExpiryEl.value.trim();
    const cvv = cardCvvEl.value.trim();
    const cardName = cardNameEl.value.trim();

    let isValid = true;
    const errors = [];

    // Card number: 16 digits
    if (!CARD_NUMBER_REGEX.test(cardNumberRaw)) {
        isValid = false;
        cardNumberEl.classList.add('is-invalid');
        if (cardNumberRaw.length > 0) errors.push('Card number must be 16 digits');
    } else {
        cardNumberEl.classList.remove('is-invalid');
    }

    // Expiry: MM/YY
    if (!EXPIRY_REGEX.test(expiry)) {
        isValid = false;
        cardExpiryEl.classList.add('is-invalid');
        if (expiry.length > 0) errors.push('Expiry must be MM/YY (e.g. 12/25)');
    } else {
        cardExpiryEl.classList.remove('is-invalid');
    }

    // CVV: 3 or 4 digits
    if (!CVV_REGEX.test(cvv)) {
        isValid = false;
        cardCvvEl.classList.add('is-invalid');
        if (cvv.length > 0) errors.push('CVV must be 3 or 4 digits');
    } else {
        cardCvvEl.classList.remove('is-invalid');
    }

    // Name on card: letters and spaces only
    if (!cardName) {
        isValid = false;
        cardNameEl.classList.add('is-invalid');
        errors.push('Name on card is required');
    } else if (!NAME_REGEX.test(cardName)) {
        isValid = false;
        cardNameEl.classList.add('is-invalid');
        errors.push('Name on card: letters and spaces only');
    } else {
        cardNameEl.classList.remove('is-invalid');
    }

    const alertEl = document.getElementById('payment-error-alert');
    const listEl = document.getElementById('payment-error-list');
    if (alertEl && listEl) {
        if (!isValid && errors.length) {
            listEl.innerHTML = errors.map(e => '<li>' + e + '</li>').join('');
            alertEl.classList.remove('d-none');
        } else {
            alertEl.classList.add('d-none');
        }
    }

    updateSubmitButton();
    if (isValid) updateProgress('step-payment', true);
    return isValid;
}

function updateSubmitButton() {
    const submitBtn = document.getElementById('submit-booking');
    if (!submitBtn) return;
    const nameEl = document.getElementById('customer-name');
    const emailEl = document.getElementById('customer-email');
    const phoneEl = document.getElementById('customer-phone');
    const cardNumberEl = document.getElementById('card-number');
    const expiryEl = document.getElementById('card-expiry');
    const cvvEl = document.getElementById('card-cvv');
    const cardNameEl = document.getElementById('card-name');
    if (!nameEl || !emailEl || !phoneEl || !cardNumberEl || !expiryEl || !cvvEl || !cardNameEl) return;

    const contactValid = NAME_REGEX.test(nameEl.value.trim()) && nameEl.value.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim()) &&
        PHONE_REGEX.test(phoneEl.value.trim().replace(/\s+/g, ' ').trim());
    const paymentValid = CARD_NUMBER_REGEX.test(cardNumberEl.value.replace(/\s/g, '')) &&
        EXPIRY_REGEX.test(expiryEl.value.trim()) &&
        CVV_REGEX.test(cvvEl.value.trim()) &&
        cardNameEl.value.trim() && NAME_REGEX.test(cardNameEl.value.trim());

    submitBtn.disabled = !(contactValid && paymentValid);
}

// Show a specific section and hide others (used for confirmation view only)
function showSection(sectionId) {
    document.querySelectorAll('.booking-section').forEach(section => {
        section.classList.add('d-none');
    });
    document.getElementById(sectionId).classList.remove('d-none');

    const infoEl = document.getElementById('info');
    const progressEl = document.getElementById('progress-section');
    if (sectionId === 'confirmation-section') {
        if (infoEl) infoEl.classList.add('d-none');
        if (progressEl) progressEl.classList.add('d-none');
    } else {
        if (infoEl) infoEl.classList.remove('d-none');
        if (progressEl) progressEl.classList.remove('d-none');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update Progress Indicator
function updateProgress(stepId, completed) {
    const step = document.getElementById(stepId);
    if (completed) {
        step.classList.add('active');
        step.querySelector('.step-circle').classList.add('completed');
    }
}

// Handle booking submission
function submitBooking() {
    validateContactForm();
    validatePaymentForm();
    const submitBtn = document.getElementById('submit-booking');
    if (submitBtn.disabled) return;

    // Show loading spinner
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';

    // Get customer information
    bookingState.customerInfo = {
        name: document.getElementById('customer-name').value.trim(),
        email: document.getElementById('customer-email').value.trim(),
        phone: document.getElementById('customer-phone').value.trim(),
        notes: document.getElementById('special-notes').value.trim()
    };

    // Simulate processing (would be API call in real app)
    setTimeout(() => {
        // Create reference number
        const refNumber = 'EC-' + Date.now().toString().slice(-8);

        // Show confirmation page
        showConfirmation(refNumber);
        showSection('confirmation-section');
        updateProgress('step-confirm', true);
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Confirm Booking';
    }, 1000);
}

// Show Confirmation
function showConfirmation(refNumber) {
    const details = document.getElementById('confirmation-details');
    const date = new Date(bookingState.selectedDate);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = formatTimeFromString(bookingState.selectedTime);

    details.innerHTML = `
        <div class="row g-3">
            <div class="col-12">
                <p><strong><i class="bi bi-person me-2"></i>Name:</strong> ${bookingState.customerInfo.name}</p>
            </div>
            <div class="col-12">
                <p><strong><i class="bi bi-envelope me-2"></i>Email:</strong> ${bookingState.customerInfo.email}</p>
            </div>
            ${bookingState.customerInfo.phone ? `<div class="col-12"><p><strong><i class="bi bi-telephone me-2"></i>Phone:</strong> ${bookingState.customerInfo.phone}</p></div>` : ''}
            <div class="col-12">
                <p><strong><i class="bi bi-scissors me-2"></i>Service:</strong> ${bookingState.selectedService.name} - $${bookingState.selectedService.price}</p>
            </div>
            <div class="col-12">
                <p><strong><i class="bi bi-person-check me-2"></i>Stylist:</strong> ${bookingState.selectedStaff.name}</p>
            </div>
            <div class="col-12">
                <p><strong><i class="bi bi-calendar-event me-2"></i>Date & Time:</strong> ${dateStr} at ${timeStr}</p>
            </div>
            ${bookingState.customerInfo.notes ? `<div class="col-12"><p><strong><i class="bi bi-chat-left-text me-2"></i>Notes:</strong> ${bookingState.customerInfo.notes}</p></div>` : ''}
        </div>
    `;

    document.getElementById('reference-number').textContent = refNumber;
}

// Reset Booking
function resetBooking() {
    // Reset state
    bookingState.selectedService = null;
    bookingState.selectedStaff = null;
    bookingState.selectedDate = null;
    bookingState.selectedTime = null;
    bookingState.customerInfo = {};

    // Reset UI
    document.querySelectorAll('.service-card, .staff-card').forEach(card => {
        card.classList.remove('selected');
    });

    document.getElementById('service-summary').classList.add('d-none');
    document.getElementById('staff-summary').classList.add('d-none');
    document.getElementById('datetime-summary').classList.add('d-none');

    document.getElementById('contact-form').reset();
    document.getElementById('appointment-date').value = '';
    document.getElementById('appointment-time').innerHTML = '<option value="">Choose a time...</option>';

    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) paymentForm.reset();
    document.querySelectorAll('#payment-section .is-invalid').forEach(el => el.classList.remove('is-invalid'));
    const payAlert = document.getElementById('payment-error-alert');
    if (payAlert) payAlert.classList.add('d-none');

    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        const circle = step.querySelector('.step-circle');
        if (circle) circle.classList.remove('completed');
    });

    document.querySelectorAll('.booking-section').forEach(section => {
        if (section.id !== 'confirmation-section') section.classList.remove('d-none');
    });
    document.getElementById('confirmation-section').classList.add('d-none');
    const infoEl = document.getElementById('info');
    const progressEl = document.getElementById('progress-section');
    if (infoEl) infoEl.classList.remove('d-none');
    if (progressEl) progressEl.classList.remove('d-none');

    updateSubmitButton();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
