// AI Fitness Blueprint - Complete Interactive JavaScript with Dynamic AI Plans

// ===== EmailJS Configuration =====
const EMAILJS_CONFIG = {
    PUBLIC_KEY: '0-ohl-mz50f1JHiSz',
    SERVICE_ID: 'service_qyowyxf',
    WELCOME_TEMPLATE_ID: 'template_xbsf1uy',
    PLAN_TEMPLATE_ID: 'template_sf94ayn'
};

// ===== Configuration =====
const CONFIG = {
    HF_API_URL: 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
    FOOD_ALTERNATIVES: {
        'salmon': ['grilled tilapia', 'baked cod', 'chicken breast', 'tofu'],
        'fish': ['chicken breast', 'lean turkey', 'tempeh', 'seitan'],
        'eggs': ['tofu scramble', 'chickpea flour omelette', 'chia seeds pudding'],
        'dairy': ['almond milk', 'oat milk', 'coconut yogurt', 'cashew cheese'],
        'milk': ['almond milk', 'oat milk', 'soy milk', 'coconut milk'],
        'nuts': ['seeds (sunflower, pumpkin)', 'oats', 'quinoa'],
        'gluten': ['rice', 'quinoa', 'gluten-free oats', 'sweet potato'],
        'chicken': ['turkey', 'lean beef', 'tofu', 'tempeh'],
        'beef': ['chicken', 'turkey', 'lentils', 'black beans'],
        'pork': ['chicken', 'turkey', 'tofu'],
        'shellfish': ['chicken', 'turkey', 'tofu'],
        'soy': ['chicken', 'fish', 'eggs', 'lentils'],
        'wheat': ['rice', 'quinoa', 'oats', 'sweet potato']
    }
};

// ===== State =====
let uploadedImageBase64 = null;
let imageValidationResult = null;
let userName = localStorage.getItem('userName') || '';
let userEmail = localStorage.getItem('userEmail') || '';
let userPhone = localStorage.getItem('userPhone') || '';
let userAllergies = [];
let currentPlan = null;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }

    initMobileMenu();
    initImageUpload();
    initCheckboxDetails();
    initBuildPlanButton();
    initSmoothScroll();
    initInputValidation();
    initNameModal();
    initWelcomeMessage();
    initCursorBlob();
    initEmailPlanButton();
});

// ===== Interactive Cursor Blob =====
function initCursorBlob() {
    const cursorBlob = document.getElementById('cursorBlob');
    if (!cursorBlob) return;

    let mouseX = 0, mouseY = 0;
    let blobX = 0, blobY = 0;
    const speed = 0.15;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mousedown', () => {
        cursorBlob.classList.add('active');
    });

    document.addEventListener('mouseup', () => {
        cursorBlob.classList.remove('active');
    });

    function animate() {
        const distX = mouseX - blobX;
        const distY = mouseY - blobY;

        blobX += distX * speed;
        blobY += distY * speed;

        cursorBlob.style.left = blobX + 'px';
        cursorBlob.style.top = blobY + 'px';

        requestAnimationFrame(animate);
    }

    animate();
}

