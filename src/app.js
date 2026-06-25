(function () {
  var EMPLOYEES_KEY = 'stepup.employees';
  var SESSION_KEY = 'stepup.session';
  var POSTS_KEY = 'stepup.posts';
  var MESSAGES_KEY = 'stepup.messages';
  var NOTIFS_KEY = 'stepup.notifications';
  var SEEDED_KEY = 'stepup.seeded';

  var MINUTE = 60000;
  var HOUR = 3600000;
  var DAY = 86400000;

  // ---------- storage helpers ----------
  function loadList(key) {
    try {
      var raw = window.localStorage.getItem(key);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveList(key, list) {
    try {
      window.localStorage.setItem(key, JSON.stringify(list));
    } catch (error) {
      // localStorage unavailable (private mode, quota); in-memory only.
    }
  }

  function loadSessionEmail() {
    try {
      return window.localStorage.getItem(SESSION_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveSessionEmail(value) {
    try {
      if (value) {
        window.localStorage.setItem(SESSION_KEY, value);
      } else {
        window.localStorage.removeItem(SESSION_KEY);
      }
    } catch (error) {
      // ignore
    }
  }

  function loadFlag(key) {
    try {
      return window.localStorage.getItem(key) === '1';
    } catch (error) {
      return false;
    }
  }

  function saveFlag(key) {
    try {
      window.localStorage.setItem(key, '1');
    } catch (error) {
      // ignore
    }
  }

  function saveEmployees() {
    saveList(EMPLOYEES_KEY, employees);
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ---------- demo data ----------
  var DEMO_EMPLOYEE = {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@stepup.com',
    password: 'demo123',
    department: 'Wellness',
  };

  var DEMO_COLLEAGUES = [
    { firstName: 'Maya', lastName: 'Chen', email: 'maya.chen@stepup.com', password: 'demo123', department: 'Product' },
    { firstName: 'Liam', lastName: 'Osei', email: 'liam.osei@stepup.com', password: 'demo123', department: 'Engineering' },
    { firstName: 'Sara', lastName: 'Kim', email: 'sara.kim@stepup.com', password: 'demo123', department: 'Design' },
    { firstName: 'Noah', lastName: 'Reyes', email: 'noah.reyes@stepup.com', password: 'demo123', department: 'Marketing' },
    { firstName: 'Priya', lastName: 'Nair', email: 'priya.nair@stepup.com', password: 'demo123', department: 'People Ops' },
  ];

  var employees = loadList(EMPLOYEES_KEY);
  var posts = loadList(POSTS_KEY);
  var messages = loadList(MESSAGES_KEY);
  var notifications = loadList(NOTIFS_KEY);

  ensureDemoEmployee();
  seedDemoData();

  var sessionEmail = loadSessionEmail();
  var currentEmployee = sessionEmail ? findEmployeeByEmail(sessionEmail) : null;
  var mode = employees.length > 0 ? 'login' : 'signup';
  var currentSection = 'feed';
  var activePartner = null;

  function ensureDemoEmployee() {
    if (!findEmployeeByEmail(DEMO_EMPLOYEE.email)) {
      employees.push({
        firstName: DEMO_EMPLOYEE.firstName,
        lastName: DEMO_EMPLOYEE.lastName,
        email: DEMO_EMPLOYEE.email,
        password: DEMO_EMPLOYEE.password,
        department: DEMO_EMPLOYEE.department,
      });
      saveEmployees();
    }
  }

  function seedDemoData() {
    if (loadFlag(SEEDED_KEY)) {
      return;
    }

    for (var c = 0; c < DEMO_COLLEAGUES.length; c += 1) {
      if (!findEmployeeByEmail(DEMO_COLLEAGUES[c].email)) {
        var colleague = DEMO_COLLEAGUES[c];
        employees.push({
          firstName: colleague.firstName,
          lastName: colleague.lastName,
          email: colleague.email,
          password: colleague.password,
          department: colleague.department,
        });
      }
    }
    saveEmployees();

    var now = Date.now();

    posts = [
      { id: uid(), authorEmail: 'sara.kim@stepup.com', text: 'New StepUp brand colors are live — fresh greens 🌿 Feedback welcome!', createdAt: now - 45 * MINUTE, likes: ['maya.chen@stepup.com', 'liam.osei@stepup.com'] },
      { id: uid(), authorEmail: 'liam.osei@stepup.com', text: 'Shipped the new login flow this morning. Faster sign-ins for everyone ⚡', createdAt: now - 3 * HOUR, likes: ['demo@stepup.com', 'sara.kim@stepup.com'] },
      { id: uid(), authorEmail: 'maya.chen@stepup.com', text: 'Kicked off the Q3 roadmap today 🎯 Big things ahead for the team.', createdAt: now - 6 * HOUR, likes: [] },
      { id: uid(), authorEmail: 'priya.nair@stepup.com', text: 'Reminder: Wellness Wednesday walk at 3pm 🚶 Hit your step goal with us!', createdAt: now - 1 * DAY, likes: ['sara.kim@stepup.com', 'noah.reyes@stepup.com', 'maya.chen@stepup.com'] },
    ].concat(posts);
    saveList(POSTS_KEY, posts);

    messages = [
      { id: uid(), from: 'maya.chen@stepup.com', to: DEMO_EMPLOYEE.email, text: 'Hey! Welcome to StepUp 👋', createdAt: now - 4 * HOUR, read: false },
      { id: uid(), from: DEMO_EMPLOYEE.email, to: 'maya.chen@stepup.com', text: 'Thanks Maya! Glad to be here.', createdAt: now - 4 * HOUR + 6 * MINUTE, read: true },
      { id: uid(), from: 'maya.chen@stepup.com', to: DEMO_EMPLOYEE.email, text: 'Ping me if you need anything getting set up.', createdAt: now - 2 * HOUR, read: false },
    ].concat(messages);
    saveList(MESSAGES_KEY, messages);

    notifications = [
      { id: uid(), userEmail: DEMO_EMPLOYEE.email, type: 'message', text: 'Maya Chen sent you a message', createdAt: now - 2 * HOUR, read: false },
      { id: uid(), userEmail: DEMO_EMPLOYEE.email, type: 'like', text: 'Liam Osei liked the team launch post', createdAt: now - 3 * HOUR, read: false },
      { id: uid(), userEmail: DEMO_EMPLOYEE.email, type: 'welcome', text: 'Welcome to StepUp! Share your first post on the feed.', createdAt: now - 5 * HOUR, read: true },
    ].concat(notifications);
    saveList(NOTIFS_KEY, notifications);

    saveFlag(SEEDED_KEY);
  }

  // ---------- element refs ----------
  var authPage = document.getElementById('auth-page');
  var dashboard = document.getElementById('dashboard');
  var showPasswordPageButton = document.getElementById('show-password-page');
  var backToProfileButton = document.getElementById('back-to-profile');
  var profileAvatar = document.getElementById('profile-avatar');
  var form = document.getElementById('auth-form');
  var formDescription = document.getElementById('form-description');
  var firstName = document.getElementById('firstName');
  var lastName = document.getElementById('lastName');
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var message = document.getElementById('message');
  var submitButton = document.getElementById('submit-button');
  var switchModeButton = document.getElementById('switch-mode');
  var demoHint = document.getElementById('demo-hint');
  var demoHintCreds = document.getElementById('demo-hint-creds');
  var logoutButton = document.getElementById('logout-button');
  var profileName = document.getElementById('profile-name');
  var profileEmail = document.getElementById('profile-email');
  var passwordForm = document.getElementById('password-form');
  var currentPassword = document.getElementById('currentPassword');
  var newPassword = document.getElementById('newPassword');
  var confirmPassword = document.getElementById('confirmPassword');
  var passwordMessage = document.getElementById('password-message');
  var signupFields = document.querySelectorAll('.signup-field');

  var navItems = document.querySelectorAll('.nav-item');
  var bellBadge = document.getElementById('bell-badge');
  var messagesBadge = document.getElementById('nav-badge-messages');
  var postForm = document.getElementById('post-form');
  var postInput = document.getElementById('post-input');
  var feedList = document.getElementById('feed-list');
  var threadList = document.getElementById('thread-list');
  var threadEmpty = document.getElementById('thread-empty');
  var threadActive = document.getElementById('thread-active');
  var threadHeader = document.getElementById('thread-header');
  var threadMessages = document.getElementById('thread-messages');
  var messageForm = document.getElementById('message-form');
  var messageInput = document.getElementById('message-input');
  var directorySearch = document.getElementById('directory-search');
  var directoryList = document.getElementById('directory-list');
  var notificationsList = document.getElementById('notifications-list');
  var markReadButton = document.getElementById('mark-read-button');

  var sectionViews = {
    profile: document.getElementById('profile-view'),
    password: document.getElementById('password-view'),
    feed: document.getElementById('feed-view'),
    messages: document.getElementById('messages-view'),
    directory: document.getElementById('directory-view'),
    notifications: document.getElementById('notifications-view'),
  };

  // ---------- generic helpers ----------
  function findEmployeeByEmail(value) {
    for (var index = 0; index < employees.length; index += 1) {
      if (employees[index].email === value) {
        return employees[index];
      }
    }

    return null;
  }

  function fullName(employee) {
    if (!employee) {
      return 'Unknown';
    }
    var name = ((employee.firstName || '') + ' ' + (employee.lastName || '')).trim();
    return name || employee.email;
  }

  function initialsOf(employee) {
    if (!employee) {
      return '?';
    }
    var first = (employee.firstName || employee.email || '?').charAt(0);
    var last = (employee.lastName || '').charAt(0);
    return (first + last).toUpperCase();
  }

  function departmentOf(employee) {
    return employee && employee.department ? employee.department : 'Team Member';
  }

  function timeAgo(ms) {
    var diff = Date.now() - ms;
    if (diff < MINUTE) {
      return 'just now';
    }
    if (diff < HOUR) {
      return Math.floor(diff / MINUTE) + 'm';
    }
    if (diff < DAY) {
      return Math.floor(diff / HOUR) + 'h';
    }
    if (diff < 7 * DAY) {
      return Math.floor(diff / DAY) + 'd';
    }
    var date = new Date(ms);
    return date.getMonth() + 1 + '/' + date.getDate();
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text != null) {
      node.textContent = text;
    }
    return node;
  }

  // ---------- auth messaging ----------
  function setMessage(text, type) {
    message.textContent = text;
    message.className = type === 'success' ? 'message success' : 'message';
  }

  function setPasswordMessage(text, type) {
    passwordMessage.textContent = text;
    passwordMessage.className = type === 'success' ? 'message success' : 'message';
  }

  function clearForm() {
    form.reset();
  }

  function renderAuth() {
    var isSignup = mode === 'signup';

    formDescription.textContent = isSignup
      ? 'Create an employee account with your email.'
      : 'Login with your account.';

    demoHintCreds.textContent =
      DEMO_EMPLOYEE.email + '  ·  ' + DEMO_EMPLOYEE.password;
    demoHint.className = isSignup ? 'demo-hint hidden' : 'demo-hint';

    submitButton.textContent = isSignup ? 'Sign Up' : 'Login';
    switchModeButton.textContent = isSignup ? 'Log in instead' : 'Create an account';
    password.placeholder = isSignup ? 'Create a password' : 'Enter your password';

    for (var index = 0; index < signupFields.length; index += 1) {
      signupFields[index].className = isSignup ? 'signup-field' : 'signup-field hidden';
    }
  }

  // ---------- navigation ----------
  function setActiveNav(section) {
    for (var i = 0; i < navItems.length; i += 1) {
      if (navItems[i].getAttribute('data-section') === section) {
        navItems[i].classList.add('active');
      } else {
        navItems[i].classList.remove('active');
      }
    }
  }

  function showSection(name) {
    currentSection = name;
    for (var key in sectionViews) {
      if (Object.prototype.hasOwnProperty.call(sectionViews, key)) {
        sectionViews[key].className = 'app-main' + (key === name ? '' : ' hidden');
      }
    }
    setActiveNav(name === 'password' ? 'profile' : name);

    if (name === 'feed') {
      renderFeed();
    } else if (name === 'messages') {
      renderMessages();
    } else if (name === 'directory') {
      directorySearch.value = '';
      renderDirectory('');
    } else if (name === 'notifications') {
      renderNotifications();
      markAllNotificationsRead();
    }
  }

  function renderDashboard() {
    if (!currentEmployee) {
      authPage.className = 'page';
      dashboard.className = 'app hidden';
      renderAuth();
      return;
    }

    authPage.className = 'page hidden';
    dashboard.className = 'app';
    profileName.textContent = fullName(currentEmployee);
    profileEmail.textContent = currentEmployee.email;
    profileAvatar.textContent = initialsOf(currentEmployee);
    passwordForm.reset();
    setPasswordMessage('');
    activePartner = null;
    updateBell();
    updateMessagesBadge();
    showSection('feed');
  }

  // ---------- feed ----------
  function findPost(id) {
    for (var i = 0; i < posts.length; i += 1) {
      if (posts[i].id === id) {
        return posts[i];
      }
    }
    return null;
  }

  function renderFeed() {
    feedList.innerHTML = '';
    var sorted = posts.slice().sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

    if (!sorted.length) {
      feedList.appendChild(el('p', 'empty-note', 'No posts yet. Be the first to share something!'));
      return;
    }

    for (var i = 0; i < sorted.length; i += 1) {
      feedList.appendChild(buildPost(sorted[i]));
    }
  }

  function buildPost(post) {
    var author = findEmployeeByEmail(post.authorEmail);
    var card = el('article', 'post');
    card.appendChild(el('div', 'post-avatar', initialsOf(author)));

    var body = el('div', 'post-body');
    var head = el('div', 'post-head');
    head.appendChild(el('span', 'post-author', fullName(author)));
    head.appendChild(el('span', 'post-dept', departmentOf(author)));
    head.appendChild(el('span', 'post-time', timeAgo(post.createdAt)));
    body.appendChild(head);
    body.appendChild(el('p', 'post-text', post.text));

    var actions = el('div', 'post-actions');
    var liked = post.likes.indexOf(currentEmployee.email) >= 0;
    var likeBtn = el('button', 'like-btn' + (liked ? ' liked' : ''));
    likeBtn.type = 'button';
    likeBtn.appendChild(el('span', 'like-heart', liked ? '♥' : '♡'));
    likeBtn.appendChild(el('span', 'like-count', String(post.likes.length)));
    likeBtn.addEventListener('click', function () {
      toggleLike(post.id);
    });
    actions.appendChild(likeBtn);

    if (post.authorEmail === currentEmployee.email) {
      var del = el('button', 'post-delete', 'Delete');
      del.type = 'button';
      del.addEventListener('click', function () {
        deletePost(post.id);
      });
      actions.appendChild(del);
    }

    body.appendChild(actions);
    card.appendChild(body);
    return card;
  }

  function addPost() {
    var text = postInput.value.trim();
    if (!text) {
      return;
    }
    posts.push({
      id: uid(),
      authorEmail: currentEmployee.email,
      text: text,
      createdAt: Date.now(),
      likes: [],
    });
    saveList(POSTS_KEY, posts);
    postInput.value = '';
    renderFeed();
  }

  function toggleLike(id) {
    var post = findPost(id);
    if (!post) {
      return;
    }
    var idx = post.likes.indexOf(currentEmployee.email);
    if (idx >= 0) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push(currentEmployee.email);
      if (post.authorEmail !== currentEmployee.email) {
        addNotification(post.authorEmail, 'like', fullName(currentEmployee) + ' liked your post');
      }
    }
    saveList(POSTS_KEY, posts);
    renderFeed();
    updateBell();
  }

  function deletePost(id) {
    posts = posts.filter(function (p) {
      return p.id !== id;
    });
    saveList(POSTS_KEY, posts);
    renderFeed();
  }

  // ---------- messaging ----------
  function conversationPartners() {
    var list = [];
    for (var i = 0; i < employees.length; i += 1) {
      if (employees[i].email !== currentEmployee.email) {
        list.push(employees[i]);
      }
    }
    return list;
  }

  function messagesWith(emailAddr) {
    return messages
      .filter(function (m) {
        return (
          (m.from === currentEmployee.email && m.to === emailAddr) ||
          (m.from === emailAddr && m.to === currentEmployee.email)
        );
      })
      .sort(function (a, b) {
        return a.createdAt - b.createdAt;
      });
  }

  function lastMessageWith(emailAddr) {
    var conv = messagesWith(emailAddr);
    return conv.length ? conv[conv.length - 1] : null;
  }

  function unreadCountFrom(emailAddr) {
    var count = 0;
    for (var i = 0; i < messages.length; i += 1) {
      var m = messages[i];
      if (m.from === emailAddr && m.to === currentEmployee.email && !m.read) {
        count += 1;
      }
    }
    return count;
  }

  function renderMessages() {
    renderThreadList();
    if (activePartner) {
      renderThread(activePartner);
    } else {
      threadEmpty.className = 'thread-empty';
      threadActive.className = 'thread hidden';
    }
  }

  function renderThreadList() {
    threadList.innerHTML = '';
    var partners = conversationPartners();
    partners.sort(function (a, b) {
      var la = lastMessageWith(a.email);
      var lb = lastMessageWith(b.email);
      return (lb ? lb.createdAt : 0) - (la ? la.createdAt : 0);
    });

    for (var i = 0; i < partners.length; i += 1) {
      threadList.appendChild(buildThreadItem(partners[i]));
    }
  }

  function buildThreadItem(partner) {
    var item = el('button', 'thread-item' + (activePartner === partner.email ? ' active' : ''));
    item.type = 'button';
    item.appendChild(el('div', 'thread-item-avatar', initialsOf(partner)));

    var meta = el('div', 'thread-item-meta');
    var top = el('div', 'thread-item-top');
    top.appendChild(el('span', 'thread-item-name', fullName(partner)));
    var last = lastMessageWith(partner.email);
    if (last) {
      top.appendChild(el('span', 'thread-item-time', timeAgo(last.createdAt)));
    }
    meta.appendChild(top);
    var preview = last
      ? (last.from === currentEmployee.email ? 'You: ' : '') + last.text
      : 'Say hi 👋';
    meta.appendChild(el('div', 'thread-item-preview', preview));
    item.appendChild(meta);

    var unread = unreadCountFrom(partner.email);
    if (unread) {
      item.appendChild(el('span', 'thread-item-badge', String(unread)));
    }

    item.addEventListener('click', function () {
      selectPartner(partner.email);
    });
    return item;
  }

  function selectPartner(emailAddr) {
    activePartner = emailAddr;
    markConversationRead(emailAddr);
    renderThreadList();
    renderThread(emailAddr);
    updateMessagesBadge();
  }

  function markConversationRead(emailAddr) {
    var changed = false;
    for (var i = 0; i < messages.length; i += 1) {
      var m = messages[i];
      if (m.from === emailAddr && m.to === currentEmployee.email && !m.read) {
        m.read = true;
        changed = true;
      }
    }
    if (changed) {
      saveList(MESSAGES_KEY, messages);
    }
  }

  function renderThread(emailAddr) {
    threadEmpty.className = 'thread-empty hidden';
    threadActive.className = 'thread';

    var partner = findEmployeeByEmail(emailAddr);
    threadHeader.innerHTML = '';
    threadHeader.appendChild(el('div', 'thread-item-avatar', initialsOf(partner)));
    var info = el('div');
    info.appendChild(el('div', 'thread-name', fullName(partner)));
    info.appendChild(el('div', 'thread-dept', departmentOf(partner)));
    threadHeader.appendChild(info);

    threadMessages.innerHTML = '';
    var conv = messagesWith(emailAddr);
    for (var i = 0; i < conv.length; i += 1) {
      var mine = conv[i].from === currentEmployee.email;
      var bubble = el('div', 'bubble' + (mine ? ' mine' : ''));
      bubble.appendChild(el('span', 'bubble-text', conv[i].text));
      bubble.appendChild(el('span', 'bubble-time', timeAgo(conv[i].createdAt)));
      threadMessages.appendChild(bubble);
    }
    threadMessages.scrollTop = threadMessages.scrollHeight;
  }

  function sendMessage() {
    var text = messageInput.value.trim();
    if (!text || !activePartner) {
      return;
    }
    messages.push({
      id: uid(),
      from: currentEmployee.email,
      to: activePartner,
      text: text,
      createdAt: Date.now(),
      read: true,
    });
    saveList(MESSAGES_KEY, messages);
    addNotification(activePartner, 'message', fullName(currentEmployee) + ' sent you a message');
    messageInput.value = '';
    renderThreadList();
    renderThread(activePartner);
  }

  // ---------- directory ----------
  function renderDirectory(query) {
    directoryList.innerHTML = '';
    var q = (query || '').trim().toLowerCase();
    var matches = [];
    for (var i = 0; i < employees.length; i += 1) {
      var person = employees[i];
      var haystack = (fullName(person) + ' ' + person.email + ' ' + departmentOf(person)).toLowerCase();
      if (!q || haystack.indexOf(q) >= 0) {
        matches.push(person);
      }
    }
    matches.sort(function (a, b) {
      return fullName(a).localeCompare(fullName(b));
    });

    if (!matches.length) {
      directoryList.appendChild(el('p', 'empty-note', 'No colleagues match your search.'));
      return;
    }

    for (var j = 0; j < matches.length; j += 1) {
      directoryList.appendChild(buildDirectoryCard(matches[j]));
    }
  }

  function buildDirectoryCard(person) {
    var card = el('div', 'directory-card');
    card.appendChild(el('div', 'directory-avatar', initialsOf(person)));

    var info = el('div', 'directory-info');
    var nameRow = el('div', 'directory-name-row');
    nameRow.appendChild(el('span', 'directory-name', fullName(person)));
    if (person.email === currentEmployee.email) {
      nameRow.appendChild(el('span', 'directory-you', 'You'));
    }
    info.appendChild(nameRow);
    info.appendChild(el('div', 'directory-dept', departmentOf(person)));
    info.appendChild(el('div', 'directory-email', person.email));
    card.appendChild(info);

    if (person.email !== currentEmployee.email) {
      var msgBtn = el('button', 'directory-msg', 'Message');
      msgBtn.type = 'button';
      msgBtn.addEventListener('click', function () {
        activePartner = person.email;
        showSection('messages');
        selectPartner(person.email);
      });
      card.appendChild(msgBtn);
    }
    return card;
  }

  // ---------- notifications ----------
  function myNotifications() {
    return notifications
      .filter(function (n) {
        return n.userEmail === currentEmployee.email;
      })
      .sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });
  }

  function renderNotifications() {
    notificationsList.innerHTML = '';
    var mine = myNotifications();
    if (!mine.length) {
      notificationsList.appendChild(el('p', 'empty-note', 'No notifications yet.'));
      return;
    }
    for (var i = 0; i < mine.length; i += 1) {
      var n = mine[i];
      var item = el('div', 'notif' + (n.read ? '' : ' unread'));
      item.appendChild(el('span', 'notif-dot'));
      var body = el('div', 'notif-body');
      body.appendChild(el('div', 'notif-text', n.text));
      body.appendChild(el('div', 'notif-time', timeAgo(n.createdAt)));
      item.appendChild(body);
      notificationsList.appendChild(item);
    }
  }

  function addNotification(userEmail, type, text) {
    notifications.push({
      id: uid(),
      userEmail: userEmail,
      type: type,
      text: text,
      createdAt: Date.now(),
      read: false,
    });
    saveList(NOTIFS_KEY, notifications);
  }

  function unreadNotificationCount() {
    var count = 0;
    for (var i = 0; i < notifications.length; i += 1) {
      if (notifications[i].userEmail === currentEmployee.email && !notifications[i].read) {
        count += 1;
      }
    }
    return count;
  }

  function markAllNotificationsRead() {
    var changed = false;
    for (var i = 0; i < notifications.length; i += 1) {
      if (notifications[i].userEmail === currentEmployee.email && !notifications[i].read) {
        notifications[i].read = true;
        changed = true;
      }
    }
    if (changed) {
      saveList(NOTIFS_KEY, notifications);
    }
    updateBell();
  }

  function updateBell() {
    if (!currentEmployee) {
      return;
    }
    var count = unreadNotificationCount();
    bellBadge.textContent = String(count);
    bellBadge.className = count > 0 ? 'nav-badge' : 'nav-badge hidden';
  }

  function totalUnreadMessages() {
    var count = 0;
    for (var i = 0; i < messages.length; i += 1) {
      if (messages[i].to === currentEmployee.email && !messages[i].read) {
        count += 1;
      }
    }
    return count;
  }

  function updateMessagesBadge() {
    if (!currentEmployee) {
      return;
    }
    var count = totalUnreadMessages();
    messagesBadge.textContent = String(count);
    messagesBadge.className = count > 0 ? 'nav-badge' : 'nav-badge hidden';
  }

  // ---------- auth actions ----------
  function updatePassword() {
    if (!currentEmployee) {
      return;
    }

    if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
      setPasswordMessage('Please fill out all password fields.');
      return;
    }

    if (currentPassword.value !== currentEmployee.password) {
      setPasswordMessage('Current password is incorrect.');
      return;
    }

    if (newPassword.value.length < 3) {
      setPasswordMessage('New password is too short.');
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    if (newPassword.value === currentPassword.value) {
      setPasswordMessage('New password must be different from the current password.');
      return;
    }

    currentEmployee.password = newPassword.value;
    saveEmployees();
    passwordForm.reset();
    setPasswordMessage('Password updated successfully.', 'success');
  }

  function signup() {
    var cleanFirstName = firstName.value.trim();
    var cleanLastName = lastName.value.trim();
    var cleanEmail = email.value.trim().toLowerCase();

    if (!cleanFirstName || !cleanLastName || !cleanEmail || !password.value) {
      setMessage('Please fill out all fields.');
      return;
    }

    if (findEmployeeByEmail(cleanEmail)) {
      setMessage('An account with this email already exists.');
      return;
    }

    var employee = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      password: password.value,
      department: 'Team Member',
    };

    employees.push(employee);
    saveEmployees();
    currentEmployee = employee;
    saveSessionEmail(employee.email);
    clearForm();
    setMessage('');
    renderDashboard();
  }

  function login() {
    var cleanEmail = email.value.trim().toLowerCase();
    var employee = findEmployeeByEmail(cleanEmail);

    if (!employee || employee.password !== password.value) {
      setMessage('Invalid email or password.');
      return;
    }

    currentEmployee = employee;
    saveSessionEmail(employee.email);
    clearForm();
    setMessage('');
    renderDashboard();
  }

  // ---------- events ----------
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (mode === 'signup') {
      signup();
    } else {
      login();
    }
  });

  form.addEventListener('input', function () {
    setMessage('');
  });

  demoHint.addEventListener('click', function () {
    email.value = DEMO_EMPLOYEE.email;
    password.value = DEMO_EMPLOYEE.password;
    setMessage('');
    submitButton.focus();
  });

  switchModeButton.addEventListener('click', function () {
    mode = mode === 'signup' ? 'login' : 'signup';
    clearForm();
    setMessage('');
    renderAuth();
  });

  for (var nav = 0; nav < navItems.length; nav += 1) {
    navItems[nav].addEventListener('click', function () {
      showSection(this.getAttribute('data-section'));
    });
  }

  postForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addPost();
  });

  messageForm.addEventListener('submit', function (event) {
    event.preventDefault();
    sendMessage();
  });

  directorySearch.addEventListener('input', function () {
    renderDirectory(directorySearch.value);
  });

  markReadButton.addEventListener('click', function () {
    markAllNotificationsRead();
    renderNotifications();
  });

  showPasswordPageButton.addEventListener('click', function () {
    showSection('password');
    passwordForm.reset();
    setPasswordMessage('');
    currentPassword.focus();
  });

  backToProfileButton.addEventListener('click', function () {
    showSection('profile');
  });

  passwordForm.addEventListener('submit', function (event) {
    event.preventDefault();
    updatePassword();
  });

  passwordForm.addEventListener('input', function () {
    setPasswordMessage('');
  });

  logoutButton.addEventListener('click', function () {
    currentEmployee = null;
    activePartner = null;
    saveSessionEmail(null);
    mode = 'login';
    clearForm();
    renderDashboard();
    setMessage('You have been logged out.', 'success');
  });

  var toggleButtons = document.querySelectorAll('.toggle-password');
  for (var t = 0; t < toggleButtons.length; t += 1) {
    toggleButtons[t].addEventListener('click', function (event) {
      var button = event.currentTarget;
      var input = document.getElementById(button.getAttribute('data-target'));
      if (!input) {
        return;
      }
      var isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      button.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
      button.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  }

  renderDashboard();
})();
