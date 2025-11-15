export function WebPagesContact($$$DATA$$$ = {}, systemData = {}) {
    const {App, View, __base__, __layout__, __page__, __component__, __partial__, __system__, __env = {}, __helper = {}} = systemData;
    const __VIEW_PATH__ = 'web.pages.contact';
    const __VIEW_ID__ = $$$DATA$$$.__SSR_VIEW_ID__ || App.View.generateViewId();
    const __VIEW_TYPE__ = 'view';
    // this is the wrapper element
    
    const __WRAPPER_ELEMENT__ = document.createElement('template');
    const __REFS__ = [];
    const self = new View.Engine();
    const __STATE__ = new View.State(self);


    const parseRefs = (frag) => {
        for (let i = 0; i < frag.childNodes.length; i++) {
            const node = frag.childNodes[i];
            __REFS__.push(node);
        }
    }
    const createHtml = (template) => {
        try {
            __WRAPPER_ELEMENT__.innerHTML = template;
        } catch (error) {
            console.error(error);
            __WRAPPER_ELEMENT__.innerHTML = '';
        }
        let frag = __WRAPPER_ELEMENT__.content;
        parseRefs(frag);
        return frag;
    }
    
    /**
     * 
     * @param {*} value 
     * @returns {[any, function, string]}
     */
    const useState = (value) => {
        return __STATE__.__useState(value);
    };
    const updateRealState = (state) => {
        __STATE__.__updateRealState(state);
    };

    const lockUpdateRealState = () => {
        __STATE__.__lockUpdateRealState();
    };
    const updateStateByKey = (key, state) => {
        __STATE__.__updateStateByKey(key, state);
    };

    if(typeof $$$DATA$$$.__SSR_VIEW_ID__ !== 'undefined'){
        delete $$$DATA$$$.__SSR_VIEW_ID__;
    }
    const __UPDATE_DATA_TRAIT__ = {};
    const __VARIABLE_LIST__ = [];

    self.setup('web.pages.contact', {
        superView: 'layouts.base',
        hasSuperView: true,
        viewType: 'view',
        sections: {
        "meta:title":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:description":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:keywords":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "content":{
            "type":"long",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "scripts":{
            "type":"long",
            "preloader":false,
            "useVars":false,
            "script":{}
        }
    },
        wrapperConfig: { enable: false, tag: null, follow: true, attributes: {} },
        __props__: ["__WRAPPER_ELEMENT__", "createHtml", "__REFS__", "parseRefs"],
            __WRAPPER_ELEMENT__: __WRAPPER_ELEMENT__,
            refs: __REFS__,
            states: __STATE__,
            parseRefs: parseRefs,
            createHtml: createHtml,
        hasAwaitData: false,
        hasFetchData: false,
        subscribe: false,
        fetch: null,
        data: $$$DATA$$$,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: true,
        hasSectionPreload: false,
        hasPrerender: false,
        renderLongSections: ["content","scripts"],
        renderSections: ["meta:title","meta:description","meta:keywords","content","scripts"],
        prerenderSections: [],
        userDefined: {},
        scripts: [],
        styles: [],
        resources: [],
        commitConstructorData: function() {
            // Then update states from data
            
            // Finally lock state updates
            
        },
        updateVariableData: function(data) {
            // Update all variables first
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    this.updateVariableItem(key, data[key]);
                }
            }
            // Then update states from data
            
            // Finally lock state updates
            
        },
        updateVariableItem: function(key, value) {
            this.data[key] = value;
            if (typeof __UPDATE_DATA_TRAIT__[key] === "function") {
                __UPDATE_DATA_TRAIT__[key](value);
            }
        },
        loadServerData: function() {
    
},
        prerender: function() {
    return null;
},
        render: function() {
                
    let __outputRenderedContent__ = '';
            try {
                __outputRenderedContent__ = `

${this.__section('meta:title', 'Contact - One Laravel Framework', 'string')}
${this.__section('meta:description', 'Get in touch with the One Laravel team - Support, contributions, and community resources.', 'string')}
${this.__section('meta:keywords', 'One Laravel contact, support, community, contributions, help', 'string')}

${this.__section('content', `<!-- Hero Section -->
<section class="hero" style="padding: 3rem 0;">
<div class="container">
<h1>Get in Touch</h1>
<p>We'd love to hear from you. Reach out with questions, feedback, or contributions.</p>
</div>
</section>

<section class="py-4">
<div class="container">
<div class="row">
<!-- Contact Information -->
<div class="col-lg-8">
<div class="contact-content">
<!-- Contact Form -->
<div class="contact-form-section mb-5">
<h2>Send Us a Message</h2>
<p>Have a question about One Laravel? Want to contribute? We're here to help!</p>

<form class="contact-form" id="contact-form">
<div class="row">
<div class="col-md-6 mb-3">
<label for="name" class="form-label">Name *</label>
<input type="text" class="form-control" id="name" required>
</div>
<div class="col-md-6 mb-3">
<label for="email" class="form-label">Email *</label>
<input type="email" class="form-control" id="email" required>
</div>
</div>

<div class="mb-3">
<label for="subject" class="form-label">Subject *</label>
<select class="form-control" id="subject" required>
<option value="">Select a topic...</option>
<option value="general">General Question</option>
<option value="technical">Technical Support</option>
<option value="bug">Bug Report</option>
<option value="feature">Feature Request</option>
<option value="contribution">Contribution</option>
<option value="partnership">Partnership</option>
</select>
</div>

<div class="mb-3">
<label for="message" class="form-label">Message *</label>
<textarea class="form-control" id="message" rows="6" required
placeholder="Tell us more about your question or feedback..."></textarea>
</div>

<div class="mb-3">
<div class="form-check">
<input class="form-check-input" type="checkbox" id="newsletter">
<label class="form-check-label" for="newsletter">
I'd like to receive updates about One Laravel
</label>
</div>
</div>

<button type="submit" class="btn btn-primary btn-lg">
<i class="fas fa-paper-plane"></i>
Send Message
</button>
</form>

<div id="form-result" class="mt-3" style="display: none;"></div>
</div>

<!-- FAQ Section -->
<div class="faq-section">
<h2>Frequently Asked Questions</h2>
<div class="faq-list">
<div class="faq-item">
<div class="faq-question" data-toggle="faq-1">
<h4>How do I get started with One Laravel?</h4>
<i class="fas fa-chevron-down"></i>
</div>
<div class="faq-answer" id="faq-1">
<p>Getting started is easy! Install One Laravel via Composer with <code>composer create-project one-laravel/laravel my-app</code>, then follow our <a href="${App.View.escString(App.Helper.url('/docs'))}" data-navigate="/web/docs">quick start guide</a>.</p>
</div>
</div>

<div class="faq-item">
<div class="faq-question" data-toggle="faq-2">
<h4>Is One Laravel compatible with existing Laravel projects?</h4>
<i class="fas fa-chevron-down"></i>
</div>
<div class="faq-answer" id="faq-2">
<p>Yes! One Laravel can be added to existing Laravel applications. Simply install the package and start using reactive components alongside your existing Blade templates.</p>
</div>
</div>

<div class="faq-item">
<div class="faq-question" data-toggle="faq-3">
<h4>How does One Laravel compare to other frontend frameworks?</h4>
<i class="fas fa-chevron-down"></i>
</div>
<div class="faq-answer" id="faq-3">
<p>One Laravel combines the simplicity of Blade templates with the reactivity of modern frameworks like Vue.js or React. You get reactive components without the complexity of a separate frontend build process.</p>
</div>
</div>

<div class="faq-item">
<div class="faq-question" data-toggle="faq-4">
<h4>Can I contribute to One Laravel?</h4>
<i class="fas fa-chevron-down"></i>
</div>
<div class="faq-answer" id="faq-4">
<p>Absolutely! We welcome contributions of all kinds - bug reports, feature requests, documentation improvements, and code contributions. Check out our GitHub repository to get started.</p>
</div>
</div>

<div class="faq-item">
<div class="faq-question" data-toggle="faq-5">
<h4>Is there commercial support available?</h4>
<i class="fas fa-chevron-down"></i>
</div>
<div class="faq-answer" id="faq-5">
<p>For commercial support, training, or custom development services, please contact us using the form above or reach out via email. We offer various support packages for teams and enterprises.</p>
</div>
</div>
</div>
</div>
</div>
</div>

<!-- Sidebar -->
<div class="col-lg-4">
<div class="contact-sidebar">
<!-- Contact Methods -->
<div class="contact-methods mb-4">
<h3>Get in Touch</h3>

<div class="contact-method">
<div class="contact-icon">
<i class="fas fa-envelope"></i>
</div>
<div class="contact-info">
<h4>Email</h4>
<p>hello@onelaravel.com</p>
<small>We'll respond within 24 hours</small>
</div>
</div>

<div class="contact-method">
<div class="contact-icon">
<i class="fab fa-github"></i>
</div>
<div class="contact-info">
<h4>GitHub</h4>
<p>github.com/one-laravel</p>
<small>Issues, contributions & discussions</small>
</div>
</div>

<div class="contact-method">
<div class="contact-icon">
<i class="fab fa-discord"></i>
</div>
<div class="contact-info">
<h4>Discord</h4>
<p>Join our community</p>
<small>Real-time chat & support</small>
</div>
</div>

<div class="contact-method">
<div class="contact-icon">
<i class="fab fa-twitter"></i>
</div>
<div class="contact-info">
<h4>Twitter</h4>
<p>@onelaravel</p>
<small>Updates & announcements</small>
</div>
</div>
</div>

<!-- Community Links -->
<div class="community-section mb-4">
<h3>Community</h3>
<p>Join our growing community of developers building amazing SPAs with One Laravel.</p>

<div class="social-links">
<a href="#" class="social-link discord">
<i class="fab fa-discord"></i>Discord
</a>
<a href="#" class="social-link github">
<i class="fab fa-github"></i>GitHub
</a>
<a href="#" class="social-link twitter">
<i class="fab fa-twitter"></i>Twitter
</a>
<a href="#" class="social-link youtube">
<i class="fab fa-youtube"></i>YouTube
</a>
</div>
</div>

<!-- Newsletter -->
<div class="newsletter-section">
<h3>Stay Updated</h3>
<p>Get the latest news, tutorials, and updates delivered to your inbox.</p>

<form class="newsletter-form" id="newsletter-form">
<div class="input-group">
<input type="email" class="form-control" placeholder="Your email address" required>
<button type="submit" class="btn btn-primary">
Subscribe
</button>
</div>
<small class="form-text text-muted mt-2">
No spam, unsubscribe at any time.
</small>
</form>
</div>

<!-- Office Info -->
<div class="office-info">
<h3>Our Office</h3>
<div class="office-location">
<i class="fas fa-map-marker-alt"></i>
<div>
<p><strong>One Laravel HQ</strong></p>
<p>123 Developer Street<br>
Tech District, TD 12345<br>
San Francisco, CA</p>
</div>
</div>

<div class="office-hours">
<h4>Office Hours</h4>
<p>Monday - Friday: 9:00 AM - 6:00 PM PST<br>
Saturday: 10:00 AM - 2:00 PM PST<br>
Sunday: Closed</p>
</div>
</div>
</div>
</div>
</div>

<!-- Team Section -->
<div class="team-section mt-5">
<div class="row">
<div class="col-12">
<h2 class="text-center mb-4">Meet Our Team</h2>
<p class="text-center mb-5">The passionate developers behind One Laravel</p>
</div>
</div>

<div class="row">
<div class="col-md-4 mb-4">
<div class="team-member">
<div class="team-avatar">
<img src="https://via.placeholder.com/150x150/667eea/ffffff?text=JD" alt="John Doe">
</div>
<div class="team-info">
<h4>John Doe</h4>
<p class="team-role">Lead Developer</p>
<p class="team-bio">Creator of One Laravel with 10+ years of experience in web development and a passion for making Laravel development more enjoyable.</p>
<div class="team-social">
<a href="#"><i class="fab fa-twitter"></i></a>
<a href="#"><i class="fab fa-github"></i></a>
<a href="#"><i class="fab fa-linkedin"></i></a>
</div>
</div>
</div>
</div>

<div class="col-md-4 mb-4">
<div class="team-member">
<div class="team-avatar">
<img src="https://via.placeholder.com/150x150/f093fb/ffffff?text=JS" alt="Jane Smith">
</div>
<div class="team-info">
<h4>Jane Smith</h4>
<p class="team-role">Frontend Architect</p>
<p class="team-bio">Frontend specialist focused on creating intuitive developer experiences and building the reactive systems that power One Laravel.</p>
<div class="team-social">
<a href="#"><i class="fab fa-twitter"></i></a>
<a href="#"><i class="fab fa-github"></i></a>
<a href="#"><i class="fab fa-dribbble"></i></a>
</div>
</div>
</div>
</div>

<div class="col-md-4 mb-4">
<div class="team-member">
<div class="team-avatar">
<img src="https://via.placeholder.com/150x150/4ecdc4/ffffff?text=MJ" alt="Mike Johnson">
</div>
<div class="team-info">
<h4>Mike Johnson</h4>
<p class="team-role">DevOps Engineer</p>
<p class="team-bio">Ensures One Laravel runs smoothly in production environments and maintains our deployment infrastructure and CI/CD pipelines.</p>
<div class="team-social">
<a href="#"><i class="fab fa-twitter"></i></a>
<a href="#"><i class="fab fa-github"></i></a>
<a href="#"><i class="fab fa-docker"></i></a>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>`, 'html')}

${this.__section('scripts', `<script>
document.addEventListener('DOMContentLoaded', function() {
// Contact form handling
const contactForm = document.getElementById('contact-form');
const formResult = document.getElementById('form-result');

contactForm.addEventListener('submit', function(e) {
e.preventDefault();

// Simulate form submission
const formData = new FormData(contactForm);
const name = document.getElementById('name').value;
const email = document.getElementById('email').value;
const subject = document.getElementById('subject').value;
const message = document.getElementById('message').value;

// Basic validation
if (!name || !email || !subject || !message) {
showFormResult('Please fill in all required fields.', 'error');
return;
}

// Show loading state
const submitBtn = contactForm.querySelector('button[type="submit"]');
const originalText = submitBtn.innerHTML;
submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
submitBtn.disabled = true;

// Simulate API call
setTimeout(() => {
showFormResult('Thanks for your message! We\'ll get back to you within 24 hours.', 'success');
contactForm.reset();

// Reset button
submitBtn.innerHTML = originalText;
submitBtn.disabled = false;
}, 2000);
});

// Newsletter form handling
const newsletterForm = document.getElementById('newsletter-form');
newsletterForm.addEventListener('submit', function(e) {
e.preventDefault();

const email = this.querySelector('input[type="email"]').value;
const submitBtn = this.querySelector('button[type="submit"]');

if (!email) {
alert('Please enter your email address.');
return;
}

const originalText = submitBtn.textContent;
submitBtn.textContent = 'Subscribing...';
submitBtn.disabled = true;

setTimeout(() => {
alert('Thanks for subscribing! You\'ll receive our next newsletter.');
this.reset();
submitBtn.textContent = originalText;
submitBtn.disabled = false;
}, 1500);
});

// FAQ toggle functionality
document.querySelectorAll('.faq-question').forEach(question => {
question.addEventListener('click', function() {
const targetId = this.dataset.toggle;
const answer = document.getElementById(targetId);
const icon = this.querySelector('i');

// Close all other FAQs
document.querySelectorAll('.faq-answer').forEach(faq => {
if (faq.id !== targetId) {
faq.classList.remove('active');
}
});

document.querySelectorAll('.faq-question i').forEach(i => {
if (i !== icon) {
i.classList.remove('fa-chevron-up');
i.classList.add('fa-chevron-down');
}
});

// Toggle current FAQ
answer.classList.toggle('active');

if (answer.classList.contains('active')) {
icon.classList.remove('fa-chevron-down');
icon.classList.add('fa-chevron-up');
} else {
icon.classList.remove('fa-chevron-up');
icon.classList.add('fa-chevron-down');
}
});
});

function showFormResult(message, type) {
formResult.innerHTML = \`
<div class="alert alert-${type === 'success' ? 'success' : 'danger'}">
${message}
</div>
\`;
formResult.style.display = 'block';

// Scroll to result
formResult.scrollIntoView({ behavior: 'smooth', block: 'center' });

// Auto-hide after 5 seconds for success messages
if (type === 'success') {
setTimeout(() => {
formResult.style.display = 'none';
}, 5000);
}
}
});
</script>

<style>
.contact-form {
background: white;
padding: 2rem;
border-radius: 0.75rem;
border: 1px solid var(--border-color);
box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.contact-sidebar {
position: sticky;
top: 2rem;
}

.contact-methods h3,
.community-section h3,
.newsletter-section h3,
.office-info h3 {
color: var(--primary-color);
margin-bottom: 1.5rem;
font-size: 1.25rem;
}

.contact-method {
display: flex;
gap: 1rem;
margin-bottom: 2rem;
padding: 1.5rem;
background: white;
border-radius: 0.5rem;
border: 1px solid var(--border-color);
transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.contact-method:hover {
transform: translateY(-2px);
box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.contact-icon {
width: 50px;
height: 50px;
border-radius: 50%;
background: var(--primary-light);
display: flex;
align-items: center;
justify-content: center;
color: var(--primary-color);
font-size: 1.25rem;
flex-shrink: 0;
}

.contact-info h4 {
margin: 0 0 0.5rem 0;
font-size: 1.1rem;
color: var(--text-primary);
}

.contact-info p {
margin: 0 0 0.25rem 0;
color: var(--text-primary);
font-weight: 500;
}

.contact-info small {
color: var(--text-secondary);
}

.social-links {
display: flex;
flex-direction: column;
gap: 0.5rem;
}

.social-link {
display: flex;
align-items: center;
gap: 0.75rem;
padding: 0.75rem 1rem;
text-decoration: none;
color: var(--text-primary);
border-radius: 0.5rem;
transition: all 0.2s ease;
border: 1px solid var(--border-color);
}

.social-link:hover {
transform: translateX(5px);
color: white;
}

.social-link.discord:hover { background: #5865F2; }
.social-link.github:hover { background: #333; }
.social-link.twitter:hover { background: #1DA1F2; }
.social-link.youtube:hover { background: #FF0000; }

.newsletter-section {
background: var(--primary-light);
padding: 1.5rem;
border-radius: 0.75rem;
margin-bottom: 2rem;
}

.newsletter-section h3 {
color: var(--primary-dark);
}

.office-info {
background: white;
padding: 1.5rem;
border-radius: 0.75rem;
border: 1px solid var(--border-color);
}

.office-location {
display: flex;
gap: 1rem;
margin-bottom: 1.5rem;
}

.office-location i {
color: var(--primary-color);
font-size: 1.25rem;
margin-top: 0.25rem;
}

.office-hours h4 {
color: var(--text-primary);
margin-bottom: 0.5rem;
font-size: 1rem;
}

.faq-section {
margin-top: 3rem;
}

.faq-item {
border: 1px solid var(--border-color);
border-radius: 0.5rem;
margin-bottom: 1rem;
overflow: hidden;
}

.faq-question {
padding: 1.5rem;
background: white;
cursor: pointer;
display: flex;
justify-content: space-between;
align-items: center;
transition: background-color 0.2s ease;
}

.faq-question:hover {
background: var(--bg-light);
}

.faq-question h4 {
margin: 0;
font-size: 1.1rem;
color: var(--text-primary);
}

.faq-question i {
color: var(--primary-color);
transition: transform 0.2s ease;
}

.faq-answer {
padding: 0 1.5rem;
background: var(--bg-light);
max-height: 0;
overflow: hidden;
transition: all 0.3s ease;
}

.faq-answer.active {
padding: 1.5rem;
max-height: 200px;
}

.faq-answer p {
margin: 0;
color: var(--text-secondary);
line-height: 1.6;
}

.faq-answer a {
color: var(--primary-color);
text-decoration: none;
}

.faq-answer a:hover {
text-decoration: underline;
}

.team-section {
padding: 3rem 0;
background: var(--bg-light);
border-radius: 1rem;
}

.team-member {
text-align: center;
background: white;
padding: 2rem;
border-radius: 0.75rem;
border: 1px solid var(--border-color);
height: 100%;
transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.team-member:hover {
transform: translateY(-5px);
box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.team-avatar {
margin-bottom: 1.5rem;
}

.team-avatar img {
width: 120px;
height: 120px;
border-radius: 50%;
object-fit: cover;
border: 4px solid var(--primary-light);
}

.team-info h4 {
margin-bottom: 0.5rem;
color: var(--text-primary);
}

.team-role {
color: var(--primary-color);
font-weight: 600;
margin-bottom: 1rem;
}

.team-bio {
color: var(--text-secondary);
line-height: 1.6;
margin-bottom: 1.5rem;
}

.team-social {
display: flex;
justify-content: center;
gap: 1rem;
}

.team-social a {
width: 40px;
height: 40px;
border-radius: 50%;
background: var(--bg-light);
display: flex;
align-items: center;
justify-content: center;
color: var(--text-secondary);
text-decoration: none;
transition: all 0.2s ease;
}

.team-social a:hover {
background: var(--primary-color);
color: white;
transform: translateY(-2px);
}

@media (max-width: 768px) {
.contact-sidebar {
position: static;
margin-top: 2rem;
}

.contact-form {
padding: 1.5rem;
}

.team-member {
margin-bottom: 2rem;
}

.faq-question {
padding: 1rem;
}

.faq-question h4 {
font-size: 1rem;
}
}
</style>`, 'html')}`;
            } catch(e) {
                __outputRenderedContent__ = this.__showError(e.message);
                console.warn(e);
            }
            return this.__extends('layouts.base');
            },
        init: function() {  },
        destroy: function() {}
    });
    return self;
        }