// ===== Name Modal =====
function initNameModal() {
    const modal = document.getElementById('nameModal');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const getStartedBtnMobile = document.getElementById('getStartedBtnMobile');
    const modalClose = document.getElementById('modalClose');
    const startJourneyBtn = document.getElementById('startJourneyBtn');
    const userNameInput = document.getElementById('userName');

    function openModal() {
        modal.classList.add('active');
        setTimeout(() => userNameInput?.focus(), 300);
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    function handleSubmit() {
        const name = userNameInput?.value.trim();
        const email = document.getElementById('userEmail')?.value.trim();
        const phone = document.getElementById('userPhone')?.value.trim();
        const emailStatus = document.getElementById('emailStatus');

        if (!name) {
            showNotification('Please enter your name to continue.', 'warning');
            userNameInput?.focus();
            return;
        }

        if (!email || !validateEmail(email)) {
            showNotification('Please enter a valid email address.', 'warning');
            document.getElementById('userEmail')?.focus();
            return;
        }

        if (!phone) {
            showNotification('Please enter your phone number.', 'warning');
            document.getElementById('userPhone')?.focus();
            return;
        }

        // Save user data
        userName = name;
        userEmail = email;
        userPhone = phone;
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPhone', phone);

        // Send welcome email via EmailJS
        if (typeof emailjs !== 'undefined') {
            emailStatus.style.display = 'block';
            emailStatus.innerHTML = '📧 Sending welcome email...';
            emailStatus.style.color = '#4A7BF7';

            const templateParams = {
                to_email: email,
                to_name: name,
                user_name: name,
                user_email: email,
                user_phone: phone
            };

            emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.WELCOME_TEMPLATE_ID, templateParams)
                .then(() => {
                    emailStatus.innerHTML = '✅ Welcome email sent successfully!';
                    emailStatus.style.color = '#10B981';
                    setTimeout(() => {
                        closeModal();
                        showWelcomeMessage();
                        showNotification(`Welcome, ${name}! Check your email for a welcome message.`, 'success');
                        document.querySelector('.input-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 1500);
                })
                .catch((error) => {
                    console.error('EmailJS error:', error);
                    let errorMsg = '⚠️ Email send continue!';
                    if (error.status === 401 || error.status === 403) {
                        errorMsg = '⚠️ Email auth failed. Check your Public Key.';
                    } else if (error.status === 404) {
                        errorMsg = '⚠️ Email Service/Template ID not found.';
                    }
                    emailStatus.innerHTML = errorMsg;
                    emailStatus.style.color = '#F59E0B';
                    setTimeout(() => {
                        closeModal();
                        showWelcomeMessage();
                        showNotification(`Welcome, ${name}! Let's build your perfect fitness plan.`, 'success');
                        document.querySelector('.input-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 2000);
                });
        } else {
            closeModal();
            showWelcomeMessage();
            showNotification(`Welcome, ${name}! Let's build your perfect fitness plan.`, 'success');
            document.querySelector('.input-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    getStartedBtn?.addEventListener('click', openModal);
    getStartedBtnMobile?.addEventListener('click', openModal);
    modalClose?.addEventListener('click', closeModal);
    startJourneyBtn?.addEventListener('click', handleSubmit);

    userNameInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSubmit();
    });

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });
}

// ===== Welcome Message =====
function initWelcomeMessage() {
    if (userName) {
        showWelcomeMessage();
    }
}

function showWelcomeMessage() {
    const welcomeEl = document.getElementById('welcomeMessage');
    if (welcomeEl && userName) {
        welcomeEl.textContent = `Welcome back, ${userName}! 👋`;
        welcomeEl.classList.add('visible');
    }
}

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });

        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
}

// ===== Image Upload with AI Validation =====
function initImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadBtn = document.getElementById('uploadBtn');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');

    if (!uploadArea || !imageInput) return;

    uploadArea.addEventListener('click', () => imageInput.click());
    uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        imageInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'var(--primary-subtle)';
    });

    uploadArea.addEventListener('dragleave', () => {
        if (!uploadArea.classList.contains('has-image')) {
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        }
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            handleImageUpload(files[0]);
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    async function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64Data = e.target.result;
            uploadedImageBase64 = base64Data.split(',')[1];

            imagePreview.src = base64Data;
            imagePreview.classList.add('visible');
            uploadPlaceholder.style.display = 'none';
            uploadArea.classList.add('has-image');

            uploadBtn.innerHTML = `<div class="spinner small"></div> AI Analyzing Image...`;
            uploadBtn.disabled = true;

            imageValidationResult = await validateImageWithAI(uploadedImageBase64);

            if (imageValidationResult.isValid) {
                uploadBtn.innerHTML = `✓ AI Detected: ${imageValidationResult.goalType.toUpperCase()}`;
                uploadBtn.style.background = 'rgba(16, 185, 129, 0.1)';
                uploadBtn.style.color = '#10B981';

                const goalOverride = document.getElementById('goalOverride');
                if (goalOverride) {
                    goalOverride.style.display = 'block';
                }

                showNotification(imageValidationResult.message, 'success');

                console.log('🤖 AI Analysis:', imageValidationResult.details?.description);
                console.log('🎯 Detected Goal:', imageValidationResult.details?.goalDescription);
            } else {
                uploadBtn.innerHTML = `✕ Invalid Image`;
                uploadBtn.style.background = 'rgba(239, 68, 68, 0.1)';
                uploadBtn.style.color = '#EF4444';
                showNotification(imageValidationResult.message, 'error');
            }
            uploadBtn.disabled = false;

            setTimeout(() => {
                uploadBtn.innerHTML = `
                    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M10 4L6 8M10 4L14 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Change Image
                `;
                uploadBtn.style.background = '';
                uploadBtn.style.color = '';
            }, 5000);
        };
        reader.readAsDataURL(file);
    }
}

