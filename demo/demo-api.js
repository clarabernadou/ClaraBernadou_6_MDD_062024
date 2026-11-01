/*
 * Mode démo de MDD (Monde de Dév).
 * L’API Spring Boot du projet (http://localhost:8080/api) est simulée dans le
 * navigateur : comptes, abonnements, articles et commentaires restent dans le
 * localStorage du visiteur. Toutes les données de départ sont fictives.
 */
(function () {
  'use strict';

  var API_URL = /^https?:\/\/localhost:8080\/api(\/.*)?$/;
  var STORE_KEY = 'mdd_demo_store_v1';
  var BANNER_KEY = 'mdd_demo_banner';
  var ROOT = new URL('./', document.currentScript.src).href;
  var RESPONSE_DELAY = 150;
  var DEMO = { username: 'demo', email: 'demo@mdd.fr', password: 'Demo1234' };
  var STATUS_TEXT = { 200: 'OK', 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found', 409: 'Conflict' };

  var nativeOpen = XMLHttpRequest.prototype.open;
  var nativeSend = XMLHttpRequest.prototype.send;
  var nativeSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  var store = null;

  /* ---------- Outils ---------- */

  function readStore() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveStore() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (error) {
      /* Stockage plein ou bloqué : les données restent en mémoire pour la session. */
    }
  }

  function sha256(text) {
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), function (byte) {
          return ('0' + byte.toString(16)).slice(-2);
        }).join('');
      });
    }
    return Promise.resolve('plain:' + text);
  }

  function base64url(text) {
    return window.btoa(unescape(encodeURIComponent(text))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function randomSignature() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var out = '';
    for (var i = 0; i < 43; i += 1) {
      out += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return out;
  }

  function makeToken(user) {
    var now = Math.floor(Date.now() / 1000);
    var header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    var payload = base64url(JSON.stringify({ sub: user.email, iat: now, exp: now + 24 * 3600 }));
    return header + '.' + payload + '.' + randomSignature();
  }

  function today() {
    var d = new Date();
    return d.getFullYear() + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2);
  }

  function reply(status, payload) {
    return { status: status, payload: payload };
  }

  function userFromRequest(headers) {
    var auth = headers.Authorization || headers.authorization || '';
    var match = /^Bearer [^.]+\.([^.]+)\.[^.]+$/.exec(auth);
    if (!match) {
      return null;
    }
    try {
      var payload = JSON.parse(decodeURIComponent(escape(window.atob(match[1].replace(/-/g, '+').replace(/_/g, '/')))));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return null;
      }
      return store.users.filter(function (user) { return user.email === payload.sub; })[0] || null;
    } catch (error) {
      return null;
    }
  }

  /* ---------- Données de départ ---------- */

  function seedStore(passwordHash) {
    var themes = [
      { id: 1, title: 'JavaScript', description: 'Le langage du web : syntaxe moderne, asynchronisme, écosystème et bonnes pratiques.', created_at: '2024/05/02' },
      { id: 2, title: 'Java', description: 'Le langage des applications d’entreprise : plateforme, bibliothèques et outils.', created_at: '2024/05/02' },
      { id: 3, title: 'Python', description: 'Un langage polyvalent pour les scripts, la donnée et l’automatisation.', created_at: '2024/05/03' },
      { id: 4, title: 'Angular', description: 'Le framework de Google pour construire des applications web structurées.', created_at: '2024/05/03' },
      { id: 5, title: 'Spring Boot', description: 'Le socle Java pour créer rapidement des API REST robustes et sécurisées.', created_at: '2024/05/04' },
      { id: 6, title: 'DevOps', description: 'Intégration continue, conteneurs et déploiement : livrer plus vite et plus sûrement.', created_at: '2024/05/04' }
    ];
    var users = [
      { id: 1, username: 'demo', email: 'demo@mdd.fr', passwordHash: passwordHash, subscriptions: [1, 4] },
      { id: 2, username: 'camille', email: 'camille@mdd.fr', passwordHash: passwordHash, subscriptions: [2, 5] },
      { id: 3, username: 'julien', email: 'julien@mdd.fr', passwordHash: passwordHash, subscriptions: [6] }
    ];
    var articles = [
      { id: 1, theme_id: 1, title: 'Comprendre les closures en JavaScript', content: 'Une closure permet à une fonction de garder l’accès aux variables de son contexte de création. C’est la base de nombreux motifs : compteurs, modules, fonctions de rappel. Voici comment les repérer et éviter les fuites de mémoire.', owner_id: 2, created_at: '2024/06/03', updated_at: '2024/06/03' },
      { id: 2, theme_id: 1, title: 'Promesses et async/await : bien enchaîner ses appels', content: 'Les promesses simplifient l’asynchronisme, et async/await rend le code presque linéaire. Attention toutefois aux appels qui pourraient tourner en parallèle et que l’on attend un par un sans raison.', owner_id: 3, created_at: '2024/06/10', updated_at: '2024/06/10' },
      { id: 3, theme_id: 2, title: 'Les Streams Java sans se perdre', content: 'Les Streams décrivent un traitement de données comme une chaîne d’opérations. Utilisés avec mesure, ils rendent le code plus lisible ; abusés, ils le rendent opaque. Quelques règles simples pour choisir.', owner_id: 2, created_at: '2024/06/14', updated_at: '2024/06/14' },
      { id: 4, theme_id: 4, title: 'Les formulaires réactifs dans Angular', content: 'Les formulaires réactifs placent la logique dans la classe du composant : validation, valeurs dérivées, tests. Ils demandent un peu plus de code au départ, mais le gain en maintenance est net sur les formulaires complexes.', owner_id: 1, created_at: '2024/06/21', updated_at: '2024/06/21' },
      { id: 5, theme_id: 4, title: 'Alléger la détection de changements', content: 'La détection de changements d’Angular parcourt l’arbre des composants à chaque événement. La stratégie OnPush limite ce parcours aux composants dont les entrées ont réellement changé.', owner_id: 3, created_at: '2024/07/01', updated_at: '2024/07/01' },
      { id: 6, theme_id: 5, title: 'Sécuriser une API Spring Boot avec JWT', content: 'Un jeton signé permet d’identifier l’utilisateur à chaque requête sans session côté serveur. On voit ici la chaîne de filtres, la génération du jeton et la vérification de sa durée de validité.', owner_id: 2, created_at: '2024/07/08', updated_at: '2024/07/08' },
      { id: 7, theme_id: 6, title: 'Premiers pas avec Docker et l’intégration continue', content: 'Empaqueter une application dans un conteneur garantit qu’elle tourne partout de la même façon. Associé à une chaîne d’intégration continue, il permet de tester et de livrer à chaque modification.', owner_id: 3, created_at: '2024/07/15', updated_at: '2024/07/15' },
      { id: 8, theme_id: 3, title: 'Automatiser ses tâches avec Python', content: 'Quelques lignes de Python suffisent pour renommer des fichiers, interroger une API ou générer un rapport. Un bon réflexe : commencer par un script simple, puis le découper en fonctions réutilisables.', owner_id: 1, created_at: '2024/07/22', updated_at: '2024/07/22' }
    ];
    var comments = [
      { id: 1, article_id: 1, user_id: 3, username: 'julien', content: 'Très clair, merci : l’exemple du compteur m’a enfin fait comprendre le principe.' },
      { id: 2, article_id: 1, user_id: 1, username: 'demo', content: 'Pensez aussi à mentionner les boucles et les variables déclarées avec var.' },
      { id: 3, article_id: 4, user_id: 2, username: 'camille', content: 'Les formulaires réactifs m’ont sauvé sur un écran de plus de vingt champs.' },
      { id: 4, article_id: 6, user_id: 1, username: 'demo', content: 'Est-ce que la durée de validité du jeton est configurable ?' },
      { id: 5, article_id: 7, user_id: 2, username: 'camille', content: 'Bon point sur les conteneurs, un article sur la gestion des secrets serait un excellent complément.' }
    ];
    return { users: users, themes: themes, articles: articles, comments: comments };
  }

  function ensureStore() {
    if (store) {
      return Promise.resolve(store);
    }
    store = readStore();
    if (store) {
      return Promise.resolve(store);
    }
    return sha256(DEMO.password).then(function (hash) {
      store = seedStore(hash);
      saveStore();
      return store;
    });
  }

  /* ---------- Routes de l’API ---------- */

  function themeObjects(ids) {
    return store.themes.filter(function (theme) { return ids.indexOf(theme.id) >= 0; });
  }

  function publicUser(user) {
    return { id: user.id, username: user.username, email: user.email, subscriptions: themeObjects(user.subscriptions) };
  }

  function parse(body) {
    try { return JSON.parse(body); } catch (error) { return {}; }
  }

  function login(data) {
    var identifier = String(data.emailOrUsername || '').trim().toLowerCase();
    var user = store.users.filter(function (item) { return item.email.toLowerCase() === identifier || item.username.toLowerCase() === identifier; })[0];
    if (!user) {
      return Promise.resolve(reply(401, { message: 'Invalid credentials!' }));
    }
    return sha256(String(data.password || '')).then(function (hash) {
      return hash === user.passwordHash ? reply(200, { token: makeToken(user) }) : reply(401, { message: 'Invalid credentials!' });
    });
  }

  function register(data) {
    var email = String(data.email || '').trim();
    var username = String(data.username || '').trim();
    if (!email || !username || !data.password || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return Promise.resolve(reply(400, { message: 'Registration failed' }));
    }
    var exists = store.users.some(function (item) { return item.email.toLowerCase() === email.toLowerCase() || item.username.toLowerCase() === username.toLowerCase(); });
    if (exists) {
      return Promise.resolve(reply(409, { message: 'User already exists!' }));
    }
    return sha256(String(data.password)).then(function (hash) {
      var user = { id: store.users.reduce(function (max, item) { return Math.max(max, item.id); }, 0) + 1, username: username, email: email, passwordHash: hash, subscriptions: [] };
      store.users.push(user);
      saveStore();
      return reply(200, { token: makeToken(user) });
    });
  }

  function updateMe(user, data) {
    var email = String(data.email || '').trim();
    var username = String(data.username || '').trim();
    if (!email || !username) {
      return reply(400, { message: 'Email and username are mandatory' });
    }
    var clash = store.users.some(function (item) {
      return item.id !== user.id && (item.email.toLowerCase() === email.toLowerCase() || item.username.toLowerCase() === username.toLowerCase());
    });
    if (clash) {
      return reply(409, { message: 'User already exists!' });
    }
    user.email = email;
    user.username = username;
    store.comments.forEach(function (comment) { if (comment.user_id === user.id) { comment.username = username; } });
    saveStore();
    var result = publicUser(user);
    result.token = makeToken(user);
    return reply(200, result);
  }

  function handleAuthenticated(method, parts, body, user) {
    var data = parse(body);
    if (parts[1] === 'user') {
      if (parts[2] === 'me' && method === 'GET') {
        return reply(200, publicUser(user));
      }
      if (parts[2] === 'me' && method === 'PUT') {
        return updateMe(user, data);
      }
      var found = store.users.filter(function (item) { return String(item.id) === parts[2]; })[0];
      return found ? reply(200, publicUser(found)) : reply(404, { message: 'User not found' });
    }
    if (parts[1] === 'article') {
      if (!parts[2] && method === 'GET') {
        return store.articles.length ? reply(200, store.articles) : reply(404, { message: 'No articles found' });
      }
      if (!parts[2] && method === 'POST') {
        if (!data.title || !data.content || !data.theme_id) {
          return reply(400, { message: 'Title, content and theme are mandatory' });
        }
        var article = { id: store.articles.reduce(function (max, item) { return Math.max(max, item.id); }, 0) + 1, theme_id: Number(data.theme_id), title: data.title, content: data.content, owner_id: user.id, created_at: today(), updated_at: today() };
        store.articles.push(article);
        saveStore();
        return reply(200, { message: 'Article created!' });
      }
      var target = store.articles.filter(function (item) { return String(item.id) === parts[2]; })[0];
      if (parts[3] === 'comment') {
        if (!target) {
          return reply(404, { message: 'Article not found' });
        }
        if (method === 'GET') {
          var list = store.comments.filter(function (comment) { return comment.article_id === target.id; });
          return list.length ? reply(200, list) : reply(404, { message: 'No comments found' });
        }
        if (method === 'POST') {
          if (!data.content) {
            return reply(400, { message: 'Content is mandatory' });
          }
          store.comments.push({ id: store.comments.reduce(function (max, item) { return Math.max(max, item.id); }, 0) + 1, article_id: target.id, user_id: user.id, username: user.username, content: data.content });
          saveStore();
          return reply(200, { message: 'Comment created!' });
        }
      }
      return target ? reply(200, target) : reply(404, { message: 'Article not found' });
    }
    if (parts[1] === 'theme') {
      if (!parts[2] && method === 'GET') {
        return reply(200, store.themes);
      }
      if (parts[2] === 'subscribe' && method === 'POST') {
        var themeToAdd = Number(parts[3]);
        if (!store.themes.some(function (theme) { return theme.id === themeToAdd; })) {
          return reply(404, { message: 'Theme not found' });
        }
        if (user.subscriptions.indexOf(themeToAdd) < 0) {
          user.subscriptions.push(themeToAdd);
          saveStore();
        }
        return reply(200, 'Subscribed to theme!');
      }
      if (parts[2] === 'unsubscribe' && method === 'DELETE') {
        var themeToRemove = Number(parts[3]);
        user.subscriptions = user.subscriptions.filter(function (id) { return id !== themeToRemove; });
        saveStore();
        return reply(200, 'Unsubscribed from theme!');
      }
      var theme = store.themes.filter(function (item) { return String(item.id) === parts[2]; })[0];
      return theme ? reply(200, theme) : reply(404, { message: 'Theme not found' });
    }
    return reply(404, { message: 'Not found' });
  }

  function route(method, path, body, headers) {
    var parts = path.split('?')[0].replace(/^\/+|\/+$/g, '').split('/');
    return ensureStore().then(function () {
      if (method === 'POST' && parts[0] === 'login') {
        return login(parse(body));
      }
      if (method === 'POST' && parts[0] === 'register') {
        return register(parse(body));
      }
      if (parts[0] !== 'auth') {
        return reply(404, { message: 'Not found' });
      }
      var user = userFromRequest(headers);
      if (!user) {
        return reply(401, { message: 'User is not authenticated' });
      }
      return handleAuthenticated(method, parts, body, user);
    });
  }

  /* ---------- Interception de XMLHttpRequest (Angular HttpClient) ---------- */

  function finish(xhr, url, result) {
    var text = JSON.stringify(result.payload);
    var fields = {
      readyState: 4,
      status: result.status,
      statusText: STATUS_TEXT[result.status] || '',
      responseURL: url,
      responseText: text,
      response: xhr.responseType === 'json' ? JSON.parse(text) : text
    };
    Object.keys(fields).forEach(function (key) {
      Object.defineProperty(xhr, key, { value: fields[key], configurable: true });
    });
    xhr.getAllResponseHeaders = function () { return 'content-type: application/json\r\n'; };
    xhr.getResponseHeader = function (name) { return /^content-type$/i.test(name) ? 'application/json' : null; };
    xhr.dispatchEvent(new Event('readystatechange'));
    xhr.dispatchEvent(new ProgressEvent('load'));
    xhr.dispatchEvent(new ProgressEvent('loadend'));
  }

  XMLHttpRequest.prototype.open = function (method, url) {
    var match = API_URL.exec(String(url));
    this.__demo = match ? { method: String(method).toUpperCase(), url: String(url), path: match[1] || '/', headers: {} } : null;
    if (this.__demo) {
      return nativeOpen.call(this, method, window.location.href);
    }
    return nativeOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
    if (this.__demo) {
      this.__demo.headers[name] = value;
    }
    return nativeSetRequestHeader.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    var demo = this.__demo;
    if (!demo) {
      return nativeSend.apply(this, arguments);
    }
    var xhr = this;
    route(demo.method, demo.path, body, demo.headers)
      .catch(function () { return reply(500, { message: 'Erreur de la démo' }); })
      .then(function (result) {
        window.setTimeout(function () { finish(xhr, demo.url, result); }, RESPONSE_DELAY);
      });
  };

  /* ---------- Bandeau d’information ---------- */

  function showBanner() {
    try {
      if (window.sessionStorage.getItem(BANNER_KEY) === 'closed') {
        return;
      }
    } catch (error) { /* sessionStorage indisponible */ }
    var banner = document.createElement('div');
    banner.setAttribute('role', 'note');
    banner.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;max-width:340px;padding:10px 12px;' +
      'border-radius:10px;background:#1f2933;color:#fff;font:13px/1.45 Arial,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.35)';
    banner.innerHTML = '<strong>Version de démonstration</strong> : l’API est simulée dans votre navigateur ' +
      '(les données restent sur votre appareil). Toutes les données sont fictives.<br>' +
      'Compte test : <code style="color:#b9a7ff">' + DEMO.username + '</code> ou <code style="color:#b9a7ff">' + DEMO.email + '</code> / <code style="color:#b9a7ff">' + DEMO.password + '</code><br>' +
      '<a href="#" data-reset style="color:#b9a7ff">Réinitialiser la démo</a> · <a href="#" data-close style="color:#b9a7ff">Fermer</a>';
    banner.querySelector('[data-close]').addEventListener('click', function (event) {
      event.preventDefault();
      try { window.sessionStorage.setItem(BANNER_KEY, 'closed'); } catch (error) { /* ignoré */ }
      banner.remove();
    });
    banner.querySelector('[data-reset]').addEventListener('click', function (event) {
      event.preventDefault();
      try { window.localStorage.removeItem(STORE_KEY); } catch (error) { /* ignoré */ }
      ['auth_token', 'auth_token_hash'].forEach(function (name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      });
      window.location.href = ROOT;
    });
    document.body.appendChild(banner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }
})();
