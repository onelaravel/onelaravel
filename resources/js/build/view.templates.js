export const initTemplates = function (__SYSTEM_DATA__ = {}) {
    let { App, View, tplData = {} } = __SYSTEM_DATA__ || {};
    const evaluate = (fn) => {
        try {
            return fn();
        } catch (error) {
            console.error(error);
            return '';
        }
    }

        View.templates = {
        'web.user-detail': function WebUserDetail(data = {}) {
    const __VIEW_PATH__ = 'web.user-detail';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('web.user-detail', {
        parent: 'layouts.base',
        hasParent: true,
        sections: {
        "document.body":{
            "type":"long",
            "preloader":false,
            "useVars":false,
            "script":{}
        }
    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: true,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `

${App.View.section('document.body', `<div class="container">
<div class="page">
<h1>👤 User Profile</h1>

<div class="user-profile">
<div class="user-avatar">
<div class="avatar-placeholder">
${App.View.escString(App.View.substr(user['name'] ?? 'U', 0, 1))}
</div>
</div>

<div class="user-info">
<h2>${App.View.escString(user['name'] ?? 'Unknown User')}</h2>
<p class="user-email">${App.View.escString(user['email'] ?? 'No email')}</p>
<p class="user-role">${App.View.escString(user['role'] ?? 'No role')}</p>

<div class="user-stats">
<div class="stat">
<strong>User ID:</strong> ${App.View.escString(user['id'] ?? 'N/A')}
</div>
<div class="stat">
<strong>Joined:</strong> ${App.View.escString(user['joined'] ?? 'Unknown')}
</div>
<div class="stat">
<strong>Status:</strong>
<span class="status ${App.View.escString(App.View.strtolower(user['status'] ?? 'active'))}">
${App.View.escString(user['status'] ?? 'Active')}
</span>
</div>
</div>
</div>
</div>

<div class="actions">
<a href="/web/users" class="btn">Back to Users</a>
<a href="/web" class="btn">Home</a>
<a href="/web/about" class="btn">About</a>
</div>
</div>

<!-- Subscribe areas -->
<div class="page">
<h2>Dynamic Content</h2>
<div spa-yield-content="sidebar">
<p>User profile sidebar content (server rendered)</p>
</div>
<div spa-yield-attr="class:pageClass,data-theme:theme">
<p>This div has dynamic attributes</p>
</div>
</div>
</div>

<style>
.container {
max-width: 1200px;
margin: 0 auto;
padding: 20px;
}

.page {
background: white;
padding: 20px;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
margin-bottom: 20px;
}

.page h1 {
color: #333;
margin-top: 0;
}

.page h2 {
color: #666;
border-bottom: 2px solid #007cba;
padding-bottom: 10px;
}

.user-profile {
display: flex;
gap: 30px;
align-items: flex-start;
margin: 20px 0;
}

.user-avatar {
flex-shrink: 0;
}

.avatar-placeholder {
width: 100px;
height: 100px;
border-radius: 50%;
background: #007cba;
color: white;
display: flex;
align-items: center;
justify-content: center;
font-size: 36px;
font-weight: bold;
}

.user-info {
flex: 1;
}

.user-info h2 {
margin-top: 0;
color: #333;
border: none;
padding: 0;
}

.user-email {
color: #666;
font-size: 18px;
margin: 5px 0;
}

.user-role {
color: #007cba;
font-weight: bold;
margin: 5px 0;
}

.user-stats {
margin-top: 20px;
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 15px;
}

.stat {
background: #f8f9fa;
padding: 15px;
border-radius: 4px;
border-left: 4px solid #007cba;
}

.status {
padding: 4px 8px;
border-radius: 4px;
font-size: 12px;
font-weight: bold;
text-transform: uppercase;
}

.status.active {
background: #d4edda;
color: #155724;
}

.status.inactive {
background: #f8d7da;
color: #721c24;
}

.actions {
margin-top: 20px;
}

.btn {
background: #007cba;
color: white;
text-decoration: none;
padding: 10px 20px;
border-radius: 4px;
margin-right: 10px;
display: inline-block;
transition: background-color 0.3s;
}

.btn:hover {
background: #005a87;
}
</style>`, 'html')}`;
            return App.View.extendView('layouts.base');
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="web.user-detail"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'web.about': function WebAbout(data = {}) {
    const __VIEW_PATH__ = 'web.about';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('web.about', {
        parent: 'layouts.base',
        hasParent: true,
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
        "meta:og:title":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:description":{
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
        "meta:robots":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:image":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:image":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:type":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:url":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:site_name":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:locale":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:published_time":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:modified_time":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:section":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:tag":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:author":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:publisher":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:image:width":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:image:height":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "document.body":{
            "type":"long",
            "preloader":false,
            "useVars":false,
            "script":{}
        }
    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: true,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `
${App.View.section('meta:title', 'About Page', 'string')}
${App.View.section('meta:description', 'About Page Description', 'string')}
${App.View.section('meta:og:title', 'About Page', 'string')}
${App.View.section('meta:og:description', 'About Page Description', 'string')}
${App.View.section('meta:keywords', 'About, Page, Description', 'string')}
${App.View.section('meta:robots', 'index, follow', 'string')}
${App.View.section('meta:image', 'https://via.placeholder.com/150', 'string')}
${App.View.section('meta:og:image', 'https://via.placeholder.com/150', 'string')}
${App.View.section('meta:og:title', 'About Page', 'string')}
${App.View.section('meta:og:description', 'About Page Description', 'string')}
${App.View.section('meta:og:type', 'website', 'string')}
${App.View.section('meta:og:url', 'https://example.com/about', 'string')}
${App.View.section('meta:og:site_name', 'Example', 'string')}
${App.View.section('meta:og:locale', 'en_US', 'string')}
${App.View.section('meta:og:published_time', '2021-01-01T00:00:00Z', 'string')}
${App.View.section('meta:og:modified_time', '2021-01-01T00:00:00Z', 'string')}
${App.View.section('meta:og:section', 'About', 'string')}
${App.View.section('meta:og:tag', 'About', 'string')}
${App.View.section('meta:og:author', 'John Doe', 'string')}
${App.View.section('meta:og:publisher', 'John Doe', 'string')}
${App.View.section('meta:og:image:width', '150', 'string')}
${App.View.section('meta:og:image:height', '150', 'string')}
${App.View.section('document.body', `<div class="container">
<div class="page">
<h1>ℹ️ About Page</h1>
<p>Learn more about our SPA application.</p>

<div class="info">
<strong>Technology Stack:</strong>
<ul>
<li>Laravel 11+ with Blade templating</li>
<li>Custom Blade directives (@yieldAttr, @subscribe)</li>
<li>Python compiler for Blade to JavaScript</li>
<li>SPA Router with SSR support</li>
<li>HttpService with fetch API</li>
</ul>
</div>

<div class="code">
Page loaded at: ${App.View.escString(App.View.now().format('Y-m-d H:i:s'))}
</div>

<div class="actions">
<a href="/web" class="btn">Home</a>
<a href="/web/users" class="btn">Users</a>
<a href="/web/contact" class="btn">Contact</a>
</div>
</div>

<!-- Subscribe areas -->
<div class="page">
<h2>Dynamic Content</h2>
<div spa-yield-content="sidebar">
<p>About sidebar content (server rendered)</p>
</div>
<div spa-yield-attr="class:pageClass,data-theme:theme">
<p>This div has dynamic attributes</p>
</div>
</div>
</div>

<style>
.container {
max-width: 1200px;
margin: 0 auto;
padding: 20px;
}

.page {
background: white;
padding: 20px;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
margin-bottom: 20px;
}

.page h1 {
color: #333;
margin-top: 0;
}

.page h2 {
color: #666;
border-bottom: 2px solid #007cba;
padding-bottom: 10px;
}

.info {
background: #e3f2fd;
padding: 15px;
border-radius: 4px;
margin: 15px 0;
border-left: 4px solid #2196f3;
}

.code {
background: #f8f8f8;
padding: 15px;
border-radius: 4px;
font-family: monospace;
font-size: 14px;
margin: 15px 0;
border-left: 4px solid #007cba;
}

.actions {
margin-top: 20px;
}

.btn {
background: #007cba;
color: white;
text-decoration: none;
padding: 10px 20px;
border-radius: 4px;
margin-right: 10px;
display: inline-block;
transition: background-color 0.3s;
}

.btn:hover {
background: #005a87;
}
</style>`, 'html')}`;
            return App.View.extendView('layouts.base');
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="web.about"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'web.users': function WebUsers(data = {}) {
    const __VIEW_PATH__ = 'web.users';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('web.users', {
        parent: 'layouts.base',
        hasParent: true,
        sections: {
        "title":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "description":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "document.body":{
            "type":"long",
            "preloader":false,
            "useVars":false,
            "script":{}
        }
    },
        hasAwaitData: true,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: true,
        hasSectionPreload: false,
        hasPrerender: true,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `
${App.View.section('title', 'Users Page', 'string')}
${App.View.section('description', 'Users Page Description', 'string')}
${App.View.section('document.body', `<div class="container">
<div class="page">
<h1>👥 Users Page</h1>
<p>List of users in the system.</p>

<div class="users-list">
<div class="user-card">
<h3>John Doe</h3>
<p>Email: john@example.com</p>
<p>Role: Administrator</p>
<a href="/web/users/1" class="btn btn-sm">View Profile</a>
</div>

<div class="user-card">
<h3>Jane Smith</h3>
<p>Email: jane@example.com</p>
<p>Role: User</p>
<a href="/web/users/2" class="btn btn-sm">View Profile</a>
</div>

<div class="user-card">
<h3>Bob Johnson</h3>
<p>Email: bob@example.com</p>
<p>Role: Moderator</p>
<a href="/web/users/3" class="btn btn-sm">View Profile</a>
</div>
</div>

<div class="actions">
<a href="/web" class="btn">Home</a>
<a href="/web/about" class="btn">About</a>
<a href="/web/contact" class="btn">Contact</a>
</div>
</div>

<!-- Subscribe areas -->
<div class="page">
<h2>Dynamic Content</h2>
<div spa-yield-content="sidebar">
<p>Users sidebar content (server rendered)</p>
</div>
<div spa-yield-attr="class:pageClass,data-theme:theme">
<p>This div has dynamic attributes</p>
</div>
</div>
</div>

<style>
.container {
max-width: 1200px;
margin: 0 auto;
padding: 20px;
}

.page {
background: white;
padding: 20px;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
margin-bottom: 20px;
}

.page h1 {
color: #333;
margin-top: 0;
}

.page h2 {
color: #666;
border-bottom: 2px solid #007cba;
padding-bottom: 10px;
}

.users-list {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 20px;
margin: 20px 0;
}

.user-card {
background: #f8f9fa;
padding: 20px;
border-radius: 8px;
border: 1px solid #dee2e6;
transition: transform 0.3s, box-shadow 0.3s;
}

.user-card:hover {
transform: translateY(-2px);
box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.user-card h3 {
margin-top: 0;
color: #333;
}

.user-card p {
margin: 5px 0;
color: #666;
}

.actions {
margin-top: 20px;
}

.btn {
background: #007cba;
color: white;
text-decoration: none;
padding: 10px 20px;
border-radius: 4px;
margin-right: 10px;
display: inline-block;
transition: background-color 0.3s;
}

.btn:hover {
background: #005a87;
}

.btn-sm {
padding: 5px 15px;
font-size: 14px;
}
</style>`, 'html')}
`;
            return App.View.extendView('layouts.base');
            },
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `



`;
            return App.View.extendView('layouts.base');
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="web.users"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'web.test-about': function WebTestAbout(data = {}) {
    const __VIEW_PATH__ = 'web.test-about';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('web.test-about', {
        parent: null,
        hasParent: false,
        sections: {

    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: false,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `<!DOCTYPE html>
<html>
<head>
<title>Test Web About View Variables</title>
</head>
<body>
<h1>Test Web About View Variables</h1>

<div>
<h2>View Information:</h2>
<p><strong>__VIEW_ID__:</strong> ${App.View.escString(__VIEW_ID__)}</p>
<p><strong>__VIEW_PATH__:</strong> ${App.View.escString(__VIEW_PATH__)}</p>
<p><strong>__VIEW_NAME__:</strong> ${App.View.escString(__VIEW_NAME__)}</p>
</div>

<div>
<h2>All Available Variables:</h2>
<pre>${App.View.escString(App.View.json_encode(get_defined_vars(), JSON_PRETTY_PRINT))}</pre>
</div>
</body>
</html>`;
            return __outputRenderedContent__;
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="web.test-about"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'web.home': function WebHome(data = {}) {
    const __VIEW_PATH__ = 'web.home';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('web.home', {
        parent: 'layouts.base',
        hasParent: true,
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
        "meta:robots":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:image":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:image":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:title":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:description":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:type":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:url":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:site_name":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:locale":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:published_time":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:modified_time":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:section":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:tag":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:author":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:publisher":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:image:width":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:image:height":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "document.body":{
            "type":"long",
            "preloader":false,
            "useVars":false,
            "script":{}
        }
    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: true,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `
${App.View.section('meta:title', 'Home Page', 'string')}
${App.View.section('meta:description', 'Home Page Description', 'string')}
${App.View.section('meta:keywords', 'Home, Page, Description', 'string')}
${App.View.section('meta:robots', 'index, follow', 'string')}
${App.View.section('meta:image', 'https://via.placeholder.com/150', 'string')}
${App.View.section('meta:og:image', 'https://via.placeholder.com/150', 'string')}
${App.View.section('meta:og:title', 'Home Page', 'string')}
${App.View.section('meta:og:description', 'Home Page Description', 'string')}
${App.View.section('meta:og:type', 'website', 'string')}
${App.View.section('meta:og:url', 'https://example.com/home', 'string')}
${App.View.section('meta:og:site_name', 'Example', 'string')}
${App.View.section('meta:og:locale', 'en_US', 'string')}
${App.View.section('meta:og:published_time', '2021-01-01T00:00:00Z', 'string')}
${App.View.section('meta:og:modified_time', '2021-01-01T00:00:00Z', 'string')}
${App.View.section('meta:og:section', 'Home', 'string')}
${App.View.section('meta:og:tag', 'Home', 'string')}
${App.View.section('meta:og:author', 'John Doe', 'string')}
${App.View.section('meta:og:publisher', 'John Doe', 'string')}
${App.View.section('meta:og:image:width', '150', 'string')}
${App.View.section('meta:og:image:height', '150', 'string')}

${App.View.section('document.body', `<div class="container">
<div class="page">
<h1>🏠 Home Page</h1>
<p>Welcome to the SPA Web Application!</p>

<div class="info">
<strong>Features:</strong>
<ul>
<li>Server-Side Rendering (SSR)</li>
<li>SPA Router with History API</li>
<li>Blade to JavaScript compilation</li>
<li>Subscribe system for dynamic content</li>
</ul>
</div>

<div class="code">
Server render time: ${App.View.escString(App.View.now().format('Y-m-d H:i:s'))}
</div>

<div class="actions">
<a href="/web/about" class="btn">About Us</a>
<a href="/web/users" class="btn">Users</a>
<a href="/web/contact" class="btn">Contact</a>
</div>
</div>

<!-- Subscribe areas -->
<div class="page">
<h2>Dynamic Content</h2>
<div spa-yield-content="sidebar">
<p>Home sidebar content (server rendered)</p>
</div>
<div spa-yield-attr="class:pageClass,data-theme:theme">
<p>This div has dynamic attributes</p>
</div>
</div>
</div>

<style>
.container {
max-width: 1200px;
margin: 0 auto;
padding: 20px;
}

.page {
background: white;
padding: 20px;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
margin-bottom: 20px;
}

.page h1 {
color: #333;
margin-top: 0;
}

.page h2 {
color: #666;
border-bottom: 2px solid #007cba;
padding-bottom: 10px;
}

.info {
background: #e3f2fd;
padding: 15px;
border-radius: 4px;
margin: 15px 0;
border-left: 4px solid #2196f3;
}

.code {
background: #f8f8f8;
padding: 15px;
border-radius: 4px;
font-family: monospace;
font-size: 14px;
margin: 15px 0;
border-left: 4px solid #007cba;
}

.actions {
margin-top: 20px;
}

.btn {
background: #007cba;
color: white;
text-decoration: none;
padding: 10px 20px;
border-radius: 4px;
margin-right: 10px;
display: inline-block;
transition: background-color 0.3s;
}

.btn:hover {
background: #005a87;
}
</style>`, 'html')}`;
            return App.View.extendView('layouts.base');
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="web.home"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'web.contact': function WebContact(data = {}) {
    const __VIEW_PATH__ = 'web.contact';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('web.contact', {
        parent: 'layouts.base',
        hasParent: true,
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
        "meta:robots":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:image":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:image":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:title":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:description":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:type":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:url":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:site_name":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:locale":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:published_time":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:modified_time":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:section":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:tag":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:author":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:publisher":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:image:width":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:og:image:height":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "document.body":{
            "type":"long",
            "preloader":false,
            "useVars":false,
            "script":{}
        }
    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: true,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `
${App.View.section('meta:title', 'Contact Page', 'string')}
${App.View.section('meta:description', 'Contact Page Description', 'string')}
${App.View.section('meta:keywords', 'Contact, Page, Description', 'string')}
${App.View.section('meta:robots', 'index, follow', 'string')}
${App.View.section('meta:image', 'https://via.placeholder.com/150', 'string')}
${App.View.section('meta:og:image', 'https://via.placeholder.com/150', 'string')}
${App.View.section('meta:og:title', 'Contact Page', 'string')}
${App.View.section('meta:og:description', 'Contact Page Description', 'string')}
${App.View.section('meta:og:type', 'website', 'string')}
${App.View.section('meta:og:url', 'https://example.com/contact', 'string')}
${App.View.section('meta:og:site_name', 'Example', 'string')}
${App.View.section('meta:og:locale', 'en_US', 'string')}
${App.View.section('meta:og:published_time', '2021-01-01T00:00:00Z', 'string')}
${App.View.section('meta:og:modified_time', '2021-01-01T00:00:00Z', 'string')}
${App.View.section('meta:og:section', 'Contact', 'string')}
${App.View.section('meta:og:tag', 'Contact', 'string')}
${App.View.section('meta:og:author', 'John Doe', 'string')}
${App.View.section('meta:og:publisher', 'John Doe', 'string')}
${App.View.section('meta:og:image:width', '150', 'string')}
${App.View.section('meta:og:image:height', '150', 'string')}
${App.View.section('document.body', `<div class="container">
<div class="page">
<h1>📞 Contact Page</h1>
<p>Get in touch with us!</p>

<div class="contact-info">
<div class="contact-method">
<h3>📧 Email</h3>
<p>contact@example.com</p>
<a href="mailto:contact@example.com" class="btn btn-sm">Send Email</a>
</div>

<div class="contact-method">
<h3>📱 Phone</h3>
<p>+1 (555) 123-4567</p>
<a href="tel:+15551234567" class="btn btn-sm">Call Us</a>
</div>

<div class="contact-method">
<h3>📍 Address</h3>
<p>123 Main Street<br>City, State 12345</p>
<a href="https://maps.google.com" target="_blank" class="btn btn-sm">Find Us</a>
</div>
</div>

<div class="contact-form">
<h3>Send us a message</h3>
<form>
<div class="form-group">
<label for="name">Name:</label>
<input type="text" id="name" name="name" class="form-control">
</div>

<div class="form-group">
<label for="email">Email:</label>
<input type="email" id="email" name="email" class="form-control">
</div>

<div class="form-group">
<label for="message">Message:</label>
<textarea id="message" name="message" class="form-control" rows="5"></textarea>
</div>

<button type="submit" class="btn">Send Message</button>
</form>
</div>

<div class="actions">
<a href="/web" class="btn">Home</a>
<a href="/web/about" class="btn">About</a>
<a href="/web/users" class="btn">Users</a>
</div>
</div>

<!-- Subscribe areas -->
<div class="page">
<h2>Dynamic Content</h2>
<div spa-yield-content="sidebar">
<p>Contact sidebar content (server rendered)</p>
</div>
<div spa-yield-attr="class:pageClass,data-theme:theme">
<p>This div has dynamic attributes</p>
</div>
</div>
</div>

<style>
.container {
max-width: 1200px;
margin: 0 auto;
padding: 20px;
}

.page {
background: white;
padding: 20px;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
margin-bottom: 20px;
}

.page h1 {
color: #333;
margin-top: 0;
}

.page h2 {
color: #666;
border-bottom: 2px solid #007cba;
padding-bottom: 10px;
}

.contact-info {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 20px;
margin: 20px 0;
}

.contact-method {
background: #f8f9fa;
padding: 20px;
border-radius: 8px;
border: 1px solid #dee2e6;
text-align: center;
}

.contact-method h3 {
margin-top: 0;
color: #333;
}

.contact-method p {
color: #666;
margin: 10px 0;
}

.contact-form {
background: #f8f9fa;
padding: 20px;
border-radius: 8px;
margin: 20px 0;
}

.contact-form h3 {
margin-top: 0;
color: #333;
}

.form-group {
margin-bottom: 15px;
}

.form-group label {
display: block;
margin-bottom: 5px;
color: #333;
font-weight: bold;
}

.form-control {
width: 100%;
padding: 10px;
border: 1px solid #dee2e6;
border-radius: 4px;
font-size: 14px;
}

.form-control:focus {
outline: none;
border-color: #007cba;
box-shadow: 0 0 0 2px rgba(0, 124, 186, 0.2);
}

.actions {
margin-top: 20px;
}

.btn {
background: #007cba;
color: white;
text-decoration: none;
padding: 10px 20px;
border-radius: 4px;
margin-right: 10px;
display: inline-block;
transition: background-color 0.3s;
border: none;
cursor: pointer;
}

.btn:hover {
background: #005a87;
}

.btn-sm {
padding: 5px 15px;
font-size: 14px;
}
</style>`, 'html')}`;
            return App.View.extendView('layouts.base');
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="web.contact"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'admin.dashboard': function AdminDashboard(data = {}) {
    const __VIEW_PATH__ = 'admin.dashboard';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('admin.dashboard', {
        parent: 'layouts.admin',
        hasParent: true,
        sections: {
        "document.body":{
            "type":"long",
            "preloader":false,
            "useVars":false,
            "script":{}
        }
    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: true,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `

${App.View.section('document.body', `<div class="admin-container">
<div class="admin-page">
<h1>📊 Admin Dashboard</h1>
<p>Welcome to the Admin Panel!</p>

<div class="admin-info">
<strong>Admin Features:</strong>
<ul>
<li>User Management</li>
<li>System Settings</li>
<li>Analytics Dashboard</li>
<li>Content Management</li>
</ul>
</div>

<div class="admin-code">
Admin render time: ${App.View.escString(App.View.now().format('Y-m-d H:i:s'))}
</div>

<div class="admin-actions">
<a href="/admin/users" class="btn btn-primary">Manage Users</a>
<a href="/admin/settings" class="btn btn-secondary">Settings</a>
</div>
</div>

<!-- Subscribe areas -->
<div class="admin-page">
<h2>Admin Dynamic Content</h2>
<div spa-yield-content="sidebar">
<p>Admin sidebar content (server rendered)</p>
</div>
</div>
</div>

<style>
.admin-container {
max-width: 1200px;
margin: 0 auto;
padding: 20px;
}

.admin-page {
background: white;
padding: 20px;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
margin-bottom: 20px;
}

.admin-page h1 {
color: #333;
margin-top: 0;
}

.admin-page h2 {
color: #666;
border-bottom: 2px solid #dc3545;
padding-bottom: 10px;
}

.admin-info {
background: #f8d7da;
padding: 15px;
border-radius: 4px;
margin: 15px 0;
border-left: 4px solid #dc3545;
}

.admin-code {
background: #f8f9fa;
padding: 15px;
border-radius: 4px;
font-family: monospace;
font-size: 14px;
margin: 15px 0;
border-left: 4px solid #dc3545;
}

.admin-actions {
margin-top: 20px;
}

.btn {
text-decoration: none;
padding: 10px 20px;
border-radius: 4px;
margin-right: 10px;
display: inline-block;
transition: background-color 0.3s;
}

.btn-primary {
background: #dc3545;
color: white;
}

.btn-primary:hover {
background: #c82333;
}

.btn-secondary {
background: #6c757d;
color: white;
}

.btn-secondary:hover {
background: #545b62;
}
</style>`, 'html')}`;
            return App.View.extendView('layouts.admin');
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="admin.dashboard"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'layouts.test-layout': function LayoutsTestLayout(data = {}) {
    const __VIEW_PATH__ = 'layouts.test-layout';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('layouts.test-layout', {
        parent: null,
        hasParent: false,
        sections: {

    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: false,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `<!DOCTYPE html>
<html>
<head>
<title>Layout Test</title>
</head>
<body>
<div class="layout">
<p>Layout View ID: ${App.View.escString(__VIEW_ID__)}</p>
${App.View.yield('content')}
</div>
</body>
</html>`;
            return __outputRenderedContent__;
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="layouts.test-layout"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'layouts.base': function LayoutsBase(data = {}) {
    const __VIEW_PATH__ = 'layouts.base';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('layouts.base', {
        parent: null,
        hasParent: false,
        sections: {

    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: false,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `




















<!-- Navigation -->
<nav class="navbar">
<div class="nav-container">
<a href="/web" class="nav-brand">SPA App</a>
<div class="nav-menu">
<a href="/web" class="nav-link">Home</a>
<a href="/web/about" class="nav-link">About</a>
<a href="/web/users" class="nav-link">Users</a>
<a href="/web/contact" class="nav-link">Contact</a>
</div>
</div>
</nav>

<!-- Main Content -->
<div id="layout-content">
${App.View.yield('document.body')}
</div>

<!-- Sidebar -->
<aside class="sidebar">
<h3>Sidebar</h3>
<p>Default sidebar content</p>
</aside>

<!-- Dynamic Attributes -->
<div class="dynamic-content">
<p>Dynamic content area</p>
</div>




`;
            return __outputRenderedContent__;
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="layouts.base"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'layouts.admin': function LayoutsAdmin(data = {}) {
    const __VIEW_PATH__ = 'layouts.admin';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('layouts.admin', {
        parent: null,
        hasParent: false,
        sections: {

    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: false,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `

<!-- Admin Navigation -->
<nav class="admin-navbar">
<div class="nav-container" data-id="${App.View.yieldContent('admin-data-id', 'test')}" App.View="data-id:admin-data-id">
<a href="/admin" class="nav-brand">Admin Panel</a>
<div class="nav-menu">
<a href="/admin" class="nav-link">Dashboard</a>
<a href="/admin/users" class="nav-link">Users</a>
<a href="/admin/settings" class="nav-link">Settings</a>
</div>
</div>
</nav>

<!-- Admin Content -->
<div id="admin-content" App.View="document.body" name="${App.View.yieldContent('layoout:name', null)}" sidebar="${App.View.yieldContent('sidebar', null)}" App.View="name:layoout:name,sidebar:sidebar">
${App.View.yield('document.body')}
</div>

<!-- Admin Sidebar -->
<aside class="admin-sidebar" App.View="sidebar">
<h3>Admin Tools</h3>
<p>Admin sidebar content</p>
</aside>








<style>
/* Admin-specific styles */
body {
font-family: Arial, sans-serif;
margin: 0;
padding: 0;
background-color: #f8f9fa;
}

.admin-navbar {
background: #dc3545;
color: white;
padding: 1rem 0;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-container {
max-width: 1200px;
margin: 0 auto;
padding: 0 20px;
display: flex;
justify-content: space-between;
align-items: center;
}

.nav-brand {
font-size: 1.5rem;
font-weight: bold;
color: white;
text-decoration: none;
}

.nav-menu {
display: flex;
gap: 20px;
}

.nav-link {
color: white;
text-decoration: none;
padding: 8px 16px;
border-radius: 4px;
transition: background-color 0.3s;
}

.nav-link:hover {
background-color: rgba(255,255,255,0.2);
}

.nav-link.active {
background-color: rgba(255,255,255,0.3);
font-weight: bold;
}

.admin-sidebar {
position: fixed;
top: 80px;
right: 20px;
width: 250px;
background: white;
padding: 20px;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
z-index: 100;
}

.admin-sidebar h3 {
margin-bottom: 15px;
color: #333;
}
</style>`;
            return __outputRenderedContent__;
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="layouts.admin"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'partials.test-partial': function PartialsTestPartial(data = {}) {
    const __VIEW_PATH__ = 'partials.test-partial';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('partials.test-partial', {
        parent: null,
        hasParent: false,
        sections: {

    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: false,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `<div class="partial">
<p>Partial View ID: ${App.View.escString(__VIEW_ID__)}</p>
<p>Another Partial ID: ${App.View.escString(__VIEW_ID__)}</p>
</div>`;
            return __outputRenderedContent__;
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="partials.test-partial"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'partials.footer': function PartialsFooter(data = {}) {
    const __VIEW_PATH__ = 'partials.footer';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    self.__construct__('partials.footer', {
        parent: null,
        hasParent: false,
        sections: {

    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: false,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {},
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                
    let __outputRenderedContent__ = `<footer class="footer">
<div class="footer-content">
<p>&copy; ${App.View.escString(App.View.date('Y'))} ${App.View.escString(App.View.config('app.name'))}. All rights reserved.</p>
<nav class="footer-nav">
<a href="${App.View.escString(App.View.route('home'))}">Trang chủ</a>
<a href="${App.View.escString(App.View.route('about'))}">Giới thiệu</a>
<a href="${App.View.escString(App.View.route('contact'))}">Liên hệ</a>
</nav>
</div>
</footer>`;
            return __outputRenderedContent__;
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="partials.footer"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        },
        'custom.test': function CustomTest(data = {}) {
    const __VIEW_PATH__ = 'custom.test';
    const __VIEW_ID__ = data.__SSR_VIEW_ID__ || App.View.generateViewId();
    const $setChartState = __STATE__.__register('chartState');
    let chartState = null;
    const setChartState = (state) => {
        chartState = state;
        $setChartState(state);
    };
    const $setUserState = __STATE__.__register('userState');
    let userState = null;
    const setUserState = (state) => {
        userState = state;
        $setUserState(state);
    };
    self.__construct__('custom.test', {
        parent: 'layouts.base',
        hasParent: true,
        sections: {
        "document.body":{
            "type":"long",
            "preloader":false,
            "useVars":false,
            "script":{}
        }
    },
        hasAwaitData: false,
        hasFetchData: false,
        fetch: null,
        data: data,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
        hasSections: true,
        hasSectionPreload: false,
        hasPrerender: false,
        userDefined: {
            mounted() {
                console.log('View mounted');
            },
            submitForm(event) {
                event.preventDefault();
                console.log('Submit form', event);
                setLoading(true);
            },
            showModal(event, modalId, checked, title, data) {
                console.log('Show modal', event, modalId, checked, title, data);
            },
            updateField(event, fieldName) {
                console.log('Update field', event, fieldName);
            }
        },
        resources: [],
        prerender: function(__$spaViewData$__ = {}) {
    return null;
},
        render: function(__$spaViewData$__ = {}) {
                let user = {"name": "John", "email": "john@example.com"};
    let ipAddress = '127.0.0.1';
    let chartData = {"test": "test"};
    let config = [];
        const chartState = updateStateByKey('chartState', chartData);
    let unassigned;
        const userState = updateStateByKey('userState', user);
    const {name, email} = user;
    const test = null;
    const {title, description} = config;
    const data = {"key": ["value", "demo"]};
    lockUpdateRealState();
    
    let __outputRenderedContent__ = `
${App.View.section('document.body', `<div class="container">
<h1>Test @let and @const Directives</h1>

<!-- Test simple variables -->



<p>User: ${App.View.escString(App.View.json_encode(user))}</p>
<p>IP: ${App.View.escString(ipAddress)}</p>

<!-- Test array destructuring -->

<p>User State: ${App.View.escString(App.View.json_encode(userState))}</p>


<!-- Test object destructuring -->

<p>Name: ${App.View.escString(name)}</p>
<p>Email: ${App.View.escString(email)}</p>
<p>Test: ${App.View.escString(test)}</p>

<!-- Test complex mixed declarations -->

<p>Chart Data: ${App.View.escString(App.View.json_encode(chartData))}</p>
<p>Config: ${App.View.escString(App.View.json_encode(config))}</p>
<p>Chart State: ${App.View.escString(App.View.json_encode(chartState))}</p>


<!-- Test object destructuring with complex data -->

<p>Title: ${App.View.escString(title)}</p>
<p>Description: ${App.View.escString(description)}</p>
<p>Data: ${App.View.escString(App.View.json_encode(data))}</p>

<!-- Test no assignment -->

<p>Unassigned: ${App.View.escString(unassigned)}</p>
</div>`, 'html')}`;
            return App.View.extendView('layouts.base');
            },
        init: function(__$spaViewData$__ = {}) {  },
        destroy: function() {},
        addCSS: function() {
            // No CSS content found in @onInit
        },
        removeCSS: function() {
            const styles = document.querySelectorAll('style[data-view-name="custom.test"]');
            styles.forEach(style => style.remove());
        },
        setState: function(stateKey, stateValue = null) {
            const viewStates = (typeof stateKey === "object" && stateKey) ? stateKey : App.View.execute(() => {
                let o = {};
                o[stateKey] = stateValue;
                return o;
            });
            return App.View.setViewState(__VIEW_ID__, viewStates);
        }
    });
    return self;
        }
    };

};