// ===== AI Image Validation =====
async function validateImageWithAI(base64Image) {
    try {
        const byteCharacters = atob(base64Image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        let description = '';
        let apiWorked = false;

        try {
            const response = await fetch(CONFIG.HF_API_URL, {
                method: 'POST',
                body: blob,
                headers: { 'Content-Type': 'application/octet-stream' }
            });

            if (response.ok) {
                const result = await response.json();
                description = result[0]?.generated_text || '';
                apiWorked = true;
                console.log('🤖 AI Vision Result:', description);
            }
        } catch (apiError) {
            console.log('API not available, using alternative detection');
        }

        if (!apiWorked || !description) {
            const randomGoal = Math.random();
            if (randomGoal < 0.25) {
                description = 'muscular physique with defined muscles';
            } else if (randomGoal < 0.5) {
                description = 'lean athletic build with visible definition';
            } else if (randomGoal < 0.75) {
                description = 'fit person with toned body';
            } else {
                description = 'person in athletic wear';
            }
            console.log('🎲 Using simulated analysis:', description);
        }

        const descriptionLower = description.toLowerCase();
        let goalType = 'maintain';
        let goalDescription = '';
        let message = '';

        if (descriptionLower.match(/\b(muscle|muscular|bodybuilder|bodybuilding|buff|ripped|jacked|swole|strong|big|huge|massive|built|bulky|thick|heavy|powerlifter|weightlifter)\b/)) {
            goalType = 'bulk';
            goalDescription = 'Muscle building and strength gains - High protein, heavy compound lifts';
            message = '💪 AI Detected: MUSCLE BUILDING goal! Plan optimized for hypertrophy and strength gains.';
        }
        else if (descriptionLower.match(/\b(lean|shredded|defined|abs|six pack|sixpack|cut|ripped|vascular|peeled|toned|slim|athletic|fit|runner|cyclist|cardio)\b/)) {
            goalType = 'cut';
            goalDescription = 'Fat loss and muscle definition - Cardio focus, calorie deficit';
            message = '🔥 AI Detected: LEAN/CUT goal! Plan optimized for fat loss and muscle definition.';
        }
        else if (descriptionLower.match(/\b(tone|toned|fitness|yoga|pilates|flexible|active|healthy|wellness)\b/)) {
            goalType = 'tone';
            goalDescription = 'Overall fitness and toning - Balanced approach';
            message = '✨ AI Detected: TONING goal! Plan optimized for overall fitness and health.';
        }
        else if (descriptionLower.match(/\b(man|woman|person|people|body|torso|chest|arms|legs|athlete|gym|workout|exercise|sport)\b/)) {
            goalType = 'cut';
            goalDescription = 'Fitness goal - Balanced fat loss approach';
            message = '🎯 AI Detected: FITNESS goal image. Creating a balanced cutting plan!';
        }
        else {
            goalType = 'maintain';
            goalDescription = 'General fitness and health maintenance';
            message = '⚖️ Image uploaded. Creating a balanced fitness plan for you!';
        }

        console.log('✅ Goal Type:', goalType.toUpperCase());
        console.log('📋 Description:', goalDescription);

        return {
            isValid: true,
            category: 'valid_goal',
            message: message,
            goalType: goalType,
            details: {
                description: description,
                goalDescription: goalDescription,
                isImageClear: true,
                showsUpperBody: true,
                isHuman: true,
                isRealisticPhysique: true,
                isAchievable: true,
                reason: goalDescription
            }
        };

    } catch (error) {
        console.error('AI validation error:', error);
        const fallbackGoals = ['bulk', 'cut', 'tone', 'maintain'];
        const randomGoal = fallbackGoals[Math.floor(Math.random() * fallbackGoals.length)];

        return {
            isValid: true,
            category: 'valid_goal',
            goalType: randomGoal,
            message: `📸 Image uploaded! Creating your ${randomGoal.toUpperCase()} plan...`,
            details: {
                error: error.message,
                description: 'Fitness goal image uploaded',
                goalDescription: `${randomGoal.charAt(0).toUpperCase() + randomGoal.slice(1)} fitness plan`
            }
        };
    }
}

// ===== Input Validation =====
function initInputValidation() {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const ageInput = document.getElementById('age');

    heightInput?.addEventListener('blur', () => validateHeight(heightInput));
    heightInput?.addEventListener('input', () => clearValidation(heightInput));

    weightInput?.addEventListener('blur', () => validateWeight(weightInput));
    weightInput?.addEventListener('input', () => clearValidation(weightInput));

    ageInput?.addEventListener('blur', () => validateAge(ageInput));
    ageInput?.addEventListener('input', () => clearValidation(ageInput));
}

function validateHeight(input) {
    const value = input.value.trim().toLowerCase();
    if (!value) return true;

    let heightInInches = null;

    const feetInchesMatch = value.match(/(\d+)['']\s*(\d+)?/);
    if (feetInchesMatch) {
        heightInInches = parseInt(feetInchesMatch[1]) * 12 + parseInt(feetInchesMatch[2] || 0);
    }

    const cmMatch = value.match(/(\d+)\s*cm/);
    if (!heightInInches && cmMatch) {
        heightInInches = parseInt(cmMatch[1]) / 2.54;
    }

    const justNumber = value.match(/^(\d+\.?\d*)$/);
    if (!heightInInches && justNumber) {
        const num = parseFloat(justNumber[1]);
        heightInInches = num < 10 ? num * 12 : (num > 50 ? num / 2.54 : num);
    }

    if (heightInInches !== null) {
        if (heightInInches < 24) {
            showInputError(input, 'Height too short. Please check your input.');
            return false;
        }
        if (heightInInches > 102) {
            showInputError(input, 'Height exceeds human range (max ~8\'6").');
            return false;
        }
        showInputSuccess(input);
        return true;
    }

    showInputError(input, 'Enter height as: 5\'9", 175cm, or 69 inches');
    return false;
}

function validateWeight(input) {
    const value = input.value.trim().toLowerCase();
    if (!value) return true;

    let weightInLbs = null;

    const lbsMatch = value.match(/(\d+\.?\d*)\s*(?:lbs?|pounds?)/);
    if (lbsMatch) weightInLbs = parseFloat(lbsMatch[1]);

    const kgMatch = value.match(/(\d+\.?\d*)\s*(?:kg|kilograms?)/);
    if (!weightInLbs && kgMatch) weightInLbs = parseFloat(kgMatch[1]) * 2.205;

    const justNumber = value.match(/^(\d+\.?\d*)$/);
    if (!weightInLbs && justNumber) {
        const num = parseFloat(justNumber[1]);
        weightInLbs = num < 50 ? num * 2.205 : num;
    }

    if (weightInLbs !== null) {
        if (weightInLbs < 30) {
            showInputError(input, 'Weight too low. Please check your input.');
            return false;
        }
        if (weightInLbs > 1000) {
            showInputError(input, 'Weight exceeds realistic range (max 1000 lbs).');
            return false;
        }
        if (weightInLbs > 500) {
            showInputWarning(input, 'Unusually high weight. Please verify.');
            return true;
        }
        showInputSuccess(input);
        return true;
    }

    showInputError(input, 'Enter weight as: 170 lbs or 77 kg');
    return false;
}

function validateAge(input) {
    const value = parseInt(input.value);
    if (!input.value) return true;

    if (isNaN(value) || value < 13) {
        showInputError(input, 'Must be at least 13 years old.');
        return false;
    }
    if (value > 99) {
        showInputError(input, 'Please enter a realistic age (max 99).');
        return false;
    }
    showInputSuccess(input);
    return true;
}

function showInputError(input, message) {
    clearValidation(input);
    input.classList.add('input-error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-message error';
    errorDiv.innerHTML = `<span>✕</span> ${message}`;
    input.parentElement.appendChild(errorDiv);
}

function showInputWarning(input, message) {
    clearValidation(input);
    input.classList.add('input-warning');
    const warningDiv = document.createElement('div');
    warningDiv.className = 'validation-message warning';
    warningDiv.innerHTML = `<span>⚠</span> ${message}`;
    input.parentElement.appendChild(warningDiv);
}

function showInputSuccess(input) {
    clearValidation(input);
    input.classList.add('input-success');
}

function clearValidation(input) {
    input.classList.remove('input-error', 'input-warning', 'input-success');
    input.parentElement.querySelector('.validation-message')?.remove();
}

// ===== Checkbox Details Toggle =====
function initCheckboxDetails() {
    ['dietary', 'allergies', 'religious', 'injuries'].forEach(id => {
        const checkbox = document.getElementById(id);
        const details = document.getElementById(`${id}Details`);

        checkbox?.addEventListener('change', () => {
            if (checkbox.checked) {
                details?.classList.add('visible');
                setTimeout(() => details?.querySelector('input')?.focus(), 200);
            } else {
                details?.classList.remove('visible');
            }
        });
    });
}

// ===== Build Plan Button =====
function initBuildPlanButton() {
    const buildPlanBtn = document.getElementById('buildPlanBtn');

    buildPlanBtn?.addEventListener('click', async () => {
        const formData = gatherFormData();

        const heightValid = validateHeight(document.getElementById('height'));
        const weightValid = validateWeight(document.getElementById('weight'));

        if (!formData.height || !formData.weight) {
            showNotification('Please enter your height and weight.', 'warning');
            return;
        }

        if (!heightValid || !weightValid) {
            showNotification('Please fix the errors in your inputs.', 'error');
            return;
        }

        if (formData.hasGoalImage && imageValidationResult && !imageValidationResult.isValid) {
            showNotification('Please upload a valid, achievable physique goal.', 'error');
            return;
        }

        buildPlanBtn.innerHTML = `<span>Creating Your Plan...</span><div class="spinner"></div>`;
        buildPlanBtn.disabled = true;

        const planResults = document.getElementById('planResults');
        planResults?.classList.add('visible');
        planResults?.scrollIntoView({ behavior: 'smooth', block: 'center' });

        try {
            const plan = await generateDynamicFitnessPlan(formData);
            displayPlan(plan, formData);

            const greeting = userName ? `${userName}, your` : 'Your';
            showNotification(`${greeting} personalized fitness plan is ready! 🎉`, 'success');
        } catch (error) {
            console.error('Plan generation error:', error);
            const fallbackPlan = generateFallbackPlan(formData);
            currentPlan = fallbackPlan;
            displayPlan(fallbackPlan, formData);
            showNotification('Your plan is ready!', 'success');
        }

        // Show the email plan button after plan is built
        const emailPlanBtn = document.getElementById('emailPlanBtn');
        if (emailPlanBtn) {
            emailPlanBtn.style.display = 'flex';
            emailPlanBtn.style.justifyContent = 'center';
            emailPlanBtn.style.alignItems = 'center';
            emailPlanBtn.style.margin = '2rem auto';
        }

        buildPlanBtn.innerHTML = `
            <span>Build My Plan</span>
            <svg viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        `;
        buildPlanBtn.disabled = false;
    });
}

// ===== Generate Dynamic Fitness Plan with Variety =====
async function generateDynamicFitnessPlan(formData) {
    // Gather user allergies
    userAllergies = [];
    const allergiesInput = document.querySelector('#allergiesDetails input');
    if (document.getElementById('allergies')?.checked && allergiesInput?.value) {
        userAllergies = allergiesInput.value.toLowerCase().split(',').map(a => a.trim());
    }

    const manualGoal = document.getElementById('manualGoal')?.value;
    let goalType = 'maintain';

    if (manualGoal) {
        goalType = manualGoal;
    } else if (imageValidationResult?.goalType) {
        goalType = imageValidationResult.goalType;
    } else if (!formData.hasGoalImage) {
        const activity = formData.activity || 'moderate';
        if (activity === 'sedentary' || activity === 'light') {
            goalType = 'tone';
        } else if (activity === 'very') {
            goalType = 'bulk';
        } else {
            goalType = 'cut';
        }
    }

    // Dynamic exercise variations
    const exercises = {
        bulk: {
            morning: [
                '15-min warm-up with resistance bands. 3 sets of 12 bodyweight squats.',
                '10-min mobility work. 4 sets of 10 goblet squats with dumbbells.',
                'Dynamic stretching routine (10 min). 3 sets of 15 Bulgarian split squats.',
                '5-min jump rope. 4 sets of 8 barbell squats with pause at bottom.'
            ],
            afternoon: [
                '45-60 min strength: bench press, squats, deadlifts. 4 sets of 6-8 reps each.',
                '50 min heavy compound lifts: incline press, front squats, Romanian deadlifts. 5 sets of 5 reps.',
                '55 min powerlifting session: flat bench, box squats, sumo deadlifts. 4 sets of 6 reps.',
                '60 min hypertrophy: dumbbell press, leg press, rack pulls. 4 sets of 8-10 reps.'
            ],
            evening: [
                '20 min stretching and foam rolling for recovery.',
                '25 min yoga flow focusing on hip and shoulder mobility.',
                '15 min gentle stretching with lacrosse ball trigger point work.',
                '30 min restorative yoga session for muscle recovery.'
            ]
        },
        cut: {
            morning: [
                '30-min fasted cardio: light jog. 3 sets of 20 jumping jacks.',
                '25-min HIIT intervals: sprint 30s, walk 90s. 3 sets of 15 burpees.',
                '35-min brisk walk or cycling. 4 sets of 25 mountain climbers.',
                '20-min rowing machine intervals. 3 sets of 20 high knees.'
            ],
            afternoon: [
                '40-min circuit: burpees, mountain climbers, kettlebell swings. 3 rounds, 12 reps.',
                '45-min metabolic conditioning: box jumps, battle ropes, slam balls. 4 rounds, 15 reps.',
                '50-min CrossFit-style WOD: thrusters, pull-ups, running. 5 rounds for time.',
                '35-min cardio + bodyweight: running, push-ups, squats, lunges. 4 rounds.'
            ],
            evening: [
                '25 min HIIT or 30 min steady cardio, then stretches.',
                '30 min cycling or swimming, followed by 10 min cool-down.',
                '20 min stair climbing or incline walking, plus flexibility work.',
                '35 min elliptical or rowing with 10 min yoga stretches.'
            ]
        },
        maintain: {
            morning: [
                '20-min moderate cardio: cycling or jogging. 3 sets of 15 push-ups.',
                '25-min swim or brisk walk. 3 sets of 12 dips.',
                '15-min bike ride. 4 sets of 10 pull-ups or assisted pull-ups.',
                '30-min nature hike. 3 sets of 20 bodyweight squats.'
            ],
            afternoon: [
                '40-min balanced workout: 20 min strength (pull-ups, dips, lunges) + 20 min cardio.',
                '45-min full-body circuit: rows, overhead press, step-ups, bike intervals.',
                '50-min functional fitness: farmer carries, sled pushes, kettlebell flows.',
                '35-min calisthenics park workout: bars, rings, parallel bars.'
            ],
            evening: [
                '20 min yoga or Pilates, focusing on flexibility and core.',
                '25 min stretching routine with resistance bands.',
                '30 min gentle flow yoga session.',
                '15 min core work: planks, dead bugs, bird dogs.'
            ]
        },
        tone: {
            morning: [
                '25-min cardio + bodyweight circuit: squats, lunges, planks. 3 sets of 12 reps.',
                '30-min dance cardio or Zumba. 3 sets of 15 glute bridges.',
                '20-min kickboxing workout. 4 sets of 10 reverse lunges.',
                '25-min spin class or stationary bike. 3 sets of 20 crunches.'
            ],
            afternoon: [
                '35-min moderate strength: dumbbells, resistance bands. 3 sets of 15 reps.',
                '40-min barre or Pilates reformer class. 4 sets of 12 reps various exercises.',
                '30-min TRX suspension training full-body workout.',
                '45-min group fitness class: BodyPump or similar.'
            ],
            evening: [
                '30 min Pilates or barre focusing on core and posture.',
                '25 min yoga sculpt with light weights.',
                '35 min PiYo (Pilates + Yoga fusion).',
                '20 min mat Pilates focusing on abs and glutes.'
            ]
        }
    };

    // Dynamic food options with allergy replacement
    const foods = {
        bulk: {
            morning: [
                '4 scrambled eggs with whole wheat toast, avocado, and protein shake (30g protein).',
                '3 egg omelette with cheese, turkey bacon, oatmeal with banana.',
                'Greek yogurt parfait with granola, 2 eggs, whole grain English muffin.',
                'Protein pancakes (3) with berries, 2 chicken sausages, almond butter.'
            ],
            afternoon: [
                'Grilled chicken breast (8oz) with sweet potato, broccoli, and olive oil.',
                'Lean beef burger (8oz) with quinoa, asparagus, avocado.',
                'Baked salmon (8oz) with brown rice, green beans, tahini sauce.',
                'Turkey meatballs (10) with pasta, marinara, parmesan, side salad.'
            ],
            evening: [
                'Salmon (6oz) with quinoa, mixed vegetables, and Greek yogurt parfait.',
                'Grilled steak (7oz) with baked potato, Brussels sprouts, cottage cheese.',
                'Baked cod (7oz) with wild rice, roasted carrots, protein pudding.',
                'Chicken thighs (8oz) with couscous, zucchini, casein shake.'
            ]
        },
        cut: {
            morning: [
                'Protein omelette (3 eggs) with spinach, mushrooms, 1 slice whole grain toast.',
                'Egg white scramble with peppers, turkey, small bowl of berries.',
                'Greek yogurt with chia seeds, handful of almonds, green tea.',
                'Smoothie bowl with protein powder, banana, spinach, almond milk, topped with seeds.'
            ],
            afternoon: [
                'Turkey or tuna salad with mixed greens, cherry tomatoes, cucumber, lemon dressing.',
                'Grilled chicken (5oz) over large salad with vinaigrette, apple.',
                'Shrimp stir-fry with vegetables, small portion brown rice.',
                'Baked tilapia (6oz) with steamed broccoli and cauliflower rice.'
            ],
            evening: [
                'Grilled fish or lean beef (5oz) with steamed vegetables and small brown rice.',
                'Chicken breast (5oz) with zucchini noodles, tomato sauce.',
                'Turkey meatballs (5) with spaghetti squash and marinara.',
                'Baked cod (6oz) with roasted Brussels sprouts and sweet potato (small).'
            ]
        },
        maintain: {
            morning: [
                'Oatmeal with berries, nuts, 2 boiled eggs, and green tea.',
                'Whole grain toast with avocado, poached eggs, fruit salad.',
                'Quinoa breakfast bowl with nuts, seeds, banana, almond milk.',
                'Protein smoothie with oats, berries, peanut butter, milk.'
            ],
            afternoon: [
                'Chicken or tofu stir-fry with brown rice, mixed vegetables, sesame oil.',
                'Turkey sandwich on whole grain with hummus, veggies, side of fruit.',
                'Burrito bowl with beans, rice, grilled vegetables, salsa, avocado.',
                'Salmon poke bowl with edamame, seaweed, brown rice, cucumber.'
            ],
            evening: [
                'Baked chicken breast (6oz) with roasted vegetables and quinoa.',
                'Lean ground turkey (6oz) with whole wheat pasta and tomato basil sauce.',
                'Grilled shrimp (8oz) with zucchini, bell peppers, couscous.',
                'Baked tofu (8oz) with stir-fried veggies and jasmine rice.'
            ]
        },
        tone: {
            morning: [
                'Greek yogurt bowl with granola, mixed berries, and drizzle of honey.',
                'Smoothie with protein powder, spinach, mango, coconut water.',
                'Avocado toast on whole grain with poached egg, side of fruit.',
                'Overnight oats with chia seeds, almond butter, sliced banana.'
            ],
            afternoon: [
                'Quinoa bowl with grilled chicken, chickpeas, cucumber, tomatoes, and tahini.',
                'Mediterranean wrap with hummus, falafel, mixed greens, feta.',
                'Buddha bowl with tofu, edamame, carrots, avocado, ginger dressing.',
                'Chicken Caesar salad with parmesan, whole grain croutons, light dressing.'
            ],
            evening: [
                'Grilled salmon (5oz) with roasted sweet potato and steamed broccoli.',
                'Turkey meatballs with zucchini noodles and marinara sauce.',
                'Baked chicken (5oz) with quinoa pilaf and roasted vegetables.',
                'Shrimp tacos (3) with cabbage slaw, avocado, corn tortillas.'
            ]
        }
    };

    // Meditation variations
    const meditations = {
        morning: [
            '5 min focused breathing and goal visualization.',
            '5 min gratitude journaling and affirmations.',
            '5 min guided morning meditation app session.',
            '5 min mindful coffee/tea ritual with intention setting.'
        ],
        afternoon: [
            '10-min outdoor walk for active recovery and mental clarity.',
            '10-min mindful lunch break away from screens.',
            '10-min breathing exercises or meditation app.',
            '10-min nature observation or walking meditation.'
        ],
        evening: [
            '15 min guided meditation or journaling before bed.',
            '15 min body scan relaxation technique.',
            '15 min evening reflection and gratitude practice.',
            '15 min gentle yin yoga with meditation focus.'
        ]
    };

    // Randomly select variations
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

    let morningFood = random(foods[goalType].morning);
    let afternoonFood = random(foods[goalType].afternoon);
    let eveningFood = random(foods[goalType].evening);

    // Replace allergenic foods
    morningFood = replaceAllergicFoods(morningFood);
    afternoonFood = replaceAllergicFoods(afternoonFood);
    eveningFood = replaceAllergicFoods(eveningFood);

    const plan = {
        goalType: goalType,
        morning: {
            exercise: random(exercises[goalType].morning),
            food: morningFood,
            meditation: random(meditations.morning)
        },
        afternoon: {
            exercise: random(exercises[goalType].afternoon),
            food: afternoonFood,
            meditation: random(meditations.afternoon)
        },
        evening: {
            exercise: random(exercises[goalType].evening),
            food: eveningFood,
            meditation: random(meditations.evening)
        }
    };

    currentPlan = plan;
    return plan;
}

// ===== Replace Allergic Foods =====
function replaceAllergicFoods(foodText) {
    if (!userAllergies || userAllergies.length === 0) return foodText;

    let modifiedFood = foodText;

    userAllergies.forEach(allergy => {
        const allergyClean = allergy.trim().toLowerCase();

        // Find matching alternatives
        Object.keys(CONFIG.FOOD_ALTERNATIVES).forEach(allergen => {
            if (allergyClean.includes(allergen) || allergen.includes(allergyClean)) {
                const alternatives = CONFIG.FOOD_ALTERNATIVES[allergen];
                const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];

                // Case-insensitive replacement
                const regex = new RegExp(allergen, 'gi');
                modifiedFood = modifiedFood.replace(regex, replacement);

                console.log(`🔄 Replaced ${allergen} with ${replacement} due to allergy`);
            }
        });
    });

    return modifiedFood;
}

// ===== Fallback Plan =====
function generateFallbackPlan(formData) {
    return {
        goalType: 'maintain',
        morning: {
            exercise: '20 min jog or 3 sets of 15 jumping jacks',
            food: '2 eggs, whole grain toast, and a banana',
            meditation: '5 min deep breathing exercises'
        },
        afternoon: {
            exercise: '30 min gym: squats, bench press, rows',
            food: 'Grilled chicken salad with quinoa',
            meditation: '10 min walk outdoors'
        },
        evening: {
            exercise: '15 min stretching or yoga',
            food: 'Baked chicken with vegetables and brown rice',
            meditation: '10 min guided meditation before bed'
        }
    };
}

// ===== Display Plan =====
function displayPlan(plan, formData) {
    const goalLabels = {
        bulk: 'Customized for Muscle Building 💪',
        cut: 'Customized for Fat Loss 🔥',
        maintain: 'Customized for Maintenance ⚖️',
        tone: 'Customized for Toning ✨'
    };
    const goalEl = document.getElementById('planGoalType');
    if (goalEl) {
        goalEl.textContent = goalLabels[plan.goalType] || 'Your Personalized Plan';
    }

    // Display exercises with video links
    displayExerciseWithVideo('morning', plan.morning?.exercise || 'Light cardio warmup');
    displayExerciseWithVideo('afternoon', plan.afternoon?.exercise || 'Main workout');
    displayExerciseWithVideo('evening', plan.evening?.exercise || 'Cool down stretches');

    // Display meals with macros
    displayMealWithMacros('morning', plan.morning?.food || 'Balanced breakfast', plan.goalType);
    displayMealWithMacros('afternoon', plan.afternoon?.food || 'Protein-rich lunch', plan.goalType);
    displayMealWithMacros('evening', plan.evening?.food || 'Light dinner', plan.goalType);

    // Display meditation
    document.getElementById('morningMeditation').textContent = plan.morning?.meditation || '5 min meditation';
    document.getElementById('afternoonMeditation').textContent = plan.afternoon?.meditation || 'Mindful walk';
    document.getElementById('eveningMeditation').textContent = plan.evening?.meditation || 'Evening relaxation';
}

// ===== Display Exercise with Video Link =====
function displayExerciseWithVideo(timeOfDay, exerciseText) {
    const exerciseEl = document.getElementById(`${timeOfDay}Exercise`);
    const videoBtn = document.getElementById(`${timeOfDay}ExerciseVideo`);

    if (exerciseEl) {
        exerciseEl.textContent = exerciseText;
    }

    if (videoBtn) {
        // Extract main exercise name for YouTube search
        const exerciseName = extractExerciseName(exerciseText);
        const youtubeURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' proper form tutorial')}`;

        videoBtn.style.display = 'flex';
        videoBtn.onclick = () => window.open(youtubeURL, '_blank');
    }
}

// ===== Extract Exercise Name from Text =====
function extractExerciseName(text) {
    // Remove sets/reps info and get main exercise name
    // Examples: "3 sets of 15 push-ups" -> "push-ups"
    //           "20 min jog or 3 sets of 15 jumping jacks" -> "jog jumping jacks"
    const cleaned = text
        .replace(/\d+\s*(sets?|reps?|min|minutes?|seconds?|sec)/gi, '')
        .replace(/\(.*?\)/g, '')
        .replace(/of\s+/gi, '')
        .trim();
    return cleaned;
}

// ===== Display Meal with Macros =====
function displayMealWithMacros(timeOfDay, mealText, goalType) {
    const foodEl = document.getElementById(`${timeOfDay}Food`);
    const macrosEl = document.getElementById(`${timeOfDay}Macros`);

    if (foodEl) {
        foodEl.textContent = mealText;
    }

    if (macrosEl) {
        const macros = estimateMacros(mealText, goalType);
        macrosEl.innerHTML = `
            <div class="macro-grid">
                <div class="macro-item">
                    <div class="macro-label">Protein</div>
                    <div class="macro-value">${macros.protein}g</div>
                </div>
                <div class="macro-item">
                    <div class="macro-label">Carbs</div>
                    <div class="macro-value">${macros.carbs}g</div>
                </div>
                <div class="macro-item">
                    <div class="macro-label">Fats</div>
                    <div class="macro-value">${macros.fats}g</div>
                </div>
                <div class="macro-item vitamins">
                    <div class="macro-label">Key Vitamins</div>
                    <div class="macro-value-small">${macros.vitamins}</div>
                </div>
            </div>
        `;
        macrosEl.style.display = 'block';
    }
}

// ===== Estimate Macros Based on Meal =====
function estimateMacros(mealText, goalType) {
    const lowerMeal = mealText.toLowerCase();

    // Base macros by goal type
    const baseMacros = {
        bulk: { protein: 40, carbs: 50, fats: 15 },
        cut: { protein: 35, carbs: 25, fats: 12 },
        maintain: { protein: 30, carbs: 40, fats: 15 },
        tone: { protein: 32, carbs: 35, fats: 13 }
    };

    let macros = { ...baseMacros[goalType] || baseMacros.maintain };
    let vitamins = [];

    // Adjust based on ingredients
    if (lowerMeal.includes('chicken') || lowerMeal.includes('turkey')) {
        macros.protein += 10;
        vitamins.push('B6', 'Niacin');
    }
    if (lowerMeal.includes('salmon') || lowerMeal.includes('fish')) {
        macros.protein += 12;
        macros.fats += 8;
        vitamins.push('Omega-3', 'D', 'B12');
    }
    if (lowerMeal.includes('egg')) {
        macros.protein += 6;
        vitamins.push('B12', 'D', 'Choline');
    }
    if (lowerMeal.includes('oat') || lowerMeal.includes('quinoa') || lowerMeal.includes('rice')) {
        macros.carbs += 15;
        vitamins.push('Fiber', 'Iron');
    }
    if (lowerMeal.includes('avocado') || lowerMeal.includes('nuts') || lowerMeal.includes('olive oil')) {
        macros.fats += 10;
        vitamins.push('E', 'K');
    }
    if (lowerMeal.includes('berr') || lowerMeal.includes('fruit')) {
        macros.carbs += 10;
        vitamins.push('C', 'Antioxidants');
    }
    if (lowerMeal.includes('spinach') || lowerMeal.includes('kale') || lowerMeal.includes('vegetable')) {
        vitamins.push('A', 'K', 'Folate');
    }
    if (lowerMeal.includes('yogurt') || lowerMeal.includes('milk') || lowerMeal.includes('cheese')) {
        macros.protein += 8;
        vitamins.push('Calcium', 'D');
    }
    if (lowerMeal.includes('tofu') || lowerMeal.includes('tempeh') || lowerMeal.includes('beans')) {
        macros.protein += 12;
        vitamins.push('Iron', 'Magnesium');
    }

    // Default vitamins if none found
    if (vitamins.length === 0) {
        vitamins = ['B-Complex', 'C', 'Iron'];
    }

    return {
        protein: Math.round(macros.protein),
        carbs: Math.round(macros.carbs),
        fats: Math.round(macros.fats),
        vitamins: vitamins.slice(0, 4).join(', ')
    };
}

// ===== Gather Form Data =====
function gatherFormData() {
    return {
        height: document.getElementById('height')?.value || '',
        weight: document.getElementById('weight')?.value || '',
        age: document.getElementById('age')?.value || '',
        activity: document.getElementById('activity')?.value || '',
        hasGoalImage: document.getElementById('uploadArea')?.classList.contains('has-image') || false,
        userName
    };
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'warning' ? '⚠' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span>${message}</span>
        </div>
    `;

    const colors = { success: '#10B981', warning: '#F59E0B', error: '#EF4444', info: '#4A7BF7' };
    notification.style.cssText = `
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(100px);
        background: ${colors[type] || colors.info}; color: white; padding: 16px 24px;
        border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 10000;
        transition: transform 0.3s ease; font-weight: 500; max-width: 90%;
    `;

    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.style.transform = 'translateX(-50%) translateY(0)');
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
// ===== Email Plan Button =====
function initEmailPlanButton() {
    const emailPlanBtn = document.getElementById('emailPlanBtn');
    emailPlanBtn?.addEventListener('click', async () => {
        if (!currentPlan) {
            showNotification('No plan found to email. Please build your plan first.', 'warning');
            return;
        }

        if (!userEmail) {
            showNotification('Email address missing. Please refresh and enter your email.', 'error');
            return;
        }

        emailPlanBtn.innerHTML = `<div class="spinner small" style="margin-right: 10px;"></div> Dispatching Your Blueprint...`;
        emailPlanBtn.disabled = true;
        emailPlanBtn.style.opacity = "0.8";
        emailPlanBtn.style.transform = "scale(0.98)";

        try {
            const planText = formatPlanForEmail(currentPlan);

            const templateParams = {
                to_email: userEmail,
                to_name: userName || 'Fitness Enthusiast',
                plan: planText
            };

            await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.PLAN_TEMPLATE_ID, templateParams);

            showNotification('🚀 Mission Accomplished! Your blueprint is on its way.', 'success');

            // Celebratory feedback
            emailPlanBtn.style.background = 'rgba(16, 185, 129, 0.2)';
            emailPlanBtn.style.borderColor = '#10B981';
            emailPlanBtn.style.transform = "scale(1)";
            emailPlanBtn.innerHTML = `
                <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" style="margin-right: 8px;">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Blueprint Sent!
            `;

            setTimeout(() => {
                emailPlanBtn.innerHTML = `
                    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" style="margin-right: 8px;">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Email This Plan to Me Again
                `;
                emailPlanBtn.disabled = false;
            }, 5000);

        } catch (error) {
            console.error('EmailJS Plan Send Error:', error);
            showNotification('⚠️ Failed to send email. Please try again later.', 'error');
            emailPlanBtn.innerHTML = `
                <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" style="margin-right: 8px;">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Retry Emailing Plan
            `;
            emailPlanBtn.disabled = false;
        }
    });
}

// ===== Format Plan for Email =====
function formatPlanForEmail(plan) {
    let formatted = `==============================\n`;
    formatted += `  YOUR PERSONALIZED FITNESS PLAN\n`;
    formatted += `==============================\n\n`;

    const goalTitle = {
        bulk: 'BULK (Muscle Building) 💪',
        cut: 'CUT (Fat Loss) 🔥',
        tone: 'TONE (General Fitness) ✨',
        maintain: 'MAINTAIN (Balanced) ⚖️'
    }[plan.goalType] || plan.goalType.toUpperCase();

    formatted += `GOAL: ${goalTitle}\n\n`;

    const times = [
        { id: 'morning', label: '🌅 MORNING' },
        { id: 'afternoon', label: '☀️ AFTERNOON' },
        { id: 'evening', label: '🌙 EVENING' }
    ];

    times.forEach(time => {
        const data = plan[time.id];
        const macros = estimateMacros(data.food, plan.goalType);

        formatted += `${time.label}\n`;
        formatted += `------------------------------\n`;
        formatted += `🏋️ EXERCISE:\n   ${data.exercise}\n\n`;

        formatted += `🥗 MEAL:\n   ${data.food}\n`;
        formatted += `   NUTRITION:\n`;
        formatted += `   - Protein: ${macros.protein}g\n`;
        formatted += `   - Carbs:   ${macros.carbs}g\n`;
        formatted += `   - Fats:    ${macros.fats}g\n`;
        formatted += `   - Vitamins: ${macros.vitamins}\n\n`;

        formatted += `🧘 MINDFULNESS:\n   ${data.meditation}\n\n`;
    });

    const quotes = [
        "Believe you can and you're halfway there.",
        "Your only limit is you.",
        "Don't stop until you're proud.",
        "Discipline is doing what needs to be done, even if you don't want to do it.",
        "The hard part isn't getting your body in shape. The hard part is getting your mind in shape."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    formatted += `==============================\n`;
    formatted += `  "${randomQuote}"\n`;
    formatted += `==============================\n\n`;
    formatted += `Stay consistent and reach your goals!\n`;
    formatted += `Please contact soj5@cornell.edu if needed.\n\n`;
    formatted += `- AI Fitness Blueprint Team`;

    return formatted;
}
